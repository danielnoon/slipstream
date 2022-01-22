import produce from "immer";
import create from "zustand";
import { createSeedingRounds } from "./algorithms";
import Round from "./types/Round";
import Setup from "./types/Setup";
import Tournament from "./types/Tournament";

export interface Store {
  tournament: Tournament | null;
  setups: Setup[];

  createTournament: (tournament: Tournament) => void;
  seed: () => void;
}

export const useStore = create<Store>((set) => ({
  tournament: null,
  setups: [],

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
