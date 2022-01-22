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
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { calendarOutline } from "ionicons/icons"
import { useState } from "react";
import { Header } from "../components/Header";
import { useStore } from "../store";
import Participant from "../types/Participant"

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

  const createTournament = useStore(state => state.createTournament);
  const [event, setEvent] = useState("");
  const [participants, setParticipants] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [screens, setScreens] = useState(0);

  const onSubmit = () => {
    const formattedParticipants : Participant[] = participants.split("\n").map((part, i) => ({id: i, name: part, score: 0}));
    const formattedDateTime : Date = new Date(dateTime);
    createTournament({name: event, participants: formattedParticipants, startTime: formattedDateTime, setupsCount: screens});
    console.log(useStore.getState().tournament);
  }

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
                  <IonInput onIonChange={ev => setEvent(ev.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Participants</IonLabel>
                  <IonTextarea autoGrow onIonChange={ev => setParticipants(ev.detail.value!)}></IonTextarea>
                </IonItem>
                <IonItem>
                  <IonLabel>Date and Time</IonLabel>
                  <IonButton fill="clear" id="trigger-button">
                    <IonIcon slot="icon-only" icon={calendarOutline} />
                  </IonButton>
                  <IonPopover trigger="trigger-button" side="top" alignment="end">
                    <IonDatetime onIonChange={ev => setDateTime(ev.detail.value!)}/>
                  </IonPopover>
                </IonItem>
                <IonItem>
                  <IonLabel>Available Screens</IonLabel>
                  <IonRange min={0} max={10} snaps={true} pin onIonChange={ev => setScreens(ev.detail.value as number)}>
                    <IonLabel slot="start">0</IonLabel>
                    <IonLabel slot="end">10</IonLabel>
                  </IonRange>
                </IonItem>
                <IonItem>
                  <IonButton size="default" style={{margin: "auto"}} onClick={onSubmit}>Submit</IonButton>
                </IonItem>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
