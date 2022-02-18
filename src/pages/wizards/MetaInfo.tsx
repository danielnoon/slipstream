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

interface Props {
    dateTime: string,
    setDateTime: React.Dispatch<React.SetStateAction<string>>
    setEvent: React.Dispatch<React.SetStateAction<string>>
    platform: Platform,
    setPlatform: React.Dispatch<React.SetStateAction<Platform>>
}

export default function MetaInfo({ dateTime, setDateTime, setEvent, platform, setPlatform } : Props) {
    return (
        <IonList className={wizardPage}>
            <IonItem>
                <IonLabel position="floating">Event Title</IonLabel>
                <IonInput
                onIonChange={(ev) => setEvent(ev.detail.value!)}
                 />
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
                <IonLabel>Platform</IonLabel>
                <IonSelect
                value={platform}
                placeholder="Platform"
                onIonChange={(ev) => setPlatform(ev.detail.value)}
                >
                {Object.values(Platform)
                    .filter((plat) => !(plat === Platform.NONE))
                    .map((plat, i) => (
                    <IonSelectOption key={i} value={plat}>{plat}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
        </IonList>
    )
}