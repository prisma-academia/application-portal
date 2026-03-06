import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/button";
import { useNavigate } from "react-router-dom";
import useFormStore from "../store/form";
import FormInput from "../components/forminput";
import SelectInput from "../components/selectinput";
import CustomTable from "../components/customTable";

const examOptions = [
  { label: "Primary School", value: "primary" },
  { label: "WAEC", value: "WAEC" },
  { label: "NECO", value: "NECO" },
  { label: "NABTECH", value: "NABTECH" },
];

const validationSchema = Yup.object({
  school: Yup.string().required("School name is required"),
  examType: Yup.string().required("Examination type is required"),
  examNumber: Yup.string().when("examType", {
    is: (value) => value !== "primary",
    then: (schema) => schema.required("Examination Number is required"),
    otherwise: (schema) => schema.optional(),
  }),
  examYear: Yup.string().required("Year is required"),
});

function Examination() {
  const updateForm = useFormStore((state) => state.updateForm);
  const [examinations, setExaminations] = useState([]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      school: "",
      examNumber: "",
      examType: "",
      examYear: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (examinations.length < 2) {
        const newExam = { ...values, id: Date.now() }; // Add a unique ID
        setExaminations((prev) => [...prev, newExam]);
        resetForm();
      } else {
        alert("You can only add up to two examinations.");
      }
    },
  });

  const addExamination = () => {
    formik.handleSubmit();
  };

  const handleNext = () => {
    if (examinations.length > 0) {
      updateForm({ examinations });
      navigate("/form/o-levels");
    } else {
      alert("Please add at least one examination.");
    }
  };

  const deleteExamination = (id) => {
    setExaminations(examinations.filter((exam) => exam.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-6 px-6">
            <h2 className="text-2xl font-bold text-white">Examination Information</h2>
            <p className="text-pink-100 mt-1">Add your examination details (maximum 2 examinations)</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <form className="space-y-4">
                  <SelectInput
                    label="Examination Type"
                    name="examType"
                    formik={formik}
                    options={examOptions}
                    onChange={formik.handleChange}
                    placeholder="Select examination type"
                  />
                  
                  <FormInput
                    label="School Name"
                    name="school"
                    formik={formik}
                    placeholder="Enter name of school"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Examination Year"
                      name="examYear"
                      formik={formik}
                      placeholder="YYYY-MM"
                      type="month"
                    />
                    
                    {formik.values.examType !== "primary" && (
                      <FormInput
                        label="Examination Number"
                        name="examNumber"
                        formik={formik}
                        placeholder="Enter exam number"
                      />
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <MyButton
                      text="Add Examination" 
                      type="button"
                      variant="filled"
                      onClick={addExamination}
                      full={false}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      }
                      iconPosition="left"
                    />
                  </div>
                </form>
              </div>
              
              <div className="border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 pt-6 lg:pt-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Added Examinations
                </h3>
                
                {examinations.length === 0 ? (
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-500 text-sm">No examinations added yet. Use the form to add your examination details.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <CustomTable rows={examinations} onDelete={deleteExamination} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-slate-200 mt-8 pt-6 flex justify-between items-center">
              <button 
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              <button 
                onClick={handleNext}
                className={`px-6 py-2 ${examinations.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'} text-white rounded-lg transition-colors flex items-center`}
                disabled={examinations.length === 0}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Examination;