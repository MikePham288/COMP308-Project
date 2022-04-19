import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import { Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import gql from "graphql-tag";
import { client } from "../..";
const ADD_MOTIVATION_TIP = gql`
  mutation AddMotivationalTip(
    $patientId: String
    $type: String
    $videoLink: String
  ) {
    addMotivationalTip(
      patientId: $patientId
      type: $type
      videoLink: $videoLink
    ) {
      _id
      account {
        _id
      }
    }
  }
`;

const AddPatientMotivationalTip = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [motivationalTip, setMotivationalTip] = useState({
    videoLink: "",
    type: "video",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const addPatientMotivationalTip = async () => {
    if (location.state._id) {
      await client
        .mutate({
          mutation: ADD_MOTIVATION_TIP,
          variables: {
            patientId: location.state._id,
            type: motivationalTip.type,
            videoLink: motivationalTip.videoLink,
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
          // navigate("/showDetails", {
          //   state: {
          //     _id: location.state._id,
          //   },
          // });
          console.log("error in fetching nurses:", error);
        });
    } else {
      navigate("/dashboard");
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (location.state._id) {
      addPatientMotivationalTip();
    } else {
      navigate("/dashboard");
    }
  };

  const onChange = (e) => {
    setMotivationalTip({ ...motivationalTip, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="card-container">
        <div className="row justify-content-center">
          <h2>
            <span className="text-primary">Add Motivational Tip</span> for
            Patient
          </h2>
        </div>
        <Form className="register-form" onSubmit={handleOnSubmit}>
          <Form.Group controlId="age">
            <Form.Label>Video Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Video Link"
              name="videoLink"
              onChange={onChange}
              value={motivationalTip.videoLink}
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

export default AddPatientMotivationalTip;
