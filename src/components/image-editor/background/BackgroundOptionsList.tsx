
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import StandardBackgroundOption, { BackgroundOption } from "./StandardBackgroundOption";
import CustomImageUploader from "./CustomImageUploader";
import SavedBackgroundImage from "./SavedBackgroundImage";
import ScrollIndicator from "./ScrollIndicator";
import { SavedBackground } from "@/hooks/useSavedBackgrounds";

type BackgroundOptionsListProps = {
  backgroundOptions: BackgroundOption[];
  selectedId: string;
  savedBackgrounds: SavedBackground[];
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  showScrollIndicator: boolean;
  onSelectStandard: (option: BackgroundOption) => void;
  onSelectCustom: () => void;
  onSelectSaved: (imageUrl: string, id: string) => void;
  onRemoveSaved: (id: string, e: React.MouseEvent) => void;
};

const BackgroundOptionsList = ({
  backgroundOptions,
  selectedId,
  savedBackgrounds,
  scrollAreaRef,
  showScrollIndicator,
  onSelectStandard,
  onSelectCustom,
  onSelectSaved,
  onRemoveSaved
}: BackgroundOptionsListProps) => {
  return (
    <div className="relative">
      <ScrollArea className="h-[390px] overflow-y-auto pr-4" ref={scrollAreaRef}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {backgroundOptions.map((option) => (
            <StandardBackgroundOption
              key={option.id}
              option={option}
              isSelected={selectedId === option.id}
              onSelect={onSelectStandard}
            />
          ))}

          {/* Custom image upload option */}
          <CustomImageUploader 
            isSelected={selectedId === 'custom-image'} 
            onClick={onSelectCustom} 
          />
        </div>
        
        {/* Saved background images section */}
        {savedBackgrounds.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Saved Background Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {savedBackgrounds.map((background) => (
                <SavedBackgroundImage
                  key={background.id}
                  id={background.id}
                  imageUrl={background.imageUrl}
                  isSelected={selectedId === background.id}
                  onSelect={() => onSelectSaved(background.imageUrl, background.id)}
                  onRemove={(e) => onRemoveSaved(background.id, e)}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* Scroll indicator */}
      <ScrollIndicator visible={showScrollIndicator} />
    </div>
  );
};

export default BackgroundOptionsList;
