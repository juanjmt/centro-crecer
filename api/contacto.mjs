// Recibe el formulario de contacto del sitio, verifica el desafío de Cloudflare Turnstile
// y envía el mensaje por mail con Resend.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY        clave de API de Resend
//   TURNSTILE_SECRET_KEY  clave secreta del widget de Turnstile
//   CONTACT_TO_EMAIL      casilla que recibe los mensajes
//   CONTACT_FROM_EMAIL    remitente, de un dominio verificado en Resend
//                         (ej: "web@centrocrecer.org.ar")
//
// El mail sale desde CONTACT_FROM_EMAIL (no se puede usar el mail de la persona como remitente:
// Gmail lo marcaría como suplantación), pero se muestra con el nombre de quien escribió y
// reply_to apunta a su mail, así que "Responder" le contesta directo a esa persona.

// Sin espacios ni caracteres como <>",;() para que no entren formatos tipo "Nombre<otro@mail>".
const EMAIL_RE = /^[^\s@<>",;()]+@[^\s@<>",;()]+\.[^\s@<>",;()]+$/;
const MOTIVOS = ['Quiero ser voluntario/a', 'Quiero ayudar al Centro', 'Tengo una consulta'];
const MAX = { nombre: 120, mail: 200, telefono: 40, mensaje: 5000 };
const ENV_REQUERIDAS = ['RESEND_API_KEY', 'TURNSTILE_SECRET_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'];
const TIMEOUT_MS = 8000;

export async function POST(request) {
  const faltantes = ENV_REQUERIDAS.filter((name) => !process.env[name]);
  if (faltantes.length) {
    console.error('Faltan variables de entorno:', faltantes.join(', '));
    return Response.json({ error: 'No pudimos enviar el mensaje.' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Formato inválido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return Response.json({ error: 'Formato inválido.' }, { status: 400 });
  }

  // Honeypot: campo oculto que una persona nunca completa. Si viene con algo, es un robot:
  // respondemos OK para no darle pistas, pero no enviamos nada. Se loguea para detectar
  // falsos positivos (por ejemplo, un autocompletado del navegador).
  if (clean(body.hp_contacto)) {
    console.warn('Honeypot activado, mensaje descartado');
    return Response.json({ ok: true });
  }

  const motivo = MOTIVOS.includes(body.motivo) ? body.motivo : 'Tengo una consulta';
  const nombre = clean(body.nombre).slice(0, MAX.nombre);
  const mail = clean(body.mail).slice(0, MAX.mail);
  const telefono = clean(body.telefono).slice(0, MAX.telefono);
  const mensaje = clean(body.mensaje).slice(0, MAX.mensaje);

  if (!nombre || !EMAIL_RE.test(mail)) {
    return Response.json({ error: 'Completá tu nombre y un mail válido.' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
  if (!(await verificarTurnstile(clean(body.token), ip))) {
    return Response.json({ error: 'No pudimos verificar que no sos un robot. Probá de nuevo.' }, { status: 403 });
  }

  const filas = [
    ['Motivo', motivo],
    ['Nombre', nombre],
    ['Mail', mail],
    ['Teléfono', telefono || '—'],
    ['Mensaje', mensaje || '—'],
  ];

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `"${displayName(nombre)} (vía web Crecer)" <${fromAddress(process.env.CONTACT_FROM_EMAIL)}>`,
        to: process.env.CONTACT_TO_EMAIL,
        reply_to: mail,
        subject: `Nuevo mensaje desde la web — ${motivo}`,
        text: filas.map(([k, v]) => `${k}: ${v}`).join('\n'),
        html: filas
          .map(([k, v]) => `<p><strong>${k}:</strong><br>${escapeHtml(v).replace(/\n/g, '<br>')}</p>`)
          .join(''),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error('Resend error', res.status, await res.text());
      return Response.json({ error: 'No pudimos enviar el mensaje.' }, { status: 502 });
    }
  } catch (err) {
    console.error('Resend error', err);
    return Response.json({ error: 'No pudimos enviar el mensaje.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}

async function verificarTurnstile(token, ip) {
  if (!token) return false;
  const form = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('Turnstile error', err);
    return false;
  }
}

// Acepta "web@dominio" o "Nombre <web@dominio>" y devuelve solo la dirección.
function fromAddress(value) {
  const match = /<([^>]+)>/.exec(value || '');
  return (match ? match[1] : value || '').trim();
}

// Saca del nombre los caracteres que podrían romper el encabezado "From".
function displayName(nombre) {
  return nombre.replace(/["<>\\\r\n,;:()@]/g, '').slice(0, 60).trim() || 'Contacto';
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
