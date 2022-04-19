const Account = require("mongoose").model("Account");
const Patient = require("mongoose").model("Patient");
const Nurse = require("mongoose").model("Nurse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const { UserInputError } = require("apollo-server-express");
const mongoose = require("mongoose");

const expiresIn = 60 * 60 * 2;
const jwtKey = config.secretKey;

module.exports = {
  Mutation: {
    createAccount: async (
      _,
      {
        firstName,
        lastName,
        email,
        password,
        address,
        city,
        phoneNumber,
        accountType,
        nurseId,
      }
    ) => {
      if (["PATIENT", "NURSE"].indexOf(accountType) === -1) {
        throw new UserInputError("Invalid account type");
      }
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !address ||
        !city ||
        !phoneNumber
      )
        throw new UserInputError("Missing required fields");
      //check if valid email
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
        throw new UserInputError("Invalid email");
      if (password.length < 8)
        throw new UserInputError("Password must be at least 8 characters long");

      try {
        let account = await Account.findOne({ email });
        if (account) {
          throw new UserInputError("Account already exists");
        }
        let newAccount = new Account({
          firstName,
          lastName,
          email,
          password,
          address,
          city,
          phoneNumber,
          accountType,
        });

        await newAccount.save();

        if (accountType === "PATIENT") {
          let patient = new Patient();
          patient.account = newAccount;
          patient.nurse = new mongoose.Types.ObjectId(nurseId);
          await patient.save();
        } else {
          let nurse = new Nurse();
          nurse.account = newAccount;
          await nurse.save();
        }

        const payload = {
          user: {
            id: newAccount._id,
            accountType: newAccount.accountType,
          },
        };

        // Create token with the id of the user in the payload and expires as per jwtExpirySeconds
        const token = jwt.sign(payload, jwtKey, {
          expiresIn,
        });
        return {
          token,
          id: newAccount._id,
        };
      } catch (err) {
        console.error(err.message);
        throw new Error(err.message ?? "Server error");
      }
    },
    signIn: async (_, { email, password }) => {
      try {
        let user = await Account.findOne({ email });
        // Checks to see if the user is not null
        if (!user) {
          throw new UserInputError("No user found with this email");
        }
        // matches the password of user with the stored password
        const isMatch = await bcrypt.compare(password, user.password);
        // reports invalid if password doesn't match
        if (!isMatch) {
          throw new UserInputError("Invalid password");
        }

        const payload = {
          user: {
            id: user._id,
            type: user.accountType,
          },
        };

        // Create token with the id of the user in the payload and expires as per jwtExpirySeconds
        const token = jwt.sign(payload, jwtKey, {
          expiresIn,
        });
        return {
          token,
          id: user._id,
        };
      } catch (err) {
        throw new Error(err.message ?? "Server error");
      }
    },
  },
  Query: {
    getInfo: async (_, __, context) => {
      console.log("context", context);
      if (!context.user.id) {
        throw new Error("You must be logged in");
      } else {
        const user = await Account.find(
          { _id: context.user.id },
          (err, accounts) => {
            if (err) {
              throw new Error(err.message ?? "Server error");
            } else {
              return accounts;
            }
          }
        )
          .clone()
          .select("-password");
        return user;
      }
    },
  },
};
