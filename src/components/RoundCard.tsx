import { css } from "@emotion/css";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonRippleEffect,
} from "@ionic/react";
import Participant from "../types/Participant";

const cardStyle = css`
  min-width: 300px;
  cursor: pointer;
`;

interface Props {
  id: number;
  eta?: Date;
  participants: Participant[];
  onClick: () => void;
}

export function RoundCard(props: Props) {
  const { id, eta, participants, onClick } = props;

  return (
    <IonCard
      className={[cardStyle, "ion-activatable", "ripple-parent"].join(" ")}
      onClick={onClick}
    >
      <IonCardHeader>
        <IonCardTitle>Round {id}</IonCardTitle>
        {eta && (
          <IonCardSubtitle>
            eta {eta.toTimeString().split(" ").slice(0, 1)}
          </IonCardSubtitle>
        )}
      </IonCardHeader>
      <IonList>
        {participants.map((part, i) => (
          <IonItem>
            <IonLabel>
              {i + 1}. {part.name}
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
      <IonRippleEffect />
    </IonCard>
  );
}
