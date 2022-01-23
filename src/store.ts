import produce, { enableAllPlugins } from "immer";
import { range } from "itertools";
import create from "zustand";
import { createSeedingRounds } from "./algorithms";
import Participant from "./types/Participant";
import Round from "./types/Round";
import Setup from "./types/Setup";
import Tournament from "./types/Tournament";

enableAllPlugins();

export interface Store {
  tournament: Tournament | null;
  setups: Setup[];
  rounds: Map<number, Round>;
  participants: Map<number, Participant>;

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

  createTournament: (tournament) => {
    set(
      produce<Store>((draft) => {
        draft.tournament = tournament;
        draft.participants = new Map();
        for (const participant of tournament.participants) {
          draft.participants.set(participant.id, participant);
        }
      })
    );
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
  },

  updateRound: (round) => {
    set(
      produce<Store>((draft) => {
        draft.rounds.set(round.id, round);
      })
    );
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
  },

  setRaceResult(roundId, raceId, playerId, place) {
    set(
      produce<Store>((draft) => {
        const round = draft.rounds.get(roundId)!;
        console.log("hello");
        if (!round.result) {
          round.result = {
            raceResults: [],
            roundStandings: [],
          };
        }
        console.log("helloo")
        if (!round.result.raceResults[raceId]) {
          round.result.raceResults[raceId] = new Map();
        }
        console.log("hellooo")
        round.result.raceResults[raceId].set(playerId, {
          participant: playerId,
          rank: place,
        });
      })
    );
  },
}));

(window as any).store = useStore;

export const getTournament = (store: Store) => store.tournament;
export const getParticipantScore = (id: number) => (store: Store) =>
  store.participants.get(id)!.score;
export const getRank =
  (roundId: number, raceId: number, playerId: number) => (store: Store) =>
    store.rounds.get(roundId)?.result?.raceResults[raceId].get(playerId)?.rank!;

const testParticipants = [
  "Ally",
  "Ben",
  "Cathy",
  "Daniel",
  "Ethan",
  "Fred",
  "Gabe",
  "Hugh",
  "Iris",
  "Jacob",
  "Kathy",
  "Leo",
  "Mia",
];

useStore.getState().createTournament({
  name: "Tournament 1",
  participants: testParticipants.map((name, i) => ({ name, id: i, score: 0 })),
  setupsCount: 3,
  startTime: new Date(),
});

useStore.getState().seed();
