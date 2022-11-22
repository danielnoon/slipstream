import { useCallback, useMemo, useState } from "react";
import {
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonContent,
	IonIcon,
	IonLabel,
	IonPage,
	useIonRouter,
	useIonViewDidEnter,
	useIonViewWillEnter,
	IonList,
	IonItem,
} from "@ionic/react";
import { close, trophyOutline, syncOutline } from "ionicons/icons";
import { getState, useStore } from "../store";
import { css } from "@emotion/css";
import { generateCourseSelection, getPoints } from "../algorithms";
import type RoundParticipant from "../types/RoundParticipant";
import { rankColors } from "../utility/rankFormatting";
import Participant from "../types/Participant";
import { Platform } from "../types/Platform";
import Course from "../types/Course";

const elimRoundRaces = css`
	z-index: 3;
	position: fixed;
	top: 350px;
	left: 200px;
`;

const elimRoundScores = css`
	z-index: 2;
	position: fixed;
	top: 350px;
	left: 1400px;
`;

type Props = {
	racesPerRound: number;
	DLCEnabled: boolean;
	platform: Platform;
};

const ElimsCourseCard = ({ racesPerRound, platform, DLCEnabled }: Props) => {
	const [courses, setCourses] = useState(
		generateCourseSelection(platform, racesPerRound, DLCEnabled)
	);

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
		[courses, platform, DLCEnabled]
	);
	return (
		<IonCard key={"races"} className={elimRoundRaces}>
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
						icon={syncOutline}
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
				<IonList
					lines="full"
					style={{ paddingLeft: 10, paddingRight: 4 }}
				>
					{courses.map((course, i) => (
						<IonItem
							lines={i === courses.length - 1 ? "none" : "full"}
							key={`Course ${i}`}
						>
							<>
								<IonLabel>{course.name}</IonLabel>
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
				</IonList>
			</IonCardContent>
		</IonCard>
	);
};

export default ElimsCourseCard;
