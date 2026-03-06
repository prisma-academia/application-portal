// export default ScrollingInfo;
import React from "react";
import Carousel from "./carousel";
import config from "../config";
import defaultLogo from "../assets/logo1.jpeg";

const ScrollingInfo = () => {
  const logoUrl = config.logoSecondaryUrl || config.logoUrl || defaultLogo;
  const shortName = config.appName.split(/[\s,]+/).slice(0, 2).join(" ");
  return (
    <div className="overflow-hidden">
      <div className="flex flex-col items-center justify-center py-6 px-4 sm:flex-row sm:justify-between sm:px-8 border-b border-slate-100">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt=""
            className="w-20 h-20 sm:w-16 sm:h-16 object-contain rounded-full shadow-sm"
          />
          <div className="ml-4 hidden sm:block">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {shortName}
            </h2>
            <p className="text-sm text-slate-500">{config.appTagline}</p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 text-center sm:text-right">
          <h3 className="text-lg font-medium text-primary">{config.appAdmissionTitle}</h3>
          <p className="text-sm text-slate-500">Academic Session</p>
        </div>
      </div>

      <div className="h-72 sm:h-80 md:h-96 w-full">
        <Carousel />
      </div>
      
      <div className="bg-gradient-to-r from-pink-500 to-pink-700 py-3 px-4 text-white text-center">
        <p className="text-sm font-medium">Applications for 2025-2026 academic session are now open. Apply before the deadline!</p>
      </div>
    </div>
  );
};

export default ScrollingInfo;
