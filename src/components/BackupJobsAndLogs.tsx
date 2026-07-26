import React, { useState } from 'react';
import { Database, Play, Sparkles, CheckCircle2, XCircle, AlertTriangle, Clock, HardDrive, ShieldCheck, Terminal, Search } from 'lucide-react';
import { BackupJob, SurgicalLog, AiLogDiagnosis } from '../types';
import { AiDiagnosisModal } from './AiDiagnosisModal';

interface BackupJobsAndLogsProps {
  jobs: BackupJob[];
  onRunBackupNow: (jobId: string) => void;
  onTestVSSSnapshot: (jobId: string) => void;
}

export const BackupJobsAndLogs: React.FC<BackupJobsAndLogsProps> = ({
  jobs,
  onRunBackupNow,
  onTestVSSSnapshot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForAi, setSelectedJobForAi] = useState<{
    job: BackupJob;
    log: SurgicalLog;
  } | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<AiLogDiagnosis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredJobs = jobs.filter((j) =>
    j.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAiDiagnosis = async (job: BackupJob, log: SurgicalLog) => {
    setSelectedJobForAi({ job, log });
    setAiLoading(true);
    setAiDiagnosis(null);
    setAiError(null);

    try {
      const res = await fetch('/api/diagnose-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logEntry: log,
          deviceHostname: job.hostname,
          companyName: job.companyName,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao se comunicar com o servidor de inteligência RMM.');
      }

      const data = await res.json();
      setAiDiagnosis(data);
    } catch (err: any) {
      setAiError(err?.message || 'Ocorreu um erro desconhecido durante o diagnóstico por IA.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Trabalhos VSS & Logs Cirúrgicos de Erros OS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Motor de backup anti-ransomware integrado à API Volume Shadow Copy Service (VSS) do Windows.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por job, host ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-64"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            
            {/* Job Title & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
                    job.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                    job.status === 'FAILED' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                    'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    {job.status}
                  </span>
                  <h3 className="text-base font-bold text-white">{job.jobName}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Empresa: <strong className="text-slate-200">{job.companyName}</strong> • Servidor: <code className="text-blue-300 bg-slate-800 px-1 py-0.5 rounded font-mono">{job.hostname}</code>
                </p>
              </div>

              {/* Immediate Action Triggers */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onTestVSSSnapshot(job.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Testar Snap VSS</span>
                </button>

                <button
                  onClick={() => onRunBackupNow(job.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Executar Backup VSS</span>
                </button>
              </div>
            </div>

            {/* Technical Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Destino Protegido</span>
                <span className="font-mono text-slate-300 text-[11px] truncate block">{job.destinationPath}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Agendamento</span>
                <span className="text-slate-200 font-medium">{job.scheduleCron}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Transferência</span>
                <span className="font-mono text-slate-200">{(job.transferredBytesMB / 1024).toFixed(2)} GB ({job.durationSeconds}s)</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Cofre de Credenciais</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                  Isolado Pós-Execução
                </span>
              </div>
            </div>

            {/* Surgical OS Log Box */}
            {job.surgicalLog && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px] font-bold flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>Log Cirúrgico Capturado pelo Agente Windows:</span>
                  </span>

                  <button
                    onClick={() => handleOpenAiDiagnosis(job, job.surgicalLog!)}
                    className="bg-indigo-950 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Diagnosticar Log com IA (Gemini)</span>
                  </button>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      job.surgicalLog.level === 'error' ? 'bg-rose-950 text-rose-400' :
                      job.surgicalLog.level === 'warning' ? 'bg-amber-950 text-amber-400' :
                      'bg-emerald-950 text-emerald-400'
                    }`}>
                      {job.surgicalLog.code}
                    </span>
                    <span className="text-slate-200 font-semibold">{job.surgicalLog.message}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{job.surgicalLog.osDetail}</p>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* AI Log Diagnosis Modal */}
      {selectedJobForAi && (
        <AiDiagnosisModal
          isOpen={!!selectedJobForAi}
          onClose={() => setSelectedJobForAi(null)}
          isLoading={aiLoading}
          diagnosis={aiDiagnosis}
          error={aiError}
          surgicalLog={selectedJobForAi.log}
          hostname={selectedJobForAi.job.hostname}
          companyName={selectedJobForAi.job.companyName}
        />
      )}

    </div>
  );
};
