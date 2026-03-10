/**
 * Import Notion Export to components.json
 *
 * Reads the Notion export from ~/Downloads/automaticghl pre concept/
 * Parses CSV for metadata and markdown files for code
 * Outputs to src/data/components.json
 */

import * as fs from 'fs';
import * as path from 'path';

// Types
interface Component {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  platforms: string[];
  status: string;
  previewUrl: string | null;
  description: string | null;
  html: string | null;
  css: string | null;
  js: string | null;
  instructions: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

// Paths
const NOTION_EXPORT_DIR = path.join(process.env.HOME!, 'Downloads/automaticghl pre concept');
const CSV_FILE = path.join(NOTION_EXPORT_DIR, 'CSS JS Master Database 5c910a83fbb3495ba2760657e220c3f8.csv');
const MD_DIR = path.join(NOTION_EXPORT_DIR, 'CSS JS Master Database');
const OUTPUT_COMPONENTS = path.join(__dirname, '../src/data/components.json');
const OUTPUT_CATEGORIES = path.join(__dirname, '../src/data/categories.json');

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
  'Buttons': '🔘',
  'Order Bumps': '☑️',
  'Sliders': '🎚️',
  'Hover Effects': '✨',
  'Navigation': '🧭',
  'Forms': '📝',
  'FAQ': '❓',
  'Animations': '🎬',
  'Timers': '⏱️',
  'Grids': '📊',
  'Video': '🎥',
  'Text & Labels': '🏷️',
  'Other': '📦',
};

// Parse CSV
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

// Extract code blocks from markdown
function extractCodeBlocks(markdown: string): { html: string | null; css: string | null; js: string | null } {
  const result = { html: null as string | null, css: null as string | null, js: null as string | null };

  // Match code blocks with language
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const lang = (match[1] || '').toLowerCase();
    const code = match[2].trim();

    if (lang === 'css') {
      result.css = result.css ? result.css + '\n\n' + code : code;
    } else if (lang === 'html') {
      result.html = result.html ? result.html + '\n\n' + code : code;
    } else if (lang === 'js' || lang === 'javascript') {
      result.js = result.js ? result.js + '\n\n' + code : code;
    }
  }

  return result;
}

// Extract instructions from markdown
function extractInstructions(markdown: string): string | null {
  // Look for ### TUTORIAL or ### SCRIPT sections
  const tutorialMatch = markdown.match(/###\s*TUTORIAL\s*\n([\s\S]*?)(?=###|$)/i);
  const scriptMatch = markdown.match(/###\s*SCRIPT\s*\n([\s\S]*?)(?=###|$)/i);

  let instructions = '';

  if (tutorialMatch) {
    // Extract text before code blocks
    const tutorialContent = tutorialMatch[1];
    const textBeforeCode = tutorialContent.split('```')[0].trim();
    if (textBeforeCode) {
      instructions = textBeforeCode;
    }
  }

  if (scriptMatch) {
    const scriptContent = scriptMatch[1];
    // Look for > INSTRUCTION lines
    const instructionMatch = scriptContent.match(/>\s*INSTRUCTION[^>]*:\s*\n([\s\S]*?)(?=```|$)/i);
    if (instructionMatch && instructionMatch[1].trim()) {
      instructions = instructions ? instructions + '\n\n' + instructionMatch[1].trim() : instructionMatch[1].trim();
    }
  }

  return instructions || null;
}

// Create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Determine category from name or tags
function determineCategory(name: string, tags: string[]): string {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('button')) return 'Buttons';
  if (nameLower.includes('order bump')) return 'Order Bumps';
  if (nameLower.includes('slider') || nameLower.includes('carousel') || nameLower.includes('marquee') || nameLower.includes('swiper')) return 'Sliders';
  if (nameLower.includes('hover')) return 'Hover Effects';
  if (nameLower.includes('nav') || nameLower.includes('menu') || nameLower.includes('header') || nameLower.includes('sticky')) return 'Navigation';
  if (nameLower.includes('form') || nameLower.includes('input')) return 'Forms';
  if (nameLower.includes('faq') || nameLower.includes('accordion') || nameLower.includes('toggle')) return 'FAQ';
  if (nameLower.includes('animation') || nameLower.includes('aos') || nameLower.includes('gsap') || nameLower.includes('scroll')) return 'Animations';
  if (nameLower.includes('timer') || nameLower.includes('countdown') || nameLower.includes('count up')) return 'Timers';
  if (nameLower.includes('grid') || nameLower.includes('bento')) return 'Grids';
  if (nameLower.includes('video') || nameLower.includes('vimeo') || nameLower.includes('popup')) return 'Video';
  if (nameLower.includes('text') || nameLower.includes('badge') || nameLower.includes('bullet') || nameLower.includes('label')) return 'Text & Labels';

  return 'Other';
}

// Parse platforms from string
function parsePlatforms(platformStr: string): string[] {
  if (!platformStr) return [];
  return platformStr.split(',').map(p => p.trim()).filter(Boolean);
}

// Parse tags from string
function parseTags(tagStr: string): string[] {
  if (!tagStr) return [];
  return tagStr.split(',').map(t => t.trim()).filter(Boolean);
}

// Find markdown file for a component
function findMarkdownFile(name: string): string | null {
  if (!fs.existsSync(MD_DIR)) return null;

  const files = fs.readdirSync(MD_DIR);

  // Clean name for matching
  const cleanName = name.replace(/[:\[\]]/g, '').trim();

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    // Remove hash and extension for comparison
    const fileNameWithoutHash = file.replace(/\s+[a-f0-9]{32}\.md$/i, '');
    const fileNameClean = fileNameWithoutHash.replace(/[:\[\]]/g, '').trim();

    if (fileNameClean.toLowerCase().includes(cleanName.toLowerCase().substring(0, 20)) ||
        cleanName.toLowerCase().includes(fileNameClean.toLowerCase().substring(0, 20))) {
      return path.join(MD_DIR, file);
    }
  }

  return null;
}

// Main import function
async function importNotion() {
  console.log('Starting Notion import...\n');

  // Check if files exist
  if (!fs.existsSync(CSV_FILE)) {
    console.error(`CSV file not found: ${CSV_FILE}`);
    process.exit(1);
  }

  // Read and parse CSV
  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
  const rows = parseCSV(csvContent);
  console.log(`Found ${rows.length} components in CSV\n`);

  const components: Component[] = [];
  const categoriesSet = new Set<string>();

  for (const row of rows) {
    const name = row['Name'];
    if (!name || !name.trim()) continue;

    console.log(`Processing: ${name}`);

    // Find markdown file
    const mdFile = findMarkdownFile(name);
    let html: string | null = null;
    let css: string | null = null;
    let js: string | null = null;
    let instructions: string | null = null;

    if (mdFile && fs.existsSync(mdFile)) {
      const mdContent = fs.readFileSync(mdFile, 'utf-8');
      const codeBlocks = extractCodeBlocks(mdContent);
      html = codeBlocks.html;
      css = codeBlocks.css;
      js = codeBlocks.js;
      instructions = extractInstructions(mdContent);
    }

    const tags = parseTags(row['Tags']);
    const platforms = parsePlatforms(row['Platform']);
    const category = determineCategory(name, tags);
    categoriesSet.add(category);

    const component: Component = {
      id: createSlug(name),
      name: name.trim(),
      slug: createSlug(name),
      category,
      tags,
      platforms: platforms.length > 0 ? platforms : ['GHL'],
      status: row['Status'] || 'Planning',
      previewUrl: row['Live Example (GHL)'] || row['Live Example (CF/Others)'] || null,
      description: null,
      html,
      css,
      js,
      instructions,
    };

    components.push(component);
  }

  // Create categories
  const categories: Category[] = Array.from(categoriesSet)
    .sort()
    .map(name => ({
      id: createSlug(name),
      name,
      slug: createSlug(name),
      icon: CATEGORY_ICONS[name] || '📦',
    }));

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_COMPONENTS);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output files
  fs.writeFileSync(OUTPUT_COMPONENTS, JSON.stringify(components, null, 2));
  fs.writeFileSync(OUTPUT_CATEGORIES, JSON.stringify(categories, null, 2));

  console.log(`\n✅ Import complete!`);
  console.log(`   Components: ${components.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Output: ${OUTPUT_COMPONENTS}`);

  // Stats
  const withCode = components.filter(c => c.css || c.html || c.js).length;
  const withInstructions = components.filter(c => c.instructions).length;
  console.log(`\n📊 Stats:`);
  console.log(`   With code: ${withCode}/${components.length}`);
  console.log(`   With instructions: ${withInstructions}/${components.length}`);
  console.log(`   Status breakdown:`);

  const statusCounts: Record<string, number> = {};
  components.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`     ${status}: ${count}`);
  });
}

// Run
importNotion().catch(console.error);
