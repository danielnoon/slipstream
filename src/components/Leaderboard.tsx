import { css } from "@emotion/css";
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonList, IonListHeader, IonModal } from "@ionic/react";
import { close, trophyOutline } from "ionicons/icons";
import { Fragment } from "react";
import { useStore } from "../store";
import { getOrdinal } from "../utility/rankFormatting";

const grid = css`
  display: grid;
  grid-template-columns: 1fr 3fr 3fr;
`;

const LeaderboardLabel = css`
  font-size: 20px;
  width: 100%;
  text-align: center;
`;

const flex = css`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  flex-grow: 1;
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
      <IonContent style={{ '--background': 'var(--ion-item-background)' }}>
        <IonList lines="inset">
          <IonItem>
            <IonIcon icon={trophyOutline} />
            <IonIcon icon={trophyOutline} />
            <IonIcon icon={trophyOutline} />
            <IonListHeader className={LeaderboardLabel}>
              <strong style={{ width: "100%", textAlign: "center" }}>Leaderboard</strong>
            </IonListHeader>
            <IonIcon icon={trophyOutline} />
            <IonIcon icon={trophyOutline} />
            <IonIcon icon={trophyOutline} />
            <IonButtons>
              <IonButton onClick={onClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonItem>
          <div className={grid}>
            <IonItem>
              <IonListHeader>Rank</IonListHeader>
            </IonItem>
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
                  <div>
                    <IonItem><strong>{(i + 1) + getOrdinal(i + 1)}</strong></IonItem>
                  </div>
                  <div className={flex}>
                    <IonItem>{part.name}</IonItem>
                    {
                      i === 0 && <IonIcon icon={trophyOutline}></IonIcon>
                    }
                  </div>
                  <div className={flex}>
                    <IonItem> {part.score} </IonItem>
                  </div>
                </Fragment>
              ))
            }
          </div>
        </IonList>
      </IonContent>
    </IonModal>
  )
}