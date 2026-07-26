import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, Server, ShieldCheck, Download } from 'lucide-react';

interface WorkerServiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkerServiceGeneratorModal: React.FC<WorkerServiceGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSnippet, setActiveSnippet] = useState<'cs' | 'json' | 'cmd'>('cs');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const csharpCode = `// HypeGuardWorkerService.cs - Agente Headless RMM em C# .NET 9
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace HypeGuard.AgentWorker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly HttpClient _httpClient;
        private const int HeartbeatIntervalMinutes = 5;

        public Worker(ILogger<Worker> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient("HypeGuardAPI");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("HypeGuard Worker Service iniciado no nível LocalSystem.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Coletando telemetria OS e enviando Heartbeat RMM...");
                    await SendTelemetryHeartbeatAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro cirúrgico durante envio de telemetria.");
                }

                await Task.Delay(TimeSpan.FromMinutes(HeartbeatIntervalMinutes), stoppingToken);
            }
        }

        private async Task SendTelemetryHeartbeatAsync(CancellationToken ct)
        {
            var driveInfo = new DriveInfo("C");
            var freeGb = driveInfo.AvailableFreeSpace / (1024 * 1024 * 1024);
            var totalGb = driveInfo.TotalSize / (1024 * 1024 * 1024);

            var payload = new
            {
                hostname = Environment.MachineName,
                osName = Environment.OSVersion.ToString(),
                agentVersion = "v2.4.1-WorkerEngine",
                diskFreeGB = freeGb,
                diskTotalGB = totalGb,
                vssAvailable = true,
                vaultLocked = true,
                timestamp = DateTime.UtcNow
            };

            // Envia batimento cardíaco para a plataforma SaaS
            var content = new StringContent(JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            await _httpClient.PostAsync("/api/agent/heartbeat", content, ct);
        }
    }
}`;

  const jsonConfig = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "HypeGuardConfig": {
    "TenantId": "comp_jc",
    "CompanySecretKey": "HG-VAULT-2026-JC-INFO-SECURE",
    "ApiUrl": "https://hypeguard-saas-rmm.internal/api",
    "HeartbeatIntervalSeconds": 300,
    "UseVSSApi": true,
    "CredentialVaultStorage": "DPAPI_KERNEL_LOCALSYSTEM"
  }
}`;

  const cmdScript = `# Comando de Instalação Silenciosa do Agente no Windows Server (PowerShell / CMD Admin)

# 1. Compilar e Publicar o Executável .NET
dotnet publish -c Release -r win-x64 --self-contained true -o C:\\HypeGuardAgent

# 2. Criar o Serviço Windows com Inicialização Automática e Usuário LocalSystem
sc.exe create HypeGuardWorker binPath= "C:\\HypeGuardAgent\\HypeGuard.AgentWorker.exe" start= auto obj= "NT AUTHORITY\\SYSTEM" DisplayName= "HypeGuard Backup & Anti-Ransomware Worker"

# 3. Iniciar o Serviço sem Interatividade com o Usuário (Headless 100%)
sc.exe start HypeGuardWorker

# 4. Verificar Status do Batimento no Event Viewer do Windows
Get-EventLog -LogName Application -Source "HypeGuardWorker" -Newest 5`;

  const getCurrentText = () => {
    if (activeSnippet === 'cs') return csharpCode;
    if (activeSnippet === 'json') return jsonConfig;
    return cmdScript;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gerador do Agente Worker Service (.NET C#)</h3>
              <p className="text-xs text-slate-400">Template C# sem Formulários ("Guerra dos Clones Finalizada"), 100% Headless</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg">
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 border-b border-slate-800 w-full pb-2">
            <button
              onClick={() => setActiveSnippet('cs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSnippet === 'cs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📄 Worker.cs (.NET 9)
            </button>
            <button
              onClick={() => setActiveSnippet('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSnippet === 'json' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚙️ appsettings.json
            </button>
            <button
              onClick={() => setActiveSnippet('cmd')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSnippet === 'cmd' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              💻 Instalação Windows (sc.exe)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
          <pre>{getCurrentText()}</pre>
        </div>

        {/* Architecture Guarantee Note */}
        <div className="bg-blue-950/40 p-3.5 rounded-xl border border-blue-800/60 text-xs text-blue-300 flex items-start space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Garantia de Invisibilidade e Execução Contínua:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Inicia automaticamente no boot do Windows antes mesmo do login do usuário. Não possui interface gráfica, prevenindo encerramentos acidentais ou maliciosos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg text-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
