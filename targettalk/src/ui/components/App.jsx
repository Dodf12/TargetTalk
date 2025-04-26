import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useState } from "react";
import "./App.css";

const App = ({ addOnUISdk, sandboxProxy }) => {
  const [text, setText] = useState("");

  const handleClick = () => {
    console.log("User text:", text);
    sandboxProxy.createRectangle();
  };

  const handleMouseUp = () => {
    const highlightedText = window.getSelection().toString();
    if (highlightedText) {
      alert("Highlighted text:", highlightedText);
    }
  };

  const FancyDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Select an option");

    const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
      setSelectedOption(option);
      setIsOpen(false);
    };

    return (
      <div className="dropdown-container">
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
          <div className="dropdown-menu">
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

  return (
    <Theme system="express" scale="medium" color="light">
      <div className="container" onMouseUp={handleMouseUp}>
        {/* heading */}
        <h1 className="heading">TargetTalk</h1>
        <p className="subheading">
          Make every word count — for every audience.
        </p>

        {/* clean textarea */}
        <textarea
          className="textarea"
          placeholder="Paste or write your paragraph here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* action button */}
        <Button size="m" onClick={handleClick} className="action-button">
          Create Rectangle
        </Button>
      </div>

      <div id="DropdownContainer">
        <h2>Select Your Audience</h2>
        <FancyDropdown />
      </div>
    </Theme>
  );
};

export default App;