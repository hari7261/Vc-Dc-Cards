import { useCallback, useState } from "react";
import { Upload, FileImage, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (files: { front: File | null; back: File | null }) => void;
  isProcessing: boolean;
}

interface UploadedFiles {
  front: File | null;
  back: File | null;
}

interface PreviewUrls {
  front: string | null;
  back: string | null;
}

const UploadZone = ({ onFileSelect, isProcessing }: UploadZoneProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadedFiles>({ front: null, back: null });
  const [previewUrls, setPreviewUrls] = useState<PreviewUrls>({ front: null, back: null });
  const [activeUpload, setActiveUpload] = useState<'front' | 'back' | null>(null);

  const isValidImageFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    return validTypes.includes(file.type.toLowerCase()) || file.name.toLowerCase().match(/\.(jpg|jpeg|png|heic|heif|webp)$/);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => isValidImageFile(file));
    
    if (imageFile) {
      const newFiles = { ...selectedFiles, [side]: imageFile };
      setSelectedFiles(newFiles);
      
      const url = URL.createObjectURL(imageFile);
      const newUrls = { ...previewUrls, [side]: url };
      
      // Clean up old URL if exists
      if (previewUrls[side]) {
        URL.revokeObjectURL(previewUrls[side]!);
      }
      
      setPreviewUrls(newUrls);
    }
  }, [selectedFiles, previewUrls]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file && isValidImageFile(file)) {
      const newFiles = { ...selectedFiles, [side]: file };
      setSelectedFiles(newFiles);
      
      const url = URL.createObjectURL(file);
      const newUrls = { ...previewUrls, [side]: url };
      
      // Clean up old URL if exists
      if (previewUrls[side]) {
        URL.revokeObjectURL(previewUrls[side]!);
      }
      
      setPreviewUrls(newUrls);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [selectedFiles, previewUrls]);

  const handleProcess = () => {
    onFileSelect(selectedFiles);
  };

  const handleReset = () => {
    // Clean up URLs
    if (previewUrls.front) URL.revokeObjectURL(previewUrls.front);
    if (previewUrls.back) URL.revokeObjectURL(previewUrls.back);
    
    setSelectedFiles({ front: null, back: null });
    setPreviewUrls({ front: null, back: null });
  };

  const handleRemoveImage = (side: 'front' | 'back') => {
    // Clean up URL
    if (previewUrls[side]) {
      URL.revokeObjectURL(previewUrls[side]!);
    }
    
    const newFiles = { ...selectedFiles, [side]: null };
    const newUrls = { ...previewUrls, [side]: null };
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleCardClick = (side: 'front' | 'back') => {
    if (!selectedFiles[side]) {
      setActiveUpload(side);
      document.getElementById(`file-input-${side}`)?.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Upload Business Card Images
          </h3>
          <p className="text-muted-foreground">
            Upload both front and back of your business card for better text extraction
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Front Side */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-center">Front Side</h4>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer min-h-[300px] flex flex-col justify-center",
                dragOver && activeUpload === 'front'
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-muted-foreground/25 hover:border-primary/50",
                selectedFiles.front && "border-success bg-success/5"
              )}
              onDragOver={(e) => { handleDragOver(e); setActiveUpload('front'); }}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'front')}
              onClick={() => handleCardClick('front')}
            >
              {previewUrls.front ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-fit">
                    <img
                      src={previewUrls.front}
                      alt="Business card front"
                      className="max-w-full max-h-48 rounded-lg shadow-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage('front'); }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-success font-medium">
                    Front uploaded successfully!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, HEIC formats
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back Side */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-center">Back Side (Optional)</h4>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer min-h-[300px] flex flex-col justify-center",
                dragOver && activeUpload === 'back'
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-muted-foreground/25 hover:border-primary/50",
                selectedFiles.back && "border-success bg-success/5"
              )}
              onDragOver={(e) => { handleDragOver(e); setActiveUpload('back'); }}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'back')}
              onClick={() => handleCardClick('back')}
            >
              {previewUrls.back ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-fit">
                    <img
                      src={previewUrls.back}
                      alt="Business card back"
                      className="max-w-full max-h-48 rounded-lg shadow-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage('back'); }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-success font-medium">
                    Back uploaded successfully!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 gradient-secondary rounded-full flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, HEIC formats
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          {selectedFiles.front || selectedFiles.back ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                Reset All
              </Button>
              <Button 
                variant="gradient" 
                onClick={handleProcess}
                disabled={isProcessing || (!selectedFiles.front && !selectedFiles.back)}
                className="min-w-32"
              >
                {isProcessing ? "Processing..." : "Extract Text"}
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <input
                type="file"
                accept="image/*,.heic,.heif"
                onChange={(e) => handleFileInput(e, 'front')}
                className="hidden"
                id="file-input-front"
                multiple={false}
              />
              <input
                type="file"
                accept="image/*,.heic,.heif"
                onChange={(e) => handleFileInput(e, 'back')}
                className="hidden"
                id="file-input-back"
                multiple={false}
              />
              <Button variant="hero" className="cursor-pointer" asChild>
                <label htmlFor="file-input-front">
                  <FileImage className="w-4 h-4" />
                  Browse Front
                </label>
              </Button>
              <Button variant="outline" className="cursor-pointer" asChild>
                <label htmlFor="file-input-back">
                  <RotateCcw className="w-4 h-4" />
                  Browse Back
                </label>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UploadZone;