import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Image, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { UploadSection } from "@/components/generator/UploadSection";
import { DataMapping } from "@/components/generator/DataMapping";
import { CertificateEditor } from "@/components/generator/CertificateEditor";
import { GenerateSection } from "@/components/generator/GenerateSection";

type Step = "upload" | "mapping" | "editor" | "generate";

const Generator = () => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);

  const steps = [
    { id: "upload", title: "Upload Files", icon: Upload },
    { id: "mapping", title: "Map Data", icon: FileText },
    { id: "editor", title: "Design", icon: Image },
    { id: "generate", title: "Generate", icon: Download }
  ];

  const canProceedToMapping = !!(pdfFile && excelFile);
  const canProceedToEditor = excelData.length > 0;

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
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-300' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-6xl mx-auto p-8 bg-white/60 backdrop-blur-sm border-slate-200">
          {currentStep === "upload" && (
            <UploadSection
              pdfFile={pdfFile}
              setPdfFile={setPdfFile}
              excelFile={excelFile}
              setExcelFile={setExcelFile}
              signatureFile={signatureFile}
              setSignatureFile={setSignatureFile}
              sealFile={sealFile}
              setSealFile={setSealFile}
              onNext={() => canProceedToMapping && setCurrentStep("mapping")}
              canProceed={canProceedToMapping}
            />
          )}

          {currentStep === "mapping" && (
            <DataMapping
              excelFile={excelFile}
              excelData={excelData}
              setExcelData={setExcelData}
              onNext={() => canProceedToEditor && setCurrentStep("editor")}
              onBack={() => setCurrentStep("upload")}
              canProceed={canProceedToEditor}
            />
          )}

          {currentStep === "editor" && (
            <CertificateEditor
              pdfFile={pdfFile}
              excelData={excelData}
              signatureFile={signatureFile}
              sealFile={sealFile}
              onNext={() => setCurrentStep("generate")}
              onBack={() => setCurrentStep("mapping")}
            />
          )}

          {currentStep === "generate" && (
            <GenerateSection
              pdfFile={pdfFile}
              excelData={excelData}
              onBack={() => setCurrentStep("editor")}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Generator;
