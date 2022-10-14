import { css } from "@emotion/css";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonItem,
  IonPage,
  IonButtons,
  IonIcon,
  IonText,
  useIonRouter,
  useIonToast
} from "@ionic/react";
import { calendarOutline, arrowForward, arrowBack } from "ionicons/icons";
import { useState, useRef } from "react";
import { Header } from "../components/Header";
import { useStore } from "../store";
import Participant from "../types/Participant";
import { Platform } from "../types/Platform";

import MetaInfo from "./wizards/MetaInfo";
import Participants from "./wizards/Participants";
import Advanced from "./wizards/Advanced";
import SeedGenerationAlgorithm from "../types/SeedGenerationAlgorithm.enum";

const wrapper = css`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  width: 100%;
`;

const card = css`
  max-width: 100%;
  width: 600px;
  overflow-y: auto;
`;

const buttonRow = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 16px;
`

const WIZARD_STEPS = 2;

export function Create() {
  const router = useIonRouter();

  const createTournament = useStore((state) => state.createTournament);
  const totalTournaments = useStore(state => state.tournamentList.length);
  const seed = useStore((state) => state.seed);

  // for wizard state
  const formRef = useRef({
    event: "",
    participants: "",
    partsPerRace: 4,
    racesPerRound: 4,
    dateTime: "",
    screens: 1,
    platform: Platform.NONE,
    dlc: false,
    seedGenerationAlgorithm: SeedGenerationAlgorithm.CIRCLE,
  });
  const [step, setStep] = useState(0);
  const [present, dismiss] = useIonToast();

  const allEntered = formRef.current.event
   && formRef.current.participants
   && formRef.current.dateTime
   && formRef.current.screens
   && formRef.current.platform !== Platform.NONE
   && formRef.current.seedGenerationAlgorithm;

  const prevStep = (): void => {
    if(step > 0){
      setStep(step - 1)
    }
  }

  const nextStep = (): void => {
    if(step < WIZARD_STEPS){
      setStep(step + 1);
    }
  }

  const Wizard = () => {
    switch(step) {
      case 0:
        return <MetaInfo dateTime={formRef.current.dateTime} 
        setDateTime={(newDate) => formRef.current.dateTime = newDate} 
        event={formRef.current.event}
        setEvent={(newEvent) => formRef.current.event = newEvent} 
        platform={formRef.current.platform} 
        setPlatform={(newPlat) => formRef.current.platform = newPlat} 
        DLC={formRef.current.dlc}
        setDLC={(newDLC) => formRef.current.dlc = newDLC}
        />;
      case 1:
        return <Participants 
        participants={formRef.current.participants} 
        setParticipants={(newParts) => formRef.current.participants = newParts} 
        screens={formRef.current.screens} 
        setScreens={(newScreens) => formRef.current.screens = newScreens} />;
      case 2:
        return <Advanced 
        partsPerRace={formRef.current.partsPerRace} 
        setPartsPerRace={(newPPR) => formRef.current.partsPerRace = newPPR} 
        racesPerRound={formRef.current.racesPerRound} 
        setRacesPerRound={(newRPR) => formRef.current.racesPerRound = newRPR}
        seedGenerationAlgorithm={formRef.current.seedGenerationAlgorithm}
        setSeedGenerationAlgorithm={(newSGA => formRef.current.seedGenerationAlgorithm = newSGA)} />
      default:
        return <></>;
    }
  } 

  const onSubmit = () => {
    const tooManySetups = Math.ceil(formRef.current.participants.split('\n').length / formRef.current.partsPerRace) < formRef.current.screens;

    if (allEntered) {
      if (tooManySetups) {
        present({message: "Too many setups! You need fewer in order to run the tournament efficiently.",
          duration: 3000,
          color: "danger"});
      } else {
        const participantsStringArr = formRef.current.participants.split("\n");
        const medianRank = Math.floor(participantsStringArr.length / 2);
        const formattedParticipants: Participant[] = participantsStringArr.map((part, i) => ({ id: i, name: part, score: 0}));
        const formattedDateTime: Date = new Date(formRef.current.dateTime);

        createTournament({
          id: totalTournaments + 1,
          name: formRef.current.event,
          participants: formattedParticipants,
          partsPerRound: formRef.current.partsPerRace,
          racesPerRound: formRef.current.racesPerRound,
          startTime: formattedDateTime,
          currRound: 0,
          setupsCount: formRef.current.screens,
          platform: formRef.current.platform,
          // for some fucking reason, this is the only way this works??
          dlc: formRef.current.dlc,
          seedGenerationAlgorithm: formRef.current.seedGenerationAlgorithm,
          currentStandings: formattedParticipants.map(p => ({participant: p, change: 0}))
        });
        // seeding the first round of the tournament
        console.log('created tournament');
        seed(0);

        router.push("/seeding");
      }
    } else {
      present({message: "Oops! You haven't entered all of the required fields!",
      duration: 3000,
      color: "danger"});
    }
  };

  return (
    <IonPage>
      <Header showTestMenu={true}/>
      <IonContent>
        <div className={wrapper}>
          <IonCard className={card}>
            <IonCardContent>
              <IonCardHeader>
                <IonCardTitle><strong>Create a Tournament</strong></IonCardTitle>
              </IonCardHeader>
              <form>
                <Wizard />
                <div className={buttonRow}>
                  <IonButtons>
                    <IonItem>
                      <IonButton onClick={prevStep} disabled={step === 0}>
                        <IonIcon slot="icon-only" icon={arrowBack}/>
                      </IonButton>
                    </IonItem>
                  </IonButtons>
                  <IonItem>
                    <IonButton
                      size="default"
                      style={{ margin: "auto" }}
                      color="success"
                      onClick={onSubmit}
                      disabled={!allEntered}
                    >
                      Submit
                    </IonButton>
                  </IonItem>
                  <IonItem>
                    <IonButtons>
                      <IonButton onClick={nextStep} disabled={step === WIZARD_STEPS}>
                        <IonIcon slot="icon-only" icon={arrowForward}/>
                      </IonButton>
                    </IonButtons>
                  </IonItem>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
