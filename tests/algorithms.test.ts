import { createSwissSeedingRounds, createSwissMatchups, generateCourseSelection, getPoints } from '../src/algorithms';
import Participant from '../src/types/Participant';
import Round from '../src/types/Round';
import Tournament from '../src/types/Tournament';
import Setup from '../src/types/Setup';
import Course from '../src/types/Course';
import { Platform } from '../src/types/Platform';
import CourseData, { getRandomThreshold } from '../src/data/courseData';
import { range } from 'itertools';
// require('jest-localstorage-mock');

const participants1: Participant[] = [...range(8)].map(i => ({id: i, name: `Racer ${i}`, score: 0}));

describe("Algorithms.ts Tests", () => {

    // testing only the getPoints() function
    describe("getPoints() Point Calculation Tests", () => {
        // parameters to test if function stays up when changed
        let partsPerMatch: number;
        let abnormalRound: boolean;
        describe("8-player Match", () => {
            beforeAll(() => partsPerMatch = 8);
            describe("Normal Match", () => {
                beforeAll(() => abnormalRound = false);
                test("Finished First", () => {
                    const expected = 14;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second", () => {
                    const expected = 12;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third", () => {
                    const expected = 10;
                    const rank = 2
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
    
                test("Finished Fourth", () => {
                    const expected = 8;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                test("Finished Fifth", () => {
                    const expected = 6;
                    const rank = 4;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                test("Finished Sixth", () => {
                    const expected = 4;
                    const rank = 5;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                test("Finished Seventh", () => {
                    const expected = 2;
                    const rank = 6;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                test("Finished Eighth", () => {
                    const expected = 0;
                    const rank = 7;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });

            describe("Abnormal Match", () => {
                beforeAll(() => abnormalRound = true);
                test("Finished First (abnormal round)", () => {
                    const expected = 13;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second (abnormal round)", () => {
                    const expected = 11;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third (abnormal round)", () => {
                    const expected = 9;
                    const rank = 2;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fourth (abnormal round)", () => {
                    const expected = 7;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fifth (abnormal round)", () => {
                    const expected = 5;
                    const rank = 4;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Sixth (abnormal round)", () => {
                    const expected = 3;
                    const rank = 5;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Seventh (abnormal round)", () => {
                    const expected = 1;
                    const rank = 6;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });
        });

        describe("7-player Match", () => {
            beforeAll(() => partsPerMatch = 7);
            describe("Normal Match", () => {
                beforeAll(() => abnormalRound = false);
                test("Finished First", () => {
                    const expected = 12;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second", () => {
                    const expected = 10;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third", () => {
                    const expected = 8;
                    const rank = 2
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
    
                test("Finished Fourth", () => {
                    const expected = 6;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                test("Finished Fifth", () => {
                    const expected = 4;
                    const rank = 4;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                test("Finished Sixth", () => {
                    const expected = 2;
                    const rank = 5;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                test("Finished Seventh", () => {
                    const expected = 0;
                    const rank = 6;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });

            describe("Abnormal Match", () => {
                beforeAll(() => abnormalRound = true);
                test("Finished First (abnormal round)", () => {
                    const expected = 11;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second (abnormal round)", () => {
                    const expected = 9;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third (abnormal round)", () => {
                    const expected = 7;
                    const rank = 2;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fourth (abnormal round)", () => {
                    const expected = 5;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fifth (abnormal round)", () => {
                    const expected = 3;
                    const rank = 4;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Sixth (abnormal round)", () => {
                    const expected = 1;
                    const rank = 5;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });
        });

        describe("6-player Match", () => {
            beforeAll(() => partsPerMatch = 6);
            describe("Normal Match", () => {
                beforeAll(() => abnormalRound = false);
                test("Finished First", () => {
                    const expected = 10;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second", () => {
                    const expected = 8;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third", () => {
                    const expected = 6;
                    const rank = 2
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
    
                test("Finished Fourth", () => {
                    const expected = 4;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fifth", () => {
                    const expected = 2;
                    const rank = 4;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Sixth", () => {
                    const expected = 0;
                    const rank = 5;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });

            describe("Abnormal Match", () => {
                beforeAll(() => abnormalRound = true);
                test("Finished First (abnormal round)", () => {
                    const expected = 9;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second (abnormal round)", () => {
                    const expected = 7;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third (abnormal round)", () => {
                    const expected = 5;
                    const rank = 2;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fourth (abnormal round)", () => {
                    const expected = 3;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fifth (abnormal round)", () => {
                    const expected = 1;
                    const rank = 4;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });
        });

        describe("5-player Match", () => {
            beforeAll(() => partsPerMatch = 5);
            describe("Normal Match", () => {
                beforeAll(() => abnormalRound = false);
                test("Finished First", () => {
                    const expected = 8;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second", () => {
                    const expected = 6;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third", () => {
                    const expected = 4;
                    const rank = 2
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
    
                test("Finished Fourth", () => {
                    const expected = 2;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fifth", () => {
                    const expected = 0;
                    const rank = 4;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });

            describe("Abnormal Match", () => {
                beforeAll(() => abnormalRound = true);
                test("Finished First (abnormal round)", () => {
                    const expected = 7;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second (abnormal round)", () => {
                    const expected = 5;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third (abnormal round)", () => {
                    const expected = 3;
                    const rank = 2;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });

                test("Finished Fourth (abnormal round)", () => {
                    const expected = 1;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });
        });
        
        describe("4-player Match", () => {
            beforeAll(() => partsPerMatch = 4);
            describe("Normal Match", () => {
                beforeAll(() => abnormalRound = false);
                test("Finished First", () => {
                    const expected = 6;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second", () => {
                    const expected = 4;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third", () => {
                    const expected = 2;
                    const rank = 2
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
    
                test("Finished Fourth", () => {
                    const expected = 0;
                    const rank = 3;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });

            describe("Abnormal Match", () => {
                beforeAll(() => abnormalRound = true);
                test("Finished First (abnormal round)", () => {
                    const expected = 5;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second (abnormal round)", () => {
                    const expected = 3;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third (abnormal round)", () => {
                    const expected = 1;
                    const rank = 2;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });
        });

        describe("3-player Match", () => {
            beforeAll(() => {
                partsPerMatch = 3;
            })
            describe("Normal Match", () => {
                beforeAll(() => {
                    abnormalRound = false;
                })
                test("Finished First", () => {
                    const expected = 4;
                    const rank = 0
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second", () => {
                    const expected = 2;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Third", () => {
                    const expected = 0;
                    const rank = 2;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });

            describe("Abnormal Match", () => {
                beforeAll(() => {
                    abnormalRound = true;
                })
                test("Finished First (abnormal round)", () => {
                    const expected = 3;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second (abnormal round)", () => {
                    const expected = 1;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });
        });

        describe("2-player Match", () => {
            beforeAll(() => {
                partsPerMatch = 2;
            })
            describe("Normal Match", () => {
                beforeAll(() => {
                    abnormalRound = false;
                })
                test("Finished First", () => {
                    const expected = 2;
                    const rank = 0
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
                
                test("Finished Second", () => {
                    const expected = 0;
                    const rank = 1;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });

            describe("Abnormal Match", () => {
                beforeAll(() => {
                    abnormalRound = true;
                })
                test("Finished First (abnormal round)", () => {
                    const expected = 1;
                    const rank = 0;
                    const actual = getPoints(rank, partsPerMatch, abnormalRound);
    
                    expect(actual).toBe(expected);
                });
            });
        });
    });

    describe("createSwissMatchups Tests", () => {
        let numParts: number;
        let partsPerMatch = 4;
        let participants: Participant[];
        let rounds: Participant[][];
        describe("Tournament with perfect amount of players", () => {
            beforeAll(() => numParts = 12)
            beforeEach(() => {
                participants = [...range(0, numParts)].map(i => ({name: `Racer ${i}`, score: numParts - i, id: i}))
                rounds = createSwissMatchups(participants, partsPerMatch);
            })
            test("Round 1 has the correctly ranked participants in it", () => {
                const expectedP1 = 0;
                const expectedP2 = 3;
                const expectedP3 = 6;
                const expectedP4 = 9;
                const actualP1 = rounds[0][0].id;
                const actualP2 = rounds[0][1].id;
                const actualP3 = rounds[0][2].id;
                const actualP4 = rounds[0][3].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
                expect(actualP4).toBe(expectedP4);
            });
            test("Round 2 has the correctly ranked participants in it", () => {
                const expectedP1 = 1;
                const expectedP2 = 4;
                const expectedP3 = 7;
                const expectedP4 = 10;
                const actualP1 = rounds[1][0].id;
                const actualP2 = rounds[1][1].id;
                const actualP3 = rounds[1][2].id;
                const actualP4 = rounds[1][3].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
                expect(actualP4).toBe(expectedP4);
            });
            test("Round 3 has the correctly ranked participants in it", () => {
                const expectedP1 = 2;
                const expectedP2 = 5;
                const expectedP3 = 8;
                const expectedP4 = 11;
                const actualP1 = rounds[2][0].id;
                const actualP2 = rounds[2][1].id;
                const actualP3 = rounds[2][2].id;
                const actualP4 = rounds[2][3].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
                expect(actualP4).toBe(expectedP4);
            });
        })
        describe("Tournament with three leftover players (one abnormal round)", () => {
            beforeAll(() => numParts = 11)
            beforeEach(() => {
                participants = [...range(0, numParts)].map(i => ({name: `Racer ${i}`, score: numParts - i, id: i}))
                rounds = createSwissMatchups(participants, partsPerMatch);
            })
            test("Round 1 has the correctly ranked participants in it", () => {
                const expectedP1 = 0;
                const expectedP2 = 3;
                const expectedP3 = 6;
                const expectedP4 = 9;
                const actualP1 = rounds[0][0].id;
                const actualP2 = rounds[0][1].id;
                const actualP3 = rounds[0][2].id;
                const actualP4 = rounds[0][3].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
                expect(actualP4).toBe(expectedP4);
            });
            test("Round 2 has the correctly ranked participants in it", () => {
                const expectedP1 = 1;
                const expectedP2 = 4;
                const expectedP3 = 7;
                const expectedP4 = 10;
                const actualP1 = rounds[1][0].id;
                const actualP2 = rounds[1][1].id;
                const actualP3 = rounds[1][2].id;
                const actualP4 = rounds[1][3].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
                expect(actualP4).toBe(expectedP4);
            });
            test("Round 3 has the correctly ranked participants in it", () => {
                const expectedP1 = 2;
                const expectedP2 = 5;
                const expectedP3 = 8;
                const actualP1 = rounds[2][0].id;
                const actualP2 = rounds[2][1].id;
                const actualP3 = rounds[2][2].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
            });
        })
        describe("Tournament with two leftover players (two abnormal rounds)", () => {
            beforeAll(() => numParts = 10)
            beforeEach(() => {
                participants = [...range(0, numParts)].map(i => ({name: `Racer ${i}`, score: numParts - i, id: i}))
                rounds = createSwissMatchups(participants, partsPerMatch);
            })
            test("Round 1 has the correctly ranked participants in it", () => {
                const expectedP1 = 0;
                const expectedP2 = 3;
                const expectedP3 = 6;
                const expectedP4 = 9;
                const actualP1 = rounds[0][0].id;
                const actualP2 = rounds[0][1].id;
                const actualP3 = rounds[0][2].id;
                const actualP4 = rounds[0][3].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
                expect(actualP4).toBe(expectedP4);
            });
            test("Round 2 has the correctly ranked participants in it", () => {
                const expectedP1 = 1;
                const expectedP2 = 4;
                const expectedP3 = 7;
                const actualP1 = rounds[1][0].id;
                const actualP2 = rounds[1][1].id;
                const actualP3 = rounds[1][2].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
            });
            test("Round 3 has the correctly ranked participants in it", () => {
                const expectedP1 = 2;
                const expectedP2 = 5;
                const expectedP3 = 8;
                const expectedP4 = 11;
                const actualP1 = rounds[2][0].id;
                const actualP2 = rounds[2][1].id;
                const actualP3 = rounds[2][2].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
            });
        })
        describe("Tournament with one leftover player (three abnormal rounds)", () => {
            beforeAll(() => numParts = 9)
            beforeEach(() => {
                participants = [...range(0, numParts)].map(i => ({name: `Racer ${i}`, score: numParts - i, id: i}))
                rounds = createSwissMatchups(participants, partsPerMatch);
            })
            test("Round 1 has the correctly ranked participants in it", () => {
                const expectedP1 = 0;
                const expectedP2 = 3;
                const expectedP3 = 6;
                const actualP1 = rounds[0][0].id;
                const actualP2 = rounds[0][1].id;
                const actualP3 = rounds[0][2].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
            });
            test("Round 2 has the correctly ranked participants in it", () => {
                const expectedP1 = 1;
                const expectedP2 = 4;
                const expectedP3 = 7;
                const actualP1 = rounds[1][0].id;
                const actualP2 = rounds[1][1].id;
                const actualP3 = rounds[1][2].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
            });
            test("Round 3 has the correctly ranked participants in it", () => {
                const expectedP1 = 2;
                const expectedP2 = 5;
                const expectedP3 = 8;
                const actualP1 = rounds[2][0].id;
                const actualP2 = rounds[2][1].id;
                const actualP3 = rounds[2][2].id;
                expect(actualP1).toBe(expectedP1);
                expect(actualP2).toBe(expectedP2);
                expect(actualP3).toBe(expectedP3);
            });
        })
    })
});

const tournament1: Tournament = {
    name: "Test Tournament #1",
    participants: participants1,
    currRound: 0,
    startTime: new Date("March 11, 2021 12:00:00"),
    setupsCount: 2,
    platform: Platform.Wii
}

test("Test createSeedingRounds with no leftovers", () => {
    const partsPerMatch = 4;
    const seedingRound = 0;
    const setups: Setup[] = createSwissSeedingRounds(tournament1, partsPerMatch, seedingRound);
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

test("Test generateCourseSelection with random threshold 4-20", () => {
    let min = Math.ceil(20);
    let max = Math.floor(4);
    let threshold =  Math.floor(Math.random() * (max - min + 1)) + min;

    let actualThreshold = 0

    const courses: Course[] = generateCourseSelection(Platform.Wii, threshold, 4)
    //have length 4
    expect(courses).toHaveLength(4);

    courses.forEach(element => {
        actualThreshold += element.degreeOfDifficulty
    });
    //difficulty is correct
    expect(actualThreshold).toEqual(threshold)

})

test("Test getRandomThreshold", () => {

    let threshold = getRandomThreshold();
    expect(threshold).toBeLessThan(21)
    expect(threshold).toBeGreaterThan(3)

})

const participants2: Participant[] = [
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
];

const tournament2: Tournament = {
    name: "Test Tournament #2",
    participants: participants2,
    currRound: 0,
    startTime: new Date("March 11, 2021 12:00:00"),
    setupsCount: 4,
    platform: Platform.Wii
}

test("Test createSeedingRounds with 3 leftovers and 4 setups", () => {
    const partsPerMatch = 4;
    const currRound = 0;
    const setups: Setup[] = createSwissSeedingRounds(tournament2, partsPerMatch, currRound);
    // only 2 setups
    expect(setups).toHaveLength(4);
    // both setups have 1 round
    expect(setups[0].rounds).toHaveLength(2);
    expect(setups[1].rounds).toHaveLength(2);
    expect(setups[2].rounds).toHaveLength(2);
    expect(setups[3].rounds).toHaveLength(2);
    // all rounds in setup 1 have 4 players
    expect(setups[0].rounds[0].participants).toHaveLength(4);
    expect(setups[0].rounds[1].participants).toHaveLength(4);
    // all rounds in setup 2 have 4 players
    expect(setups[1].rounds[0].participants).toHaveLength(4);
    expect(setups[1].rounds[1].participants).toHaveLength(4);
    // all rounds in setup 3 have 4 players
    expect(setups[2].rounds[0].participants).toHaveLength(4);
    expect(setups[2].rounds[1].participants).toHaveLength(4);
    // first round in setup 4 should have 4 players, second round should have 3 players
    expect(setups[3].rounds[0].participants).toHaveLength(4);
    expect(setups[3].rounds[1].participants).toHaveLength(3);
})

const tournament3: Tournament = {
    name: "Test Tournament #2",
    participants: participants2,
    currRound: 0,
    startTime: new Date("March 11, 2021 12:00:00"),
    setupsCount: 5,
    platform: Platform.Wii
}

test("Test createSeedingRounds with 3 leftovers and 5 setups", () => {
    const partsPerMatch = 4;
    const currRound = 0;
    const setups: Setup[] = createSwissSeedingRounds(tournament3, partsPerMatch, currRound);
    // only 2 setups
    expect(setups).toHaveLength(5);
    // both setups have 1 round
    expect(setups[0].rounds).toHaveLength(2);
    expect(setups[1].rounds).toHaveLength(2);
    expect(setups[2].rounds).toHaveLength(2);
    expect(setups[3].rounds).toHaveLength(1);
    expect(setups[4].rounds).toHaveLength(1);
    // all rounds in setup 1 have 4 players
    expect(setups[0].rounds[0].participants).toHaveLength(4);
    expect(setups[0].rounds[1].participants).toHaveLength(4);
    // all rounds in setup 2 have 4 players
    expect(setups[1].rounds[0].participants).toHaveLength(4);
    expect(setups[1].rounds[1].participants).toHaveLength(4);
    // first round in setup 3 have 4 players, second has 3 players
    expect(setups[2].rounds[0].participants).toHaveLength(4);
    expect(setups[2].rounds[1].participants).toHaveLength(3);
    // first round in setup 4 should have 4 players
    expect(setups[3].rounds[0].participants).toHaveLength(4);
    // first round in setup 5 should have 4 players
    expect(setups[4].rounds[0].participants).toHaveLength(4);
})
