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
} from "@ionic/react";
import { calendarOutline, arrowForward, arrowBack } from "ionicons/icons";
import { useState } from "react";
import { Header } from "../components/Header";
import { useStore } from "../store";
import Participant from "../types/Participant";
import { Platform } from "../types/Platform";

import MetaInfo from "./wizards/MetaInfo";
import Participants from "./wizards/Participants";
import Advanced from "./wizards/Advanced";

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
  const [step, setStep] = useState(0);
  const [event, setEvent] = useState("");
  const [participants, setParticipants] = useState("");
  const [partsPerRace, setPartsPerRace] = useState(4);
  const [racesPerRound, setRacesPerRound] = useState(4);
  const [dateTime, setDateTime] = useState("");
  const [screens, setScreens] = useState(1);
  const [platform, setPlatform] = useState<Platform>(Platform.NONE);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        return <MetaInfo dateTime={dateTime} setDateTime={setDateTime} setEvent={setEvent} platform={platform} setPlatform={setPlatform} />;
      case 1:
        return <Participants setParticipants={setParticipants} screens={screens} setScreens={setScreens} />;
      case 2:
        return <Advanced partsPerRace={partsPerRace} setPartsPerRace={setPartsPerRace} racesPerRound={racesPerRound} setRacesPerRound={setRacesPerRound} />
      default:
        return <></>;
    }
  } 

  const onSubmit = () => {
    const allEntered = event && participants && dateTime && screens && platform !== Platform.NONE;
    const tooManySetups = Math.ceil(participants.split('\n').length / partsPerRace) < screens;

    if (allEntered) {
      if (tooManySetups) {
        setIsErrorShown(true);
        setErrorMessage("Too many setups! You need fewer in order to run the tournament efficiently.");
      } else {
        setIsErrorShown(false);
        const formattedParticipants: Participant[] = participants
          .split("\n")
          .map((part, i) => ({ id: i, name: part, score: 0 }));
        const formattedDateTime: Date = new Date(dateTime);

        createTournament({
          id: totalTournaments + 1,
          name: event,
          participants: formattedParticipants,
          partsPerRound: partsPerRace,
          racesPerRound: racesPerRound,
          startTime: formattedDateTime,
          currRound: 0,
          setupsCount: screens,
          platform: platform
        });
        // seeding the first round of the tournament
        seed(0);

        router.push("/seeding");
      }
    } else {
      setIsErrorShown(true);
      setErrorMessage("Oops! You haven't entered all of the required fields!");
    }
  };

  return (
    <IonPage>
      <Header />
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
                    {isErrorShown && <IonText color="danger">{errorMessage}</IonText>}
                    <IonButton
                      size="default"
                      style={{ margin: "auto" }}
                      color="success"
                      onClick={onSubmit}
                      disabled={isErrorShown}
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
