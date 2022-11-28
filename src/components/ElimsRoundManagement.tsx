import {
	useMemo,
	useState,
	useEffect,
	useCallback,
} from "react";
import {
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonIcon,
	IonLabel,
	IonList,
	IonItem,
	IonGrid,
	IonListHeader,
	IonSelect,
	IonSelectOption,
	IonCol,
	IonRow,
} from "@ionic/react";
import {
	trophyOutline,
	syncOutline,
	add,
	shuffleOutline,
	removeCircleOutline,
	refreshCircle,
} from "ionicons/icons";
import { css } from "@emotion/css";
import { generateCourseSelection } from "../algorithms";
import { range } from "itertools";
import { getOrdinal, rankColors } from "../utility/rankFormatting";
import Participant from "../types/Participant";
import { error } from "../utility/css";

import useRaceTracking from "../hooks/useRaceTracking";
import { Platform } from "../types/Platform";
import Course from "../types/Course";
import { switchCourseData, switchDLCCutoff } from "../data/course_data/switchCourseData";
import wiiCourseData from "../data/course_data/wiiCourseData";

const ELIMS_CARDS = 600;
const GROWTH_FACTOR = 0.5;

const LEFT_MIN_WIDTH = 300;

const RIGHT_MIN_WIDTH = 400;

const elimRacesContainer = css`
	z-index: 2;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0px;
	left: 0px;

	height: 100%;
	min-width: 300px;
`

const elimsStandingsContainer = css`
	z-index: 2;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0px;
	right: 0px;

	height: 100%;
	min-width: 400px;
`

const elminRoundStandings = css`
	min-width: 300px;
	padding: 8;
`;

type Props = {
	participants: Participant[];
	DLCEnabled: boolean;
	platform: Platform;
	tournamentRacesPerRound: number;
};

const ElimsRoundManagement = ({
	participants,
	platform,
	DLCEnabled,
	tournamentRacesPerRound,
}: Props) => {
	const [elimsThisRound, setElimsThisRound] = useState(1);
	const [racesPerRound, setRacesPerRound] = useState(tournamentRacesPerRound);

	const [courses, setCourses] = useState(
		generateCourseSelection(platform, racesPerRound, DLCEnabled)
	);

	const possibleCourses: Course[] = useMemo(() => {
		switch(platform) {
			case Platform.Wii:
				return wiiCourseData;
			case Platform.Switch:
				if (!DLCEnabled) {
					return switchCourseData.slice(0, switchDLCCutoff);
				}
				return switchCourseData;
			default:
				return switchCourseData;
		}
	}, [platform, DLCEnabled])

	const leftWidth = useMemo(() => {
		const preferredWidth = (window.innerWidth - ELIMS_CARDS);
		return preferredWidth > LEFT_MIN_WIDTH ? preferredWidth * GROWTH_FACTOR : LEFT_MIN_WIDTH;
	}, [window.innerWidth]);

	const rightWidth = useMemo(() => {
		const preferredWidth = (window.innerWidth - ELIMS_CARDS);
		return preferredWidth > RIGHT_MIN_WIDTH ? preferredWidth * GROWTH_FACTOR : RIGHT_MIN_WIDTH;
	}, [window.innerWidth])

	const removeCourse = useCallback(
		(course: Course) => {
			const newCourses = courses.filter(c => c.name !== course.name);
			setCourses(newCourses);
			setRacesPerRound(racesPerRound - 1);
		},
		[courses, setCourses, racesPerRound, setRacesPerRound]
	);

	const addCourse = useCallback(() => {
		setCourses([
			...courses,
			...generateCourseSelection(platform, 1, DLCEnabled),
		]);
		setRacesPerRound(racesPerRound + 1);
	}, [courses, setCourses, racesPerRound, setRacesPerRound]);

	const regenerateCourse = useCallback(
		(course: Course) => {
			const courseToReplaceIndex = courses.findIndex(
				(c) => c.name === course.name
			);
			// even though this is just one course, it is an array in the form of [course]
			const newCourse = generateCourseSelection(platform, 1, DLCEnabled);
			let newCourses = [];
			if (courseToReplaceIndex === courses.length - 1) {
				newCourses = [
					...courses.slice(0, courseToReplaceIndex),
					...newCourse,
				];
			} else {
				newCourses = [
					...courses.slice(0, courseToReplaceIndex),
					...newCourse,
					...courses.slice(courseToReplaceIndex + 1),
				];
			}
			setCourses(newCourses);
		},
		[courses, setCourses, platform, DLCEnabled]
	);

	const {
		results,
		setRank,
		addRace,
		removeRace,
		resetRoundResults,
		roundRanks,
		duplicateErrors,
		roundResultsReady,
	} = useRaceTracking(participants, racesPerRound);


	const errorsUI = useMemo(() => {
		return duplicateErrors.map((dE) => {
			const names = dE.offenders.map((o) => o.name);
			const rank = dE.rank + 1;
			let messageStr = "";
			if (names.length > 2) {
				messageStr = `${names.slice(0, names.length - 1)}, and ${
					names[names.length - 1]
				} in Race #${dE.race + 1} cannot all finish ${rank}${getOrdinal(
					rank
				)}!`;
			} else {
				messageStr = `${names[0]} and ${names[1]} in Race #${
					dE.race + 1
				} cannot both finish ${rank}${getOrdinal(rank)}!`;
			}
			return (
				<IonItem
					className={error}
					key={`Race#${dE.race}Rank${dE.rank}Error`}
				>
					<IonLabel color="danger" style={{ margin: 4 }}>
						{`Error: ${messageStr}`}
					</IonLabel>
				</IonItem>
			);
		});
	}, [duplicateErrors]);

	const RankSelector = (pID: number, race: number) => {
		if (
			race < 0 ||
			race >= racesPerRound ||
			pID < 0 ||
			pID >= participants.length
		) {
			return null;
		}
		return (
			<IonSelect
				value={results[race][pID]}
				placeholder="Result"
				interface="popover"
				onIonChange={(ev) => {
					const newRank = ev.detail.value;
					setRank(race, pID, newRank);
				}}
			>
				{[...range(participants.length)].map((i) => {
					return (
						<IonSelectOption value={i} key={i}>
							{i + 1 + getOrdinal(i + 1)}
						</IonSelectOption>
					);
				})}
			</IonSelect>
		);
	};

	const courseSelectors = useMemo(() => {
		console.log('courses in courseSelectors', courses);
		return courses.map((course, i) => {
			return (
				<IonSelect
				value={courses[i]}
				placeholder="Select Course"
				interface="popover"
				onIonChange={(ev) => {
					const newCourse = ev.detail.value;
					courses[i] = newCourse;
				}}
			>
				{possibleCourses.map((pCourse) => {
					return (
						<IonSelectOption value={pCourse} key={pCourse.name}>
							{pCourse.name}
						</IonSelectOption>
					);
				})}
			</IonSelect>
			)
		})
	}, [courses.length, possibleCourses, setCourses, courses])

	return (
		<>
		<div style={{width: leftWidth}} className={elimRacesContainer}>
			<IonCard key={"races"}>
				<IonCardHeader>
					<IonCardTitle style={{ display: "flex" }}>
						<strong style={{ flexGrow: 1 }}>Courses</strong>
						<IonIcon
							onClick={() =>
								setCourses(
									generateCourseSelection(
										platform,
										racesPerRound,
										DLCEnabled
									)
								)
							}
							icon={shuffleOutline}
							color="danger"
							style={{
								marginRight: 8,
								fontSize: 28,
								cursor: "pointer",
							}}
						/>
					</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<IonList lines="full">
						{courses.map((course, i) => (
							<IonItem
								lines={
									i === courses.length - 1 ? "none" : "full"
								}
								key={`Course ${i}`}
							>
								<>
								{
									courses.length > 1 && 
									<IonIcon
										onClick={() => {
											removeCourse(course);
											removeRace(i);
										}}
										icon={removeCircleOutline}
										color="danger"
										slot="start"
										size="small"
										style={{
											cursor: "pointer",
										}}
									/>
								}
									<IonItem>
										{courseSelectors[i]}
									</IonItem>
									<IonIcon
										onClick={() => regenerateCourse(course)}
										icon={syncOutline}
										color="warning"
										slot="end"
										size="small"
										style={{
											cursor: "pointer",
										}}
									/>
								</>
							</IonItem>
						))}
						<IonButton
							onClick={() => {
								addCourse();
								addRace();
							}}
							fill="outline"
							color="success"
							expand="block"
						>
							<IonLabel>Add Course</IonLabel>
							<IonIcon
								icon={add}
								color="success"
								slot="end"
								size="small"
							/>
						</IonButton>
					</IonList>
				</IonCardContent>
			</IonCard>
		</div>
		<div style={{width: rightWidth}} className={elimsStandingsContainer}>
			{/* Standings */}
			<IonCard key="standings" className={elminRoundStandings}>
				<IonCardContent>
					<IonCardTitle style={{ display: "flex" }}>
						<strong style={{ flexGrow: 1 }}>Standings</strong>
					</IonCardTitle>
					<IonList style={{ paddingLeft: 10, paddingRight: 10 }}>
						{roundRanks.map((rPart, i) => (
							<IonItem
								shape="round"
								lines="none"
								key={`StandingP${rPart.id}`}
							>
								<IonLabel>{rPart.name}</IonLabel>
								<IonLabel color="secondary">
									{rPart.rScore}
								</IonLabel>
								{[1, 2, 3].includes(rPart.rank) &&
								roundResultsReady ? (
									<IonIcon
										icon={trophyOutline}
										slot="end"
										color={rankColors[rPart.rank - 1]}
									/>
								) : (
									<IonItem />
								)}
							</IonItem>
						))}
					</IonList>
				</IonCardContent>
			</IonCard>
			{/* Score Entry */}
			<IonCard key={"scoreentry"}>
				<IonCardHeader>
					<IonCardTitle style={{ display: "flex" }}>
						<strong style={{ flexGrow: 1 }}>
							Enter Racing Results
						</strong>
						<IonIcon
							onClick={() => resetRoundResults()}
							icon={refreshCircle}
							color="danger"
							style={{
								marginRight: 8,
								fontSize: 32,
								cursor: "pointer",
							}}
						/>
					</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<IonGrid>
						<IonRow key="names">
							<IonCol></IonCol>
							{participants.map((part, i) => (
								<IonCol key={`participant ${i}`}>
									<IonListHeader>
										<IonLabel>{part.name}</IonLabel>
									</IonListHeader>
								</IonCol>
							))}
						</IonRow>
						{/* TODO: Change this to be a variable amount of courses per race, not just 4 */}
						{[...range(racesPerRound)].map((i) => (
							<IonRow key={`race ${i}`}>
								<IonCol
									key={`race name ${i}`}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<IonLabel>Race {i + 1}</IonLabel>
								</IonCol>
								{participants.map((_p, j) => (
									<IonCol key={`race ${i} result ${j}`}>
										{RankSelector(j, i)}
									</IonCol>
								))}
							</IonRow>
						))}
					</IonGrid>
					{duplicateErrors.length > 0 && (
						<IonList
							style={{
								background: "transparent",
								paddingBottom: 16,
							}}
						>
							{errorsUI}
						</IonList>
					)}
				</IonCardContent>
			</IonCard>
		</div>
		</>
	);
};

export default ElimsRoundManagement;
