import { css } from "@emotion/css";
import { IonContent, IonItem, IonList, IonListHeader, IonModal } from "@ionic/react";
import { Fragment } from "react";
import { useStore } from "../store";

const grid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

interface Props {
  isOpen: boolean;
}

export function Leaderboard(props: Props) {
  const { isOpen } = props;
  const participants = useStore(state => [...state.participants.values()]);

  return (
    <IonModal isOpen={isOpen}>
      <IonContent>
        <IonList>
          <IonItem>
            <IonListHeader>Leaderboard</IonListHeader>
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