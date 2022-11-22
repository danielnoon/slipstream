import { css } from "@emotion/css";
import {
	IonButtons,
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonRippleEffect,
} from "@ionic/react";
import { pencil, trophyOutline, closeCircle } from "ionicons/icons";
import { useMemo, useState } from "react";
import Participant from "../types/Participant";
import { ScoreEntryModal } from "./ScoreEntryModal";
import { getState, select, getRound, getTournament } from "../store";
import { rankColors } from "../utility/rankFormatting";
import type RoundParticipant from "../types/RoundParticipant";
import determineRoundStandings from "../utility/determineRoundStandings";

const cardStyle = css`
	min-width: 300px;
	cursor: pointer;
	padding: 10;
`;

interface Props {
	id: number;
	eta?: Date;
}

export function RoundCard(props: Props) {
	const { id, eta } = props;
	const round = select(getRound(id));
	const participants = round?.participants!;
	// legacy support for tournaments that had 4 as default
	const partsPerRace = select(getTournament)!.partsPerRound ?? 4;
	const [editorOpen, setEditorOpen] = useState(false);

	const roundStandings = useMemo(() => {
		return determineRoundStandings(round, participants, partsPerRace);
	}, [round, participants, partsPerRace]);

	return (
		<IonCard
			className={[cardStyle, "ion-activatable", "ripple-parent"].join(
				" "
			)}
			onClick={() => !editorOpen && setEditorOpen(true)}
		>
			<IonCardHeader>
				<IonCardTitle style={{ display: "flex" }}>
					<strong style={{ flexGrow: 1 }}>Round {id + 1}</strong>
					<IonIcon
						onClick={() => getState().deleteRound(id)}
						icon={closeCircle}
						color="danger"
						style={{ marginRight: 20 }}
					/>
					<IonIcon icon={pencil} />
				</IonCardTitle>
				{eta && (
					<IonCardSubtitle>
						eta {eta.toTimeString().split(" ").slice(0, 1)}
					</IonCardSubtitle>
				)}
			</IonCardHeader>
			<IonIcon name="trophy"></IonIcon>
			<IonList style={{ paddingLeft: 10, paddingRight: 10 }}>
				{roundStandings.map((part, i) => (
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
			<IonRippleEffect />
			<ScoreEntryModal
				id={id}
				isOpen={editorOpen}
				onClose={() => setEditorOpen(false)}
			/>
		</IonCard>
	);
}
