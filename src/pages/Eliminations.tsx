import { css, keyframes } from "@emotion/css";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { close, trophy } from "ionicons/icons";
import { useEffect, useState } from "react";
import { participantSorter } from "../algorithms";
import { Header } from "../components/Header";
import { getState, useStore } from "../store";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const card = css`
  max-width: 100%;
  width: 600px;
  position: relative;
  display: block;
  position: absolute;
  transition: all 0.3s ease-in-out;
  animation: ${fadeIn} 200ms ease-out;
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

const placeName = css`
  font-size: 27px;
  font-weight: 600;
  padding-left: 5px;
`;

const awardName = css`
  padding-left: 5px;
`;

interface SeededParticipant {
  id: number;
  seed: number;
}

const PADDING = 16;

export function Eliminations() {
  const tournament = useStore(state => state.tournament);
  const participants = useStore((state) => [...state.participants.values()]);
  const [seededParticipants, setSeededParticipants] = useState([] as SeededParticipant[]);

  // stateful vars of participants in elims view
  const [active, setActive] = useState([] as SeededParticipant[]);
  const [above, setAbove] = useState([] as SeededParticipant[]);
  const [below, setBelow] = useState([] as SeededParticipant[]);

  const [awardThird, setAwardThird] = useState(-1);
  const [awardSecond, setAwardSecond] = useState(-1);
  const [awardFirst, setAwardFirst] = useState(-1);

  const [placeToAward, setPlaceToAward] = useState("Award 3rd");

  useEffect(() => {
    requestAnimationFrame(() => {
      const els = seededParticipants.map((p) =>
        document.getElementById(`p-${p.id}`)
      ).filter(el => el);
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
    })

  }, [active, above, below]);

  useIonViewDidEnter(() => {
    const participants = [...getState().participants.values()];
    const seededParticipants: SeededParticipant[] =
      participants
        .slice()
        .sort(participantSorter)
        .map((part, i) => ({
          id: part.id,
          seed: i,
        }));
    setSeededParticipants(seededParticipants);
    setActive(seededParticipants.slice(-4));
    setAbove(seededParticipants.slice(0, -4));
  });

  useIonViewWillEnter(() => {
    setSeededParticipants([]);
    setActive([]);
    setAbove([]);
    setBelow([]);
    setAwardFirst(-1);
    setAwardSecond(-1);
    setAwardThird(-1);
  })

  function eliminatePlayer(id: number) {
    const newBelow = [seededParticipants!.find((p) => p.id === id)!, ...below];
    const newActive = active.filter((p) => p.id !== id);
    setBelow(newBelow);
    setActive(newActive);
    const oldAbove = above.at(-1);
    if (oldAbove) {
      setAbove(above.slice(0, -1));
      setActive([oldAbove, ...newActive]);
    }
  }

  function awardPlace(participant: SeededParticipant) {
    if (awardThird === -1) {
      setAwardThird(participant.id);
      setPlaceToAward("Award 2nd");
    } else if (awardSecond === -1 && awardThird != participant.id) {
      setAwardSecond(participant.id);
      setPlaceToAward("Award 1st");
    } else if (awardFirst === -1 && awardSecond != participant.id) {
      if (awardThird != participant.id) {
        setAwardFirst(participant.id);
      }
    }
  }

  function getColors(id: number) {
    if (id === awardThird) {
      return ["#cd7f32", "white"];
    }
    if (id === awardSecond) {
      return ["#aaa9ad", "black"];
    }
    if (id === awardFirst) {
      return ["#d4af37", "black"];
    }
    if (active.find((a) => id === a.id)) {
      return ["var(--ion-color-success)", "var(--ion-color-success-contrast)"];
    }
    if (below.find((b) => id === b.id)) {
      return ["var(--ion-color-danger)", "var(--ion-color-danger-contrast)"];
    }

    return ["var(--ion-color-light)", "var(--ion-color-light-contrast)"];
  }

  return (
    <IonPage>
      <Header title={tournament?.name} showLeaderboard />
      <IonContent className="ion-padding">
        <div className={cardWrapper}>
          {seededParticipants.map((participant) => (
            <IonCard
              key={`${participant.id}-${participant.seed}`}
              className={card}
              id={`p-${participant.id}`}
              style={{
                "--background": getColors(participant.id)[0],
                "--color": getColors(participant.id)[1],
              }}
            >
              <IonCardContent className={cardContent}>
                <span className={name}>
                  {participant.seed + 1}{" "}
                  {getState().participants.get(participant.id)?.name}
                </span>
                {active.length <= 3 &&
                  active.find((a) => participant.id === a.id) && (
                    <IonButton
                      size="small"
                      fill="clear"
                      style={{ "--color": getColors(participant.id)[1] }}
                      className={eliminateButton}
                      onClick={() => awardPlace(participant)}
                    >
                      {active.length <= 3 &&
                        active.find((a) => participant.id === awardThird) && (
                          <IonLabel className={placeName}>
                            Third Place!
                          </IonLabel>
                        )}
                      {active.length <= 3 &&
                        active.find((a) => participant.id === awardSecond) && (
                          <IonLabel className={placeName}>Runner-up!</IonLabel>
                        )}
                      {active.length <= 3 &&
                        active.find((a) => participant.id === awardFirst) && (
                          <IonLabel className={placeName}>Champion!</IonLabel>
                        )}
                      {![awardFirst, awardSecond, awardThird].includes(
                        participant.id
                      ) && (
                          <>
                            {active.length === 3 && (
                              <IonLabel className={awardName}>
                                {placeToAward}
                              </IonLabel>
                            )}
                          </>
                        )}
                      <IonIcon slot="end" icon={trophy} />
                    </IonButton>
                  )}
                {active.find((a) => participant.id === a.id) &&
                  active.length > 3 && (
                    <IonButton
                      size="small"
                      fill="clear"
                      color="light"
                      className={eliminateButton}
                      onClick={() => eliminatePlayer(participant.id)}
                    >
                      <IonLabel className={awardName}>
                        {above.length === 0 ? "4th PLACE" : "ELIMINATE"}
                      </IonLabel>
                      <IonIcon size="medium" slot="end" icon={close} />
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
