/** Official Taxi Företag practice QCMs (TSFS 2021:118 delprov 1–4). Public law only. */

import { OWNER_OFFICIAL_REST } from "./owner-official-rest.mjs";

function q({
  id,
  type,
  source,
  freq,
  trap,
  sv,
  fr,
  answer,
  note_sv,
  note_fr,
}) {
  return {
    id,
    topic: "agare",
    trackHint: "owner",
    corpus: "owner-official",
    type,
    source,
    ...(freq ? { freq } : {}),
    ...(trap ? { trap } : {}),
    sv,
    fr,
    answer,
    note_sv,
    note_fr,
  };
}

export const OWNER_OFFICIAL_ITEMS = [
  // ——— Delprov 1: Rättsregler (exam format + taxitrafiklag / förordning) ———
  q({
    id: "rs-off-prov-svenska",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 1 §",
    freq: "high",
    trap: "Valfritt språk / engelska räcker",
    sv: "På vilket språk ska provet i yrkeskunnande för taxitrafik genomföras? | Alt: A. Valfritt EU-språk | Alt: B. Svenska | Alt: C. Svenska eller engelska | Alt: D. Det språk Trafikverket erbjuder den dagen",
    fr: "Dans quelle langue passe-t-on l'épreuve de compétence taxi ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 1 §: «Provet i yrkeskunnande för taxitrafik ska genomföras på svenska.» Det gäller även kontrollprovet. Inget annat språk räknas som examinationsspråk.",
    note_fr:
      "TSFS 2021:118, ch. 2, art. 1 : l'épreuve se passe en suédois, y compris l'épreuve de contrôle.",
  }),
  q({
    id: "rs-off-prov-fyra-delprov",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 2 §",
    freq: "high",
    sv: "Hur är provet i yrkeskunnande för taxitrafik uppdelat? | Alt: A. Ett enda prov med 80 frågor | Alt: B. Fyra delprov som får genomföras i valfri ordning | Alt: C. Två delprov som måste göras samma dag | Alt: D. Tre delprov som måste göras i nummerordning",
    fr: "Comment l'épreuve d'exploitant est-elle découpée ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 2 §: provet omfattar kunskaperna i 2 kap. 8 § taxitrafiklagen och är uppdelat i 1) rättsregler, 2) företagsledning och ekonomisk ledning, 3) tekniska normer, driftsförhållanden och trafiksäkerhet, 4) fördjupade kunskaper om 1–3. Delproven får genomföras i valfri ordning. Delprov 4 är också kontrollprovet enligt 2 kap. 6 § andra stycket taxitrafikförordningen.",
    note_fr:
      "Quatre épreuves, ordre libre. La 4e est aussi l'épreuve de contrôle. TSFS 2021:118, ch. 2, art. 2.",
  }),
  q({
    id: "rs-off-prov-godkant-poang",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 3 §",
    freq: "high",
    trap: "Hälften rätt / 15 av 20",
    sv: "Hur många rätt krävs minst för godkänt på delprov 1–3 i yrkeskunnande för taxitrafik? | Alt: A. 10 av 20 | Alt: B. 12 av 20 | Alt: C. 15 av 20 | Alt: D. 18 av 20",
    fr: "Seuil de réussite des épreuves 1 à 3 ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 3 §: delprov 1–3 består av 20 frågor vardera; minst 12 rätta svar krävs. Dessutom finns 3 testfrågor per delprov som inte räknas in i resultatet. Trafikverket beskriver samma sak som 23 frågor varav högst 20 poäng.",
    note_fr:
      "12/20 minimum. Trois questions d'essai ne comptent pas. TSFS 2021:118, ch. 2, art. 3.",
  }),
  q({
    id: "rs-off-prov-tid-45",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 4 §",
    freq: "high",
    sv: "Hur lång är den ordinarie provtiden för delprov 1, 2 respektive 3? | Alt: A. 30 minuter | Alt: B. 45 minuter | Alt: C. 60 minuter | Alt: D. 120 minuter",
    fr: "Durée normale des épreuves 1 à 3 ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 4 §: provtiden för delprov 1–3 är 45 minuter vardera. Delprov 4 har 120 minuter. Förlängd tid (särskilda skäl) är 65 respektive 180 minuter enligt 5 §.",
    note_fr:
      "45 minutes chacun. La 4e dure 120 minutes. TSFS 2021:118, ch. 2, art. 4.",
  }),
  q({
    id: "rs-off-prov-sex-manader",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 7 §",
    freq: "high",
    trap: "En månad som för buss/gods",
    sv: "Inom vilken tid måste samtliga delprov i yrkeskunnande för taxitrafik vara godkända? | Alt: A. Inom en månad från första godkända delprov | Alt: B. Inom sex månader från och med datumet för det först godkända delprovet | Alt: C. Inom ett år från anmälan | Alt: D. Ingen tidsgräns",
    fr: "Dans quel délai valider les quatre épreuves ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 7 §: för godkänt prov krävs att samtliga delprov är godkända inom sex månader från och med datumet för det först godkända delprovet. Trafikverket upprepar samma sexmånadersregel. (Yrkestrafik buss/gods har en annan, kortare tidsregel — blanda inte ihop dem.)",
    note_fr:
      "Six mois à compter de la première épreuve réussie. TSFS 2021:118, ch. 2, art. 7.",
  }),
  q({
    id: "rs-off-prov-ej-igen",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 8 §",
    freq: "medium",
    sv: "Får den som redan är godkänd i prov i yrkeskunnande för taxitrafik göra provet igen? | Alt: A. Ja, en gång per år | Alt: B. Nej | Alt: C. Ja, om tillståndet ännu inte sökts | Alt: D. Ja, om delprov 4 är äldre än tre år",
    fr: "Peut-on repasser l'épreuve déjà réussie ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 8 §: «Den som redan har blivit godkänd i prov i yrkeskunnande får inte göra provet igen.»",
    note_fr: "Non. TSFS 2021:118, ch. 2, art. 8.",
  }),
  q({
    id: "rs-off-prov-id-handling",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 14–15 §§",
    freq: "medium",
    trap: "Valfritt fotolegitimation",
    sv: "Vilken av följande är en godtagbar identitetshandling vid prov i yrkeskunnande för taxitrafik? | Alt: A. Ett vanligt bankkort med foto | Alt: B. Svenskt körkort | Alt: C. En kopia av passet i mobilen | Alt: D. Ett intyg från arbetsgivaren",
    fr: "Quelle pièce d'identité est acceptée à l'examen ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 14–15 §§: deltagaren ska kunna identifiera sig med giltig och godtagbar handling. Godtagbara är bland annat SIS-märkt företagskort/tjänstekort/identitetskort, svenskt nationellt identitetskort, identitetskort från Skatteverket, svenskt körkort, EU-pass samt pass från Förenade kungariket, Island, Liechtenstein, Norge eller Schweiz. Handlingar med radering, ändring eller fotografi som inte är välliknande godtas inte (16 §).",
    note_fr:
      "Permis suédois, passeport UE, carte d'identité Skatteverket, etc. TSFS 2021:118, ch. 2, art. 14–15.",
  }),
  q({
    id: "rs-off-prov-hinder-sen",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 17 §",
    freq: "medium",
    sv: "Vilket av följande utgör hinder för prov enligt TSFS 2021:118? | Alt: A. Att deltagaren kommer för tidigt | Alt: B. Att deltagaren inte kommer i tid till provet | Alt: C. Att deltagaren har godkänt delprov sedan tidigare | Alt: D. Att deltagaren saknar taxiförarlegitimation",
    fr: "Qu'est-ce qui empêche de passer l'épreuve ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 17 §: hinder är bland annat att deltagaren inte kommer i tid, inte kan identifiera sig, inte lämnat försäkran enligt 9 §, inte följer 10 §, eller av annan omständighet inte bör genomföra provet. Allmänna råd: våld, hot eller störande uppträdande. Vid hinder ska deltagaren få ett skriftligt beslut (18 §).",
    note_fr:
      "Retard, absence d'identité ou de déclaration, etc. TSFS 2021:118, ch. 2, art. 17.",
  }),
  q({
    id: "rs-off-prov-avbokning-24",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 12 §",
    freq: "medium",
    sv: "När ska provavgiften ändå betalas även om provet inte genomförs? | Alt: A. Aldrig, avgiften återbetalas alltid | Alt: B. Om det funnits hinder för prov eller om provtiden avbokats senare än 24 timmar i förväg, om inte sjukdom eller liknande visas | Alt: C. Bara om deltagaren fuskat | Alt: D. Bara om delprov 4 avbokas",
    fr: "Quand la taxe d'examen reste due ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 12 §: avgiften ska betalas även om provet inte genomförts på grund av hinder enligt 17 § eller avbokning senare än 24 timmar i förväg. Undantag om personen kan visa att frånvaron berodde på sjukdom eller liknande omständighet. Obetalda avgifter spärrar nytt prov (13 §).",
    note_fr:
      "Oui si obstacle ou annulation < 24 h, sauf maladie. TSFS 2021:118, ch. 2, art. 12.",
  }),
  q({
    id: "rs-off-tv-utformar-anordnar",
    type: "delprov-1",
    source: "SFS 2012:238 2 kap. 2 §",
    freq: "high",
    trap: "Transportstyrelsen utformar, Trafikverket anordnar (äldre ordning)",
    sv: "Vem utformar och anordnar de skriftliga proven i yrkeskunnande för taxitrafiktillstånd enligt nuvarande taxitrafikförordning? | Alt: A. Transportstyrelsen utformar och anordnar | Alt: B. Trafikverket utformar och anordnar | Alt: C. Kommunen utformar, Trafikverket anordnar | Alt: D. Svenska Taxiförbundet utformar och anordnar",
    fr: "Qui conçoit et organise l'épreuve aujourd'hui ?",
    answer: "B",
    note_sv:
      "Taxitrafikförordningen (2012:238) 2 kap. 2 § i nuvarande lydelse (efter SFS 2022:475/2022:1481): «Trafikverket utformar och anordnar skriftliga prov i yrkeskunnande enligt 2 kap. 8 § taxitrafiklagen.» Den som försöker vilseleda stängs av ett eller två år. Avstängning prövas av Trafikverket (3 §).",
    note_fr:
      "Trafikverket conçoit et organise. SFS 2012:238, ch. 2, art. 2 (texte actuel).",
  }),
  q({
    id: "rs-off-avstangning-1-2",
    type: "delprov-1",
    source: "SFS 2012:238 2 kap. 2 §",
    freq: "medium",
    sv: "Hur länge ska den stängas av som försöker vilseleda vid prov i yrkeskunnande för taxitrafik? | Alt: A. Tre månader | Alt: B. Ett eller två år från tidpunkten för försöket | Alt: C. Alltid fem år | Alt: D. Tills Transportstyrelsen medger nytt prov",
    fr: "Durée d'exclusion en cas de fraude ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 2 kap. 2 §: den som genom otillåtna hjälpmedel eller på annat sätt försöker vilseleda ska stängas av under ett eller två år. Vid bedömningen beaktas hur allvarlig överträdelsen varit och hur svårupptäckt vilseledandet varit. Frågor om avstängning prövas av Trafikverket (3 §).",
    note_fr: "Un ou deux ans. SFS 2012:238, ch. 2, art. 2.",
  }),
  q({
    id: "rs-off-def-taxitrafik",
    type: "delprov-1",
    source: "SFS 2012:211 1 kap. 1 §",
    freq: "high",
    sv: "Vad avses med taxitrafik enligt taxitrafiklagen? | Alt: A. All yrkesmässig persontrafik oavsett fordon | Alt: B. Yrkesmässig trafik med personbil eller lätt lastbil där fordon och förare mot betalning ställs till allmänhetens förfogande för transport av personer | Alt: C. Bara körning som bokats via app | Alt: D. Bara körning med gul skylt i tätort",
    fr: "Définition légale du taxitrafik ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 1 kap. 1 §: taxitrafik är trafik som bedrivs yrkesmässigt med personbil eller lätt lastbil och som innebär att fordon och förare mot betalning ställs till allmänhetens förfogande för transport av personer. Taxiförarlegitimation är handlingen som ger behörighet att föra fordon i taxitrafik.",
    note_fr:
      "Voiture ou utilitaire léger, mis à disposition du public contre paiement. SFS 2012:211, ch. 1, art. 1.",
  }),
  q({
    id: "rs-off-ej-taxitrafik-undantag",
    type: "delprov-1",
    source: "SFS 2012:238 1 kap. 3 §",
    freq: "medium",
    sv: "Vilken av följande transporter räknas inte som taxitrafik? | Alt: A. En appbokad personresa mot betalning med personbil | Alt: B. Transport av skolelever mellan bostad och skola som utförs av en förälder eller annan anhörig till någon av eleverna | Alt: C. En sjukresa som körs av ett taxiföretag mot ersättning | Alt: D. En flygplatstransfer som ställs till allmänheten",
    fr: "Quelle course n'est pas du taxitrafik ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 1 kap. 3 §: som taxitrafik anses inte 1) transport till/från arbetsplats, skola eller annan lokal där föraren eller passageraren arbetar eller utbildar sig, i samband med att föraren själv färdas dit, 2) transport med personbil av skolelever mellan bostad och skola (eller del av sträckan) som utförs av förälder eller annan anhörig till någon av eleverna, 3) transport med utryckningsfordon.",
    note_fr:
      "Trajet scolaire familial, covoiturage domicile-travail du conducteur, véhicule d'urgence. SFS 2012:238, ch. 1, art. 3.",
  }),
  q({
    id: "rs-off-gott-anseende",
    type: "delprov-1",
    source: "SFS 2012:211 2 kap. 11 §",
    freq: "high",
    sv: "Vad ska beaktas vid prövningen av kravet på gott anseende för taxitrafiktillstånd? | Alt: A. Bara om sökanden har körkort | Alt: B. Sökandens vilja och förmåga att fullgöra skyldigheter mot det allmänna, laglydnad i övrigt och andra omständigheter av betydelse | Alt: C. Bara antalet anställda | Alt: D. Bara om sökanden har F-skatt",
    fr: "Que recouvre la bonne réputation ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 11 §: vid prövningen av gott anseende ska sökandens vilja och förmåga att fullgöra skyldigheter mot det allmänna, laglydnad i övrigt och andra omständigheter av betydelse beaktas. Kravet anses inte uppfyllt vid allvarligt brott (även ekonomiskt) eller allvarliga/upprepade överträdelser av taxitrafiklagen, vägtrafikregler (särskilt vilotid, vikt, utrustning, miljö) eller bestämmelser om löne- och anställningsförhållanden.",
    note_fr:
      "Devoirs envers le public, respect de la loi, infractions graves. SFS 2012:211, ch. 2, art. 11.",
  }),
  q({
    id: "rs-off-olamplig-avslag-6-5",
    type: "delprov-1",
    source: "SFS 2012:211 2 kap. 12 §",
    freq: "high",
    trap: "Tre till fem år (det är vid återkallelse)",
    sv: "Vilken olämplighetstid ska bestämmas om en ansökan om taxitrafiktillstånd avslås på grund av bristande gott anseende enligt 2 kap. 11 §? | Alt: A. Lägst tre och högst fem år | Alt: B. Lägst sex månader och högst fem år | Alt: C. Alltid tio år | Alt: D. Ingen tid, sökanden får söka om nästa dag",
    fr: "Durée d'interdiction après un refus pour réputation ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 12 §: vid avslag på grund av omständigheter i 11 § ska en tid på lägst sex månader och högst fem år bestämmas. Transportstyrelsen: under olämplighetstiden kan personen inte ansöka på nytt. Vid återkallelse enligt 4 kap. 3 § är intervallet i stället lägst tre och högst fem år — blanda inte ihop de två tiderna.",
    note_fr:
      "6 mois à 5 ans après refus ; 3 à 5 ans après retrait. SFS 2012:211, ch. 2, art. 12.",
  }),
  q({
    id: "rs-off-villkor-sarskilda",
    type: "delprov-1",
    source: "SFS 2012:211 2 kap. 13 §",
    freq: "medium",
    sv: "När får ett taxitrafiktillstånd förenas med villkor? | Alt: A. Aldrig, tillståndet är alltid villkorslöst | Alt: B. Om det finns särskilda skäl, både när tillstånd ges och senare under tillståndstiden | Alt: C. Bara om kommunen begär det | Alt: D. Bara vid första förnyelsen efter fem år",
    fr: "Peut-on assortir le permis de conditions ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 13 §: taxitrafiktillstånd får förenas med villkor om det finns särskilda skäl. Villkor får beslutas både när tillstånd ges och senare under tillståndstiden. En tillståndshavare som uppsåtligen eller av oaktsamhet bryter mot villkor döms till böter (5 kap. 1 § andra stycket).",
    note_fr:
      "Oui, motifs particuliers, à la délivrance ou plus tard. SFS 2012:211, ch. 2, art. 13.",
  }),
  q({
    id: "rs-off-jp-provningskrets",
    type: "delprov-1",
    source: "SFS 2012:211 2 kap. 6 §",
    freq: "high",
    sv: "Vems lämplighet prövas när sökanden är en juridisk person? | Alt: A. Bara den anställde föraren | Alt: B. Trafikansvariga, och därutöver (utom yrkeskunnande) den juridiska personen samt bland annat VD, vissa styrelseledamöter och bolagsmän | Alt: C. Bara revisorn | Alt: D. Bara kommunens näringslivskontor",
    fr: "Qui est examiné dans une personne morale ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 6 §: för juridiska personer avser prövningen enligt 5 § första stycket den eller de som är trafikansvariga. Därutöver ska, utom yrkeskunnande, prövningen avse den juridiska personen samt 1) VD och annan med bestämmande inflytande, 2) styrelseledamöter/suppleanter med väsentlig ekonomisk gemenskap, 3) bolagsmän i HB/KB. Byte eller tillkomst prövas på nytt (7 §).",
    note_fr:
      "Responsables trafic + cercle de contrôle (sauf le savoir-faire pour la société). SFS 2012:211, ch. 2, art. 6.",
  }),
  q({
    id: "rs-off-ekonomi-beakta",
    type: "delprov-1",
    source: "SFS 2012:238 2 kap. 7 §",
    freq: "medium",
    sv: "Vad ska särskilt beaktas vid prövningen av sökandens ekonomiska resurser? | Alt: A. Bara antalet anställda | Alt: B. Tillgängliga medel och krediter, tillgångar som kan användas som säkerhet, kostnader för start samt behovet av rörelsekapital | Alt: C. Bara senaste årslönen | Alt: D. Bara att F-skatt finns",
    fr: "Que regarde-t-on dans la solvabilité ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 2 kap. 7 §: särskilt ska beaktas 1) tillgängliga medel inräknat sparmedel, krediter och lån, 2) alla tillgångar inräknat egendom som kan utnyttjas som säkerhet, 3) kostnader inräknat inköp eller första betalning för fordon, lokaler, anläggningar och utrustning, 4) behovet av rörelsekapital. Prövningen får göras på redovisning, deklaration, finansieringsplan eller budget; revisorsintyg eller bankbekräftelse får godtas (8 §).",
    note_fr:
      "Liquidités, sûretés, coûts de démarrage, fonds de roulement. SFS 2012:238, ch. 2, art. 7.",
  }),
  q({
    id: "rs-off-trafikansvarig-ideell",
    type: "delprov-1",
    source: "SFS 2012:211 2 kap. 4 §",
    freq: "medium",
    sv: "Vem är trafikansvarig i en ideell förening eller stiftelse som har taxitrafiktillstånd? | Alt: A. Varje medlem | Alt: B. Den styrelseledamot som föreningen eller stiftelsen har utsett | Alt: C. Bara revisorn | Alt: D. Kommunens ordförande",
    fr: "Qui est traficansvarig dans une association ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 4 § 3: i ideella föreningar och stiftelser är den styrelseledamot som föreningen eller stiftelsen har utsett trafikansvarig. Prövningsmyndigheten får med särskilda skäl medge att någon annan är trafikansvarig, eller att kommanditdelägare undantas.",
    note_fr:
      "L'administrateur désigné. SFS 2012:211, ch. 2, art. 4.",
  }),
  q({
    id: "rs-off-anmal-trafikansvarig-byte",
    type: "delprov-1",
    source: "SFS 2012:238 2 kap. 10 §",
    freq: "high",
    sv: "Vad ska tillståndshavaren göra om den trafikansvarige byts ut? | Alt: A. Ingenting, det räcker att Bolagsverket får besked | Alt: B. Anmäla bytet till Transportstyrelsen | Alt: C. Bara meddela Skatteverket | Alt: D. Vänta till nästa årsredovisning",
    fr: "Changement de traficansvarig : que faire ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 2 kap. 10 §: tillståndshavaren ska till Transportstyrelsen anmäla om den eller de som är trafikansvariga eller någon annan som lämplighetsprövningen ska avse byts ut, eller om någon sådan person tillkommer. Underlåten anmälan ger sanktionsavgift 10 000 kronor (7 kap. 4 §).",
    note_fr:
      "Déclarer à Transportstyrelsen. SFS 2012:238, ch. 2, art. 10.",
  }),
  q({
    id: "rs-off-sanktion-10000-forordning",
    type: "delprov-1",
    source: "SFS 2012:238 7 kap. 4 §",
    freq: "high",
    sv: "Vilken sanktionsavgift ska påföras den tillståndshavare som inte anmäler byte av trafikansvarig enligt 2 kap. 10 § taxitrafikförordningen? | Alt: A. 1 000 kronor | Alt: B. 6 000 kronor | Alt: C. 10 000 kronor | Alt: D. Ingen avgift, bara erinran",
    fr: "Amende si le changement de responsable n'est pas déclaré ?",
    answer: "C",
    note_sv:
      "SFS 2012:238 7 kap. 4 §: en sanktionsavgift om 10 000 kronor ska påföras den tillståndshavare som inte följer krav på anmälan i 2 kap. 10 §. Frågor om avgift prövas av Transportstyrelsen efter yttrande (8 §). Avgiften ska betalas inom 30 dagar efter laga kraft (9 §).",
    note_fr: "10 000 kr. SFS 2012:238, ch. 7, art. 4.",
  }),
  q({
    id: "rs-off-sanktion-6000-forordning",
    type: "delprov-1",
    source: "SFS 2012:238 7 kap. 5–6 §§",
    freq: "high",
    sv: "Vilken sanktionsavgift ska påföras den som använder ett fordon i taxitrafik innan korrekt anmälan kommit in, eller som inte avanmäler fordon i tid? | Alt: A. 10 000 kronor | Alt: B. 6 000 kronor | Alt: C. 50 000 kronor | Alt: D. Alltid fängelse",
    fr: "Amende pour véhicule non déclaré / non retiré ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 7 kap. 5 §: 6 000 kronor om tillståndshavaren 1) använder fordon i strid med 4 kap. 8 §, eller 2) inte följer anmälan i 4 kap. 9 §. Första gången avanmälan uteblir ska varning meddelas i stället (6 §). Avgiften får sättas ned vid särskilda skäl (7 §).",
    note_fr:
      "6 000 kr ; avertissement la première fois pour l'avanmälan. SFS 2012:238, ch. 7, art. 5–6.",
  }),
  q({
    id: "rs-off-sanktion-preskription",
    type: "delprov-1",
    source: "SFS 2012:238 7 kap. 10–11 §§",
    freq: "low",
    sv: "När får en sanktionsavgift enligt taxitrafikförordningen inte längre påföras? | Alt: A. Redan efter 30 dagar | Alt: B. Om mer än två år gått från förutsättningarna utan att den berörde getts tillfälle att yttra sig | Alt: C. Aldrig, avgiften är impreskriptibel | Alt: D. Efter tio år",
    fr: "Prescription de l'amende administrative ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 7 kap. 10 §: sanktionsavgift får inte påföras om mer än två år gått från den tidpunkt då förutsättningarna uppfylldes utan att den som anspråket riktats mot getts tillfälle att yttra sig. Avgiften faller bort om beslutet inte verkställts inom fem år från laga kraft (11 §).",
    note_fr:
      "Deux ans sans invitation à s'exprimer ; cinq ans pour l'exécution. SFS 2012:238, ch. 7, art. 10–11.",
  }),
  q({
    id: "rs-off-tfl-krav-20",
    type: "delprov-1",
    source: "SFS 2012:211 3 kap. 3 §",
    freq: "high",
    sv: "Vilket ålders- och körkortskrav gäller normalt för taxiförarlegitimation? | Alt: A. 18 år och körkort B samma dag | Alt: B. Fyllt 20 år och körkort B sedan minst två år, eller körkort D | Alt: C. 21 år och körkort C | Alt: D. 16 år med handledare",
    fr: "Âge et permis pour la carte professionnelle ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 3 kap. 3 §: TFL får ges till den som 1) fyllt 20 år, 2) har körkort B sedan minst två år eller körkort D, 3) uppfyller medicinska krav, 4) är lämplig i yrkeskompetens och laglydnad, 5) avlagt godkänt körprov. Undantag: 18 år + körkort B efter godkänd YKB-grundutbildning för D/DE i gymnasiet. Kravet på två år B gäller inte den som under de tre senaste åren haft TFL och har körkort B.",
    note_fr:
      "20 ans et permis B depuis 2 ans, ou permis D. SFS 2012:211, ch. 3, art. 3.",
  }),
  q({
    id: "rs-off-tfl-med-korkort",
    type: "delprov-1",
    source: "SFS 2012:211 3 kap. 10 §",
    freq: "high",
    sv: "Från vilken tidpunkt gäller en taxiförarlegitimation, och med vilket villkor? | Alt: A. Från ansökningsdagen, även utan körkort | Alt: B. Från och med den tidpunkt då den lämnas ut och endast tillsammans med ett giltigt körkort | Alt: C. Tills vidare även om körkortet återkallas | Alt: D. Bara under de tre första åren",
    fr: "Quand la carte professionnelle est-elle valable ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 3 kap. 10 §: en taxiförarlegitimation gäller från och med den tidpunkt då den lämnas ut och endast tillsammans med ett giltigt körkort. Den gäller inte om den inte förnyats efter föreläggande, är återkallad/omhändertagen, eller om en annan TFL lämnats ut till samma innehavare (11 §).",
    note_fr:
      "Dès la remise, uniquement avec un permis valide. SFS 2012:211, ch. 3, art. 10.",
  }),
  q({
    id: "rs-off-tfl-synlig",
    type: "delprov-1",
    source: "SFS 2012:238 3 kap. 13 §",
    freq: "high",
    sv: "Hur ska taxiförarlegitimationen medföras i taxitrafik? | Alt: A. Bara i fordonets handskfack | Alt: B. Den ska medföras och vara väl synlig för passagerarna samt visas upp för polisman eller bilinspektör på begäran | Alt: C. Bara en kopia i telefonen räcker | Alt: D. Den ska lämnas till Transportstyrelsen under körning",
    fr: "Où doit être la carte professionnelle ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 3 kap. 13 §: en giltig taxiförarlegitimation ska medföras i taxitrafik och vara väl synlig för passagerarna. Den ska visas upp för bilinspektör eller polisman om han eller hon begär det. Brott mot 13 § ger penningböter (7 kap. 1 §).",
    note_fr:
      "Visible des passagers, à présenter. SFS 2012:238, ch. 3, art. 13.",
  }),
  q({
    id: "rs-off-tfl-fornya-10",
    type: "delprov-1",
    source: "SFS 2012:211 3 kap. 12 §",
    freq: "medium",
    sv: "När ska en taxiförarlegitimation förnyas med nya uppgifter? | Alt: A. Varje år | Alt: B. Inom tio år efter det att den har utfärdats eller senast förnyats med nya uppgifter | Alt: C. Aldrig, den gäller livstid | Alt: D. Bara om fordonet byts",
    fr: "Renouvellement de la carte professionnelle ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 3 kap. 12 §: TFL ska förnyas inom tio år efter utfärdande eller senaste förnyelse med nya uppgifter. Förnyelse utan nya uppgifter ändrar inte den ursprungliga giltighetstiden. Legitimationen ska också förnyas om den förstörts, kommit bort eller om någon uppgift ändrats.",
    note_fr: "Tous les dix ans (nouvelles données). SFS 2012:211, ch. 3, art. 12.",
  }),
  q({
    id: "rs-off-tfl-korprov-12",
    type: "delprov-1",
    source: "SFS 2012:238 3 kap. 4 och 11 §§",
    freq: "medium",
    sv: "Hur färskt ska körprovet respektive det skriftliga yrkeskompetensprovet vara när någon söker taxiförarlegitimation? | Alt: A. Körprov högst 12 månader, skriftligt prov högst tre år före ansökan | Alt: B. Båda måste vara från samma vecka | Alt: C. Ingen tidsgräns | Alt: D. Körprov högst tio år, skriftligt prov högst ett år",
    fr: "Délais de validité des épreuves chauffeur ?",
    answer: "A",
    note_sv:
      "SFS 2012:238 3 kap. 4 §: godkänt körprov tidigast 12 månader innan ansökan ges in. 3 kap. 11 §: godkänt skriftligt prov i yrkeskompetens tidigast tre år innan ansökan ges in. Körprovet avser bland annat passagerarsäkerhet, landsvägs- och gatutrafik, att hitta till resmål samt sinnesnärvaro (7 §).",
    note_fr:
      "Conduite ≤ 12 mois, théorie ≤ 3 ans. SFS 2012:238, ch. 3, art. 4 et 11.",
  }),
  q({
    id: "rs-off-olaga-vs-otillaten",
    type: "delprov-1",
    source: "SFS 2012:211 5 kap. 1–2 §§",
    freq: "medium",
    sv: "Vad skiljer olaga taxitrafik från otillåten taxitrafik? | Alt: A. Inget, begreppen är identiska | Alt: B. Olaga taxitrafik är att uppsåtligen bedriva taxitrafik utan tillstånd (böter eller fängelse högst ett år); otillåten taxitrafik är uppsåtlig persontransport mot ersättning efter erbjudande till allmänheten utan tillstånd, om gärningen inte är straffbar som olaga taxitrafik (böter) | Alt: C. Otillåten taxitrafik ger alltid fängelse i två år | Alt: D. Olaga taxitrafik gäller bara gods",
    fr: "Olaga ou otillåten taxitrafik ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 5 kap. 1 §: olaga taxitrafik — uppsåtligen bedriva taxitrafik utan tillstånd: böter eller fängelse högst ett år. 2 §: otillåten taxitrafik — uppsåtligen utan tillstånd utföra persontransport med personbil eller lätt lastbil mot ersättning efter erbjudande om körning till allmänheten, om gärningen inte är straffbar enligt 1 §: böter.",
    note_fr:
      "Olaga = exploitation sans permis (prison ≤ 1 an). Otillåten = offre au public (amende). SFS 2012:211, ch. 5, art. 1–2.",
  }),
  q({
    id: "rs-off-bestallaransvar",
    type: "delprov-1",
    source: "SFS 2012:211 5 kap. 3 §",
    freq: "medium",
    sv: "När kan den som yrkesmässigt beställt en transport dömas för att taxitrafik bedrivits utan tillstånd? | Alt: A. Aldrig, bara föraren ansvarar | Alt: B. Om beställaren kände till eller hade skälig anledning anta att tillstånd saknades, eller av oaktsamhet inte kontrollerat innehavet på ett sätt som skäligen kan begäras | Alt: C. Bara om beställaren själv körde | Alt: D. Bara om kommunen anmält saken",
    fr: "Responsabilité du donneur d'ordre ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 5 kap. 3 § (beställaransvar): den som yrkesmässigt för egen eller annans räkning beställt transporten döms till böter eller fängelse högst ett år om 1) han vid beställningen kände till eller hade skälig anledning anta att tillstånd saknades, eller 2) beställt av trafikutövaren och uppsåtligen eller av oaktsamhet inte kontrollerat innehavet vid transporten på ett sätt som skäligen kan begäras.",
    note_fr:
      "Oui si connaissance, motif de le croire, ou défaut de contrôle. SFS 2012:211, ch. 5, art. 3.",
  }),
  q({
    id: "rs-off-overklaga-prov-nej",
    type: "delprov-1",
    source: "SFS 2012:211 6 kap. 2 §",
    freq: "medium",
    sv: "Vilket beslut får inte överklagas? | Alt: A. Avslag på taxitrafiktillstånd | Alt: B. Beslut i fråga om skriftliga prov i yrkeskunnande eller yrkeskompetens | Alt: C. Återkallelse av tillstånd | Alt: D. Sanktionsavgift",
    fr: "Quelle décision n'est pas susceptible de recours ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 6 kap. 2 §: följande får inte överklagas: 1) beslut i fråga om skriftliga prov enligt 2 kap. 8 § eller 3 kap. 7 §, 2) beslut i fråga om körprov för TFL, 3) beslut om omhändertagande av TFL enligt 4 kap. 9 §. Övriga beslut överklagas till allmän förvaltningsdomstol (1 §). Prövningstillstånd krävs i kammarrätt (4 §).",
    note_fr:
      "Les décisions d'épreuve écrite / de conduite. SFS 2012:211, ch. 6, art. 2.",
  }),
  q({
    id: "rs-off-beslut-omedelbart",
    type: "delprov-1",
    source: "SFS 2012:211 6 kap. 6 §",
    freq: "medium",
    sv: "När börjar ett beslut enligt taxitrafiklagen att gälla? | Alt: A. Först när kammarrätten sagt sitt | Alt: B. Omedelbart, om inte annat förordnas | Alt: C. Efter tre månader | Alt: D. Bara när det kungjorts i Post- och Inrikes Tidningar",
    fr: "Un décision est-elle immédiatement exécutoire ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 6 kap. 6 §: ett beslut enligt lagen eller föreskrifter i anslutning till lagen ska gälla omedelbart, om inte annat förordnas. Transportstyrelsen: tillståndet gäller från den dag beslutet fattats och registreras samma dag i vägtrafikregistret. Överklagande ska ske inom tre veckor från delgivning och skickas till Transportstyrelsen men ställs till förvaltningsrätten.",
    note_fr:
      "Immédiatement, sauf décision contraire. SFS 2012:211, ch. 6, art. 6.",
  }),
  q({
    id: "rs-off-prisuppgift-nar-bestalls",
    type: "delprov-1",
    source: "SFS 2012:211 2 kap. 21 §",
    freq: "high",
    sv: "När ska den bindande prisuppgiften lämnas till beställaren, och vad ska passageraren få före färden? | Alt: A. Efter färden, bara muntligt | Alt: B. Prisuppgiften lämnas när färden beställs; ett bevis om prisuppgiften ska lämnas till passageraren före färden och bevaras hos föraren och tillståndshavaren | Alt: C. Bara om kunden betalar kontant | Alt: D. Aldrig om taxameter används",
    fr: "Quand donner le prix plafond et la preuve ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 21 §: prisuppgiften ska lämnas till beställaren när färden beställs. Ett bevis om prisuppgiften ska lämnas till passageraren före färden och ska bevaras hos taxiföraren och tillståndshavaren. Prisuppgift behövs när jämförpriset överstiger 1,2 procent av prisbasbeloppet (avrundat nedåt till närmaste tiotal kronor) och inte när fast pris tillämpas (20 §).",
    note_fr:
      "À la commande ; preuve au passager avant le départ. SFS 2012:211, ch. 2, art. 21.",
  }),
  q({
    id: "rs-off-jamforpris-gult",
    type: "delprov-1",
    source: "TSFS 2013:41 6 kap. 9 §",
    freq: "medium",
    sv: "Hur ska jämförpriset anges på prisinformationen i fordonet? | Alt: A. Vit text mot svart bakgrund | Alt: B. Svart text mot gul bakgrund; övrig bakgrund ska vara vit | Alt: C. Valfri färg | Alt: D. Bara i taxameterns display",
    fr: "Couleurs du jämförpris sur l'étiquette ?",
    answer: "B",
    note_sv:
      "TSFS 2013:41 6 kap. 9 §: jämförpris på prisinformationen ska anges med svart text mot gul bakgrund. Övrig bakgrund på prisinformationen ska vara vit. Jämförpris ska anges för varje tariff där fast pris inte tillämpas (5 §). Timtaxa i kr/timme, kilometertaxa i kr/km (6 §).",
    note_fr:
      "Noir sur jaune ; fond blanc pour le reste. TSFS 2013:41, ch. 6, art. 9.",
  }),
  q({
    id: "rs-off-kontrollrapport-fordon",
    type: "delprov-1",
    source: "TSFS 2013:41 5 kap. 8 §",
    freq: "medium",
    sv: "Var ska den senaste kontrollrapporten från taxameterbesiktningen finnas? | Alt: A. Bara hos redovisningscentralen | Alt: B. I original i fordonet; föraren ska på begäran överlämna den till polisman eller bilinspektör | Alt: C. Bara hos Skatteverket | Alt: D. Den får slängas efter en månad",
    fr: "Où garder le rapport de contrôle du taximètre ?",
    answer: "B",
    note_sv:
      "TSFS 2013:41 5 kap. 8 §: den senaste kontrollrapporten enligt 5 kap. 3 § taxitrafikförordningen i original ska medföras i fordonet och på begäran av polisman eller bilinspektör överlämnas av taxiföraren för kontroll.",
    note_fr:
      "Original dans le véhicule. TSFS 2013:41, ch. 5, art. 8.",
  }),
  q({
    id: "rs-off-taxameter-lagen-upptagen",
    type: "delprov-1",
    source: "transportstyrelsen/taxameter+TSFS 2013:41",
    freq: "high",
    sv: "Vilken inställning ska taxametern ha under en pågående körning? | Alt: A. LEDIG | Alt: B. UPPTAGEN (på äldre taxametrar TARIFF) | Alt: C. STOPPAD redan vid start | Alt: D. Avstängd för att spara batteri",
    fr: "Position du taximètre pendant la course ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Taxameter: under körning ska taxametern vara inställd på UPPTAGEN (äldre: TARIFF). När uppdraget är avslutat: STOPPAD (äldre: KASSA). När fordonet inte används för köruppdrag: LEDIG. Taxametern får inte stå på LEDIG under en körning. Fast pris ska registreras när körningen påbörjas. Samma regler gäller app-tjänster.",
    note_fr:
      "UPPTAGEN / TARIFF pendant la course. Transportstyrelsen, Taxameter.",
  }),
  q({
    id: "rs-off-ej-bade-taxameter-su",
    type: "delprov-1",
    source: "SFS 2012:238 5 kap. 2 §",
    freq: "high",
    sv: "Får ett taxifordon samtidigt ha taxameterutrustning och särskild utrustning för taxifordon? | Alt: A. Ja, det är obligatoriskt | Alt: B. Nej | Alt: C. Ja, om kommunen godkänner | Alt: D. Ja, under de tre första månaderna",
    fr: "Taximètre et équipement spécial en même temps ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 5 kap. 2 §: «Ett taxifordon får inte samtidigt vara försett med taxameterutrustning och särskild utrustning för taxifordon.» Fordonet ska ha antingen godkänd, kontrollerad och plomberad taxameter eller särskild utrustning enligt 2 b kap. taxitrafiklagen (5 kap. 1 §).",
    note_fr: "Non, l'un ou l'autre. SFS 2012:238, ch. 5, art. 2.",
  }),
  q({
    id: "rs-off-swedac-taxameter",
    type: "delprov-1",
    source: "SFS 2012:238 8 kap. 1 §+transportstyrelsen/taxameter",
    freq: "medium",
    sv: "Vilken myndighet meddelar föreskrifter om krav på och kontroll av taxameterutrustning, fastsättning, installation och plombering? | Alt: A. Skatteverket | Alt: B. Styrelsen för ackreditering och teknisk kontroll (Swedac), efter att ha hört Transportstyrelsen | Alt: C. Kommunen | Alt: D. Trafikverket ensamt",
    fr: "Qui réglement le matériel taximètre ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 8 kap. 1 §: Swedac får meddela föreskrifter om krav på och kontroll av taxameterutrustning samt fastsättning, installation och plombering. Innan föreskrifterna meddelas ska Swedac höra Transportstyrelsen. Transportstyrelsen får meddela föreskrifter om användning, taxa och prisinformation. Besiktningsorgan godkänns genom ackreditering (5 kap. 3 §).",
    note_fr:
      "Swedac, après avis de Transportstyrelsen. SFS 2012:238, ch. 8, art. 1.",
  }),
  q({
    id: "rs-off-rc-definition",
    type: "delprov-1",
    source: "SFS 2014:1020 2–3 §§",
    freq: "high",
    trap: "Vanlig tömnings- eller taxicentral räcker",
    sv: "Vad är en redovisningscentral för taxitrafik? | Alt: A. Samma sak som en beställningscentral | Alt: B. En verksamhet som tar emot, lagrar och lämnar ut uppgifter som överförs från taxametrar; det krävs tillstånd | Alt: C. En vanlig tömningscentral utan tillstånd | Alt: D. Skatteverkets kassaregister",
    fr: "Qu'est-ce qu'un redovisningscentral ?",
    answer: "B",
    note_sv:
      "SFS 2014:1020 2 §: redovisningscentral tar emot, lagrar och lämnar ut taxameteruppgifter. Beställningscentral tar emot beställningar och betalningar, fördelar köruppdrag och lagrar uppgifter. 3 §: tillstånd krävs. Transportstyrelsen: det är inte en vanlig tömningscentral, taxicentral, beställningscentral eller färdtjänstcentral. Syftet är lika villkor och bättre skattekontroll.",
    note_fr:
      "Réception, stockage et restitution des données taximètre, sous permis. SFS 2014:1020, art. 2–3.",
  }),
  q({
    id: "rs-off-rc-sju-ar",
    type: "delprov-1",
    source: "SFS 2014:1020 23 §",
    freq: "high",
    sv: "Hur länge ska en redovisningscentral lagra överförda taxameteruppgifter? | Alt: A. Tre månader | Alt: B. Ett år | Alt: C. Sju år från utgången av det kalenderår när överföringen skedde | Alt: D. Tills fordonet avanmäls",
    fr: "Durée de conservation à la centrale ?",
    answer: "C",
    note_sv:
      "SFS 2014:1020 23 §: redovisningscentralen ska lagra uppgifterna under sju år från utgången av det kalenderår när överföringen skedde. Samma sjuårstid gäller beställningscentralens uppgifter från utgången av det kalenderår då affärshändelsen inträffade (23 a §). Transportstyrelsen: teknisk utrustning ska kunna lagra i sju år och föra över till Skatteverket på begäran.",
    note_fr:
      "Sept ans à compter de la fin de l'année civile. SFS 2014:1020, art. 23.",
  }),
  q({
    id: "rs-off-rc-ej-ideell",
    type: "delprov-1",
    source: "SFS 2014:1020 8 §",
    freq: "medium",
    sv: "Vem får inte ges tillstånd att driva en redovisningscentral eller beställningscentral? | Alt: A. Ett aktiebolag | Alt: B. En ideell förening eller en stiftelse | Alt: C. En enskild näringsidkare | Alt: D. Ett handelsbolag",
    fr: "Qui ne peut pas tenir une centrale ?",
    answer: "B",
    note_sv:
      "SFS 2014:1020 8 §: tillstånd får ges endast till den som med hänsyn till ekonomi och gott anseende är lämplig. Tillstånd får inte ges till ideell förening eller stiftelse. En beställningscentral får inte ha taxitrafiktillstånd. Transportstyrelsen upprepar samma grundvillkor.",
    note_fr:
      "Pas d'association ou fondation ; une centrale de commandes ne peut pas avoir de permis taxi. SFS 2014:1020, art. 8.",
  }),
  q({
    id: "rs-off-bc-ej-tillstand",
    type: "delprov-1",
    source: "SFS 2014:1020 8 § tredje stycket",
    freq: "medium",
    sv: "Får en beställningscentral samtidigt ha taxitrafiktillstånd? | Alt: A. Ja, det är obligatoriskt | Alt: B. Nej | Alt: C. Ja, om VD är densamma | Alt: D. Ja, i glesbygd",
    fr: "Une centrale de commandes peut-elle exploiter des taxis ?",
    answer: "B",
    note_sv:
      "SFS 2014:1020 8 § tredje stycket: «En beställningscentral får inte ha taxitrafiktillstånd.» Syftet är att hålla isär den som fördelar uppdrag/tar betalt och den som kör.",
    note_fr: "Non. SFS 2014:1020, art. 8.",
  }),
  q({
    id: "rs-off-rc-utebliven-ts",
    type: "delprov-1",
    source: "SFS 2014:1020 24 §",
    freq: "medium",
    sv: "Vem ska en redovisningscentral självmant underrätta om uteblivna överföringar? | Alt: A. Bara föraren | Alt: B. Tillståndsmyndigheten (Transportstyrelsen) | Alt: C. Bara kommunen | Alt: D. Ingen, tystnadsplikt förbjuder det",
    fr: "À qui signaler les transmissions manquantes ?",
    answer: "B",
    note_sv:
      "SFS 2014:1020 24 §: redovisningscentralen ska på begäran lämna lagrade uppgifter till Skatteverket, samt uppgift om uteblivna överföringar och meddelanden enligt 2 a kap. 4 § andra stycket taxitrafiklagen. En redovisningscentral ska självmant lämna uppgift om uteblivna överföringar till tillståndsmyndigheten. Transportstyrelsen för registret och tar emot sådana meddelanden.",
    note_fr:
      "Transportstyrelsen, spontanément. SFS 2014:1020, art. 24.",
  }),
  q({
    id: "rs-off-bc-undantag-samhall",
    type: "delprov-1",
    source: "SFS 2012:211 2 b kap. 5 §",
    freq: "medium",
    sv: "När gäller inte kravet att beställningscentralen ska ange fast pris och lämna bevis före färden? | Alt: A. Aldrig, kravet gäller alltid | Alt: B. För taxitrafik som omfattas av lagarna om sjukresor, riksfärdtjänst, färdtjänst, kollektivtrafik och skollagen | Alt: C. Bara på helger | Alt: D. Bara om kunden är under 18 år",
    fr: "Quand le prix fixe via centrale n'est pas exigé ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 b kap. 5 §: 4 § (fast pris och bevis från beställningscentralen) gäller inte för taxitrafik som omfattas av lagen (1991:419) om resekostnadsersättning vid sjukresor, lagen (1997:735) om riksfärdtjänst, lagen (1997:736) om färdtjänst, lagen (2010:1065) om kollektivtrafik och skollagen (2010:800).",
    note_fr:
      "Transports scolaires, färdtjänst, riksfärdtjänst, trajets médicaux, transports collectifs. SFS 2012:211, ch. 2 b, art. 5.",
  }),
  q({
    id: "rs-off-fardtjanst-kansla",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 4 §+SFS 1997:736",
    freq: "medium",
    sv: "Vad ska den som gör yrkeskunnandeprovet känna till om färdtjänst, riksfärdtjänst och sjukresor? | Alt: A. Inget, det ligger utanför taxiverksamhet | Alt: B. Vad som avses med färdtjänst, riksfärdtjänst och sjukresor, samt bestämmelser om skolskjuts och krav på fordon vid sådana transporter | Alt: C. Bara taxameterns knappar | Alt: D. Bara kommunens taxa för parkering",
    fr: "Que doit-on connaître sur färdtjänst ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 4 §: provdeltagaren ska känna till 1) bestämmelserna om skolskjuts och krav på fordon vid sådana transporter, och 2) vad som avses med färdtjänst, riksfärdtjänst och sjukresor. Färdtjänst (1997:736) är kommunal särskild kollektivtrafik för personer med funktionsnedsättning. Riksfärdtjänst (1997:735) avser längre resor mellan kommuner. Sjukresor regleras i 1991:419.",
    note_fr:
      "Définitions et règles scolaires / adaptées / médicales. TSFS 2021:118, ch. 3, art. 4.",
  }),
  q({
    id: "rs-off-utokning-fordon-ekonomi",
    type: "delprov-1",
    source: "SFS 2012:238 4 kap. 5 och 7 §§+transportstyrelsen/fordon-i-taxitrafik",
    freq: "high",
    sv: "Vad ska följa med när en fordonsanmälan innebär att antalet fordon i taxitrafiken utökas? | Alt: A. Inget, det räcker med registreringsnumret | Alt: B. Kompletterande utredning som visar att kravet på ekonomiska resurser enligt 2 kap. 9 § taxitrafiklagen är uppfyllt | Alt: C. Bara ett foto på fordonet | Alt: D. Kommunens godkännande",
    fr: "Agrandir la flotte : quelle preuve ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 4 kap. 5 §: vid utökning ska kompletterande utredning om ekonomiska resurser följa med. 7 §: Transportstyrelsen ska då pröva 2 kap. 9 § taxitrafiklagen och lämpligheten i övrigt enligt 2 kap. 5 § (inte yrkeskunnande). Transportstyrelsen: styrk ekonomin och använd e-tjänsten Fordon i yrkestrafik.",
    note_fr:
      "Justifier à nouveau les 100 000 / 50 000 kr. SFS 2012:238, ch. 4, art. 5 et 7.",
  }),
  q({
    id: "rs-off-anmalan-efter-tillstand",
    type: "delprov-1",
    source: "transportstyrelsen/ansokan-om-trafiktillstand",
    freq: "high",
    sv: "När får du anmäla fordon till taxitrafik? | Alt: A. Redan när ansökan om tillstånd skickats in | Alt: B. Först när Transportstyrelsen har godkänt taxitrafiktillståndet | Alt: C. När fordonet köpts, oavsett tillstånd | Alt: D. Bara efter tre års verksamhet",
    fr: "Quand déclarer le premier véhicule ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Ansökan om taxitrafiktillstånd: du kan inte göra fordonsanmälan innan ansökan om taxitrafiktillstånd har godkänts. När tillståndet finns används e-tjänsten Fordon i yrkestrafik – anmäl/avanmäl. Samtidigt ska redovisningscentralen anmälas.",
    note_fr:
      "Après l'octroi du permis. Transportstyrelsen, Ansökan om taxitrafiktillstånd.",
  }),
  q({
    id: "rs-off-vagkontroll-polis",
    type: "delprov-1",
    source: "SFS 2012:238 4 kap. 10 §",
    freq: "medium",
    sv: "Vem utför vägkontroller av att fordon framförs enligt taxitrafiklagen och villkoren? | Alt: A. Trafikverket | Alt: B. Polismyndigheten | Alt: C. Kommunen | Alt: D. Svenska Taxiförbundet",
    fr: "Qui contrôle sur route ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 4 kap. 10 §: Polismyndigheten utför kontroller på väg av att fordon framförs i enlighet med taxitrafiklagen, förordningen och villkor för trafiktillståndet eller taxiförarlegitimationen. Upptäcks överträdelse av 4 kap. 8 eller 9 § ska Polismyndigheten anmäla till Transportstyrelsen (6 kap. 4 §).",
    note_fr: "La police. SFS 2012:238, ch. 4, art. 10.",
  }),
  q({
    id: "rs-off-undantag-5-ar-praktik",
    type: "delprov-1",
    source: "SFS 2012:238 2 kap. 6 §",
    freq: "low",
    sv: "När får Transportstyrelsen medge undantag från skyldigheten att avlägga visst prov i yrkeskunnande? | Alt: A. Aldrig | Alt: B. Bland annat vid viss godkänd gymnasie- eller högre utbildning i ämnet, eller minst fem års praktisk erfarenhet som trafikansvarig eller på företagsledningsnivå i ett transportföretag om sökanden godkänns vid kontrollprov | Alt: C. Om sökanden har körkort B | Alt: D. Om kommunen intygar lämplighet",
    fr: "Dispense d'épreuve possible ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 2 kap. 6 §: undantag från visst ämne får medges efter godkänd gymnasie- eller högre utbildning i ämnet. Undantag från provskyldigheten får även medges den som har minst fem års praktisk erfarenhet som trafikansvarig eller på företagsledningsnivå i ett transportföretag, om sökanden godkänns vid ett kontrollprov som anordnas av Trafikverket. Delprov 4 fungerar som det kontrollprovet (TSFS 2021:118 2 kap. 2 §).",
    note_fr:
      "Formation correspondante, ou 5 ans de direction + épreuve de contrôle. SFS 2012:238, ch. 2, art. 6.",
  }),
  q({
    id: "rs-off-forlangd-tid-65",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 5–6 §§",
    freq: "low",
    sv: "Hur lång blir provtiden för delprov 1–3 om förlängd provtid beviljats? | Alt: A. Fortfarande 45 minuter | Alt: B. 65 minuter vardera | Alt: C. 180 minuter vardera | Alt: D. Obegränsad tid",
    fr: "Temps majoré des épreuves 1 à 3 ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 5 §: vid särskilda skäl får delprov 1–3 vara 65 minuter och delprov 4 180 minuter. 6 §: ansökan om förlängd tid ska göras hos Trafikverket på verkets blankett. Prov med förlängd tid får inte bokas innan ansökan beviljats.",
    note_fr:
      "65 minutes ; 180 pour la 4e. Demande préalable à Trafikverket. TSFS 2021:118, ch. 2, art. 5–6.",
  }),
  q({
    id: "rs-off-testfragor",
    type: "delprov-1",
    source: "TSFS 2021:118 2 kap. 3 §+trafikverket/yrkestrafiktillstand",
    freq: "medium",
    sv: "Vad gäller för testfrågorna i delprov 1–3? | Alt: A. De ger extra poäng | Alt: B. Tre testfrågor per delprov räknas inte in i resultatet | Alt: C. De måste vara rätt för godkänt | Alt: D. Det finns inga testfrågor",
    fr: "Que deviennent les questions d'essai ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 3 §: delproven ska innehålla testfrågor för utvärdering: 3 vardera i delprov 1–3 och 5 i delprov 4. Svaren på testfrågorna ska inte räknas in i resultatet. Trafikverket: delprov 1–3 har 23 frågor men högst 20 poäng; delprov 4 har 20 frågor men högst 15 poäng.",
    note_fr:
      "3 questions d'essai (5 à la 4e) hors barème. TSFS 2021:118, ch. 2, art. 3.",
  }),
  q({
    id: "rs-off-prisinfo-lagen",
    type: "delprov-1",
    source: "SFS 2012:211 2 kap. 22 §",
    freq: "low",
    sv: "Vilken annan lag om prisinformation gäller utöver taxitrafiklagens regler? | Alt: A. Ingen | Alt: B. Prisinformationslagen (2004:347) | Alt: C. Alkohollagen | Alt: D. Plan- och bygglagen",
    fr: "Quelle autre loi sur les prix s'applique ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 22 §: bestämmelser om prisinformation finns också i prisinformationslagen (2004:347). Transportstyrelsen ska höra Konsumentverket innan föreskrifter om taxa och prisinformation meddelas (2012:238 8 kap. 2 §).",
    note_fr: "La loi sur l'information sur les prix. SFS 2012:211, ch. 2, art. 22.",
  }),
  q({
    id: "rs-off-klampning",
    type: "delprov-1",
    source: "SFS 2012:211 5 kap. 7 §",
    freq: "low",
    sv: "Vad får göras om ett fordon framförs i strid med taxitrafiklagen? | Alt: A. Ingenting förrän dom fallit | Alt: B. Fortsatt färd får hindras enligt klampningslagen (2024:1089) | Alt: C. Bara en skriftlig erinran | Alt: D. Fordonet ska alltid säljas på auktion samma dag",
    fr: "Peut-on immobiliser le véhicule ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 5 kap. 7 §: om ett fordon framförs i strid med lagen eller föreskrift/villkor meddelad med stöd av lagen, får fortsatt färd hindras enligt klampningslagen (2024:1089).",
    note_fr: "Oui, selon la loi sur le bridage. SFS 2012:211, ch. 5, art. 7.",
  }),
  q({
    id: "rs-off-myndighet-anmalan-ts",
    type: "delprov-1",
    source: "SFS 2012:238 6 kap. 1 §",
    freq: "low",
    sv: "Vad ska en myndighet göra om den uppmärksammar något som kan leda till varning eller återkallelse av taxitrafiktillstånd eller taxiförarlegitimation? | Alt: A. Ingenting, sekretess | Alt: B. Anmäla till Transportstyrelsen | Alt: C. Bara meddela kommunen | Alt: D. Vänta till årsbokslutet",
    fr: "Signalement inter-autorités ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 6 kap. 1 §: en myndighet ska anmäla till Transportstyrelsen om den uppmärksammar en omständighet som kan vara av betydelse för prövning av varning eller återkallelse. Om det finns anledning anta att överträdelse skett i trafikutövningen ska Transportstyrelsen anmäla till Polismyndigheten eller åklagare. Skatteverket och andra uppbördsmyndigheter ska på begäran lämna uppgifter (2 §).",
    note_fr: "Prévenir Transportstyrelsen. SFS 2012:238, ch. 6, art. 1.",
  }),

  // ——— Delprov 2: Företagsledning och ekonomi ———
  q({
    id: "rs-off-bokforing-naring",
    type: "delprov-2",
    source: "SFS 1999:1078 2 kap. 1 och 6 §§",
    freq: "high",
    sv: "Vem är bokföringsskyldig enligt bokföringslagen i ett typiskt taxiföretag? | Alt: A. Bara aktiebolag med mer än 50 anställda | Alt: B. Juridiska personer (med vissa undantag) och fysiska personer som bedriver näringsverksamhet | Alt: C. Bara den som har revision | Alt: D. Ingen, taxiverksamhet är undantagen",
    fr: "Qui doit tenir une comptabilité ?",
    answer: "B",
    note_sv:
      "Bokföringslagen (1999:1078) 2 kap. 1 §: en juridisk person är bokföringsskyldig om inte annat anges. 6 §: en fysisk person som bedriver näringsverksamhet är bokföringsskyldig för denna. Ett taxiföretag — enskild firma, HB, AB — är därmed bokföringsskyldigt. TSFS 2021:118 3 kap. 9 § kräver att provdeltagaren kan redogöra för bokföringsskyldigheten.",
    note_fr:
      "Personne morale et personne physique en activité. SFS 1999:1078, ch. 2, art. 1 et 6.",
  }),
  q({
    id: "rs-off-rakenskapsar-12",
    type: "delprov-2",
    source: "SFS 1999:1078 3 kap. 1 §",
    freq: "high",
    sv: "Hur långt är ett normalt räkenskapsår? | Alt: A. Sex månader | Alt: B. Tolv kalendermånader | Alt: C. 24 månader | Alt: D. Valfri period",
    fr: "Durée d'un exercice normal ?",
    answer: "B",
    note_sv:
      "BFL 3 kap. 1 §: ett räkenskapsår ska omfatta tolv kalendermånader. Fysiska personer och handelsbolag där fysisk person beskattas ska ha kalenderåret. Andra företag får ha brutet räkenskapsår. När skyldigheten inträder eller året läggs om får året kortas eller utsträckas till högst 18 månader (3 §).",
    note_fr:
      "Douze mois. Personne physique : année civile. SFS 1999:1078, ch. 3, art. 1.",
  }),
  q({
    id: "rs-off-arkiv-7-ar",
    type: "delprov-2",
    source: "SFS 1999:1078 7 kap. 2 §",
    freq: "high",
    trap: "Tre år / fem år",
    sv: "Hur länge ska räkenskapsinformation bevaras enligt bokföringslagen? | Alt: A. Ett år | Alt: B. Fram till och med det sjunde året efter utgången av det kalenderår då räkenskapsåret avslutades | Alt: C. Tills deklarationen lämnats | Alt: D. Tre år",
    fr: "Durée d'archivage comptable ?",
    answer: "B",
    note_sv:
      "BFL 7 kap. 2 §: handlingarna ska bevaras fram till och med det sjunde året efter utgången av det kalenderår då räkenskapsåret avslutades. De ska förvaras i Sverige, i ordnat skick och på betryggande och överskådligt sätt. TSFS 2021:118 3 kap. 9 § kräver kunskap om arkivering av räkenskapsinformation.",
    note_fr:
      "Jusqu'à la 7e année après la fin de l'année civile de clôture. SFS 1999:1078, ch. 7, art. 2.",
  }),
  q({
    id: "rs-off-god-redovisningssed",
    type: "delprov-2",
    source: "SFS 1999:1078 4 kap. 2 § och 8 kap. 1 §",
    freq: "medium",
    sv: "Vad innebär kravet på god redovisningssed, och vem utvecklar den? | Alt: A. Valfri praxis; kommunen utvecklar den | Alt: B. Bokföringsskyldigheten ska fullgöras i överensstämmelse med god redovisningssed; Bokföringsnämnden ansvarar för att utveckla den | Alt: C. Bara revisorer behöver känna till den | Alt: D. Den ersätter bokföringslagen",
    fr: "Qu'est-ce que god redovisningssed ?",
    answer: "B",
    note_sv:
      "BFL 4 kap. 2 §: bokföringsskyldigheten ska fullgöras på ett sätt som överensstämmer med god redovisningssed. 8 kap. 1 §: Bokföringsnämnden ansvarar för utvecklandet av god redovisningssed (Finansinspektionen för vissa finansföretag). TSFS 2021:118 3 kap. 9 § kräver att deltagaren kan redogöra för god redovisningssed.",
    note_fr:
      "Norme professionnelle ; Bokföringsnämnden. SFS 1999:1078, ch. 4, art. 2 et ch. 8, art. 1.",
  }),
  q({
    id: "rs-off-lopande-bokforing",
    type: "delprov-2",
    source: "SFS 1999:1078 5 kap. 1–2 §§",
    freq: "medium",
    sv: "Vad ska den löpande bokföringen omfatta? | Alt: A. Bara kontanta uttag | Alt: B. Affärshändelserna ska bokföras så att de kan presenteras i registreringsordning (grundbok) och i systematisk ordning (huvudbok) | Alt: C. Bara årsbokslutet | Alt: D. Bara kvitton i skokartong",
    fr: "Que doit couvrir la comptabilité courante ?",
    answer: "B",
    note_sv:
      "BFL 5 kap. 1–2 §§: affärshändelser ska bokföras så att de kan presenteras i registreringsordning och i systematisk ordning. De ska bokföras så snart det kan ske. Företag med nettoomsättning högst tre miljoner kronor får i vissa fall dröja tills betalning sker, men obetalda poster ska bokföras vid årets utgång. TSFS 2021:118 3 kap. 9 § kräver att deltagaren kan tillämpa löpande redovisning.",
    note_fr:
      "Journal et grand livre, sans retard indu. SFS 1999:1078, ch. 5, art. 1–2.",
  }),
  q({
    id: "rs-off-arsredovisning-ab",
    type: "delprov-2",
    source: "SFS 1999:1078 6 kap. 1 §",
    freq: "medium",
    sv: "Vilka företag ska avsluta den löpande bokföringen med en årsredovisning som offentliggörs? | Alt: A. Bara enskilda firmor | Alt: B. Bland annat aktiebolag, ekonomiska föreningar och vissa andra i 6 kap. 1 § bokföringslagen | Alt: C. Inga taxiföretag | Alt: D. Bara ideella föreningar utan näring",
    fr: "Qui doit publier un årsredovisning ?",
    answer: "B",
    note_sv:
      "BFL 6 kap. 1 §: bland annat aktiebolag och ekonomiska föreningar ska för varje räkenskapsår avsluta bokföringen med en årsredovisning och offentliggöra den. Andra företag ska, om de inte upprättar årsredovisning, avsluta med årsbokslut (3 §). TSFS 2021:118 3 kap. 9 §: deltagaren ska känna till vad som ska ingå i en årsredovisning.",
    note_fr:
      "SA / associations économiques, notamment. SFS 1999:1078, ch. 6, art. 1.",
  }),
  q({
    id: "rs-off-balans-vs-resultat",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 12 §+SFS 1995:1554",
    freq: "high",
    sv: "Vad visar en balansräkning respektive en resultaträkning? | Alt: A. Båda visar bara kassan | Alt: B. Balansräkningen visar tillgångar, skulder och eget kapital på balansdagen; resultaträkningen visar intäkter och kostnader under perioden | Alt: C. Balansräkningen är samma sak som en körjournal | Alt: D. Resultaträkningen visar bara skatter",
    fr: "Bilan ou compte de résultat ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 12 §: deltagaren ska känna till vad en balansräkning och en resultaträkning är, hur de ställs upp och ska tolkas, samt kunna upprätta och tolka resultat- och likviditetsbudget. Årsredovisningslagen (1995:1554) anger uppställningen. Balans = ställning vid en tidpunkt. Resultat = periodens intäkter minus kostnader.",
    note_fr:
      "Bilan = patrimoine ; résultat = période. TSFS 2021:118, ch. 3, art. 12.",
  }),
];

export const OWNER_OFFICIAL_ALL = [...OWNER_OFFICIAL_ITEMS, ...OWNER_OFFICIAL_REST];