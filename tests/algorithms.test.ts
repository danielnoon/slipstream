import { createSeedingRounds } from '../src/algorithms';
import Participant from '../src/types/Participant';
import Round from '../src/types/Round';
import Tournament from '../src/types/Tournament';

const testParticipants1: Participant[] = [
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

const testTournament1: Tournament = {
    name: "test tournament 1",
    participants: testParticipants1,
    startTime: new Date("January 22, 2022 13:46:00"),
    setupsCount: 2,
}

const testParticipants2: Participant[] = [
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
    { 
        id: 8,
        name: "racer 9",
        score: 0
    },
    { 
        id: 9,
        name: "racer 10",
        score: 0
    },
    { 
        id: 10,
        name: "racer 11",
        score: 0
    },
];

const testTournament2: Tournament = {
    name: "test tournament 2",
    participants: testParticipants2,
    startTime: new Date("January 22, 2022 13:46:00"),
    setupsCount: 2,
}

const testParticipants3: Participant[] = [
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
    { 
        id: 8,
        name: "racer 9",
        score: 0
    },
    { 
        id: 9,
        name: "racer 10",
        score: 0
    },
    { 
        id: 10,
        name: "racer 11",
        score: 0
    },
    { 
        id: 11,
        name: "racer 12",
        score: 0
    },
    { 
        id: 12,
        name: "racer 13",
        score: 0
    },
    { 
        id: 13,
        name: "racer 14",
        score: 0
    },
    { 
        id: 14,
        name: "racer 15",
        score: 0
    },
    { 
        id: 15,
        name: "racer 16",
        score: 0
    },
    { 
        id: 16,
        name: "racer 17",
        score: 0
    },
    { 
        id: 17,
        name: "racer 18",
        score: 0
    },
    { 
        id: 18,
        name: "racer 19",
        score: 0
    },
    { 
        id: 19,
        name: "racer 20",
        score: 0
    },
    { 
        id: 20,
        name: "racer 21",
        score: 0
    },
    { 
        id: 21,
        name: "racer 22",
        score: 0
    },
    { 
        id: 22,
        name: "racer 23",
        score: 0
    },
    { 
        id: 23,
        name: "racer 24",
        score: 0
    },
    { 
        id: 24,
        name: "racer 25",
        score: 0
    },
    { 
        id: 25,
        name: "racer 26",
        score: 0
    },
    { 
        id: 26,
        name: "racer 27",
        score: 0
    },
    { 
        id: 27,
        name: "racer 28",
        score: 0
    },
    { 
        id: 28,
        name: "racer 29",
        score: 0
    },
    { 
        id: 29,
        name: "racer 30",
        score: 0
    },
    { 
        id: 30,
        name: "racer 31",
        score: 0
    },
    { 
        id: 31,
        name: "racer 32",
        score: 0
    },
    { 
        id: 32,
        name: "racer 33",
        score: 0
    },
    { 
        id: 33,
        name: "racer 34",
        score: 0
    },
    { 
        id: 34,
        name: "racer 35",
        score: 0
    },
    { 
        id: 35,
        name: "racer 36",
        score: 0
    },
    { 
        id: 36,
        name: "racer 37",
        score: 0
    },
];

const testTournament3: Tournament = {
    name: "test tournament 3",
    participants: testParticipants3,
    startTime: new Date("January 22, 2022 13:46:00"),
    setupsCount: 3,
}

test('Test for creating seeding rounds with 2 setups, 8 participants (clean split, 1 matchup per setup)', () => {
    const seedingRounds = createSeedingRounds(testTournament1);
    expect(seedingRounds).toHaveLength(2);
    // matchup 1 should be on setup 1
    expect(seedingRounds[0].setup).toBe(1);
    // matchup 2 should be on setup 2
    expect(seedingRounds[1].setup).toBe(2);
})

test('Test for creating seeding rounds with 2 setups, 11 participants (unclean split, 2 matchups per setup, greedy)', () => {
    const seedingRounds = createSeedingRounds(testTournament2);
    expect(seedingRounds).toHaveLength(3);
    // matchup 1 should be on setup 1
    expect(seedingRounds[0].setup).toBe(1);
    console.log(seedingRounds);
    // matchup 2 should be on setup 1
    expect(seedingRounds[1].setup).toBe(1);
    // matchup 3 should be on setup 2
    expect(seedingRounds[2].setup).toBe(2);
    expect(seedingRounds[2].participants).toHaveLength(3);
})

test('Test for creating seeding rounds with 3 setups, 37 participants (unclean split, 4 matchups per setup, greedy)', () => {
    const seedingRounds = createSeedingRounds(testTournament3);
    // 10 rounds total
    expect(seedingRounds).toHaveLength(10);
    // matchup 1,2,3,4 should be on setup 1
    expect(seedingRounds[0].setup).toBe(1);
    expect(seedingRounds[1].setup).toBe(1);
    expect(seedingRounds[2].setup).toBe(1);
    expect(seedingRounds[3].setup).toBe(1);
    // matchup 5,6,7,8 should be on setup 2
    expect(seedingRounds[4].setup).toBe(2);
    expect(seedingRounds[5].setup).toBe(2);
    expect(seedingRounds[6].setup).toBe(2);
    expect(seedingRounds[7].setup).toBe(2);
    // matchup 3 should be on setup 3
    expect(seedingRounds[8].setup).toBe(3);
    expect(seedingRounds[9].setup).toBe(3);
    // TODO: fix this when you re-do back-spread algorithm
    expect(seedingRounds[9].participants).toHaveLength(1);
})