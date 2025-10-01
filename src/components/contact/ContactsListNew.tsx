import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Download, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Trash2, 
  Edit3, 
  Eye,
  Calendar,
  Tag,
  Save,
  X
} from "lucide-react";
import { ContactData, ContactFormData, useLocalContacts } from "@/hooks/useLocalContacts";

interface ContactsListProps {
  contacts: ContactData[];
  onExport: () => void;
  onDelete?: (contactId: string) => void;
  isDeleting?: boolean;
}

interface ContactDetailModalProps {
  contact: ContactData;
  onUpdate: (contact: ContactFormData & { id: string }) => void;
  onClose: () => void;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ contact, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ContactFormData>({
    name: contact.name || "",
    company: contact.company || "",
    phone: contact.phone || "",
    email: contact.email || "",
    website: contact.website || "",
    address: contact.address || "",
    notes: contact.notes || "",
    tags: contact.tags || [],
  });
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContactFormData, value: string | string[]) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...editData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange("tags", editData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!editData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }
    
    onUpdate({ ...editData, id: contact.id });
    setIsEditing(false);
    toast({
      title: "Contact updated!",
      description: "Changes have been saved successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {isEditing ? "Edit Contact" : "Contact Details"}
          </span>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Main Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" />
                  Name
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Full name"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md font-medium">
                    {contact.name || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4" />
                  Company
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Company name"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">
                    {contact.company || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Phone number"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Email address"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="Website URL"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">
                    {contact.website ? (
                      <a 
                        href={contact.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        {contact.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    value={editData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Full address"
                    rows={3}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md min-h-[60px]">
                    {contact.address || "Not provided"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {contact.tags && contact.tags.length > 0 ? (
                  contact.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No tags</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes..."
                rows={4}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
                {contact.notes || "No notes"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>{formatDate(contact.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Updated:</span>
                <span>{formatDate(contact.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
};

const ContactsList: React.FC<ContactsListProps> = ({ contacts, onExport, onDelete, isDeleting = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);
  const { updateContact } = useLocalContacts();

  // Get all unique tags
  const allTags = [...new Set(contacts.flatMap(contact => contact.tags || []))];

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

  const handleContactUpdate = async (updatedContact: ContactFormData & { id: string }) => {
    try {
      await updateContact(updatedContact);
      setSelectedContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Contacts</h2>
          <Button onClick={onExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Filter by tag:</span>
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

        {/* Results Count */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{contact.name || "Unnamed Contact"}</h3>
                      {contact.company && (
                        <p className="text-gray-600 text-sm">{contact.company}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedContact(contact)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        {selectedContact && (
                          <ContactDetailModal
                            contact={selectedContact}
                            onUpdate={handleContactUpdate}
                            onClose={() => setSelectedContact(null)}
                          />
                        )}
                      </Dialog>
                      
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(contact.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{contact.phone}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{contact.website}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{contact.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Added {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedTag 
                ? "Try adjusting your search or filter criteria"
                : "Start by uploading your first business card"
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContactsList;
