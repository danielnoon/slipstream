import { useMemo, useState } from "react";
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
} from "@ionic/react";
import { close, trophyOutline, syncOutline } from "ionicons/icons";
import { getState, useStore } from "../store";
import { css } from "@emotion/css";
import { getPoints } from "../algorithms";
import type RoundParticipant from "../types/RoundParticipant";
import { rankColors } from "../utility/rankFormatting";
import Participant from "../types/Participant";

const elimRoundRaces = css`
	z-index: 3;
	position: fixed;
	top: 350px;
	left: 200px;
`;

const elimRoundScores = css`
	z-index: 2;
	position: fixed;
	top: 350px;
	left: 1400px;
`;

type Props = {
	participants: Participant[];
	elimsPerRound: number;
};

type ElimRoundParticipant = Participant & {
	rank: number;
	rScore: number;
	isTied: boolean;
	isEliminationPosition: boolean;
};

const ElimsScoresCard = ({ participants }: Props) => {
	const roundParticipants: ElimRoundParticipant[] = useMemo(() => {
		return participants.map((p, i) => ({
			...p,
			rank: i,
			rScore: 0,
			isTied: true,
			isEliminationPosition: false,
		}));
	}, [participants]);

	return (
		<IonCard key={"races"} className={elimRoundScores}>
			<IonCardHeader>
				<IonCardTitle style={{ display: "flex" }}>
					<strong style={{ flexGrow: 1 }}>Scores</strong>
					<IonIcon
						onClick={() => {}}
						icon={syncOutline}
						color="danger"
						style={{ marginRight: 8 }}
					/>
				</IonCardTitle>
			</IonCardHeader>
			<IonCardContent>
				<IonList style={{ paddingLeft: 10, paddingRight: 10 }}>
					{roundParticipants.map((part, i) => (
						<IonItem shape="round" lines="none" key={part.id}>
							{[1, 2, 3].includes(part.rank) ? (
								<>
									<IonLabel>{part.name}</IonLabel>
									<IonIcon
										icon={trophyOutline}
										slot="end"
										color={rankColors[part.rank - 1]}
									/>
								</>
							) : (
								<IonLabel>{part.name}</IonLabel>
							)}
						</IonItem>
					))}
				</IonList>
			</IonCardContent>
		</IonCard>
	);
};

export default ElimsScoresCard;
