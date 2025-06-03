
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ElementType } from "@/pages/Generator";

interface CanvasProps {
  pdfFile: File | null;
  elements: ElementType[];
  sampleData: any;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<ElementType>) => void;
}

export const Canvas = ({
  pdfFile,
  elements,
  sampleData,
  selectedElement,
  setSelectedElement,
  updateElement
}: CanvasProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfFile]);

  const handleElementMouseDown = (elementId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedElement(elementId);
    setDraggedElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateElement(draggedElement, { x, y });
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  return (
    <Card className="h-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Certificate Canvas</h3>
        {Object.keys(sampleData).length > 0 && (
          <Badge variant="secondary" className="text-xs">
            Preview with: {Object.values(sampleData).join(", ").substring(0, 40)}...
          </Badge>
        )}
      </div>
      
      <div 
        ref={canvasRef}
        className="relative w-full h-[calc(100%-80px)] border-2 border-dashed border-slate-300 bg-white overflow-hidden cursor-crosshair rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: pdfUrl ? `url(${pdfUrl})` : undefined,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Text Elements */}
        {elements.filter(el => el.type === 'text').map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-move select-none px-2 py-1 rounded transition-all ${
              selectedElement === element.id 
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
            onMouseDown={(e) => handleElementMouseDown(element.id, e)}
          >
            {sampleData[element.column!] || `[${element.column}]`}
          </div>
        ))}

        {/* Image Elements */}
        {elements.filter(el => el.type === 'signature' || el.type === 'seal').map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-move rounded transition-all ${
              selectedElement === element.id 
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
            onMouseDown={(e) => handleElementMouseDown(element.id, e)}
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
        ))}

        {/* Empty State */}
        {!pdfFile && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-medium">Upload a PDF Template</p>
              <p className="text-sm">Your certificate template will appear here</p>
            </div>
          </div>
        )}

        {pdfFile && elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-slate-400 bg-white/90 p-6 rounded-lg">
              <p className="text-lg font-medium">Start Adding Elements</p>
              <p className="text-sm">Add data fields and images from the sidebar</p>
            </div>
          </div>
        )}

        {/* Selection Indicator */}
        {selectedElement && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            {elements.find(el => el.id === selectedElement)?.type === 'text' 
              ? `Text: ${elements.find(el => el.id === selectedElement)?.column}`
              : `Image: ${elements.find(el => el.id === selectedElement)?.type}`
            }
          </div>
        )}
      </div>
    </Card>
  );
};
