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
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import { useState } from "react";
import { createSeedingRounds } from "../algorithms";
import { Header } from "../components/Header";
import { useStore } from "../store";
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
  const seed = useStore((state) => state.seed);

  const [event, setEvent] = useState("");
  const [participants, setParticipants] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [screens, setScreens] = useState(0);
  const [platformType, setPlatformType] = useState<Platform>(Platform.NONE);

  const onSubmit = () => {
    const allEntered = event && participants && dateTime && screens && platformType !== Platform.NONE;

    if (allEntered) {
      const formattedParticipants: Participant[] = participants
        .split("\n")
        .map((part, i) => ({ id: i, name: part, score: 0 }));
      const formattedDateTime: Date = new Date(dateTime);

      createTournament({
        name: event,
        participants: formattedParticipants,
        startTime: formattedDateTime,
        setupsCount: screens,
        platform: platformType
      });

      seed();

      router.push("/seeding");
    } else {
      console.log("not all filled out");
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
                <IonCardTitle>Create a Tournament</IonCardTitle>
              </IonCardHeader>
              <form>
                <IonItem>
                  <IonLabel position="floating">Event Title</IonLabel>
                  <IonInput
                    onIonChange={(ev) => setEvent(ev.detail.value!)}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel>Date and Time</IonLabel>
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
