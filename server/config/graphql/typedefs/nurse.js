const { gql } = require("apollo-server-express");
module.exports = gql`
  type Query {
    getAllNurses: [Account]
    getAllPatientsByNurseId: [Patient]
    getAllMotivationalTips: [MotivationalTip]
  }

  type ClinicalData {
    age: Int
    sex: Int
    cp: Float
    trestbps: Float
    chol: Float
    fbs: Float
    restecg: Float
    thalach: Float
    exang: Float
    oldpeak: Float
    slope: Float
    ca: Float
    thal: Float
    riskCategory: Float
    createdOn: String
  }

  type EmergencyAlert {
    reason: String
    notified: Boolean
    date: String
  }

  type MotivationalTip {
    type: String
    videoLink: String
    _id: String
  }

  type VitalSign {
    pulseRate: Float
    bloodPressure: String
    weight: Float
    temperature: Float
    respiratoryRate: Float
    createdBy: String
  }

  type PatientData {
    vitalSigns: [VitalSign]
    emergencyAlerts: [EmergencyAlert]
    motivationalTips: [MotivationalTip]
    clinicalData: [ClinicalData]
    account: [Account]
    nurse: [Account]
  }

  type Mutation {
    addMotivationalTip(
      patientId: String
      type: String
      videoLink: String
    ): Patient

    addVitalSign(
      patientId: String
      pulseRate: Float
      bloodPressure: String
      weight: Float
      temperature: Float
      respiratoryRate: Float
      createdBy: String
    ): Patient

    addClinicalData(
      patientId: String
      age: Int
      sex: Int
      cp: Float
      trestbps: Float
      chol: Float
      fbs: Float
      restecg: Float
      thalach: Float
      exang: Float
      oldpeak: Float
      slope: Float
      ca: Float
      thal: Float
      riskCategory: Float
    ): Patient

    updatePatientMotivationalTip(
      motivationalTipId: String
      patientId: String
    ): Patient
  }
`;
