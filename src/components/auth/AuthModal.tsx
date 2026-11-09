/**
 * ESMERALDAS RESILIENTE 2026 - Modal de Autenticación Institucional
 * Acceso seguro y restringido para Operadores COE y Administradores de Sistema
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { autenticarInstitucional } from '../../lib/auth';
import { RolUsuario } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  rolObjetivo: 'OPERADOR_COE' | 'ADMIN';
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ rolObjetivo, isOpen, onClose }: AuthModalProps) {
  const { cambiarUsuario, mostrarToast } = useApp();

  const [identificador, setIdentificador] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const esAdmin = rolObjetivo === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const resultado = await autenticarInstitucional(identificador, clave);

      if (resultado.exito && resultado.usuario) {
        cambiarUsuario(resultado.usuario);
        mostrarToast('exito', 'Acceso Concedido', resultado.mensaje);
        setIdentificador('');
        setClave('');
        onClose();
      } else {
        setError(resultado.mensaje);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al validar las credenciales.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera Institucional */}
        <div className={`p-5 text-white ${esAdmin ? 'bg-slate-900 border-b border-slate-800' : 'bg-[#064e3b] border-b border-[#047857]'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${esAdmin ? 'bg-slate-800 text-purple-400 border border-purple-500/30' : 'bg-[#022c22] text-emerald-300 border border-emerald-500/30'}`}>
                {esAdmin ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[10px] font-mono-num uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                  Acceso Restringido
                </span>
                <h3 className="text-base font-heading font-extrabold text-white mt-1">
                  {esAdmin ? 'Administración del Sistema' : 'Operaciones COE Esmeraldas'}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-white/80 mt-2 leading-relaxed">
            {esAdmin
              ? 'Panel de gobernanza, auditoría y control integral de la plataforma institucional.'
              : 'Sala de crisis y despacho de emergencias del cantón Esmeraldas ante El Niño 2026.'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Identificación o Correo Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                required
                value={identificador}
                onChange={e => setIdentificador(e.target.value)}
                placeholder={esAdmin ? 'admin@esmeraldas.gob.ec' : 'operador.coe@esmeraldas.gob.ec'}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ingrese su correo o usuario oficial asignado.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Clave Institucional de Seguridad
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={mostrarClave ? 'text' : 'password'}
                required
                value={clave}
                onChange={e => setClave(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarClave(!mostrarClave)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                title={mostrarClave ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {mostrarClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Verificación criptográfica segura SHA-256.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-2 ${
                esAdmin
                  ? 'bg-purple-900 hover:bg-purple-950 active:scale-95'
                  : 'bg-[#047857] hover:bg-[#065f46] active:scale-95'
              } ${cargando ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {cargando ? (
                <span>Validando...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Autenticar e Ingresar</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Pie con advertencia de seguridad institucional */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center">
          Uso oficial exclusivo. Toda acción queda registrada con marca temporal en el Registro de Auditoría.
        </div>
      </div>
    </div>
  );
}
