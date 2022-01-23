import { css } from "@emotion/css";
import { IonButton, IonContent, IonGrid, IonItem, IonListHeader, IonModal, IonSelect, IonSelectOption } from "@ionic/react";
import { range } from "itertools";
import React, { Fragment } from "react";
import { useStore } from "../store";
import { uploadRoundResult } from '../algorithms';

const modal = css`
  --width: 800px;
`;

const grid = (players: number) => css`
  display: grid;
  grid-template-columns: 12em repeat(${players}, 1fr);
  grid-template-rows: repeat(5, 4em);
`;

const flex = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

interface Props {
  id: number;
  isOpen: boolean;
  onClose?: () => void;
}

export function ScoreEntryModal(props: Props) {

  const { id, isOpen, onClose } = props;
  const participants = useStore(state => state.rounds.get(id)?.participants!);
  const courses = useStore(state => state.rounds.get(id)?.courses!)
  const setRaceResult = useStore(state => state.setRaceResult);
  const results = useStore(state => state.rounds.get(id)?.result);

  const canSubmit = (): boolean => {
    const requiredEntries = participants.length * 4;
    let entriesCount = 0;
    if(results) {
        entriesCount = results.raceResults.length;;
    }
    return entriesCount === requiredEntries;
  }

  const ordinalsMap = ["1st", "2nd", "3rd", "4th"];
  
  const select = (playerID: number, match: number) => {
  const raceResult = results?.raceResults[match]?.get(playerID);

    return (
      <IonSelect
        value={raceResult?.rank}
        placeholder="Result"
        onIonChange={ev => setRaceResult(id, match, playerID, ev.detail.value)}
      >
        {
          [...range(participants.length)].map((i) => {
            return <IonSelectOption value={i} key={i}>{ordinalsMap[i]}</IonSelectOption>
          })
        }
      </IonSelect>
    )
  }

  return (
    <IonModal isOpen={isOpen} className={modal} onDidDismiss={onClose}>
      <IonContent>
        <IonGrid className={grid(participants.length)}>
          <div></div>
          {participants.map(part => (
            <IonItem key={part.id}>
              <IonListHeader>{part.name}</IonListHeader>
            </IonItem>
          ))}
          {[...range(4)].map( i => (
            <Fragment key={i}>
              <div>
                <IonListHeader>{courses[i].name}</IonListHeader>
              </div>
              {participants.map(participant => <div key={participant.id}>{select(participant.id, i)}</div>)}
            </Fragment>
          ))}
        </IonGrid>
        {
          canSubmit() && results && 
          <div className={flex}>
            <IonButton onClick={() => uploadRoundResult(results)}>Submit Round</IonButton>
          </div>
        }
      </IonContent>
    </IonModal>
  );
}
