import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import MyButton from "./button";
import { useNavigate } from "react-router-dom";
import useFormStore from "../store/form";

const Modal = ({ isOpen, onClose, program }) => {
  const navigate = useNavigate();
  const updateForm = useFormStore((state) => state.updateForm);

  useEffect(() => {
    if (isOpen && program && program._id) {
      updateForm({ programme: program._id });
    }
  }, [isOpen, program, updateForm]);

  if (!isOpen) return null;
  if (!program) return null;

  const requirementsText = program.requirements ?? "";
  const requirementsArray = (typeof requirementsText === "string" ? requirementsText : String(requirementsText))
    .trim()
    .split("\n")
    .filter((item) => item.trim() !== "");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh] min-h-[50vh]">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-pink-600 transition-colors duration-200 z-10"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>
        
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {program.name ?? "Programme"}
          </h2>
          <p className="text-pink-100 text-sm mt-1">Program Details</p>
        </div>
        
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-md font-semibold text-slate-800 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Requirements
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <ul className="space-y-2">
                {requirementsArray.map((requirement, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-700">
                    <span className="inline-block w-1.5 h-1.5 bg-pink-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>
                      {requirement.split("\n").map((line, subIndex) => (
                        <span key={subIndex}>{line}</span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-md font-semibold text-slate-800 flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration
            </h3>
            <p className="text-sm text-slate-700">{program.duration ?? "—"}</p>
          </div>

          {(program.details != null && program.details !== "") && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-md font-semibold text-slate-800 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Program Details
              </h3>
              <p className="text-sm text-slate-700">{program.details}</p>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 pt-0">
          <MyButton
            text="Start Application"
            variant="filled"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            }
            iconPosition="right"
            className="w-full sm:w-auto"
            onClick={() => {
              const slug = (program.name ?? "").toLowerCase().replace(/\s+/g, "-");
              navigate(slug ? `/form/Bio-Data?program=${slug}` : "/form/Bio-Data");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
