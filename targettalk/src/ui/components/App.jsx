// App.jsx
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="dark-mode-toggle">
      <span className="dark-mode-text">
        <strong>{isDarkMode ? "Switch to Light" : "Switch to Dark"}</strong>
      </span>
      <div className="toggle-switch" onClick={toggleDarkMode}>
        <div className={`toggle-thumb ${isDarkMode ? "toggle-thumb-dark" : "toggle-thumb-light"}`}>
          {isDarkMode ? "🌙" : "☀️"}
        </div>
      </div>
    </div>
  );
};

const FancyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const dropdownRef = useRef(null);

  const options = ["GenZ", "Gamers", "Executive", "Parents", "Students"];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div>
        <button onClick={toggleDropdown} className="dropdown-button">
          {selectedOption}
          <svg
            className="dropdown-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
          <div className="dropdown-options">
            {options.map((option, index) => (
              <button
                key={index}
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

const App = ({ addOnUISdk, sandboxProxy }) => {
  const [text, setText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleClick = () => {
    console.log("User text:", text);
    sandboxProxy.createRectangle();
  };

  const handleMouseUp = () => {
    const highlightedText = window.getSelection().toString();
    if (highlightedText) {
      alert("Highlighted text: " + highlightedText);
    }
  };

  return (
    <Theme system="express" scale="medium" color="light">
      <div className={`container ${isDarkMode ? "dark-mode" : ""}`} onMouseUp={handleMouseUp}>
        
        {/* Heading */}
        <h1 className="heading">TargetTalk</h1>
        <p className="subheading">
          Make every word count — for every audience.
        </p>

        {/* Dark Mode Toggle */}
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        {/* Resizable textarea */}
        <div className="textarea-container">
          <textarea
            className="textarea"
            placeholder="What is on your mind today..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Dropdown */}
        <div id="DropdownContainer">
          <h2>Select Your Audience</h2>
          <FancyDropdown />
        </div>

        {/* Action button */}
        <Button size="m" onClick={handleClick} className="action-button">
          Submit
        </Button>

      </div>
    </Theme>
  );
};

export default App;
