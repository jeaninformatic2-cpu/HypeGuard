import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Terminal,
  Server,
  ShieldCheck,
  Zap,
  PlusCircle,
  Building2,
  CheckCircle2,
  Monitor,
  FolderPlus,
  Globe,
  Download,
  FileDown,
  PackageCheck,
  Laptop
} from 'lucide-react';
import { Company, AgentDevice } from '../types';

interface WorkerServiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  onAddDevice: (
    deviceData: Omit<
      AgentDevice,
      | 'id'
      | 'lastHeartbeat'
      | 'status'
      | 'cpuUsagePercent'
      | 'ramUsagePercent'
      | 'diskFreeGB'
      | 'diskTotalGB'
      | 'diskUsagePercent'
      | 'diskHealth'
      | 'vssAvailable'
      | 'credentialVaultLocked'
      | 'autoUpdatePending'
      | 'localSystemUser'
      | 'agentVersion'
    >
  ) => void;
}

export const WorkerServiceGeneratorModal: React.FC<
  WorkerServiceGeneratorModalProps
> = ({ isOpen, onClose, companies, onAddDevice }) => {
  const [activeTab, setActiveTab] = useState<'download_exe' | 'quick_add' | 'powershell' | 'source_code'>('download_exe');
  const [activeCodeSnippet, setActiveCodeSnippet] = useState<'cs' | 'json' | 'cmd'>('cs');
  const [copied, setCopied] = useState(false);
  const [createdSuccessAlert, setCreatedSuccessAlert] = useState<string | null>(null);
  const [downloadSuccessAlert, setDownloadSuccessAlert] = useState<string | null>(null);

  // Form State for Quick Add / Download
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [hostname, setHostname] = useState<string>('SRV-APP-01');
  const [osName, setOsName] = useState<string>('Windows Server 2022 Datacenter');
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.150');
  const [virtualFolderGroup, setVirtualFolderGroup] = useState<
    'Servidores' | 'Financeiro' | 'Recepção' | 'Diretoria' | 'Geral'
  >('Servidores');

  if (!isOpen) return null;

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const handleDownloadInstaller = (format: 'exe' | 'zip' | 'msi') => {
    if (!selectedCompany) return;

    // Create a dummy installer script file blob
    const content = `@echo off
:: HypeGuard RMM Agent Installer Package v2.4.1
:: Tenant: ${selectedCompany.name} (ID: ${selectedCompany.id})
echo ========================================================
echo Installing HypeGuard RMM Worker Service for ${selectedCompany.name}...
echo ========================================================
echo [1/3] Extracting binaries to C:\\Program Files\\HypeGuardAgent
echo [2/3] Registering Windows Service (LocalSystem / VSS Engine)
echo [3/3] Authenticating Tenant Token: HG-VAULT-2026-${selectedCompany.id}
echo Installation completed successfully! Agent is active.
pause`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = format === 'zip'
      ? `HypeGuard-Agent-Portable-${selectedCompany.name.replace(/\s+/g, '_')}.zip`
      : format === 'msi'
      ? `HypeGuard-Setup-${selectedCompany.name.replace(/\s+/g, '_')}.msi`
      : `HypeGuard-Setup-${selectedCompany.name.replace(/\s+/g, '_')}.exe`;

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Auto add machine to panel if desired
    onAddDevice({
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      hostname: hostname.trim() || `SRV-${selectedCompany.name.substring(0, 3).toUpperCase()}-01`,
      osName,
      ipAddress: ipAddress.trim() || '192.168.1.100',
      virtualFolderGroup,
    });

    setDownloadSuccessAlert(`Instalador "${filename}" baixado! O agente "${hostname}" foi registrado automaticamente no seu painel.`);
    setTimeout(() => {
      setDownloadSuccessAlert(null);
    }, 4000);
  };

  const handleQuickAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const company = companies.find((c) => c.id === selectedCompanyId) || companies[0];
    if (!company) return;

    onAddDevice({
      companyId: company.id,
      companyName: company.name,
      hostname: hostname.trim() || 'SRV-AGENTE-01',
      osName,
      ipAddress: ipAddress.trim() || '192.168.1.100',
      virtualFolderGroup,
    });

    setCreatedSuccessAlert(`Agente "${hostname}" cadastrado com sucesso para ${company.name}! Telemetria e backups ativos.`);
    setTimeout(() => {
      setCreatedSuccessAlert(null);
      onClose();
    }, 1800);
  };

  const powershellCommand = `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; iex ((New-Object System.Net.WebClient).DownloadString('https://hypeguard.io/install.ps1?tenant=${selectedCompany?.id || 'default'}&secret=HG-VAULT-2026'))`;

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
                    _logger.LogError(ex, "Erro durante envio de telemetria.");
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
                tenantId = "${selectedCompany?.id || 'comp_default'}",
                osName = Environment.OSVersion.ToString(),
                agentVersion = "v2.4.1-WorkerEngine",
                diskFreeGB = freeGb,
                diskTotalGB = totalGb,
                vssAvailable = true,
                vaultLocked = true,
                timestamp = DateTime.UtcNow
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            await _httpClient.PostAsync("/api/agent/heartbeat", content, ct);
        }
    }
}`;

  const jsonConfig = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "HypeGuardConfig": {
    "TenantId": "${selectedCompany?.id || 'comp_default'}",
    "CompanyName": "${selectedCompany?.name || 'Cliente'}",
    "CompanySecretKey": "HG-VAULT-2026-SECURE",
    "ApiUrl": "https://hypeguard-saas-rmm.internal/api",
    "HeartbeatIntervalSeconds": 300,
    "UseVSSApi": true,
    "CredentialVaultStorage": "DPAPI_KERNEL_LOCALSYSTEM"
  }
}`;

  const cmdScript = `# Comando de Instalação Silenciosa do Agente no Windows Server (PowerShell / CMD Admin)

# 1. Publicar o Executável .NET
dotnet publish -c Release -r win-x64 --self-contained true -o C:\\HypeGuardAgent

# 2. Criar o Serviço Windows em Nível LocalSystem
sc.exe create HypeGuardWorker binPath= "C:\\HypeGuardAgent\\HypeGuard.AgentWorker.exe" start= auto obj= "NT AUTHORITY\\SYSTEM" DisplayName= "HypeGuard Backup & Anti-Ransomware Worker"

# 3. Iniciar o Serviço
sc.exe start HypeGuardWorker`;

  const getCodeText = () => {
    if (activeCodeSnippet === 'cs') return csharpCode;
    if (activeCodeSnippet === 'json') return jsonConfig;
    return cmdScript;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <PlusCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Criar / Instalar Agente RMM</h3>
              <p className="text-xs text-slate-400">Baixe o instalador pronto ou cadastre o servidor para o cliente.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('download_exe')}
            className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'download_exe'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>1. Baixar Executável</span>
          </button>

          <button
            onClick={() => setActiveTab('quick_add')}
            className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'quick_add'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>2. Cadastro Painel</span>
          </button>

          <button
            onClick={() => setActiveTab('powershell')}
            className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'powershell'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-300" />
            <span>3. PowerShell</span>
          </button>

          <button
            onClick={() => setActiveTab('source_code')}
            className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'source_code'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-300" />
            <span>4. C# Código</span>
          </button>
        </div>

        {/* Tab 0: Download Pre-built Agent Installer (.exe / .msi) */}
        {activeTab === 'download_exe' && (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-200 flex items-start space-x-2.5">
              <PackageCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="text-white block">Agente Pré-Compilado e Pronto para Instalação</strong>
                <span>
                  O arquivo de instalação já vem pré-configurado com a chave do cliente. Basta baixar, enviar para a máquina e executar.
                </span>
              </div>
            </div>

            {/* Select Client & Hostname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Selecione a Empresa / Cliente Destino</span>
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name} (CNPJ: {comp.cnpj})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  <span>Nome do Servidor / PC do Cliente</span>
                </label>
                <input
                  type="text"
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="Ex: SRV-MATRIZ-01"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Grupo da Máquina</span>
                </label>
                <select
                  value={virtualFolderGroup}
                  onChange={(e) => setVirtualFolderGroup(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5"
                >
                  <option value="Servidores">📁 Servidores</option>
                  <option value="Financeiro">📁 Financeiro</option>
                  <option value="Diretoria">📁 Diretoria</option>
                  <option value="Recepção">📁 Recepção</option>
                  <option value="Geral">📁 Geral</option>
                </select>
              </div>
            </div>

            {/* Download Buttons Options */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-200">
                Opções de Download do Agente Prontos:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* EXE Installer */}
                <button
                  type="button"
                  onClick={() => handleDownloadInstaller('exe')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl shadow-lg border border-emerald-400/30 text-left transition-all group flex items-start space-x-3"
                >
                  <div className="p-2 bg-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
                    <FileDown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center space-x-1">
                      <span>Download Instalador (.EXE)</span>
                    </div>
                    <div className="text-[11px] text-emerald-100 opacity-90 mt-0.5">
                      Windows 10/11 e Windows Server (Auto-Install)
                    </div>
                  </div>
                </button>

                {/* MSI Package */}
                <button
                  type="button"
                  onClick={() => handleDownloadInstaller('msi')}
                  className="bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-xl border border-slate-700 text-left transition-all group flex items-start space-x-3"
                >
                  <div className="p-2 bg-blue-600/30 text-blue-400 rounded-lg group-hover:scale-105 transition-transform">
                    <Laptop className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Pacote MSI para Active Directory</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Implantação via GPO / Dominio corporativo
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {downloadSuccessAlert && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-fadeIn shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{downloadSuccessAlert}</span>
              </div>
            )}

            {/* Quick 3-Step Guide */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Passos simples para instalação no cliente:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>
                  Baixe o arquivo <code className="text-emerald-300">HypeGuard-Setup-{selectedCompany?.name || 'Cliente'}.exe</code> acima.
                </li>
                <li>
                  Copie para o computador/servidor do cliente e clique duas vezes (Executar como Administrador).
                </li>
                <li>
                  O serviço <strong className="text-white">LocalSystem</strong> será iniciado em segundo plano e a telemetria aparecerá em tempo real neste painel.
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 1: Instant Quick Add Form */}
        {activeTab === 'quick_add' && (
          <form onSubmit={handleQuickAddAgent} className="space-y-4">
            <div className="bg-blue-950/30 border border-blue-500/20 p-3.5 rounded-xl text-xs text-blue-200 flex items-start space-x-2">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Modo Simplificado:</strong> Cadastre a máquina diretamente no painel RMM. Ela iniciará imediatamente os batimentos cardíacos de telemetria e rotinas de backup.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Select Company */}
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Empresa Cliente / Tenant</span>
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                >
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name} (CNPJ: {comp.cnpj})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hostname */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nome do Servidor / Hostname</span>
                </label>
                <input
                  type="text"
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="Ex: SRV-SQL-01 ou PC-FINANCEIRO"
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* IP Address */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span>Endereço IP da Máquina</span>
                </label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="Ex: 192.168.1.150"
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Operating System */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sistema Operacional</span>
                </label>
                <select
                  value={osName}
                  onChange={(e) => setOsName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Windows Server 2025 Datacenter">Windows Server 2025 Datacenter</option>
                  <option value="Windows Server 2022 Datacenter">Windows Server 2022 Datacenter</option>
                  <option value="Windows Server 2019 Standard">Windows Server 2019 Standard</option>
                  <option value="Windows 11 Pro (x64)">Windows 11 Pro (x64)</option>
                  <option value="Linux Ubuntu Server 24.04 LTS">Linux Ubuntu Server 24.04 LTS</option>
                </select>
              </div>

              {/* Folder Group */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Grupo / Pasta Virtual</span>
                </label>
                <select
                  value={virtualFolderGroup}
                  onChange={(e) => setVirtualFolderGroup(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Servidores">📁 Servidores</option>
                  <option value="Financeiro">📁 Financeiro</option>
                  <option value="Diretoria">📁 Diretoria</option>
                  <option value="Recepção">📁 Recepção</option>
                  <option value="Geral">📁 Geral</option>
                </select>
              </div>
            </div>

            {createdSuccessAlert && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{createdSuccessAlert}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-lg flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Cadastrar Agente Agora</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: PowerShell 1-Liner Script */}
        {activeTab === 'powershell' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Selecione o Cliente para o Comando Personalizado:
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center space-x-1">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Execute no PowerShell Administrador no Servidor:</span>
                </span>
                <button
                  onClick={() => handleCopyText(powershellCommand)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-3 py-1 rounded-lg flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Comando'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 break-all leading-relaxed">
                {powershellCommand}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>O que este comando faz automaticamente:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Baixa a versão compilada do Worker Service C# em nível LocalSystem</li>
                <li>Registra o serviço <code className="text-blue-300">HypeGuardWorker</code> com startup automático</li>
                <li>Conecta diretamente a tenant <strong className="text-white">{selectedCompany.name}</strong></li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: C# Developer Source Code */}
        {activeTab === 'source_code' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveCodeSnippet('cs')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    activeCodeSnippet === 'cs' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  📄 Worker.cs (.NET 9)
                </button>
                <button
                  onClick={() => setActiveCodeSnippet('json')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    activeCodeSnippet === 'json' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  ⚙️ appsettings.json
                </button>
                <button
                  onClick={() => setActiveCodeSnippet('cmd')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    activeCodeSnippet === 'cmd' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  💻 sc.exe Install Script
                </button>
              </div>

              <button
                onClick={() => handleCopyText(getCodeText())}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-700 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
              <pre>{getCodeText()}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

