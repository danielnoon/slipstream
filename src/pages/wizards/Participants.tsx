import {
    IonItem,
    IonLabel,
    IonTextarea,
    IonList,
    IonRange
} from "@ionic/react";
import { selectableRange } from '../../utility/css';
import { wizardPage } from '../../utility/css';


interface Props {
    setParticipants: React.Dispatch<React.SetStateAction<string>>,
    screens: number,
    setScreens: React.Dispatch<React.SetStateAction<number>>
}

export default function Participants({ setParticipants, screens, setScreens } : Props) {
    return (
        <IonList className={wizardPage}>
            <IonItem>
                <IonLabel position="floating">Participants</IonLabel>
                <IonTextarea
                placeholder="Enter Participants Here"
                autoGrow
                onIonChange={(ev) => setParticipants(ev.detail.value!)}
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
                  value={screens}
                  onIonChange={(ev) => setScreens(ev.detail.value as number)}
                  className={selectableRange}
                >
                  <IonLabel slot="start">1</IonLabel>
                  <IonLabel slot="end">10</IonLabel>
                </IonRange>
        </IonList>
    )
}