import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const pages = [
  { file: 'bergen-county.astro',    city: 'Bergen County' },
  { file: 'hackensack.astro',       city: 'Hackensack' },
  { file: 'paramus.astro',          city: 'Paramus' },
  { file: 'fort-lee.astro',         city: 'Fort Lee' },
  { file: 'ridgewood.astro',        city: 'Ridgewood' },
  { file: 'teaneck.astro',          city: 'Teaneck' },
  { file: 'hasbrouck-heights.astro',city: 'Hasbrouck Heights' },
  { file: 'englewood.astro',        city: 'Englewood' },
  { file: 'fair-lawn.astro',        city: 'Fair Lawn' },
  { file: 'new-york.astro',         city: 'New York' },
];

const dir = 'src/pages/service-areas';

for (const { file, city } of pages) {
  const path = join(dir, file);
  let src = readFileSync(path, 'utf-8');

  // Skip if already has faq
  if (src.includes('const faq =')) {
    console.log(`${file}: already has FAQ, skipping schema`);
  } else {
    // Insert faq const + convert schema to array
    // Match the full schema block (from "const schema = {" to closing "};")
    // Replace const schema = { with const faq + const schema = [{
    src = src.replace(
      /const schema = \{/,
      `const faq = [
  { q: \`Does ProAxis provide CPA services to clients in ${city}?\`, a: \`Yes. ProAxis Tax & Accounting Services provides expert CPA services to individuals and businesses in ${city}. Our fully virtual model means there's no commute — we work with ${city} clients through secure document sharing, video meetings, and cloud-based accounting tools.\` },
  { q: \`What tax and accounting services are available to ${city} businesses and residents?\`, a: \`ProAxis offers tax preparation, year-round tax planning, bookkeeping, payroll, fractional CFO, IRS tax resolution, NJ SALT consulting, multi-state tax filing, and business advisory. We serve individuals, sole proprietors, LLCs, S-Corps, and partnerships in ${city}.\` },
  { q: \`Does ProAxis help ${city} residents who commute to New York City?\`, a: \`Yes. Many ${city} area residents commute to NYC and have NJ and NY nonresident filing obligations. ProAxis prepares both state returns, ensures correct wage allocation between states, and advises on work-from-home day tracking to minimize your combined NJ and NY tax liability.\` },
  { q: \`How do I get started with ProAxis as a ${city} client?\`, a: \`Visit proaxiscpa.com/contact to schedule a free consultation or call (201) 800-2330. We'll review your tax situation and explain exactly how ProAxis can help — with no obligation.\` },
];

const schema = [`
    );

    // Close the schema object and add FAQPage
    // The schema block ends with "  };\n---" or  "};\n---"
    // Replace the closing "};" of the schema with array closing
    src = src.replace(
      /("areaServed":\s*\{[^}]+\})\s*\n\};\s*\n---/,
      `$1\n  },\n  {\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": faq.map(({ q, a }) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))\n  }\n];\n---`
    );
  }

  // Add visible FAQ section before <TestimonialsSection /> if not already added
  if (src.includes('id="faq"')) {
    console.log(`${file}: already has FAQ HTML, skipping`);
  } else {
    const faqHtml = `
  <!-- FAQ Section -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="faq">
    <h2 class="text-2xl font-bold font-heading mb-6" style="color: #1C1C1E;">Frequently Asked Questions</h2>
    <div class="space-y-4">
      {faq.map(({ q, a }) => (
        <div class="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 class="font-bold font-heading mb-2" style="color: #1C1C1E;">{q}</h3>
          <p class="text-gray-700 leading-relaxed">{a}</p>
        </div>
      ))}
    </div>
  </section>

  <TestimonialsSection />`;

    src = src.replace('  <TestimonialsSection />', faqHtml);
  }

  writeFileSync(path, src, 'utf-8');
  console.log(`${file}: updated`);
}
