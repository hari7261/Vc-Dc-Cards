import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, User, Building, Phone, Mail, Globe, MapPin, Trash2 } from "lucide-react";
import { ContactData } from "@/hooks/useContacts";

interface ContactsListProps {
  contacts: ContactData[];
  onExport: () => void;
  onDelete?: (contactId: string) => void;
  isDeleting?: boolean;
}

const ContactsList = ({ contacts, onExport, onDelete, isDeleting = false }: ContactsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = [...new Set(contacts.flatMap(contact => contact.tags))];

  // Filter contacts based on search and tag
  const filteredContacts = contacts.filter(contact => {
    const searchFields = [
      contact.name,
      contact.company,
      contact.phone,
      contact.email,
      contact.website,
      contact.address,
      contact.notes,
      ...(contact.tags || [])
    ].filter(Boolean);
    
    const matchesSearch = searchTerm === "" || 
      searchFields.some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesTag = selectedTag === null || (contact.tags || []).includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Contacts</h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onExport} disabled={contacts.length === 0}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Filter by tag:</span>
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {contacts.length === 0 ? "No contacts yet" : "No matching contacts"}
            </h3>
            <p className="text-muted-foreground">
              {contacts.length === 0 
                ? "Upload your first business card to get started" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground truncate">{contact.name || "No Name"}</h3>
                      {contact.company && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {contact.company}
                        </p>
                      )}
                    </div>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(contact.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {contact.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </p>
                    )}
                    {contact.email && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{contact.email}</span>
                      </p>
                    )}
                    {contact.website && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{contact.website}</span>
                      </p>
                    )}
                    {contact.address && (
                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{contact.address}</span>
                      </p>
                    )}
                  </div>

                  {(contact.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(contact.tags || []).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Added {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContactsList;