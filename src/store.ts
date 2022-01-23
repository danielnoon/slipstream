import produce, { enableAllPlugins } from "immer";
import { range } from "itertools";
import create from "zustand";
import { createSeedingRounds } from "./algorithms";
import { replacer, reviver } from "./persistence";
import Participant from "./types/Participant";
import { Platform } from "./types/Platform";
import Round from "./types/Round";
import Setup from "./types/Setup";
import Tournament from "./types/Tournament";

enableAllPlugins();

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
  seed: () => void;
  updateRound: (round: Round) => void;
  setParticipantScore: (id: number, score: number) => void;
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

  seed: () => {
    set(
      produce<Store>((draft) => {
        draft.setups = createSeedingRounds(draft.tournament!);
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

export const getState = () => useStore.getState();

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
    });
  }
}

if (typeof window === "object") {
  (window as any).store = useStore;
  (window as any).load = load;
}

interface AppData {
  tournaments: { id: number; name: string }[];
  idCounter: number;
  lastId: number;
}

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
