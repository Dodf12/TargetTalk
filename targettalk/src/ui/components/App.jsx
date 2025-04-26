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

  return (
    <Theme system="express" scale="medium" color="light">
      {/* overall panel */}
      <div className="container flex flex-col items-center gap-6 p-6">
        {/* heading & subtitle */}
        <h1 className="text-3xl font-bold">TargetTalk</h1>
        <p className="text-center text-sm text-gray-600">
          Make every word count — for every audience.
        </p>

        {/* pretty textarea */}
        <textarea
            className="border rounded-md p-2 w-full h-32"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />

        {/* action button */}
        <Button size="m" onClick={handleClick}>
          Create Rectangle
        </Button>
      </div>
    </Theme>
  );
};

export default App;
