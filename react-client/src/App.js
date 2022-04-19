import Alert from "./component/layout/Alert";
// AlertState is used for passing setAlert througout the react application which shows errors
// AuthState is used for passing login information and maintaining login persons information in whole react application

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Fragment } from "react";
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";
import Register from "./component/auth/Register";
import Navbar from "./component/layout/Navbar";
import PrivateRoute from "./component/routing/privateRoute";
import PatientVitalSign from "./component/patient/PatientVitalSign";
import PatientState from "./context/patient/PatientState";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
//

import Home from "./component/pages/Home";
import Login from "./component/auth/Login";
import SymptomCheck from "./component/pages/symptomCheck";
import PatientDetails from "./component/pages/patientDetails";
import AddPatientClinicalData from "./component/pages/addPatientClinicalData";
import AddPatientMotivationalTip from "./component/pages/addPatientMotivationalTip";
import AddPatientVitalSign from "./component/pages/addPatientVitalSign";
import AddExistingPatientMotivationalTip from "./component/pages/existingMotivationalTips";
import RiskRateResults from "./component/pages/riskRateResult";
import SendEmergencyAlert from "./component/pages/sendEmergencyAlert";
//

function App() {
  return (
    <AuthState>
      <AlertState>
        <PatientState>
          <Router>
            <Fragment>
              <Navbar />
              <div className="container" style={{ maxWidth: "1300px" }}>
                <Alert />
                <Routes>
                  {/* Use PrivateRoute for private access components */}
                  <Route
                    path="/"
                    element={<h1>Welcome to COMP308 Project</h1>}
                  />

                  <Route exact path="/dashboard" element={<PrivateRoute />}>
                    <Route exact path="/dashboard" element={<Home />} />
                  </Route>
                  <Route exact path="/showDetails" element={<PrivateRoute />}>
                    <Route
                      exact
                      path="/showDetails"
                      element={<PatientDetails />}
                    />
                  </Route>
                  <Route
                    exact
                    path="/addPatientClinicalData"
                    element={<PrivateRoute />}
                  >
                    <Route
                      exact
                      path="/addPatientClinicalData"
                      element={<AddPatientClinicalData />}
                    />
                  </Route>
                  <Route
                    exact
                    path="/addPatientMotivationalTip"
                    element={<PrivateRoute />}
                  >
                    <Route
                      exact
                      path="/addPatientMotivationalTip"
                      element={<AddPatientMotivationalTip />}
                    />
                  </Route>
                  <Route
                    exact
                    path="/addExistingPatientMotivationalTip"
                    element={<PrivateRoute />}
                  >
                    <Route
                      exact
                      path="/addExistingPatientMotivationalTip"
                      element={<AddExistingPatientMotivationalTip />}
                    />
                  </Route>
                  <Route
                    exact
                    path="/addPatientVitalSigns"
                    element={<PrivateRoute />}
                  >
                    <Route
                      exact
                      path="/addPatientVitalSigns"
                      element={<AddPatientVitalSign />}
                    />
                  </Route>
                  <Route path="/riskRateResult" element={<PrivateRoute />}>
                    <Route
                      exact
                      path="/riskRateResult"
                      element={<RiskRateResults />}
                    />
                  </Route>
                  <Route
                    path="/patient/sendEmergencyAlert"
                    element={<PrivateRoute />}
                  >
                    <Route
                      exact
                      path="/patient/sendEmergencyAlert"
                      element={<SendEmergencyAlert />}
                    />
                  </Route>
                  <Route path="/patient/vitalsign" element={<PrivateRoute />}>
                    <Route
                      exact
                      path="/patient/vitalsign"
                      element={<PatientVitalSign />}
                    />
                  </Route>
                  <Route path="/patient/symptoms" element={<PrivateRoute />}>
                    <Route
                      exact
                      path="/patient/symptoms"
                      element={<SymptomCheck />}
                    />
                  </Route>
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/register" element={<Register />} />
                </Routes>
              </div>
            </Fragment>
          </Router>
        </PatientState>
      </AlertState>
    </AuthState>
  );
}
//<Route render ={()=> < App />} path="/" />
export default App;

