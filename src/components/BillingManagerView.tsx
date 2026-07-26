import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Ban,
  TrendingUp,
  Receipt,
  Download,
  Lock,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { TenantInvoice, Company } from '../types';

interface BillingManagerViewProps {
  invoices: TenantInvoice[];
  companies: Company[];
  onMarkAsPaid: (invoiceId: string) => void;
  onToggleCompanySuspension: (companyId: string) => void;
}

export const BillingManagerView: React.FC<BillingManagerViewProps> = ({
  invoices,
  companies,
  onMarkAsPaid,
  onToggleCompanySuspension,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<TenantInvoice | null>(null);
  const [showPixModal, setShowPixModal] = useState<boolean>(false);
  const [pixSimulatingSuccess, setPixSimulatingSuccess] = useState<boolean>(false);
  const [pricePerGB, setPricePerGB] = useState<number>(0.15);
  const [pricePerAgent, setPricePerAgent] = useState<number>(25.00);

  const totalMonthlyRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmountBRL, 0);
  const paidInvoicesCount = invoices.filter((i) => i.status === 'PAID').length;
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'OVERDUE').length;

  const handleSimulatePixPayment = () => {
    if (!selectedInvoice) return;
    setPixSimulatingSuccess(true);

    setTimeout(() => {
      onMarkAsPaid(selectedInvoice.id);
      setPixSimulatingSuccess(false);
      setShowPixModal(false);
      setSelectedInvoice(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-amber-400" />
                Motor de Faturamento Pay-as-you-Go
              </span>
            </div>
            <h1 className="text-xl font-black text-white flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-amber-400" />
              <span>Gestão de Faturamento & Medição de Consumo</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Automação financeira completa para MSPs. Calcule o consumo exato de espaço (GB) e agentes ativos de cada cliente com geração de faturas Pix/Cartão e bloqueio automático de inadimplentes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Faturamento Mês</div>
              <div className="text-lg font-bold text-amber-400">
                R$ {totalMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Inadimplência</div>
              <div className={`text-lg font-bold ${overdueInvoicesCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {overdueInvoicesCount} Clientes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metering Rates & Rules Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Tabela de Preços e Regras de Medição do MSP</span>
            </h2>
            <p className="text-xs text-slate-400">
              Ajuste o valor por Gigabyte armazenado e por licença de agente para recálculo automático.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
            <label className="text-xs text-slate-400 font-semibold block">Preço por GB Armazenado (R$)</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={pricePerGB}
                onChange={(e) => setPricePerGB(parseFloat(e.target.value) || 0.15)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded-lg font-bold font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <span className="text-[10px] text-slate-500">Ex: R$ 0,15 / GB ocupado em disco.</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
            <label className="text-xs text-slate-400 font-semibold block">Preço por Agente Servidor (R$)</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-500">R$</span>
              <input
                type="number"
                step="1.00"
                value={pricePerAgent}
                onChange={(e) => setPricePerAgent(parseFloat(e.target.value) || 25.00)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded-lg font-bold font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <span className="text-[10px] text-slate-500">Ex: R$ 25,00 por Worker Service instalado.</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
            <label className="text-xs text-slate-400 font-semibold block">Regra de Bloqueio Automático</label>
            <div className="text-xs font-bold text-rose-400 flex items-center space-x-1 mt-1">
              <Ban className="w-4 h-4 text-rose-400" />
              <span>Bloquear agentes após 5 dias de atraso</span>
            </div>
            <span className="text-[10px] text-slate-500">Paralisa backups de clientes inadimplentes.</span>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>Faturas e Cobranças dos Tenants</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase">
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Cliente Tenant</th>
                <th className="py-3 px-3">Período</th>
                <th className="py-3 px-3">Consumo GB</th>
                <th className="py-3 px-3">Agentes</th>
                <th className="py-3 px-3">Valor Total</th>
                <th className="py-3 px-3">Vencimento</th>
                <th className="py-3 px-3 text-right">Ações de Cobrança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => {
                const company = companies.find((c) => c.id === inv.companyId);
                const isSuspended = company?.status === 'suspended';

                return (
                  <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      {inv.status === 'PAID' && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PAGO</span>
                        </span>
                      )}
                      {inv.status === 'PENDING' && (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                          <Clock className="w-3 h-3" />
                          <span>PENDENTE</span>
                        </span>
                      )}
                      {inv.status === 'OVERDUE' && (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                          <AlertOctagon className="w-3 h-3" />
                          <span>ATRASADO</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white flex items-center space-x-1.5">
                        <span>{inv.companyName}</span>
                        {isSuspended && (
                          <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                            SUSPENSO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">ID: {inv.companyId}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{inv.period}</td>
                    <td className="py-3 px-3 font-mono text-slate-200">{inv.gbUsed} GB</td>
                    <td className="py-3 px-3 font-mono text-slate-200">{inv.agentsCount} Servidores</td>
                    <td className="py-3 px-3 font-bold font-mono text-amber-400 text-sm">
                      R$ {inv.totalAmountBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{inv.dueDate}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {inv.status !== 'PAID' && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowPixModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded flex items-center space-x-1 shadow"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Cobrar Pix</span>
                          </button>
                        )}

                        <button
                          onClick={() => onToggleCompanySuspension(inv.companyId)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded border transition-all ${
                            isSuspended
                              ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {isSuspended ? 'Desbloquear Client' : 'Bloquear Inadimplente'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pix Modal Payment Simulator */}
      {showPixModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
                <QrCode className="w-5 h-5 text-amber-400" />
                <span>Cobrança Via Pix Instantâneo</span>
              </div>
              <button
                onClick={() => {
                  setShowPixModal(false);
                  setSelectedInvoice(null);
                }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-4">
              <div>
                <div className="text-xs text-slate-400">Pagamento referente a:</div>
                <div className="text-sm font-bold text-white">{selectedInvoice.companyName}</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                  R$ {selectedInvoice.totalAmountBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Simulated QR Code Visual */}
              <div className="bg-white p-4 rounded-xl inline-block shadow-lg mx-auto">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126580014BR.GOV.BCB.PIX0136hypeguard-pix-gateway-key5204000053039865405351.005802BR5915HypeGuard%20SaaS"
                  alt="Pix QR Code"
                  className="w-36 h-36 mx-auto"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800 truncate">
                00020126580014BR.GOV.BCB.PIX0136hypeguard-pix-key...
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPixModal(false);
                  setSelectedInvoice(null);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSimulatePixPayment}
                disabled={pixSimulatingSuccess}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow"
              >
                {pixSimulatingSuccess ? (
                  <span>Confirmando Pix no Gateway...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Simular Pagamento Confirmado</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
