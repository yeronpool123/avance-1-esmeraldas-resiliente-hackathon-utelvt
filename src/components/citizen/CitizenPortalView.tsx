/**
 * ESMERALDAS RESILIENTE 2026 - Portal Ciudadano de Información y Prevención
 * Vista pública orientada 100% a la ciudadanía: lenguaje claro, prevención territorial y auxilio
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapView } from '../map/MapView';
import { ZONAS_RIESGO_INICIALES, SERVICIOS_INICIALES } from '../../data/seed';
import { detectarZonaRiesgo } from '../../lib/geo';
import {
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  MapPin,
  HelpCircle,
  CheckCircle2,
  Navigation,
  Compass,
  HeartHandshake,
  AlertOctagon,
  Info,
  Radio,
  FileText,
} from 'lucide-react';

export function CitizenPortalView() {
  const { alertas, albergues } = useApp();

  // Estados de consulta ciudadana
  const [latConsultada, setLatConsultada] = useState<number>(0.9430);
  const [lngConsultada, setLngConsultada] = useState<number>(-79.6680);
  const [zonaResultado, setZonaResultado] = useState<any>(ZONAS_RIESGO_INICIALES[0]); // Default: 50 Casas
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string>('Barrio 50 Casas');

  // Sectores clave para consulta rápida
  const sectoresFrecuentes = [
    { nombre: 'Barrio 50 Casas', lat: 0.9430, lng: -79.6680 },
    { nombre: 'La Propicia (Riberas)', lat: 0.9480, lng: -79.6600 },
    { nombre: 'Isla Piedad / Puerto', lat: 0.9850, lng: -79.6520 },
    { nombre: 'San Rafael', lat: 0.9380, lng: -79.6520 },
    { nombre: 'Las Palmas / Centro', lat: 0.9920, lng: -79.6540 },
  ];

  const handleSeleccionarSector = (sector: { nombre: string; lat: number; lng: number }) => {
    setSectorSeleccionado(sector.nombre);
    setLatConsultada(sector.lat);
    setLngConsultada(sector.lng);
    const detectada = detectarZonaRiesgo(sector.lat, sector.lng, ZONAS_RIESGO_INICIALES);
    setZonaResultado(detectada);
  };

  const consultarUbicacionGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setLatConsultada(latitude);
          setLngConsultada(longitude);
          setSectorSeleccionado('Mi Ubicación GPS Actual');
          const detectada = detectarZonaRiesgo(latitude, longitude, ZONAS_RIESGO_INICIALES);
          setZonaResultado(detectada);
        },
        () => {
          // Fallback a coordenadas de Esmeraldas si niegan permiso
          handleSeleccionarSector(sectoresFrecuentes[0]);
        }
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner de Emergencia Institucional */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#022c22] text-white shadow-md border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                MONITOREO EN VIVO · EL NIÑO 2026
              </span>
              <span className="text-xs text-emerald-100 font-medium hidden sm:inline">
                Cantón Esmeraldas
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
              Portal Ciudadano de Información y Prevención
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Consulte de forma abierta el nivel de vulnerabilidad de su vivienda o barrio ante la crecida de los ríos Teaone y Esmeraldas, alertas oficiales y puntos seguros de evacuación.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:911"
              className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Emergencias ECU 911</span>
            </a>
          </div>
        </div>
      </div>

      {/* Herramienta Ciudadana: ¿Mi sector está en riesgo? */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                Consulta Preventiva: ¿Tu barrio o vivienda está en riesgo de inundación?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Seleccione un sector o active su GPS para verificar si se encuentra dentro de zonas críticas por El Niño.
              </p>
            </div>
          </div>

          <button
            onClick={consultarUbicacionGPS}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition-colors"
          >
            <Navigation className="w-4 h-4 text-emerald-700" />
            <span>Usar mi GPS actual</span>
          </button>
        </div>

        {/* Botones de sectores rápidos */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-semibold text-slate-700">
            Sectores ribereños y urbanos frecuentes de Esmeraldas:
          </label>
          <div className="flex flex-wrap gap-2">
            {sectoresFrecuentes.map(sec => (
              <button
                key={sec.nombre}
                onClick={() => handleSeleccionarSector(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  sectorSeleccionado === sec.nombre
                    ? 'bg-[#064e3b] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sec.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Tarjeta de Diagnóstico Ciudadano */}
        {zonaResultado ? (
          <div
            className={`p-5 rounded-2xl border ${
              zonaResultado.nivel_riesgo === 'CRITICO'
                ? 'bg-red-50/70 border-red-300'
                : zonaResultado.nivel_riesgo === 'ALTO'
                ? 'bg-orange-50/70 border-orange-300'
                : 'bg-amber-50/70 border-amber-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl text-white ${
                    zonaResultado.nivel_riesgo === 'CRITICO' ? 'bg-red-600' : 'bg-orange-600'
                  }`}
                >
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                    Nivel de Riesgo: {zonaResultado.nivel_riesgo}
                  </span>
                  <h4 className="text-base font-heading font-extrabold text-slate-900 mt-1">
                    {zonaResultado.nombre_sector} ({zonaResultado.parroquia})
                  </h4>
                </div>
              </div>
              <div className="text-xs font-mono-num text-slate-600">
                Amenaza: <strong>{zonaResultado.tipo_amenaza.replace('_', ' ')}</strong>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <strong className="block text-slate-900 font-heading">Situación del Sector:</strong>
                <p className="text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200">
                  {zonaResultado.descripcion}
                </p>
                <div className="text-[11px] text-slate-500">
                  Fuente técnica: <strong>{zonaResultado.fuente_dato}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <strong className="block text-slate-900 font-heading">¿Qué medidas debe tomar su familia?</strong>
                <ul className="space-y-1.5 text-slate-700 bg-white/80 p-3 rounded-xl border border-slate-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Mantenga lista la mochila de emergencia de 72 horas con documentos en bolsa plástica impermeable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Identifique la ruta hacia cotas altas lejos del cauce del río Teaone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Si el nivel del agua empieza a subir en su calle, corte de inmediato el interruptor de energía eléctrica.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Zona Fuera de Inundación Crítica
                </span>
                <h4 className="text-base font-heading font-extrabold text-slate-900 mt-1">
                  {sectorSeleccionado}
                </h4>
                <p className="text-xs text-slate-700 mt-0.5">
                  Las coordenadas consultadas se encuentran fuera de la cota de inundación directa del río Teaone y del estero. Mantenga precauciones viales por lluvias continuas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visor Cartográfico Ciudadano Interactivo */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Mapa Ciudadano de Zonas Inundables y Puntos Seguros
            </h3>
            <p className="text-xs text-slate-500">
              Haga clic sobre cualquier zona para ver el polígono de afectación y vías transitables en Esmeraldas.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Cartografía Oficial WGS84
          </span>
        </div>

        <MapView
          altura="h-[520px]"
          onSelectUbicacion={(lat, lng) => {
            setLatConsultada(lat);
            setLngConsultada(lng);
            setSectorSeleccionado(`Punto [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
            const detectada = detectarZonaRiesgo(lat, lng, ZONAS_RIESGO_INICIALES);
            setZonaResultado(detectada);
          }}
        />
      </div>

      {/* Grid: Albergues Abiertos y Teléfonos de Emergencia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Albergues y Centros de Acogida Seguros */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-700" />
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Albergues y Puntos de Evacuación Habilitados
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {albergues.filter(a => a.estado !== 'CERRADO').length} Operativos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {albergues.map(alb => {
              const porcentaje = Math.round((alb.ocupacion_actual / alb.capacidad_maxima) * 100);
              const cuposDisponibles = alb.capacidad_maxima - alb.ocupacion_actual;

              return (
                <div
                  key={alb.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-xs font-bold text-slate-900">{alb.nombre_albergue}</strong>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        alb.estado !== 'CERRADO'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900'
                      }`}
                    >
                      {alb.estado}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{alb.direccion}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Cupos disponibles:</span>
                    <span className="font-mono-num font-bold text-slate-900">
                      {cuposDisponibles} de {alb.capacidad_maxima} personas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Directorio Telefónico de Emergencia */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <PhoneCall className="w-5 h-5 text-red-600" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Líneas de Auxilio Inmediato
            </h3>
          </div>

          <div className="space-y-2.5">
            <a
              href="tel:911"
              className="p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-between transition-colors block"
            >
              <div>
                <strong className="block text-xs font-bold text-red-900">ECU 911 Esmeraldas</strong>
                <span className="text-[11px] text-red-700">Emergencias vitales y rescate acuático</span>
              </div>
              <span className="text-sm font-mono-num font-black text-red-700">911</span>
            </a>

            <a
              href="tel:102"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors block"
            >
              <div>
                <strong className="block text-xs font-bold text-slate-900">Cuerpo de Bomberos</strong>
                <span className="text-[11px] text-slate-500">Estación Central Esmeraldas</span>
              </div>
              <span className="text-xs font-mono-num font-bold text-slate-700">102</span>
            </a>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs font-bold text-slate-900">Hospital Delfina Torres</strong>
                <span className="text-[11px] text-slate-500">Atención médica de urgencia</span>
              </div>
              <span className="text-xs font-mono-num font-semibold text-slate-700">Sur</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] leading-relaxed">
              <strong>Aviso de seguridad ciudadana:</strong> En caso de corte eléctrico o colapso de antenas celulares en su sector, acuda al albergue o punto seguro más próximo indicado en este portal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
