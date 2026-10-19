// Shared, fixed public content for the HTTP 410 page and client-side navigation.
export const webinarTitle = "Este webinar ya terminó | Ruka.ai";
export const webinarDescription = "El webinar de Ruka del 27 de noviembre de 2025 ha finalizado. Consulta las guías actuales sobre compras, costos y conciliaciones.";
export const webinarBody = `
  <main class="retired-webinar">
    <article>
      <a href="/" aria-label="Ir al inicio de Ruka"><img src="/logo.png" alt="Ruka.ai" width="180" height="48"></a>
      <p class="eyebrow">Webinar · 27 de noviembre de 2025</p>
      <h1>Este webinar ya terminó.</h1>
      <p class="copy">Las inscripciones están cerradas. Puedes seguir explorando nuestras guías sobre compras, costos y conciliaciones.</p>
      <a class="button" href="/blog">Ver las guías de Ruka <span aria-hidden="true">→</span></a>
      <a class="home" href="/">Volver al inicio</a>
    </article>
  </main>`;
export const webinarStyles = `
  .retired-webinar { box-sizing: border-box; min-height: 100svh; display: grid; place-items: center; padding: 48px 24px; background: #fbfcff; color: #171827; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
  .retired-webinar article { width: min(760px, 100%); padding: 56px 0; border-block: 1px solid #dce3f2; }
  .retired-webinar img { width: 180px; height: auto; }
  .retired-webinar .eyebrow { margin: 56px 0 0; color: #454ac0; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .retired-webinar h1 { margin: 20px 0 0; font-size: clamp(40px, 8vw, 68px); font-weight: 650; line-height: 1.06; letter-spacing: -.045em; }
  .retired-webinar .copy { max-width: 570px; margin: 24px 0 0; color: #5b6275; font-size: 18px; line-height: 1.7; }
  .retired-webinar .button { display: inline-flex; gap: 16px; min-height: 48px; align-items: center; justify-content: center; margin-top: 36px; border-radius: 999px; background: #4b52df; color: white; padding: 0 24px; font-size: 15px; font-weight: 600; text-decoration: none; }
  .retired-webinar .home { display: block; width: fit-content; margin-top: 24px; color: #454ac0; font-size: 15px; }
  .retired-webinar a:focus-visible { outline: 3px solid #4b52df; outline-offset: 5px; }
`;
export const webinarHtml = `<!doctype html>
<html lang="es-CL"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${webinarTitle}</title>
<meta name="description" content="${webinarDescription}">
<meta name="robots" content="noindex, nofollow, noarchive">
<link rel="icon" href="/favicon.ico">
<style>body{margin:0}${webinarStyles}</style>
</head><body>${webinarBody}</body></html>`;
