import { css } from "@emotion/css";
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonList, IonListHeader, IonModal } from "@ionic/react";
import { close, trophyOutline, trophy } from "ionicons/icons";
import { Fragment } from "react";
import { useStore } from "../store";
import { getOrdinal, getRankCSS, rankColors} from "../utility/rankFormatting";
import { range } from "itertools";

const grid = css`
  display: grid;
  grid-template-columns: 1.25fr 3fr 2fr;
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

const circleCSS = (rank: number) => css`
border-radius: 50%;
background-color: ${rankColors[rank]};
`

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
            {/* <IonIcon slot="start" icon={trophy} color="third"/>
            <IonIcon slot="start" icon={trophy} color="second"/>
            <IonIcon slot="start" icon={trophy} color="first"/> */}
            <IonListHeader className={LeaderboardLabel}>
              <strong style={{ width: "100%", textAlign: "center" }}>Leaderboard</strong>
            </IonListHeader>
            {/* <IonIcon slot="end" icon={trophy} color="first"/>
            <IonIcon slot="end" icon={trophy} color="second"/>
            <IonIcon slot="end" icon={trophy} color="third"/> */}
            <IonButtons >
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
                  <IonItem lines="none">
                    <strong style={{color: "white", marginRight: 8}}>{(i + 1) + getOrdinal(i + 1)}</strong>
                    {
                      i < 3 && <IonIcon slot="end" icon={trophy} color={rankColors[i]}/>
                    }
                    </IonItem>
                  <div className={flex}>
                    <IonItem>{part.name}</IonItem>
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