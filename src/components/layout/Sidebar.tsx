/**
 * ESMERALDAS RESILIENTE 2026 - Barra Lateral Institucional (Sidebar)
 * Paleta verde bosque esmeraldeño del Escudo de Esmeraldas y navegación adaptativa RBAC
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Map,
  ShieldCheck,
  ShieldAlert,
  User,
  Globe,
  FileText,
  Lock,
} from 'lucide-react';

export type ModuloId = 'bienvenida' | 'ciudadano' | 'mapa' | 'auditoria';

interface SidebarProps {
  moduloActivo: ModuloId;
  onCambiarModulo: (modulo: ModuloId) => void;
}

export function Sidebar({ moduloActivo, onCambiarModulo }: SidebarProps) {
  const { usuario } = useApp();

  // Menú dinámico según el rol institucional
  const obtenerItemsMenu = () => {
    const itemBienvenida = {
      id: 'bienvenida' as ModuloId,
      nombre: 'Inicio y Orientación',
      subtitulo: 'Centro de acceso institucional',
      icono: <Globe className="w-5 h-5 text-amber-300" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#022c22] text-amber-300 border border-amber-500/30">
          Inicio
        </span>
      ),
    };

    if (usuario.rol === 'CIUDADANO') {
      return [
        itemBienvenida,
        {
          id: 'ciudadano' as ModuloId,
          nombre: 'Portal Ciudadano',
          subtitulo: 'Información y prevención',
          icono: <Globe className="w-5 h-5" />,
          badge: (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-900 text-sky-200 border border-sky-500/30">
              Público
            </span>
          ),
        },
      ];
    }

    if (usuario.rol === 'OPERADOR_COE') {
      return [
        itemBienvenida,
        {
          id: 'mapa' as ModuloId,
          nombre: 'Visor SIG de Riesgos',
          subtitulo: 'Monitoreo territorial en vivo',
          icono: <Map className="w-5 h-5" />,
          badge: (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-500/30">
              Operativo
            </span>
          ),
        },
      ];
    }

    // Rol ADMIN
    return [
      itemBienvenida,
      {
        id: 'mapa' as ModuloId,
        nombre: 'Visor SIG de Riesgos',
        subtitulo: 'Monitoreo territorial en vivo',
        icono: <Map className="w-5 h-5" />,
        badge: (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-500/30">
            Operativo
          </span>
        ),
      },
      {
        id: 'auditoria' as ModuloId,
        nombre: 'Bitácora de Auditoría',
        subtitulo: 'Trazabilidad y gobernanza',
        icono: <FileText className="w-5 h-5" />,
        badge: (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-900 text-purple-200 border border-purple-500/30">
            Admin
          </span>
        ),
      },
    ];
  };

  const menuItems = obtenerItemsMenu();

  return (
    <aside className="w-64 bg-[#064e3b] border-r border-[#065f46] text-white flex flex-col shrink-0 min-h-screen shadow-lg">
      {/* Cabecera Institucional: Inspirada en el Escudo de Esmeraldas */}
      <div className="p-5 border-b border-[#047857]/60">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 rounded-xl bg-[#022c22] border border-[#059669]/50 text-emerald-300 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base tracking-tight titulo-gradiente-blanco">
              ESMERALDAS
            </h1>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="text-xs font-bold text-emerald-100 tracking-wider">RESILIENTE</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-num font-bold bg-amber-400 text-slate-950">
                2026
              </span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-emerald-200/90 font-medium italic mt-2 leading-relaxed">
          «Programar hoy para proteger vidas mañana»
        </p>
        <div className="mt-2.5 text-[10px] text-emerald-300/80 flex items-center justify-between border-t border-[#047857]/60 pt-2">
          <span>Municipio de Esmeraldas</span>
          <span className="text-amber-300 font-semibold">Gestión de Riesgos</span>
        </div>
      </div>

      {/* Navegación por Módulos */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-emerald-300/70 uppercase tracking-wider flex items-center justify-between">
          <span>{usuario.rol === 'CIUDADANO' ? 'Módulo Ciudadano' : 'Módulos Habilitados'}</span>
          {usuario.rol !== 'CIUDADANO' && (
            <span className="text-[9px] px-1 rounded bg-[#022c22] text-emerald-300 border border-emerald-500/30">
              Seguro
            </span>
          )}
        </div>
        {menuItems.map(item => {
          const activo = moduloActivo === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onCambiarModulo(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-all ${
                activo
                  ? 'bg-[#047857] text-white border border-emerald-300/40 shadow-sm font-semibold'
                  : 'text-emerald-100/90 hover:bg-[#065f46]/70 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={activo ? 'text-white' : 'text-emerald-300'}>{item.icono}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-xs leading-tight truncate">{item.nombre}</div>
                  <div className={`text-[10px] leading-tight truncate ${activo ? 'text-emerald-100' : 'text-emerald-300/80'}`}>
                    {item.subtitulo}
                  </div>
                </div>
              </div>
              {item.badge}
            </button>
          );
        })}
      </nav>

      {/* Tarjeta de usuario en sesión activa */}
      <div className="p-3 border-t border-[#047857]/60 bg-[#022c22]/50">
        <div className="p-2.5 rounded-xl bg-[#022c22] border border-[#065f46] flex items-center gap-2.5 shadow-xs">
          <div className="p-2 rounded-lg bg-[#064e3b] text-emerald-300 shrink-0 border border-[#047857]">
            {usuario.rol === 'ADMIN' && <ShieldAlert className="w-4 h-4 text-purple-300" />}
            {usuario.rol === 'OPERADOR_COE' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            {usuario.rol === 'CIUDADANO' && <Globe className="w-4 h-4 text-sky-300" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-xs text-white truncate">{usuario.nombre}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-emerald-200 truncate">
                {usuario.rol === 'OPERADOR_COE'
                  ? 'Operador Oficial'
                  : usuario.rol === 'ADMIN'
                  ? 'Administrador'
                  : 'Acceso Público'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
