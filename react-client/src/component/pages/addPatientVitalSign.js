import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";

const AddPatientVitalSign = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [vitalSigns, setVitalSigns] = useState({
    pulseRate: 0,
    bloodPressure: "",
    weight: 0,
    temperature: 0,
    respiratoryRate: 0,
    createdBy: "NURSE",
  });
  const apiUrl = "http://localhost:3000/api/addPatientVitalSigns/";

  useEffect(() => {
    console.log(location.state._id);
    loadUser();
  }, []);

  const addPatientVitalSigns = async () => {
    if (location.state._id) {
      await axios
        .post(apiUrl + location.state._id, vitalSigns)
        .then((result) => {
          console.log(result.data);
          navigate("/showDetails", {
            state: {
              _id: location.state._id,
            },
          });
        })
        .catch((error) => {
          navigate("/showDetails", {
            state: {
              _id: location.state._id,
            },
          });
          console.log("error in fetching nurses:", error);
        });
    } else {
      navigate("/dashboard");
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (location.state._id) {
      addPatientVitalSigns();
    } else {
      navigate("/dashboard");
    }
  };

  const onChange = (e) => {
    setVitalSigns({ ...vitalSigns, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="card-container">
        <div className="row justify-content-center">
          <h2>
            <span className="text-primary">Add Vital Sign</span> for Patient
          </h2>
        </div>
        <Form className="register-form" onSubmit={handleOnSubmit}>
          <Form.Group controlId="pulseRate">
            <Form.Label>Pulse Rate</Form.Label>
            <Form.Control
              type="number"
              step="any"
              placeholder="Enter Pulse Rate"
              name="pulseRate"
              onChange={onChange}
              value={vitalSigns.pulseRate}
              required
            />
          </Form.Group>
          <Form.Group controlId="bloodPressure">
            <Form.Label>Blood Pressure</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Blood Pressure"
              name="bloodPressure"
              onChange={onChange}
              value={vitalSigns.bloodPressure}
              required
            />
          </Form.Group>
          <Form.Group controlId="weight">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              step="any"
              placeholder="Enter weight"
              name="weight"
              onChange={onChange}
              value={vitalSigns.weight}
              required
            />
          </Form.Group>
          <Form.Group controlId="temperature">
            <Form.Label>Temperature</Form.Label>
            <Form.Control
              type="number"
              step="any"
              placeholder="Enter Temperature"
              name="temperature"
              onChange={onChange}
              value={vitalSigns.temperature}
              required
            />
          </Form.Group>
          <Form.Group controlId="respiratoryRate">
            <Form.Label>Respiratory Rate</Form.Label>
            <Form.Control
              type="number"
              step="any"
              placeholder="Enter Respiratory Rate"
              name="respiratoryRate"
              onChange={onChange}
              value={vitalSigns.respiratoryRate}
              required
            />
          </Form.Group>
          <div className="row justify-content-center">
            <Button variant="primary" type="submit">
              SAVE
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddPatientVitalSign;
