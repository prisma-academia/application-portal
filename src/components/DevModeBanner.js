import React from "react";
import config from "../config";

function DevModeBanner() {
  if (!config.isDevelopment) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950 shadow-md"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">⚠</span>
      <span>This is test mode — anything done is not real.</span>
    </div>
  );
}

export default DevModeBanner;
