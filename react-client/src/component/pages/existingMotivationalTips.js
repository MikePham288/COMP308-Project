import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import { useLocation, useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";
import gql from "graphql-tag";
import { client } from "../..";

const UPDATE_MOTIVATIONAL_TIP = gql`
  mutation UpdatePatientMotivationalTip(
    $motivationalTipId: String
    $patientId: String
  ) {
    updatePatientMotivationalTip(
      motivationalTipId: $motivationalTipId
      patientId: $patientId
    ) {
      _id
    }
  }
`;

const GET_ALL_MOTIVATIONAL_TIPS = gql`
  query GetAllMotivationalTips {
    getAllMotivationalTips {
      type
      videoLink
      _id
    }
  }
`;

const AddExistingPatientMotivationalTip = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [motivationalTip, setMotivationalTip] = useState({
    videoLink: "",
    _id: "",
    type: "video",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [motivationalTips, setMotivationalTips] = useState([]);
  const apiUrl = "http://localhost:3000/api/getAllMotivationalTips";

  useEffect(() => {
    console.log(location.state._id);
    loadUser();
    getAllMotivationalTips();
  }, []);

  const addToPatientMotivationalTip = async () => {
    console.log(motivationalTip);
    if (location.state._id) {
      if (motivationalTip._id) {
        await client
          .mutate({
            mutation: UPDATE_MOTIVATIONAL_TIP,
            variables: {
              patientId: location.state._id,
              motivationalTipId: motivationalTip._id,
            },
          })
          .then((result) => {
            console.log(result.data);

            navigate("/showDetails", { state: { _id: location.state._id } });
          })
          .catch((error) => {
            navigate("/showDetails", { state: { _id: location.state._id } });

            console.log("error in fetching nurses:", error);
          });
      }
    } else {
      navigate("/dashboard");
    }
  };

  const getAllMotivationalTips = async () => {
    if (location.state._id) {
      await client
        .query({
          query: GET_ALL_MOTIVATIONAL_TIPS,
        })
        .then((result) => {
          console.log(
            "getallmotivationaltips: ",
            result.data.getAllMotivationalTips
          );
          setMotivationalTips(result.data.getAllMotivationalTips);
          if (result.data.getAllMotivationalTips.length !== 0) {
            setMotivationalTip(result.data.getAllMotivationalTips[0]);
          }
        })
        .catch((error) => {
          console.log("error in fetching nurses:", error);
        });
    } else {
      navigate("/dashboard");
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (location.state._id) {
      addToPatientMotivationalTip();
    } else {
      navigate("/dashboard");
    }
  };

  const onChange = (e) => {
    const index = motivationalTips.findIndex(
      (tip) => tip.id === e.target.value
    );
    if (index !== -1) {
      setMotivationalTip(motivationalTips[index]);
    }
    console.log(motivationalTip);
  };

  return (
    <div>
      <div className="card-container">
        <div className="row justify-content-center">
          <h2>
            Select From{" "}
            <span className="text-primary">Existing Motivational Tip</span> for
            Patient
          </h2>
        </div>
        <Form className="register-form" onSubmit={handleOnSubmit}>
          <Form.Group controlId="age">
            <Form.Label style={{ fontWeight: "bold" }}>Video Link</Form.Label>
            <select onChange={onChange} name="link" className="form-control">
              {motivationalTips.map((tip, idx) => (
                <option key={idx} value={tip.id}>
                  {tip.videoLink}
                </option>
              ))}
            </select>
          </Form.Group>
          {motivationalTip.link !== "" ? (
            <div className="row justify-content-center">
              <iframe
                key={motivationalTip.id}
                width="100%"
                height="500px"
                src={motivationalTip.videoLink}
              ></iframe>
            </div>
          ) : (
            <div className="row justify-content-center">
              <h3>Please Select a video from dropdown to view preview</h3>
            </div>
          )}

          <div className="row justify-content-center row-padding">
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddExistingPatientMotivationalTip;
