const mongoose = require("mongoose");
const Account = require("mongoose").model("Account");
const Patient = require("mongoose").model("Patient");
const MotivationalTip = require("mongoose").model("MotivationalTip");
const VitalSign = require("mongoose").model("VitalSign");
const ClinicalData = require("mongoose").model("ClinicalData");
const EmergencyAlert = require("mongoose").model("EmergencyAlert");
const { ObjectId } = require("mongodb");
module.exports = {
  Query: {
    getPatient: async (_, __, { user }) => {
      if (!user) {
        throw new Error("You must be logged in to view this data");
      }
      const patient = await Patient.findOne({ account: user.id });
      return patient;
    },
    getPatientById: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error("You must be logged in to view this data");
      }
      const patient = await Patient.findOne({ _id: ObjectId(id) }).populate([
        "account",
        "vitalSigns",
        "emergencyAlerts",
        "motivationalTips",
        "nurse",
        "clinicalData",
      ]);
      return patient;
    },
    getLatestMotivationalTip: async (_, __, context) => {
      if (!context.user) {
        return "Please try login again";
      } else {
        const patient = await Patient.findOne({ account: context.user.id })
          .populate("motivationalTips")
          .clone();

        if (patient) {
          console.log(patient);
          return patient.motivationalTips[patient.motivationalTips.length - 1];
        } else {
          return "patient not found";
        }
      }
    },
  },
  Mutation: {
    patientCreateVitalSigns: async (
      _,
      {
        pulseRate,
        bloodPressure,
        weight,
        temperature,
        respiratoryRate,
        createdBy,
      },
      { user }
    ) => {
      console.log(user);
      const patient = await Account.findById(user.id);
      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patient.accountType !== "PATIENT") {
        throw new Error("User is not a patient");
      }

      const patientData = await Patient.findOne({ account: user.id });
      let vitalSign = new VitalSign({
        pulseRate,
        bloodPressure,
        weight,
        temperature,
        respiratoryRate,
        createdBy,
      });
      patientData.vitalSigns.push(vitalSign);
      await vitalSign.save();
      await patientData.save();
      return vitalSign;
    },
    patientCreateClinicalData: async (
      _,
      {
        age,
        sex,
        cp,
        trestbps,
        chol,
        fbs,
        restecg,
        thalach,
        exang,
        oldpeak,
        slope,
        ca,
        thal,
        riskCategory,
      },
      { user }
    ) => {
      const patient = await Account.findById(user._id);
      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patient.accountType !== "PATIENT") {
        throw new Error("User is not a patient");
      }

      const patientData = await Patient.findOne({ account: patientId });
      let clinicalData = new ClinicalData({
        age,
        sex,
        cp,
        trestbps,
        chol,
        fbs,
        restecg,
        thalach,
        exang,
        oldpeak,
        slope,
        ca,
        thal,
        riskCategory,
      });
      patientData.clinicalData.push(clinicalData);
      await clinicalData.save();
      await patientData.save();
      return clinicalData;
    },

    sendEmergencyAlert: async (_, { reason }, context) => {
      const patient = await Patient.findOne({
        account: context.user.id,
      }).populate("emergencyAlerts");
      if (patient) {
        let emergencyAlert = new EmergencyAlert({ reason });

        emergencyAlert.save((err, alert) => {
          if (err) {
            res.status(500).send({ msg: "server error", err: err }).end();
          } else {
            if (alert) {
              console.log(patient.emergencyAlerts);
              patient.emergencyAlerts.push(alert);
              patient.save();
              return patient;
            } else {
              return "server error clinical data not creates";
            }
          }
        });
      } else {
        return "patient not found";
      }
    },
  },
};
