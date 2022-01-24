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
import { groupby, range, flatten } from "itertools";
import React, { useState, Fragment } from "react";
import { useStore, select, getRound } from "../store";
import { uploadRoundResult } from "../algorithms";
import { current } from "immer";
import { save } from "ionicons/icons";

const modal = css`
  --width: 800px;
  --height: 32em;
`;

const grid = (players: number) => css`
  display: grid;
  grid-template-columns: 12em repeat(${players}, 1fr);
  grid-template-rows: repeat(5, 4em);
  width: 100%;
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
  const [submitted, setSubmitted] = useState(false);
  const [presentSubmitWarning] = useIonAlert();

  const canSubmit = (): boolean => {
    const requiredEntries = participants.length * 4;
    let entriesCount = 0;
    if (results) {
      entriesCount = results.raceResults.reduce(
        (prev, curr) => prev + curr.size,
        0
      );
    }
    return entriesCount === requiredEntries && !submitted;
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
            uploadRoundResult(results!);
            setSubmitted(true);
            onClose?.();
          },
        },
      ],
      onDidDismiss: (e) => console.log("did dismiss"),
    });
  };

  const ordinalsMap = ["1st", "2nd", "3rd", "4th"];

  const selectRank = (playerID: number, match: number, round_id: number) => {
    const raceResult = results?.raceResults[match]?.get(playerID);
    return (
      <IonSelect
        value={raceResult?.rank}
        placeholder="Result"
        onIonChange={(ev) =>
          setRaceResult(id, match, playerID, ev.detail.value)
        }
      >
        {[...range(participants.length)].map((i) => {
          return (
            <IonSelectOption value={i} key={i} disabled={submitted}>
              {ordinalsMap[i]}
            </IonSelectOption>
          );
        })}
      </IonSelect>
    );
  };

  const duplicateRanks = (round_id: number, match: number) => {
    const round = select(getRound(round_id));
    const errorEls = [];
    if(round && round.result){
      console.log([...[...round.result.raceResults][match].values()])
      const course = round.courses;
      const finishes = [...[...round.result.raceResults][match].values()].sort((a, b) => a.rank - b.rank);
      const groups = groupby(finishes, (finish) => finish.rank);
      for(const [key, value] of groups){
        const sharedRank = [...value]
        console.log(sharedRank);
        if(sharedRank.length > 1){
          const guiltyParticipants = [...sharedRank.map(result => participants.find((p) => p.id === result.participant)?.name)].join(", ");
          const errorItem = <IonItem>
            <IonLabel color="danger">
            {`Error: ${guiltyParticipants} in Race #${match} cannot ${sharedRank.length === 2 ? "both" : "all"} finish ${ordinalsMap[key]}!`}
            </IonLabel>
            </IonItem>;
          errorEls.push(errorItem);
          // console.log(``)
          // console.log(participants);
        }
      }
    }
    return errorEls;
  }

  // const renderSubmitWarning = (warnProps: Props) => {
  //   const {id: warnId, isOpen: warnIsOpen, onClose: warnOnClose} = warnProps;

  //   const onWarningClose = () => {
  //     warnOnClose!();
  //   }

  //   return (
  //     <IonAlert message="Hello" isOpen={warnIsOpen} onDidDismiss={warnOnClose} />
  //   )
  // }

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
                <IonListHeader>{part.name}</IonListHeader>
              </IonItem>
            ))}
            {[...range(4)].map((i) => (
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
          <IonList>
            {
              // for now only displaying errors from Race # 1 in each round
              duplicateRanks(id, 0)
            }
          </IonList>
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
