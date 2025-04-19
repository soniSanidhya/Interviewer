export default class EvaluationFormClass {
  constructor() {
    this.technicalEvaluation = {
      codingSkills: {
        dsa: false,
        languageProficiency: false,
        debugging: false,
        plagiarismCheck: false,
      },
      systemDesign: {
        scalability: false,
        costOptimization: false,
        apiDesign: false,
        databaseDesign: false,
      },
      toolsAndPlatforms: {
        cloud: false,
        devOps: false,
        legacyTech: false,
      },
    };

    this.softSkillsAssessment = {
      communication: {
        clarity: false,
        activeListening: false,
        conflictResolution: false,
      },
      collaboration: {
        gitWorkflow: false,
        feedbackHandling: false,
        teamPlayer: false,
      },
      adaptability: {
        startupMindset: false,
        learningAgility: false,
      },
    };

    this.culturalFit = {
      valuesAlignment: {
        companyValues: false,
        ethicalStandards: false,
      },
      growthMindset: {
        certifications: [],
        selfLearning: false,
      },
      workEthic: {
        ownership: false,
        punctuality: false,
      },
    };

    this.customQuestions = {
      programQuestions: [],
      theoryQuestions: [],
      otherQuestions: [],
    };
  }

  addProgramQuestion(question) {
    this.customQuestions.programQuestions.push(question);
  }

  addTheoryQuestion(question) {
    this.customQuestions.theoryQuestions.push(question);
  }

  addOtherQuestion(question) {
    this.customQuestions.otherQuestions.push(question);
  }

  isValidForm(form) {
    const isBoolean = (val) => typeof val === "boolean";
    const isArray = (val) => Array.isArray(val);

    const validateSection = (template, data) => {
      for (const key in template) {
        if (!data.hasOwnProperty(key)) return false;
        const templateValue = template[key];
        const dataValue = data[key];

        if (typeof templateValue === "boolean" && !isBoolean(dataValue))
          return false;
        if (Array.isArray(templateValue) && !isArray(dataValue)) return false;
        if (
          typeof templateValue === "object" &&
          !validateSection(templateValue, dataValue)
        )
          return false;
      }
      return true;
    };

    return (
      validateSection(this.technicalEvaluation, form.technicalEvaluation) &&
      validateSection(this.softSkillsAssessment, form.softSkillsAssessment) &&
      validateSection(this.culturalFit, form.culturalFit) &&
      validateSection(this.customQuestions, form.customQuestions)
    );
  }
}

// const templateEvaluationForm = new EvaluationForm();

// // Create a new instance
// const customEvaluationForm = new EvaluationForm();

// // Customize the form
// customEvaluationForm.addProgramQuestion("What is your experience with React?");
// customEvaluationForm.addTheoryQuestion(
//   "What is the difference between var and let?"
// );
// customEvaluationForm.addOtherQuestion(
//   "What is your experience with remote work?"
// );
// customEvaluationForm.addOtherQuestion(
//   "What is your experience with remote work?"
// );
// customEvaluationForm.softSkillsAssessment.communication.clarity = true;
// customEvaluationForm.softSkillsAssessment.communication.activeListening = true;

// // console.log(templateEvaluationForm.isValidForm(customEvaluationForm));
