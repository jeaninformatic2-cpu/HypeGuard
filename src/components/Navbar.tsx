import React from 'react';
import { ShieldAlert, Server, Bell, RefreshCw, PlusCircle, Activity, Building2, CheckCircle2 } from 'lucide-react';
import { Company } from '../types';

interface NavbarProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenGenerator: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  lastHeartbeatTime: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenGenerator,
  isSimulating,
  onToggleSimulation,
  lastHeartbeatTime,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-lg shadow-md flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">HypeGuard</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Enterprise RMM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Plataforma Anti-Ransomware & Telemetria .NET</p>
          </div>
        </div>

        {/* Tenant Switcher & Live Pulse */}
        <div className="flex items-center space-x-4">
          {/* Company Multi-tenant Filter */}
          <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-sm">
            <Building2 className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <select
              value={selectedCompanyId}
              onChange={(e) => onSelectCompany(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">
                🏢 Todas as Empresas (Visão Multi-Tenant)
              </option>
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name} ({c.devicesCount} máquinas)
                </option>
              ))}
            </select>
          </div>

          {/* Heartbeat Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulating ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              Pulso: {lastHeartbeatTime ? new Date(lastHeartbeatTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Ativo'}
            </span>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={onToggleSimulation}
            title="Alternar simulação em tempo real de Heartbeats e Logs"
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isSimulating
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-pulse text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">
              {isSimulating ? 'Simulação Ativa (5m)' : 'Pausar Simulação'}
            </span>
          </button>

          {/* Alert Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Central de Alertas RMM"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900 animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* New Worker Agent Code Generator */}
          <button
            onClick={onOpenGenerator}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Agente .NET</span>
          </button>
        </div>

      </div>
    </header>
  );
};
