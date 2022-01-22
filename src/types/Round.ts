import Participant from "./Participant";

export default interface Round {
    setup: number;
    participants: Participant[];
}