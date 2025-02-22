import { Schema, model } from "mongoose";
import EvaluationFormClass from "../../evalForm.js";

const evaluationFormSchema = new Schema(
  {
    evaluationFormId: {
      type: String,
      required: true,
      unique: true,
    },
    interviewerId: {
      type: Schema.Types.ObjectId,
      ref: "Interviewer",
      required: true,
    },
    evalForm: {
      type: Object,
      required: true,
      validate: {
        validator: function (form) {
          if (!form || typeof form !== "object") return false;

          const templateForm = new EvaluationFormClass();

          // Recursive validation function
          const validateSection = (template, data) => {
            if (typeof template !== typeof data) return false;

            if (typeof template === "boolean") return typeof data === "boolean";
            if (Array.isArray(template)) return Array.isArray(data);

            if (typeof template === "object" && template !== null) {
              const templateKeys = Object.keys(template);
              const dataKeys = Object.keys(data);

              if (templateKeys.length !== dataKeys.length) return false;

              return templateKeys.every(
                (key) =>
                  dataKeys.includes(key) &&
                  validateSection(template[key], data[key])
              );
            }

            return false;
          };

          // Validate all sections of the incoming form
          return (
            validateSection(
              templateForm.technicalEvaluation,
              form.technicalEvaluation
            ) &&
            validateSection(
              templateForm.softSkillsAssessment,
              form.softSkillsAssessment
            ) &&
            validateSection(templateForm.culturalFit, form.culturalFit) &&
            validateSection(templateForm.customQuestions, form.customQuestions)
          );
        },
        message: (props) => `Invalid evaluation form structure.`,
      },
    },
  },
  { timestamps: true }
);

export const EvaluationForm = model("EvaluationForm", evaluationFormSchema);
