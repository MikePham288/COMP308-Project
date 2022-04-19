import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import { Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import gql from "graphql-tag";
import { client } from "../..";

const ADD_VITAL_SIGN = gql`
  mutation AddVitalSign(
    $patientId: String
    $pulseRate: Float
    $bloodPressure: String
    $weight: Float
    $temperature: Float
    $respiratoryRate: Float
    $createdBy: String
  ) {
    addVitalSign(
      patientId: $patientId
      pulseRate: $pulseRate
      bloodPressure: $bloodPressure
      weight: $weight
      temperature: $temperature
      respiratoryRate: $respiratoryRate
      createdBy: $createdBy
    ) {
      _id
      account {
        _id
      }
      vitalSigns {
        pulseRate
        bloodPressure
        weight
        temperature
        respiratoryRate
        createdBy
      }
    }
  }
`;

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

  useEffect(() => {
    console.log(location.state._id);
    loadUser();
  }, []);

  const addPatientVitalSigns = async () => {
    if (location.state._id) {
      await client
        .mutate({
          mutation: ADD_VITAL_SIGN,
          variables: {
            patientId: location.state._id,
            pulseRate: Number(vitalSigns.pulseRate),
            bloodPressure: vitalSigns.bloodPressure.toString(),
            weight: Number(vitalSigns.weight),
            temperature: Number(vitalSigns.temperature),
            respiratoryRate: Number(vitalSigns.respiratoryRate),
            createdBy: "NURSE",
          },
        })
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
