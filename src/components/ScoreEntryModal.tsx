import { css } from "@emotion/css";
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { groupby, range, flatten, roundrobin } from "itertools";
import React, { useState, Fragment } from "react";
import { useStore, select, getRound, getState, getTournament } from "../store";
import { uploadRoundResult } from "../algorithms";
import { getOrdinal } from "../utility/rankFormatting";
import { current } from "immer";
import { save, share } from "ionicons/icons";
import RaceResult from "../types/RaceResult";
import { closeCircleOutline } from "ionicons/icons";

const grid = (players: number) => css`
  display: grid;
  grid-template-columns: 12em repeat(${players}, 1fr);
  grid-template-rows: repeat(5, 4em);
  width: 100%;
  place-items: center normal;
`;

const flex = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const disableButton = css`
  transition: 200ms linear;
`;

const error = css`
  --background: transparent;
  --border-color: transparent;
  --padding-top: 0;
  --padding-bottom: 0;
  --min-height: min-content;
`

interface Props {
  id: number;
  isOpen: boolean;
  onClose?: () => void;
}

export function ScoreEntryModal(props: Props) {
  const { id, isOpen, onClose } = props;
  const participants = useStore((state) => state.rounds.get(id)?.participants!);
  const courses = useStore((state) => state.rounds.get(id)?.courses!);
  const setRaceResult = useStore((state) => state.setRaceResult);
  const results = useStore((state) => state.rounds.get(id)?.result);
  const round = useStore(getRound(id));
  // legacy handlers
  const partsPerRace = select(getTournament)!.partsPerRound ?? 4;
  const racesPerRound = select(getTournament)!.racesPerRound ?? 4;
  const submitted = round?.submitted ?? false;
  const [presentSubmitWarning] = useIonAlert();

  const modalWidth = participants.length * 200;
  const modal = css`
  --min-width: 800px;
  --width: ${modalWidth < window.innerWidth ? modalWidth : (window.innerWidth - 100)}px;
  --height: 32em;
  `;


  const hasAnyDuplicates = (): boolean => {
    const matchHasDuplicates = (match: number): boolean => {
      if(round && round.result && round.result.raceResults[match]) {
        const finishes = [...round.result.raceResults[match].values()].sort((a, b) => a.rank - b.rank);
        const groups = groupby(finishes, (finish) => finish.rank);
        for(const [key, value] of groups) {
          const sharedRank = [...value]
          if(sharedRank.length > 1){
            console.log(sharedRank)
            return true;
          }
        }
        return false;
      }
      return true;
    }
    // TODO: Change this to be variable amount of courses-per-round, not just always 4
    return [...range(racesPerRound)].map((i) => matchHasDuplicates(i)).some(e => e);
  }

  // checks if there are duplicate ranks in a race entered
  const displayDuplicateErrors = (match: number) => {
    const round = select(getRound(id));
    const errorEls = [];
    if(round && round.result && round.result.raceResults[match]){
      const finishes = [...round.result.raceResults[match].values()].sort((a, b) => a.rank - b.rank);
      const groups = groupby(finishes, (finish) => finish.rank);
      for(const [key, value] of groups){
        const sharedRank = [...value]
        if(sharedRank.length > 1){
          const guiltyParticipants = [...sharedRank.map(result => participants.find((p) => p.id === result.participant)?.name)];
          guiltyParticipants[guiltyParticipants.length - 1] = "and " + guiltyParticipants[guiltyParticipants.length - 1];
          const guiltyPartString = guiltyParticipants.join(guiltyParticipants.length === 2 ? " " : ", ")
          const errorItem = <IonItem className={error} key={key}>
            <IonLabel color="danger" style={{'margin': 4}}>
            {`Error: ${guiltyPartString} in Race #${match + 1} cannot ${sharedRank.length === 2 ? "both" : "all"} finish ${ (key + 1) + getOrdinal(key + 1)}!`}
            </IonLabel>
            </IonItem>;
          errorEls.push(errorItem);
        }
      }
    }
    return errorEls;
  }

  const canSubmit = (): boolean => {
    const requiredEntries = participants.length * racesPerRound;
    let entriesCount = 0;
    if (results) {
      entriesCount = results.raceResults.reduce(
        // strange error where null is sometimes an item in raceResults
        (prev, curr) => prev + (curr ? curr.size : 0),
        0
      );
    }
    return entriesCount === requiredEntries && !submitted && !hasAnyDuplicates();
  };

  const submitRound = (): void => {
    presentSubmitWarning({
      header: "Are you sure?",
      message: "Rounds cannot be changed once they've been submitted!",
      buttons: [
        "Cancel",
        {
          text: "Yes",
          handler: () => {
            uploadRoundResult(round!, partsPerRace, participants.length);
            getState().submitRound(id);
            onClose?.();
          },
        },
      ],
      onDidDismiss: (e) => console.log("did dismiss"),
    });
  };

  const selectRank = (playerID: number, match: number, round_id: number) => {
    const raceResult = results?.raceResults[match]?.get(playerID);
    return (
      <IonSelect
        value={raceResult?.rank}
        placeholder="Result"
        interface="popover"
        onIonChange={(ev) =>
          setRaceResult(id, match, playerID, ev.detail.value)
        }
      >
        {[...range(participants.length)].map((i) => {
          return (
            <IonSelectOption value={i} key={i} disabled={submitted}>
              {(i + 1) + getOrdinal(i + 1)}
            </IonSelectOption>
          );
        })}
      </IonSelect>
    );
  };

  return (
    <IonModal isOpen={isOpen} className={modal} onDidDismiss={onClose}>
      <IonContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            paddingBottom: 24,
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Placements for Round {id + 1}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={onClose}>
                  <IonIcon slot="icon-only" icon={save} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
  
          <IonGrid className={grid(participants.length)}>
            <div></div>
            {participants.map((part) => (
              <IonItem key={part.id}>
                <IonListHeader>
                  <IonLabel>{part.name}</IonLabel>
                  
                    <IonButton onClick={() => {
                      getState().deleteParticipant(part.id);
                    }}>
                      <IonIcon color="danger" slot="icon-only" icon={closeCircleOutline}/>
                    </IonButton>
              
                  </IonListHeader>
              </IonItem>
            ))}
            {/* TODO: Change this to be a variable amount of courses per race, not just 4 */}
            {[...range(racesPerRound)].map((i) => (
              <Fragment key={i}>
                <div>
                  <IonListHeader>{courses[i].name}</IonListHeader>
                </div>
                {participants.map((participant) => (
                <div key={participant.id}>{
                    selectRank(participant.id, i, id)
                    }</div>
                ))}
              </Fragment>
            ))}
          </IonGrid>
          {
            hasAnyDuplicates() && <IonList style={{ 'background': 'transparent', 'padding-bottom': 16}}>
            {
              [...range(courses.length)].map(c => displayDuplicateErrors(c)).flat()
            }
          </IonList>
          }
          {
            <div className={flex}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <IonButton
                  style={{ marginBottom: "1em" }}
                  color={canSubmit() && results ? "primary" : "dark"}
                  disabled={!(canSubmit() && results)}
                  onClick={() => submitRound()}
                >
                  Submit Round
                </IonButton>
                {submitted && (
                  <IonText color="medium">
                    Round {id + 1} has already been submitted!
                  </IonText>
                )}
              </div>
            </div>
          }
        </div>
      </IonContent>
    </IonModal>
  );
}
