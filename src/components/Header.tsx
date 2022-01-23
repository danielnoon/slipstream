import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { trophy } from "ionicons/icons";
import { useState } from "react";

import logo from "../assets/logo/transparent.png";
import { Leaderboard } from "./Leaderboard";

interface Props {
  showLeaderboard?: boolean;
  title?: string;
}

export function Header({ showLeaderboard, title }: Props) {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <IonHeader>
      <IonToolbar>
        <img
          slot="start"
          src={logo}
          alt="Slipstream Logo"
          height="40"
          style={{ marginLeft: 12, marginTop: 3 }}
        />
        <IonTitle>{title}</IonTitle>
        {showLeaderboard && (
          <>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsLeaderboardOpen(true)}>
                <IonIcon icon={trophy} />
              </IonButton>
            </IonButtons>
            <Leaderboard isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
          </>
        )}
      </IonToolbar>
    </IonHeader>
  );
}
