export interface CalculExercise {
  slug: string;
  titleSv: string;
  titleFr: string;
  formulaSv: string;
  formulaFr: string;
  exampleSv: string;
  exampleFr: string;
  fields: { name: string; labelSv: string; labelFr: string; unit?: string }[];
  compute: (values: Record<string, number>) => { result: number; unit: string; workSv: string; workFr: string };
  cloze: { sv: string; fr: string };
}

export const CALCUL_EXERCISES: CalculExercise[] = [
  {
    slug: "korekonomi",
    titleSv: "Körekonomi — bränsle och kostnad",
    titleFr: "Économie de conduite — carburant et coût",
    formulaSv: "Förbrukning (l/100 km) = (liter / km) × 100. Kostnad = liter × pris/liter.",
    formulaFr: "Consommation (l/100 km) = (litres / km) × 100. Coût = litres × prix/litre.",
    exampleSv:
      "En taxi kör 420 km och tankar 31,5 liter. Pris 18,40 kr/l. Förbrukning = 31,5 / 420 × 100 = 7,5 l/100 km. Kostnad = 31,5 × 18,40 = 579,60 kr.",
    exampleFr:
      "Un taxi parcourt 420 km et prend 31,5 l. Prix 18,40 kr/l. Conso = 31,5 / 420 × 100 = 7,5 l/100 km. Coût = 31,5 × 18,40 = 579,60 kr.",
    fields: [
      { name: "km", labelSv: "Körsträcka", labelFr: "Distance", unit: "km" },
      { name: "liters", labelSv: "Bränsle", labelFr: "Carburant", unit: "l" },
      { name: "price", labelSv: "Pris per liter", labelFr: "Prix au litre", unit: "kr" },
    ],
    compute: ({ km, liters, price }) => {
      const per100 = km > 0 ? (liters / km) * 100 : 0;
      const cost = liters * price;
      return {
        result: cost,
        unit: "kr",
        workSv: `${liters} / ${km} × 100 = ${per100.toFixed(2)} l/100 km. Kostnad ${liters} × ${price} = ${cost.toFixed(2)} kr.`,
        workFr: `${liters} / ${km} × 100 = ${per100.toFixed(2)} l/100 km. Coût ${liters} × ${price} = ${cost.toFixed(2)} kr.`,
      };
    },
    cloze: { sv: "förbrukning", fr: "consommation" },
  },
  {
    slug: "bemotande",
    titleSv: "Bemötande — ungefärligt respris (punkt 8)",
    titleFr: "Accueil — prix approximatif (point 8)",
    formulaSv: "Pris ≈ startavgift + (km × km-pris) + (minuter × tidspris).",
    formulaFr: "Prix ≈ prise en charge + (km × prix/km) + (minutes × prix/min).",
    exampleSv:
      "Start 45 kr, 12,50 kr/km, 6,50 kr/min. Resa 9 km, 16 min. 45 + 9×12,50 + 16×6,50 = 45 + 112,50 + 104 = 261,50 kr. Uppge alltid att beloppet är ungefärligt innan taxametern visar slutpris.",
    exampleFr:
      "Prise en charge 45 kr, 12,50 kr/km, 6,50 kr/min. Trajet 9 km, 16 min. 45 + 9×12,50 + 16×6,50 = 261,50 kr. Dire toujours que c'est une estimation avant le prix taximètre.",
    fields: [
      { name: "start", labelSv: "Startavgift", labelFr: "Prise en charge", unit: "kr" },
      { name: "km", labelSv: "Sträcka", labelFr: "Distance", unit: "km" },
      { name: "kmPrice", labelSv: "Pris per km", labelFr: "Prix par km", unit: "kr" },
      { name: "min", labelSv: "Tid", labelFr: "Durée", unit: "min" },
      { name: "minPrice", labelSv: "Pris per minut", labelFr: "Prix par minute", unit: "kr" },
    ],
    compute: ({ start, km, kmPrice, min, minPrice }) => {
      const result = start + km * kmPrice + min * minPrice;
      return {
        result,
        unit: "kr",
        workSv: `${start} + ${km}×${kmPrice} + ${min}×${minPrice} = ${result.toFixed(2)} kr (ungefärligt).`,
        workFr: `${start} + ${km}×${kmPrice} + ${min}×${minPrice} = ${result.toFixed(2)} kr (approximatif).`,
      };
    },
    cloze: { sv: "startavgift", fr: "prise en charge" },
  },
  {
    slug: "tid",
    titleSv: "Sträcka, hastighet och tid",
    titleFr: "Distance, vitesse et temps",
    formulaSv: "sträcka = hastighet × tid. tid = sträcka / hastighet. hastighet = sträcka / tid.",
    formulaFr: "distance = vitesse × temps. temps = distance / vitesse. vitesse = distance / temps.",
    exampleSv:
      "Du ska köra 84 km i medelhastighet 70 km/h. Tid = 84 / 70 = 1,2 h = 1 h 12 min.",
    exampleFr:
      "Tu dois parcourir 84 km à 70 km/h de moyenne. Temps = 84 / 70 = 1,2 h = 1 h 12 min.",
    fields: [
      { name: "km", labelSv: "Sträcka", labelFr: "Distance", unit: "km" },
      { name: "kmh", labelSv: "Medelhastighet", labelFr: "Vitesse moyenne", unit: "km/h" },
    ],
    compute: ({ km, kmh }) => {
      const hours = kmh > 0 ? km / kmh : 0;
      const minutes = hours * 60;
      return {
        result: minutes,
        unit: "min",
        workSv: `${km} / ${kmh} = ${hours.toFixed(2)} h = ${minutes.toFixed(0)} min.`,
        workFr: `${km} / ${kmh} = ${hours.toFixed(2)} h = ${minutes.toFixed(0)} min.`,
      };
    },
    cloze: { sv: "medelhastighet", fr: "vitesse moyenne" },
  },
  {
    slug: "vila",
    titleSv: "Dygnsvila och vilotid",
    titleFr: "Repos journalier et temps de repos",
    formulaSv:
      "Ordinarie dygnsvila = minst 11 timmar. Reducerad dygnsvila = minst 9 timmar (begränsat antal gånger). Tid från passets start till nästa start ≥ körtid + raster + dygnsvila.",
    formulaFr:
      "Repos journalier normal = 11 h min. Réduit = 9 h min (nombre limité). Délai entre deux prises de service ≥ conduite + pauses + repos.",
    exampleSv:
      "Passet slutar 02:30. Ordinarie dygnsvila 11 h ger tidigaste start 13:30. Reducerad 9 h ger 11:30.",
    exampleFr:
      "Le service finit à 02:30. Repos 11 h → reprise au plus tôt 13:30. Réduit 9 h → 11:30.",
    fields: [
      { name: "endHour", labelSv: "Passet slutar (timme 0–23)", labelFr: "Fin de service (heure 0–23)" },
      { name: "endMin", labelSv: "Minut", labelFr: "Minute" },
      { name: "rest", labelSv: "Dygnsvila", labelFr: "Repos journalier", unit: "h" },
    ],
    compute: ({ endHour, endMin, rest }) => {
      const start = ((endHour + rest) * 60 + endMin) % (24 * 60);
      const h = Math.floor(start / 60);
      const m = Math.round(start % 60);
      const clock = h + m / 100;
      return {
        result: clock,
        unit: "hh.mm",
        workSv: `Slut ${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")} + ${rest} h → tidigaste start ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}.`,
        workFr: `Fin ${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")} + ${rest} h → reprise ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}.`,
      };
    },
    cloze: { sv: "dygnsvila", fr: "repos journalier" },
  },
];

export function getExercise(slug: string) {
  return CALCUL_EXERCISES.find((item) => item.slug === slug);
}
