
import { useState, useEffect } from "react";

export type SavedBackground = {
  id: string;
  imageUrl: string;
};

const SAVED_BACKGROUNDS_KEY = "unicornBackgroundImages";

export const useSavedBackgrounds = () => {
  const [savedBackgrounds, setSavedBackgrounds] = useState<SavedBackground[]>([]);
  
  // Load saved backgrounds from localStorage on hook mount
  useEffect(() => {
    const savedImages = localStorage.getItem(SAVED_BACKGROUNDS_KEY);
    if (savedImages) {
      try {
        setSavedBackgrounds(JSON.parse(savedImages));
      } catch (e) {
        console.error("Error parsing saved backgrounds:", e);
      }
    }
  }, []);

  // Add a new background
  const addBackground = (imageUrl: string): string => {
    const newImageId = `custom-image-${Date.now()}`;
    
    const updatedBackgrounds = [
      ...savedBackgrounds,
      { id: newImageId, imageUrl }
    ];
    
    setSavedBackgrounds(updatedBackgrounds);
    localStorage.setItem(SAVED_BACKGROUNDS_KEY, JSON.stringify(updatedBackgrounds));
    
    return newImageId;
  };

  // Remove a background
  const removeBackground = (id: string) => {
    const updatedBackgrounds = savedBackgrounds.filter(bg => bg.id !== id);
    setSavedBackgrounds(updatedBackgrounds);
    localStorage.setItem(SAVED_BACKGROUNDS_KEY, JSON.stringify(updatedBackgrounds));
    return updatedBackgrounds;
  };

  return {
    savedBackgrounds,
    addBackground,
    removeBackground
  };
};
