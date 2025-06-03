
import { ElementType } from "@/pages/Generator";

interface ImageElementProps {
  element: ElementType;
  isSelected: boolean;
  onMouseDown: (elementId: string, e: React.MouseEvent) => void;
}

export const ImageElement = ({
  element,
  isSelected,
  onMouseDown
}: ImageElementProps) => {
  return (
    <div
      className={`absolute cursor-move rounded transition-all z-20 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50/30' 
          : 'hover:bg-slate-100/30'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={(e) => onMouseDown(element.id, e)}
    >
      {element.file && (
        <img
          src={URL.createObjectURL(element.file)}
          alt={element.type}
          className="w-full h-full object-contain rounded"
          draggable={false}
        />
      )}
    </div>
  );
};
