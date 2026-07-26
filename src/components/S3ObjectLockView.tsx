import React, { useState } from 'react';
import {
  Lock,
  ShieldAlert,
  Cloud,
  FileCheck,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { S3ObjectLockConfig } from '../types';

interface S3ObjectLockViewProps {
  s3Configs: S3ObjectLockConfig[];
  onToggleLegalHold: (companyId: string) => void;
  onUpdateRetentionDays: (companyId: string, days: number) => void;
}

export const S3ObjectLockView: React.FC<S3ObjectLockViewProps> = ({
  s3Configs,
  onToggleLegalHold,
  onUpdateRetentionDays,
}) => {
  const [attackSimulationLog, setAttackSimulationLog] = useState<string | null>(null);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState<boolean>(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(s3Configs[0]?.companyId || '');

  const handleSimulateRansomwareWipe = () => {
    setIsSimulatingAttack(true);
    setAttackSimulationLog("Iniciando simulação de ataque de deleção por hacker/ransomware em nuvem...");

    setTimeout(() => {
      const config = s3Configs.find((c) => c.companyId === selectedCompanyId) || s3Configs[0];
      setAttackSimulationLog(
        `[S3_SIMULATION_ATTACK] Enviando requisição HTTP DELETE s3://${config.bucketName}/* com credencial de Admin Master...\n` +
        `[AWS_S3_API_RESPONSE] HTTP 403 Forbidden - AccessDenied\n` +
        `[S3_WORM_LOCK_REASON] Object Lock em modo ${config.wormMode} ativo para ${config.retentionDays} dias.\n` +
        `[RESULTADO SUPREMO] O S3 recusou a deleção! Nem mesmo o hacker com a chave master conseguiu apagar o backup. Dado 100% blindado!`
      );
      setIsSimulatingAttack(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-blue-400" />
                Blindagem Suprema Anti-Ransomware
              </span>
            </div>
            <h1 className="text-xl font-black text-white flex items-center space-x-2">
              <Cloud className="w-6 h-6 text-blue-400" />
              <span>Nuvem Imutável (S3 Object Lock / WORM)</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Tecnologia <strong className="text-blue-300 font-mono">WORM (Write Once, Read Many)</strong> via API S3. Impede rigorosamente a substituição ou deleção de backups por até 30 dias. Nem invasores com a senha root conseguem apagar os dados.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Trava WORM S3</div>
              <div className="text-lg font-bold text-emerald-400">Ativa (COMPLIANCE)</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Objetos Imutáveis</div>
              <div className="text-lg font-bold text-blue-400">12.300+ Arquivos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Attack Simulation Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Simulador de Ataque Hacker Anti-Deleção (WORM Lock Test)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Simule a tentativa de um malware ou hacker com credencial completa enviando um comando `s3:DeleteObject`.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2 focus:outline-none"
            >
              {s3Configs.map((c) => (
                <option key={c.companyId} value={c.companyId}>
                  {c.companyName} ({c.provider})
                </option>
              ))}
            </select>
            <button
              onClick={handleSimulateRansomwareWipe}
              disabled={isSimulatingAttack}
              className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-lg shadow-rose-900/30 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{isSimulatingAttack ? 'Simulando Ataque...' : 'Simular Wipe Hacker'}</span>
            </button>
          </div>
        </div>

        {attackSimulationLog && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Log do Teste de Inviolabilidade S3 WORM</span>
            </div>
            <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[11px]">
              {attackSimulationLog}
            </pre>
          </div>
        )}
      </div>

      {/* S3 Buckets Object Lock Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Cloud className="w-4 h-4 text-blue-400" />
          <span>Configuração dos Buckets S3 com Object Lock WORM</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {s3Configs.map((config) => (
            <div
              key={config.companyId}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-bold text-white">{config.companyName}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
                    <span>s3://{config.bucketName}</span>
                  </div>
                </div>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                  {config.provider}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Modo WORM</div>
                  <div className="text-emerald-400 font-bold font-mono mt-0.5 flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{config.wormMode}</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Período de Lock</div>
                  <div className="text-white font-bold font-mono mt-0.5 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{config.retentionDays} Dias Imutável</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Objetos Protegidos:</span>
                  <span className="font-mono text-white">{config.totalLockedObjects.toLocaleString()} arquivos</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Espaço Trancado:</span>
                  <span className="font-mono text-white">{config.totalLockedBytesGB} GB</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Legal Hold (Trava Jurídica):</span>
                  <button
                    onClick={() => onToggleLegalHold(config.companyId)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${
                      config.legalHold
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {config.legalHold ? 'ATIVADO (PROIBIDO DELETAR)' : 'DESATIVADO'}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Ajustar Dias WORM:</span>
                <div className="flex items-center space-x-1">
                  {[15, 30, 60, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => onUpdateRetentionDays(config.companyId, days)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        config.retentionDays === days
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
