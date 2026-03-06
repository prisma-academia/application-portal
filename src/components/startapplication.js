import React, { useState, useMemo } from "react";
import MyButton from "./button";
import Loader from "./loader";
import { useNavigate } from "react-router-dom";
import useFormStore from "../store/form";

const StartApplication = ({ programmes = [] }) => {
  const navigate = useNavigate();
  const updateForm = useFormStore((state) => state.updateForm);
  const [programmeId, setProgrammeId] = useState("");

  const activeProgrammes = useMemo(
    () => programmes.filter((p) => p.status !== "inactive"),
    [programmes]
  );

  const handleChange = (e) => {
    setProgrammeId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!programmeId) return;
    updateForm({ programme: programmeId });
    navigate("/form/bio-data");
  };

  if (!Array.isArray(programmes)) {
    return (
      <div className="flex justify-center py-6">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 className="text-lg font-semibold text-slate-800">Start Application</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Program
          </label>
          <div className="relative">
            <select
              name="program"
              value={programmeId}
              onChange={handleChange}
              className="w-full p-3 pr-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 appearance-none bg-white"
            >
              <option value="" disabled>Select your program</option>
              {activeProgrammes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">Select a program to begin your application process</p>
        </div>

        <MyButton
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-colors"
          text="Start Application"
          type="submit"
          disabled={!programmeId || activeProgrammes.length === 0}
        />
      </form>
    </div>
  );
};

export default StartApplication;
