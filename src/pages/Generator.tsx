
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/generator/Sidebar";
import { Canvas } from "@/components/generator/Canvas";

export type ElementType = {
  id: string;
  type: 'text' | 'signature' | 'seal';
  content?: string;
  column?: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  width?: number;
  height?: number;
  file?: File;
};

const Generator = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const [elements, setElements] = useState<ElementType[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const columns = excelData.length > 0 ? Object.keys(excelData[0]) : [];
  const sampleData = excelData[0] || {};

  const addElement = (element: ElementType) => {
    setElements([...elements, element]);
  };

  const updateElement = (id: string, updates: Partial<ElementType>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CertGen Pro
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            disabled={elements.length === 0 || !pdfFile || excelData.length === 0}
          >
            Preview Sample
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={elements.length === 0 || !pdfFile || excelData.length === 0}
          >
            Generate Certificates
          </Button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 bg-white/60 backdrop-blur-sm overflow-y-auto">
          <Sidebar
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            excelFile={excelFile}
            setExcelFile={setExcelFile}
            excelData={excelData}
            setExcelData={setExcelData}
            signatureFile={signatureFile}
            setSignatureFile={setSignatureFile}
            sealFile={sealFile}
            setSealFile={setSealFile}
            columns={columns}
            elements={elements}
            selectedElement={selectedElement}
            addElement={addElement}
            updateElement={updateElement}
            removeElement={removeElement}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 p-6">
          <Canvas
            pdfFile={pdfFile}
            elements={elements}
            sampleData={sampleData}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            updateElement={updateElement}
          />
        </div>
      </div>
    </div>
  );
};

export default Generator;
