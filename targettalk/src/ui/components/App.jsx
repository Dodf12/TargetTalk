// App.jsx
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

/* === Dark-mode toggle === */
const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => (
  <div className="dark-mode-toggle">
    <span className="dark-mode-text">
      <strong>{isDarkMode ? "Switch to Light" : "Switch to Dark"}</strong>
    </span>
    <div className="toggle-switch" onClick={toggleDarkMode}>
      <div
        className={`toggle-thumb ${
          isDarkMode ? "toggle-thumb-dark" : "toggle-thumb-light"
        }`}
      >
        {isDarkMode ? "🌙" : "☀️"}
      </div>
    </div>
  </div>
);

/* === Audience dropdown === */
const FancyDropdown = ({ onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const dropdownRef = useRef(null);

  const options = ["Gen Z", "Gamers", "Executive", "Parents", "Students"];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onOptionSelect(option);            // Notify parent
  };

  /* Close menu on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="dropdown-button">
        {selectedOption}
        <svg
          className="dropdown-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu show">
          <div className="dropdown-options">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="dropdown-option"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* === Main component === */
const App = ({ addOnUISdk, sandboxProxy }) => {
  const [text, setText] = useState("");
  const [audience, setAudience] = useState("");   // selected dropdown value
  const [result, setResult]   = useState("");      // AI response
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  /* --- Submit handler --- */
  const handleSubmit = async () => {
    if (!text.trim() || !audience) return;

    try {
        const response = await fetch(
            "https://targettalk.fly.dev/api/v1/ai/generate",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, option: audience })
            }
        );
        const aiText = await response.text();
        setResult(aiText);
    } catch (err) {
        console.error(err);
        setResult("🚨 Error: could not fetch AI response.");
    }
};

  /* Highlight-selection demo kept from original */
  const handleMouseUp = () => {
    const highlighted = window.getSelection().toString();
    if (highlighted) alert("Highlighted text: " + highlighted);
  };

  return (
    <Theme system="express" scale="medium" color="light">
      <div
        className={`container ${isDarkMode ? "dark-mode" : ""}`}
        onMouseUp={handleMouseUp}
      >
        {/* Heading */}
        <h1 className="heading">TargetTalk</h1>
        <p className="subheading">Make every word count — for every audience.</p>

        {/* Dark-mode toggle */}
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* User input */}
        <div className="textarea-container">
          <textarea
            className="textarea"
            placeholder="What is on your mind today..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Audience dropdown */}
        <div id="DropdownContainer">
          <h2>Select Your Audience</h2>
          <FancyDropdown onOptionSelect={setAudience} />
        </div>

        {/* Submit button */}
        <Button
          size="m"
          onClick={handleSubmit}
          className="action-button"
          disabled={!text.trim() || !audience}
        >
          Submit
        </Button>

        {/* === AI Result section === */}
        {result && (
          <div className="result-container">
            <h2>Result</h2>
            <textarea
              className="textarea"
              value={result}
              readOnly
              style={{ height: "8rem" }}
            />
          </div>
        )}
      </div>
    </Theme>
  );
};

export default App;