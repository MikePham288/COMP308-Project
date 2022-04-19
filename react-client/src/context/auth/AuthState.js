import { useReducer } from "react";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import { gql } from "@apollo/client";
import { client } from "../..";

// These are the types that defines the action types in useReducer
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";

const LOGIN_MUTATION = gql`
  mutation SignIn($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      id
      token
    }
  }
`;

const GET_USER_INFO = gql`
  query GetInfo {
    getInfo {
      _id
      firstName
      lastName
      email
      address
      phoneNumber
      city
      accountType
    }
  }
`;

const SIGN_UP = gql`
  mutation CreateAccount(
    $firstName: String
    $lastName: String
    $email: String
    $password: String
    $address: String
    $city: String
    $phoneNumber: String
    $accountType: String
    $nurseId: String
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      address: $address
      city: $city
      phoneNumber: $phoneNumber
      accountType: $accountType
      nurseId: $nurseId
    ) {
      id
      token
    }
  }
`;

const AuthState = (props) => {
  // Declare the states here
  const initialState = {
    token: sessionStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    try {
      const result = await client.query({
        query: GET_USER_INFO,
      });
      console.log("info: ", result.data);

      dispatch({
        type: USER_LOADED,
        payload: result.data.getInfo[0],
      });
    } catch (err) {
      console.log(err);
      dispatch({ type: AUTH_ERROR });
    }
  };
  // Register User
  const register = async (formData) => {
    try {
      const vary = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        phoneNumber: formData.phoneNumber,
        accountType: formData.accountType,
        nurseId: formData.nurse_id,
      };
      const res = await client.mutate({
        mutation: SIGN_UP,
        variables: vary,
      });
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data.createAccount,
      });

      await loadUser();
    } catch (err) {
      console.log(err);
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg,
      });
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          email: email,
          password: password,
        },
      });
      console.log("data: ", data);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data.signIn,
      });
      await loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg,
      });
    }
  };
  // Logout
  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };
  // Clear Errors
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        clearErrors,
        loadUser,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
