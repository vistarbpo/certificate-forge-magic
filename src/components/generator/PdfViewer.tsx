
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfFile: File | null;
  pageNumber: number;
  isLoadingPdf: boolean;
  onDocumentLoadStart: () => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onDocumentLoadError: (error: Error) => void;
}

export const PdfViewer = ({
  pdfFile,
  pageNumber,
  isLoadingPdf,
  onDocumentLoadStart,
  onDocumentLoadSuccess,
  onDocumentLoadError
}: PdfViewerProps) => {
  if (!pdfFile) return null;

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <Document
          file={pdfFile}
          onLoadStart={onDocumentLoadStart}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="flex items-center justify-center"
        >
          <Page
            pageNumber={pageNumber}
            className="max-w-full max-h-full"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Loading indicator for PDF */}
      {isLoadingPdf && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading PDF...</p>
          </div>
        </div>
      )}
    </>
  );
};
