import { css } from "@emotion/css";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList
} from "@ionic/react";
import Participant from "../types/Participant";

const cardStyle = css`
  min-width: 300px;
`

interface Props {
  roundNum: number;
  eta: Date;
  participants: Participant[];
}

export function RoundCard(props: Props) {
  const { roundNum, eta, participants } = props;

  return (
    <IonCard className={cardStyle}>
      <IonCardHeader>
        <IonCardTitle>Round {roundNum}</IonCardTitle>
        <IonCardSubtitle>eta {eta.toTimeString().split(" ").slice(0, 1)}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {participants.map((part, i) => (
            <IonItem>
              <IonLabel>{i + 1}. {part.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}