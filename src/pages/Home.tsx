import { IonButton, IonContent } from "@ionic/react";

export function Home() {
  return (
    <IonContent>
      <IonButton href="/create">Create New Tournament</IonButton>
    </IonContent>
  );
}
