import { css } from "@emotion/css";
import { IonContent, IonGrid, IonItem, IonListHeader, IonModal, IonSelect, IonSelectOption } from "@ionic/react";
import React, { Fragment } from "react";
import { useStore } from "../store";

const modal = css`
  --width: 800px;
`;

const grid = (players: number) => css`
  display: grid;
  grid-template-columns: 12em repeat(${players}, 1fr);
  grid-template-rows: repeat(5, 4em);
`;

interface Props {
  id: number;
  isOpen: boolean;
}

export function ScoreEntryModal(props: Props) {

  const { id, isOpen } = props;
  const participants = useStore(state => state.rounds.get(id)?.participants!);
  const setRaceResult = useStore(state => state.setRaceResult);
  const results = useStore(state => state.rounds.get(id)?.result);

  const select = (playerID: number, match: number) => {
    const raceResult = results?.raceResults[match]?.get(playerID);

    return (
      <IonSelect
        value={raceResult?.rank}
        placeholder="Result"
        onIonChange={ev => setRaceResult(id, match, playerID, ev.detail.value)}
      >
        <IonSelectOption value={1}>1st</IonSelectOption>
        <IonSelectOption value={2}>2nd</IonSelectOption>
        <IonSelectOption value={3}>3rd</IonSelectOption>
        <IonSelectOption value={4}>4th</IonSelectOption>
      </IonSelect>
    )
  }

  return (
    <IonModal isOpen={isOpen} className={modal}>
      <IonContent>
        <IonGrid className={grid(participants.length)}>
          <div></div>
          {participants.map(part => (
            <IonItem key={part.id}>
              <IonListHeader>{part.name}</IonListHeader>
            </IonItem>
          ))}
          {participants.map((part, i) => (
            <Fragment key={part.id}>
              <div>
                <IonListHeader>Match {i + 1}</IonListHeader>
              </div>
              <div>
                {select(0, i)}
              </div>
              <div>
                {select(1, i)}
              </div>
              <div>
                {select(2, i)}
              </div>
              <div>
                {select(3, i)}
              </div>
            </Fragment>
          ))}
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}
