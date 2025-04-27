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
        {isDarkMode ? "🌘" : "🌕"}
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
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [clipboardStatus, setClipboardStatus] = useState(false); // Clipboard status

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  /* --- Submit handler --- */
  const handleSubmit = async () => {
    if (!text.trim() || !audience) return;

    setIsLoading(true); // Start loading
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
    } finally {
        setIsLoading(false); // Stop loading
    }
};

  /* Clipboard handler */
  const handleClipboard = () => {
    navigator.clipboard.writeText(result);
    setClipboardStatus(true); // Set status to true
    setTimeout(() => setClipboardStatus(false), 3000); // Revert after 3 seconds
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
          <h2 className="subtitle">Input</h2> {/* Added class "subtitle" for consistent styling */}
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
          disabled={!text.trim() || !audience || isLoading}
        >
          {isLoading ? (
            <div className="spinner">
              <svg
                className="spinner-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : (
            "Submit"
          )}
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
            <Button
              size="m"
              onClick={handleClipboard}
              className={`action-button ${
                clipboardStatus ? "clipboard-success" : ""
              }`}
            >
              {clipboardStatus ? "Added to Clipboard!" : "Add to Clipboard"}
            </Button>
          </div>
        )}
      </div>
    </Theme>
  );
};

export default App;