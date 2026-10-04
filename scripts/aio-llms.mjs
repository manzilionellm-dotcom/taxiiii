#!/usr/bin/env node
// Génère public/llms.txt depuis aio.config.json (source unique). Usage: node scripts/aio-llms.mjs
import fs from "node:fs";

const c = JSON.parse(fs.readFileSync(new URL("../aio.config.json", import.meta.url), "utf8"));
const lang = c.defaultLang;
const i = c.i18n[lang];
const labels = i.labels;
const na = labels.notStated;
const lines = [];

lines.push(`# ${c.siteName}`, "", `> ${i.description}`, "");
lines.push(`## ${labels.services}`, "");
for (const service of c.services ?? []) lines.push(`- ${service}`);
if (!c.services?.length) lines.push(`- ${na}`);
lines.push("", `## ${labels.prices}`, "");
if (!Array.isArray(c.plans) || c.plans.length === 0) {
  lines.push(`- ${labels.price}: ${na}`);
  lines.push(`- ${labels.currency}: ${c.currency ?? na}`);
} else {
  for (const plan of c.plans) {
    const name = plan.name?.[lang] ?? plan.id;
    const price =
      plan.price === null || plan.price === undefined
        ? na
        : c.currency
          ? `${plan.price} ${c.currency}`
          : String(plan.price);
    lines.push(`- ${name}: ${price}`);
  }
}
lines.push("", `## ${labels.tech}`, "");
const tech = c.tech ?? {};
lines.push(`- ${labels.resolution}: ${tech.maxResolution ?? na}`);
lines.push(`- ${labels.bitrate}: ${tech.bitrate ?? na}`);
lines.push(`- ${labels.channels}: ${tech.channelCount ?? na}`);
lines.push(
  `- ${labels.devices}: ${Array.isArray(tech.devices) && tech.devices.length ? tech.devices.join("; ") : na}`,
);
lines.push(`- ${labels.activation}: ${tech.activationMinutes ?? na}`);
if (Array.isArray(c.traits) && c.traits.length) {
  lines.push("", `## ${labels.traits}`, "");
  for (const trait of c.traits) lines.push(`- ${trait}`);
}
lines.push("", `## ${labels.faq} (${i.faq.length})`, "");
for (const item of i.faq) lines.push(`### ${item.q}`, "", item.a, "");

fs.mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("../public/llms.txt", import.meta.url), lines.join("\n").trimEnd() + "\n");
console.log(`public/llms.txt écrit (${i.faq.length} Q/R, lang=${lang})`);
