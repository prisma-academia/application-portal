import React from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import MyButton from "../components/button";
import { useNavigate } from "react-router-dom";
import useFormStore from "../store/form";
import SelectInput from "../components/selectinput";

const subjects = [
  "English Language",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Literature in English",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Government",
  "Commerce",
  "Accounting",
  "Civic Education",
  "Agricultural Science",
  "Physical Education",
  "Health Education",
  "Home Economics",
  "Business Studies",
  "French",
  "Marketing",
  "Music",
  "Art",
  "Technical Drawing",
  "Religious Studies",
  "Social Studies",
  "Information Technology",
  "Food and Nutrition",
  "Further Mathematics",
  "Christian Religious Studies (CRS)",
  "Islamic Religious Studies (IRS)",
  "Theatre Arts",
  "Financial Accounting",
];

const results = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9", "Awaiting Result"];

const validationSchema = Yup.object().shape({
  results: Yup.array()
    .of(
      Yup.object().shape({
        subject: Yup.string().required("Subject is required"),
        result: Yup.string()
          .required("Result is required")
          .oneOf(results, "Invalid result"),
      })
    )
    .length(9, "Exactly 9 subjects are required")
    .test("unique-subjects", "Each subject must be unique", (values) => {
      const selectedSubjects = values.map((result) => result.subject);
      return new Set(selectedSubjects).size === selectedSubjects.length;
    }),
});

const OLevelsResults = () => {
  const updateForm = useFormStore((state) => state.updateForm);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      results: [
        { subject: "English Language", result: "" },
        { subject: "Mathematics", result: "" },
        { subject: "Biology", result: "" },
        { subject: "Chemistry", result: "" },
        { subject: "Physics", result: "" },
        ...Array(4).fill({ subject: "", result: "" }),
      ],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.results.length === 9) {
        updateForm({ result: values.results });
        navigate("/form/preview");
      } else {
        alert("All fields are required");
      }
    },
  });

  const handleChange = (index, field, value) => {
    formik.setFieldValue(`results[${index}].${field}`, value);
  };

  const getSubjectOptions = (index) => {
    const selectedSubjects = formik.values.results
      .filter((_, i) => i !== index)
      .map((result) => result.subject);
    return subjects
      .filter((subject) => !selectedSubjects.includes(subject))
      .map((subject) => ({ value: subject, label: subject }));
  };

  const getGradeClass = (grade) => {
    if (!grade) return "";
    if (["A1", "B2", "B3"].includes(grade)) return "text-green-600";
    if (["C4", "C5", "C6"].includes(grade)) return "text-blue-600";
    return "text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-6 px-6">
            <h2 className="text-2xl font-bold text-white">O-Level Results</h2>
            <p className="text-pink-100 mt-1">
              Enter your WAEC/NECO/NABTECH examination results (9 subjects required)
            </p>
          </div>
          
          <div className="p-6">
            <div className="bg-pink-50 rounded-lg p-4 mb-6 border-l-4 border-pink-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-pink-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-pink-700">
                    You can combine results from WAEC, NECO, and NABTECH (maximum of two sittings).
                    The first 5 subjects are required and cannot be changed.
                  </p>
                </div>
              </div>
            </div>
            
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                <div className="space-y-6">
                  {formik.values.results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg ${index < 5 ? 'bg-slate-50 border border-slate-200' : 'bg-white border border-slate-100'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-slate-700">
                          Subject {index + 1}
                          {index < 5 && <span className="ml-2 text-xs font-normal text-pink-600">(Required)</span>}
                        </h3>
                        
                        {result.result && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ["A1", "B2", "B3"].includes(result.result) 
                              ? 'bg-green-100 text-green-800' 
                              : ["C4", "C5", "C6"].includes(result.result) 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.result}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <SelectInput
                          label="Subject"
                          name={`results[${index}].subject`}
                          formik={formik}
                          options={getSubjectOptions(index)}
                          onChange={(e) => handleChange(index, "subject", e.target.value)}
                          value={result.subject}
                          disabled={index < 5}
                          placeholder="Select a subject"
                        />
                        
                        <SelectInput
                          label="Grade"
                          name={`results[${index}].result`}
                          formik={formik}
                          options={results.map((result) => ({
                            value: result,
                            label: result,
                          }))}
                          onChange={(e) => handleChange(index, "result", e.target.value)}
                          value={result.result}
                          placeholder="Select your grade"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-slate-200 mt-8 pt-6 flex justify-between items-center">
                  <button 
                    onClick={() => navigate(-1)}
                    type="button"
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </form>
            </FormikProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OLevelsResults;
