import { EyewearProduct, LensPackage, PaymentMethodId } from '../data/eyewear';

export interface PrescriptionData {
  sendLater: boolean;
  odSph: string;
  odCyl: string;
  odAxis: string;
  osSph: string;
  osCyl: string;
  osAxis: string;
  pd: string;
}

export interface CartItem {
  uid: string;
  product: EyewearProduct;
  colorId: string;
  lens: LensPackage;
  prescription?: PrescriptionData;
  quantity: number;
}

export interface OrderReceipt {
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  codFee: number;
  total: number;
  vatAmount: number;
  paymentMethod: PaymentMethodId;
  customerName: string;
  phone: string;
  cityLabel: string;
  districtStreet: string;
  nationalAddress: string;
  etaLabel: string;
}
