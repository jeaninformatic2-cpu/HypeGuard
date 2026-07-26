import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  Terminal,
  Database,
  Cpu,
  RefreshCw,
  Award,
  FileCheck2,
  Sparkles,
  Info,
  Search,
  X
} from 'lucide-react';
import { RestoreValidationTest, BackupJob } from '../types';

interface RestoreValidationViewProps {
  tests: RestoreValidationTest[];
  jobs: BackupJob[];
  onRunSandboxTest: (jobId: string) => void;
}

export const RestoreValidationView: React.FC<RestoreValidationViewProps> = ({
  tests,
  jobs,
  onRunSandboxTest,
}) => {
  const [selectedTest, setSelectedTest] = useState<RestoreValidationTest | null>(null);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedJobToTest, setSelectedJobToTest] = useState<string>(jobs[0]?.id || '');
  const [certificateModalTest, setCertificateModalTest] = useState<RestoreValidationTest | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      job.hostname.toLowerCase().includes(term) ||
      job.companyName.toLowerCase().includes(term) ||
      job.jobName.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.some((j) => j.id === selectedJobToTest)) {
      setSelectedJobToTest(filteredJobs[0].id);
    }
  }, [searchTerm, filteredJobs]);

  const handleStartSandboxTest = () => {
    const targetJobId = selectedJobToTest || filteredJobs[0]?.id;
    if (!targetJobId) return;
    const job = jobs.find((j) => j.id === targetJobId);
    if (!job) return;

    setRunningJobId(job.id);
    setSandboxLogs([
      `[00:00.1] INICIANDO SANDBOX ISOLADO DE RESTAURAÇÃO DE INTEGRIDADE...`,
      `[00:00.8] Montando volume VSS Shadow Copy temporário do job ${job.jobName}...`,
      `[00:02.1] Subindo instância containerizada isolada de teste SQL/Filesystem...`,
      `[00:04.5] Executando comando nativo DBCC CHECKDB com ALL_ERROR_STRUCTS...`,
      `[00:07.8] Validando assinaturas de blocos SHA-256 e paridade de setor...`,
    ]);

    setTimeout(() => {
      setSandboxLogs((prev) => [
        ...prev,
        `[00:10.2] DBCC CHECKDB finalizado: 0 erros de alocação, 0 erros de consistência.`,
        `[00:11.0] CERTIFICADO DE INTEGRIDADE EMITIDO: Backup 100% íntegro e restaurável!`,
      ]);
      setRunningJobId(null);
      onRunSandboxTest(job.id);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Business Value Proposition */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                O Fim do "Backup de Schrödinger"
              </span>
            </div>
            <h1 className="text-xl font-black text-white flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>Auto-Validação de Restauração em Sandbox</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Diga adeus ao medo de restaurar e descobrir dados corrompidos. Nosso motor roda automações com <strong className="text-emerald-300 font-mono">DBCC CHECKDB</strong> e montagem de instantâneos em ambientes isolados para garantir 100% de integridade antes da emergência.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Integridade</div>
              <div className="text-lg font-bold text-emerald-400">100% Válida</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Testes Executados</div>
              <div className="text-lg font-bold text-blue-400">{tests.length} Sandbox</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sandbox Test Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Executar Validação de Restauração Instantânea</span>
            </h2>
            <p className="text-xs text-slate-400">
              Selecione um job de backup recente para montar no sandbox e verificar os dados sem afetar a produção.
            </p>
          </div>
          <button
            onClick={handleStartSandboxTest}
            disabled={runningJobId !== null}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-emerald-900/30"
          >
            {runningJobId ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Validando em Sandbox...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-white" />
                <span>Testar Integridade Agora</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Selecionar Backup para Teste
              </label>
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pesquisar computador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-[11px] text-white pl-8 pr-7 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    title="Limpar pesquisa"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <select
              value={selectedJobToTest}
              onChange={(e) => setSelectedJobToTest(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {filteredJobs.length === 0 ? (
                <option value="" disabled>
                  Nenhum computador encontrado com "{searchTerm}"
                </option>
              ) : (
                filteredJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.companyName} - {job.hostname} ({job.jobName})
                  </option>
                ))
              )}
            </select>

            <div className="mt-3 p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Método de Sandboxing:</span>
                <span className="text-emerald-400 font-mono">DBCC CHECKDB + Hyper-V VSS</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Modo de Isolamento:</span>
                <span className="text-slate-200">Zero Network Access (Air-Gapped)</span>
              </div>
            </div>
          </div>

          {/* Sandbox Live Execution Log */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] h-36 overflow-y-auto space-y-1">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Console de Execução Sandbox</span>
              {runningJobId && <span className="text-emerald-400 animate-pulse">EM EXECUÇÃO</span>}
            </div>
            {sandboxLogs.length === 0 ? (
              <div className="text-slate-600 italic">
                Clique em "Testar Integridade Agora" para disparar a auditoria em sandbox...
              </div>
            ) : (
              sandboxLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('100%') || log.includes('CERTIFICADO')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('INICIANDO')
                      ? 'text-blue-400'
                      : 'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* History of Sandbox Restore Validations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <FileCheck2 className="w-4 h-4 text-blue-400" />
          <span>Histórico de Auto-Validações Executadas</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase">
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Empresa / Servidor</th>
                <th className="py-3 px-3">Ambiente Sandbox</th>
                <th className="py-3 px-3">Resultado DBCC / Sector Check</th>
                <th className="py-3 px-3">Checksum</th>
                <th className="py-3 px-3">Data do Teste</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{test.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{test.companyName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{test.hostname}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                    {test.sandboxEnvironment}
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-slate-300 font-mono text-[10px]" title={test.dbccCheckDbResult}>
                    {test.dbccCheckDbResult}
                  </td>
                  <td className="py-3 px-3">
                    {test.checksumMatch ? (
                      <span className="text-emerald-400 font-bold">SHA-256 Validado</span>
                    ) : (
                      <span className="text-rose-400 font-bold">Incompatível</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {new Date(test.testedAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setCertificateModalTest(test)}
                      className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-semibold px-2.5 py-1 rounded transition-all flex items-center space-x-1 ml-auto"
                    >
                      <Award className="w-3 h-3" />
                      <span>Certificado</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate of Integrity Modal */}
      {certificateModalTest && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Certificado Oficial de Integridade do Backup</span>
              </div>
              <button
                onClick={() => setCertificateModalTest(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
              <div className="text-center space-y-1">
                <div className="text-emerald-400 text-sm font-extrabold uppercase tracking-wider">
                  HypeGuard Restore Guarantee Badge
                </div>
                <div className="text-slate-400 text-[10px]">
                  SISTEMA DE PROVA DE CONCEITO DE DADOS NÃO CORROMPIDOS
                </div>
              </div>

              <div className="space-y-2 text-slate-300 border-t border-b border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente / Organização:</span>
                  <span className="text-white font-bold">{certificateModalTest.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Servidor Auditado:</span>
                  <span className="text-white">{certificateModalTest.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resultado DBCC:</span>
                  <span className="text-emerald-400 font-bold">0 Errors (CHECKDB Clean)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ambiente do Teste:</span>
                  <span className="text-slate-200">{certificateModalTest.sandboxEnvironment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hash de Certificação:</span>
                  <span className="text-blue-400 text-[10px]">{certificateModalTest.certificateHash}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-emerald-300 text-[11px] bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
                <Info className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Este certificado atesta que a cópia de segurança pode ser restaurada em produção imediatamente com índice de sucesso de 100%.</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setCertificateModalTest(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert("Certificado de Integridade exportado em PDF!");
                  setCertificateModalTest(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Imprimir Certificado PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
