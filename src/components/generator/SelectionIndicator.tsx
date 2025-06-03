
import { ElementType } from "@/pages/Generator";

interface SelectionIndicatorProps {
  selectedElement: string | null;
  elements: ElementType[];
}

export const SelectionIndicator = ({
  selectedElement,
  elements
}: SelectionIndicatorProps) => {
  if (!selectedElement) return null;

  const selectedEl = elements.find(el => el.id === selectedElement);
  if (!selectedEl) return null;

  return (
    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium z-30">
      {selectedEl.type === 'text' 
        ? `Text: ${selectedEl.column}`
        : `Image: ${selectedEl.type}`
      }
    </div>
  );
};
