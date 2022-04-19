const mongoose = require("mongoose");
const Account = require("mongoose").model("Account");
const Patient = require("mongoose").model("Patient");
const MotivationalTip = require("mongoose").model("MotivationalTip");
const VitalSign = require("mongoose").model("VitalSign");
const ClinicalData = require("mongoose").model("ClinicalData");
const { ObjectId } = require("mongodb");
module.exports = {
  Query: {
    getAllNurses: async (_, __, context) => {
      const allNurses = await Account.find(
        { accountType: "NURSE" },
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
      return allNurses;
    },

    getAllPatientsByNurseId: async (_, __, context) => {
      if (!context.user) {
      } else {
        const nursePatients = await Patient.find(
          { nurse: context.user.id },
          (err, patients) => {
            if (err) {
              throw new Error(err.message ?? "Server error");
            } else {
              return patients;
            }
          }
        )
          .populate("account")
          .clone()
          .select("-password");
        console.log(nursePatients);
        return nursePatients;
      }
    },

    getAllMotivationalTips: async (_, __, context) => {
      const getAllMotivationalTips = await MotivationalTip.find().clone();
      return getAllMotivationalTips;
    },
  },
  Mutation: {
    addMotivationalTip: async (_, { patientId, type, videoLink }) => {
      const patientData = await Patient.findOne({ _id: patientId });
      let motivationalTip = new MotivationalTip({
        type,
        videoLink: videoLink.replace("watch?v=", "embed/"),
      });
      patientData.motivationalTips.push(motivationalTip);
      await motivationalTip.save();
      await patientData.save();

      return patientData;
    },

    updatePatientMotivationalTip: async (_, { patientId, tipId }) => {
      const patient = await Patient.findOne({ _id: patientId });
      patient.motivationalTips.push(tipId);
      const updatedPatient = Patient.findByIdAndUpdate(
        patientId,
        patient,
        (err, patient) => {
          if (err) {
            return err;
          } else {
            return patient;
          }
        }
      );
      return updatedPatient;
    },

    addVitalSign: async (
      _,
      {
        patientId,
        pulseRate,
        bloodPressure,
        weight,
        temperature,
        respiratoryRate,
        createdBy,
      }
    ) => {
      const patient = await Patient.findOne({
        _id: patientId,
      }).populate("vitalSigns");
      console.log(patient);
      let vitalSign = new VitalSign({
        patientId,
        pulseRate,
        bloodPressure,
        weight,
        temperature,
        respiratoryRate,
        createdBy,
      });
      patient.vitalSigns.push(vitalSign);
      await vitalSign.save();
      await patient.save();
      return patient;
    },

    addClinicalData: async (
      _,
      {
        patientId,
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
      }
    ) => {
      const patientData = await Patient.findOne({ _id: patientId }).populate(
        "clinicalData"
      );
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

      return patientData;
    },
  },
};
