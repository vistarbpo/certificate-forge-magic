
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CertificateEditorProps {
  pdfFile: File | null;
  excelData: any[];
  signatureFile: File | null;
  sealFile: File | null;
  onNext: () => void;
  onBack: () => void;
}

interface TextElement {
  id: string;
  column: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

interface ImageElement {
  id: string;
  type: 'signature' | 'seal';
  x: number;
  y: number;
  width: number;
  height: number;
  file: File;
}

const googleFonts = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Source Sans Pro",
  "Raleway", "Ubuntu", "Nunito Sans", "Poppins", "Merriweather", "Playfair Display"
];

export const CertificateEditor = ({
  pdfFile,
  excelData,
  signatureFile,
  sealFile,
  onNext,
  onBack
}: CertificateEditorProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const columns = excelData.length > 0 ? Object.keys(excelData[0]) : [];
  const sampleData = excelData[0] || {};

  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfFile]);

  const addTextElement = (column: string) => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      column,
      x: 100,
      y: 100,
      fontSize: 16,
      fontFamily: "Inter",
      color: "#000000"
    };
    setTextElements([...textElements, newElement]);
  };

  const addImageElement = (type: 'signature' | 'seal', file: File) => {
    const newElement: ImageElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 300,
      width: 150,
      height: 75,
      file
    };
    setImageElements([...imageElements, newElement]);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(textElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const updateImageElement = (id: string, updates: Partial<ImageElement>) => {
    setImageElements(imageElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const handleElementMouseDown = (elementId: string) => {
    setSelectedElement(elementId);
    setDraggedElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const textElement = textElements.find(el => el.id === draggedElement);
    if (textElement) {
      updateTextElement(draggedElement, { x, y });
    }

    const imageElement = imageElements.find(el => el.id === draggedElement);
    if (imageElement) {
      updateImageElement(draggedElement, { x, y });
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const selectedTextElement = textElements.find(el => el.id === selectedElement);
  const selectedImageElement = imageElements.find(el => el.id === selectedElement);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Design Your Certificate</h2>
        <p className="text-lg text-slate-600">
          Position text fields, signatures, and seals on your certificate template
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Add Text Fields */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Add Data Fields</h3>
            <div className="space-y-2">
              {columns.map((column) => (
                <Button
                  key={column}
                  variant="outline"
                  size="sm"
                  onClick={() => addTextElement(column)}
                  className="w-full justify-start"
                >
                  + {column}
                </Button>
              ))}
            </div>
          </Card>

          {/* Add Images */}
          {(signatureFile || sealFile) && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Add Images</h3>
              <div className="space-y-2">
                {signatureFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addImageElement('signature', signatureFile)}
                    className="w-full justify-start"
                  >
                    + Signature
                  </Button>
                )}
                {sealFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addImageElement('seal', sealFile)}
                    className="w-full justify-start"
                  >
                    + Seal
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Element Properties */}
          {(selectedTextElement || selectedImageElement) && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Element Properties</h3>
              
              {selectedTextElement && (
                <div className="space-y-3">
                  <div>
                    <Label>Font Family</Label>
                    <Select
                      value={selectedTextElement.fontFamily}
                      onValueChange={(value) => updateTextElement(selectedTextElement.id, { fontFamily: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {googleFonts.map((font) => (
                          <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Font Size</Label>
                    <Input
                      type="number"
                      value={selectedTextElement.fontSize}
                      onChange={(e) => updateTextElement(selectedTextElement.id, { fontSize: parseInt(e.target.value) })}
                      min="8"
                      max="72"
                    />
                  </div>
                  
                  <div>
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={selectedTextElement.color}
                      onChange={(e) => updateTextElement(selectedTextElement.id, { color: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {selectedImageElement && (
                <div className="space-y-3">
                  <div>
                    <Label>Width</Label>
                    <Input
                      type="number"
                      value={selectedImageElement.width}
                      onChange={(e) => updateImageElement(selectedImageElement.id, { width: parseInt(e.target.value) })}
                      min="50"
                      max="500"
                    />
                  </div>
                  
                  <div>
                    <Label>Height</Label>
                    <Input
                      type="number"
                      value={selectedImageElement.height}
                      onChange={(e) => updateImageElement(selectedImageElement.id, { height: parseInt(e.target.value) })}
                      min="25"
                      max="500"
                    />
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Certificate Preview</h3>
              <Badge variant="secondary">
                Sample Data: {Object.values(sampleData).join(", ").substring(0, 50)}...
              </Badge>
            </div>
            
            <div 
              ref={canvasRef}
              className="relative w-full h-[600px] border-2 border-dashed border-slate-300 bg-white overflow-hidden cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                backgroundImage: pdfUrl ? `url(${pdfUrl})` : undefined,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            >
              {/* Text Elements */}
              {textElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move select-none ${selectedElement === element.id ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    left: element.x,
                    top: element.y,
                    fontSize: element.fontSize,
                    fontFamily: element.fontFamily,
                    color: element.color,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseDown={() => handleElementMouseDown(element.id)}
                >
                  {sampleData[element.column] || `[${element.column}]`}
                </div>
              ))}

              {/* Image Elements */}
              {imageElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move ${selectedElement === element.id ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseDown={() => handleElementMouseDown(element.id)}
                >
                  <img
                    src={URL.createObjectURL(element.file)}
                    alt={element.type}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              ))}

              {textElements.length === 0 && imageElements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <p className="text-lg">Drag and drop elements here</p>
                    <p className="text-sm">Add data fields and images from the left panel</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Data Mapping
        </Button>
        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Continue to Generate
        </Button>
      </div>
    </div>
  );
};
