/**
 * ESMERALDAS RESILIENTE 2026 - Vista Independiente de Bienvenida y Orientación Institucional
 * Plataforma cívica orientada tanto a la ciudadanía esmeraldeña como a las autoridades cantonales.
 * Cero emojis: iconografía vectorial SVG oficial con Lucide.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModuloId } from '../layout/Sidebar';
import { AuthModal } from '../auth/AuthModal';
import {
  verificarSesionInstitucionalActiva,
} from '../../lib/auth';
import { USUARIOS_INICIALES } from '../../data/seed';
import {
  ShieldCheck,
  ShieldAlert,
  Globe,
  MapPin,
  Radio,
  PhoneCall,
  Lock,
  ArrowRight,
  Compass,
  Layers,
  HeartHandshake,
  FileCheck2,
  AlertTriangle,
  Building2,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Waves,
  Eye,
  BookOpen,
} from 'lucide-react';

interface InstitutionalWelcomeViewProps {
  onNavegarModulo: (modulo: ModuloId) => void;
}

export function InstitutionalWelcomeView({ onNavegarModulo }: InstitutionalWelcomeViewProps) {
  const { usuario, cambiarUsuario, albergues, incidentes } = useApp();

  const [modalAuthAbierto, setModalAuthAbierto] = useState(false);
  const [rolObjetivoModal, setRolObjetivoModal] = useState<'OPERADOR_COE' | 'ADMIN'>('OPERADOR_COE');
  const [pestanaInfo, setPestanaInfo] = useState<'ciudadania' | 'autoridades' | 'tecnologia'>('ciudadania');

  // Manejar acceso según perfil seleccionado
  const handleAccesoCiudadano = () => {
    const usuarioCiudadano = USUARIOS_INICIALES.find(u => u.rol === 'CIUDADANO') || USUARIOS_INICIALES[2];
    cambiarUsuario(usuarioCiudadano);
    onNavegarModulo('ciudadano');
  };

  const handleAccesoCOE = () => {
    const sesion = verificarSesionInstitucionalActiva();
    if (sesion.activa && sesion.rol === 'OPERADOR_COE') {
      const usuarioCOE = USUARIOS_INICIALES.find(u => u.rol === 'OPERADOR_COE') || USUARIOS_INICIALES[1];
      cambiarUsuario(usuarioCOE);
      onNavegarModulo('mapa');
    } else {
      setRolObjetivoModal('OPERADOR_COE');
      setModalAuthAbierto(true);
    }
  };

  const handleAccesoAdmin = () => {
    const sesion = verificarSesionInstitucionalActiva();
    if (sesion.activa && sesion.rol === 'ADMIN') {
      const usuarioAdmin = USUARIOS_INICIALES.find(u => u.rol === 'ADMIN') || USUARIOS_INICIALES[0];
      cambiarUsuario(usuarioAdmin);
      onNavegarModulo('mapa');
    } else {
      setRolObjetivoModal('ADMIN');
      setModalAuthAbierto(true);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      {/* 1. HERO INSTITUCIONAL DE BIENVENIDA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] text-white p-6 sm:p-10 border border-emerald-500/30 shadow-xl">
        {/* Patrón decorativo geométrico sutil */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 top-10 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono-num font-bold bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse text-slate-950" />
              EL NIÑO 2026 · ALERTA ROJA CANTONAL
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-200 border border-emerald-500/30">
              Cantón Esmeraldas, Ecuador
            </span>
            <span className="text-xs text-emerald-200/90 font-mono-num hidden sm:inline">
              Cuenca Hidrográfica Río Teaone y Río Esmeraldas
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white leading-tight">
            Plataforma Territorial de Gestión de Riesgo y Protección Ciudadana
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-3xl">
            Bienvenido al sistema oficial de información geográfica, prevención comunitaria y coordinación de emergencia de Esmeraldas. Esta infraestructura digital conecta a los habitantes con los equipos de respuesta del COE cantonal ante crecidas fluviales y amenazas climáticas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Acceso público libre para la ciudadanía</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Salas de crisis y despacho con credencial oficial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Monitoreo satelital y cartográfico WGS84</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PUERTAS DE ACCESO DIRECTO SEGÚN PERFIL (LAS 3 ENTRADAS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Seleccione su Puerta de Acceso
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Elija el perfil correspondiente a su necesidad: consulta comunitaria abierta o gestión operativa de autoridades.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline">
            Arquitectura de Roles RBAC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: PORTAL CIUDADANO (Público) */}
          <div className="group relative rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-500 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Globe className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase tracking-wider">
                  Acceso Libre
                </span>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                  Portal Ciudadano
                </h3>
                <span className="text-xs font-semibold text-sky-700">Comunidad Esmeraldeña</span>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Consulte si su vivienda o barrio (50 Casas, La Propicia, Isla Piedad, San Rafael) se encuentra en cota de inundación. Revise albergues activos y números de socorro sin necesidad de registro ni contraseñas.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Fricción Cero</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Consulta GPS</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Albergues en Vivo</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Línea ECU 911</span>
              </div>
            </div>

            <button
              onClick={handleAccesoCiudadano}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <span>Ingresar al Portal Ciudadano</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: OPERACIONES COE ESMERALDAS (Restringido) */}
          <div className="group relative rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-800" />
                  Credencial Oficial
                </span>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  Operadora COE
                </h3>
                <span className="text-xs font-semibold text-emerald-800">Centro de Operaciones de Emergencia</span>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Sala de situación y despacho territorial. Acceso completo al visor técnico GIS con motor espacial PostGIS (<code>ST_Within</code>), semaforización de zonas de desbordamiento, capas satelitales y control de crisis.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">PostGIS WGS84</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Capas Esri & Calles</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Despacho Oficial</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Alertas Tempranas</span>
              </div>
            </div>

            <button
              onClick={handleAccesoCOE}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <span>Acceso Operativo COE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: ADMINISTRACIÓN DEL SISTEMA (Seguridad) */}
          <div className="group relative rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-600 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 group-hover:bg-purple-900 group-hover:text-white transition-colors">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-600" />
                  Gobernanza
                </span>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                  Administrador
                </h3>
                <span className="text-xs font-semibold text-purple-700">Seguridad & Auditoría Inmutable</span>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Supervisión de infraestructura, registro criptográfico de auditoría con marcas temporales ECT, trazabilidad de datos bajo la Ley Orgánica de Protección de Datos Personales (LOPDP) y gobernanza técnica.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Bitácora Oficial</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Exportación JSON</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Auditoría LOPDP</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Control de Sesiones</span>
              </div>
            </div>

            <button
              onClick={handleAccesoAdmin}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <span>Acceso Administrativo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MÓDULO INTERACTIVO DE ORIENTACIÓN: "¿CÓMO FUNCIONA EL SISTEMA?" */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-extrabold text-slate-900">
                Guía de Orientación: ¿Cómo Opera Esmeraldas Resiliente 2026?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conozca los pilares tecnológicos y operativos que protegen vidas en el cantón durante la temporada invernal.
              </p>
            </div>
          </div>

          {/* Pestañas interactivas */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 self-start md:self-auto">
            <button
              onClick={() => setPestanaInfo('ciudadania')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pestanaInfo === 'ciudadania'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Para Ciudadanos
            </button>
            <button
              onClick={() => setPestanaInfo('autoridades')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pestanaInfo === 'autoridades'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Para Autoridades / COE
            </button>
            <button
              onClick={() => setPestanaInfo('tecnologia')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pestanaInfo === 'tecnologia'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Arquitectura Técnica
            </button>
          </div>
        </div>

        {/* Contenido dinámico según pestaña */}
        {pestanaInfo === 'ciudadania' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs font-mono-num">
                01
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Verifique su Vulnerabilidad
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingrese a la consulta ciudadana o active su GPS. El sistema comparará su posición con los polígonos de cota de inundación del río Teaone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono-num">
                02
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Identifique Albergues Seguros
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualice en tiempo real los puntos de acogida habilitados, cupos disponibles para familias y rutas recomendadas hacia cotas elevadas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs font-mono-num">
                03
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Comuníquese con el ECU 911
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ante cualquier emergencia con riesgo a la vida humana, acceda directamente al enlace de auxilio inmediato con el Servicio Integrado de Seguridad.
              </p>
            </div>
          </div>
        )}

        {pestanaInfo === 'autoridades' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono-num">
                A1
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Monitoreo de Cuencas Fluviales
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seguimiento hidrometeorológico continuo de los cauces de los ríos Teaone y Esmeraldas georreferenciados en el marco geodésico WGS84.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono-num">
                A2
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Semaforización de Severidad
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clasificación de sectores por colorimetría institucional: Rojo (Crítico), Naranja (Alto), Amarillo (Medio) y Azul (Hidrografía activa).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono-num">
                A3
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Despacho y Coordinación
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Articulación entre Cuerpo de Bomberos, Cruz Roja, Policía y Municipio de Esmeraldas para movilización de brigadas y suministros.
              </p>
            </div>
          </div>
        )}

        {pestanaInfo === 'tecnologia' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs font-mono-num">
                T1
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Motor PostGIS (ST_Within)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algoritmo de punto en polígono (Ray Casting) para determinar en milisegundos si unas coordenadas geográficas intersectan una zona inundable.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs font-mono-num">
                T2
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Seguridad Criptográfica SHA-256
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autenticación mediante Web Crypto API sin texto plano en el cliente, bloqueo tras 5 intentos fallidos y almacenamiento de sesión seguro.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs font-mono-num">
                T3
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Trazabilidad LOPDP
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bitácora de auditoría inmutable que registra cada evento, modificación de albergue o consulta espacial con fecha y hora oficial ecuatoriana (ECT).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. CIFRAS Y MONITOREO DEL ESCENARIO OFICIAL ESMERALDAS 2026 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-100 text-red-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Sectores Críticos</span>
            <div className="text-xl font-heading font-black text-slate-900">4 Zonas Clave</div>
            <span className="text-[10px] text-red-700 font-semibold">50 Casas · La Propicia</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Cuencas Monitoreadas</span>
            <div className="text-xl font-heading font-black text-slate-900">2 Ríos Principales</div>
            <span className="text-[10px] text-sky-800 font-semibold">Río Teaone & Esmeraldas</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Albergues Oficiales</span>
            <div className="text-xl font-heading font-black text-slate-900">
              {albergues.length} Habilitados
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">Capacidad en tiempo real</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Hora Oficial</span>
            <div className="text-xl font-heading font-black text-slate-900">America/Guayaquil</div>
            <span className="text-[10px] text-purple-700 font-semibold">ECT (UTC-5)</span>
          </div>
        </div>
      </div>

      {/* 5. AVISO INSTITUCIONAL DE RESPONSABILIDAD */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-slate-500 shrink-0" />
          <span>
            <strong>Atención a la ciudadanía:</strong> Este sistema es una herramienta de auxilio, orientación y monitoreo territorial oficial del Cantón Esmeraldas ante el Fenómeno de El Niño 2026. Ante peligro inminente a la vida o atrapamiento, llame de inmediato al <strong>ECU 911</strong>.
          </span>
        </div>
        <a
          href="tel:911"
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Llamar al ECU 911</span>
        </a>
      </div>

      {/* Modal Criptográfico de Autenticación para COE o Admin */}
      <AuthModal
        isOpen={modalAuthAbierto}
        rolObjetivo={rolObjetivoModal}
        onClose={() => {
          setModalAuthAbierto(false);
          // Si logró autenticarse, navegar al mapa operativo
          const sesion = verificarSesionInstitucionalActiva();
          if (sesion.activa) {
            onNavegarModulo('mapa');
          }
        }}
      />
    </div>
  );
}
