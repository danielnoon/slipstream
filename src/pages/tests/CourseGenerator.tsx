import { css } from "@emotion/css";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNavLink,
  IonPage,
  IonRange,
  IonRouterLink,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { generateCourseSelection } from "../../algorithms";
import { Header } from "../../components/Header";
import Course from "../../types/Course";
import { Platform } from "../../types/Platform";


const content = css`
display: flex;
margin: 0 auto;
justify-content: center;
width: 100%;
`;

const card = css`
  width: 600px;
  max-width: calc(100vw - 40px);
  & > .center {
    height: 100px;
    display: grid;
    place-items: center;
  }
`;

const modal = css`
--min-width: 800px;
--height: 32em;
`;

const CourseGenerator = () => {

  const [platform, setPlatform] = useState(Platform.NONE)
  const [plat, setPlat] = useState(platform)
  const [threshold, setThreshold] = useState(4)

  const [generatedCoursesModal, setGeneratedCoursesModal] = useState(false)
  const showGeneratedCoursesModal = () => setGeneratedCoursesModal(true)
  const hideGeneratedCoursesModal = () => setGeneratedCoursesModal(false)

  const [courses, setCourses] = useState<Course[]>([])

  const handleGenerateSelection = () => {
    setCourses(generateCourseSelection(platform, threshold, 4))
    showGeneratedCoursesModal()
  }

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className={content}>
          <IonModal isOpen={generatedCoursesModal} className={modal} onDidDismiss={hideGeneratedCoursesModal}>
            <IonContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  paddingBottom: 24,
                }}
              >
                <IonCardHeader>
                  <IonCardTitle><strong>Generated Courses</strong></IonCardTitle>
                  <IonLabel>Chosen Threshold: {threshold}</IonLabel>
                </IonCardHeader>
                {
                  courses.map(course => {
                      return (
                        <IonItem>
                          <IonLabel><strong>{course.name}</strong></IonLabel>
                          <IonLabel>Degree of Difficulty: <strong>{course.degreeOfDifficulty}</strong></IonLabel>
                        </IonItem>
                      )
                    })
                }
              </div>
            </IonContent>
          </IonModal>
          <IonCard className={card}>
            <IonCardContent>
              <IonCardHeader>
                <IonCardTitle><strong>Test Course Generation</strong></IonCardTitle>
              </IonCardHeader>
              <IonItem>
                <IonLabel>Threshold</IonLabel>

                <IonRange
                  min={4}
                  max={20}
                  snaps={true}
                  pin
                  value={threshold}
                  onIonChange={(ev) => {
                    setThreshold(ev.detail.value as number);
                  }}
                >
                  <IonLabel slot="start">4</IonLabel>
                  <IonLabel slot="end">20</IonLabel>
                </IonRange>
              </IonItem>
              <IonItem>
                <IonLabel>Platform</IonLabel>
                <IonSelect
                  value={plat}
                  placeholder="Platform"
                  onIonChange={(ev) => {
                    setPlatform(ev.detail.value);
                    setPlat(ev.detail.value);
                  }}
                >
                  {Object.values(Platform)
                    .filter((platOpt) => !(platOpt === Platform.NONE))
                    .map((platOption, i) => (
                      <IonSelectOption key={i} value={platOption}>{platOption}</IonSelectOption>
                    ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonButton
                  size="default"
                  style={{ margin: "auto" }}
                  color="success"
                  onClick={handleGenerateSelection}
                  disabled={platform == Platform.NONE}
                >
                  Generate Courses
                </IonButton>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  )


}

export default CourseGenerator