import produce from "immer";
import create from "zustand";
import { createSeedingRounds } from "./algorithms";
import Round from "./types/Round";
import Setup from "./types/Setup";
import Tournament from "./types/Tournament";

export interface Store {
  tournament: Tournament | null;
  setups: Setup[];
  rounds: Map<number, Round>;

  createTournament: (tournament: Tournament) => void;
  seed: () => void;
  updateRound: (round: Round) => void;
}

export const useStore = create<Store>((set) => ({
  tournament: null,
  setups: [],
  rounds: new Map(),

  createTournament: (tournament: Tournament) => {
    set(
      produce<Store>((draft) => {
        draft.tournament = tournament;
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

  updateRound: (round: Round) => {
    set(
      produce<Store>((draft) => {
        draft.rounds.set(round.id, round);
      })
    );
  },
}));

(window as any).store = useStore;

export const getTournament = (store: Store) => store.tournament;

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
];

useStore.getState().createTournament({
  name: "Tournament 1",
  participants: testParticipants.map((name, i) => ({ name, id: i, score: 0 })),
  setupsCount: 3,
  startTime: new Date(),
});

useStore.getState().seed();
