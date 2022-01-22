import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";

import logo from "../assets/logo/transparent.png";

interface Props {
  title?: string;
}

export function Header({ title }: Props) {
  return (
    <IonHeader>
      <IonToolbar>
        <img
          slot="start"
          src={logo}
          alt="Slipstream Logo"
          height="40"
          style={{ marginLeft: 12, marginTop: 6 }}
        />
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
}
