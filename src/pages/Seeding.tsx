import { css } from "@emotion/css";
import { IonPage, IonContent, IonRedirect, useIonRouter } from "@ionic/react";
import { Header } from "../components/Header";
import { RoundCard } from "../components/RoundCard";
import { SetupLabel } from "../components/SetupLabel";
import { useStore } from "../store";

const roundsWrapper = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export function Seeding() {
  const tournament = useStore((state) => state.tournament);
  const setups = useStore((state) => state.setups);
  const router = useIonRouter();

  if (!tournament) {
    router.push("/");
    return null;
  }

  return (
    <IonPage>
      <Header title={tournament?.name} showLeaderboard />
      <IonContent className="ion-padding">
        {setups.map((setup, i) => (
          <div key={i}>
            <SetupLabel label={"Setup " + (setup.id + 1)} />
            <div className={roundsWrapper}>
              {setup.rounds.map((round, i) => (
                <RoundCard key={round.id} {...round} />
              ))}
            </div>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
}
