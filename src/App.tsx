import { Route } from "react-router-dom";
import { Create } from "./pages/Create";
import { Home } from "./pages/Home";

import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./theme.css";
import { Seeding } from "./pages/Seeding";
import { Eliminations } from "./pages/Eliminations";
import CourseGenerator from "./pages/CourseGenerator";

setupIonicReact();

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Home />
            </Route>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/seeding">
              <Seeding />
            </Route>
            <Route path="/elims">
              <Eliminations />
            </Route>
            <Route path="/tests/coursegen">
              <CourseGenerator />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
