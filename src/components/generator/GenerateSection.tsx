
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerateSectionProps {
  pdfFile: File | null;
  excelData: any[];
  onBack: () => void;
}

export const GenerateSection = ({
  pdfFile,
  excelData,
  onBack
}: GenerateSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const generateCertificates = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedFiles([]);

    try {
      // Simulate certificate generation process
      for (let i = 0; i < excelData.length; i++) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update progress
        const progressValue = ((i + 1) / excelData.length) * 100;
        setProgress(progressValue);
        
        // Add generated file name
        const fileName = `certificate_${i + 1}_${excelData[i].Name || 'participant'}.pdf`;
        setGeneratedFiles(prev => [...prev, fileName]);
      }

      toast({
        title: "Certificates generated successfully!",
        description: `${excelData.length} certificates have been created.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating the certificates.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSingle = (fileName: string) => {
    // In a real implementation, this would download the actual PDF file
    toast({
      title: "Download started",
      description: `Downloading ${fileName}`,
    });
  };

  const downloadAll = () => {
    // In a real implementation, this would create and download a zip file
    toast({
      title: "Bulk download started",
      description: "Creating zip file with all certificates...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Generate Certificates</h2>
        <p className="text-lg text-slate-600">
          Ready to generate {excelData.length} certificates
        </p>
      </div>

      {!isGenerating && generatedFiles.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
          <p className="text-slate-600 mb-6">
            Click the button below to start generating your certificates. This process may take a few moments.
          </p>
          <Button 
            onClick={generateCertificates}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            Generate {excelData.length} Certificates
          </Button>
        </Card>
      )}

      {isGenerating && (
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Generating Certificates</h3>
            <p className="text-slate-600">
              Processing {Math.floor((progress / 100) * excelData.length)} of {excelData.length} certificates...
            </p>
          </div>
          
          <Progress value={progress} className="mb-4" />
          
          <div className="text-center text-sm text-slate-500">
            {progress.toFixed(0)}% Complete
          </div>

          {generatedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Recently Generated:</h4>
              <div className="text-sm text-slate-600 space-y-1">
                {generatedFiles.slice(-3).map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {file}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {!isGenerating && generatedFiles.length > 0 && (
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800">Certificates Generated Successfully!</h3>
                <p className="text-green-700">
                  {generatedFiles.length} certificates have been created and are ready for download.
                </p>
              </div>
            </div>
          </Card>

          {/* Download Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="text-center">
                <Archive className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Download All</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Download all certificates in a compressed ZIP file
                </p>
                <Button onClick={downloadAll} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download ZIP ({generatedFiles.length} files)
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Individual Downloads</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Download certificates one by one
                </p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {generatedFiles.map((file, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => downloadSingle(file)}
                      className="w-full text-left justify-start"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      {file}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Generate More */}
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Need to generate more certificates?</h3>
            <p className="text-slate-600 mb-4">
              You can upload new files and create additional certificates.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Start New Generation
            </Button>
          </Card>
        </div>
      )}

      <div className="flex justify-start pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Editor
        </Button>
      </div>
    </div>
  );
};
