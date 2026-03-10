import React, { useState, useEffect } from 'react';
import { CheckCircle2, QrCode, Calendar, MapPin, User, DollarSign, ArrowRight, ShieldCheck, Printer, MessageCircle } from 'lucide-react';

interface ContractData {
  contractorName: string;
  freelancerName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  paymentAmount: string;
  pixKey: string;
  accepted: boolean;
  acceptanceTimestamp?: string;
  contractId: string;
}

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export default function App() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [data, setData] = useState<ContractData>({
    contractorName: '',
    freelancerName: '',
    eventName: '',
    eventDate: '',
    eventLocation: '',
    paymentAmount: '300,00',
    pixKey: '',
    accepted: false,
    contractId: generateId(),
  });

  console.log('App rendering, accepted:', !!data?.accepted);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccept = () => {
    if (!data.contractorName || !data.freelancerName) {
      alert('Por favor, preencha os nomes do contratante e do freelancer.');
      return;
    }
    
    setIsConfirming(true);

    const timestamp = new Date().toLocaleString('pt-BR');
    const phoneNumber = '5521998000109';
    const message = `*Confirmação de Prestação de Serviço - Acordo Digital #${data.contractId}*
    
*Contratante:* ${data.contractorName}
*Freelancer:* ${data.freelancerName}
*Evento:* ${data.eventName || 'Não especificado'}
*Data:* ${data.eventDate || 'Não especificada'}
*Valor:* R$ 300,00 (PIX)
*Status:* Confirmado e Aceito Eletronicamente em ${timestamp}

_Documento gerado via Acordo Rápido Digital_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp immediately to avoid popup blockers
    const win = window.open(whatsappUrl, '_blank');
    if (!win) {
      console.warn('WhatsApp popup blocked');
    }
    
    // Update state after a longer delay so user sees the yellow button
    setTimeout(() => {
      setData(prev => ({ 
        ...prev, 
        accepted: true, 
        acceptanceTimestamp: timestamp 
      }));
      setIsConfirming(false);
    }, 1200);
  };

  const handleManualWhatsApp = () => {
    const phoneNumber = '5521998000109';
    const message = `*Confirmação de Prestação de Serviço - Acordo Digital #${data.contractId}*
    
*Contratante:* ${data.contractorName}
*Freelancer:* ${data.freelancerName}
*Evento:* ${data.eventName || 'Não especificado'}
*Data:* ${data.eventDate || 'Não especificada'}
*Valor:* R$ 300,00 (PIX)
*Status:* Aceito Eletronicamente em ${data.acceptanceTimestamp}

_Documento gerado via Acordo Rápido Digital_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReset = () => {
    if (confirm('Deseja criar um novo contrato? Os dados atuais serão perdidos.')) {
      setData({
        contractorName: '',
        freelancerName: '',
        eventName: '',
        eventDate: '',
        eventLocation: '',
        paymentAmount: '300,00',
        pixKey: '',
        accepted: false,
        contractId: generateId(),
      });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Não especificada';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans selection:bg-emerald-100">
      <div className="w-full max-w-xl">
        
        {!data.accepted ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden">
            <div className="p-8 border-b border-zinc-100 bg-emerald-50/50">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Acordo Digital de Freelancer</h1>
              </div>
              <p className="text-sm text-zinc-500">Preencha os dados abaixo para gerar o termo de aceite rápido.</p>
            </div>

            <div className="p-8 space-y-6">
              {/* Partes */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <User className="w-3 h-3" /> Contratante (Quem paga)
                  </label>
                  <input 
                    name="contractorName"
                    placeholder="Nome completo ou Empresa"
                    value={data.contractorName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <User className="w-3 h-3" /> Freelancer (Quem trabalha)
                  </label>
                  <input 
                    name="freelancerName"
                    placeholder="Nome do Freelancer"
                    value={data.freelancerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Evento */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> O Evento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      name="eventName"
                      placeholder="Nome do Evento"
                      value={data.eventName}
                      onChange={handleChange}
                      className="col-span-2 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input 
                        name="eventDate"
                        type="date"
                        value={data.eventDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input 
                        name="eventLocation"
                        placeholder="Cidade/Local"
                        value={data.eventLocation}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagamento PIX */}
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                    <QrCode className="w-4 h-4" /> Pagamento via PIX
                  </label>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase">Seguro</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase">Valor do Cachê</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">R$</span>
                      <input 
                        name="paymentAmount"
                        placeholder="300,00"
                        value={data.paymentAmount}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-zinc-100 border border-emerald-200 rounded-xl outline-none transition-all font-bold text-emerald-900 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase">Chave PIX do Freelancer</label>
                    <input 
                      name="pixKey"
                      placeholder="CPF, E-mail ou Celular"
                      value={data.pixKey}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleAccept}
                  disabled={isConfirming}
                  className={`w-full group flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${
                    isConfirming 
                      ? 'bg-amber-400 text-amber-950 shadow-amber-200' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                  }`}
                >
                  {isConfirming ? (
                    <>Confirmado! <CheckCircle2 className="w-5 h-5" /></>
                  ) : (
                    <>Confirmar e Dar OK <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
                <p className="text-center text-[10px] text-zinc-400 mt-4 px-8 uppercase tracking-widest leading-relaxed">
                  Ao clicar em confirmar, você declara estar de acordo com a prestação de serviço eventual sem vínculo empregatício.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 overflow-hidden print:shadow-none print:border-zinc-200">
            <div className="p-8 bg-emerald-600 text-white text-center no-print">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Acordo Confirmado!</h2>
              <p className="text-emerald-100 text-sm mt-1">O contrato digital foi assinado eletronicamente.</p>
            </div>

            <div className="p-8 space-y-8">
              {/* Header do Documento */}
              <div className="flex justify-between items-start border-b border-zinc-100 pb-6">
                <div>
                  <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">ID do Contrato</h3>
                  <p className="font-mono font-bold text-zinc-900">#{data.contractId}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Data do Aceite</h3>
                  <p className="text-sm font-medium text-zinc-900">{data.acceptanceTimestamp}</p>
                </div>
              </div>

              {/* Conteúdo do Acordo */}
              <div className="space-y-6 text-zinc-800">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Contratante</h4>
                    <p className="font-bold text-zinc-900">{data.contractorName}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Freelancer</h4>
                    <p className="font-bold text-zinc-900">{data.freelancerName}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Evento: <strong className="text-zinc-900">{data.eventName || 'Não especificado'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Data: <strong className="text-zinc-900">{formatDate(data.eventDate)}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>Local: <strong className="text-zinc-900">{data.eventLocation || 'Não especificado'}</strong></span>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <h4 className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Valor a ser pago via PIX</h4>
                  <p className="text-3xl font-black text-emerald-700">R$ {data.paymentAmount}</p>
                  {data.pixKey && (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Chave PIX: {data.pixKey}</p>
                  )}
                </div>

                <div className="text-[11px] text-zinc-500 leading-relaxed italic border-l-2 border-emerald-200 pl-4">
                  "Este documento comprova o aceite eletrônico das partes para a prestação de serviço eventual, sem subordinação ou vínculo empregatício, conforme acordado via meio digital."
                </div>
              </div>

              {/* Footer / Ações */}
              <div className="pt-6 border-t border-zinc-100 flex flex-col gap-3 no-print">
                <button 
                  onClick={handleManualWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Enviar para WhatsApp
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  <Printer className="w-4 h-4" /> Salvar / Imprimir PDF
                </button>
                <button 
                  onClick={handleReset}
                  className="w-full py-3 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-600 transition-all"
                >
                  Criar Novo Contrato
                </button>
              </div>

              {/* Assinatura Digital Visual (Print Only) */}
              <div className="hidden print:block pt-12">
                <div className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Assinado Digitalmente por</p>
                    <p className="text-sm font-bold text-zinc-900">{data.contractorName}</p>
                    <p className="text-[9px] text-zinc-400">IP: Registrado eletronicamente • {data.acceptanceTimestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-zinc-400 mt-8 no-print">
          &copy; 2024 Acordo Rápido • Simples, Direto e Digital.
        </p>
      </div>

      <style>{`
        @media print {
          body { background: white; padding: 0; }
          .no-print { display: none !important; }
          .min-h-screen { min-height: auto; padding: 0; }
          .max-w-xl { max-w-full; }
          .rounded-3xl { border-radius: 0; border: none; }
        }
      `}</style>
    </div>
  );
}


