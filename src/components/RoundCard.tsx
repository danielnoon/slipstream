import { css } from "@emotion/css";
import {
  IonButtons,
  IonButton,
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
import { pencil, trophyOutline, closeCircle } from "ionicons/icons";
import { useState } from "react";
import Participant from "../types/Participant";
import { ScoreEntryModal } from "./ScoreEntryModal";
import { getState, select, getRound, getTournament } from '../store';
import { getPoints } from '../algorithms';
import { groupby } from "itertools";
import { rankColors } from "../utility/rankFormatting";

const cardStyle = css`
  min-width: 300px;
  cursor: pointer;
  padding: 10
`;

interface Props {
  id: number;
  eta?: Date;
}

export function RoundCard(props: Props) {
  const { id, eta } = props;
  const round = select(getRound(id));
  const participants = round?.participants!;
  // legacy support for tournaments that had 4 as default
  const partsPerRace = select(getTournament)!.partsPerRound ?? 4;
  const [editorOpen, setEditorOpen] = useState(false);

  interface RoundParticipant extends Participant {
    rank: number;
    rScore: number;
    tie: boolean;
  }

  const roundStandings = (): RoundParticipant[] => {
    const standings: Map<number, number> = new Map(); 
    if(round?.result) {
      for(const race of round.result.raceResults){
        // strange bug where null is sometimes in the raceResults
        if(!race){
          continue;
        }
        if(race.size === participants.length){
          const raceArr = [...race.values()];
          const abnormalRound = round.participants.length !== partsPerRace;
          raceArr.forEach(result => {
            const partRoundScore = standings.get(result.participant);
            if(partRoundScore){
              standings.set(result.participant, partRoundScore + getPoints(result.rank, partsPerRace, participants.length));
            } else {
              standings.set(result.participant, getPoints(result.rank, partsPerRace, participants.length));
            }
          })
        }
      }
      const standingsArr = Array.from(standings, ([k, v]) => ({
        ...participants.find(p => p.id === k)!, rScore: v, tie: false, rank: 0})).sort((a, b) => b.rScore - a.rScore);
      // if there were no complete races (i.e none to compute a leaderboard from), short circuit
      if(standingsArr.length === 0){
        return participants.map(p => ({...p, rank: 0, rScore: 0, tie: false}));
      }
      // determining if there are ties
      let i = 1;
      const pFinal = [];
      for(const [k, p] of groupby(standingsArr, (p) => p.rScore)){
        const pArr = [...p];
        if(pArr.length > 1){
          pArr.forEach(p => {
            p.rank = i;
            p.tie = true;
            pFinal.push(p);
          });
        } else {
            pArr[0].rank = i;
            pArr[0].tie = false;
            pFinal.push(pArr[0]);
        }
        i += pArr.length;
      }
      return pFinal;
    }
    return participants.map(p => ({...p, rank: 0, rScore: 0, tie: false}));
  }

  return (
    <IonCard
      className={[cardStyle, "ion-activatable", "ripple-parent"].join(" ")}
      onClick={() => !editorOpen && setEditorOpen(true)}
    >
      <IonCardHeader>
        <IonCardTitle style={{ display: "flex" }}>
          <strong style={{ flexGrow: 1 }}>Round {id + 1}</strong>
          <IonIcon onClick={() => getState().deleteRound(id)} icon={closeCircle} color="danger" style={{marginRight: 20}}/>
          <IonIcon icon={pencil} />
        </IonCardTitle>
        {eta && (
          <IonCardSubtitle>
            eta {eta.toTimeString().split(" ").slice(0, 1)}
          </IonCardSubtitle>
        )}
      </IonCardHeader>
      <IonIcon name="trophy"></IonIcon>
      <IonList style={{paddingLeft: 10, paddingRight: 10}}>
        {roundStandings().map((part, i) => (
          <IonItem shape="round" lines="none" key={part.id}>
            {
              [1, 2, 3].includes(part.rank) ? (<>
              <IonLabel>{part.name}</IonLabel>
              <IonIcon icon={trophyOutline} slot="end" color={rankColors[part.rank - 1]}/></>):  <IonLabel>{part.name}</IonLabel>
            }
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
