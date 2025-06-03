
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface DataMappingProps {
  excelFile: File | null;
  excelData: any[];
  setExcelData: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export const DataMapping = ({
  excelFile,
  excelData,
  setExcelData,
  onNext,
  onBack,
  canProceed
}: DataMappingProps) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (excelFile) {
      parseExcelFile();
    }
  }, [excelFile]);

  const parseExcelFile = async () => {
    if (!excelFile) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await excelFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        toast({
          title: "Empty file",
          description: "The Excel file appears to be empty.",
          variant: "destructive",
        });
        return;
      }

      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ""));
      
      setColumns(headers);
      setPreviewData(dataRows.slice(0, 5)); // Show first 5 rows for preview
      setExcelData(dataRows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || "";
        });
        return obj;
      }));

      toast({
        title: "File parsed successfully",
        description: `Found ${headers.length} columns and ${dataRows.length} data rows.`,
      });
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast({
        title: "Error parsing file",
        description: "There was an error reading your Excel file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600">Parsing your Excel file...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Data Mapping</h2>
        <p className="text-lg text-slate-600">
          Review your data columns and preview the information that will be used in certificates
        </p>
      </div>

      {columns.length > 0 && (
        <>
          {/* Columns Overview */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Available Data Columns</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {columns.map((column, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {column}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              These columns will be available for mapping to your certificate template in the next step.
            </p>
          </Card>

          {/* Data Preview */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    {columns.map((column, index) => (
                      <th key={index} className="border border-slate-200 px-4 py-2 text-left font-medium text-slate-700">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="border border-slate-200 px-4 py-2 text-slate-600">
                          {row[colIndex] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Showing first {Math.min(previewData.length, 5)} rows of {excelData.length} total records
            </p>
          </Card>

          {/* Summary */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Data Successfully Loaded</h3>
                <p className="text-green-700">
                  {excelData.length} certificates will be generated with {columns.length} data fields each.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Upload
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Continue to Editor
        </Button>
      </div>
    </div>
  );
};
