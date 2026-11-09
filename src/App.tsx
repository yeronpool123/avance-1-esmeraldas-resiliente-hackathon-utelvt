/**
 * ESMERALDAS RESILIENTE 2026 - Plataforma Web Oficial Cantón Esmeraldas
 * Arquitectura Institucional RBAC: Centro de Bienvenida, Portal Ciudadano, Operaciones COE y Auditoría
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, ModuloId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { InstitutionalWelcomeView } from './components/welcome/InstitutionalWelcomeView';
import { CitizenPortalView } from './components/citizen/CitizenPortalView';
import { M1MapModule } from './components/modules/M1MapModule';
import { AdminAuditPanel } from './components/admin/AdminAuditPanel';

function MainLayout() {
  const { usuario } = useApp();
  // Primera instancia independiente: inicia en la vista de bienvenida e inducción
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('bienvenida');

  // Ajustar módulo activo si el rol cambia y la vista actual no es compatible
  useEffect(() => {
    if (moduloActivo === 'bienvenida') return; // En bienvenida se mantiene

    if (usuario.rol === 'CIUDADANO' && (moduloActivo === 'mapa' || moduloActivo === 'auditoria')) {
      setModuloActivo('ciudadano');
    } else if (usuario.rol === 'OPERADOR_COE' && moduloActivo === 'ciudadano') {
      setModuloActivo('mapa');
    } else if (usuario.rol === 'ADMIN' && moduloActivo === 'ciudadano') {
      setModuloActivo('mapa');
    }
  }, [usuario.rol]);

  const titulos: Record<ModuloId, string> = {
    bienvenida: 'Centro de Orientación y Acceso Institucional · Esmeraldas Resiliente 2026',
    ciudadano: 'Portal Ciudadano · Información y Prevención Territorial',
    mapa: 'Visor Cartográfico y Análisis de Riesgo Territorial',
    auditoria: 'Gobernanza y Bitácora de Auditoría del Sistema',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Sidebar institucional en verde bosque esmeraldeño */}
      <div className="hidden md:flex shrink-0">
        <Sidebar moduloActivo={moduloActivo} onCambiarModulo={setModuloActivo} />
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
        {/* Barra Superior Institucional */}
        <Header tituloVista={titulos[moduloActivo] || 'Esmeraldas Resiliente 2026'} />

        {/* Área de Visualización */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-6">
          <div className="max-w-7xl mx-auto">
            {moduloActivo === 'bienvenida' && (
              <InstitutionalWelcomeView onNavegarModulo={setModuloActivo} />
            )}
            {moduloActivo === 'ciudadano' && <CitizenPortalView />}
            {moduloActivo === 'mapa' && <M1MapModule />}
            {moduloActivo === 'auditoria' && <AdminAuditPanel />}
          </div>
        </main>
      </div>

      {/* Toasts de Notificación en Vivo */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
