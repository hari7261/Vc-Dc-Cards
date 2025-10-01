import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OCRProcessorProps {
  files: { front: File | null; back: File | null };
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

const OCRProcessor = ({ files, onTextExtracted, onError }: OCRProcessorProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing OCR...");
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentProcessing, setCurrentProcessing] = useState<'front' | 'back' | null>(null);

  useEffect(() => {
    const processImages = async () => {
      try {
        setProgress(0);
        setStatus("Loading images...");
        setIsComplete(false);
        setHasError(false);

        const filesToProcess = [];
        if (files.front) filesToProcess.push({ file: files.front, side: 'front' });
        if (files.back) filesToProcess.push({ file: files.back, side: 'back' });

        if (filesToProcess.length === 0) {
          throw new Error("No files selected for processing");
        }

        let combinedText = "";
        const totalFiles = filesToProcess.length;

        for (let i = 0; i < filesToProcess.length; i++) {
          const { file, side } = filesToProcess[i];
          setCurrentProcessing(side as 'front' | 'back');
          setStatus(`Processing ${side} side...`);

          const result = await Tesseract.recognize(file, "eng", {
            logger: (m) => {
              if (m.status === "recognizing text") {
                const fileProgress = (i / totalFiles) * 100 + (m.progress / totalFiles) * 100;
                setProgress(Math.round(fileProgress));
                setStatus(`Extracting text from ${side} side... ${Math.round(m.progress * 100)}%`);
              }
            },
          });

          if (result.data.text.trim()) {
            if (combinedText) {
              combinedText += `\n\n--- ${side.toUpperCase()} SIDE ---\n${result.data.text.trim()}\n`;
            } else {
              combinedText = `--- ${side.toUpperCase()} SIDE ---\n${result.data.text.trim()}\n`;
            }
          }
        }

        console.log('Combined extracted text:', combinedText); // Debug log

        if (combinedText.trim()) {
          setStatus("Text extraction complete!");
          setIsComplete(true);
          setProgress(100);
          setCurrentProcessing(null);
          
          // Small delay to show completion
          setTimeout(() => {
            onTextExtracted(combinedText.trim());
          }, 1000);
        } else {
          throw new Error("No text detected in the images");
        }
      } catch (error) {
        console.error("OCR Error:", error);
        setHasError(true);
        setStatus("Failed to extract text");
        setCurrentProcessing(null);
        onError(error instanceof Error ? error.message : "OCR processing failed");
      }
    };

    processImages();
  }, [files.front, files.back, onTextExtracted, onError]);

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {hasError ? (
            <AlertCircle className="w-6 h-6 text-destructive" />
          ) : isComplete ? (
            <CheckCircle className="w-6 h-6 text-success" />
          ) : (
            <div className="w-6 h-6 gradient-primary rounded-full animate-spin">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <h3 className="text-lg font-semibold">
            {hasError ? "Processing Failed" : isComplete ? "Processing Complete" : "Processing Image"}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {status}
              {currentProcessing && ` (${currentProcessing} side)`}
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "transition-all duration-300",
              hasError && "[&>div]:bg-destructive",
              isComplete && "[&>div]:bg-success"
            )}
          />
        </div>

        {hasError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive">
              Unable to extract text from the image. Please try:
            </p>
            <ul className="text-sm text-destructive mt-2 list-disc list-inside">
              <li>Using a clearer, higher quality image</li>
              <li>Ensuring the text is clearly visible</li>
              <li>Checking that the image is not too dark or blurry</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OCRProcessor;