const { gql } = require("apollo-server-express");
module.exports = gql`
  type Query {
    getPatient: Patient
    getPatientById(id: String): Patient
    getLatestMotivationalTip: MotivationalTip
    # getPatientDetailsById: Patient
    # getPatientByIdDetail: Patient
  }

  type Mutation {
    patientCreateVitalSigns(
      pulseRate: Float
      bloodPressure: String
      weight: Float
      temperature: Float
      respiratoryRate: Float
      createdBy: String
    ): VitalSign

    patientCreateClinicalData(
      # patientId: String
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
    ): ClinicalData

    sendEmergencyAlert(reason: String): Int
  }
`;
