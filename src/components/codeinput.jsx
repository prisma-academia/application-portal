import React, { useRef } from "react";

// Six single-digit boxes that behave like one field: typing advances, backspace goes
// back, and pasting a whole code fills every box.
function CodeInput({ value, onChange, length = 6, disabled = false, autoFocus = true }) {
  const inputs = useRef([]);
  // Empty boxes are held as spaces so clearing a middle digit doesn't shift the rest;
  // callers strip non-digits before submitting.
  const digits = Array.from({ length }, (_, i) => (value[i] || "").trim());

  const focus = (index) => {
    const el = inputs.current[Math.max(0, Math.min(length - 1, index))];
    if (el) el.focus();
  };

  const setDigits = (next) => onChange(next.map((d) => d || " ").join("").replace(/\s+$/, ""));

  const handleChange = (index, event) => {
    const typed = event.target.value.replace(/\D/g, "");
    if (!typed) return;
    const next = [...digits];
    // A paste or autofill can deliver several digits into one box.
    typed.split("").forEach((digit, offset) => {
      if (index + offset < length) next[index + offset] = digit;
    });
    setDigits(next);
    focus(index + typed.length);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        focus(index - 1);
      }
      setDigits(next);
    } else if (event.key === "ArrowLeft") {
      focus(index - 1);
    } else if (event.key === "ArrowRight") {
      focus(index + 1);
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    focus(pasted.length);
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={length}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          aria-label={`Digit ${index + 1}`}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 disabled:bg-slate-50"
        />
      ))}
    </div>
  );
}

export default CodeInput;
