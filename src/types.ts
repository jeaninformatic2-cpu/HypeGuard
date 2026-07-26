export type DeviceStatus = 'online' | 'offline' | 'warning' | 'backup_in_progress';
export type DiskHealth = 'HEALTHY' | 'WARNING' | 'CRITICAL';
export type JobStatus = 'SUCCESS' | 'WARNING' | 'FAILED' | 'RUNNING' | 'PENDING';
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface SurgicalLog {
  code: string;
  message: string;
  osDetail: string;
  level: 'info' | 'warning' | 'error';
  timestamp: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'suspended' | 'trial';
  devicesCount: number;
  totalStorageGB: number;
  maxStorageGB: number;
  createdAt: string;
}

export interface AgentDevice {
  id: string;
  companyId: string;
  companyName: string;
  hostname: string;
  osName: string; // e.g. "Windows Server 2022 Datacenter", "Windows 11 Pro"
  ipAddress: string;
  agentVersion: string;
  status: DeviceStatus;
  lastHeartbeat: string;
  cpuUsagePercent: number;
  ramUsagePercent: number;
  diskFreeGB: number;
  diskTotalGB: number;
  diskUsagePercent: number;
  diskHealth: DiskHealth;
  vssAvailable: boolean;
  credentialVaultLocked: boolean;
  autoUpdatePending: boolean;
  localSystemUser: string;
  virtualFolderGroup: 'Servidores' | 'Financeiro' | 'Recepção' | 'Diretoria' | 'Geral';
}

export interface RetentionPolicy {
  companyId: string;
  dailyKeep: number;    // e.g. 7
  weeklyKeep: number;   // e.g. 4
  monthlyKeep: number;  // e.g. 12
  autoCleanupEnabled: boolean;
  pruneThresholdDiskPercent: number; // e.g. 90%
}

export interface BackupJob {
  id: string;
  deviceId: string;
  hostname: string;
  companyId: string;
  companyName: string;
  jobName: string;
  jobType: 'VSS_FULL' | 'SQL_DATABASE' | 'ERP_FILES' | 'VSS_DIFFERENTIAL';
  destinationPath: string; // e.g. "\\NAS_ISOLATED\Backups_JC$"
  scheduleCron: string;    // e.g. "Diário às 22:00"
  status: JobStatus;
  lastRunTimestamp: string;
  durationSeconds: number;
  transferredBytesMB: number;
  vssSnapshotCreated: boolean;
  vaultSessionClosedAfterRun: boolean;
  surgicalLog?: SurgicalLog;
}

export interface AlertNotification {
  id: string;
  companyId: string;
  companyName: string;
  deviceId?: string;
  hostname?: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  companyName: string;
  details: string;
}

export interface AiLogDiagnosis {
  diagnosisSummary: string;
  ransomwareRiskImpact: string;
  remediationSteps: string[];
  recommendedActionCode: 'RESTART_VSS_SERVICE' | 'FREE_UP_SPACE' | 'REGENERATE_VAULT_CREDENTIALS' | 'CHECK_NETWORK';
}

// 1. Auto-Validação de Restauração (Sandbox Restore Testing)
export interface RestoreValidationTest {
  id: string;
  jobId: string;
  companyName: string;
  hostname: string;
  testedAt: string;
  sandboxEnvironment: 'Sandbox Isolated SQL Instance' | 'VSS Virtual Mount Check' | 'Hyper-V Sandbox VM Boot' | 'Checksum SHA-256 Sector Audit';
  dbccCheckDbResult: string;
  checksumMatch: boolean;
  status: 'PASSED' | 'FAILED' | 'RUNNING';
  executionTimeMs: number;
  certificateHash: string;
}

// 2. Nuvem Imutável (S3 Object Lock - WORM)
export interface S3ObjectLockConfig {
  companyId: string;
  companyName: string;
  bucketName: string;
  provider: 'AWS S3' | 'Wasabi Cloud' | 'MinIO Enterprise' | 'Cloudflare R2';
  wormMode: 'COMPLIANCE' | 'GOVERNANCE';
  retentionDays: number;
  legalHold: boolean;
  totalLockedObjects: number;
  totalLockedBytesGB: number;
  lastDeletionAttemptPrevented: string | null;
}

// 3. Motor de Faturamento (Billing & Metering)
export interface TenantInvoice {
  id: string;
  companyId: string;
  companyName: string;
  period: string; // e.g. "Julho / 2026"
  gbUsed: number;
  agentsCount: number;
  gbUnitPriceBRL: number;
  agentUnitPriceBRL: number;
  totalAmountBRL: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'SUSPENDED';
  paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  paymentDate?: string;
}

// 4. Relatórios Executivos (White-Label)
export interface WhiteLabelConfig {
  mspName: string;
  mspLogoUrl: string;
  primaryColorHex: string;
  supportEmail: string;
  customDomain: string;
  autoMonthlyEmail: boolean;
  reportRecipients: string[];
}

export interface ExecutiveReport {
  id: string;
  companyId: string;
  companyName: string;
  period: string;
  generatedAt: string;
  backupSuccessRate: number;
  dataProtectedGB: number;
  restoreTestsPassed: number;
  threatsBlockedCount: number;
  complianceScore: number;
  downloadUrl?: string;
}

// 5. RBAC e Autenticação 2FA
export type UserRole = 'MASTER_ADMIN' | 'MSP_TECHNICIAN' | 'CLIENT_VIEWER';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string; // 'ALL' or specific companyId
  companyName: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  lastLogin: string;
  status: 'ACTIVE' | 'DISABLED';
}

