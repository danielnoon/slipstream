import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { trophy } from "ionicons/icons";
import { useState } from "react";
import { css } from "@emotion/css";

import logoLight from "../assets/logo/light.png";
import logoDark from "../assets/logo/dark.png";
import { Leaderboard } from "./Leaderboard";
import { prefersDarkTheme } from "../darkTheme";
import { useIonRouter } from "@ionic/react";

interface Props {
  showLeaderboard?: boolean;
  title?: string;
}

const leaderboardLabel = css`
  padding-right: 5px;

  @media (max-width: 710px) {
    display: none;
  }
`;

export function Header({ showLeaderboard, title }: Props) {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const router = useIonRouter();

  return (
    <IonHeader>
      <IonToolbar>
        <img
          slot="start"
          src={prefersDarkTheme() ? logoDark : logoLight}
          alt="Slipstream Logo"
          height="40"
          style={{ marginLeft: 12, marginTop: 3, cursor: "pointer" }}
          onClick={() => router.push("/")}
        />
        <IonTitle>{title}</IonTitle>
        {showLeaderboard && (
          <>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsLeaderboardOpen(true)}>
                <IonLabel className={leaderboardLabel}>
                  View Leaderboard
                </IonLabel>
                <IonIcon icon={trophy} />
              </IonButton>
            </IonButtons>
            <Leaderboard
              isOpen={isLeaderboardOpen}
              onClose={() => setIsLeaderboardOpen(false)}
            />
          </>
        )}
      </IonToolbar>
    </IonHeader>
  );
}
