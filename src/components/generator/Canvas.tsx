
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ElementType } from "@/pages/Generator";
import { PdfViewer } from "./PdfViewer";
import { TextElement } from "./TextElement";
import { ImageElement } from "./ImageElement";
import { CanvasEmptyState } from "./CanvasEmptyState";
import { SelectionIndicator } from "./SelectionIndicator";

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
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoadingPdf(false);
  };

  const onDocumentLoadStart = () => {
    setIsLoadingPdf(true);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setIsLoadingPdf(false);
  };

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

  const textElements = elements.filter(el => el.type === 'text');
  const imageElements = elements.filter(el => el.type === 'signature' || el.type === 'seal');

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
      >
        <PdfViewer
          pdfFile={pdfFile}
          pageNumber={pageNumber}
          isLoadingPdf={isLoadingPdf}
          onDocumentLoadStart={onDocumentLoadStart}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onDocumentLoadError={onDocumentLoadError}
        />

        {/* Text Elements */}
        {textElements.map((element) => (
          <TextElement
            key={element.id}
            element={element}
            sampleData={sampleData}
            isSelected={selectedElement === element.id}
            onMouseDown={handleElementMouseDown}
          />
        ))}

        {/* Image Elements */}
        {imageElements.map((element) => (
          <ImageElement
            key={element.id}
            element={element}
            isSelected={selectedElement === element.id}
            onMouseDown={handleElementMouseDown}
          />
        ))}

        <CanvasEmptyState
          pdfFile={pdfFile}
          elementsCount={elements.length}
          isLoadingPdf={isLoadingPdf}
        />

        <SelectionIndicator
          selectedElement={selectedElement}
          elements={elements}
        />
      </div>
    </Card>
  );
};
