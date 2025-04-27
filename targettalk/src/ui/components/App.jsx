import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

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

const FancyDropdown = ({ onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Choose an Option");
  const dropdownRef = useRef(null);

  const options = ["Gen Z", "Gamers", "Executive", "Parents", "Students"];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onOptionSelect(option);
  };

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
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
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

const App = () => {
  const [text, setText] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState("");
  const [topAudiences, setTopAudiences] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clipboardStatus, setClipboardStatus] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleSubmit = async () => {
    if (!text.trim() || !audience) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://targettalk.fly.dev/api/v1/ai/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, option: audience }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      setResult(data.response || "");
      setTopAudiences(data.top_audiences || []);
    } catch (err) {
      console.error(err);
      setResult("🚨 Error: could not fetch AI response.");
      setTopAudiences([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClipboard = () => {
    navigator.clipboard.writeText(result);
    setClipboardStatus(true);
    setTimeout(() => setClipboardStatus(false), 3000);
  };

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
        <h1 className="heading">TargetTalk</h1>
        <p className="subheading">
          Speak to the World, One Word at a Time.
        </p>

        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="textarea-container">
          <h2 className="subtitle">Input</h2>
          <textarea
            className="textarea"
            placeholder="What is on your mind today..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div id="DropdownContainer">
          <h2>Select Your Audience</h2>
          <FancyDropdown onOptionSelect={setAudience} />
        </div>

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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Loading...
            </div>
          ) : (
            "Submit"
          )}
        </Button>

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

        {topAudiences.length > 0 && (
          <div className="result-container">
            <h2 className="subtitle">Top Audiences</h2>
            <ul className="top-audiences-list">
              {topAudiences.map((aud) => (
                <li key={aud}>{aud}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Theme>
  );
};

export default App;