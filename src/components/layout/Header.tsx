/**
 * ESMERALDAS RESILIENTE 2026 - Barra Superior Institucional (Header)
 * Reloj oficial en vivo ECT, conectividad de red, cambio de rol RBAC y autenticación restringida
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { USUARIOS_INICIALES } from '../../data/seed';
import { AuthModal } from '../auth/AuthModal';
import {
  cerrarSesionInstitucional,
  verificarSesionInstitucionalActiva,
} from '../../lib/auth';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  User,
  ShieldAlert,
  ChevronDown,
  Lock,
  LogOut,
  Globe,
} from 'lucide-react';

interface HeaderProps {
  tituloVista: string;
}

export function Header({ tituloVista }: HeaderProps) {
  const {
    usuario,
    cambiarUsuario,
    online,
    setOnlineManual,
    sincronizando,
    colaOffline,
    restaurarEscenario06AM,
    mostrarToast,
  } = useApp();

  const [horaActual, setHoraActual] = useState<string>('');
  const [menuRolesAbierto, setMenuRolesAbierto] = useState(false);
  const [modalAuthAbierto, setModalAuthAbierto] = useState(false);
  const [rolModal, setRolModal] = useState<'OPERADOR_COE' | 'ADMIN'>('OPERADOR_COE');

  // Reloj en tiempo real en zona horaria America/Guayaquil (es-EC)
  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      const opciones: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Guayaquil',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const fechaOpciones: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Guayaquil',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      const horaStr = ahora.toLocaleTimeString('es-EC', opciones);
      const fechaStr = ahora.toLocaleDateString('es-EC', fechaOpciones);
      setHoraActual(`${fechaStr} · ${horaStr} ECT`);
    };

    actualizarReloj();
    const interval = setInterval(actualizarReloj, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSeleccionarRol = (rol: 'CIUDADANO' | 'OPERADOR_COE' | 'ADMIN') => {
    setMenuRolesAbierto(false);

    if (rol === 'CIUDADANO') {
      const ciudadano = USUARIOS_INICIALES.find(u => u.rol === 'CIUDADANO') || USUARIOS_INICIALES[2];
      cambiarUsuario(ciudadano);
      return;
    }

    // Verificar si ya tiene sesión activa para el rol solicitado
    const sesion = verificarSesionInstitucionalActiva();
    if (sesion.activa && sesion.rol === rol) {
      const usuarioEncontrado = USUARIOS_INICIALES.find(u => u.rol === rol);
      if (usuarioEncontrado) {
        cambiarUsuario(usuarioEncontrado);
        return;
      }
    }

    // Abrir modal de autenticación institucional
    setRolModal(rol);
    setModalAuthAbierto(true);
  };

  const handleCerrarSesion = () => {
    const usuarioCiudadano = cerrarSesionInstitucional();
    cambiarUsuario(usuarioCiudadano);
    setMenuRolesAbierto(false);
    mostrarToast('info', 'Sesión Finalizada', 'Ha regresado al portal público ciudadano.');
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full px-4 sm:px-6 py-3 bg-white border-b border-slate-200 text-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Título de la vista actual */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 tracking-tight">
            {tituloVista}
          </h2>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            El Niño 2026 · Alerta Roja
          </span>
        </div>

        {/* Controles de barra superior */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Reloj oficial en vivo */}
          <div
            title="Hora oficial de Esmeraldas, Ecuador (UTC-5)"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono-num text-slate-700"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{horaActual}</span>
          </div>

          {/* Indicador de conexión de red y cola offline */}
          <div className="flex items-center gap-1">
            {sincronizando ? (
              <div
                title="Sincronizando reportes pendientes..."
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-xs font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
                <span className="hidden sm:inline">Sincronizando...</span>
              </div>
            ) : online ? (
              <button
                onClick={() => setOnlineManual(false)}
                title="En línea (Clic para simular corte de red en territorio)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-medium transition-colors"
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">En línea</span>
              </button>
            ) : (
              <button
                onClick={() => setOnlineManual(true)}
                title="Sin conexión (Clic para restablecer conexión y sincronizar cola)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 text-red-800 text-xs font-medium animate-pulse transition-colors"
              >
                <WifiOff className="w-3.5 h-3.5 text-red-700" />
                <span className="hidden sm:inline">Sin conexión ({colaOffline.length} en cola)</span>
              </button>
            )}
          </div>

          {/* Botón Restaurar Escenario 06:00 AM */}
          <button
            onClick={() => {
              if (window.confirm('¿Desea restaurar el escenario oficial de las 06:00 AM? Todos los datos se reinicializarán a los valores oficiales.')) {
                restaurarEscenario06AM();
              }
            }}
            title="Restaurar datos oficiales al escenario Jueves 06:00 AM"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xl:inline">Reiniciar 06:00 AM</span>
          </button>

          {/* Selector de Rol y Acceso Institucional */}
          <div className="relative">
            <button
              onClick={() => setMenuRolesAbierto(!menuRolesAbierto)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-all shadow-2xs"
              title="Cambiar rol o ingresar con credenciales institucionales"
            >
              {usuario.rol === 'ADMIN' && <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />}
              {usuario.rol === 'OPERADOR_COE' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
              {usuario.rol === 'CIUDADANO' && <Globe className="w-3.5 h-3.5 text-sky-700" />}
              
              <span className="hidden sm:inline">
                {usuario.rol === 'OPERADOR_COE'
                  ? 'Operadora COE'
                  : usuario.rol === 'ADMIN'
                  ? 'Administrador'
                  : 'Portal Ciudadano'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Menú de selección de rol */}
            {menuRolesAbierto && (
              <div className="absolute right-0 mt-2 w-72 p-2 rounded-xl bg-white border border-slate-200 shadow-xl z-50 text-xs space-y-1 animate-in fade-in duration-100">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Cambiar Rol</span>
                  <span className="text-[10px] text-slate-400 font-normal">Acceso Seguro</span>
                </div>

                {/* Opción 1: Portal Ciudadano (Acceso Libre) */}
                <button
                  onClick={() => handleSeleccionarRol('CIUDADANO')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    usuario.rol === 'CIUDADANO'
                      ? 'bg-sky-50 text-sky-950 border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900">Portal Ciudadano</strong>
                      <span className="text-[10px] text-slate-500">Acceso público abierto sin clave</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    LIBRE
                  </span>
                </button>

                {/* Opción 2: Operadora COE Esmeraldas (Requiere Credenciales) */}
                <button
                  onClick={() => handleSeleccionarRol('OPERADOR_COE')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    usuario.rol === 'OPERADOR_COE'
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900">Operadora COE</strong>
                      <span className="text-[10px] text-slate-500">Despacho de emergencias</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                    CLAVE
                  </span>
                </button>

                {/* Opción 3: Administrador de Sistema (Requiere Credenciales) */}
                <button
                  onClick={() => handleSeleccionarRol('ADMIN')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    usuario.rol === 'ADMIN'
                      ? 'bg-purple-50 text-purple-950 border border-purple-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900">Administrador</strong>
                      <span className="text-[10px] text-slate-500">Gobernanza y auditoría</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                    CLAVE
                  </span>
                </button>

                {/* Botón de cerrar sesión cuando un rol autenticado está activo */}
                {usuario.rol !== 'CIUDADANO' && (
                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={handleCerrarSesion}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión Institucional</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Criptográfico de Autenticación */}
      <AuthModal
        isOpen={modalAuthAbierto}
        rolObjetivo={rolModal}
        onClose={() => setModalAuthAbierto(false)}
      />
    </>
  );
}
