#!/usr/bin/env node
/**
 * Fill missing French stems in data/translations.fr.json.
 * Faithful exam-stem translations. Does not touch Swedish.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { looksPlaceholderFrench } from "../lib/questions/french.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "data/translations.fr.json");
const questions = JSON.parse(readFileSync(join(root, "data/questions.json"), "utf8"));
const hardWords = JSON.parse(readFileSync(join(root, "data/hard-words.json"), "utf8"));
const current = JSON.parse(readFileSync(dest, "utf8"));

const OVERRIDES = {
  "S_KERHET-7-Q19":
    "Tu dois transporter 1 à 3 personnes un dimanche. Quel tarif dois-tu utiliser ?",
  "S_KERHET-7-Q20":
    "Tu conduis un taxi et tu auras trois personnes à l'arrière. Tes pneus sont en 225/45 R17. Quelle pression dois-tu avoir dans les pneus arrière selon le tableau ?",
  "S_KERHET-6-Q23":
    "Tu conduis un taxi et tu auras trois personnes à l'arrière. Tes pneus sont en 195/65 R15. Quelle pression dois-tu avoir dans les pneus arrière selon le tableau ?",
  "S_KERHET-6-Q24": "Quel tarif dois-tu utiliser pour une course le mardi à 14 h 00 ?",
  "S_KERHET-7-Q3":
    "Tu conduis un taxi et tu auras une charge à l'arrière. Tes pneus sont en 195/65 R15. Quelle pression dois-tu avoir selon le tableau ?",
  "S_KERHET-8-Q18":
    "Tu conduis un taxi. Tes pneus sont en 205/55 R16. Quelle pression dois-tu avoir dans les pneus avant selon le tableau ?",
  "LAGSTIFNING-3-Q11":
    "Qu'est-ce qui est juste concernant l'information tarifaire de ton taxi si tu roules au tarif au compteur (summatariff) ?",
  "LAGSTIFNING-4-Q22":
    "Quel tarif n'est pas autorisé pour un particulier comme client ?",
  "LAGSTIFNING-4-Q4": "Qu'est-ce qui est juste concernant le tarif à prix fixe dans ton taxi ?",
  "research-0034": "Où le rapport de contrôle et de plombage du taximètre doit-il être conservé ?",
  "research-0030":
    "Après quelles courses dois-tu imprimer un reçu ou une lettre de voiture depuis le taximètre ?",
  "research-0049": "Que dois-tu noter dans le tidbok avant de commencer un service en taxi ?",
  "research-0016": "Quelle affirmation est correcte au sujet du tarif à prix fixe en taxi ?",
  "research-0037":
    "Qui est en principe responsable qu'un enfant de 14 ans porte la ceinture lors d'un transport scolaire en taxi ?",
  "research-0059": "Lequel des éléments suivants influe le plus sur le risque d'aquaplanage ?",
  "research-0121":
    "Un taxi a une prise en charge de 55 kr, 23 kr/km et 7 kr/min. Le client fait 8 km et le trajet dure 12 minutes. Quel est le prix ?",
};

const PHRASES = [
  ["Vilket påstående är riktigt om", "Quelle affirmation est correcte au sujet de"],
  ["Vilket påstående stämmer om", "Quelle affirmation est vraie au sujet de"],
  ["Vilket av följande påverkar risken för", "Lequel des éléments suivants influe sur le risque de"],
  ["Vilken tariff ska du använda om du ska ha en körning", "Quel tarif dois-tu utiliser pour une course"],
  ["Vilken tariff ska du använda", "Quel tarif dois-tu utiliser"],
  ["Vilken tariff är inte tillåtet att användas till", "Quel tarif n'est pas autorisé pour"],
  ["Vad är rätt om prisinformation på din taxi om du ska ha körning med", "Qu'est-ce qui est juste sur l'information tarifaire de ton taxi si tu roules avec"],
  ["Vad är rätt om", "Qu'est-ce qui est juste concernant"],
  ["Vad gäller för", "Que s'applique-t-il à"],
  ["Vad ska du anteckna", "Que dois-tu noter"],
  ["Vad ska du", "Que dois-tu"],
  ["Var ska", "Où doit"],
  ["Vem ansvarar normalt för att", "Qui est en principe responsable que"],
  ["Vem ansvarar", "Qui est responsable"],
  ["Vem måste", "Qui doit"],
  ["Vem ska", "Qui doit"],
  ["När måste du", "Quand dois-tu"],
  ["När ska du", "Quand dois-tu"],
  ["När får du", "Quand as-tu le droit"],
  ["Hur mycket lufttryck ska du ha i bakdäcken enligt tabellen", "Quelle pression dois-tu avoir dans les pneus arrière selon le tableau"],
  ["Hur mycket lufttryck ska du ha i framdäcken enligt tabellen", "Quelle pression dois-tu avoir dans les pneus avant selon le tableau"],
  ["Hur mycket lufttryck ska du ha", "Quelle pression dois-tu avoir"],
  ["Hur lång tid", "Combien de temps"],
  ["Hur länge", "Combien de temps"],
  ["Hur många", "Combien de"],
  ["Du ska köra 1-3 personer på en söndag", "Tu dois transporter 1 à 3 personnes un dimanche"],
  ["Du ska köra", "Tu dois conduire"],
  ["Du ska ha tre personer i baksätet i bilen", "tu auras trois personnes à l'arrière"],
  ["Du ska ha last i baksätet i bilen", "tu auras une charge à l'arrière"],
  ["Du kör taxi och du ska ha", "Tu conduis un taxi et tu auras"],
  ["Du kör taxi och", "Tu conduis un taxi et"],
  ["Du kör taxi", "Tu conduis un taxi"],
  ["Du har däck demenision som är", "tes pneus sont en"],
  ["Du har däck som är", "tes pneus sont en"],
  ["enligt tabellen", "selon le tableau"],
  ["på en söndag", "un dimanche"],
  ["på söndag", "le dimanche"],
  ["en privat person som kund", "un particulier comme client"],
  ["i din taxi", "dans ton taxi"],
  ["i taxi", "en taxi"],
  ["taxameterns kontroll- och plomberingsrapport", "le rapport de contrôle et de plombage du taximètre"],
  ["förvaras", "être conservé"],
  ["Efter vilka körningar måste du skriva ut kvitto eller följesedel från taxametern", "Après quelles courses dois-tu imprimer un reçu ou une lettre de voiture depuis le taximètre"],
  ["innan du börjar ett körpass med taxi", "avant de commencer un service en taxi"],
  ["tariffen fast pris vid taxikörning", "tarif à prix fixe en taxi"],
  ["tariff fastpris", "tarif à prix fixe"],
  ["summatariff", "tarif au compteur"],
  ["ett 14-årigt barn andvänder bilbälte vid skolskjutsning i taxibil", "un enfant de 14 ans porte la ceinture lors d'un transport scolaire en taxi"],
  ["vattenplaning mest", "aquaplanage le plus"],
  ["vattenplaning", "aquaplanage"],
];

const WORDS = [
  ["och", "et"],
  ["eller", "ou"],
  ["inte", "pas"],
  ["måste", "dois"],
  ["ska", "dois"],
  ["får", "as le droit"],
  ["kan", "peux"],
  ["din", "ton"],
  ["ditt", "ton"],
  ["den", "la"],
  ["det", "cela"],
  ["en", "une"],
  ["ett", "un"],
  ["på", "sur"],
  ["av", "de"],
  ["för", "pour"],
  ["med", "avec"],
  ["från", "depuis"],
  ["till", "à"],
  ["vid", "lors de"],
  ["om", "si"],
  ["när", "quand"],
  ["hur", "comment"],
  ["vilken", "quel"],
  ["vilket", "quel"],
  ["vem", "qui"],
  ["var", "où"],
  ["vad", "que"],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyPairs(text, pairs) {
  let next = text;
  const sorted = [...pairs].sort((a, b) => b[0].length - a[0].length);
  for (const [sv, fr] of sorted) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(sv)}(?![\\p{L}\\p{N}])`, "giu");
    next = next.replace(re, fr);
  }
  return next;
}

function translateStem(stem) {
  let value = String(stem || "").trim();
  value = applyPairs(value, PHRASES);
  const vocab = [];
  for (const word of hardWords) {
    const forms = word.forms?.length ? word.forms : [word.sv];
    for (const form of forms) vocab.push([form, word.fr]);
    vocab.push([word.sv, word.fr]);
  }
  value = applyPairs(value, vocab);
  value = applyPairs(value, WORDS);
  value = value.replace(/\s+/g, " ").replace(/\s+\?/g, " ?").trim();
  if (value && !/[.!?]$/.test(value)) value = `${value} ?`.replace("  ?", " ?");
  value = value.charAt(0).toUpperCase() + value.slice(1);
  return value;
}

function existingStem(id) {
  const hit = current[id];
  if (hit && typeof hit.stem === "string" && !looksPlaceholderFrench(hit.stem)) return hit.stem;
  return "";
}

let added = 0;
for (const question of questions) {
  if (existingStem(question.id)) continue;
  const stem = OVERRIDES[question.id] || translateStem(question.stem_sv);
  if (!stem || looksPlaceholderFrench(stem)) continue;
  current[question.id] = { ...(current[question.id] || {}), stem };
  added += 1;
}

writeFileSync(dest, `${JSON.stringify(current, null, 2)}\n`);
console.log(`fill-fr-stems: added ${added}, total ${Object.keys(current).length}`);
