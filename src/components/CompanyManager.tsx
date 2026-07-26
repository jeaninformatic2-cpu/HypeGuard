import React, { useState } from 'react';
import { Building2, Plus, Server, FolderTree, HardDrive, Mail, Phone, ShieldCheck, Trash2 } from 'lucide-react';
import { Company, AgentDevice } from '../types';

interface CompanyManagerProps {
  companies: Company[];
  devices: AgentDevice[];
  onAddCompany: (newComp: Omit<Company, 'id' | 'createdAt' | 'devicesCount' | 'totalStorageGB'>) => void;
  onDeleteCompany: (companyId: string) => void;
  onSelectCompany: (companyId: string) => void;
}

export const CompanyManager: React.FC<CompanyManagerProps> = ({
  companies,
  devices,
  onAddCompany,
  onDeleteCompany,
  onSelectCompany,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteCompany, setConfirmDeleteCompany] = useState<Company | null>(null);
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [maxStorageGB, setMaxStorageGB] = useState(5000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cnpj) return;
    onAddCompany({
      name,
      cnpj,
      contactName: contactName || 'Administrador TI',
      contactEmail: contactEmail || 'ti@empresa.com.br',
      contactPhone: contactPhone || '(11) 99999-0000',
      status: 'active',
      maxStorageGB: Number(maxStorageGB),
    });
    setName('');
    setCnpj('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Gestão Multi-Tenant de Clientes Enterprise</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize servidores, computadores e regras de backup agrupados por empresa e pastas virtuais.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Empresa Cliente</span>
        </button>
      </div>

      {/* Companies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => {
          const companyDevices = devices.filter((d) => d.companyId === company.id);
          const storagePercent = Math.round((company.totalStorageGB / (company.maxStorageGB || 1)) * 100);

          // Virtual folders breakdown
          const serversCount = companyDevices.filter(d => d.virtualFolderGroup === 'Servidores').length;
          const finCount = companyDevices.filter(d => d.virtualFolderGroup === 'Financeiro').length;
          const recCount = companyDevices.filter(d => d.virtualFolderGroup === 'Recepção').length;

          return (
            <div key={company.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>{company.name}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">CNPJ: {company.cnpj}</span>
                </div>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                  {company.status.toUpperCase()}
                </span>
              </div>

              {/* Contact Information */}
              <div className="text-xs text-slate-300 space-y-1 my-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Contato TI:</span>
                  <span className="font-semibold">{company.contactName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center space-x-1"><Mail className="w-3 h-3 mr-1 inline" />Email:</span>
                  <span className="font-mono text-slate-300">{company.contactEmail}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center space-x-1"><Phone className="w-3 h-3 mr-1 inline" />Telefone:</span>
                  <span className="font-mono text-slate-300">{company.contactPhone}</span>
                </div>
              </div>

              {/* Virtual Folders Hierarchy */}
              <div className="my-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FolderTree className="w-3.5 h-3.5 text-blue-400" />
                  <span>Agrupamento por Pastas Virtuais</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">📁 Servidores</span>
                    <span className="font-bold text-white text-sm">{serversCount}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">📁 Financeiro</span>
                    <span className="font-bold text-white text-sm">{finCount}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">📁 Recepção</span>
                    <span className="font-bold text-white text-sm">{recCount}</span>
                  </div>
                </div>
              </div>

              {/* Storage Quota Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                    <span>Cota de Backup em Nuvem/NAS:</span>
                  </span>
                  <span className="font-mono font-semibold text-slate-200">
                    {company.totalStorageGB} GB / {company.maxStorageGB} GB ({storagePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${storagePercent > 85 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, storagePercent)}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
                <button
                  onClick={() => setConfirmDeleteCompany(company)}
                  className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 hover:border-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                  title="Excluir cliente"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Excluir Cliente</span>
                </button>

                <button
                  onClick={() => onSelectCompany(company.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Filtrar Visão por {company.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteCompany && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400 border-b border-slate-800 pb-3">
              <div className="p-2 bg-rose-950 rounded-xl border border-rose-800">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirmar Exclusão de Cliente</h3>
                <p className="text-xs text-slate-400">Esta ação não pode ser desfeita.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Você está prestes a excluir a empresa <strong className="text-white">{confirmDeleteCompany.name}</strong> (CNPJ: {confirmDeleteCompany.cnpj}).
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-rose-400">O que será removido:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                <li>Cadastro do cliente e cotas de espaço</li>
                <li>Agentes RMM e tarefas de backup vinculadas</li>
                <li>Faturas e relatórios executivos gerados</li>
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmDeleteCompany(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteCompany(confirmDeleteCompany.id);
                  setConfirmDeleteCompany(null);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir Cliente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span>Cadastrar Empresa Cliente (Multi-Tenant)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Razão Social / Nome Fantasia</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Grupo Hospitalar São Lucas"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">CNPJ</label>
                <input
                  type="text"
                  required
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Responsável de TI</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome do contato"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(11) 99999-8888"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">E-mail para Alertas RMM</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alertas@empresa.com.br"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Limite do Cota de Backup (GB)</label>
                <input
                  type="number"
                  value={maxStorageGB}
                  onChange={(e) => setMaxStorageGB(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm"
                >
                  Criar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
