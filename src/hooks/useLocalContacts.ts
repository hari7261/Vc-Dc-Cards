import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ContactData {
  id: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  notes: string;
  tags: string[];
}

// Temporary localStorage-based contacts until database is fixed
export const useLocalContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const loadContacts = () => {
      try {
        const stored = localStorage.getItem('business_contacts');
        if (stored) {
          const parsedContacts = JSON.parse(stored);
          setContacts(parsedContacts);
        }
      } catch (error) {
        console.error('Error loading contacts from localStorage:', error);
      }
    };

    loadContacts();
  }, []);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    try {
      localStorage.setItem('business_contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts to localStorage:', error);
    }
  }, [contacts]);

  const createContact = async (contactData: ContactFormData) => {
    console.log('Creating contact with data:', contactData); // Debug log
    setIsCreating(true);
    try {
      // Ensure all string fields are properly trimmed and validated
      const cleanedData = {
        ...contactData,
        name: contactData.name?.trim() || '',
        company: contactData.company?.trim() || '',
        phone: contactData.phone?.trim() || '',
        email: contactData.email?.trim() || '',
        website: contactData.website?.trim() || '',
        address: contactData.address?.trim() || '',
        notes: contactData.notes?.trim() || '',
      };
      
      const newContact: ContactData = {
        id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...cleanedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('New contact created:', newContact); // Debug log
      setContacts(prev => {
        const updated = [newContact, ...prev];
        console.log('Updated contacts list:', updated); // Debug log
        return updated;
      });
      
      toast({
        title: "Contact saved!",
        description: "Your business card has been added to your contacts.",
      });

      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error); // Debug log
      toast({
        variant: "destructive",
        title: "Failed to save contact",
        description: "Please try again.",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateContact = async (contactData: ContactFormData & { id: string }) => {
    setIsLoading(true);
    try {
      const { id, ...updateData } = contactData;
      const updatedContact = {
        ...updateData,
        id,
        updated_at: new Date().toISOString(),
      };

      setContacts(prev => 
        prev.map(contact => 
          contact.id === id 
            ? { ...contact, ...updatedContact }
            : contact
        )
      );

      toast({
        title: "Contact updated!",
        description: "Your contact has been successfully updated.",
      });

      return updatedContact;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update contact",
        description: "Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (contactId: string) => {
    setIsDeleting(true);
    try {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      toast({
        title: "Contact deleted",
        description: "The contact has been removed from your list.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete contact",
        description: "Please try again.",
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    contacts,
    isLoading,
    error: null,
    createContact,
    updateContact,
    deleteContact,
    isCreating,
    isUpdating: isLoading,
    isDeleting,
  };
};
