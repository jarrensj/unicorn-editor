import { useState } from "react";

export type LastSelectedBackground = {
  type: "standard" | "custom";
  id: string;
  value: string; // gradient/color for standard, imageUrl for custom
};

const LAST_SELECTED_BACKGROUND_KEY = "unicornLastSelectedBackground";

// Helper function to load from localStorage synchronously
const loadLastSelectedBackground = (): LastSelectedBackground | null => {
  try {
    const saved = localStorage.getItem(LAST_SELECTED_BACKGROUND_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error parsing last selected background:", e);
  }
  return null;
};

export const useLastSelectedBackground = () => {
  // Load synchronously during initialization
  const [lastSelected, setLastSelected] = useState<LastSelectedBackground | null>(
    loadLastSelectedBackground()
  );

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
