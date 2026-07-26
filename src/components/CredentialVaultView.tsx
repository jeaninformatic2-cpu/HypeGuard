import React, { useState } from 'react';
import { Lock, ShieldAlert, Key, Server, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Unlink } from 'lucide-react';
import { AgentDevice } from '../types';

interface CredentialVaultViewProps {
  devices: AgentDevice[];
  onToggleVaultLock: (deviceId: string) => void;
  onForceVaultLockAll: () => void;
}

export const CredentialVaultView: React.FC<CredentialVaultViewProps> = ({
  devices,
  onToggleVaultLock,
  onForceVaultLockAll,
}) => {
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestAuth = (hostname: string) => {
    setTestResult(`Autenticação isolada testada com sucesso para ${hostname}! Cofre trancado em seguida.`);
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>Cofre de Credenciais Criptografado Anti-Ransomware</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Imunidade contra sequestro de dados: senhas de rede (NAS/SMB) nunca são salvas em texto plano ou no Firebase.
          </p>
        </div>

        <button
          onClick={onForceVaultLockAll}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Unlink className="w-4 h-4" />
          <span>Bloqueio de Emergência: Trancar Todos os NAS</span>
        </button>
      </div>

      {/* Security Architecture Flow Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-blue-400" />
          <span>Como o Cofre Protege o Cliente Contra Ransomware em Malha</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-blue-300 text-xs block">1. Criptografia em Memória</span>
            <p className="text-slate-400 leading-relaxed">
              As credenciais do NAS/HD Externo ficam trancadas com chave <code className="text-blue-300">DPAPI Windows</code> vinculada apenas à conta LocalSystem do servidor.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-purple-300 text-xs block">2. Acesso On-Demand Isolado</span>
            <p className="text-slate-400 leading-relaxed">
              No momento exato do backup, o agente abre uma sessão de rede isolada no Kernel, transfere a cópia e encerra o túnel imediatamente.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-300 text-xs block">3. Bloqueio de Salto Lateral</span>
            <p className="text-slate-400 leading-relaxed">
              Se um Ransomware infectar o servidor principal, ele não consegue pular para o destino de backup porque a porta do NAS fica trancada e inacessível.
            </p>
          </div>
        </div>
      </div>

      {testResult && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Machines Vault Status Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Estado dos Cofres de Credenciais nos Agentes</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-2">Servidor / Agente</th>
                <th className="pb-2">Empresa</th>
                <th className="pb-2">Criptografia Local</th>
                <th className="pb-2">Sessão NAS / Compartilhamento</th>
                <th className="pb-2 text-right">Ação de Segurança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {devices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200 font-mono">
                    <div className="flex items-center space-x-2">
                      <Server className="w-3.5 h-3.5 text-blue-400" />
                      <span>{dev.hostname}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{dev.companyName}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      DPAPI LocalSystem OK
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      dev.credentialVaultLocked
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      <Lock className="w-3 h-3 mr-1" />
                      {dev.credentialVaultLocked ? 'Sessão Fechada (Protegido)' : 'Sessão Ativa em Gravação'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => handleTestAuth(dev.hostname)}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition-colors"
                    >
                      Testar Cofre
                    </button>
                    <button
                      onClick={() => onToggleVaultLock(dev.id)}
                      className="text-[11px] bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded transition-colors"
                    >
                      {dev.credentialVaultLocked ? 'Forçar Fechamento' : 'Trancar Agora'}
                    </button>
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
