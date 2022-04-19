import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import AuthContext from "../../context/auth/authContext";
import "../../App.css";
import gql from "graphql-tag";
import { client } from "../..";

const LATEST_MOTIVATIONAL_TIP = gql`
  query GetLatestMotivationalTip {
    getLatestMotivationalTip {
      type
      videoLink
      _id
    }
  }
`;

const PatientDashboard = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [motivationalTip, setMotivationalTip] = useState({
    id: "",
    videoLink: "",
    type: "video",
  });

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    console.log(props);
    loadUser();
    getLatestMotivationalTip();
  }, []);

  const getLatestMotivationalTip = async () => {
    await client
      .query({
        query: LATEST_MOTIVATIONAL_TIP,
      })
      .then((result) => {
        console.log("result:", result.data.getLatestMotivationalTip);
        if (result.data.getLatestMotivationalTip) {
          setMotivationalTip(result.data.getLatestMotivationalTip);
        }
      })
      .catch((error) => {
        console.log("error in fetching nurses:", error);
      });
  };

  const onAddVitalSigns = () => {
    navigate("/patient/vitalsign");
  };

  const onSendEmergencyAlert = () => {
    navigate("/patient/sendEmergencyAlert");
  };

  const onCheckSymptoms = () => {
    navigate("/patient/symptoms");
  };

  return (
    <div>
      <div className="card-container">
        <div className="container-fluid">
          <div className="row justify-content-center row-title">
            <h1>
              Patient <span className="text-primary">Dashboard</span>
            </h1>
          </div>
          <div
            className="row justify-content-end row-padding"
            style={{ marginBottom: "20px" }}
          >
            <button
              className="btn btn-danger btn-block"
              onClick={onSendEmergencyAlert}
            >
              Send Emergency Alert
            </button>
          </div>
          <div className="row justify-content-center row-padding">
            <h2>Today's Motivation</h2>
          </div>
          <div
            className="row justify-content-end"
            style={{ marginBottom: "20px" }}
          >
            <div className="col-2">
              <button className="btn btn-warning" onClick={onCheckSymptoms}>
                Check Symptoms
              </button>
            </div>
            <div className="col-2">
              <button className="btn btn-primary" onClick={onAddVitalSigns}>
                Add VitalSigns
              </button>
            </div>
          </div>
          {motivationalTip.videoLink !== "" ? (
            <div className="row justify-content-center">
              <iframe
                width="100%"
                height="500px"
                key={motivationalTip.id}
                src={motivationalTip.videoLink}
              ></iframe>
            </div>
          ) : (
            <div className="row justify-content-center">
              <h2>Not Motivational Tip Found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
