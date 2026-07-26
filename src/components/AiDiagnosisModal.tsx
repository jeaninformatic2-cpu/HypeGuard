import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { AiLogDiagnosis, SurgicalLog } from '../types';

interface AiDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  diagnosis: AiLogDiagnosis | null;
  error: string | null;
  surgicalLog?: SurgicalLog;
  hostname: string;
  companyName: string;
}

export const AiDiagnosisModal: React.FC<AiDiagnosisModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  diagnosis,
  error,
  surgicalLog,
  hostname,
  companyName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Diagnóstico Cirúrgico com IA (Gemini 2.5)</h3>
              <p className="text-xs text-slate-400 font-mono">{companyName} → {hostname}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original OS Log snippet */}
        {surgicalLog && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-[11px] text-slate-500 uppercase font-bold">Log Cirúrgico Original do Windows:</div>
            <div className="text-rose-400 font-semibold">{surgicalLog.code}: {surgicalLog.message}</div>
            <div className="text-slate-400 text-[11px]">{surgicalLog.osDetail}</div>
          </div>
        )}

        {/* Loading Spinner State */}
        {isLoading && (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-200">
              Analisando log OS, eventos VSS e vetores de risco com Gemini IA...
            </p>
            <p className="text-xs text-slate-500">
              Verificando integridade de cofre anti-ransomware e espaço em disco
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-4 text-xs text-rose-300">
            <div className="font-bold mb-1 flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-rose-400 mr-1" />
              <span>Falha na Análise de IA:</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {/* Diagnosis Result */}
        {diagnosis && !isLoading && (
          <div className="space-y-4 text-xs">
            
            {/* Root Cause Summary */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
              <h4 className="font-bold text-slate-200 text-sm mb-1.5 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Causa Raiz Identificada</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">{diagnosis.diagnosisSummary}</p>
            </div>

            {/* Anti-Ransomware Risk Impact */}
            <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-4">
              <h4 className="font-bold text-blue-200 text-sm mb-1.5 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <span>Impacto Anti-Ransomware & Integridade do Cofre</span>
              </h4>
              <p className="text-blue-300/90 leading-relaxed">{diagnosis.ransomwareRiskImpact}</p>
            </div>

            {/* Actionable Remediation Steps */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Passos Recomendados para Resolução Imediata:</span>
              </h4>
              <ol className="space-y-2">
                {diagnosis.remediationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-300">
                    <span className="bg-blue-900/60 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px] font-mono flex-shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg text-xs"
          >
            Fechar Diagnóstico
          </button>
        </div>

      </div>
    </div>
  );
};
