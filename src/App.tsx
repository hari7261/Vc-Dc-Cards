import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Header from "@/components/layout/Header";
import UploadZone from "@/components/upload/UploadZoneNew";
import OCRProcessor from "@/components/ocr/OCRProcessor";
import ContactForm from "@/components/contact/ContactFormNew";
import ContactsList from "@/components/contact/ContactsListNew";
import AuthPage from "@/components/auth/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { useLocalContacts } from "@/hooks/useLocalContacts";
import { exportContactsToCSV } from "@/utils/csvExport";
import heroImage from "@/assets/hero-image.jpg";
import { Button } from "@/components/ui/button";
import { ContactFormData } from "@/hooks/useLocalContacts";
import { LogOut } from "lucide-react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<"upload" | "contacts">("upload");
  const [selectedFiles, setSelectedFiles] = useState<{ front: File | null; back: File | null }>({ front: null, back: null });
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { 
    contacts, 
    createContact, 
    deleteContact,
    isCreating, 
    isDeleting 
  } = useLocalContacts();

  const handleFileSelect = (files: { front: File | null; back: File | null }) => {
    console.log('Files selected:', files); // Debug log
    setSelectedFiles(files);
    setIsProcessing(true);
  };

  const handleTextExtracted = (text: string) => {
    console.log('Text extracted:', text); // Debug log
    setExtractedText(text);
    setShowForm(true);
    setIsProcessing(false);
  };

  const handleOCRError = (error: string) => {
    console.error("OCR Error:", error);
    setIsProcessing(false);
  };

  const handleSaveContact = (contactData: ContactFormData) => {
    console.log('Saving contact from App:', contactData); // Debug log
    createContact(contactData);
    
    // Reset form
    setSelectedFiles({ front: null, back: null });
    setExtractedText(null);
    setShowForm(false);
    setCurrentView("contacts");
  };

  const handleBackToUpload = () => {
    setSelectedFiles({ front: null, back: null });
    setExtractedText(null);
    setShowForm(false);
    setIsProcessing(false);
  };

  const handleExportContacts = () => {
    const exportData = contacts.map(contact => ({
      ...contact,
      createdAt: new Date(contact.created_at),
    }));
    exportContactsToCSV(exportData);
  };

  const handleViewChange = (view: "upload" | "contacts") => {
    setCurrentView(view);
  };

  const handleAuthSuccess = () => {
    // Auth state will be handled by useAuth hook
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 gradient-primary rounded-full animate-spin">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange}>
        <Button
          variant="ghost"
          onClick={signOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </Header>
      
      <main className="container mx-auto px-4 py-8">
        {currentView === "upload" ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-12">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Business card management" 
                  className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 gradient-hero opacity-10 rounded-2xl"></div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
                  Smart Business Card
                  <span className="gradient-hero bg-clip-text text-transparent"> Manager</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Upload, extract, and organize your business card contacts with AI-powered OCR technology
                </p>
              </div>
            </div>

            {/* Upload Flow */}
            {showForm && extractedText ? (
              <ContactForm
                extractedText={extractedText}
                onSave={handleSaveContact}
                onBack={handleBackToUpload}
              />
            ) : isProcessing && (selectedFiles.front || selectedFiles.back) ? (
              <OCRProcessor
                files={selectedFiles}
                onTextExtracted={handleTextExtracted}
                onError={handleOCRError}
              />
            ) : (
              <UploadZone
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
              />
            )}
          </div>
        ) : (
          <ContactsList
            contacts={contacts}
            onExport={handleExportContacts}
            onDelete={deleteContact}
            isDeleting={isDeleting}
          />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
