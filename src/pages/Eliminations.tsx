import { css } from "@emotion/css";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { getState, useStore } from "../store";

const card = css`
  max-width: 100%;
  width: 600px;
  position: relative;
  display: block;
  position: absolute;
  transition: all 0.3s ease-in-out;
`;

const eliminateButton = css`
  border-radius: 100px;
  font-size: 1rem;
`;

const cardContent = css`
  padding: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const name = css`
  font-size: 32px;
`;

const cardWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;
`;

interface SeededParticipant {
  id: number;
  seed: number;
}

const testData: SeededParticipant[] = [
  { id: 0, seed: 1 },
  { id: 1, seed: 2 },
  { id: 2, seed: 3 },
  { id: 3, seed: 4 },
  { id: 4, seed: 5 },
  { id: 5, seed: 6 },
  { id: 6, seed: 7 },
  { id: 7, seed: 8 },
  { id: 8, seed: 9 },
];

const PADDING = 16;

export function Eliminations() {
  const tournament = useStore((state) => state.tournament);

  const [active, setActive] = useState(testData.slice(-4));
  const [above, setAbove] = useState(testData.slice(0, -4));
  const [below, setBelow] = useState([] as SeededParticipant[]);

  useEffect(() => {
    const els = testData.map((p) => document.getElementById(`p-${p.id}`));
    const height = els[0]?.getBoundingClientRect().height;
    if (height) {
      const activeHeight = active.length * (height + PADDING) + PADDING;
      const activeX = window.innerHeight / 2 - activeHeight / 2;
      active.forEach((card, i) => {
        const el = document.getElementById(`p-${card.id}`)!;
        el.style.top = `${activeX + (height + PADDING) * i}px`;
      });
      above
        .slice()
        .reverse()
        .forEach((card, i) => {
          const el = document.getElementById(`p-${card.id}`)!;
          el.style.top = `${activeX - (height + PADDING) * (i + 1)}px`;
        });
      below.forEach((card, i) => {
        const el = document.getElementById(`p-${card.id}`)!;
        el.style.top = `${activeX + activeHeight + (height + PADDING) * i - PADDING
          }px`;
      });
    }
  }, [active, above, below]);

  function eliminatePlayer(id: number) {
    const newBelow = [...below, testData.find((p) => p.id === id)!];
    const newActive = active.filter((p) => p.id !== id);
    setBelow(newBelow);
    setActive(newActive);
    const oldAbove = above.at(-1);
    if (oldAbove) {
      setAbove(above.slice(0, -1));
      setActive([oldAbove, ...newActive]);
    }
  }

  return (
    <IonPage>
      <Header title={tournament?.name} showLeaderboard />
      <IonContent className="ion-padding">
        <div className={cardWrapper}>
          {testData.map((participant) => (
            <IonCard
              key={participant.id}
              className={card}
              id={`p-${participant.id}`}
              color={
                active.find((a) => participant.id === a.id)
                  ? "success"
                  : below.find((b) => participant.id === b.id)
                    ? "danger"
                    : "light"
              }
            >
              <IonCardContent className={cardContent}>
                <span className={name}>
                  {participant.seed}{" "}
                  {getState().participants.get(participant.id)?.name}
                </span>
                {active.find((a) => participant.id === a.id) && (
                  <IonButton
                    size="small"
                    fill="clear"
                    color="light"
                    className={eliminateButton}
                    onClick={() => eliminatePlayer(participant.id)}
                  >
                    <IonIcon slot="icon-only" icon={close} />
                  </IonButton>
                )}
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
