"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useRef } from 'react';
import type { Invoice, LineItem } from '@/types/invoice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: Dispatch<SetStateAction<Invoice>>;
}

export default function InvoiceForm({ invoice, setInvoice }: InvoiceFormProps) {
  const newItemIdCounter = useRef(0);

  const handleFieldChange = (section: 'from' | 'to', field: string, value: string) => {
    setInvoice(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleLineItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
    const updatedLineItems = [...invoice.lineItems];
    const item = { ...updatedLineItems[index] };
    if (field === 'quantity' || field === 'price') {
      // @ts-ignore
      item[field] = parseFloat(value as string) || 0;
    } else {
      // @ts-ignore
      item[field] = value;
    }
    updatedLineItems[index] = item;
    setInvoice(prev => ({ ...prev, lineItems: updatedLineItems }));
  };

  const addLineItem = () => {
    newItemIdCounter.current += 1;
    setInvoice(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: `new-${newItemIdCounter.current}-${Date.now()}`, description: '', quantity: 1, price: 0 }
      ]
    }));
  };

  const removeLineItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>From</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fromName">Name</Label>
            <Input id="fromName" value={invoice.from.name} onChange={e => handleFieldChange('from', 'name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromAddress">Address</Label>
            <Input id="fromAddress" value={invoice.from.address} onChange={e => handleFieldChange('from', 'address', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email</Label>
              <Input id="fromEmail" type="email" value={invoice.from.email} onChange={e => handleFieldChange('from', 'email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromPhone">Phone</Label>
              <Input id="fromPhone" type="tel" value={invoice.from.phone} onChange={e => handleFieldChange('from', 'phone', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>To</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toName">Name</Label>
            <Input id="toName" value={invoice.to.name} onChange={e => handleFieldChange('to', 'name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toAddress">Address</Label>
            <Input id="toAddress" value={invoice.to.address} onChange={e => handleFieldChange('to', 'address', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toEmail">Email</Label>
            <Input id="toEmail" type="email" value={invoice.to.email} onChange={e => handleFieldChange('to', 'email', e.target.value)} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input id="invoiceNumber" value={invoice.invoiceNumber} onChange={e => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input id="invoiceDate" type="date" value={invoice.invoiceDate} onChange={e => setInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={invoice.dueDate} onChange={e => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {invoice.lineItems.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
              <div className="flex-grow space-y-2">
                <Label htmlFor={`itemDesc-${item.id}`}>Description</Label>
                <Input id={`itemDesc-${item.id}`} value={item.description} onChange={e => handleLineItemChange(index, 'description', e.target.value)} />
              </div>
              <div className="grid flex-shrink-0 grid-cols-3 gap-4 sm:w-auto sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`itemQty-${item.id}`}>Qty</Label>
                  <Input id={`itemQty-${item.id}`} type="number" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', e.target.value)} className="w-20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`itemPrice-${item.id}`}>Price</Label>
                  <Input id={`itemPrice-${item.id}`} type="number" value={item.price} onChange={e => handleLineItemChange(index, 'price', e.target.value)} className="w-24" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} className="self-end text-destructive hover:text-destructive sm:col-span-2">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addLineItem} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Tax</CardTitle></CardHeader>
        <CardContent>
          <div className="max-w-xs space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input id="taxRate" type="number" value={invoice.taxRate} onChange={e => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
