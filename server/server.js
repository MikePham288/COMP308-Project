process.env.NODE_ENV =
  process?.env?.NODE_ENV === "production" ? "production" : "development";

const mongoose = require("./config/mongoose");
const express = require("./config/express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const jwt = require("jsonwebtoken");

const db = mongoose();
const app = express();

//Import GraphQL types and resolvers
const resolvers = require("./config/graphql/resolvers");
const typeDefs = require("./config/graphql/typedefs");
const config = require("./config/config");
const jwtKey = config.secretKey;

let apolloServer = null;
//Create GraphQL endpoint
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req?.headers?.authorization?.split(" ")[1] || "";
      if (token != "") {
        try {
          const tokenValue = jwt.verify(token, jwtKey);
          return tokenValue;
        } catch (err) {
          return {};
        }
      }
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();
const httpserver = http.createServer(app);

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000/");
  console.log(`gql path is ${apolloServer.graphqlPath}`);
});

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app; //returns the application object
// Log the server status to the console

