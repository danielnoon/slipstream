import { IonHeader, IonToolbar } from "@ionic/react";

import logo from "../assets/logo/transparent.png";

export function Header() {
  return (
    <IonHeader>
      <IonToolbar>
        <img
          src={logo}
          alt="Slipstream Logo"
          height="40"
          style={{ marginLeft: 12, marginTop: 6 }}
        />
      </IonToolbar>
    </IonHeader>
  );
}
