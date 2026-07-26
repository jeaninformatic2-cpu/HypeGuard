import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Server,
  Database,
  Sliders,
  Lock,
  Code2,
  History,
  ShieldCheck,
  FileCheck2,
  Cloud,
  CreditCard,
  FileText,
  KeyRound
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'companies' 
  | 'agents' 
  | 'jobs' 
  | 'restore_validation'
  | 's3_lock'
  | 'billing'
  | 'reports'
  | 'rbac_security'
  | 'retention' 
  | 'vault' 
  | 'generator' 
  | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, activeAlertsCount }) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Visão Geral RMM',
      icon: LayoutDashboard,
      description: 'Telemetria global & pulso',
    },
    {
      id: 'restore_validation' as NavTab,
      label: 'Auto-Validação Restore',
      icon: FileCheck2,
      description: 'DBCC CHECKDB em Sandbox',
    },
    {
      id: 's3_lock' as NavTab,
      label: 'Nuvem Imutável (WORM)',
      icon: Cloud,
      description: 'Trava S3 Object Lock 30d',
    },
    {
      id: 'billing' as NavTab,
      label: 'Motor de Faturamento',
      icon: CreditCard,
      description: 'Medição GB + Pix/Cartão',
    },
    {
      id: 'reports' as NavTab,
      label: 'Relatórios Executivos',
      icon: FileText,
      description: 'PDFs C-Level White-Label',
    },
    {
      id: 'rbac_security' as NavTab,
      label: 'RBAC & Autenticação 2FA',
      icon: KeyRound,
      description: 'Perfis e tokens TOTP',
    },
    {
      id: 'companies' as NavTab,
      label: 'Empresas / Tenancy',
      icon: Building2,
      description: 'Gestão multi-tenant',
    },
    {
      id: 'agents' as NavTab,
      label: 'Agentes Worker .NET',
      icon: Server,
      description: 'Serviços invisíveis OS',
    },
    {
      id: 'jobs' as NavTab,
      label: 'Backups & Logs VSS',
      icon: Database,
      description: 'Diagnósticos e erros OS',
      badge: activeAlertsCount > 0 ? `${activeAlertsCount} Alertas` : undefined,
    },
    {
      id: 'retention' as NavTab,
      label: 'Régua de Retenção 3-2-1',
      icon: Sliders,
      description: 'Lixeiro cirúrgico automático',
    },
    {
      id: 'vault' as NavTab,
      label: 'Cofre Anti-Ransomware',
      icon: Lock,
      description: 'Isolamento de credenciais',
    },
    {
      id: 'generator' as NavTab,
      label: 'Gerador Agente C#',
      icon: Code2,
      description: 'Worker Service & Install',
    },
    {
      id: 'audit' as NavTab,
      label: 'Logs de Auditoria',
      icon: History,
      description: 'Registros de segurança',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navegação Principal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="text-left truncate">
                  <div className="truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* RMM Health Footer Info */}
      <div className="p-3 m-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold">Cofre Anti-Ransomware</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Credenciais de rede descarregadas após cada execução. S3 WORM 30d ativo.
        </p>
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Worker Service: .NET 9</span>
          <span className="text-emerald-400">Headless OK</span>
        </div>
      </div>
    </aside>
  );
};

