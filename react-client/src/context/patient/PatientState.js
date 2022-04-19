import { useReducer } from "react";
import PatientContext from "./patientContext";
import PatientReducer from "./patientReducer";
import { ADD_VITALSIGN, VITALSIGN_ERROR, CLEAR_ERRORS } from "../types";
import { client } from "../..";
import gql from "graphql-tag";

const ADD_VITAL_SIGN = gql`
  mutation PatientCreateVitalSigns(
    $pulseRate: Float
    $bloodPressure: String
    $weight: Float
    $temperature: Float
    $respiratoryRate: Float
    $createdBy: String
  ) {
    patientCreateVitalSigns(
      pulseRate: $pulseRate
      bloodPressure: $bloodPressure
      weight: $weight
      temperature: $temperature
      respiratoryRate: $respiratoryRate
      createdBy: $createdBy
    ) {
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdBy
    }
  }
`;

const PatientState = (props) => {
  const initialState = {
    vitalSigns: [],
    error: null,
    loading: false,
    vitalSignAdded: false,
  };

  const [state, dispatch] = useReducer(PatientReducer, initialState);

  // Add vitalsign
  const addVitalSign = async (vitalSign) => {
    try {
      const res = await client.mutate({
        mutation: ADD_VITAL_SIGN,
        variables: {
          pulseRate: Number(vitalSign.pulseRate),
          bloodPressure: vitalSign.bloodPressure.toString(),
          weight: Number(vitalSign.weight),
          temperature: Number(vitalSign.temperature),
          respiratoryRate: Number(vitalSign.respiratoryRate),
          createdBy: vitalSign.createdBy,
        },
      });
      console.log("--------- ressssss ", res);
      dispatch({
        type: ADD_VITALSIGN,
        payload: res.data.patientCreateVitalSigns,
      });
    } catch (err) {
      console.log("Error received is +++++++ ", err);
      dispatch({
        type: VITALSIGN_ERROR,
        payload: err.response.data.msg,
      });
    }
  };

  // Clear Errors
  const clearErrors = () => {
    dispatch({
      type: CLEAR_ERRORS,
    });
  };

  return (
    <PatientContext.Provider
      value={{
        vitalSigns: state.vitalSigns,
        loading: state.loading,
        error1: state.error,
        vitalSignAdded: state.vitalSignAdded,
        addVitalSign,
        clearErrors,
        // getVitalSigns,
      }}
    >
      {props.children}
    </PatientContext.Provider>
  );
};

export default PatientState;
