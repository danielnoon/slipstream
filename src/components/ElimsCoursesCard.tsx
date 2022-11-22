import { useCallback, useMemo, useState } from "react";
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
} from "@ionic/react";
import { add, syncOutline, removeCircleOutline } from "ionicons/icons";
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

type Props = {
	DLCEnabled: boolean;
	platform: Platform;
};

const ElimsCourseCard = ({ platform, DLCEnabled }: Props) => {
	const [racesPerRound, setRacesPerRound] = useState(4);
	const [courses, setCourses] = useState(
		generateCourseSelection(platform, racesPerRound, DLCEnabled)
	);

	const removeCourse = useCallback(
		(course: Course) => {
			const newCourses = courses.filter((c) => c.name !== course.name);
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
	return (
		<IonCard key={"courses"} className={elimRoundRaces}>
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
						color="primary"
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
							lines={i === courses.length - 1 ? "none" : "full"}
							key={`Course ${i}`}
						>
							<>
								<IonIcon
									onClick={() => removeCourse(course)}
									icon={removeCircleOutline}
									color="danger"
									slot="start"
									size="small"
									style={{
										cursor: "pointer",
									}}
								/>
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
					<IonButton
						onClick={() => addCourse()}
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
	);
};

export default ElimsCourseCard;
