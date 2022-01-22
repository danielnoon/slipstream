import { createSeedingRounds, handleLeftovers } from '../src/algorithms';
import Participant from '../src/types/Participant';
import Round from '../src/types/Round';
import Tournament from '../src/types/Tournament';
import Setup from '../src/types/Setup';


test("Test handleLeftovers (no leftovers)", () => {
    const numbers = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    const partition = handleLeftovers(numbers, 4);
    console.log(partition);
    // should be 4 rounds
    expect(partition).toHaveLength(4);
    // each round should have 4 entries
    expect(partition[0]).toHaveLength(4);
    expect(partition[1]).toHaveLength(4);
    expect(partition[2]).toHaveLength(4);
    expect(partition[3]).toHaveLength(4);
});

test("Test handleLeftovers (leftover round of 3)", () => {
    const numbers = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15]];
    const partition = handleLeftovers(numbers, 4);
    console.log(partition);
    // should be 4 rounds
    expect(partition).toHaveLength(4);
    // each round should have 4 entries
    expect(partition[0]).toHaveLength(4);
    expect(partition[1]).toHaveLength(4);
    expect(partition[2]).toHaveLength(4);
    // last round should have 3 entries
    expect(partition[3]).toHaveLength(3);
});

test("Test handleLeftovers (leftover round of 2)", () => {
    const numbers = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14]];
    const partition = handleLeftovers(numbers, 4);
    console.log(partition);
    // should be 4 rounds
    expect(partition).toHaveLength(4);
    // each round should have 4 entries
    expect(partition[0]).toHaveLength(4);
    expect(partition[1]).toHaveLength(4);
    // last two rounds should have 3 entries
    expect(partition[2]).toHaveLength(3);
    expect(partition[3]).toHaveLength(3);
});

test("Test handleLeftovers (leftover round of 1)", () => {
    const numbers = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13]];
    const partition = handleLeftovers(numbers, 4);
    console.log(partition);
    // should be 4 rounds
    expect(partition).toHaveLength(4);
    // each round should have 4 entries
    expect(partition[0]).toHaveLength(4);
    // last two rounds should have 3 entries
    expect(partition[1]).toHaveLength(3);
    expect(partition[2]).toHaveLength(3);
    expect(partition[3]).toHaveLength(3);
});

const participants1: Participant[] = [
    { 
        id: 0,
        name: "racer 1",
        score: 0
    },
    { 
        id: 1,
        name: "racer 2",
        score: 0
    },
    { 
        id: 2,
        name: "racer 3",
        score: 0
    },
    { 
        id: 3,
        name: "racer 4",
        score: 0
    },
    { 
        id: 4,
        name: "racer 5",
        score: 0
    },
    { 
        id: 5,
        name: "racer 6",
        score: 0
    },
    { 
        id: 6,
        name: "racer 7",
        score: 0
    },
    { 
        id: 7,
        name: "racer 8",
        score: 0
    },
];

const tournament1: Tournament = {
    name: "Test Tournament #1",
    participants: participants1,
    startTime: new Date("March 11, 2021 12:00:00"),
    setupsCount: 2
}

test("Test createSeedingRounds with no leftovers", () => {
    const setups: Setup[] = createSeedingRounds(tournament1);
    // only 2 setups
    expect(setups).toHaveLength(2);
    // both setups have 1 round
    expect(setups[0].rounds).toHaveLength(1);
    expect(setups[1].rounds).toHaveLength(1);
    // all rounds in setup 1 have 4 players
    expect(setups[0].rounds[0].participants).toHaveLength(4);
    // all rounds in setup 2 have 4 players
    expect(setups[1].rounds[0].participants).toHaveLength(4);
})
