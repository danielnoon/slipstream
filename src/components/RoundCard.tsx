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
import { useState } from "react";
import Participant from "../types/Participant";
import { ScoreEntryModal } from "./ScoreEntryModal";

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

  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <IonCard
      className={[cardStyle, "ion-activatable", "ripple-parent"].join(" ")}
      onClick={() => setEditorOpen(true)}
    >
      <IonCardHeader>
        <IonCardTitle>Round {id + 1}</IonCardTitle>
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
      <ScoreEntryModal id={id} isOpen={editorOpen} onClose={() => setEditorOpen(false)} />
    </IonCard >
  );
}
