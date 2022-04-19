const accountResolver = require("./resolvers/account");
const nurseResolver = require("./resolvers/nurse");
const patientResolver = require("./resolvers/patient");

const _ = require("lodash");

defaultResolver = {
  Query: {
    hello: () => "Hello world!",
  },
};
//Merge all resolvers into one object
const allResolvers = _.merge(defaultResolver, accountResolver, nurseResolver, patientResolver);

module.exports = allResolvers;
