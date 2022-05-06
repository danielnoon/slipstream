import produce, { enableAllPlugins } from "immer";
import { WritableDraft } from "immer/dist/internal";
import create from "zustand";
import { createRounds, participantSorter } from "./algorithms";
import { replacer, reviver } from "./persistence";
import Participant from "./types/Participant";
import Round from "./types/Round";
import SeedGenerationAlgorithm from "./types/SeedGenerationAlgorithm.enum";
import Setup from "./types/Setup";
import Tournament from "./types/Tournament";

enableAllPlugins();

/**
 * A function that handles missing tournament meta data, such as a missing participants per race, or missing id
 * @param draft - The draft object to be modified
 * 
 * @author Liam Seper
 */
const legacyTournamentMetaDataHandler = (draft: WritableDraft<Store>): void => {
  if(draft.tournament){
    if(!draft.tournament.id) {
      draft.tournament.id = draft.tournamentList.findIndex(t => t.name === draft.tournament!.name);
    }
    if(!draft.tournament.partsPerRound){
      // back when 4 was the default
      draft.tournament.partsPerRound = 4;
    }
    if(![...draft.tournament.currentStandings]) {
      const currParticipants = [...draft.participants.values()];
      currParticipants.sort(participantSorter);
      const currStandings = currParticipants.map(p => ({participant: p, change: 0}));
      draft.tournament.currentStandings = currStandings;
    }
  }
}

/**
 * A function who's purpose is to update legacy tournaments with new, required parameters
 * @param draft - the draft object to be modified
 * 
 * @author Liam Seper
 */
function legacyHandler(draft : WritableDraft<Store>) : void {
  legacyTournamentMetaDataHandler(draft);
}

export interface Store {
  tournament: Tournament | null;
  setups: Setup[];
  rounds: Map<number, Round>;
  participants: Map<number, Participant>;
  idCounter: number;
  lastId: number;
  tournamentList: { id: number; name: string }[];
  currentId: number;

  createTournament: (tournament: Tournament) => void;
  // TODO: should also delete tournament from local storage, but for now just deleting from home list should be ok
  deleteTournament: (id: number) => void;
  seed: (seeding_round: number) => void;
  submitRound: (id: number) => void;
  updateRound: (round: Round) => void;
  deleteRound: (id: number) => void;
  setParticipantScore: (id: number, score: number) => void;
  deleteParticipant: (id: number) => void;
  setRaceResult: (
    round: number,
    race: number,
    player: number,
    place: number
  ) => void;
}

export const useStore = create<Store>((set) => ({
  tournament: null,
  setups: [],
  rounds: new Map(),
  participants: new Map(),
  currentStandings: [],
  leaderboard: [],
  idCounter: 0,
  lastId: 0,
  currentId: 0,
  tournamentList: [],

  createTournament: (tournament) => {
    set(
      produce<Store>((draft) => {
        draft.tournament = tournament;
        draft.participants = new Map();
        draft.idCounter += 1;
        draft.lastId = draft.idCounter;
        draft.tournament.currentStandings = tournament.participants.map(p => ({participant: p, change: 0}));
        draft.currentId = draft.idCounter;
        draft.tournamentList.push({
          id: draft.idCounter,
          name: tournament.name,
        });

        for (const participant of tournament.participants) {
          draft.participants.set(participant.id, participant);
        }
      })
    );

    queueMicrotask(save);
    queueMicrotask(saveAppData);
  },

  deleteTournament: (id: number) => {
    set(
      produce<Store>((draft) => {
        // delete from tournamentList
        const tournamentIndex = draft.tournamentList.findIndex(t => t.id === id);
        draft.tournamentList.splice(tournamentIndex, 1);
      })
    )
  },

  seed: (seeding_round: number) => {
    set(
      produce<Store>((draft) => {
        // handle legacy tournaments
        legacyHandler(draft);
        // seeding
        draft.setups = createRounds(draft.tournament!, [...draft.participants!.values()], seeding_round);
        // leaderboard generation
        // record previous rank of contestants
        const sortedParticipants = [...draft.participants!.values()].sort(participantSorter);
        if(draft.tournament!.currRound > 0) {
          // calculate the change in rank
          const newStandings = [];
          for(let newRank = 0; newRank < sortedParticipants.length; newRank++){
            const oldRank = draft.tournament!.currentStandings.findIndex(e => e.participant.id === sortedParticipants[newRank].id);
            const change = oldRank - newRank;
            newStandings.push({participant: sortedParticipants[newRank], change: change});
          }
          draft.tournament!.currentStandings = newStandings;
        } else {
          draft.tournament!.currentStandings = sortedParticipants.map(p => ({participant: p, change: 0}));
        }
        // handle legacy tournaments
        if(draft.tournament){
          if(draft.tournament.currRound === 0 || draft.tournament.currRound){
            draft.tournament.currRound += 1;
          } else {
            draft.tournament.currRound = 0;
          }
        }
        draft.rounds = new Map();
        for (const setup of draft.setups) {
          for (const round of setup.rounds) {
            draft.rounds.set(round.id, round);
          }
        }
      })
    );

    queueMicrotask(save);
  },

  updateRound: (round) => {
    set(
      produce<Store>((draft) => {
        draft.rounds.set(round.id, round);
      })
    );

    queueMicrotask(save);
  },

  submitRound: (id) => {
    set(
      produce<Store>((draft) => {
        const round = draft.rounds.get(id);
        if (round) {
          round.submitted = true;
        }
      })
    )
  },

  deleteRound: (id) => {
    set(
      produce<Store>((draft) => {
        const result = draft.rounds.delete(id);
        const setupWithRound = draft.setups.find(s => s.rounds.some(r => r.id === id))!;
        setupWithRound.rounds = setupWithRound.rounds.filter(r => r.id !== id);
      })
    )
  },

  setParticipantScore(id, score) {
    set(
      produce<Store>((draft) => {
        draft.participants.set(id, {
          ...draft.participants.get(id)!,
          score,
        });
      })
    );

    queueMicrotask(save);
  },

  deleteParticipant(id) {
    set(
      produce<Store>((draft) => {
        // have to remove the partipant from multiple things within the tournament
        // remove participant from participants map
        draft.participants.delete(id);
        // remove participant from tournament.participants array within tournament
        draft.tournament?.participants.splice(draft.tournament.participants.findIndex(p => p.id === id), 1);
        // remove from rounds, remove RoundResult from each round that has participant
        let roundId = 0;
        for(const [rId, round] of draft.rounds) {
          if(round.participants.some(p => p.id === id)){
            roundId = rId;
            const round = draft.rounds.get(rId)!;
            const pToRemoveIndex = round.participants.findIndex(p => p.id === id)!;
            round.participants.splice(pToRemoveIndex, 1);
            // remove all the raceresults of this participant
            if(round.result) {
              const raceResults = round.result.raceResults;
              for(const map of raceResults){
                for(const [pId, raceResult] of map){
                  // update the ranks of the other participants
                  if(pId === id){
                    const rank = raceResult.rank;
                    [...map.values()].forEach(rr => rr.rank -= rr.rank > rank ? 1 : 0);
                    map.delete(pId);
                    break;
                  }
                }
              }
            }
            break;
          }
        }
        // remove from setups
        for(const setup of draft.setups){
          const roundToChangeIndex = setup.rounds.findIndex(r => r.id === roundId);
          if(roundToChangeIndex > 0){
            const participants = setup.rounds[roundToChangeIndex].participants;
            const pToRemoveIndex = participants.findIndex(p => p.id === id);
            setup.rounds[roundToChangeIndex].participants.splice(pToRemoveIndex, 1);
            break;
          }
        }
      })
    )
    queueMicrotask(save);
  },

  setRaceResult(roundId, raceId, playerId, place) {
    set(
      produce<Store>((draft) => {
        const round = draft.rounds.get(roundId)!;
        if (!round.result) {
          round.result = {
            raceResults: [],
            roundStandings: [],
          };
        }
        if (!round.result.raceResults[raceId]) {
          round.result.raceResults[raceId] = new Map();
        }
        round.result.raceResults[raceId].set(playerId, {
          participant: playerId,
          rank: place,
        });
      })
    );

    queueMicrotask(save);
  },
}));

export const getTournament = (store: Store) => store.tournament;
export const getParticipantScore = (id: number) => (store: Store) =>
  store.participants.get(id)!.score;
export const getRank =
  (roundId: number, raceId: number, playerId: number) => (store: Store) =>
    store.rounds.get(roundId)?.result?.raceResults[raceId].get(playerId)?.rank!;

export const getRound = (roundId: number) => (store: Store) => store.rounds.get(roundId);
// const round12 = select(getRound(12));

export const getState = () => useStore.getState();
export const select = <T>(selector: (store: Store) => T) => selector(getState());

export function save() {
  const { tournament, participants, rounds, setups, currentId } = getState();

  const json = JSON.stringify(
    { tournament, participants, rounds, setups },
    replacer
  );

  localStorage.setItem(`tournament-${currentId}`, json);
}

export function saveAppData() {
  const { tournamentList, idCounter, lastId } = getState();
  const json = JSON.stringify(
    { tournaments: tournamentList, idCounter, lastId },
    replacer
  );
  localStorage.setItem("appData", json);
}

export function load(tournamentId: number) {
  const json = localStorage.getItem(`tournament-${tournamentId}`);
  if (json) {
    const { tournament, participants, rounds, setups } = JSON.parse(
      json,
      reviver
    ) as Store;
    useStore.setState({
      ...getState(),
      tournament,
      participants,
      rounds,
      setups,
      currentId: tournamentId,
      lastId: tournamentId
    });
    queueMicrotask(saveAppData);
  }
}

if (typeof window === "object") {
  (window as any).getState = () => useStore.getState();
  (window as any).load = load;
}

interface AppData {
  tournaments: { id: number; name: string }[];
  idCounter: number;
  lastId: number;
}

// for making this file work with tests
if (typeof window === 'object' && window.localStorage) {
  const appData = localStorage.getItem("appData");
  
  if (appData) {
    const { tournaments, idCounter, lastId } = JSON.parse(appData) as AppData;
  
    if (lastId > -1) {
      load(lastId);
    }
  
    useStore.setState({
      ...getState(),
      tournamentList: tournaments,
      idCounter,
      lastId,
      currentId: lastId > -1 ? lastId : -1,
    });
  }
}
