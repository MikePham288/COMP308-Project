import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import "../../App.css";
import { withRouter } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";

const PatientMotivationalTips = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log(props.tips);
  }, []);

  const onAddNewClick = () => {
    navigate("/addPatientMotivationalTip", {
      state: { _id: location.state._id },
    });
  };

  const onExistingClick = () => {
    navigate("/addExistingPatientMotivationalTip", {
      state: { _id: location.state._id },
    });
  };

  return (
    <div className="card-child">
      <div className="row justify-content-center">
        <h2>
          Patients <span className="text-primary">Motivational Tip</span>
        </h2>
      </div>
      <div className="row justify-content-end row-padding">
        <div className="col-5">
          <button className="btn btn-primary" onClick={onExistingClick}>
            Select From Existing
          </button>
        </div>
        <div className="col-3">
          <button className="btn btn-primary" onClick={onAddNewClick}>
            Add New
          </button>
        </div>
      </div>
      {props.tips && props.tips.length !== 0 ? (
        <div>
          <div className="row justify-content-center row-padding">
            <iframe
              width="100%"
              height="500px"
              src={props.tips[props.tips.length - 1].videoLink}
            ></iframe>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center row-padding">
          <h4>No MotivationalTips Set</h4>
        </div>
      )}
    </div>
  );
};

export default PatientMotivationalTips;
