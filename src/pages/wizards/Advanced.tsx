import { css } from "@emotion/css";
import {
    IonItem,
    IonLabel,
    IonRange,
    IonList
  } from "@ionic/react";
  import { calendarOutline } from "ionicons/icons";
import { Platform } from '../../types/Platform';
import { selectableRange } from '../../utility/css';
import { wizardPage } from '../../utility/css';


interface Props {
    partsPerRace: number,
    setPartsPerRace: React.Dispatch<React.SetStateAction<number>>,
    racesPerRound: number,
    setRacesPerRound: React.Dispatch<React.SetStateAction<number>>,
}

export default function Advanced({ partsPerRace, setPartsPerRace, racesPerRound, setRacesPerRound } : Props) {
    return (
        <IonList className={wizardPage}>
            <IonItem lines="none" style={{marginBottom: 0}}>
                <IonLabel>Participants-Per-Race</IonLabel>
            </IonItem>
            <IonRange
                min={2}
                max={12}
                snaps={true}
                pin
                value={partsPerRace}
                onIonChange={(ev) => setPartsPerRace(ev.detail.value as number)}
                className={selectableRange}
            >
                <IonLabel slot="start">2</IonLabel>
                <IonLabel slot="end">12</IonLabel>
            </IonRange>
            <IonItem lines="none" style={{marginBottom: 0}}>
                <IonLabel>Races-Per-Round</IonLabel>
            </IonItem>
            <IonRange
                min={1}
                max={8}
                snaps={true}
                pin
                value={racesPerRound}
                onIonChange={(ev) => setRacesPerRound(ev.detail.value as number)}
                className={selectableRange}
            >
                <IonLabel slot="start">1</IonLabel>
                <IonLabel slot="end">8</IonLabel>
            </IonRange>
        </IonList>
    )
}