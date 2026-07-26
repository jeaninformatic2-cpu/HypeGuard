import React from 'react';
import {
  Server,
  Building2,
  Activity,
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  Play,
  Lock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Database,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { Company, AgentDevice, BackupJob, AlertNotification } from '../types';

interface DashboardOverviewProps {
  companies: Company[];
  devices: AgentDevice[];
  jobs: BackupJob[];
  alerts: AlertNotification[];
  selectedCompanyId: string;
  onRunBackupNow: (jobId: string) => void;
  onForceVaultLockAll: () => void;
  onTriggerHeartbeats: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  companies,
  devices,
  jobs,
  alerts,
  selectedCompanyId,
  onRunBackupNow,
  onForceVaultLockAll,
  onTriggerHeartbeats,
  onNavigateToTab,
}) => {
  // Filter items based on selected company
  const filteredCompanies = selectedCompanyId === 'ALL' 
    ? companies 
    : companies.filter(c => c.id === selectedCompanyId);

  const filteredDevices = selectedCompanyId === 'ALL'
    ? devices
    : devices.filter(d => d.companyId === selectedCompanyId);

  const filteredJobs = selectedCompanyId === 'ALL'
    ? jobs
    : jobs.filter(j => j.companyId === selectedCompanyId);

  const filteredAlerts = selectedCompanyId === 'ALL'
    ? alerts
    : alerts.filter(a => a.companyId === selectedCompanyId);

  const onlineDevicesCount = filteredDevices.filter(d => d.status === 'online').length;
  const warningDevicesCount = filteredDevices.filter(d => d.status === 'warning').length;
  const offlineDevicesCount = filteredDevices.filter(d => d.status === 'offline').length;

  const totalStorageGB = filteredCompanies.reduce((acc, c) => acc + c.totalStorageGB, 0);
  const maxStorageGB = filteredCompanies.reduce((acc, c) => acc + c.maxStorageGB, 0);
  const storageUsagePercent = Math.round((totalStorageGB / (maxStorageGB || 1)) * 100);

  const criticalSpaceDevices = filteredDevices.filter(d => d.diskUsagePercent >= 90);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert if Critical Disk Space or Offline Device */}
      {criticalSpaceDevices.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Alerta Preventivo de Armazenamento RMM (Risco no Próximo Backup)
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {criticalSpaceDevices.length} servidor(es) com uso de disco acima de 90%. O motor de backup não iniciará sem espaço livre suficiente para prevenir corrupção.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {criticalSpaceDevices.map(d => (
                  <span key={d.id} className="text-[11px] bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded border border-amber-700/50 font-mono">
                    {d.companyName} → {d.hostname} ({d.diskUsagePercent}% uso - {d.diskFreeGB}GB livre)
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('retention')}
            className="flex-shrink-0 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <span>Executar Lixeiro 3-2-1</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Heartbeat & Online Devices */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Agentes Worker Service</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{filteredDevices.length}</span>
            <span className="text-xs text-slate-400">máquinas monitoradas</span>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-[11px]">
            <span className="flex items-center text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              {onlineDevicesCount} On
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-semibold">{warningDevicesCount} Alertas</span>
            <span className="text-slate-600">•</span>
            <span className="text-rose-400 font-semibold">{offlineDevicesCount} Off</span>
          </div>
        </div>

        {/* KPI 2: Anti-Ransomware Shield & Vault Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Cofre de Credenciais (NAS)</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400">100%</span>
            <span className="text-xs text-emerald-300 font-medium">Trancado e Isolado</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 leading-tight">
            Nenhuma credencial de rede salva em texto. Sessão abre apenas durante o envio VSS.
          </p>
        </div>

        {/* KPI 3: VSS Live Backup Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Taxa VSS Shadow Copy</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">
              {filteredJobs.length > 0 
                ? `${Math.round((filteredJobs.filter(j => j.status === 'SUCCESS').length / filteredJobs.length) * 100)}%` 
                : '100%'}
            </span>
            <span className="text-xs text-slate-400">sucesso VSS</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 leading-tight">
            Arquivos travados & bancos de dados SQL copiados em tempo real sem interrupção.
          </p>
        </div>

        {/* KPI 4: Storage Monitored */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Armazenamento Sob Guarda</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{(totalStorageGB / 1000).toFixed(2)} TB</span>
            <span className="text-xs text-slate-400">de {(maxStorageGB / 1000).toFixed(0)} TB</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${storageUsagePercent > 85 ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, storageUsagePercent)}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Quick Action Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span>Ações de Emergência & RMM Remoto</span>
          </h2>
          <span className="text-[11px] text-slate-400">Serviço C# Headless Windows</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onTriggerHeartbeats}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span>Forçar Batimento Heartbeat (5 min)</span>
          </button>

          <button
            onClick={onForceVaultLockAll}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Trancar Todos os Cofres NAS</span>
          </button>

          <button
            onClick={() => onNavigateToTab('generator')}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all"
          >
            <Server className="w-4 h-4" />
            <span>Implantar Novo Agente Worker Service</span>
          </button>
        </div>
      </div>

      {/* Two-Column Section: Devices Telemetry Table & Live Backup Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col (2 cols wide): Agent Telemetry Preview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Status dos Agentes Worker Service (Puro C#)</h3>
              <p className="text-xs text-slate-400">Roda invisível como "LocalSystem" e envia Heartbeats a cada 5 min</p>
            </div>
            <button
              onClick={() => onNavigateToTab('agents')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>Ver Todos ({filteredDevices.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Servidor / Computador</th>
                  <th className="pb-2">Empresa</th>
                  <th className="pb-2">Heartbeat</th>
                  <th className="pb-2">Uso Disco Local</th>
                  <th className="pb-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-slate-200 flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          dev.status === 'online' ? 'bg-emerald-400' :
                          dev.status === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'
                        }`}></span>
                        <span>{dev.hostname}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{dev.osName}</div>
                    </td>
                    <td className="py-3 text-slate-300">{dev.companyName}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        dev.status === 'online' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                        dev.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                        'bg-rose-950 text-rose-300 border border-rose-800/50'
                      }`}>
                        {dev.status === 'online' ? 'Heartbeat OK' : dev.status === 'warning' ? 'Alerta Espaço' : 'Offline (3+ pulsos)'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${dev.diskUsagePercent > 90 ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${dev.diskUsagePercent}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{dev.diskFreeGB} GB livres ({dev.diskUsagePercent}%)</span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onNavigateToTab('agents')}
                        className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
                      >
                        Telemetria
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col (1 col wide): Recent Backup Jobs & VSS Snapshots */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Jobs VSS & Status</h3>
            <button
              onClick={() => onNavigateToTab('jobs')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Ver Logs
            </button>
          </div>

          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-slate-200 truncate max-w-[170px]">{job.jobName}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    job.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    job.status === 'FAILED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span>Host: {job.hostname}</span>
                    <span className="font-mono text-[10px]">{(job.transferredBytesMB / 1024).toFixed(1)} GB</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Destino: {job.destinationPath}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    VSS Snapshot: {job.vssSnapshotCreated ? '✓ Criado' : '✗ Falhou'}
                  </span>
                  <button
                    onClick={() => onRunBackupNow(job.id)}
                    className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Rodar Agora</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
