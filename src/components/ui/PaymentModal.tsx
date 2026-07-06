
import React, { useState } from 'react';
 
import { useTranslation } from '../../hooks/useTranslation';
 
import { Button } from './Button';
 
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
 interface PaymentModalProps { isOpen: boolean;
 onClose: () => void;
 invoiceId: string;
 amount: number;
 } 
export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, invoiceId, amount }) => { const { t } = useTranslation();
 const [selectedMethod, setSelectedMethod] = useState<'payme' | 'click' | null>(null);
 if (!isOpen) 
return null;
 const handleProceed = () => { if (!selectedMethod) return;
 
/*  In Django phase, this will redirect to the Merchant API checkout URL // For now, just close the modal. We do NOT simulate fake success. onClose();
 */

 };
 
return ( <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-all duration-300"> <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-300"> {
/* Header */
} <div className="p-5 border-b border-border flex justify-between items-center bg-muted text-muted-foreground/50"> <h2 className="text-lg font-bold text-foreground flex items-center gap-2"> <ShieldCheck className="h-5 w-5 text-emerald-500" /> {t.patientBilling?.payNow || 'Pay Now'} </h2> <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground dark:hover:text-foreground transition-colors cursor-pointer" > <X className="h-5 w-5" /> </button> </div> {
/* Content */
} <div className="p-6 flex flex-col gap-6"> <div className="flex flex-col gap-1 items-center justify-center p-4 bg-muted text-muted-foreground/50 rounded-xl border border-slate-100 /80"> <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold"> Invoice #{invoiceId} </span> <span className="text-3xl font-mono font-bold text-foreground"> {amount.toLocaleString()} <span className="text-lg text-muted-foreground">UZS</span> </span> </div> <div className="flex flex-col gap-3"> <h3 className="text-sm font-bold text-secondary-foreground"> {t.patientBilling?.selectPaymentMethod || 'Select Payment Method'} </h3> <div className="grid grid-cols-2 gap-3"> {
/* Payme Option */
} <button onClick={() => setSelectedMethod('payme')} className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${selectedMethod === 'payme' ? 'border-[#33cccc] bg-[#33cccc]/5' : 'border-border hover:border-border dark:hover:border-slate-700 bg-card text-card-foreground/50' }`} > {
/* Payme Logo Placeholder */
} <div className="text-[#33cccc] font-black text-xl tracking-tight"> Payme </div> </button> {
/* Click Option */
} <button onClick={() => setSelectedMethod('click')} className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${selectedMethod === 'click' ? 'border-[#00a1ff] bg-[#00a1ff]/5' : 'border-border hover:border-border dark:hover:border-slate-700 bg-card text-card-foreground/50' }`} > {
/* Click Logo Placeholder */
} <div className="text-[#00a1ff] font-black text-xl italic tracking-tighter"> CLICK </div> </button> </div> </div> <p className="text-xs text-muted-foreground text-center"> {t.patientBilling?.paymentDesc || 'You will be securely redirected to the payment gateway.'} </p> </div> {
/* Footer */
} <div className="p-5 border-t border-border bg-muted text-muted-foreground/50 flex gap-3"> <Button variant="secondary" onClick={onClose} className="flex-1 cursor-pointer"> {t.patientBilling?.cancel || 'Cancel'} </Button> <Button variant="primary" onClick={handleProceed} disabled={!selectedMethod} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer transition-all ${ selectedMethod === 'payme' ? 'bg-[#33cccc] hover:bg-[#2ab3b3] text-white border-transparent' : selectedMethod === 'click' ? 'bg-[#00a1ff] hover:bg-[#008fdb] text-white border-transparent' : '' }`} > {t.patientBilling?.proceedToPayment || 'Proceed to Payment'} <ArrowRight className="h-4 w-4" /> </Button> </div> </div> </div> );
 };
 