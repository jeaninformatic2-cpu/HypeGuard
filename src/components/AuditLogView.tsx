import React from 'react';
import { History, ShieldCheck, User, Clock, CheckCircle2 } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-400" />
          <span>Trilha de Auditoria & Logs de Segurança RMM</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registro imutável de ações administrativas, limpezas da régua 3-2-1 e bloqueios de cofres de credenciais.
        </p>
      </div>

      {/* Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-2">Data / Hora</th>
                <th className="pb-2">Usuário / Processo</th>
                <th className="pb-2">Ação de Segurança</th>
                <th className="pb-2">Empresa Cliente</th>
                <th className="pb-2">Detalhes Operacionais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 font-semibold text-blue-300 whitespace-nowrap">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.user}</span>
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-200">
                    <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{log.companyName}</td>
                  <td className="py-3 text-slate-400 text-[11px] leading-relaxed max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
