import { css } from "@emotion/css";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNavLink,
  IonPage,
  IonRange,
  IonRouterLink,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { Header } from "../components/Header";

const content = css`
display: flex;
margin: 0 auto;
justify-content: center;
width: 100%;
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

const modal = css`
--min-width: 800px;
--height: 32em;
`;

const TestPage = () => {

  const router = useIonRouter();

  return (
      <IonPage>
        <Header />
        <IonContent>
          <div className={content}>
            <IonCard className={card}>
              <IonCardContent>
                <IonCardHeader>
                  <IonCardTitle><strong>Test Menu</strong></IonCardTitle>
                </IonCardHeader>
                <IonItem>
                  <IonButton
                    size="default"
                    style={{ margin: "auto" }}
                    color="success"
                    onClick={() => router.push("/coursetest")}
                  >
                    Generate Courses Test
                  </IonButton>
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    )

}

export default TestPage