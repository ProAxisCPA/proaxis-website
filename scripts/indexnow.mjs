import { readFileSync } from 'fs';

const KEY = '2dde2104d56ea1701267d73428b46904';
const HOST = 'proaxiscpa.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read the generated sitemap
let xml;
try {
  xml = readFileSync('dist/sitemap-0.xml', 'utf-8');
} catch {
  console.error('sitemap-0.xml not found — skipping IndexNow submission');
  process.exit(0);
}

// Extract all URLs from the sitemap
const urls = [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);

if (urls.length === 0) {
  console.log('No URLs found in sitemap.');
  process.exit(0);
}

console.log(`Submitting ${urls.length} URLs to IndexNow...`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});

if (res.ok || res.status === 202) {
  console.log(`IndexNow: submitted successfully (${res.status})`);
} else {
  const text = await res.text();
  console.error(`IndexNow error ${res.status}: ${text} — continuing anyway`);
}
