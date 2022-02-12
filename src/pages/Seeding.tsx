import { css } from "@emotion/css";
import { IonPage, IonContent, IonRedirect, useIonRouter, IonButton, IonItem, IonFooter, IonToolbar, IonButtons } from "@ionic/react";
import ReactTooltip from "react-tooltip";
import { Header } from "../components/Header";
import { RoundCard } from "../components/RoundCard";
import { SetupLabel } from "../components/SetupLabel";
import { prefersDarkTheme } from "../darkTheme";
import { useStore, getState } from "../store";

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
    // true if every round has been submitted, false if not
    return [...rounds.values()].every(r => r.submitted)
  }

  if (!tournament) {
    router.push("/");
    return null;
  }
  return (
    <IonPage>
      <Header title={tournament?.name} showLeaderboard currentRound={tournament.currRound}/>
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
        <div style={{display: 'flex'}}>
          <div style={{ width: "min-content", margin: "30px" }}
            data-tip
            data-for="reseedTip">
            <IonButton
              style={{ position: "relative" }}
              size="large"
              color="warning"
              onClick={() => getState().seed(tournament.currRound)}
            >
              Next Round
            </IonButton>
          </div>
          {
            <ReactTooltip
              id="reseedTip"
              type={prefersDarkTheme() ? "light" : "dark"}
            >
              Generate another seeding round for this tournament
            </ReactTooltip>
          }
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
          {canContinue() &&
            <ReactTooltip
              id="continueTip"
              type={prefersDarkTheme() ? "light" : "dark"}
            >
              Finish all rounds to continue!
            </ReactTooltip>
          }
        </div>
      </div>
    </IonPage>
  );
}
