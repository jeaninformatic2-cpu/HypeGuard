import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Users,
  QrCode,
  CheckCircle2,
  Lock,
  UserCheck,
  Building2,
  ShieldAlert,
  Smartphone,
  Eye,
  Check,
  X
} from 'lucide-react';
import { UserAccount, UserRole, Company } from '../types';

interface RbacSecurityViewProps {
  users: UserAccount[];
  companies: Company[];
  currentUser: UserAccount;
  onSwitchUserRole: (user: UserAccount) => void;
  onToggle2FA: (userId: string) => void;
  onAddUserAccount: (newUser: Omit<UserAccount, 'id' | 'lastLogin'>) => void;
}

export const RbacSecurityView: React.FC<RbacSecurityViewProps> = ({
  users,
  companies,
  currentUser,
  onSwitchUserRole,
  onToggle2FA,
  onAddUserAccount,
}) => {
  const [show2FaModal, setShow2FaModal] = useState<boolean>(false);
  const [selectedUser2FA, setSelectedUser2FA] = useState<UserAccount | null>(null);
  const [totpInputCode, setTotpInputCode] = useState<string>('');
  const [totpVerifiedSuccess, setTotpVerifiedSuccess] = useState<boolean>(false);

  // New user form state
  const [showNewUserModal, setShowNewUserModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('MSP_TECHNICIAN');
  const [newUserCompanyId, setNewUserCompanyId] = useState<string>('ALL');

  const handleVerify2FACode = () => {
    if (totpInputCode.length === 6) {
      setTotpVerifiedSuccess(true);
      if (selectedUser2FA) {
        onToggle2FA(selectedUser2FA.id);
      }
      setTimeout(() => {
        setTotpVerifiedSuccess(false);
        setShow2FaModal(false);
        setSelectedUser2FA(null);
        setTotpInputCode('');
      }, 1500);
    }
  };

  const handleCreateUser = () => {
    if (!newUserName || !newUserEmail) return;
    const company = companies.find((c) => c.id === newUserCompanyId);
    const companyName = newUserCompanyId === 'ALL' ? 'Todas as Empresas' : (company?.name || 'Especificado');

    onAddUserAccount({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      companyId: newUserCompanyId,
      companyName,
      twoFactorEnabled: true,
      twoFactorSecret: 'JBSWY3DPEHPK3PXP',
      status: 'ACTIVE',
    });

    setShowNewUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-blue-400" />
                Segurança Corporativa & Deleção
              </span>
            </div>
            <h1 className="text-xl font-black text-white flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span>Controle de Acesso RBAC & Autenticação 2FA (TOTP)</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Perfis de acesso rigorosamente isolados (<strong className="text-blue-300">Master Admin</strong>, <strong className="text-blue-300">Técnico MSP</strong>, <strong className="text-blue-300">Cliente Diretoria</strong>) combinados com tokens de dupla verificação Google Authenticator/Authy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Sessão Atual</div>
              <div className="text-xs font-bold text-emerald-400 truncate max-w-[130px]">{currentUser.name}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">2FA Obrigatório</div>
              <div className="text-xs font-bold text-blue-400">ATIVADO (100%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-blue-400" />
          <span>Matriz de Permissões de Acesso por Perfil (RBAC)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5" />
                <span>MASTER ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Nível 0</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Acesso total a todos os tenants e faturamento</span>
              </li>
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Trancar e destrancar Cofres de Credenciais NAS</span>
              </li>
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Gerenciar usuários, chaves 2FA e S3 WORM</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5" />
                <span>TÉCNICO MSP (L2)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Nível 1</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Disparar backups VSS e atualizar agentes</span>
              </li>
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Rodar auto-validação de restauração DBCC</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-500">
                <X className="w-3 h-3 text-rose-500" />
                <span className="line-through">Sem acesso ao módulo de faturamento</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>CLIENTE DIRETORIA</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Nível 2</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Visualizar relatórios executivos em PDF</span>
              </li>
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Verificar faturas e pagar via Pix</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-500">
                <X className="w-3 h-3 text-rose-500" />
                <span className="line-through">Sem acesso aos servidores de outras empresas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* User Accounts Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Contas de Usuários Cadastradas</span>
            </h2>
            <p className="text-xs text-slate-400">
              Gerencie usuários, ative o 2FA via Google Authenticator e altere a sessão ativa para testar visualizações.
            </p>
          </div>

          <button
            onClick={() => setShowNewUserModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1 shadow"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Novo Usuário</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase">
                <th className="py-3 px-3">Usuário</th>
                <th className="py-3 px-3">Perfil RBAC</th>
                <th className="py-3 px-3">Empresas Acessíveis</th>
                <th className="py-3 px-3">2FA (TOTP)</th>
                <th className="py-3 px-3">Último Login</th>
                <th className="py-3 px-3 text-right">Ações de Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((user) => {
                const isSelectedCurrent = user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white flex items-center space-x-2">
                        <span>{user.name}</span>
                        {isSelectedCurrent && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-400">
                      {user.role}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {user.companyName}
                    </td>
                    <td className="py-3 px-3">
                      {user.twoFactorEnabled ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                          <Smartphone className="w-3 h-3 text-emerald-400" />
                          <span>2FA ATIVO</span>
                        </span>
                      ) : (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          <span>DESATIVADO</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(user.lastLogin).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser2FA(user);
                            setShow2FaModal(true);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded flex items-center space-x-1 border border-slate-700"
                        >
                          <QrCode className="w-3 h-3 text-blue-400" />
                          <span>Config 2FA</span>
                        </button>

                        <button
                          onClick={() => onSwitchUserRole(user)}
                          className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-semibold px-2.5 py-1 rounded transition-all"
                        >
                          Simular Sessão
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2FA Config Modal */}
      {show2FaModal && selectedUser2FA && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-base">
                <QrCode className="w-5 h-5 text-blue-400" />
                <span>Autenticação de Dois Fatores (2FA TOTP)</span>
              </div>
              <button
                onClick={() => {
                  setShow2FaModal(false);
                  setSelectedUser2FA(null);
                }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-4">
              <div>
                <div className="text-xs text-slate-400">Escaneie no Google Authenticator ou Authy:</div>
                <div className="text-sm font-bold text-white mt-0.5">{selectedUser2FA.email}</div>
              </div>

              {/* QR Code Visual Mock */}
              <div className="bg-white p-3 rounded-xl inline-block shadow-lg mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=otpauth://totp/HypeGuard:${selectedUser2FA.email}?secret=${selectedUser2FA.twoFactorSecret || 'JBSWY3DPEHPK3PXP'}&issuer=HypeGuard`}
                  alt="2FA QR Code"
                  className="w-32 h-32 mx-auto"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                Chave Manual: <span className="text-emerald-400 font-bold">{selectedUser2FA.twoFactorSecret || 'JBSWY3DPEHPK3PXP'}</span>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs text-slate-300 font-semibold block">Digite o código de 6 dígitos para validar:</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={totpInputCode}
                  onChange={(e) => setTotpInputCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-center font-mono text-lg text-emerald-400 tracking-widest p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShow2FaModal(false);
                  setSelectedUser2FA(null);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerify2FACode}
                disabled={totpInputCode.length !== 6}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar & Ativar 2FA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Account Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Cadastrar Novo Usuário RBAC</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: Ana Silva"
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ana.silva@empresa.com.br"
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Perfil de Acesso (RBAC)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                >
                  <option value="MSP_TECHNICIAN">Técnico MSP (Operação)</option>
                  <option value="CLIENT_VIEWER">Cliente Diretoria (Relatórios & Faturas)</option>
                  <option value="MASTER_ADMIN">Master Admin (Controle Total)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Empresa / Escopo</label>
                <select
                  value={newUserCompanyId}
                  onChange={(e) => setNewUserCompanyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-lg"
                >
                  <option value="ALL">Todas as Empresas (MSP Master)</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowNewUserModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
