import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import PatientMotivationalTips from "./patientMotivationalTip";
import PatientVitalSigns from "./patientVitalSigns";
import PatientClinicalData from "./patientClinicalData";
import { useLocation, useNavigate } from "react-router";
import PatientEmergencyAlerts from "./patientEmergencyAlerts";
import gql from "graphql-tag";
import { client } from "../..";
const GET_PATIENT_BY_DETAILS = gql`
  query GetInfo($getPatientByIdId: String) {
    getPatientById(id: $getPatientByIdId) {
      _id
      account {
        _id
        firstName
        lastName
        email
        password
        address
        city
        phoneNumber
        accountType
      }
      vitalSigns {
        pulseRate
        bloodPressure
        weight
        temperature
        respiratoryRate
        createdBy
      }
      emergencyAlerts {
        reason
        notified
        date
      }
      motivationalTips {
        type
        videoLink
      }
      clinicalData {
        age
        sex
        cp
        trestbps
        chol
        fbs
        restecg
        thalach
        exang
        oldpeak
        slope
        ca
        thal
        riskCategory
        createdOn
      }
      nurse {
        _id
        firstName
        lastName
        email
        password
        address
        city
        phoneNumber
        accountType
      }
    }
  }
`;

const PatientDetails = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [motivationalTips, setMotivationalTips] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [clinicalData, setClinicalData] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [patientDetails, setPatientDetails] = useState({
    firstName: "",
    lastname: "",
    phoneNumber: "",
    id: "",
    email: "",
    city: "",
    address: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location);
    loadUser();
    getPatientById();
  }, []);

  const getPatientById = async () => {
    if (location.state._id) {
      await client
        .query({
          query: GET_PATIENT_BY_DETAILS,
          variables: {
            getPatientByIdId: location.state._id,
          },
        })
        .then((response) => {
          console.log(response);
          setMotivationalTips(response.data.getPatientById.motivationalTips);
          setPatientDetails(response.data.getPatientById.account);
          setVitalSigns(response.data.getPatientById.vitalSigns);
          setClinicalData(response.data.getPatientById.clinicalData);
          setEmergencyAlerts(response.data.getPatientById.emergencyAlerts);
        });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <div className="card-container" style={{ backgroundColor: "#ececec" }}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <h2>
              <span className="text-primary">Patients Details</span>
            </h2>
          </div>
          <div style={{ fontSize: "22px" }}>
            <div className="row">
              <div className="col-2"></div>
              <div className="col-4 text-right label-bold">Name</div>
              <div className="col-4">
                {patientDetails.firstName} {patientDetails.lastName}
              </div>
              <div className="col-2"></div>
            </div>
            <div className="row">
              <div className="col-6 text-right label-bold">Email</div>
              <div className="col-6">{patientDetails.email}</div>
            </div>
            <div className="row">
              <div className="col-6 text-right label-bold">Address</div>
              <div className="col-6">{patientDetails.address}</div>
            </div>
            <div className="row">
              <div className="col-6 text-right label-bold">City</div>
              <div className="col-6">{patientDetails.city}</div>
            </div>
            <div className="row">
              <div className="col-6 text-right label-bold">Phone Number</div>
              <div className="col-6">{patientDetails.phoneNumber}</div>
            </div>
          </div>
          <div className="row">
            <PatientEmergencyAlerts emergencyAlerts={emergencyAlerts} />
          </div>
          <div className="row">
            <div className="col-6">
              <PatientMotivationalTips tips={motivationalTips} />
            </div>
            <div className="col-6">
              <PatientVitalSigns vitalSigns={vitalSigns} />
            </div>
          </div>
          <div className="row">
            <PatientClinicalData
              clinicalData={clinicalData}
              id={location?.state?._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
