import { css } from "@emotion/css";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import { close, trophy } from "ionicons/icons";
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
  const router = useIonRouter();
  const tournament = useStore((state) => state.tournament);
  const seededParticipants: SeededParticipant[] | undefined = tournament?.participants
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((part, i) => (
      {
        id: part.id,
        seed: i
      }
    ));

  if (!seededParticipants) {
    router.push('/');
    return null;
  }

  const [active, setActive] = useState(seededParticipants.slice(-4));
  const [above, setAbove] = useState(seededParticipants.slice(0, -4));
  const [below, setBelow] = useState([] as SeededParticipant[]);

  const [awardThird, setAwardThird] = useState(-1);
  const [awardSecond, setAwardSecond] = useState(-1);
  const [awardFirst, setAwardFirst] = useState(-1);

  const [placeToAward, setPlaceToAward] = useState("Award 3rd")

  useEffect(() => {
    const els = seededParticipants.map((p) => document.getElementById(`p-${p.id}`));
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
    const newBelow = [...below, seededParticipants!.find((p) => p.id === id)!];
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
      setAwardThird(participant.id)
      setPlaceToAward("Award 2nd")
    } else if (awardSecond === -1 && awardThird != participant.id) {
      setAwardSecond(participant.id)
      setPlaceToAward("Award 1st")
    } else if (awardFirst === -1 && awardSecond != participant.id) {
      if (awardThird != participant.id) {
        setAwardFirst(participant.id)
      }
    }
  }

  function getColors(id: number) {
    if (id === awardThird) {
      return ['orange', 'white']
    }
    if (id === awardSecond) {
      return ['silver', 'black']
    }
    if (id === awardFirst) {
      return ['gold', 'black']
    }
    if (active.find((a) => id === a.id)) {
      return ['green', 'white']
    }
    if ( below.find((b) => id === b.id)) {
      return ['red', 'white']
    }

    return ['white', 'black']
  }

  return (
    <IonPage>
      <Header title={tournament?.name} showLeaderboard />
      <IonContent className="ion-padding">
        <div className={cardWrapper}>
          {seededParticipants.map((participant) => (
            <IonCard
              key={participant.id}
              className={card}
              id={`p-${participant.id}`}
              style={{ '--background': getColors(participant.id)[0], '--color': getColors(participant.id)[1]}}
              // color={
              //   participant.id === awardThird
              //     ? "tertiary"
              //     : participant.id === awardSecond
              //       ? "primary"
              //       : participant.id === awardFirst
              //         ? "warning"
              //         : active.find((a) => participant.id === a.id)
              //           ? "success"
              //           : below.find((b) => participant.id === b.id)
              //             ? "danger"
              //             : "light"
              // }
            >
              <IonCardContent className={cardContent}>
                <span className={name}>
                  {participant.seed + 1}{" "}
                  {getState().participants.get(participant.id)?.name}
                </span>
                {active.length <= 3 && active.find((a) => participant.id === a.id) &&
                  <IonButton
                    size="small"
                    fill="clear"
                    color="light"
                    className={eliminateButton}
                    onClick={() => awardPlace(participant)}
                  >
                    {active.length <= 3 && active.find((a) => participant.id === awardThird) &&
                      <IonLabel className={placeName}>Third Place!</IonLabel>
                    }
                    {active.length <= 3 && active.find((a) => participant.id === awardSecond) &&
                      <IonLabel className={placeName}>Runner-up!</IonLabel>
                    }
                    {active.length <= 3 && active.find((a) => participant.id === awardFirst) &&
                      <IonLabel className={placeName}>Champion!</IonLabel>
                    }
                    {![awardFirst, awardSecond, awardThird].includes(participant.id) && <>
                      {active.length === 3 &&
                        <IonLabel className={awardName}>{placeToAward}</IonLabel>
                      }
                    </>}
                    <IonIcon slot="icon-only" icon={trophy} />
                  </IonButton>
                }
                {active.find((a) => participant.id === a.id) && active.length > 3 && (
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
