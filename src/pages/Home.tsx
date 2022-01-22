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
import { RoundCard } from "../components/RoundCard";

const content = css`
  display: grid;
  grid-template-rows: 200px 1fr;
  place-items: center;
`;

const card = css`
  width: 600px;
  max-width: 100%;
  height: 100px;
  display: grid;
  place-items: center;
`;

export function Home() {
  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        <div className={content}>
          <IonButton routerLink="/create" size="large" color="primary">
            Create New Tournament
          </IonButton>
          <IonCard className={card}>
            <IonTitle size="large">You don't have any tournaments!</IonTitle>
          </IonCard>
          <RoundCard roundNum={1} eta={new Date()} participants={[{id: 1, name: "test", score: 0}]} />
        </div>
      </IonContent>
    </IonPage>
  );
}
