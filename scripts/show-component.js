const data = require("../src/data/components.json");
const slug = process.argv[2];

if (!slug) {
  console.log("Usage: node scripts/show-component.js <slug>");
  console.log("\nDone components:");
  data.filter(c => c.status === "Done").forEach(c => console.log(`  ${c.slug}`));
  process.exit(1);
}

const component = data.find(c => c.slug === slug);
if (!component) {
  console.log(`Component not found: ${slug}`);
  process.exit(1);
}

console.log("=".repeat(60));
console.log(`NAME: ${component.name}`);
console.log(`SLUG: ${component.slug}`);
console.log(`STATUS: ${component.status}`);
console.log(`CATEGORY: ${component.category}`);
console.log(`TAGS: ${component.tags.join(", ")}`);
console.log(`PREVIEW URL: ${component.previewUrl || "none"}`);
console.log("=".repeat(60));

console.log("\n--- CSS ---");
console.log(component.css || "(none)");

console.log("\n--- HTML ---");
console.log(component.html || "(none)");

console.log("\n--- JS ---");
console.log(component.js || "(none)");

console.log("\n--- INSTRUCTIONS ---");
console.log(component.instructions || "(none)");
