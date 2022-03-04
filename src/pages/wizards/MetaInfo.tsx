import {
    IonButton,
    IonDatetime,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPopover,
    IonList,
    IonSelect,
    IonSelectOption
  } from "@ionic/react";
  import { calendarOutline } from "ionicons/icons";
import { Platform } from '../../types/Platform';
import { wizardPage } from '../../utility/css';
import { useState } from 'react';

interface Props {
    dateTime: string,
    setDateTime: (newDate: string) => void; 
    event: string,
    setEvent: (newEvent: string) => void; 
    platform: Platform,
    setPlatform: (newPlat: Platform) => void;
}

export default function MetaInfo({ dateTime, setDateTime, event, setEvent, platform, setPlatform } : Props) {

    const [date, setDate] = useState(dateTime);
    const [eventName, setEventName] = useState(event);
    const [plat, setPlat] = useState(platform);

    return (
        <IonList className={wizardPage}>
            <IonItem>
                <IonLabel position="floating">Event Title</IonLabel>
                <IonInput
                value={eventName}
                onIonChange={(ev) => {
                    setEventName(ev.detail.value!); 
                    setEvent(ev.detail.value!);
                }}
                 />
            </IonItem>
            <IonItem>
                <IonLabel>Date and Time: </IonLabel>
                <IonLabel>{date !== ""
                ? new Date(date).toLocaleString()
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
                    onIonChange={(ev) => {
                        setDateTime(ev.detail.value!);
                        setDate(ev.detail.value!)
                    }}
                />
                </IonPopover>
            </IonItem>
            <IonItem>
                <IonLabel>Platform</IonLabel>
                <IonSelect
                value={plat}
                placeholder="Platform"
                onIonChange={(ev) => {
                    setPlatform(ev.detail.value);
                    setPlat(ev.detail.value);
                }}
                >
                {Object.values(Platform)
                    .filter((platOpt) => !(platOpt === Platform.NONE))
                    .map((platOption, i) => (
                    <IonSelectOption key={i} value={platOption}>{platOption}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
        </IonList>
    )
}