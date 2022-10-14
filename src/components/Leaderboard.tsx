import { css } from "@emotion/css";
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonList, IonListHeader, IonModal, IonText } from "@ionic/react";
import { close, trophy,  caretUp, caretDown, removeOutline } from "ionicons/icons";
import { Fragment } from "react";
import { useStore } from "../store";
import { getOrdinal, rankColors} from "../utility/rankFormatting";
import { participantSorter } from "../algorithms";

const grid = css`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 3fr 2fr;
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
  const currLeaderboard = useStore(state => state.tournament!.currentStandings);
  // currLeaderboard.sort(participantSorter);
  
  const getRankChangeIcon = (difference: number) => {
    if(difference > 0) {
      return caretUp
    }
    if(difference < 0) {
      return caretDown;
    }
    return removeOutline;
  }
  
  const getRankChangeColor = (difference: number) => {
    if(difference > 0) {
      return 'success'
    }
    if(difference < 0) {
      return 'danger';
    }
    return 'medium';
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent style={{ '--background': 'var(--ion-item-background)' }}>
        <IonList lines="inset">
          <IonItem>
            <IonListHeader className={LeaderboardLabel}>
              <strong style={{ width: "100%", textAlign: "center" }}>Leaderboard</strong>
            </IonListHeader>
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
              <IonListHeader>Change</IonListHeader>
            </IonItem>
            <IonItem>
              <IonListHeader>Name</IonListHeader>
            </IonItem>
            <IonItem>
              <IonListHeader>Score</IonListHeader>
            </IonItem>
            {currLeaderboard
              .map((e, i) => (
                <Fragment key={e.participant.id}>
                  <IonItem lines="none">
                    <strong style={{color: "white", marginRight: 8}}>{(i + 1) + getOrdinal(i + 1)}</strong>
                    {
                      i < 3 && <IonIcon slot="end" icon={trophy} color={rankColors[i]}/>
                    }
                  </IonItem>
                  <IonItem>
                      <IonIcon
                      color={getRankChangeColor(e.change)}
                      style={{fontSize: 16, paddingRight: 4}} 
                      icon={getRankChangeIcon(e.change)} />
                      {
                        e.change !== 0 && <IonText color={getRankChangeColor(e.change)}>{Math.abs(e.change)}</IonText>
                      }
                    </IonItem>
                  <div className={flex}>
                    <IonItem>{e.participant.name}</IonItem>
                  </div>
                  <div className={flex}>
                    <IonItem> {e.participant.score} </IonItem>
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