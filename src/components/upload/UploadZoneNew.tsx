import { useCallback, useState } from "react";
import { Upload, FileImage, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const [dragOver, setDragOver] = useState<'front' | 'back' | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<UploadedFiles>({ front: null, back: null });
  const [previewUrls, setPreviewUrls] = useState<PreviewUrls>({ front: null, back: null });
  const { toast } = useToast();

  const isValidImageFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    const isValidType = validTypes.includes(file.type.toLowerCase());
    const hasValidExtension = /\.(jpg|jpeg|png|heic|heif|webp)$/i.test(file.name);
    return isValidType || hasValidExtension;
  };

  const handleFileSelect = useCallback((file: File, side: 'front' | 'back') => {
    if (!isValidImageFile(file)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a valid image file (JPG, PNG, HEIC, WEBP).",
      });
      return;
    }

    console.log(`Selecting ${side} file:`, file.name, file.type);

    // Clean up previous URL for this side
    if (previewUrls[side]) {
      URL.revokeObjectURL(previewUrls[side]!);
    }

    // Create new preview URL
    const url = URL.createObjectURL(file);
    
    // Update state
    const newFiles = { ...selectedFiles, [side]: file };
    const newUrls = { ...previewUrls, [side]: url };
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);

    console.log(`Updated ${side} file:`, newFiles);
  }, [selectedFiles, previewUrls, toast]);

  const handleDragOver = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(side);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => isValidImageFile(file));
    
    if (imageFile) {
      handleFileSelect(imageFile, side);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please drop a valid image file.",
      });
    }
  }, [handleFileSelect, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, side);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [handleFileSelect]);

  const handleProcess = () => {
    if (!selectedFiles.front && !selectedFiles.back) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one image to process.",
      });
      return;
    }
    
    console.log('Processing files:', selectedFiles);
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

  const renderUploadArea = (side: 'front' | 'back', title: string, icon: React.ReactNode) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-center">{title}</h4>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer min-h-[300px] flex flex-col justify-center",
          dragOver === side
            ? "border-primary bg-primary/5 scale-105"
            : "border-muted-foreground/25 hover:border-primary/50",
          selectedFiles[side] && "border-success bg-success/5"
        )}
        onDragOver={(e) => handleDragOver(e, side)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, side)}
        onClick={() => document.getElementById(`file-input-${side}`)?.click()}
      >
        {previewUrls[side] ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-fit">
              <img
                src={previewUrls[side]!}
                alt={`Business card ${side}`}
                className="max-w-full max-h-48 rounded-lg shadow-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleRemoveImage(side); 
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-success font-medium">
              {side === 'front' ? 'Front' : 'Back'} uploaded successfully!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={cn(
              "mx-auto w-12 h-12 rounded-full flex items-center justify-center",
              side === 'front' ? "gradient-primary" : "gradient-secondary"
            )}>
              {icon}
            </div>
            <div>
              <p className="text-muted-foreground mb-2">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, HEIC, WEBP formats
              </p>
            </div>
          </div>
        )}
      </div>
      
      <input
        type="file"
        accept="image/*,.heic,.heif,.webp"
        onChange={(e) => handleFileInput(e, side)}
        className="hidden"
        id={`file-input-${side}`}
        multiple={false}
      />
    </div>
  );

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
          {renderUploadArea('front', 'Front Side', <Upload className="w-6 h-6 text-white" />)}
          {renderUploadArea('back', 'Back Side (Optional)', <RotateCcw className="w-6 h-6 text-white" />)}
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
                disabled={isProcessing}
                className="min-w-32"
              >
                {isProcessing ? "Processing..." : "Extract Text"}
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button 
                variant="hero" 
                className="cursor-pointer" 
                onClick={() => document.getElementById('file-input-front')?.click()}
              >
                <FileImage className="w-4 h-4" />
                Browse Front
              </Button>
              <Button 
                variant="outline" 
                className="cursor-pointer" 
                onClick={() => document.getElementById('file-input-back')?.click()}
              >
                <RotateCcw className="w-4 h-4" />
                Browse Back
              </Button>
            </div>
          )}
        </div>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
            <strong>Debug Info:</strong>
            <br />
            Front: {selectedFiles.front ? selectedFiles.front.name : 'None'}
            <br />
            Back: {selectedFiles.back ? selectedFiles.back.name : 'None'}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadZone;
