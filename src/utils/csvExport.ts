interface ContactData {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  notes: string;
  tags: string[];
  createdAt: Date;
}

export const exportContactsToCSV = (contacts: ContactData[]) => {
  if (contacts.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Company',
    'Phone',
    'Email',
    'Website',
    'Address',
    'Tags',
    'Notes',
    'Date Added'
  ];

  // Convert contacts to CSV rows
  const rows = contacts.map(contact => [
    contact.name,
    contact.company,
    contact.phone,
    contact.email,
    contact.website,
    contact.address.replace(/,/g, ';'), // Replace commas to avoid CSV issues
    contact.tags.join('; '),
    contact.notes.replace(/,/g, ';').replace(/\n/g, ' '), // Clean notes
    contact.createdAt.toLocaleDateString()
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `business_cards_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};