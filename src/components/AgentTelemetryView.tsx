import React, { useState } from 'react';
import { Server, Activity, HardDrive, Cpu, ShieldCheck, RefreshCw, ArrowUpCircle, Lock, CheckCircle2, AlertTriangle, XCircle, Search, Filter } from 'lucide-react';
import { AgentDevice } from '../types';

interface AgentTelemetryViewProps {
  devices: AgentDevice[];
  onTriggerAgentUpdate: (deviceId: string) => void;
  onTriggerSingleHeartbeat: (deviceId: string) => void;
  onToggleVaultLock: (deviceId: string) => void;
}

export const AgentTelemetryView: React.FC<AgentTelemetryViewProps> = ({
  devices,
  onTriggerAgentUpdate,
  onTriggerSingleHeartbeat,
  onToggleVaultLock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [folderFilter, setFolderFilter] = useState<string>('ALL');

  const filteredDevices = devices.filter((dev) => {
    const matchesSearch = dev.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.ipAddress.includes(searchTerm);
    const matchesFolder = folderFilter === 'ALL' || dev.virtualFolderGroup === folderFilter;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-blue-400" />
            <span>Agentes Worker Service .NET (Headless Telemetry)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Arquitetura invisível rodando em nível <code className="text-blue-300 bg-slate-800 px-1 py-0.5 rounded">NT AUTHORITY\SYSTEM</code>. Heartbeats a cada 5 minutos.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar hostname, IP, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
          </div>

          {/* Folder Group Filter */}
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">📁 Todas as Pastas Virtuais</option>
            <option value="Servidores">📁 Servidores</option>
            <option value="Financeiro">📁 Financeiro</option>
            <option value="Recepção">📁 Recepção</option>
          </select>
        </div>
      </div>

      {/* Agents Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDevices.map((device) => {
          const isDiskCritical = device.diskUsagePercent >= 90;

          return (
            <div
              key={device.id}
              className={`bg-slate-900 border rounded-xl p-5 shadow-sm transition-all ${
                device.status === 'offline'
                  ? 'border-rose-800/80 bg-slate-900/90'
                  : isDiskCritical
                  ? 'border-amber-700/80'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      device.status === 'online' ? 'bg-emerald-400' :
                      device.status === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'
                    }`}></span>
                    <h3 className="text-base font-bold text-white font-mono">{device.hostname}</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      📁 {device.virtualFolderGroup}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{device.companyName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{device.osName} • IP: {device.ipAddress}</p>
                </div>

                {/* Status Badge */}
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded border uppercase ${
                  device.status === 'online' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                  device.status === 'warning' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                  'bg-rose-950 text-rose-400 border-rose-800'
                }`}>
                  {device.status === 'online' ? 'Heartbeat On' : device.status === 'warning' ? 'Alerta Espaço' : 'Desconectado'}
                </span>
              </div>

              {/* Hardware Telemetry Bar */}
              <div className="grid grid-cols-3 gap-3 my-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                
                {/* CPU % */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center"><Cpu className="w-3 h-3 mr-1 text-blue-400" />CPU:</span>
                    <span className="font-mono font-bold text-slate-200">{device.cpuUsagePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${device.cpuUsagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* RAM % */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-purple-400" />RAM:</span>
                    <span className="font-mono font-bold text-slate-200">{device.ramUsagePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${device.ramUsagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* DISK USAGE % */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center"><HardDrive className="w-3 h-3 mr-1 text-amber-400" />HD Local:</span>
                    <span className={`font-mono font-bold ${isDiskCritical ? 'text-amber-400' : 'text-slate-200'}`}>
                      {device.diskUsagePercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isDiskCritical ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${device.diskUsagePercent}%` }}
                    ></div>
                  </div>
                </div>

              </div>

              {/* RMM Engine Feature Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] my-3">
                
                {/* VSS Capability */}
                <div className="flex items-center space-x-2 bg-slate-800/60 p-2 rounded border border-slate-700/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">VSS Shadow Copy API</span>
                    <span className="text-[10px] text-slate-400">Ativo para SQL / ERP</span>
                  </div>
                </div>

                {/* Credential Vault Lock */}
                <div className="flex items-center space-x-2 bg-slate-800/60 p-2 rounded border border-slate-700/60">
                  <Lock className={`w-4 h-4 flex-shrink-0 ${device.credentialVaultLocked ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      Cofre: {device.credentialVaultLocked ? 'Trancado (Isolado)' : 'Aberto (Em Uso)'}
                    </span>
                    <span className="text-[10px] text-slate-400">Criptografia LocalSystem</span>
                  </div>
                </div>

              </div>

              {/* Version & Auto-Update Pending */}
              <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-800">
                <div className="text-slate-400">
                  <span>Versão do Agente: </span>
                  <span className="font-mono text-slate-200 font-semibold">{device.agentVersion}</span>
                  {device.autoUpdatePending && (
                    <span className="ml-2 bg-blue-950 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-800 font-semibold animate-pulse">
                      Update v2.4.1 Pendente
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  Heartbeat: {new Date(device.lastHeartbeat).toLocaleTimeString('pt-BR')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2 pt-2">
                
                {/* Force Heartbeat */}
                <button
                  onClick={() => onTriggerSingleHeartbeat(device.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pedir Pulso</span>
                </button>

                {/* Lock / Unlock Vault */}
                <button
                  onClick={() => onToggleVaultLock(device.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex items-center space-x-1 ${
                    device.credentialVaultLocked
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-200 border-emerald-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{device.credentialVaultLocked ? 'Cofre Isolado' : 'Forçar Fechamento'}</span>
                </button>

                {/* Remote Auto-Update Button */}
                {device.autoUpdatePending && (
                  <button
                    onClick={() => onTriggerAgentUpdate(device.id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center space-x-1"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>Atualizar Agente Remotamente</span>
                  </button>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
