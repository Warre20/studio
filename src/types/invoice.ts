export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  from: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  to: {
    name: string;
    address: string;
    email: string;
  };
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: LineItem[];
  taxRate: number;
}
