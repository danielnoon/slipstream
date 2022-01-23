import { css } from "@emotion/css";
import {
  IonButton,
  IonCard,
  IonContent,
  IonNavLink,
  IonPage,
  IonRouterLink,
  IonTitle,
} from "@ionic/react";
import { Header } from "../components/Header";
import { ScoreEntryModal } from "../components/ScoreEntryModal";

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
  height: 100px;
  display: grid;
  place-items: center;
`;

export function Home() {
  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className={content}>
          <IonButton routerLink="/create" size="large" color="primary">
            Create New Tournament
          </IonButton>
          <div className="card-wrapper">
            <IonCard className={card}>
              <IonTitle size="large">You don't have any tournaments!</IonTitle>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
