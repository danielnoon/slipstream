import { css } from "@emotion/css";
import { IonPage, IonContent } from "@ionic/react";
import { Header } from "../components/Header";
import { RoundCard } from "../components/RoundCard";
import { useStore } from "../store";

const roundsWrapper = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export function Seeding() {
  const tournament = useStore((state) => state.tournament);
  const setups = useStore((state) => state.setups);

  return (
    <IonPage>
      <Header title={tournament?.name} />
      <IonContent>
        {setups.map((setup, i) => (
          <div key={i}>
            <h2>Setup {setup.id + 1}</h2>
            <div className={roundsWrapper}>
              {setup.rounds.map((round, i) => (
                <RoundCard
                  key={round.id}
                  {...round}
                  onClick={() => console.log("hai")}
                />
              ))}
            </div>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
}
