import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import { useLocation, useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";
import gql from "graphql-tag";
import { client } from "../..";
const ADD_PATIENT_CLINICAL_DATA = gql`
  mutation Mutation(
    $patientId: String
    $age: Int
    $sex: Int
    $cp: Float
    $trestbps: Float
    $chol: Float
    $restecg: Float
    $fbs: Float
    $thalach: Float
    $exang: Float
    $oldpeak: Float
    $slope: Float
    $ca: Float
    $riskCategory: Float
    $thal: Float
  ) {
    addClinicalData(
      patientId: $patientId
      age: $age
      sex: $sex
      cp: $cp
      trestbps: $trestbps
      chol: $chol
      restecg: $restecg
      fbs: $fbs
      thalach: $thalach
      exang: $exang
      oldpeak: $oldpeak
      slope: $slope
      ca: $ca
      riskCategory: $riskCategory
      thal: $thal
    ) {
      _id
    }
  }
`;

const AddPatientClinicalData = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [clinicalData, setClinicalData] = useState({
    age: 0,
    sex: 0,
    cp: 0,
    trestbps: 0,
    chol: 0,
    fbs: 0,
    restecg: 0,
    thalach: 0,
    exang: 0,
    oldpeak: 0,
    slope: 0,
    ca: 0,
    thal: 0,
    riskCategory: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    loadUser();
  }, []);

  const addPatientClinicalData = async () => {
    if (location.state) {
      await client
        .mutate({
          mutation: ADD_PATIENT_CLINICAL_DATA,
          variables: {
            patientId: location.state._id,
            age: Number(clinicalData.age),
            sex: Number(clinicalData.sex),
            cp: Number(clinicalData.cp),
            trestbps: Number(clinicalData.trestbps),
            chol: Number(clinicalData.chol),
            restecg: Number(clinicalData.restecg),
            fbs: Number(clinicalData.fbs),
            thalach: Number(clinicalData.thalach),
            exang: Number(clinicalData.exang),
            oldpeak: Number(clinicalData.oldpeak),
            slope: Number(clinicalData.slope),
            ca: Number(clinicalData.ca),
            riskCategory: Number(clinicalData.riskCategory),
            thal: Number(clinicalData.thal),
          },
        })
        .then((result) => {
          console.log(result.data);

          navigate("/showDetails", { state: { _id: location.state._id } });
        })
        .catch((error) => {
          // navigate("/showDetails", { state: { _id: location.state._id } });

          console.log("error in fetching nurses:", error);
        });
    } else {
      navigate("/dashboard");
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (location.state._id) {
      addPatientClinicalData();
    } else {
      navigate("/dashboard");
    }
  };

  const onChange = (e) => {
    setClinicalData({ ...clinicalData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="card-container">
        <div className="row justify-content-center">
          <h2>
            <span className="text-primary">Add Clinical Data</span> for Patient
          </h2>
        </div>
        <div className="row justify-content-center">
          <Form
            className="register-form"
            onSubmit={handleOnSubmit}
            style={{ width: "30%" }}
          >
            <Form.Group controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="Enter Age"
                name="age"
                onChange={onChange}
                value={clinicalData.age}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group controlId="sex">
              <Form.Label>Sex</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter Sex"
                name="sex"
                onChange={onChange}
                value={clinicalData.sex}
                min="0"
                max="1"
                required
              />
            </Form.Group>
            <Form.Group controlId="cp">
              <Form.Label>CP</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter CP"
                name="cp"
                onChange={onChange}
                value={clinicalData.cp}
                min="1"
                max="4"
                required
              />
            </Form.Group>
            <Form.Group controlId="trestbps">
              <Form.Label>trestbps</Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="Enter trestbps"
                name="trestbps"
                onChange={onChange}
                value={clinicalData.trestbps}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group controlId="chol">
              <Form.Label>chol</Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="Enter chol"
                name="chol"
                onChange={onChange}
                value={clinicalData.chol}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group controlId="fbs">
              <Form.Label>fbs</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter fbs"
                name="fbs"
                onChange={onChange}
                value={clinicalData.fbs}
                min="0"
                max="1"
                required
              />
            </Form.Group>
            <Form.Group controlId="restecg">
              <Form.Label>restecg</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter restecg"
                name="restecg"
                onChange={onChange}
                value={clinicalData.restecg}
                min="0"
                max="2"
                required
              />
            </Form.Group>
            <Form.Group controlId="thalach">
              <Form.Label>thalach</Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="Enter thalach"
                name="thalach"
                onChange={onChange}
                value={clinicalData.thalach}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group controlId="exang">
              <Form.Label>exang</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter exang"
                name="exang"
                onChange={onChange}
                value={clinicalData.exang}
                min="0"
                max="1"
                required
              />
            </Form.Group>
            <Form.Group controlId="oldpeak">
              <Form.Label>oldpeak</Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="Enter oldpeak"
                name="oldpeak"
                onChange={onChange}
                value={clinicalData.oldpeak}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group controlId="slope">
              <Form.Label>slope</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter slope"
                name="slope"
                onChange={onChange}
                value={clinicalData.slope}
                min="1"
                max="3"
                required
              />
            </Form.Group>
            <Form.Group controlId="ca">
              <Form.Label>ca</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter ca"
                name="ca"
                onChange={onChange}
                value={clinicalData.ca}
                min="0"
                max="3"
                required
              />
            </Form.Group>
            <Form.Group controlId="thal">
              <Form.Label>thal</Form.Label>
              <Form.Control
                type="number"
                step="1"
                placeholder="Enter thal"
                name="thal"
                onChange={onChange}
                value={clinicalData.thal}
                min="3"
                max="7"
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
    </div>
  );
};

export default AddPatientClinicalData;
