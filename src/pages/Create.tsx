import { css } from "@emotion/css";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonPopover,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import { useState } from "react";
import { createSwissSeedingRounds } from "../algorithms";
import { Header } from "../components/Header";
import { getRound, useStore } from "../store";
import Participant from "../types/Participant";
import { Platform } from "../types/Platform";

const wrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const card = css`
  max-width: 100%;
  width: 600px;
`;

export function Create() {
  const router = useIonRouter();

  const createTournament = useStore((state) => state.createTournament);
  const totalTournaments = useStore(state => state.tournamentList.length);
  const seed = useStore((state) => state.seed);

  const [event, setEvent] = useState("");
  const [participants, setParticipants] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [screens, setScreens] = useState(0);
  const [platformType, setPlatformType] = useState<Platform>(Platform.NONE);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = () => {
    const allEntered = event && participants && dateTime && screens && platformType !== Platform.NONE;
    const tooManySetups = Math.ceil(participants.split('\n').length / 4) < screens;

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
          startTime: formattedDateTime,
          currRound: 0,
          setupsCount: screens,
          platform: platformType
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

  const SetupSelector = css`
  padding-top:25px;
  `;

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
                <IonItem>
                  <IonLabel position="floating">Event Title</IonLabel>
                  <IonInput
                    onIonChange={(ev) => setEvent(ev.detail.value!)}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel>Date and Time: </IonLabel>
                  <IonLabel>{dateTime !== ""
                    ? new Date(dateTime).toLocaleString()
                    : ""
                  }</IonLabel>
                  <IonButton fill="clear" id="trigger-button">
                    <IonIcon slot="icon-only" icon={calendarOutline} />
                  </IonButton>
                  <IonPopover
                    trigger="trigger-button"
                    side="top"
                    alignment="end"
                  >
                    <IonDatetime
                      onIonChange={(ev) => setDateTime(ev.detail.value!)}
                    />
                  </IonPopover>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Participants</IonLabel>
                  <IonTextarea
                    autoGrow
                    onIonChange={(ev) => setParticipants(ev.detail.value!)}
                  ></IonTextarea>
                </IonItem>
                <IonItem>
                  <IonLabel>Available Screens</IonLabel>
                  <IonRange
                    min={1}
                    max={10}
                    snaps={true}
                    pin
                    onIonChange={(ev) => setScreens(ev.detail.value as number)}
                    className={SetupSelector}
                  >
                    <IonLabel slot="start">1</IonLabel>
                    <IonLabel slot="end">10</IonLabel>
                  </IonRange>
                </IonItem>
                <IonItem>
                  <IonLabel>Platform</IonLabel>
                  <IonSelect
                    value={platformType}
                    placeholder="Platform"
                    onIonChange={(ev) => setPlatformType(ev.detail.value)}
                  >
                    {Object.values(Platform)
                      .filter((plat) => !(plat === Platform.NONE))
                      .map((plat, i) => (
                        <IonSelectOption key={i} value={plat}>{plat}</IonSelectOption>
                      ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  {isErrorShown && <IonText color="danger">{errorMessage}</IonText>}
                  <IonButton
                    size="default"
                    style={{ margin: "auto" }}
                    onClick={onSubmit}
                  >
                    Submit
                  </IonButton>
                </IonItem>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
