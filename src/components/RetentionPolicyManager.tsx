import React, { useState } from 'react';
import { Sliders, Trash2, ShieldCheck, HardDrive, Calculator, CheckCircle2, RotateCcw } from 'lucide-react';
import { Company, RetentionPolicy } from '../types';

interface RetentionPolicyManagerProps {
  companies: Company[];
  retentionPolicies: Record<string, RetentionPolicy>;
  onUpdatePolicy: (companyId: string, updated: RetentionPolicy) => void;
  onTriggerAutoCleanup: (companyId: string) => void;
}

export const RetentionPolicyManager: React.FC<RetentionPolicyManagerProps> = ({
  companies,
  retentionPolicies,
  onUpdatePolicy,
  onTriggerAutoCleanup,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || 'comp_jc');

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
  const currentPolicy = retentionPolicies[selectedCompanyId] || {
    companyId: selectedCompanyId,
    dailyKeep: 7,
    weeklyKeep: 4,
    monthlyKeep: 12,
    autoCleanupEnabled: true,
    pruneThresholdDiskPercent: 90,
  };

  // Mathematical Projection Calculations
  const avgBackupSizeGB = 35; // Simulated avg delta backup size
  const totalBackupsRetained = currentPolicy.dailyKeep + currentPolicy.weeklyKeep + currentPolicy.monthlyKeep;
  const projectedStorageGB = Math.round(totalBackupsRetained * avgBackupSizeGB);
  const estimatedSavingsGB = Math.round((365 - totalBackupsRetained) * avgBackupSizeGB);

  const handleSliderChange = (key: keyof RetentionPolicy, value: any) => {
    const updated = {
      ...currentPolicy,
      [key]: value,
    };
    onUpdatePolicy(selectedCompanyId, updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <span>Régua de Retenção Inteligente (Regra 3-2-1)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lixeiro cirúrgico automático: expurga arquivos antigos com matemática precisa para evitar HD 100% cheio no cliente.
          </p>
        </div>

        {/* Company Selector */}
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              🏢 {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3-2-1 Rule Concept Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Diretriz Arquitetural de Segurança 3-2-1</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-blue-400 font-bold text-sm block">3 Cópias dos Dados</span>
            <p className="text-slate-400 leading-relaxed">
              1 Dado de Produção no Servidor + 1 Snapshot VSS Local + 1 Imagem Criptografada no Cofre NAS.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-purple-400 font-bold text-sm block">2 Mídias Diferentes</span>
            <p className="text-slate-400 leading-relaxed">
              Combinação de Discos Locais NVMe e Storages NAS isolados com credenciais trancadas.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold text-sm block">1 Cópia Offsite / Isolada</span>
            <p className="text-slate-400 leading-relaxed">
              Nuvem isolada ou HD de Backup desconectado via Kernel Windows para imunidade anti-ransomware.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Configurator & Storage Projection Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Retention Controls */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Configurar Retenção para {selectedCompany?.name}</h3>
              <p className="text-xs text-slate-400">Ajuste os parâmetros da regra de retenção do Agente Worker Service</p>
            </div>

            <button
              onClick={() => onTriggerAutoCleanup(selectedCompanyId)}
              className="bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/60 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Executar Lixeiro Agora</span>
            </button>
          </div>

          {/* Daily Retention */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">📅 Backups Diários a Manter:</span>
              <span className="font-mono font-bold text-blue-400 text-sm">{currentPolicy.dailyKeep} dias</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={currentPolicy.dailyKeep}
              onChange={(e) => handleSliderChange('dailyKeep', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Guarda cópias diárias dos últimos {currentPolicy.dailyKeep} dias.</p>
          </div>

          {/* Weekly Retention */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">📆 Backups Semanais a Manter:</span>
              <span className="font-mono font-bold text-purple-400 text-sm">{currentPolicy.weeklyKeep} semanas</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={currentPolicy.weeklyKeep}
              onChange={(e) => handleSliderChange('weeklyKeep', Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Guarda 1 ponto de restauração semanal das últimas {currentPolicy.weeklyKeep} semanas.</p>
          </div>

          {/* Monthly Retention */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">🏛️ Backups Mensais a Manter:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{currentPolicy.monthlyKeep} meses</span>
            </div>
            <input
              type="range"
              min="1"
              max="36"
              value={currentPolicy.monthlyKeep}
              onChange={(e) => handleSliderChange('monthlyKeep', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Retém fechamentos mensais para fins fiscais e conformidade regulatória.</p>
          </div>

          {/* Auto-Prune Trigger Threshold */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-200 block">Lixeiro Automático Preventivo</span>
                <span className="text-[11px] text-slate-400">Expurga os pontos mais antigos se o HD de destino atingir o limite</span>
              </div>
              <input
                type="checkbox"
                checked={currentPolicy.autoCleanupEnabled}
                onChange={(e) => handleSliderChange('autoCleanupEnabled', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {currentPolicy.autoCleanupEnabled && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Gatilho de Disparo de Expurgo (% Uso do Disco):</span>
                <span className="font-mono font-bold text-amber-400">{currentPolicy.pruneThresholdDiskPercent}% em uso</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Mathematical Calculator & Savings Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Matemática de Espaço & Economia</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Pontos Retidos:</span>
              <span className="font-mono font-bold text-white text-sm">{totalBackupsRetained} imagens</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Uso Projetado no HD:</span>
              <span className="font-mono font-bold text-purple-400 text-sm">~{projectedStorageGB} GB</span>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/60 flex justify-between items-center">
              <span className="text-emerald-300">Economia pelo Expurgo:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">~{estimatedSavingsGB} GB previstos</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
            A matemática do expurgo garante que o destino nunca fique 100% ocupado, prevenindo paradas inesperadas nos backups do cliente.
          </div>
        </div>

      </div>

    </div>
  );
};
