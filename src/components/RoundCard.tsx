import { css } from "@emotion/css";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import Participant from "../types/Participant";

const cardStyle = css`
  min-width: 300px;
`;

interface Props {
  id: number;
  eta?: Date;
  participants: Participant[];
}

export function RoundCard(props: Props) {
  const { id, eta, participants } = props;

  return (
    <IonCard className={cardStyle}>
      <IonCardHeader>
        <IonCardTitle>Round {id}</IonCardTitle>
        {eta && (
          <IonCardSubtitle>
            eta {eta.toTimeString().split(" ").slice(0, 1)}
          </IonCardSubtitle>
        )}
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {participants.map((part, i) => (
            <IonItem>
              <IonLabel>
                {i + 1}. {part.name}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}
