import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth/authContext";
import "../../App.css";
import { useNavigate } from "react-router";
import gql from "graphql-tag";
import { client } from "../..";

const GET_PATIENT_LIST = gql`
  query GetInfo {
    getAllPatientsByNurseId {
      _id
      account {
        _id
        firstName
        lastName
        email
        address
        city
        phoneNumber
        accountType
      }
    }
  }
`;

const NurseDashboard = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;
  const [patientsList, setPatientsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    getAllPatients();
  }, []);

  const getAllPatients = async () => {
    await client
      .query({
        query: GET_PATIENT_LIST,
      })
      .then((response) => {
        setPatientsList(response.data.getAllPatientsByNurseId);
      });
  };

  const handleViewVitals = (id) => {
    navigate("/showDetails", { state: { _id: id } });
  };

  return (
    <div>
      <div className="card-container container-fluid">
        <div className="row justify-content-center row-title">
          <h1>
            Nurse <span className="text-primary">Dashboard</span>
          </h1>
        </div>
        <div className="row justify-content-center row-padding">
          <h2>
            Patients <span className="text-primary">List</span>
          </h2>
        </div>
        <div className="d-flex row justify-content-center row-padding">
          <div className="col-auto">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
                {patientsList.map((patient, idx) => {
                  // console.log("patient: ", patient);
                  return (
                    <tr key={idx}>
                      <td>
                        {patient.account.firstName} {patient.account.lastName}
                      </td>
                      <td>{patient.account.email}</td>
                      <td>{patient.account.address}</td>
                      <td>{patient.account.city}</td>
                      <td>{patient.account.phoneNumber}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            handleViewVitals(patient._id);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
