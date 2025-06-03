
import { ElementType } from "@/pages/Generator";

interface TextElementProps {
  element: ElementType;
  sampleData: any;
  isSelected: boolean;
  onMouseDown: (elementId: string, e: React.MouseEvent) => void;
}

export const TextElement = ({
  element,
  sampleData,
  isSelected,
  onMouseDown
}: TextElementProps) => {
  return (
    <div
      className={`absolute cursor-move select-none px-2 py-1 rounded transition-all z-20 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50/80' 
          : 'hover:bg-slate-100/80'
      }`}
      style={{
        left: element.x,
        top: element.y,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        color: element.color,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={(e) => onMouseDown(element.id, e)}
    >
      {sampleData[element.column!] || `[${element.column}]`}
    </div>
  );
};
