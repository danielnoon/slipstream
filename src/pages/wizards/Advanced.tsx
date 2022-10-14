import { css } from "@emotion/css";
import {
    IonItem,
    IonLabel,
    IonRange,
    IonList,
    IonSelect,
    IonSelectOption,
  } from "@ionic/react";
import { useState } from "react";
import SeedGenerationAlgorithm from "../../types/SeedGenerationAlgorithm.enum";
import { selectableRange } from '../../utility/css';
import { wizardPage } from '../../utility/css';


interface Props {
    partsPerRace: number,
    setPartsPerRace: (newPPR: number) => void,
    racesPerRound: number,
    setRacesPerRound: (newRPR: number) => void,
    seedGenerationAlgorithm: SeedGenerationAlgorithm,
    setSeedGenerationAlgorithm: (newSGA: SeedGenerationAlgorithm) => void
}

export default function Advanced(
    { 
        partsPerRace, 
        setPartsPerRace, 
        racesPerRound, 
        setRacesPerRound, 
        seedGenerationAlgorithm, 
        setSeedGenerationAlgorithm 
    } : Props) {

    const [PPR, setPPR] = useState(partsPerRace);
    const [RPR, setRPR] = useState(racesPerRound);
    const [SGA, setSGA] = useState(seedGenerationAlgorithm);

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
                value={PPR}
                onIonChange={(ev) => {
                    setPartsPerRace(ev.detail.value as number);
                    setPPR(ev.detail.value as number);
                }}
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
                value={RPR}
                onIonChange={(ev) => {
                    setRacesPerRound(ev.detail.value as number);
                    setRPR(ev.detail.value as number);
                }}
                className={selectableRange}
            >
                <IonLabel slot="start">1</IonLabel>
                <IonLabel slot="end">8</IonLabel>
            </IonRange>
            <IonItem>
                <IonLabel>Round Generation Method</IonLabel>
                <IonSelect
                value={SGA}
                placeholder="Select a Method..."
                onIonChange={(ev) => {
                    setSGA(ev.detail.value);
                    setSeedGenerationAlgorithm(ev.detail.value);
                }}
                >
                {Object.values(SeedGenerationAlgorithm)
                    .map((sga, i) => (
                    <IonSelectOption key={i} value={sga}>{sga}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
        </IonList>
    )
}