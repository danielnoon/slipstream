import type RoundParticipant from "../types/RoundParticipant";
import Round from "../types/Round";
import Participant from "../types/Participant";
import { getPoints } from "../algorithms";
import { groupby } from "itertools";

const determineRoundStandings = (
	round: Round | undefined,
	participants: Participant[],
	partsPerRace: number
): RoundParticipant[] => {
	const standings: Map<number, number> = new Map();
	if (round?.result) {
		for (const race of round.result.raceResults) {
			// strange bug where null is sometimes in the raceResults
			if (!race) {
				continue;
			}
			if (race.size === participants.length) {
				const raceArr = [...race.values()];
				raceArr.forEach((result) => {
					const partRoundScore = standings.get(result.participant);
					if (partRoundScore) {
						standings.set(
							result.participant,
							partRoundScore +
								getPoints(
									result.rank,
									partsPerRace,
									participants.length
								)
						);
					} else {
						standings.set(
							result.participant,
							getPoints(
								result.rank,
								partsPerRace,
								participants.length
							)
						);
					}
				});
			}
		}
		const standingsArr = Array.from(standings, ([k, v]) => ({
			...participants.find((p) => p.id === k)!,
			rScore: v,
			tie: false,
			rank: 0,
		})).sort((a, b) => b.rScore - a.rScore);
		// if there were no complete races (i.e none to compute a leaderboard from), short circuit
		if (standingsArr.length === 0) {
			return participants.map((p) => ({
				...p,
				rank: 0,
				rScore: 0,
				tie: false,
			}));
		}
		// determining if there are ties
		let i = 1;
		const pFinal = [];
		for (const [k, p] of groupby(standingsArr, (p) => p.rScore)) {
			const pArr = [...p];
			if (pArr.length > 1) {
				pArr.forEach((p) => {
					p.rank = i;
					p.tie = true;
					pFinal.push(p);
				});
			} else {
				pArr[0].rank = i;
				pArr[0].tie = false;
				pFinal.push(pArr[0]);
			}
			i += pArr.length;
		}
		return pFinal;
	}
	return participants.map((p) => ({
		...p,
		rank: 0,
		rScore: 0,
		tie: false,
	}));
};

export default determineRoundStandings;
