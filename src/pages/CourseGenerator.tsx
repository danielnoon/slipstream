import { css } from "@emotion/css";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNavLink,
  IonPage,
  IonRouterLink,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { Header } from "../components/Header";
import { Platform } from "../types/Platform";

const content = css`
  display: grid;
  grid-template-rows: 200px 1fr;
  place-items: center;
  width: 100vw;
  margin-top: 20px;

  & > .card-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const card = css`
  width: 600px;
  max-width: calc(100vw - 40px);
  & > .center {
    height: 100px;
    display: grid;
    place-items: center;
  }
`;

const listing = css`
  font-size: 32px;
  --inner-padding-top: 12px;
  --inner-padding-bottom: 12px;
  --inner-padding-start: 16px;
  --inner-padding-end: 16px;
`;


const CourseGenerator = () => {

  const [platform, setPlatform] = useState(Platform.NONE)
  const [plat, setPlat] = useState(platform)

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div>
          <IonCard className={card}>
            <IonCardContent>
              <IonCardHeader>
                <IonCardTitle><strong>Create a Tournament</strong></IonCardTitle>
              </IonCardHeader>
              <IonItem>
                <IonLabel>Threshold</IonLabel>
                <IonInput
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
              <IonItem>
                <IonButton
                  size="default"
                  style={{ margin: "auto" }}
                  color="success"
                  onClick={onSubmit}
                  disabled={!allEntered}
                >
                  Generate Courses
                </IonButton>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  )


}

export default CourseGenerator