
interface CanvasEmptyStateProps {
  pdfFile: File | null;
  elementsCount: number;
  isLoadingPdf: boolean;
}

export const CanvasEmptyState = ({
  pdfFile,
  elementsCount,
  isLoadingPdf
}: CanvasEmptyStateProps) => {
  if (!pdfFile) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-lg font-medium">Upload a PDF Template</p>
          <p className="text-sm">Your certificate template will appear here</p>
        </div>
      </div>
    );
  }

  if (pdfFile && elementsCount === 0 && !isLoadingPdf) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center text-slate-400 bg-white/90 p-6 rounded-lg">
          <p className="text-lg font-medium">Start Adding Elements</p>
          <p className="text-sm">Add data fields and images from the sidebar</p>
        </div>
      </div>
    );
  }

  return null;
};
