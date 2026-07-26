import React, { useState } from 'react';
import {
  FileText,
  Building2,
  Award,
  Send,
  Download,
  Palette,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Printer,
  Sparkles,
  Mail,
  Globe
} from 'lucide-react';
import { WhiteLabelConfig, ExecutiveReport, Company } from '../types';

interface ExecutiveReportsViewProps {
  whiteLabelConfig: WhiteLabelConfig;
  executiveReports: ExecutiveReport[];
  companies: Company[];
  onUpdateWhiteLabel: (newConfig: WhiteLabelConfig) => void;
  onGenerateReport: (companyId: string) => void;
}

export const ExecutiveReportsView: React.FC<ExecutiveReportsViewProps> = ({
  whiteLabelConfig,
  executiveReports,
  companies,
  onUpdateWhiteLabel,
  onGenerateReport,
}) => {
  const [configForm, setConfigForm] = useState<WhiteLabelConfig>(whiteLabelConfig);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [activeReportPreview, setActiveReportPreview] = useState<ExecutiveReport | null>(
    executiveReports[0] || null
  );
  const [emailDispatchedLog, setEmailDispatchedLog] = useState<string | null>(null);

  const handleSaveWhiteLabel = () => {
    onUpdateWhiteLabel(configForm);
    alert('Configurações White-Label e marca do MSP salvas com sucesso!');
  };

  const handleGenerateAndPreview = () => {
    onGenerateReport(selectedCompanyId);
    const company = companies.find((c) => c.id === selectedCompanyId);
    if (!company) return;

    const generated: ExecutiveReport = {
      id: `rep_${Date.now()}`,
      companyId: company.id,
      companyName: company.name,
      period: 'Julho / 2026',
      generatedAt: new Date().toISOString(),
      backupSuccessRate: 99.8,
      dataProtectedGB: company.totalStorageGB,
      restoreTestsPassed: 18,
      threatsBlockedCount: 1,
      complianceScore: 100,
    };
    setActiveReportPreview(generated);
  };

  const handleSimulateEmailDispatch = () => {
    setEmailDispatchedLog(`Disparando e-mail White-Label com o relatório executivo PDF para ${configForm.reportRecipients.join(', ')}...`);
    setTimeout(() => {
      setEmailDispatchedLog(`[E-MAIL ENVIADO] Relatório Executivo do mês enviado com marca ${configForm.mspName} e gráficos de SLA.`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3 text-indigo-400" />
                Diferencial de Venda C-Level
              </span>
            </div>
            <h1 className="text-xl font-black text-white flex items-center space-x-2">
              <FileText className="w-6 h-6 text-indigo-400" />
              <span>Relatórios Executivos Automáticos White-Label</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Tangibilize o valor do serviço de TI para os donos e diretores das empresas. Gere e envie automaticamente relatórios executivos em PDF com a sua marca, logo, gráficos de saúde, SLA e testes de restore.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Marca MSP</div>
              <div className="text-sm font-bold text-indigo-300 truncate max-w-[140px]">{configForm.mspName}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">SLA de Sucesso</div>
              <div className="text-lg font-bold text-emerald-400">99.8% OK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Branding Config + Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: White-Label Branding Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Personalização White-Label</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nome do seu MSP (Empresa de TI)</label>
              <input
                type="text"
                value={configForm.mspName}
                onChange={(e) => setConfigForm({ ...configForm, mspName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">URL da Logo do MSP</label>
              <input
                type="text"
                value={configForm.mspLogoUrl}
                onChange={(e) => setConfigForm({ ...configForm, mspLogoUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 text-[11px] font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Domínio Personalizado (CNAME)</label>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={configForm.customDomain}
                  onChange={(e) => setConfigForm({ ...configForm, customDomain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">E-mail de Suporte nos Relatórios</label>
              <input
                type="email"
                value={configForm.supportEmail}
                onChange={(e) => setConfigForm({ ...configForm, supportEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Envio Automático Mensal:</span>
              <input
                type="checkbox"
                checked={configForm.autoMonthlyEmail}
                onChange={(e) => setConfigForm({ ...configForm, autoMonthlyEmail: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>

            <button
              onClick={handleSaveWhiteLabel}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-xs transition-all shadow"
            >
              Salvar Marca White-Label
            </button>
          </div>
        </div>

        {/* Right Col (2 cols span): Live Report Previewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Visualizador e Gerador de Relatório PDF C-Level</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Gere o documento final e simule a experiência recebida pelo cliente final.
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2 focus:outline-none"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleGenerateAndPreview}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 whitespace-nowrap shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerar Relatório</span>
                </button>
              </div>
            </div>

            {/* Document PDF Mock Card */}
            {activeReportPreview && (
              <div className="mt-4 bg-slate-950 border border-indigo-500/30 rounded-2xl p-6 space-y-5 text-slate-100 shadow-2xl relative">
                {/* PDF Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={configForm.mspLogoUrl}
                      alt="Logo MSP"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                    />
                    <div>
                      <div className="text-sm font-black text-white">{configForm.mspName}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">
                        Relatório Mensal de Saúde de TI & Proteção de Dados
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="text-slate-400">Cliente / Destinatário:</div>
                    <div className="font-bold text-white">{activeReportPreview.companyName}</div>
                    <div className="text-[10px] text-slate-500">{activeReportPreview.period}</div>
                  </div>
                </div>

                {/* KPI Metrics inside Report */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Taxa de Sucesso</div>
                    <div className="text-lg font-black text-emerald-400">
                      {activeReportPreview.backupSuccessRate}%
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Dados Protegidos</div>
                    <div className="text-lg font-black text-blue-400">
                      {activeReportPreview.dataProtectedGB} GB
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Testes DBCC Sandbox</div>
                    <div className="text-lg font-black text-purple-400">
                      {activeReportPreview.restoreTestsPassed} Válidos
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Ataques Bloqueados</div>
                    <div className="text-lg font-black text-amber-400">
                      {activeReportPreview.threatsBlockedCount} S3 WORM
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Resumo da Garantia de Continuidade de Negócio</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Durante o período de <strong>{activeReportPreview.period}</strong>, a infraestrutura da <strong>{activeReportPreview.companyName}</strong> permaneceu 100% protegida contra perdas de dados, falhas de hardware e sequestro por ransomware através do sistema de Shadow Copy e Nuvem Imutável WORM.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="text-slate-500 text-[10px]">
                    Suporte TI: <span className="text-slate-300 font-mono">{configForm.supportEmail}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSimulateEmailDispatch}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Disparar por E-mail</span>
                    </button>
                    <button
                      onClick={() => alert("Relatório enviado para a fila de impressão em PDF!")}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {emailDispatchedLog && (
              <div className="mt-3 bg-purple-950/60 border border-purple-500/40 p-3 rounded-xl text-purple-200 text-xs font-mono">
                {emailDispatchedLog}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
