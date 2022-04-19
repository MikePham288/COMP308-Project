const { gql } = require("apollo-server-express");
module.exports = gql`
  type Account {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    address: String
    city: String
    phoneNumber: String
    accountType: String
  }

  type Patient {
    _id: String
    account: Account
    vitalSigns: [VitalSign]
    emergencyAlerts: [EmergencyAlert]
    motivationalTips: [MotivationalTip]
    clinicalData: [ClinicalData]
    nurse: Account
  }

  type AccountResponse {
    id: ID!
    token: String!
  }

  type Mutation {
    createAccount(
      firstName: String
      lastName: String
      email: String
      password: String
      address: String
      city: String
      phoneNumber: String
      accountType: String
      nurseId: String
    ): AccountResponse

    signIn(email: String, password: String): AccountResponse
  }
  type Query {
    getInfo: [Account]
  }
`;
