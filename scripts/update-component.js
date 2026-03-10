const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../src/data/components.json");
const data = require(dataPath);

const slug = process.argv[2];
const field = process.argv[3];
const value = process.argv.slice(4).join(" ");

if (!slug || !field) {
  console.log("Usage: node scripts/update-component.js <slug> <field> <value>");
  console.log("Fields: css, html, js, instructions, status");
  process.exit(1);
}

const idx = data.findIndex(c => c.slug === slug);
if (idx === -1) {
  console.log(`Component not found: ${slug}`);
  process.exit(1);
}

// Handle multiline input from stdin if value is "-"
if (value === "-") {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => input += chunk);
  process.stdin.on("end", () => {
    data[idx][field] = input.trim() || null;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log(`Updated ${slug}.${field}`);
  });
} else {
  data[idx][field] = value || null;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Updated ${slug}.${field} = "${value}"`);
}
