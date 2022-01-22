import { css } from "@emotion/css";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonRippleEffect
} from "@ionic/react";
import Participant from "../types/Participant";

const cardStyle = css`
  min-width: 300px;
  cursor: pointer;
`;

interface Props {
  roundNum: number;
  eta: Date;
  participants: Participant[];
  onCardClick: () => void;
}

export function RoundCard(props: Props) {
  const { roundNum, eta, participants, onCardClick } = props;

  return (
    <IonCard className={[cardStyle, "ion-activatable", "ripple-parent"].join(" ")} onClick={onCardClick}>
      <IonCardHeader>
        <IonCardTitle>Round {roundNum}</IonCardTitle>
        <IonCardSubtitle>eta {eta.toTimeString().split(" ").slice(0, 1)}</IonCardSubtitle>
      </IonCardHeader>
      <IonList>
        {participants.map((part, i) => (
          <IonItem>
            <IonLabel>{i + 1}. {part.name}</IonLabel>
          </IonItem>
        ))}
      </IonList>
      <IonRippleEffect />
    </IonCard>
  );
}