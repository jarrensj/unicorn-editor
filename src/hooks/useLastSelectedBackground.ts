import { useState, useEffect } from "react";

export type LastSelectedBackground = {
  type: "standard" | "custom";
  id: string;
  value: string; // gradient/color for standard, imageUrl for custom
};

const LAST_SELECTED_BACKGROUND_KEY = "unicornLastSelectedBackground";

export const useLastSelectedBackground = () => {
  const [lastSelected, setLastSelected] = useState<LastSelectedBackground | null>(null);

  // Load last selected background from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LAST_SELECTED_BACKGROUND_KEY);
    if (saved) {
      try {
        setLastSelected(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing last selected background:", e);
      }
    }
  }, []);

  // Save last selected background
  const saveLastSelected = (background: LastSelectedBackground) => {
    setLastSelected(background);
    localStorage.setItem(LAST_SELECTED_BACKGROUND_KEY, JSON.stringify(background));
  };

  return {
    lastSelected,
    saveLastSelected,
  };
};
