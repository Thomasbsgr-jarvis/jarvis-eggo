"use client";

import { useState } from "react";
import Signin from "./forms/Signin";
import Signup from "./forms/Signup";

const tabs = [
  {
    label: "Se connecter",
    content: <Signin />,
  },
  {
    label: "S'inscrire",
    content: <Signup />,
  },
];

export default function SwitchForms() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabWidth = 100 / tabs.length;

  return (
    <div className="gap-6 w-full">
      <div className="relative flex bg-card border border-border rounded-full p-1 mb-8">
        <div
          className="absolute inset-y-1 left-1 rounded-full bg-foreground/10 transition-transform duration-300 ease-in-out pointer-events-none"
          style={{
            width: `calc(${tabWidth}% - 8px)`,
            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 8}px))`,
          }}
        />
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveIndex(i)}
            className={`flex-1 z-10 py-2 text-sm font-medium cursor-pointer rounded-full transition-colors duration-200 ${
              i === activeIndex ? "text-foreground" : "text-foreground-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {tabs[activeIndex].content}
    </div>
  );
}
