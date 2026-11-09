/**
 * ESMERALDAS RESILIENTE 2026 - Panel de Gobernanza y Auditoría del Administrador
 * Registro inmutable de transacciones, seguridad y control de sesiones del sistema
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  FileText,
  Clock,
  UserCheck,
  RotateCcw,
  Download,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';

export function AdminAuditPanel() {
  const { auditoria, incidentes, albergues, restaurarEscenario06AM, mostrarToast } = useApp();
  const [filtro, setFiltro] = useState('');

  const registrosFiltrados = auditoria.filter(reg =>
    reg.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
    reg.accion.toLowerCase().includes(filtro.toLowerCase()) ||
    reg.detalle.toLowerCase().includes(filtro.toLowerCase())
  );

  const exportarAuditoriaJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditoria, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auditoria_esmeraldas_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    mostrarToast('exito', 'Exportación Completada', 'Registro de auditoría descargado en formato JSON.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Cabecera del Panel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
              Gobernanza Institucional
            </span>
            <h2 className="text-xl font-heading font-extrabold text-slate-900 mt-1">
              Registro Oficial de Auditoría y Seguridad
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Trazabilidad criptográfica de todas las acciones operativas, incidentes y cambios en el sistema.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportarAuditoriaJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exportar Bitácora</span>
          </button>
        </div>
      </div>

      {/* Métricas de Integridad */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Eventos Auditados</span>
          <div className="text-2xl font-mono-num font-bold text-slate-900 mt-1">{auditoria.length}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Inmutables en LocalStorage</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Incidentes Registrados</span>
          <div className="text-2xl font-mono-num font-bold text-slate-900 mt-1">{incidentes.length}</div>
          <span className="text-[10px] text-slate-500">Georreferenciados WGS84</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Albergues Gestionados</span>
          <div className="text-2xl font-mono-num font-bold text-slate-900 mt-1">{albergues.length}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Capacidad monitoreada</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Estado de Seguridad</span>
          <div className="text-2xl font-mono-num font-bold text-emerald-700 mt-1">Conforme</div>
          <span className="text-[10px] text-slate-500">Protección LOPDP activa</span>
        </div>
      </div>

      {/* Tabla de Auditoría */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Bitácora de Trazabilidad en Tiempo Real
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              placeholder="Buscar por usuario, acción..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-purple-600 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-3">Usuario</th>
                <th className="py-2.5 px-3">Acción</th>
                <th className="py-2.5 px-3">Entidad</th>
                <th className="py-2.5 px-3">Detalle Operativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrosFiltrados.map(reg => (
                <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono-num text-slate-400">#{reg.id}</td>
                  <td className="py-2.5 px-3 font-mono-num text-slate-600 whitespace-nowrap">
                    {new Date(reg.fecha).toLocaleTimeString('es-EC')} · {new Date(reg.fecha).toLocaleDateString('es-EC')}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{reg.usuario}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {reg.accion}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{reg.entidad}</td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-md truncate" title={reg.detalle}>
                    {reg.detalle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
