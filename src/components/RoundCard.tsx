import { css } from "@emotion/css";
import {
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
import { pencil } from "ionicons/icons";
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
}

export function RoundCard(props: Props) {
  const { id, eta, participants } = props;

  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <IonCard
      className={[cardStyle, "ion-activatable", "ripple-parent"].join(" ")}
      onClick={() => !editorOpen && setEditorOpen(true)}
    >
      <IonCardHeader>
        <IonCardTitle style={{ display: "flex" }}>
          <strong style={{ flexGrow: 1 }}>Round {id + 1}</strong>
          <IonIcon icon={pencil} />
        </IonCardTitle>
        {eta && (
          <IonCardSubtitle>
            eta {eta.toTimeString().split(" ").slice(0, 1)}
          </IonCardSubtitle>
        )}
      </IonCardHeader>
      <IonList>
        {participants.map((part, i) => (
          <IonItem key={part.id}>
            <IonLabel>
              {i + 1}. {part.name}
            </IonLabel>
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
