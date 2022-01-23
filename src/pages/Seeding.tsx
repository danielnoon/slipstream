import { css } from "@emotion/css";
import { IonPage, IonContent, IonRedirect, useIonRouter, IonButton, IonItem, IonFooter, IonToolbar, IonButtons } from "@ionic/react";
import ReactTooltip from "react-tooltip";
import { Header } from "../components/Header";
import { RoundCard } from "../components/RoundCard";
import { SetupLabel } from "../components/SetupLabel";
import { prefersDarkTheme } from "../darkTheme";
import { useStore } from "../store";

const roundsWrapper = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const buttonWrapper = css`
  display: flex;
  flex-direction: row-reverse;
  position: fixed;
  bottom: 0%;
  width: 100%;
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
      </IonContent>
      <div className={buttonWrapper}>
        <div style={{ width: "min-content", margin: "30px" }}
          data-tip
          data-for="continueTip">
          <IonButton
            style={{ position: "relative" }}
            size="large"
            color={canContinue() ? "primary" : "dark"}
            disabled={!canContinue()}
            onClick={() => router.push("/elims")}
          >
            Continue to Elims
          </IonButton>
        </div>
        {!canContinue() &&
          <ReactTooltip
            id="continueTip"
            type={prefersDarkTheme() ? "light" : "dark"}
          >
            Finish all rounds to continue!
          </ReactTooltip>
        }
      </div>
    </IonPage>
  );
}
