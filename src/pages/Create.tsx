import { css } from "@emotion/css";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

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
  return (
    <>
      <IonPage>
        <div className={wrapper}>
          <IonCard className={card}>
            <IonCardContent>
              <IonCardHeader>
                <IonCardTitle>Create a Tournament</IonCardTitle>
              </IonCardHeader>
              <form>
                <IonItem>
                  <IonLabel position="floating">Event Title</IonLabel>
                  <IonInput></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Participants</IonLabel>
                  <IonTextarea autoGrow></IonTextarea>
                </IonItem>
                <IonDatetime></IonDatetime>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonPage>
    </>
  );
}
