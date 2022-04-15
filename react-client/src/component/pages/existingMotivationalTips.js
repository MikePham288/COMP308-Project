import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";

const AddExistingPatientMotivationalTip = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [motivationalTip, setMotivationalTip] = useState({
    videoLink: "",
    id: "",
    type: "video",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [motivationalTips, setMotivationalTips] = useState([]);
  const apiUrl = "http://localhost:3000/api/getAllMotivationalTips";
  const updateUrl = "http://localhost:3000/api/updatePatientMotivationalTip/";

  useEffect(() => {
    console.log(location.state._id);
    loadUser();
    getAllMotivationalTips();
  }, []);

  const addToPatientMotivationalTip = async () => {
    if (location.state._id) {
      if (motivationalTip.id) {
        await axios
          .post(updateUrl + location.state._id, { id: motivationalTip.id })
          .then((result) => {
            console.log(result.data);

            navigate("/showDetails", { state: { _id: location.state.id } });
          })
          .catch((error) => {
            navigate("/showDetails", { state: { _id: location.state.id } });

            console.log("error in fetching nurses:", error);
          });
      }
    } else {
      navigate("/dashboard");
    }
  };

  const getAllMotivationalTips = async () => {
    if (location.state._id) {
      await axios
        .get(apiUrl)
        .then((result) => {
          console.log(result.data);
          setMotivationalTips(result.data);
          if (result.data.length !== 0) {
            setMotivationalTip(result.data[0]);
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
