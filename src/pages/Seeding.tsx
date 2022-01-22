import { css } from "@emotion/css";
import { IonPage, IonContent } from "@ionic/react";
import { Header } from "../components/Header";
import { RoundCard } from "../components/RoundCard";
import { useStore } from "../store";

const roundsWrapper = css`
  display: flex;
  flex-direction: row;
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
            <h2>Setup {setup.id}</h2>
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
