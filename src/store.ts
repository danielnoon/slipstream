import produce from "immer";
import create from "zustand";
import Tournament from "./types/Tournament";

export interface Store {
  tournament: Tournament | null;
  createTournament: (tournament: Tournament) => void;
}

export const useStore = create<Store>((set) => ({
  tournament: null,

  createTournament: (tournament: Tournament) => {
    set(
      produce((draft) => {
        draft.tournament = tournament;
      })
    );
  },
}));

export const getTournament = (store: Store) => store.tournament;

useStore.getState().createTournament({
  name: "Tournament 1",
  participants: [
    {
      name: "Player 1",
      score: 0,
      id: 0,
    },
    {
      name: "Player 2",
      score: 0,
      id: 1,
    },
  ],
  setupsCount: 2,
  startTime: new Date(),
});
