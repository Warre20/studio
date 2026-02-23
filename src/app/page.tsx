'use client';

import { useState, useEffect } from 'react';
import type { Invoice } from '@/types/invoice';
import { format } from 'date-fns';
import InvoiceForm from '@/components/invoice-form';
import InvoicePreview from '@/components/invoice-preview';
import { FileText } from 'lucide-react';

const initialStaticData = {
  from: {
    name: 'Your Company',
    address: '123 Main St, Anytown, USA',
    email: 'contact@yourcompany.com',
    phone: '555-123-4567',
  },
  to: {
    name: 'Client Company',
    address: '456 Oak Ave, Otherville, USA',
    email: 'contact@client.com',
  },
  invoiceNumber: 'INV-001',
  taxRate: 8,
};

export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>({
    ...initialStaticData,
    invoiceDate: '',
    dueDate: '',
    lineItems: [
      { id: '1', description: 'Web Design Services', quantity: 10, price: 150 },
      { id: '2', description: 'Hosting (1 year)', quantity: 1, price: 300 },
    ],
  });

  useEffect(() => {
    // Set dates only on the client-side after hydration
    setInvoice(prev => ({
      ...prev,
      invoiceDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
    }));
  }, []);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-8 flex items-center gap-4">
          <div className="rounded-lg bg-primary p-3 text-primary-foreground shadow-md">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="font-headline text-3xl font-bold text-foreground">
            InstantInvoice
          </h1>
        </header>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div className="row-start-2 lg:row-start-1">
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className="lg:sticky lg:top-8">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </main>
  );
}
