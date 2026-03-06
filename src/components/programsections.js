import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Modal from "./modal";

const DEFAULT_REQUIREMENTS = `
Application Fee: as per session.
Accepted Results: WAEC, NECO, NABTECH (maximum of two sittings).
Required Subjects: English, Mathematics, Physics, Chemistry, and Biology.
`.trim();

const categoryIcons = {
  nursing: "👨‍⚕️",
  midwifery: "👶",
  community: "🏥",
  default: "📚",
};

const getIcon = (name = "", category = "") => {
  const key = (name + " " + category).toLowerCase();
  if (key.includes("nursing") && !key.includes("midwifery")) return categoryIcons.nursing;
  if (key.includes("midwifery")) return categoryIcons.midwifery;
  if (key.includes("community")) return categoryIcons.community;
  return categoryIcons.default;
};

const ProgramsSection = ({ programmes = [] }) => {
  const activeProgrammes = useMemo(
    () => programmes.filter((p) => p.status !== "inactive"),
    [programmes]
  );

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-800">Our Programs</h2>
      </div>

      {activeProgrammes.length === 0 ? (
        <p className="text-slate-600 text-center py-8">No programmes available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProgrammes.map((program, index) => {
            const durationText = typeof program.duration === "number" ? `${program.duration} years` : (program.duration || "—");
            const description = program.description || `${program.category || "Professional"} programme. Application fee: ₦${program.price?.toLocaleString?.() ?? program.price ?? "—"}.`;
            return (
              <motion.div
                key={program._id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">{program.name}</h3>
                  <span className="text-2xl" role="img" aria-label={program.name}>{getIcon(program.name, program.category)}</span>
                </div>

                <div className="p-5">
                  <p className="text-slate-600 mb-4">{description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{durationText}</span>
                    </div>

                    <button
                      onClick={() => openModal({ ...program, requirements: DEFAULT_REQUIREMENTS, duration: durationText, details: program.category || program.name })}
                      className="text-pink-600 font-medium hover:text-pink-700 transition-colors flex items-center"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} program={selectedProgram} />
    </div>
  );
};

export default ProgramsSection;
