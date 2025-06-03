
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Image, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
  signatureFile: File | null;
  setSignatureFile: (file: File | null) => void;
  sealFile: File | null;
  setSealFile: (file: File | null) => void;
  onNext: () => void;
  canProceed: boolean;
}

export const UploadSection = ({
  pdfFile,
  setPdfFile,
  excelFile,
  setExcelFile,
  signatureFile,
  setSignatureFile,
  sealFile,
  setSealFile,
  onNext,
  canProceed
}: UploadSectionProps) => {
  const { toast } = useToast();

  const handlePdfUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setPdfFile(file);
        toast({
          title: "PDF uploaded successfully",
          description: "Your certificate template has been uploaded.",
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  }, [setPdfFile, toast]);

  const handleExcelUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel" ||
          file.name.endsWith('.csv')) {
        setExcelFile(file);
        toast({
          title: "Data file uploaded successfully",
          description: "Your Excel/CSV file has been uploaded.",
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel (.xlsx, .xls) or CSV file.",
          variant: "destructive",
        });
      }
    }
  }, [setExcelFile, toast]);

  const handleSignatureUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSignatureFile(file);
        toast({
          title: "Signature uploaded successfully",
          description: "Your signature image has been uploaded.",
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    }
  }, [setSignatureFile, toast]);

  const handleSealUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSealFile(file);
        toast({
          title: "Seal uploaded successfully",
          description: "Your seal image has been uploaded.",
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    }
  }, [setSealFile, toast]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Upload Your Files</h2>
        <p className="text-lg text-slate-600">
          Upload your PDF certificate template and Excel data file to get started
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Upload */}
        <Card className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {pdfFile ? (
                <Check className="h-12 w-12 text-green-600" />
              ) : (
                <FileText className="h-12 w-12 text-slate-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">PDF Certificate Template</h3>
            <p className="text-slate-600 mb-4">
              {pdfFile ? `Uploaded: ${pdfFile.name}` : "Upload your certificate template"}
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {pdfFile ? "Change PDF" : "Choose PDF File"}
              </Button>
            </label>
          </div>
        </Card>

        {/* Excel Upload */}
        <Card className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {excelFile ? (
                <Check className="h-12 w-12 text-green-600" />
              ) : (
                <FileText className="h-12 w-12 text-slate-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">Excel Data File</h3>
            <p className="text-slate-600 mb-4">
              {excelFile ? `Uploaded: ${excelFile.name}` : "Upload your participant data"}
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
                className="hidden"
              />
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {excelFile ? "Change File" : "Choose Excel/CSV File"}
              </Button>
            </label>
          </div>
        </Card>
      </div>

      {/* Optional Files */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Signature Upload */}
        <Card className="p-6 border border-slate-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {signatureFile ? (
                <Check className="h-8 w-8 text-green-600" />
              ) : (
                <Image className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">Signature (Optional)</h3>
            <p className="text-slate-600 text-sm mb-4">
              {signatureFile ? `Uploaded: ${signatureFile.name}` : "Upload signature image"}
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {signatureFile ? "Change" : "Upload"}
              </Button>
            </label>
          </div>
        </Card>

        {/* Seal Upload */}
        <Card className="p-6 border border-slate-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {sealFile ? (
                <Check className="h-8 w-8 text-green-600" />
              ) : (
                <Image className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">Seal (Optional)</h3>
            <p className="text-slate-600 text-sm mb-4">
              {sealFile ? `Uploaded: ${sealFile.name}` : "Upload seal image"}
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleSealUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {sealFile ? "Change" : "Upload"}
              </Button>
            </label>
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Continue to Data Mapping
        </Button>
      </div>
    </div>
  );
};
