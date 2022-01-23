import { css } from "@emotion/css";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonRippleEffect,
} from "@ionic/react";
import { useState } from "react";
import Participant from "../types/Participant";
import { ScoreEntryModal } from "./ScoreEntryModal";

import header from "../assets/label/header.svg"

const imgLabel = css`
  min-width: 200px;
  max-width: 200px;
  cursor: pointer;
`;

const imgLabelText = css`
  height: 100%;
  display: block;
  vertical-align: middle;
  text-align: center;
  margin-right: 20px;
`;

const imgLabelDivContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LabelCardHeader = css`
  padding-left: unset;
  padding-top: 0px;
  padding-bottom: 0px;
`;

interface Props {
  label: string
}

export function SetupLabel(props: Props) {
  const { label } = props;


  return (
    <IonCard
      className={[imgLabel, "ion-activatable", "ripple-parent"].join(" ")}
    >
      <IonCardHeader className={LabelCardHeader}>
        <div className={imgLabelDivContainer}>
          <img
            slot="start"
            src={header}
            alt="Slipstream Logo"
            height="40"
            style={{paddingLeft:"10px"}}
          />
          <IonCardTitle className={imgLabelText}><strong>{label}</strong></IonCardTitle>
        </div>
      </IonCardHeader>
      <IonRippleEffect />
    </IonCard >
  );
}