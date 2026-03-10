const data = require("../src/data/components.json");

// Group by status
const byStatus = {};
data.forEach(c => {
  byStatus[c.status] = byStatus[c.status] || [];
  byStatus[c.status].push(c);
});

console.log("=== 59 GHL Components by Status ===\n");

Object.keys(byStatus).sort().forEach(status => {
  const items = byStatus[status];
  const withCode = items.filter(c => c.css || c.html || c.js).length;

  console.log(`\n${status}: ${items.length} components (${withCode} with code)`);
  console.log("-".repeat(50));

  items.forEach(c => {
    const flags = [];
    if (c.css) flags.push("CSS");
    if (c.html) flags.push("HTML");
    if (c.js) flags.push("JS");
    const codeStr = flags.length > 0 ? flags.join("+") : "NO CODE";
    console.log(`  ${c.name} [${codeStr}]`);
  });
});

// Summary
console.log("\n\n=== SUMMARY ===");
console.log(`Total: ${data.length} components`);
console.log(`With CSS: ${data.filter(c => c.css).length}`);
console.log(`With HTML: ${data.filter(c => c.html).length}`);
console.log(`With JS: ${data.filter(c => c.js).length}`);
console.log(`No code: ${data.filter(c => !c.css && !c.html && !c.js).length}`);
