import Participant from "./Participant";

type RoundParticipant = Participant & {
	rank: number;
	rScore: number;
	tie: boolean;
};

export default RoundParticipant;
