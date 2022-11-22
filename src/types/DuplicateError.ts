import Participant from "./Participant";

type DuplicateError = {
	race: number;
	rank: number;
	offenders: Participant[];
};

export default DuplicateError;
