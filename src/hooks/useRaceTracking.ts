import { useCallback, useMemo, useEffect, useState } from "react";
import Participant from "../types/Participant";
import type DuplicateError from "../types/DuplicateError";
import { getPoints } from "../algorithms";

type RoundParticipant = Participant & {
	rank: number;
	rScore: number;
	isTied: boolean;
};

const defaultArr = (
	numParticipants: number,
	numRaces: number,
	defaultValue: number
): number[][] => {
	const filledArr = new Array(numRaces)
		.fill(0)
		.map((_e) => new Array(numParticipants).fill(defaultValue));
	return filledArr;
};

const useRaceTracking = (
	participants: Participant[],
	numRaces: number
): {
	results: number[][];
	setRank: (race: number, pID: number, newRank: number) => boolean;
	addRace: () => void;
	removeRace: (race: number) => void;
	resetRoundResults: () => void;
	roundRanks: RoundParticipant[];
	duplicateErrors: DuplicateError[];
	roundResultsReady: boolean;
} => {
	const initialRaces = defaultArr(participants.length, numRaces, -1);
	const [results, setResults] = useState(initialRaces);

	useEffect(() => {
		if (results.some((race) => race.length === 0)) {
			setResults(defaultArr(participants.length, numRaces, -1));
		}
	});

	const resetRoundResults = useCallback(() => {
		setResults(defaultArr(participants.length, numRaces, -1));
	}, [participants, numRaces]);

	// useEffect(() => {
	// 	setResults(defaultArr(participants.length, numRaces, -1));
	// }, []);

	const getParticipantRoundScore = useCallback(
		(pID: number): number => {
			return results
				.map((race) => {
					// rank not entered yet
					if (race[pID] == -1) {
						return 0;
					}
					return getPoints(
						race[pID],
						participants.length,
						participants.length
					);
				})
				.reduce((prev, agg) => prev + agg);
		},
		[participants, participants.length, results]
	);

	const roundRanks: RoundParticipant[] = useMemo(() => {
		const roundScores = new Array(participants.length)
			.fill(0)
			.map((_e, i) => ({
				...participants[i],
				rScore: getParticipantRoundScore(i),
				isTied: false,
				rank: -1,
			}))
			.sort((a, b) => b.rScore - a.rScore);
		roundScores.forEach((rS, i) => {
			rS.rank = i + 1;
			if (i !== 0) {
				if (roundScores[i - 1].rScore === rS.rScore) {
					roundScores[i - 1].isTied = true;
					rS.isTied = true;
					rS.rank = roundScores[i - 1].rank;
				}
			}
		});
		return roundScores;
	}, [results, participants, participants.length]);

	const setRank = (race: number, pID: number, newRank: number): boolean => {
		if (
			newRank >= participants.length ||
			newRank < 0 ||
			race < 0 ||
			race >= numRaces ||
			pID < 0 ||
			pID >= participants.length
		) {
			return false;
		}
		results[race][pID] = newRank;
		setResults([...results]);
		return true;
	};

	const hasDuplicates = useMemo(() => {
		return results.some(
			(race) =>
				new Set(race).size !== race.length &&
				race.every((rank) => rank !== -1)
		);
	}, [results]);

	const duplicateErrors: DuplicateError[] = useMemo(() => {
		if (!hasDuplicates) {
			return [];
		}
		const duplicates = results.map((race, race_i) => {
			// not all placements entered yet, so skip
			if (race.some((result) => result === -1)) {
				return [];
			}
			const pIDTied = new Map<number, Participant[]>();
			for (let i = 0; i < race.length; i += 1) {
				const rank = race[i];
				if (pIDTied.has(rank)) {
					const dups = pIDTied.get(rank)!;
					pIDTied.set(rank, [...dups, participants[i]]);
				} else {
					pIDTied.set(rank, [participants[i]]);
				}
			}
			const duplicates: DuplicateError[] = [];
			for (const [rank, pTied] of pIDTied.entries()) {
				if (pTied.length > 1) {
					duplicates.push({ race: race_i, rank, offenders: pTied });
				}
			}
			return duplicates;
		});
		return duplicates.flat(1);
	}, [hasDuplicates, results]);

	const roundResultsReady = useMemo(() => {
		const someFullRaceEntered = results.some((race) =>
			race.every((rank) => rank !== -1)
		);
		const onlyFullRacesEntered = results.every(
			(race) =>
				race.every((rank) => rank !== -1) ||
				race.every((rank) => rank === -1)
		);
		return !hasDuplicates && someFullRaceEntered && onlyFullRacesEntered;
	}, [hasDuplicates, results]);

	const addRace = () => {
		setResults([...results, new Array(participants.length).fill(-1)]);
	};

	const removeRace = (race: number) => {
		setResults(results.filter((_e, i) => i !== race));
	};

	return {
		results,
		setRank,
		addRace,
		removeRace,
		resetRoundResults,
		roundRanks,
		duplicateErrors,
		roundResultsReady,
	};
};

export default useRaceTracking;
