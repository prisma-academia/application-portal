import React from "react";
import * as ReactCountdown from "react-countdown";

const Countdown = ReactCountdown?.default ?? ReactCountdown;

const CountdownTimer = ({ session }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Application Closed</h3>
          <p className="text-sm text-slate-600">The application period has ended</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-4 gap-3 mb-4 text-center">
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-sm py-3 px-4 mb-1">
                <span className="font-mono text-3xl font-bold text-pink-700">{days}</span>
              </div>
              <span className="text-xs text-slate-600">Days</span>
            </div>
            
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-sm py-3 px-4 mb-1">
                <span className="font-mono text-3xl font-bold text-pink-700">{hours}</span>
              </div>
              <span className="text-xs text-slate-600">Hours</span>
            </div>
            
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-sm py-3 px-4 mb-1">
                <span className="font-mono text-3xl font-bold text-pink-700">{minutes}</span>
              </div>
              <span className="text-xs text-slate-600">Mins</span>
            </div>
            
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-sm py-3 px-4 mb-1">
                <span className="font-mono text-3xl font-bold text-pink-700">{seconds}</span>
              </div>
              <span className="text-xs text-slate-600">Secs</span>
            </div>
          </div>
        </div>
      );
    }
  };

  const formattedDate = new Date(session?.closingDate || 0).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  if (typeof Countdown !== "function") {
    return (
      <div className="text-center py-4">
        <h2 className="text-lg font-semibold text-slate-800">Application Deadline</h2>
        <p className="text-sm text-slate-600 mt-2">Closing: {formattedDate}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-lg font-semibold text-slate-800">Application Deadline</h2>
      </div>
      
      <Countdown date={new Date(session?.closingDate || 0)} renderer={renderer} />
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h6 className="text-sm font-medium text-slate-700 mb-1">Closing Date:</h6>
        <p className="text-sm text-slate-600">{formattedDate}</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
