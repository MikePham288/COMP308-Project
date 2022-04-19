const { gql } = require("apollo-server-express");
const accountTypeDef = require("./typedefs/account");
const nurseTypeDef = require("./typedefs/nurse");
const patientTypeDef = require("./typedefs/patient");

defaultTypeDef = gql`
  type Query {
    hello: String!
  }
`;

//Return an object with all the typeDefs
module.exports = [
  defaultTypeDef,
  accountTypeDef,
  nurseTypeDef,
  patientTypeDef,
]