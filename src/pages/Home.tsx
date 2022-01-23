import { css } from "@emotion/css";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonIcon,
  IonItem,
  IonNavLink,
  IonPage,
  IonRouterLink,
  IonTitle,
  useIonRouter,
} from "@ionic/react";
import { arrowForward, list } from "ionicons/icons";
import { Header } from "../components/Header";
import { Leaderboard } from "../components/Leaderboard";
import { ScoreEntryModal } from "../components/ScoreEntryModal";
import { load, useStore } from "../store";

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

export function Home() {
  const tournaments = useStore((state) => state.tournamentList);
  const router = useIonRouter();

  function openTournament(id: number) {
    load(id);
    router.push("/seeding");
  }

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
              {!tournaments && (
                <div className="center">
                  <IonTitle size="large">
                    You don't have any tournaments!
                  </IonTitle>
                </div>
              )}
              {tournaments &&
                tournaments.map((tournament) => (
                  <IonItem
                    key={tournament.id}
                    className={listing}
                    button
                    onClick={() => openTournament(tournament.id)}
                  >
                    {tournament.name}
                    <IonIcon
                      color="dark"
                      slot="end"
                      size="large"
                      icon={arrowForward}
                    />
                  </IonItem>
                ))}
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
