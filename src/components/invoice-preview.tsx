"use client";

import type { Invoice } from '@/types/invoice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Separator } from './ui/separator';
import { format, parseISO } from 'date-fns';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Handles 'yyyy-MM-dd' from <input type="date">
      const date = parseISO(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString; // fallback
    }
  };

  const handleDownload = () => {
    const invoiceElement = document.getElementById('invoice-to-print');
    if (invoiceElement) {
      html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }
        pdf.save(`invoice-${invoice.invoiceNumber || 'download'}.pdf`);
      });
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300">
      <CardHeader className="flex-row items-center justify-between bg-muted/30">
        <div>
          <CardTitle>Invoice Preview</CardTitle>
          <CardDescription>This is how your invoice will look.</CardDescription>
        </div>
        <Button onClick={handleDownload} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div id="invoice-to-print" className="bg-white p-6 sm:p-8 rounded-md text-black shadow-none ring-1 ring-gray-200">
          <header className="flex items-start justify-between border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{invoice.from.name}</h1>
              <p className="text-sm text-gray-500">{invoice.from.address}</p>
              <p className="text-sm text-gray-500">{invoice.from.email}</p>
              <p className="text-sm text-gray-500">{invoice.from.phone}</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold uppercase text-gray-400">Invoice</h2>
              <p className="text-sm text-gray-500"># {invoice.invoiceNumber}</p>
            </div>
          </header>

          <section className="my-8 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-500">Bill To</h3>
              <p className="font-bold text-gray-800">{invoice.to.name}</p>
              <p className="text-sm text-gray-500">{invoice.to.address}</p>
              <p className="text-sm text-gray-500">{invoice.to.email}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-500">Invoice Date</h3>
              <p className="text-sm text-gray-800">{formatDate(invoice.invoiceDate)}</p>
              <h3 className="mt-2 font-semibold text-gray-500">Due Date</h3>
              <p className="text-sm text-gray-800">{formatDate(invoice.dueDate)}</p>
            </div>
          </section>

          <section>
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[60%] font-semibold text-gray-600">Description</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600">Quantity</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600">Price</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-800">{item.description}</TableCell>
                    <TableCell className="text-right text-gray-600">{item.quantity}</TableCell>
                    <TableCell className="text-right text-gray-600">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right font-medium text-gray-800">{formatCurrency(item.quantity * item.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
          
          <section className="mt-8 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
                    <span className="font-medium text-gray-800">{formatCurrency(taxAmount)}</span>
                </div>
                <Separator className="my-2 bg-gray-200" />
                 <div className="flex justify-between text-base">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gray-800">{formatCurrency(total)}</span>
                </div>
            </div>
          </section>

          <footer className="mt-12 border-t pt-6 text-center text-xs text-gray-400">
            <p>Thank you for your business!</p>
          </footer>
        </div>
      </CardContent>
    </Card>
  );
}
