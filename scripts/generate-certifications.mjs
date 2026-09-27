import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'Certifications PDF');
const output = path.join(root, 'src', 'app', 'certifications.generated.json');

const files = (await readdir(source, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'))
  .map((entry) => entry.name)
  .sort((a, b) => {
    const aIsFeatured = /69V41R4PZ8DS/i.test(a);
    const bIsFeatured = /69V41R4PZ8DS/i.test(b);
    if (aIsFeatured !== bIsFeatured) return aIsFeatured ? -1 : 1;
    const aIsCopy = / \(\d+\)\.pdf$/i.test(a);
    const bIsCopy = / \(\d+\)\.pdf$/i.test(b);
    if (aIsCopy !== bIsCopy) return aIsCopy ? 1 : -1;
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  });

const uniqueFiles = [];
const seenPdfHashes = new Set();
for (const file of files) {
  const contents = await readFile(path.join(source, file));
  const hash = createHash('sha256').update(contents).digest('hex');
  if (seenPdfHashes.has(hash)) continue;
  seenPdfHashes.add(hash);
  uniqueFiles.push(file);
}
files.splice(0, files.length, ...uniqueFiles);

const repairTitle = (value) => value
  .replace(/^.*?\bJusto\s+/i, '')
  .replace(/\b(Softw) are\b/gi, '$1are')
  .replace(/\b(Bu) ilding\b/gi, '$1ilding')
  .replace(/\b(Qu) ality\b/gi, '$1ality')
  .replace(/\b(Architectu) re\b/gi, '$1re')
  .replace(/\b(Introdu) ction\b/gi, '$1ction')
  .replace(/\b(Stru) ctu res\b/gi, '$1ctures')
  .replace(/\b(w) ith\b/g, '$1ith')
  .replace(/\b(Secu) rity\b/gi, '$1rity')
  .replace(/secu rity/gi, 'security')
  .replace(/Meta- Analysis/gi, 'Meta-Analysis')
  .replace(/\b(Warehou) se\b/gi, '$1se')
  .replace(/\b(Pow) er\b/gi, '$1er')
  .replace(/\b(U) ser\b/g, '$1ser')
  .replace(/\b(Infrastru) ctu re\b/gi, '$1cture')
  .replace(/\b(Qu) antitative\b/gi, '$1antitative')
  .replace(/\b(Fou) ndations\b/gi, '$1ndations')
  .replace(/\b(Entrepreneu) rship\b/gi, '$1rship')
  .replace(/\bHands- on\b/gi, 'Hands-on')
  .replace(/\b(Linu) x\b/gi, '$1x')
  .replace(/\b(Compu) ter\b/gi, '$1ter')
  .replace(/\b(Netw) orking\b/gi, '$1orking')
  .replace(/\b(Su) pport\b/gi, '$1pport')
  .replace(/\b(Fu) ndamentals\b/gi, '$1ndamentals')
  .replace(/\b(Secu) rity\b/gi, '$1rity')
  .replace(/\bAW S\b/g, 'AWS')
  .replace(/\bClou d\b/gi, 'Cloud')
  .replace(/\bTrou bleshooting\b/gi, 'Troubleshooting')
  .replace(/\bDebu gging\b/gi, 'Debugging')
  .replace(/\bTechniqu es\b/gi, 'Techniques')
  .replace(/\s*:\s*/g, ': ')
  .replace(/\s+/g, ' ')
  .trim();

const certifications = files.map((file, index) => {
  const fallbackTitle = file.slice(0, -4).replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const title = fallbackTitle;
  const provider = /^coursera\b/i.test(title) ? 'Coursera Certification' : 'Certification';

  return {
    mark: String(index + 1).padStart(2, '0'),
    provider,
    title,
    description: 'Open the certificate PDF to view its details.',
    // Relative URL respects the deployment base path (for example /ProfilePortfolio/ on GitHub Pages).
    pdf: `certifications/${encodeURIComponent(file)}`,
  };
});

for (let index = 0; index < files.length; index += 1) {
  const file = files[index];
  const data = new Uint8Array(await readFile(path.join(source, file)));
  const document = await getDocument({ data, isEvalSupported: false }).promise;
  const page = await document.getPage(1);
  const items = (await page.getTextContent()).items;
  const text = items.map((item) => ('str' in item ? item.str : '')).join(' ')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ');
  const titleMatch = text.match(/([\p{L}\p{N} ,:&'\/()-]{4,100}?)\s+an online (?:course|project) authorized/iu);
  const professionalCertificateMatch = text.match(/has successfully completed the online Professional Certi.{0,2}cate\s+(.+?)\s+Those who earn/iu);
  const authorizedDescriptionMatch = text.match(/an online (course|project) authorized by (.+?) and offered through Coursera/iu);
  const professionalDescriptionMatch = text.match(/Those who earn the Google IT Support Professional Certi.{0,2}cate (.+?)(?:This certi.{0,2}cate attests|Verify this certi.{0,2}cate)/iu);
  let extractedTitle = repairTitle(titleMatch?.[1] ?? professionalCertificateMatch?.[1] ?? '');
  if (professionalCertificateMatch && /Google IT Support/i.test(extractedTitle)) {
    extractedTitle = 'Google IT Support Professional Certificate';
  }
  const providerMatch = text.match(/an online course authorized by (.+?) and offered through/iu);
  if (extractedTitle) certifications[index].title = extractedTitle;
  if (authorizedDescriptionMatch) {
    const kind = authorizedDescriptionMatch[1].toLowerCase();
    certifications[index].description = `An online ${kind} authorized by ${authorizedDescriptionMatch[2]} and offered through Coursera.`;
  }
  if (professionalDescriptionMatch) {
    certifications[index].description = repairTitle(`Those who earn the Google IT Support Professional Certificate ${professionalDescriptionMatch[1]}`)
      .replace(/\bve-courses\b/gi, 'five-courses');
  }
  if (/Google Career Certificates/i.test(text)) certifications[index].provider = 'Google - Coursera';
  if (providerMatch) certifications[index].provider = `${providerMatch[1]} - Coursera`;
  await document.destroy();
}

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(certifications, null, 2)}\n`);
console.log(`Indexed ${certifications.length} certification PDF(s).`);
