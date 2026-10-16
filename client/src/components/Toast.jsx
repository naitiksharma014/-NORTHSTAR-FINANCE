import {useEffect} from 'react';
import {CheckCircle2,AlertCircle,X} from 'lucide-react';
export default function Toast({toast,onClose}){useEffect(()=>{if(!toast)return;const t=setTimeout(onClose,4200);return()=>clearTimeout(t)},[toast,onClose]);if(!toast)return null;const Icon=toast.type==='error'?AlertCircle:CheckCircle2;return <div className={`toast toast-${toast.type||'success'}`} role="status"><Icon size={18}/><span>{toast.message}</span><button aria-label="Dismiss notification" onClick={onClose}><X size={16}/></button></div>}
