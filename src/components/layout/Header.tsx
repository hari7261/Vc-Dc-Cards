import { Button } from "@/components/ui/button";
import { Upload, Search, FileText } from "lucide-react";

interface HeaderProps {
  currentView: "upload" | "contacts";
  onViewChange: (view: "upload" | "contacts") => void;
  children?: React.ReactNode;
}

const Header = ({ currentView, onViewChange, children }: HeaderProps) => {
  return (
    <header className="gradient-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CardManager</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button
              variant={currentView === "upload" ? "default" : "ghost"}
              onClick={() => onViewChange("upload")}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            
            <Button
              variant={currentView === "contacts" ? "default" : "ghost"}
              onClick={() => onViewChange("contacts")}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Contacts
            </Button>
            {children}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;