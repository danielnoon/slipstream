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
    IonSelectOption,
    IonToggle
  } from "@ionic/react";
  import { calendarOutline } from "ionicons/icons";
import { Platform } from '../../types/Platform';
import { wizardPage } from '../../utility/css';
import { useState } from 'react';
import { createPortal } from "react-dom";

import { prefersDarkTheme } from "../../darkTheme";


import ReactTooltip from "react-tooltip";


interface Props {
    dateTime: string,
    setDateTime: (newDate: string) => void; 
    event: string,
    setEvent: (newEvent: string) => void; 
    platform: Platform,
    setPlatform: (newPlat: Platform) => void;
    DLC: boolean,
    setDLC: (newDLC: boolean) => void
}

export default function MetaInfo({ dateTime, setDateTime, event, setEvent, platform, setPlatform, DLC, setDLC } : Props) {

    const [date, setDate] = useState(dateTime);
    const [eventName, setEventName] = useState(event);
    const [plat, setPlat] = useState(platform);
    const [dlc, setDlc] = useState(DLC);

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
            {
                plat === Platform.Switch &&
                <IonItem>
                <IonLabel>DLC</IonLabel>
                <IonToggle
                checked={dlc}
                onIonChange={(ev) => {
                    // idk why, but its reversed otherwise so this works
                    setDlc(ev.detail.checked);
                    setDLC(ev.detail.checked);
                }}
                />
            </IonItem>
            }
        </IonList>
    )
}
