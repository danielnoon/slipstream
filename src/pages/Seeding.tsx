import { css } from "@emotion/css";
import { IonPage, IonContent, IonRedirect, useIonRouter, IonButton } from "@ionic/react";
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
  const rounds = useStore(state => state.rounds);
  const router = useIonRouter();

  const canContinue = (): boolean => {
    const results = [...rounds.values()].map(round => round.result);
    const totalRounds = tournament!.participants.length * 4;
    let totalCount = 0;
    for (let result of results) {
      if (!result) {
        return false;
      }
      totalCount += result.raceResults.reduce(
        (prev, curr) => prev + curr.size,
        0
      );
    }

    return totalRounds === totalCount;
  }

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
        {canContinue() &&
          <IonButton onClick={() => router.push("/elims")}>
            Continue to Elims
          </IonButton>
        }
      </IonContent>
    </IonPage>
  );
}
