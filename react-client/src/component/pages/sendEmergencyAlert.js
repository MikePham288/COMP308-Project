import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import gql from "graphql-tag";
import { client } from "../..";

const SEND_EMERGENCY_ALERT = gql`
  mutation SendEmergencyAlert($reason: String) {
    sendEmergencyAlert(reason: $reason)
  }
`;

const SendEmergencyAlert = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [emergencyAlert, setEmergencyAlert] = useState({
    reason: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const sendEmergencyAlert = async () => {
    await client
      .mutate({
        mutation: SEND_EMERGENCY_ALERT,
        variables: {
          reason: emergencyAlert.reason,
        },
      })
      .then((result) => {
        console.log(result.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        // navigate("/dashboard");

        console.log("error in saving result:", error);
      });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    sendEmergencyAlert();
  };

  const onChange = (e) => {
    setEmergencyAlert({ ...emergencyAlert, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="card-container">
        <div className="row justify-content-center">
          <h2>
            <span className="text-danger">Send Emergency Alert</span>
          </h2>
        </div>
        <div className="row justify-content-center">
          <h4>
            This Emergency Alert will be sent to your doctor and hospital.
          </h4>
        </div>
        <Form className="register-form" onSubmit={handleOnSubmit}>
          <Form.Group controlId="alertReason">
            <Form.Label style={{ fontWeight: "bold" }}>Alert Reason</Form.Label>
            <textarea
              rows="8"
              placeholder="Enter alert reason"
              name="reason"
              onChange={onChange}
              value={emergencyAlert.reason}
              required
            />
          </Form.Group>
          <div className="row justify-content-center">
            <Button variant="danger" type="submit">
              SEND ALERT
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SendEmergencyAlert;
