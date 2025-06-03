
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Image, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { ElementType } from "@/pages/Generator";

interface SidebarProps {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
  excelData: any[];
  setExcelData: (data: any[]) => void;
  signatureFile: File | null;
  setSignatureFile: (file: File | null) => void;
  sealFile: File | null;
  setSealFile: (file: File | null) => void;
  columns: string[];
  elements: ElementType[];
  selectedElement: string | null;
  addElement: (element: ElementType) => void;
  updateElement: (id: string, updates: Partial<ElementType>) => void;
  removeElement: (id: string) => void;
}

const googleFonts = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Source Sans Pro",
  "Raleway", "Ubuntu", "Nunito Sans", "Poppins", "Merriweather", "Playfair Display"
];

export const Sidebar = ({
  pdfFile,
  setPdfFile,
  excelFile,
  setExcelFile,
  excelData,
  setExcelData,
  signatureFile,
  setSignatureFile,
  sealFile,
  setSealFile,
  columns,
  elements,
  selectedElement,
  addElement,
  updateElement,
  removeElement
}: SidebarProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'pdf' | 'excel' | 'signature' | 'seal') => {
    if (type === 'pdf') {
      setPdfFile(file);
      toast({
        title: "PDF uploaded",
        description: "Certificate template loaded successfully.",
      });
    } else if (type === 'excel') {
      setExcelFile(file);
      await parseExcelFile(file);
    } else if (type === 'signature') {
      setSignatureFile(file);
      toast({
        title: "Signature uploaded",
        description: "Signature image loaded successfully.",
      });
    } else if (type === 'seal') {
      setSealFile(file);
      toast({
        title: "Seal uploaded",
        description: "Seal image loaded successfully.",
      });
    }
  };

  const parseExcelFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (jsonData.length === 0) {
        toast({
          title: "Empty file",
          description: "The Excel file appears to be empty.",
          variant: "destructive",
        });
        return;
      }

      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1).filter((row: any[]) => row.some((cell: any) => cell !== undefined && cell !== ""));
      
      setExcelData(dataRows.map((row: any[]) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || "";
        });
        return obj;
      }));

      toast({
        title: "Excel file parsed",
        description: `Found ${headers.length} columns and ${dataRows.length} data rows.`,
      });
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast({
        title: "Error parsing file",
        description: "There was an error reading your Excel file.",
        variant: "destructive",
      });
    }
  };

  const addTextElement = (column: string) => {
    const newElement: ElementType = {
      id: `text-${Date.now()}`,
      type: 'text',
      column,
      x: 200,
      y: 200,
      fontSize: 16,
      fontFamily: "Inter",
      color: "#000000"
    };
    addElement(newElement);
  };

  const addImageElement = (type: 'signature' | 'seal', file: File) => {
    const newElement: ElementType = {
      id: `${type}-${Date.now()}`,
      type,
      x: 200,
      y: 300,
      width: 150,
      height: 75,
      file
    };
    addElement(newElement);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Certificate Editor</h2>
        <p className="text-sm text-slate-600">Upload files and design your certificate</p>
      </div>

      {/* File Upload Section */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Files
        </h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs">PDF Template</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')}
              className="h-8"
            />
            {pdfFile && <Badge variant="secondary" className="mt-1 text-xs">{pdfFile.name}</Badge>}
          </div>

          <div>
            <Label className="text-xs">Excel Data</Label>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'excel')}
              className="h-8"
            />
            {excelFile && <Badge variant="secondary" className="mt-1 text-xs">{excelFile.name}</Badge>}
          </div>

          <div>
            <Label className="text-xs">Signature (Optional)</Label>
            <Input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'signature')}
              className="h-8"
            />
            {signatureFile && <Badge variant="secondary" className="mt-1 text-xs">{signatureFile.name}</Badge>}
          </div>

          <div>
            <Label className="text-xs">Seal (Optional)</Label>
            <Input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'seal')}
              className="h-8"
            />
            {sealFile && <Badge variant="secondary" className="mt-1 text-xs">{sealFile.name}</Badge>}
          </div>
        </div>
      </Card>

      {/* Data Fields */}
      {columns.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Data Fields
          </h3>
          <div className="space-y-2">
            {columns.map((column) => (
              <Button
                key={column}
                variant="outline"
                size="sm"
                onClick={() => addTextElement(column)}
                className="w-full justify-start text-xs h-8"
              >
                + {column}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Images */}
      {(signatureFile || sealFile) && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </h3>
          <div className="space-y-2">
            {signatureFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => addImageElement('signature', signatureFile)}
                className="w-full justify-start text-xs h-8"
              >
                + Signature
              </Button>
            )}
            {sealFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => addImageElement('seal', sealFile)}
                className="w-full justify-start text-xs h-8"
              >
                + Seal
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Element Properties */}
      {selectedEl && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Element Properties</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeElement(selectedEl.id)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          {selectedEl.type === 'text' && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Font Family</Label>
                <Select
                  value={selectedEl.fontFamily}
                  onValueChange={(value) => updateElement(selectedEl.id, { fontFamily: value })}
                >
                  <SelectTrigger className="h-8">
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
                <Label className="text-xs">Font Size</Label>
                <Input
                  type="number"
                  value={selectedEl.fontSize}
                  onChange={(e) => updateElement(selectedEl.id, { fontSize: parseInt(e.target.value) })}
                  min="8"
                  max="72"
                  className="h-8"
                />
              </div>
              
              <div>
                <Label className="text-xs">Color</Label>
                <Input
                  type="color"
                  value={selectedEl.color}
                  onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                  className="h-8"
                />
              </div>
            </div>
          )}

          {(selectedEl.type === 'signature' || selectedEl.type === 'seal') && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Width</Label>
                <Input
                  type="number"
                  value={selectedEl.width}
                  onChange={(e) => updateElement(selectedEl.id, { width: parseInt(e.target.value) })}
                  min="50"
                  max="500"
                  className="h-8"
                />
              </div>
              
              <div>
                <Label className="text-xs">Height</Label>
                <Input
                  type="number"
                  value={selectedEl.height}
                  onChange={(e) => updateElement(selectedEl.id, { height: parseInt(e.target.value) })}
                  min="25"
                  max="500"
                  className="h-8"
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Added Elements List */}
      {elements.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Added Elements ({elements.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {elements.map((element) => (
              <div
                key={element.id}
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                  selectedElement === element.id 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => updateElement === selectedElement ? null : updateElement}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {element.type === 'text' ? element.column : element.type}
                  </p>
                  <p className="text-xs text-slate-500">
                    {element.x}, {element.y}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
