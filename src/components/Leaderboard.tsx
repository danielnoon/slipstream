import { css } from "@emotion/css";
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonList, IonListHeader, IonModal } from "@ionic/react";
import { close } from "ionicons/icons";
import { Fragment } from "react";
import { useStore } from "../store";

const grid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function Leaderboard(props: Props) {
  const { isOpen, onClose } = props;
  const participants = useStore(state => [...state.participants.values()]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent>
        <IonList>
          <IonItem>
            <IonListHeader>Leaderboard</IonListHeader>
            <IonButtons>
              <IonButton onClick={onClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonItem>
          <div className={grid}>
            <IonItem>
              <IonListHeader>Name</IonListHeader>
            </IonItem>
            <IonItem>
              <IonListHeader>Score</IonListHeader>
            </IonItem>
            {participants
              .sort((a, b) => b.score - a.score)
              .map((part, i) => (
                <Fragment key={part.id}>
                  <IonItem>{i + 1}. {part.name}</IonItem>
                  <IonItem> {part.score} </IonItem>
                </Fragment>
              ))
            }
          </div>
        </IonList>
      </IonContent>
    </IonModal>
  )
}