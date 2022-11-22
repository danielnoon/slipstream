import { Fragment, useMemo, useState, useRef } from "react";
import {
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonContent,
	IonIcon,
	IonLabel,
	IonPage,
	useIonRouter,
	useIonViewDidEnter,
	useIonViewWillEnter,
	IonList,
	IonItem,
	IonGrid,
	IonListHeader,
	IonSelect,
	IonSelectOption,
	IonCol,
	IonRow,
} from "@ionic/react";
import { close, trophyOutline, syncOutline } from "ionicons/icons";
import { getState, useStore } from "../store";
import { css } from "@emotion/css";
import { getPoints } from "../algorithms";
import { range } from "itertools";
import type RoundParticipant from "../types/RoundParticipant";
import { getOrdinal, rankColors } from "../utility/rankFormatting";
import Participant from "../types/Participant";
import { grid, error } from "../utility/css";

const elimRoundScores = css`
	z-index: 2;
	position: fixed;
	top: 350px;
	left: 1300px;
`;

type Props = {
	participants: Participant[];
	racesPerRound: number;
};

type ElimRoundParticipant = Participant & {
	rank: number;
	rScore: number;
	isTied: boolean;
};

const ElimsScoresCard = ({ participants, racesPerRound }: Props) => {
	const [elimsThisRound, setElimsThisRound] = useState(1);
	const roundResults = useRef<number[][]>(
		participants.map((p) => [...range(racesPerRound)].map((i) => 0))
	);
	console.log(roundResults.current);

	const roundParticipants: ElimRoundParticipant[] = useMemo(() => {
		return participants.map((p, i) => ({
			...p,
			rank: i,
			rScore: 0,
			isTied: true,
		}));
	}, [participants]);

	const selectRank = (playerID: number, match: number, newRank: number) => {
		const roundResultsForPlayer = roundResults.current[playerID] ?? [];
		roundResultsForPlayer[match] = newRank;
	};

	const hasAnyDuplicates = useMemo((): boolean => {
		return roundResults.current.some(
			(round) => new Set(round).size !== round.length
		);
	}, [roundResults.current, roundResults]);

	const duplicateErrors = useMemo(() => {
		const duplicateErrors = new Map<number[], number[]>();
		for (
			let race = 0;
			race < (roundResults.current[0] ?? []).length;
			race++
		) {
			const uniqueFinishes = new Set();
			const repeats = new Map<number, number[]>();
			for (let part = 0; part < roundResults.current.length; part++) {
				const rank = roundResults.current[part][race];
				repeats.set(rank, []);
				if (uniqueFinishes.has(rank)) {
					const repeat = repeats.get(rank);
					if (repeat) {
						repeats.set(rank, [...repeat, part]);
					}
				} else {
					uniqueFinishes.add(rank);
					repeats.set(rank, [part]);
				}
			}
			// there were some repeats
			if (uniqueFinishes.size !== participants.length) {
				for (const [rank, repeaters] of repeats.entries()) {
					duplicateErrors.set([race, rank], repeaters);
				}
			}
		}
		const errorsUI = [];
		for (const [combo, repeaters] of duplicateErrors.entries()) {
			const repeaterNames = repeaters.map((r) => participants[r].name);
			let messageString = "";
			if (repeaterNames.length > 2) {
				messageString = `${repeaterNames.slice(
					0,
					repeaterNames.length - 1
				)}, and ${repeaterNames[repeaterNames.length - 1]} in Race #${
					combo[0] + 1
				} cannot all finish ${getOrdinal(combo[1] + 1)}!`;
			} else {
				messageString = `${repeaterNames[0]} and ${
					repeaterNames[1]
				} in Race #${combo[0] + 1} cannot both finish ${getOrdinal(
					combo[1] + 1
				)}`;
			}
			errorsUI.push(
				<IonItem className={error} key={messageString}>
					<IonLabel color="danger" style={{ margin: 4 }}>
						{`Error: ${messageString}`}
					</IonLabel>
				</IonItem>
			);
		}
	}, [hasAnyDuplicates, roundResults.current]);

	const RankSelector = (playerID: number, match: number) => {
		return (
			<IonSelect
				value={
					(roundResults.current[playerID] ??
						[...range(racesPerRound)].map((i) => -1))[match]
				}
				placeholder="Result"
				interface="popover"
				onIonChange={(ev) => {
					const newRank = ev.detail.value;
					selectRank(playerID, match, newRank);
				}}
			>
				{[...range(participants.length)].map((i) => {
					return (
						<IonSelectOption value={i} key={i}>
							{i + 1 + getOrdinal(i + 1)}
						</IonSelectOption>
					);
				})}
			</IonSelect>
		);
	};

	return (
		<IonCard key={"races"} className={elimRoundScores}>
			<IonCardHeader>
				<IonCardTitle style={{ display: "flex" }}>
					<strong style={{ flexGrow: 1 }}>
						Enter Racing Results
					</strong>
					<IonIcon
						onClick={() => {}}
						icon={syncOutline}
						color="danger"
						style={{ marginRight: 8 }}
					/>
				</IonCardTitle>
			</IonCardHeader>
			<IonCardContent>
				<IonGrid>
					<IonRow key="names">
						<IonCol></IonCol>
						{participants.map((part, i) => (
							<IonCol key={`participant ${i}`}>
								<IonListHeader>
									<IonLabel>{part.name}</IonLabel>
								</IonListHeader>
							</IonCol>
						))}
					</IonRow>
					{/* TODO: Change this to be a variable amount of courses per race, not just 4 */}
					{[...range(racesPerRound)].map((i) => (
						<IonRow key={`race ${i}`}>
							<IonCol
								key={`race name ${i}`}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<IonLabel>Race {i + 1}</IonLabel>
							</IonCol>
							{participants.map((_p, j) => (
								<IonCol key={`race ${i} result ${j}`}>
									{RankSelector(j, i)}
								</IonCol>
							))}
						</IonRow>
					))}
				</IonGrid>
				{hasAnyDuplicates && (
					<IonList
						style={{
							background: "transparent",
							"padding-bottom": 16,
						}}
					>
						{duplicateErrors}
					</IonList>
				)}
			</IonCardContent>
		</IonCard>
	);
};

export default ElimsScoresCard;
