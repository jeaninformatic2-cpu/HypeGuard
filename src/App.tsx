import React, { useState, useEffect } from 'react';
import {
  Company,
  AgentDevice,
  BackupJob,
  RetentionPolicy,
  AlertNotification,
  AuditLog,
  RestoreValidationTest,
  S3ObjectLockConfig,
  TenantInvoice,
  WhiteLabelConfig,
  ExecutiveReport,
  UserAccount
} from './types';
import {
  INITIAL_COMPANIES,
  INITIAL_DEVICES,
  INITIAL_JOBS,
  INITIAL_RETENTION_POLICIES,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RESTORE_TESTS,
  INITIAL_S3_LOCKS,
  INITIAL_INVOICES,
  INITIAL_WHITE_LABEL,
  INITIAL_EXECUTIVE_REPORTS,
  INITIAL_USER_ACCOUNTS
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { CompanyManager } from './components/CompanyManager';
import { AgentTelemetryView } from './components/AgentTelemetryView';
import { BackupJobsAndLogs } from './components/BackupJobsAndLogs';
import { RetentionPolicyManager } from './components/RetentionPolicyManager';
import { CredentialVaultView } from './components/CredentialVaultView';
import { AuditLogView } from './components/AuditLogView';
import { WorkerServiceGeneratorModal } from './components/WorkerServiceGeneratorModal';

import { RestoreValidationView } from './components/RestoreValidationView';
import { S3ObjectLockView } from './components/S3ObjectLockView';
import { BillingManagerView } from './components/BillingManagerView';
import { ExecutiveReportsView } from './components/ExecutiveReportsView';
import { RbacSecurityView } from './components/RbacSecurityView';

export default function App() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [devices, setDevices] = useState<AgentDevice[]>(INITIAL_DEVICES);
  const [jobs, setJobs] = useState<BackupJob[]>(INITIAL_JOBS);
  const [retentionPolicies, setRetentionPolicies] = useState<Record<string, RetentionPolicy>>(INITIAL_RETENTION_POLICIES);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // 5 New Enterprise Feature States
  const [restoreTests, setRestoreTests] = useState<RestoreValidationTest[]>(INITIAL_RESTORE_TESTS);
  const [s3Locks, setS3Locks] = useState<S3ObjectLockConfig[]>(INITIAL_S3_LOCKS);
  const [invoices, setInvoices] = useState<TenantInvoice[]>(INITIAL_INVOICES);
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig>(INITIAL_WHITE_LABEL);
  const [executiveReports, setExecutiveReports] = useState<ExecutiveReport[]>(INITIAL_EXECUTIVE_REPORTS);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USER_ACCOUNTS[0]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastHeartbeatTime, setLastHeartbeatTime] = useState<string>(new Date().toISOString());
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);

  // Periodic Heartbeat Simulation effect (simulates 5-minute RMM pulses)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setLastHeartbeatTime(new Date().toISOString());

      // Update heartbeats for online devices
      setDevices((prev) =>
        prev.map((d) => {
          if (d.status === 'offline') return d;
          return {
            ...d,
            lastHeartbeat: new Date().toISOString(),
            cpuUsagePercent: Math.floor(Math.random() * 35) + 10,
            ramUsagePercent: Math.floor(Math.random() * 20) + 60,
          };
        })
      );
    }, 10000); // Pulse visual update every 10s for interactive preview

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Action: Add New Company Tenant
  const handleAddCompany = (newComp: Omit<Company, 'id' | 'createdAt' | 'devicesCount' | 'totalStorageGB'>) => {
    const id = `comp_${Date.now()}`;
    const created: Company = {
      ...newComp,
      id,
      devicesCount: 0,
      totalStorageGB: 0,
      createdAt: new Date().toISOString(),
    };

    setCompanies((prev) => [created, ...prev]);

    // Add default retention policy
    setRetentionPolicies((prev) => ({
      ...prev,
      [id]: {
        companyId: id,
        dailyKeep: 7,
        weeklyKeep: 4,
        monthlyKeep: 12,
        autoCleanupEnabled: true,
        pruneThresholdDiskPercent: 90,
      },
    }));

    // Add default invoice
    setInvoices((prev) => [
      {
        id: `inv_${Date.now()}`,
        companyId: id,
        companyName: created.name,
        period: 'Julho / 2026',
        gbUsed: 0,
        agentsCount: 0,
        gbUnitPriceBRL: 0.15,
        agentUnitPriceBRL: 25.0,
        totalAmountBRL: 0,
        dueDate: '2026-08-10',
        status: 'PENDING',
      },
      ...prev,
    ]);

    // Add S3 Lock config
    setS3Locks((prev) => [
      {
        companyId: id,
        companyName: created.name,
        bucketName: `hypeguard-worm-${id}`,
        provider: 'AWS S3',
        wormMode: 'COMPLIANCE',
        retentionDays: 30,
        legalHold: false,
        totalLockedObjects: 0,
        totalLockedBytesGB: 0,
        lastDeletionAttemptPrevented: null,
      },
      ...prev,
    ]);

    // Audit log
    addAuditLog('Empresa Cadastrada', created.name, `Novo cliente cadastrado com cota de ${created.maxStorageGB} GB.`);
  };

  // Action: Delete Company Tenant
  const handleDeleteCompany = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    if (!company) return;

    setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    setDevices((prev) => prev.filter((d) => d.companyId !== companyId));
    setJobs((prev) => prev.filter((j) => j.companyId !== companyId));
    setInvoices((prev) => prev.filter((i) => i.companyId !== companyId));
    setS3Locks((prev) => prev.filter((s) => s.companyId !== companyId));
    setExecutiveReports((prev) => prev.filter((r) => r.companyId !== companyId));

    if (selectedCompanyId === companyId) {
      setSelectedCompanyId('ALL');
    }

    addAuditLog(
      'Exclusão de Empresa Cliente',
      company.name,
      'Cliente e todos os seus agentes, rotinas e faturas foram excluídos do sistema.'
    );
  };

  // Helper: Add Audit Log
  const addAuditLog = (action: string, companyName: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: currentUser.email,
      action,
      companyName,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Action: Trigger Sandbox Restore Verification Test
  const handleRunSandboxRestoreTest = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const newTest: RestoreValidationTest = {
      id: `rst_${Date.now()}`,
      jobId: job.id,
      companyName: job.companyName,
      hostname: job.hostname,
      testedAt: new Date().toISOString(),
      sandboxEnvironment: 'Sandbox Isolated SQL Instance',
      dbccCheckDbResult: 'DBCC CHECKDB: 0 allocation errors and 0 consistency errors found.',
      checksumMatch: true,
      status: 'PASSED',
      executionTimeMs: 12400,
      certificateHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}A1B2C3D4`,
    };

    setRestoreTests((prev) => [newTest, ...prev]);
    addAuditLog('Auto-Validação DBCC Sandbox Executada', job.companyName, `Cópia do servidor ${job.hostname} montada em sandbox e validada 100% íntegra sem corrupção.`);
  };

  // Action: Toggle S3 Legal Hold
  const handleToggleLegalHold = (companyId: string) => {
    setS3Locks((prev) =>
      prev.map((s3) => {
        if (s3.companyId === companyId) {
          const nextHold = !s3.legalHold;
          addAuditLog('Alteração S3 Object Lock Legal Hold', s3.companyName, `Trava jurídica WORM alterada para ${nextHold ? 'ATIVADA' : 'DESATIVADA'}.`);
          return { ...s3, legalHold: nextHold };
        }
        return s3;
      })
    );
  };

  // Action: Update S3 Retention Days
  const handleUpdateS3RetentionDays = (companyId: string, days: number) => {
    setS3Locks((prev) =>
      prev.map((s3) => {
        if (s3.companyId === companyId) {
          addAuditLog('Ajuste Trava Imutável WORM S3', s3.companyName, `Período de imutabilidade estendido para ${days} dias.`);
          return { ...s3, retentionDays: days };
        }
        return s3;
      })
    );
  };

  // Action: Invoice Marked as Paid
  const handleMarkInvoiceAsPaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          addAuditLog('Fatura Paga via Pix Gateway', inv.companyName, `Fatura do período ${inv.period} de R$ ${inv.totalAmountBRL} quitada.`);
          return {
            ...inv,
            status: 'PAID',
            paymentMethod: 'PIX',
            paymentDate: new Date().toISOString(),
          };
        }
        return inv;
      })
    );
  };

  // Action: Toggle Company Suspension (Delinquent Tenant Block)
  const handleToggleCompanySuspension = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const isSuspendedNow = c.status === 'suspended';
          const nextStatus = isSuspendedNow ? 'active' : 'suspended';
          addAuditLog(
            isSuspendedNow ? 'Cliente Reativado Financeiramente' : 'Bloqueio Automático de Inadimplência',
            c.name,
            isSuspendedNow ? 'Acesso e execução dos agentes liberados.' : 'Execução de backups paralisada devido a atraso de pagamento.'
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Action: Trigger Heartbeats for all agents
  const handleTriggerHeartbeats = () => {
    const now = new Date().toISOString();
    setLastHeartbeatTime(now);
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        status: d.status === 'offline' ? 'online' : d.status,
        lastHeartbeat: now,
      }))
    );
    addAuditLog('Solicitação de Heartbeat Global', 'Todas as Empresas', 'Forçado pedido de pulso RMM para todos os Worker Services.');
  };

  // Action: Lock Vaults on All Machines
  const handleForceVaultLockAll = () => {
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        credentialVaultLocked: true,
      }))
    );
    addAuditLog('Bloqueio Global de Cofres NAS', 'Todas as Empresas', 'Todas as sessões de rede para compartilhamentos NAS foram trancadas.');
  };

  // Action: Toggle Single Device Vault Lock
  const handleToggleVaultLock = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const nextState = !d.credentialVaultLocked;
          addAuditLog(
            nextState ? 'Cofre NAS Trancado' : 'Sessão NAS Aberta para Cópia',
            d.companyName,
            `Alterado estado do cofre no servidor ${d.hostname}.`
          );
          return { ...d, credentialVaultLocked: nextState };
        }
        return d;
      })
    );
  };

  // Action: Remote Agent Auto-Update
  const handleTriggerAgentUpdate = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          addAuditLog('Atualização Remota do Agente', d.companyName, `Agente no servidor ${d.hostname} atualizado com sucesso para v2.4.1-WorkerEngine.`);
          return {
            ...d,
            agentVersion: 'v2.4.1-WorkerEngine',
            autoUpdatePending: false,
          };
        }
        return d;
      })
    );
  };

  // Action: Run VSS Backup Job Now
  const handleRunBackupNow = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const now = new Date().toISOString();
          const updatedJob: BackupJob = {
            ...j,
            status: 'SUCCESS',
            lastRunTimestamp: now,
            vssSnapshotCreated: true,
            vaultSessionClosedAfterRun: true,
            surgicalLog: {
              code: '0x00000000',
              message: 'Execução manual VSS concluída com sucesso sem bloqueio de arquivos.',
              osDetail: '[VSS_SUCCESS] Volume Shadow Copy Provider montou o snapshot e trancou o cofre de credenciais em seguida.',
              level: 'info',
              timestamp: now,
            },
          };
          addAuditLog('Disparo de Backup VSS', j.companyName, `Backup ${j.jobName} no servidor ${j.hostname} concluído.`);
          return updatedJob;
        }
        return j;
      })
    );
  };

  // Action: Test VSS Snapshot
  const handleTestVSSSnapshot = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    addAuditLog('Teste de Snapshot VSS', job.companyName, `Montado volume de sombra VSS em tempo de execução para ${job.hostname}.`);
  };

  // Action: Trigger 3-2-1 Retention Auto-Cleanup
  const handleTriggerAutoCleanup = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    if (!company) return;

    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const freedGB = Math.floor(Math.random() * 80) + 40;
          return {
            ...c,
            totalStorageGB: Math.max(100, c.totalStorageGB - freedGB),
          };
        }
        return c;
      })
    );

    addAuditLog(
      'Lixeiro Cirúrgico 3-2-1 Executado',
      company.name,
      'Regra de retenção matemática expurgou backups diários antigos e liberou espaço no HD.'
    );
  };

  const unreadAlertsCount = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={setSelectedCompanyId}
        unreadAlertsCount={unreadAlertsCount}
        onOpenAlerts={() => setShowAlertsDropdown(!showAlertsDropdown)}
        onOpenGenerator={() => setShowGeneratorModal(true)}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        lastHeartbeatTime={lastHeartbeatTime}
      />

      {/* Main App Layout: Sidebar + Main Content View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeAlertsCount={unreadAlertsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* View Tab Router */}
          {activeTab === 'overview' && (
            <DashboardOverview
              companies={companies}
              devices={devices}
              jobs={jobs}
              alerts={alerts}
              selectedCompanyId={selectedCompanyId}
              onRunBackupNow={handleRunBackupNow}
              onForceVaultLockAll={handleForceVaultLockAll}
              onTriggerHeartbeats={handleTriggerHeartbeats}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'restore_validation' && (
            <RestoreValidationView
              tests={restoreTests}
              jobs={selectedCompanyId === 'ALL' ? jobs : jobs.filter(j => j.companyId === selectedCompanyId)}
              onRunSandboxTest={handleRunSandboxRestoreTest}
            />
          )}

          {activeTab === 's3_lock' && (
            <S3ObjectLockView
              s3Configs={selectedCompanyId === 'ALL' ? s3Locks : s3Locks.filter(s => s.companyId === selectedCompanyId)}
              onToggleLegalHold={handleToggleLegalHold}
              onUpdateRetentionDays={handleUpdateS3RetentionDays}
            />
          )}

          {activeTab === 'billing' && (
            <BillingManagerView
              invoices={selectedCompanyId === 'ALL' ? invoices : invoices.filter(i => i.companyId === selectedCompanyId)}
              companies={companies}
              onMarkAsPaid={handleMarkInvoiceAsPaid}
              onToggleCompanySuspension={handleToggleCompanySuspension}
            />
          )}

          {activeTab === 'reports' && (
            <ExecutiveReportsView
              whiteLabelConfig={whiteLabelConfig}
              executiveReports={selectedCompanyId === 'ALL' ? executiveReports : executiveReports.filter(r => r.companyId === selectedCompanyId)}
              companies={companies}
              onUpdateWhiteLabel={setWhiteLabelConfig}
              onGenerateReport={(comp: string) => {
                addAuditLog('Relatório Executivo Gerado', comp, 'Gerado documento PDF com métricas e logotipo White-Label.');
              }}
            />
          )}

          {activeTab === 'rbac_security' && (
            <RbacSecurityView
              users={userAccounts}
              companies={companies}
              currentUser={currentUser}
              onSwitchUserRole={(user: UserAccount) => {
                setCurrentUser(user);
                addAuditLog('Sessão Alterada', user.companyName, `Sessão alterada para o usuário ${user.name} (${user.role}).`);
              }}
              onToggle2FA={(userId: string) => {
                setUserAccounts((prev) =>
                  prev.map((u) => (u.id === userId ? { ...u, twoFactorEnabled: !u.twoFactorEnabled } : u))
                );
              }}
              onAddUserAccount={(newUser) => {
                const created: UserAccount = {
                  ...newUser,
                  id: `usr_${Date.now()}`,
                  lastLogin: new Date().toISOString(),
                };
                setUserAccounts((prev) => [...prev, created]);
                addAuditLog('Usuário RBAC Cadastrado', created.companyName, `Novo perfil ${created.role} atribuído a ${created.name}.`);
              }}
            />
          )}

          {activeTab === 'companies' && (
            <CompanyManager
              companies={companies}
              devices={devices}
              onAddCompany={handleAddCompany}
              onDeleteCompany={handleDeleteCompany}
              onSelectCompany={(id) => {
                setSelectedCompanyId(id);
                setActiveTab('overview');
              }}
            />
          )}

          {activeTab === 'agents' && (
            <AgentTelemetryView
              devices={selectedCompanyId === 'ALL' ? devices : devices.filter(d => d.companyId === selectedCompanyId)}
              onTriggerAgentUpdate={handleTriggerAgentUpdate}
              onTriggerSingleHeartbeat={(id) => {
                setDevices(prev => prev.map(d => d.id === id ? { ...d, lastHeartbeat: new Date().toISOString(), status: 'online' } : d));
              }}
              onToggleVaultLock={handleToggleVaultLock}
            />
          )}

          {activeTab === 'jobs' && (
            <BackupJobsAndLogs
              jobs={selectedCompanyId === 'ALL' ? jobs : jobs.filter(j => j.companyId === selectedCompanyId)}
              onRunBackupNow={handleRunBackupNow}
              onTestVSSSnapshot={handleTestVSSSnapshot}
            />
          )}

          {activeTab === 'retention' && (
            <RetentionPolicyManager
              companies={companies}
              retentionPolicies={retentionPolicies}
              onUpdatePolicy={(id, policy) => setRetentionPolicies(prev => ({ ...prev, [id]: policy }))}
              onTriggerAutoCleanup={handleTriggerAutoCleanup}
            />
          )}

          {activeTab === 'vault' && (
            <CredentialVaultView
              devices={selectedCompanyId === 'ALL' ? devices : devices.filter(d => d.companyId === selectedCompanyId)}
              onToggleVaultLock={handleToggleVaultLock}
              onForceVaultLockAll={handleForceVaultLockAll}
            />
          )}

          {activeTab === 'generator' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white">Gerador do Agente Worker Service C#</h2>
              <p className="text-xs text-slate-400">
                Acesse o modal completo para copiar os templates C# .NET 9 do serviço invisível, o arquivo appsettings.json e as instruções de instalação do Windows Service.
              </p>
              <button
                onClick={() => setShowGeneratorModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Abrir Modal de Instalação do Agente
              </button>
            </div>
          )}

          {activeTab === 'audit' && (
            <AuditLogView logs={auditLogs} />
          )}

        </main>
      </div>

      {/* C# Worker Service Generator Modal */}
      <WorkerServiceGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
      />

    </div>
  );
}

