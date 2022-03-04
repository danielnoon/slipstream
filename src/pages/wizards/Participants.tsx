import {
    IonItem,
    IonLabel,
    IonTextarea,
    IonList,
    IonRange
} from "@ionic/react";
import { useState } from "react";
import { selectableRange } from '../../utility/css';
import { wizardPage } from '../../utility/css';


interface Props {
    participants: string,
    setParticipants: (newParts: string) => void,
    screens: number,
    setScreens: (newScreens: number) => void
}

export default function Participants({ participants, setParticipants, screens, setScreens } : Props) {

    const [parts, setParts] = useState(participants);
    const [scrns, setScrns] = useState(screens);

    return (
        <IonList className={wizardPage}>
            <IonItem>
                <IonLabel position="floating">Participants</IonLabel>
                <IonTextarea
                value={parts}
                placeholder="Enter Participants Here"
                autoGrow
                onIonChange={(ev) => {
                    setParticipants(ev.detail.value!);
                    setParts(ev.detail.value!);
                }}
                ></IonTextarea>
            </IonItem>
            <IonItem lines="none" style={{marginBottom: 0}}>
                  <IonLabel>Available Screens</IonLabel>
                </IonItem>
                <IonRange
                  min={1}
                  max={10}
                  snaps={true}
                  pin
                  value={scrns}
                  onIonChange={(ev) => {
                      setScreens(ev.detail.value as number);
                      setScrns(ev.detail.value as number);
                  }}
                  className={selectableRange}
                >
                  <IonLabel slot="start">1</IonLabel>
                  <IonLabel slot="end">10</IonLabel>
                </IonRange>
        </IonList>
    )
}