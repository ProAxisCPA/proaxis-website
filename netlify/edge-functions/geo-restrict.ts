import type { Context } from "https://edge.netlify.com";

export default async function geoRestrict(request: Request, context: Context) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") ?? "";

  // Always allow search engine crawlers and SEO-critical paths
  if (
    url.pathname.startsWith("/sitemap") ||
    url.pathname === "/robots.txt" ||
    /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|sogou|facebot|ia_archiver/i.test(userAgent)
  ) {
    return context.next();
  }

  // Get country code from Netlify's geo object
  const countryCode = context.geo?.country?.code;

  // Allow access if:
  // 1. Country is US
  // 2. Country code is undefined/null (geo data unavailable — default to allow)
  if (!countryCode || countryCode === "US") {
    return context.next();
  }

  // Block non-US access with a polite 403 page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Restricted | ProAxis Tax & Accounting Services</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #F7F8FA;
      color: #1A1A2E;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 3rem 2.5rem;
      max-width: 520px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.5rem;
    }
    .logo-icon {
      width: 48px;
      height: 48px;
      background-color: #1B2A4A;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 16px;
    }
    .logo-text { text-align: left; }
    .logo-name { font-weight: 700; color: #1B2A4A; font-size: 1rem; line-height: 1.2; }
    .logo-sub { font-size: 0.7rem; color: #666; }
    h1 { color: #1B2A4A; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
    p { color: #555; line-height: 1.7; margin-bottom: 1rem; font-size: 0.95rem; }
    .contact-info {
      background: #F7F8FA;
      border-radius: 10px;
      padding: 1.25rem;
      margin-top: 1.5rem;
    }
    .contact-info p { margin-bottom: 0.5rem; font-size: 0.875rem; }
    .contact-info a { color: #2E75B6; text-decoration: none; font-weight: 600; }
    .contact-info a:hover { text-decoration: underline; }
    .flag { font-size: 3rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <div class="logo-icon">PA</div>
      <div class="logo-text">
        <div class="logo-name">ProAxis</div>
        <div class="logo-sub">Tax & Accounting Services</div>
      </div>
    </div>
    <div class="flag">🇺🇸</div>
    <h1>US Clients Only</h1>
    <p>
      ProAxis Tax & Accounting Services currently serves clients within the United States only.
      Our practice is focused on US federal and state tax law, IRS compliance, and serving businesses and individuals in New Jersey and nationwide.
    </p>
    <p>
      If you believe you are seeing this message in error, please don't hesitate to reach out to us directly.
    </p>
    <div class="contact-info">
      <p><strong>Email:</strong> <a href="mailto:info@proaxiscpa.com">info@proaxiscpa.com</a></p>
      <p><strong>Phone:</strong> <a href="tel:+12018002330">(201) 800-2330</a></p>
      <p style="margin-bottom:0; font-size: 0.8rem; color: #888;">ProAxis Tax & Accounting Services | Hasbrouck Heights, NJ</p>
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 403,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-store",
    },
  });
}
