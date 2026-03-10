const data = require("../src/data/components.json");

const noCode = data.filter(c => !c.css && !c.html && !c.js);

console.log(`=== ${noCode.length} Components with NO CODE ===\n`);

noCode.forEach((c, i) => {
  console.log(`${i + 1}. ${c.name}`);
  console.log(`   Slug: ${c.slug}`);
  console.log(`   Category: ${c.category}`);
  console.log(`   Status: ${c.status}`);
  console.log(`   Preview URL: ${c.previewUrl || "none"}`);
  console.log();
});
