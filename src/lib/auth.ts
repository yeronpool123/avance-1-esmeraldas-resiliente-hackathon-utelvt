/**
 * ESMERALDAS RESILIENTE 2026 - Módulo de Autenticación y Seguridad Institucional
 * Validación criptográfica con Web Crypto API (SHA-256) sin almacenar texto plano
 */

import { RolUsuario, Usuario } from '../types';
import { USUARIOS_INICIALES } from '../data/seed';

// Hashes SHA-256 de contraseñas confidenciales (No texto plano)
// Generados con Web Crypto API SHA-256
const HASHES_AUTORIZADOS: Record<string, { passHash: string; rol: RolUsuario; usuarioId: number }> = {
  // Operadora COE Esmeraldas
  'operador.coe@esmeraldas.gob.ec': {
    passHash: '27971693e6ed02e6f8adb6afb5eaa5d707ce2b78ae8c949f3f7a9827f4f39452',
    rol: 'OPERADOR_COE',
    usuarioId: 2,
  },
  'operador_coe': {
    passHash: '27971693e6ed02e6f8adb6afb5eaa5d707ce2b78ae8c949f3f7a9827f4f39452',
    rol: 'OPERADOR_COE',
    usuarioId: 2,
  },

  // Administrador de Sistema
  'admin@esmeraldas.gob.ec': {
    passHash: '088b97f7abcdfa2fb46052bea2526e991e200029611f45c4b32038ef14799e9c',
    rol: 'ADMIN',
    usuarioId: 1,
  },
  'admin_sistema': {
    passHash: '088b97f7abcdfa2fb46052bea2526e991e200029611f45c4b32038ef14799e9c',
    rol: 'ADMIN',
    usuarioId: 1,
  },
};

const CLAVE_SESION = 'er2026_sesion_activa';
const CLAVE_INTENTOS = 'er2026_intentos_fallidos';
const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Convierte un texto plano a su hash SHA-256 en formato hexadecimal
 */
export async function calcularHashSHA256(texto: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface EstadoIntentos {
  contador: number;
  bloqueadoHasta: number | null;
}

function obtenerEstadoIntentos(): EstadoIntentos {
  try {
    const raw = sessionStorage.getItem(CLAVE_INTENTOS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return { contador: 0, bloqueadoHasta: null };
}

function guardarEstadoIntentos(estado: EstadoIntentos) {
  sessionStorage.setItem(CLAVE_INTENTOS, JSON.stringify(estado));
}

/**
 * Valida credenciales institucionales de forma segura
 */
export async function autenticarInstitucional(
  identificador: string,
  clavePlana: string
): Promise<{
  exito: boolean;
  mensaje: string;
  usuario?: Usuario;
}> {
  const estadoIntentos = obtenerEstadoIntentos();
  const ahora = Date.now();

  // Validar si el acceso está temporalmente bloqueado
  if (estadoIntentos.bloqueadoHasta && ahora < estadoIntentos.bloqueadoHasta) {
    const segundosRestantes = Math.ceil((estadoIntentos.bloqueadoHasta - ahora) / 1000);
    return {
      exito: false,
      mensaje: `Acceso temporalmente restringido por seguridad. Reintente en ${segundosRestantes} segundos.`,
    };
  }

  // Sanitizar entrada
  const userLimpio = identificador.trim().toLowerCase();
  const claveLimpia = clavePlana.trim();

  if (!userLimpio || !claveLimpia) {
    return {
      exito: false,
      mensaje: 'Por favor ingrese su identificación institucional y clave de acceso.',
    };
  }

  const registroAutorizado = HASHES_AUTORIZADOS[userLimpio];

  if (!registroAutorizado) {
    // Registro fallido genérico (sin revelar si el usuario existe)
    registrarFalloSeguridad(estadoIntentos);
    return {
      exito: false,
      mensaje: 'Credenciales institucionales incorrectas o no autorizadas.',
    };
  }

  // Comparación de hash SHA-256
  const hashIngresado = await calcularHashSHA256(claveLimpia);

  if (hashIngresado !== registroAutorizado.passHash) {
    registrarFalloSeguridad(estadoIntentos);
    return {
      exito: false,
      mensaje: 'Credenciales institucionales incorrectas o no autorizadas.',
    };
  }

  // Éxito: restablecer intentos
  sessionStorage.removeItem(CLAVE_INTENTOS);

  // Buscar usuario inicial correspondiente
  const usuarioEncontrado = USUARIOS_INICIALES.find(u => u.id === registroAutorizado.usuarioId) || {
    id: registroAutorizado.usuarioId,
    nombre: registroAutorizado.rol === 'ADMIN' ? 'Administrador de Sistema' : 'Operadora COE Esmeraldas',
    email: userLimpio.includes('@') ? userLimpio : `${userLimpio}@esmeraldas.gob.ec`,
    rol: registroAutorizado.rol,
    activo: true,
  };

  // Guardar sesión institucional activa
  sessionStorage.setItem(
    CLAVE_SESION,
    JSON.stringify({
      usuarioId: usuarioEncontrado.id,
      rol: usuarioEncontrado.rol,
      fechaLogin: new Date().toISOString(),
    })
  );

  return {
    exito: true,
    mensaje: `Acceso institucional concedido: ${usuarioEncontrado.nombre}`,
    usuario: usuarioEncontrado,
  };
}

function registrarFalloSeguridad(estado: EstadoIntentos) {
  estado.contador += 1;
  if (estado.contador >= MAX_INTENTOS) {
    estado.bloqueadoHasta = Date.now() + TIEMPO_BLOQUEO_MS;
  }
  guardarEstadoIntentos(estado);
}

/**
 * Cierra la sesión institucional y regresa al rol público de Ciudadano
 */
export function cerrarSesionInstitucional(): Usuario {
  sessionStorage.removeItem(CLAVE_SESION);
  const ciudadano = USUARIOS_INICIALES.find(u => u.rol === 'CIUDADANO') || {
    id: 3,
    nombre: 'Ciudadano (Acceso Público)',
    email: 'portal.ciudadano@esmeraldas.gob.ec',
    rol: 'CIUDADANO',
    activo: true,
  };
  return ciudadano;
}

/**
 * Verifica si hay una sesión institucional activa en el almacenamiento de sesión
 */
export function verificarSesionInstitucionalActiva(): { activa: boolean; rol?: RolUsuario } {
  try {
    const raw = sessionStorage.getItem(CLAVE_SESION);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.rol && data.rol !== 'CIUDADANO') {
        return { activa: true, rol: data.rol };
      }
    }
  } catch {
    // fallback
  }
  return { activa: false };
}
