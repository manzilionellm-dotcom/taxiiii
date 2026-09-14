/** Remainder of official Taxi Företag QCMs (delprov 2–4). Public law only. */

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

export const OWNER_OFFICIAL_REST = [
  q({
    id: "rs-off-likviditetsbudget",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 12 §",
    freq: "high",
    sv: "Vad är skillnaden mellan en resultatbudget och en likviditetsbudget? | Alt: A. Ingen skillnad | Alt: B. Resultatbudgeten planerar intäkter och kostnader; likviditetsbudgeten planerar in- och utbetalningar och kassan | Alt: C. Likviditetsbudgeten är samma sak som balansräkningen | Alt: D. Resultatbudgeten visar bara skatter",
    fr: "Budget de résultat ou de trésorerie ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 12 §: deltagaren ska kunna upprätta och tolka en resultat- och en likviditetsbudget, genomföra ekonomiska beräkningar utifrån intäkter och kostnader samt analysera lönsamhet. Resultat kan vara positivt samtidigt som kassan sinar om kundfordringar inte betalas — därför behövs båda budgetarna.",
    note_fr:
      "Résultat = produits/charges ; liquidité = encaissements/décaissements. TSFS 2021:118, ch. 3, art. 12.",
  }),
  q({
    id: "rs-off-moms-6-person",
    type: "delprov-2",
    source: "SFS 2023:200 9 kap. 8 §",
    freq: "high",
    trap: "25 procent på taxiresan",
    sv: "Vilken mervärdesskattesats gäller för persontransporttjänster i Sverige, till exempel en vanlig taxiresa? | Alt: A. 25 procent | Alt: B. 12 procent | Alt: C. 6 procent, om inte resemomentet är av underordnad betydelse | Alt: D. 0 procent alltid",
    fr: "Quel taux de TVA pour une course taxi ?",
    answer: "C",
    note_sv:
      "Mervärdesskattelagen (2023:200) 9 kap. 8 §: skatt tas ut med 6 procent av beskattningsunderlaget för persontransporttjänster, med undantag för sådan transport där resemomentet är av underordnad betydelse. Normalskattesatsen är 25 procent (9 kap. 2 §). TSFS 2021:118 3 kap. 11 § kräver att deltagaren kan tillämpa bestämmelserna om mervärdesskatt.",
    note_fr:
      "6 % pour le transport de personnes. SFS 2023:200, ch. 9, art. 8.",
  }),
  q({
    id: "rs-off-moms-25-normal",
    type: "delprov-2",
    source: "SFS 2023:200 9 kap. 2 §",
    freq: "medium",
    sv: "Vilken är normalskattesatsen för mervärdesskatt om ingen nedsatt sats gäller? | Alt: A. 6 procent | Alt: B. 12 procent | Alt: C. 25 procent | Alt: D. 50 procent",
    fr: "Taux normal de TVA ?",
    answer: "C",
    note_sv:
      "ML (2023:200) 9 kap. 2 §: skatt tas ut med 25 procent av beskattningsunderlaget om inte annat följer av 4–19 §§. Taxiföretag möter 25 procent på många inköp (bilar, verkstad, bränsle i vissa fall) medan persontransporten ofta är 6 procent — skillnaden påverkar avdragsrätt och prissättning.",
    note_fr: "25 %. SFS 2023:200, ch. 9, art. 2.",
  }),
  q({
    id: "rs-off-arbetsgivaravgift",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 11 §",
    freq: "high",
    sv: "Vad ska en tillståndshavare som är arbetsgivare kunna tillämpa enligt kunskapskraven? | Alt: A. Bara kommunalskatt för föraren | Alt: B. Bestämmelserna om mervärdesskatt, inkomstskatt, arbetsgivaravgift, egenavgift och förmånsbeskattning för personbilar och lätta lastbilar | Alt: C. Bara parkeringsböter | Alt: D. Inget skatteområde",
    fr: "Quelles règles fiscales l'exploitant doit-il maîtriser ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 11 §: provdeltagaren ska kunna tillämpa bestämmelserna om 1) mervärdesskatt, 2) inkomstskatt, arbetsgivaravgift, egenavgift, och 3) förmånsbeskattning för personbilar och lätta lastbilar. Arbetsgivaravgift betalas av arbetsgivaren på lön; egenavgift av den som bedriver näring i enskild firma.",
    note_fr:
      "TVA, impôt, cotisations employeur/indépendant, avantage en nature. TSFS 2021:118, ch. 3, art. 11.",
  }),
  q({
    id: "rs-off-forman-bil",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 11 §",
    freq: "medium",
    sv: "När kan förmånsbeskattning för personbil eller lätt lastbil bli aktuell i ett taxiföretag? | Alt: A. Aldrig, taxi är undantagen | Alt: B. När fordonet även används privat av den anställde eller näringsidkaren på ett sätt som ska beskattas som förmån | Alt: C. Bara om fordonet är äldre än tio år | Alt: D. Bara vid leasing från kommunen",
    fr: "Quand l'avantage en nature véhicule s'applique-t-il ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 11 § kräver att deltagaren kan tillämpa förmånsbeskattning för personbilar och lätta lastbilar. Skatteverket beskattar privat användning av tjänstebil som förmån. Ren yrkestrafik utan privat bruk behandlas annorlunda än blandad användning — därför måste tillståndshavaren kunna skilja på körjournal och privat bruk.",
    note_fr:
      "Usage privé d'un véhicule d'entreprise. TSFS 2021:118, ch. 3, art. 11.",
  }),
  q({
    id: "rs-off-finansiering",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 10 §",
    freq: "medium",
    sv: "Vad ska provdeltagaren känna till om finansiering av taxiföretaget? | Alt: A. Inget, banken sköter allt | Alt: B. Olika finansieringsformer och de kostnader och förpliktelser de är förenade med, samt olika betalningssätt och villkor | Alt: C. Bara kontanter | Alt: D. Bara att leasing är förbjudet",
    fr: "Que faut-il savoir sur le financement ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 10 §: deltagaren ska känna till 1) olika betalningssätt och villkoren när de används, och 2) olika finansieringsformer och de kostnader och förpliktelser de är förenade med. Lån, leasing och avbetalning påverkar både likviditet och de ekonomiska resurser Transportstyrelsen prövar.",
    note_fr:
      "Moyens de paiement et formes de financement, avec leurs obligations. TSFS 2021:118, ch. 3, art. 10.",
  }),
  q({
    id: "rs-off-kvalitet-miljo",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 13 §",
    freq: "low",
    sv: "Vad ska provdeltagaren kunna redogöra för när det gäller ledningssystem? | Alt: A. Inget | Alt: B. Innebörden av de kvalitets- och miljöledningssystem som är relevanta för en transportverksamhet | Alt: C. Bara ISO-nummer utan innehåll | Alt: D. Bara kommunens avfallsplan",
    fr: "Systèmes qualité et environnement ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 13 §: deltagaren ska kunna redogöra för innebörden av de kvalitets- och miljöledningssystem som är relevanta för en transportverksamhet. Det handlar om att förstå syfte, dokumentation och ständiga förbättringar — inte att ett visst certifikat är obligatoriskt enligt taxitrafiklagen.",
    note_fr:
      "Comprendre les systèmes qualité/environnement pertinents. TSFS 2021:118, ch. 3, art. 13.",
  }),
  q({
    id: "rs-off-forsakring-taxi",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 14 §+SFS 2012:211 5 kap. 8 §",
    freq: "high",
    sv: "Vilka försäkringar ska en tillståndshavare känna till, och vad kan saknad trafikförsäkring leda till? | Alt: A. Inga försäkringar krävs | Alt: B. Sak- och personförsäkringar som kan förekomma i taxiföretag; saknad föreskriven trafikförsäkring kan leda till att den särskilda taxiskylten tas om hand | Alt: C. Bara hemförsäkring | Alt: D. Bara livförsäkring för VD",
    fr: "Assurances et plaques taxi ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 14 §: känna till sak- och personförsäkringar i taxiföretag samt rättigheter och skyldigheter. SFS 2012:211 5 kap. 8 §: särskild registreringsskylt för taxi får tas om hand bland annat om fordonet saknar föreskriven trafikförsäkring. Trafikförsäkring är obligatorisk; därutöver förekommer bland annat ansvars-, fordonskasko- och avbrottsförsäkring.",
    note_fr:
      "Assurance circulation obligatoire ; sinon retrait des plaques. TSFS 2021:118, ch. 3, art. 14 ; SFS 2012:211, ch. 5, art. 8.",
  }),
  q({
    id: "rs-off-marknadsforing",
    type: "delprov-2",
    source: "TSFS 2021:118 3 kap. 14 §",
    freq: "low",
    sv: "Vad ska provdeltagaren känna till utöver försäkringar enligt delprov 2? | Alt: A. Bara reklamens färg | Alt: B. Grunderna för marknadsföring | Alt: C. Inget mer | Alt: D. Bara hur man sätter upp affischer utan tillstånd",
    fr: "Que faut-il savoir sur le marketing ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 14 §: deltagaren ska känna till 1) sak- och personförsäkringar och 2) grunderna för marknadsföring. Marknadsföringslagen ställer krav på att reklam inte är vilseledande — vilket hänger ihop med taxitrafiklagens krav på tydlig prisinformation.",
    note_fr: "Les bases du droit de la publicité. TSFS 2021:118, ch. 3, art. 14.",
  }),
  q({
    id: "rs-off-affarshandelser",
    type: "delprov-2",
    source: "SFS 1999:1078 1 kap. 2 §",
    freq: "medium",
    sv: "Vad är en affärshändelse enligt bokföringslagen? | Alt: A. Bara uttag av lön | Alt: B. Alla förändringar i storleken och sammansättningen av företagets förmögenhet som beror på ekonomiska relationer med omvärlden | Alt: C. Bara årsbokslutet | Alt: D. Bara när fordonet tankas kontant",
    fr: "Qu'est-ce qu'une affärshändelse ?",
    answer: "B",
    note_sv:
      "BFL 1 kap. 2 §: affärshändelser är alla förändringar i storleken och sammansättningen av ett företags förmögenhet som beror på företagets ekonomiska relationer med omvärlden, såsom in- och utbetalningar, uppkomna fordringar och skulder samt egna tillskott och uttag. En verifikation dokumenterar affärshändelsen.",
    note_fr:
      "Tout mouvement de patrimoine lié à l'extérieur. SFS 1999:1078, ch. 1, art. 2.",
  }),
  q({
    id: "rs-off-oppningsbalans",
    type: "delprov-2",
    source: "SFS 1999:1078 4 kap. 3 §",
    freq: "low",
    sv: "Vad ska företaget upprätta när bokföringsskyldigheten inträder? | Alt: A. Ingenting | Alt: B. En öppningsbalansräkning utan dröjsmål | Alt: C. Bara en muntlig överenskommelse | Alt: D. En körjournal",
    fr: "Que dresser au début de l'obligation comptable ?",
    answer: "B",
    note_sv:
      "BFL 4 kap. 3 §: när bokföringsskyldighet inträder eller när grunden för sådan skyldighet ändras, ska företaget utan dröjsmål upprätta en öppningsbalansräkning.",
    note_fr: "Un bilan d'ouverture sans délai. SFS 1999:1078, ch. 4, art. 3.",
  }),
  q({
    id: "rs-off-arsbokslut-tid",
    type: "delprov-2",
    source: "SFS 1999:1078 6 kap. 7 §",
    freq: "low",
    sv: "När ska ett årsbokslut senast vara färdigställt? | Alt: A. Samma dag som räkenskapsåret slutar | Alt: B. Så snart det kan ske, dock senast sex månader efter räkenskapsårets utgång (fyra månader i stiftelser) | Alt: C. Efter sju år | Alt: D. Ingen tidsgräns",
    fr: "Délai pour clôturer l'årsbokslut ?",
    answer: "B",
    note_sv:
      "BFL 6 kap. 7 §: årsbokslutet ska färdigställas så snart det kan ske, dock senast sex månader eller, i stiftelser, fyra månader efter räkenskapsårets utgång.",
    note_fr: "Six mois après la clôture (quatre pour une fondation). SFS 1999:1078, ch. 6, art. 7.",
  }),
  q({
    id: "rs-off-bfl-sprak",
    type: "delprov-2",
    source: "SFS 1999:1078 1 kap. 4 §",
    freq: "low",
    sv: "På vilket språk ska räkenskapsinformation som företaget självt upprättar avfattas? | Alt: A. Valfritt språk | Alt: B. Svenska, danska, norska eller engelska | Alt: C. Bara latin | Alt: D. Bara det språk kunden talar",
    fr: "Langue des pièces comptables ?",
    answer: "B",
    note_sv:
      "BFL 1 kap. 4 §: räkenskapsinformation som företaget självt upprättar ska avfattas på svenska, danska, norska eller engelska. Skatteverket kan i särskilda fall tillåta annat språk, men företaget ska då på begäran översätta. Årsredovisning ska alltid vara på svenska enligt årsredovisningslagen.",
    note_fr:
      "Suédois, danois, norvégien ou anglais. SFS 1999:1078, ch. 1, art. 4.",
  }),
  q({
    id: "rs-off-fysisk-juridisk",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 7 §",
    freq: "high",
    sv: "Vad ska provdeltagaren kunna redogöra för om företagsformer? | Alt: A. Bara aktiebolagets färg på stämpeln | Alt: B. Innebörden av olika företagsformer och skillnaden mellan fysisk och juridisk person, samt hur registrering och ändring genomförs | Alt: C. Bara handelsbolag | Alt: D. Inget, Bolagsverket sköter allt utan kunskap",
    fr: "Que faut-il savoir sur les formes d'entreprise ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 7 §: redogöra för 1) innebörden av olika företagsformer och skillnaden mellan fysisk och juridisk person, 2) hur registrering och ändring genomförs. Dessutom känna till kompanjonsavtal, kompanjonsförsäkring och konkurs. En fysisk person är en människa; en juridisk person (AB, HB, ekonomisk förening) är ett rättssubjekt skilt från ägarna.",
    note_fr:
      "Formes juridiques, personne physique/morale, immatriculation. TSFS 2021:118, ch. 3, art. 7.",
  }),
  q({
    id: "rs-off-konkurs-kansla",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 7 §+SFS 2012:211 2 kap. 15 §",
    freq: "medium",
    sv: "Varför måste den som söker taxitrafiktillstånd känna till innebörden av en konkurs? | Alt: A. Konkurs påverkar inte taxitrafik | Alt: B. Kunskapskravet i TSFS 2021:118 omfattar konkurs, och vid konkurs övergår tillståndet på konkursboet i högst sex månader | Alt: C. Konkurs ger automatiskt nytt tillstånd | Alt: D. Konkurs är bara en bokföringsterm",
    fr: "Pourquoi connaître la faillite ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 7 § kräver kännedom om konkurs. SFS 2012:211 2 kap. 15 §: vid konkurs övergår tillståndet på konkursboet i högst sex månader (om inte längre tid medges). Föreståndare ska anmälas inom en månad. Transportstyrelsen kan i tillsynen beakta tidigare konkurs i prövningskretsen.",
    note_fr:
      "Le permis passe à la masse, 6 mois. TSFS 2021:118, ch. 3, art. 7 ; SFS 2012:211, ch. 2, art. 15.",
  }),
  q({
    id: "rs-off-amne-arbetsratt",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 8 §",
    freq: "high",
    sv: "Vilka arbetsrättsliga områden ska provdeltagaren kunna redogöra för? | Alt: A. Bara semesterdagar i andra länder | Alt: B. Arbetsgivaransvar, anställningsskydd, föräldraledighet och semester, arbetstid, arbetsmiljö med arbetsgivarens ansvar samt åtgärder mot hot och våld | Alt: C. Bara hur man säger upp någon samma dag utan skäl | Alt: D. Inget arbetsrättsligt",
    fr: "Quel droit du travail faut-il maîtriser ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 8 §: redogöra för 1) arbetsgivaransvaret och förhållandet arbetsgivare–arbetstagare, 2) anställningsskydd, 3) föräldraledighet och semester, 4) arbetstid, 5) arbetsmiljö med särskild betoning på arbetsgivarens ansvar, 6) åtgärder mot hot och våld. Dessutom känna till sjuklön, rehabilitering och kollektivavtal.",
    note_fr:
      "Contrat, protection de l'emploi, congés, temps de travail, environnement, violences. TSFS 2021:118, ch. 3, art. 8.",
  }),
  q({
    id: "rs-off-semester-25",
    type: "delprov-1",
    source: "SFS 1977:480 4 §",
    freq: "medium",
    sv: "Hur många semesterdagar har en arbetstagare rätt till enligt semesterlagen, om inte annat avtalats till det bättre? | Alt: A. 12 dagar | Alt: B. 25 semesterdagar | Alt: C. 5 dagar | Alt: D. Ingen lagstadgad rätt",
    fr: "Congés payés légaux ?",
    answer: "B",
    note_sv:
      "Semesterlagen (1977:480) 4 §: arbetstagare har rätt till tjugofem semesterdagar varje semesterår. Kollektivavtal kan ge mer, inte mindre än lagens skyddsnivå i de delar som är tvingande. TSFS 2021:118 3 kap. 8 § kräver att tillståndshavaren kan redogöra för rätten till semester.",
    note_fr: "25 jours. SFS 1977:480, art. 4.",
  }),
  q({
    id: "rs-off-sjuklon-ag",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 8 §+SFS 1991:1047",
    freq: "medium",
    sv: "Vem betalar i första hand sjuklön när en anställd taxiförare blir sjuk? | Alt: A. Alltid Försäkringskassan från dag 1 | Alt: B. Arbetsgivaren har skyldigheter som gäller rätten till sjuklön | Alt: C. Bara kommunen | Alt: D. Ingen, föraren står själv för allt",
    fr: "Qui verse le sjuklön ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 8 §: deltagaren ska känna till arbetsgivarens skyldigheter som gäller rätten till sjuklön samt bestämmelserna om rehabiliteringsåtgärder. Lagen (1991:1047) om sjuklön lägger det första ansvaret på arbetsgivaren under sjuklöneperioden.",
    note_fr:
      "L'employeur au début de l'arrêt. TSFS 2021:118, ch. 3, art. 8 ; SFS 1991:1047.",
  }),
  q({
    id: "rs-off-kollektivavtal-kansla",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 8 §",
    freq: "medium",
    sv: "Vad ska provdeltagaren känna till om kollektivavtal? | Alt: A. Inget | Alt: B. Innebörden av ett kollektivavtal | Alt: C. Att kollektivavtal är förbjudna i taxi | Alt: D. Att bara kommunen tecknar kollektivavtal",
    fr: "Que signifie un kollektivavtal ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 8 § sista stycket: deltagaren ska känna till innebörden av ett kollektivavtal. Ett kollektivavtal är ett skriftligt avtal mellan arbetsgivarorganisation/arbetsgivare och arbetstagarorganisation om anställningsvillkor. Bristande löne- och anställningsförhållanden kan slå mot kravet på gott anseende (2012:211 2 kap. 11 §).",
    note_fr:
      "Connaître la notion de convention collective. TSFS 2021:118, ch. 3, art. 8.",
  }),
  q({
    id: "rs-off-upphandling",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 6 §",
    freq: "medium",
    sv: "Vad ska provdeltagaren kunna om offentlig upphandling? | Alt: A. Inget, taxi upphandlas aldrig | Alt: B. Hur offentliga upphandlingar går till, kunna analysera ett förfrågningsunderlag och känna till hur anbud hanteras | Alt: C. Bara att lägsta pris alltid vinner utan krav | Alt: D. Bara muntliga anbud till nämndens ordförande",
    fr: "Que faut-il savoir sur les marchés publics ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 6 §: deltagaren ska 1) känna till hur offentliga upphandlingar går till, och 2) kunna analysera ett förfrågningsunderlag och känna till hur anbud hanteras. Taxiföretag möter LOU vid skolskjuts, färdtjänst och sjukresor. Avtalade taxor kan undantas från taxitrafiklagens taxebyggande (2012:238 5 kap. 5 §).",
    note_fr:
      "Procédure, dossier de consultation, offres. TSFS 2021:118, ch. 3, art. 6.",
  }),
  q({
    id: "rs-off-konkurrens-samverkan",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 5 §",
    freq: "medium",
    sv: "Vad ska provdeltagaren känna till om samarbete mellan taxiföretag? | Alt: A. Alla prisöverenskommelser är alltid tillåtna | Alt: B. När samarbete är tillåtet enligt konkurrensreglerna och bestämmelserna om gruppundantag för konkurrensbegränsande avtal om viss taxisamverkan | Alt: C. Inget, konkurrenslagen gäller inte taxi | Alt: D. Bara att man måste ha samma taxa i hela länet",
    fr: "Coopération et droit de la concurrence ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 5 §: känna till 1) hur avtal ingås och deras bindande verkan, 2) transportörers rättigheter och skyldigheter vid godstransport, 3) när samarbete mellan taxiföretag är tillåtet enligt konkurrensreglerna, 4) gruppundantag för viss taxisamverkan. Prissamarbete som inte ryms i undantaget kan vara otillåtet.",
    note_fr:
      "Coopération licite et exemption de groupe taxi. TSFS 2021:118, ch. 3, art. 5.",
  }),
  q({
    id: "rs-off-avtal-bindande",
    type: "delprov-1",
    source: "TSFS 2021:118 3 kap. 5 §",
    freq: "medium",
    sv: "Vad ska en tillståndshavare känna till om avtal? | Alt: A. Muntliga avtal saknar alltid verkan | Alt: B. Olika sätt att ingå avtal, avtals giltighet och bindande verkan för taxiföretag | Alt: C. Bara avtal som kommunen skrivit | Alt: D. Avtal gäller först efter kungörelse",
    fr: "Que faut-il savoir sur les contrats ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 5 § 1: känna till olika sätt att ingå avtal, avtals giltighet och bindande verkan för taxiföretag. Avtalslagen (1915:218) utgår från anbud och accept. Ett bindande fast pris eller ett upphandlingsavtal kan inte ensidigt ändras mitt under uppdraget.",
    note_fr:
      "Conclusion, validité, force obligatoire. TSFS 2021:118, ch. 3, art. 5.",
  }),
  q({
    id: "rs-off-ekonomi-handlingar-ts",
    type: "delprov-2",
    source: "transportstyrelsen/ansokan-om-trafiktillstand",
    freq: "medium",
    sv: "Hur gamla får uppgifterna på blanketten för prövning av ekonomiska resurser högst vara? | Alt: A. Två år | Alt: B. Högst två månader (kreditupplysning högst en månad) | Alt: C. Tio år | Alt: D. Ingen tidsgräns",
    fr: "Fraîcheur des pièces financières ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Ansökan om taxitrafiktillstånd: uppgifterna i blanketten TSVY7004/7005 får vara max två månader gamla. Kreditupplysningsutdrag får inte vara äldre än en månad. Balansrapport/periodbokslut högst två månader, alternativt årsbokslut/årsredovisning högst sex månader. Värderingsintyg högst sex månader. Bankens engagemangsbild ska styrka tillgångar.",
    note_fr:
      "Deux mois pour le formulaire ; un mois pour le crédit. Transportstyrelsen, Ansökan om taxitrafiktillstånd.",
  }),
  q({
    id: "rs-off-utland-5-ar",
    type: "delprov-1",
    source: "transportstyrelsen/ansokan-om-trafiktillstand",
    freq: "medium",
    sv: "Vad krävs om du vistats utomlands under de senaste fem åren när du söker taxitrafiktillstånd? | Alt: A. Inget extra | Alt: B. Motsvarande polisregisterutdrag från landet samt originalutdrag som visar att skulder till det allmänna saknas, högst en månad gammalt | Alt: C. Bara ett vykort | Alt: D. Bara svenskt körkort",
    fr: "Séjour à l'étranger : quelles pièces ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen: den som vistats utomlands de senaste fem åren måste skicka polisregisterutdrag från landet (brott) och originalutdrag från myndighet som visar att det saknas skulder till det allmänna. Utdraget om skulder får inte vara äldre än en månad. Transportstyrelsen hämtar det svenska polisutdraget själv. Handlingar som inte är på svenska eller engelska måste översättas.",
    note_fr:
      "Casier et attestation d'absence de dettes publiques. Transportstyrelsen, Ansökan om taxitrafiktillstånd.",
  }),

  // ——— Delprov 3: Tekniska normer, drift, trafiksäkerhet ———
  q({
    id: "rs-off-planera-transportekonomi",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 15 §",
    freq: "medium",
    sv: "Vad ska provdeltagaren kunna om färdplanering och last? | Alt: A. Inget | Alt: B. Planera en färd så att god transportekonomi uppnås och beräkna fordons maximala last | Alt: C. Bara att köra kortaste vägen oavsett kostnad | Alt: D. Bara att lasta över maxvikten om kunden betalar mer",
    fr: "Planification et charge utile ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 15 §: deltagaren ska kunna 1) planera en färd så att god transportekonomi uppnås, och 2) beräkna fordons maximala last. Överlast är både olagligt och slår mot däck, bromsar och försäkring.",
    note_fr:
      "Économie de parcours et charge maximale. TSFS 2021:118, ch. 3, art. 15.",
  }),
  q({
    id: "rs-off-forebyggande-underhall",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 16 §",
    freq: "medium",
    sv: "Vad ska tillståndshavaren kunna redogöra för om fordon och miljö? | Alt: A. Bara färgen på lacken | Alt: B. Värdet av förebyggande fordonsunderhåll samt vägtransporters miljöpåverkan och hur fordon ska framföras så att bränsle, luftföroreningar och buller minimeras | Alt: C. Inget miljökrav | Alt: D. Bara att tomgång alltid är bäst",
    fr: "Entretien et environnement ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 16 §: redogöra för 1) värdet av förebyggande fordonsunderhåll, 2) miljöpåverkan och sparsam körning, 3) registreringsbesiktning och kontrollbesiktning, 4) hjul och däck (mönsterdjup, dubb, vinter, kombinationer, dimensioner, märkning).",
    note_fr:
      "Maintenance préventive et conduite sobre. TSFS 2021:118, ch. 3, art. 16.",
  }),
  q({
    id: "rs-off-reg-vs-kontrollbesikt",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 16 §+transportstyrelsen/fordon-i-taxitrafik",
    freq: "high",
    sv: "Vad är skillnaden mellan registreringsbesiktning för taxitrafik och kontrollbesiktning? | Alt: A. Ingen skillnad | Alt: B. Registreringsbesiktning krävs för att fordonet ska få anmälas till taxitrafik; kontrollbesiktning är den återkommande besiktningen av fordonets beskaffenhet | Alt: C. Kontrollbesiktning ersätter taxameterbesiktning | Alt: D. Registreringsbesiktning görs bara av kommunen",
    fr: "Réception taxi ou contrôle technique ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 16 § 3 kräver kunskap om båda. Transportstyrelsen: du kan bara anmäla ett fordon som är registreringsbesiktat för taxitrafik. Kontrollbesiktning enligt fordonslagen är den periodiska kontrollen. Taxameterbesiktning är en separat årlig kontroll (2012:238 5 kap. 3 §).",
    note_fr:
      "Réception taxi pour l'anmälan ; contrôle périodique du véhicule. TSFS 2021:118, ch. 3, art. 16.",
  }),
  q({
    id: "rs-off-monsterdjup-sommar",
    type: "delprov-3",
    source: "transportstyrelsen/dack+TSFS 2009:19",
    freq: "high",
    sv: "Vilket mönsterdjup krävs minst vid sommarväglag? | Alt: A. 0,5 millimeter | Alt: B. 1,6 millimeter | Alt: C. 8 millimeter | Alt: D. Inget krav",
    fr: "Profondeur minimale en été ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Däck: vid sommarväglag ska däck ha minst 1,6 millimeters mönsterdjup. Närmare krav finns i TSFS 2009:19. TSFS 2021:118 3 kap. 16 § kräver att deltagaren kan redogöra för mönsterdjup.",
    note_fr: "1,6 mm. Transportstyrelsen, Däck ; TSFS 2009:19.",
  }),
  q({
    id: "rs-off-vinterdack-latt",
    type: "delprov-3",
    source: "SFS 1998:1276 4 kap. 18 a §+transportstyrelsen/vinterdack",
    freq: "high",
    sv: "När ska personbil och lätt lastbil ha vinterdäck? | Alt: A. Hela året | Alt: B. 1 december–31 mars när vinterväglag råder | Alt: C. Bara i januari | Alt: D. Aldrig i tätort",
    fr: "Période des pneus hiver pour un taxi léger ?",
    answer: "B",
    note_sv:
      "Trafikförordningen (1998:1276) 4 kap. 18 a §: 1 december–31 mars ska personbil, lätt lastbil, lätt buss med flera ha vinterdäck eller likvärdig utrustning när vinterväglag råder. Transportstyrelsen: minsta mönsterdjup 3 mm under perioden (5 mm för personbil klass II över 3 500 kg). Vinterväglag = snö, is, snömodd eller frost; polisen avgör på plats.",
    note_fr:
      "1er décembre–31 mars si conditions hivernales. SFS 1998:1276, ch. 4, art. 18 a.",
  }),
  q({
    id: "rs-off-monsterdjup-vinter-3",
    type: "delprov-3",
    source: "transportstyrelsen/vinterdack",
    freq: "high",
    sv: "Vilket mönsterdjup krävs minst på vinterdäck för personbil och lätt lastbil under vinterdäckperioden? | Alt: A. 1,6 millimeter | Alt: B. 3 millimeter | Alt: C. 8 millimeter | Alt: D. Inget extra krav",
    fr: "Profondeur des pneus hiver sur un léger ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Vinterdäck: minsta mönsterdjup är 3 mm under perioden 1 december–31 mars för personbilar och lätta lastbilar. För personbil klass II med totalvikt över 3 500 kg är kravet minst 5 mm. Blanda inte ihop med sommarkravet 1,6 mm.",
    note_fr: "3 mm. Transportstyrelsen, Vinterdäck.",
  }),
  q({
    id: "rs-off-dubbdack-period",
    type: "delprov-3",
    source: "transportstyrelsen/vinterdack",
    freq: "high",
    sv: "När är det tillåtet att använda dubbdäck, även utan att vinterväglag redan råder? | Alt: A. Hela året | Alt: B. 1 oktober–15 april; dessutom när det är eller befaras bli vinterväglag även utanför perioden | Alt: C. Bara 1 december–31 mars | Alt: D. Aldrig i Sverige",
    fr: "Période des pneus à clous ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Vinterdäck: dubbdäck får användas 1 oktober–15 april. Om det är eller befaras bli vinterväglag får dubbdäck användas även utanför perioden. Personbil och lätt lastbil får inte blanda dubbade och odubbade däck samtidigt. Kommuner kan förbjuda dubbdäck på vissa gator.",
    note_fr:
      "1er octobre–15 avril, ou hors période si conditions hivernales. Transportstyrelsen, Vinterdäck.",
  }),
  q({
    id: "rs-off-basta-dack-bak",
    type: "delprov-3",
    source: "transportstyrelsen/dack",
    freq: "low",
    sv: "Var bör de däck med störst mönsterdjup eller bäst väggrepp sitta? | Alt: A. Alltid fram | Alt: B. Bak, för att minska risken för sladd vid bromsning och i svängar | Alt: C. Det spelar ingen roll | Alt: D. Bara på släpet",
    fr: "Meilleurs pneus à l'avant ou à l'arrière ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Däck (allmänt råd): de däck som har det största mönsterdjupet eller bedöms ha det bästa väggreppet bör vara monterade bak, både på fram- och bakhjulsdrivna bilar. Detsamma gäller största dubbutsticket.",
    note_fr: "À l'arrière. Transportstyrelsen, Däck.",
  }),
  q({
    id: "rs-off-farligt-gods",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 17 §",
    freq: "medium",
    sv: "Vad ska provdeltagaren kunna om farligt gods i taxitrafik? | Alt: A. Inget, taxi får aldrig röra farligt gods | Alt: B. Tillämpa de bestämmelser om transport av farligt gods som kan bli aktuella i taxitrafik och känna till begreppet värdeberäknad mängd | Alt: C. Bara ADR-intyg för lastbil 40 ton | Alt: D. Bara att bensin i dunk alltid är fritt",
    fr: "Marchandises dangereuses en taxi ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 17 §: kunna tillämpa bestämmelserna om transport av farligt gods som kan bli aktuella i taxitrafik och känna till begreppet värdeberäknad mängd. Värdeberäknad mängd är den begränsade mängd farligt gods som får medföras utan full ADR-utrustning/utbildning, beräknad med poäng per farligt ämne.",
    note_fr:
      "Règles ADR applicables au taxi et quantité limitée calculée. TSFS 2021:118, ch. 3, art. 17.",
  }),
  q({
    id: "rs-off-ag-olycka-kunskap",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 18 §",
    freq: "high",
    sv: "Vilket ansvar har arbetsgivaren vid olycksfall, akut sjukdom eller kris på arbetsplatsen? | Alt: A. Inget, bara föraren ansvarar | Alt: B. Att säkerställa att det på arbetsplatsen finns kunskap om vilka åtgärder som ska vidtas | Alt: C. Bara att ringa efteråt | Alt: D. Bara om mer än 50 anställda finns",
    fr: "Devoir de l'employeur en cas d'accident ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 18 §: deltagaren ska kunna redogöra för vilket ansvar arbetsgivaren har att säkerställa att det på arbetsplatsen finns kunskap om vilka åtgärder som ska vidtas vid olycksfall, akut sjukdom eller krissituationer. Det hör ihop med arbetsmiljölagen och åtgärder mot hot och våld (3 kap. 8 §).",
    note_fr:
      "S'assurer que les gestes d'urgence sont connus. TSFS 2021:118, ch. 3, art. 18.",
  }),
  q({
    id: "rs-off-kontrollera-tfl",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 19 §",
    freq: "high",
    sv: "Vad ska tillståndshavaren kunna om förares behörigheter? | Alt: A. Inget, föraren ansvarar själv | Alt: B. Redogöra för vilka behörigheter taxiförare ska ha, betydelsen av att kontrollera giltigheten av taxiförarlegitimation och hur sådan kontroll kan göras | Alt: C. Bara att köra utan TFL första månaden | Alt: D. Bara körkort B räcker alltid",
    fr: "Contrôle de la carte professionnelle ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 19 §: redogöra för behörigheter, betydelsen av att kontrollera TFL-giltighet och hur kontrollen kan göras. SFS 2012:211 5 kap. 4 §: tillståndshavare som uppsåtligen eller av oaktsamhet anlitar förare utan TFL döms till böter eller fängelse högst sex månader. Kontroll kan göras i vägtrafikregistret / e-tjänster och genom att se den synliga legitimationen.",
    note_fr:
      "Vérifier la validité de la TFL. TSFS 2021:118, ch. 3, art. 19.",
  }),
  q({
    id: "rs-off-skriftliga-anvisningar",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 20 §",
    freq: "medium",
    sv: "Vad ska tillståndshavaren kunna utarbeta till förarna om fordonskontroll? | Alt: A. Inget | Alt: B. Skriftliga anvisningar om hur kontroll av fordonets funktion, säkerhet, utrustning och lastens skick kan utföras | Alt: C. Bara en muntlig hälsning | Alt: D. Bara en dekal i vindrutan",
    fr: "Consignes écrites de contrôle véhicule ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 20 §: känna till betydelsen av att kontrollera fordonets funktion, säkerhet och utrustning samt lastens skick. Dessutom kunna utarbeta skriftliga anvisningar till förarna om hur kontrollen kan utföras.",
    note_fr:
      "Oui, des consignes écrites. TSFS 2021:118, ch. 3, art. 20.",
  }),
  q({
    id: "rs-off-nollvisionen",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 21 §",
    freq: "medium",
    sv: "Vad ska provdeltagaren känna till om Nollvisionen? | Alt: A. Inget | Alt: B. Nollvisionen och dess betydelse för det egna trafiksäkerhetsarbetet | Alt: C. Att Nollvisionen bara gäller tåg | Alt: D. Att Nollvisionen ersätter taxitrafiklagen",
    fr: "Que faut-il savoir sur Nollvisionen ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 21 §: känna till 1) Nollvisionen och dess betydelse för det egna trafiksäkerhetsarbetet, 2) sambandet mellan hastighet, bältesanvändning och personskador, 3) läkemedel, alkohol och andra droger, 4) trötthet. Nollvisionen är riksdagens mål att ingen ska dödas eller skadas allvarligt i trafiken.",
    note_fr:
      "Vision Zéro et travail interne de sécurité. TSFS 2021:118, ch. 3, art. 21.",
  }),
  q({
    id: "rs-off-hastighet-balte",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 21 §",
    freq: "medium",
    sv: "Vilket samband ska tillståndshavaren känna till för trafiksäkerheten? | Alt: A. Inget samband finns | Alt: B. Sambandet mellan hastighet, bältesanvändning och risken för personskador | Alt: C. Bara att bälte är frivilligt i taxi | Alt: D. Bara att högre fart alltid är säkrare",
    fr: "Vitesse, ceinture et blessures ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 21 § 2: känna till sambandet mellan hastighet, bältesanvändning och risken för personskador. Högre fart ökar både risken för olycka och skadans svårighetsgrad; bälte minskar personskador. Tillståndshavaren ska kunna styra det egna trafiksäkerhetsarbetet utifrån detta.",
    note_fr:
      "Vitesse et ceinture déterminent le risque de blessure. TSFS 2021:118, ch. 3, art. 21.",
  }),
  q({
    id: "rs-off-alkohol-droger",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 21 §",
    freq: "high",
    sv: "Vad ska tillståndshavaren känna till om alkohol, droger och läkemedel? | Alt: A. Inget, bara föraren ansvarar | Alt: B. Hur de påverkar körförmågan och risken för olyckor | Alt: C. Att alkohol är tillåtet i låg dos i taxi | Alt: D. Att läkemedel aldrig påverkar",
    fr: "Alcool, drogues, médicaments ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 21 § 3: känna till hur läkemedel eller alkohol och andra droger påverkar körförmågan och risken för olyckor. En tillståndshavare som låter en påverkad förare köra riskerar både straff och återkallelse (olämplighet / allvarliga missförhållanden).",
    note_fr:
      "Effet sur la conduite et le risque d'accident. TSFS 2021:118, ch. 3, art. 21.",
  }),
  q({
    id: "rs-off-trotthet",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 21 §",
    freq: "high",
    sv: "Varför ingår trötthet i kunskapskraven för taxitrafiktillstånd? | Alt: A. Trötthet påverkar inte säkerheten | Alt: B. Deltagaren ska känna till hur trötthet inverkar på trafiksäkerheten | Alt: C. Bara som en rekommendation utan betydelse | Alt: D. Bara för nattbuss",
    fr: "Pourquoi la fatigue est-elle au programme ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 21 § 4: känna till hur trötthet inverkar på trafiksäkerheten. Det kopplar direkt till vilotidsreglerna (22 § och SFS 1994:1297): 11 timmars dygnsvila, eller delad vila med minst 8 timmar i ena perioden.",
    note_fr:
      "La fatigue dégrade la sécurité. TSFS 2021:118, ch. 3, art. 21.",
  }),
  q({
    id: "rs-off-vilotid-tillampning",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 22 §",
    freq: "high",
    sv: "Vad ska tillståndshavaren kunna om vilotider? | Alt: A. Bara att läsa tidboken efteråt | Alt: B. Tillämpa bestämmelserna om vilotider och personlig tidbok samt analysera om en transport får genomföras med hänsyn till vilotidsbestämmelserna | Alt: C. Inget, bara föraren räknar | Alt: D. Bara EU:s 45-timmarsveckovila för tung lastbil",
    fr: "Que doit savoir l'exploitant sur les repos ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 22 §: kunna 1) tillämpa vilotider och personlig tidbok, och 2) analysera om en transport får genomföras. SFS 1994:1297 3 §: minst 11 timmars dygnsvila under föregående 24-timmarsperiod; vila får delas i två perioder varav en minst 8 timmar. Jour, medåkning och annat förvärvsarbete räknas inte som vila.",
    note_fr:
      "Appliquer 11/8 h et juger si la course est licite. TSFS 2021:118, ch. 3, art. 22.",
  }),
  q({
    id: "rs-off-vila-inte-jour",
    type: "delprov-3",
    source: "SFS 1994:1297 3 §",
    freq: "high",
    trap: "Jour i bilen räknas som vila",
    sv: "Räknas jourtjänst i fordonet som dygnsvila? | Alt: A. Ja, alltid | Alt: B. Nej; tid då föraren är tillgänglig på arbetsplatsen eller i fordonet på grund av jour eller liknande räknas inte som dygnsvila | Alt: C. Ja, om kunden inte sitter i bilen | Alt: D. Ja, de första tre timmarna",
    fr: "L'astreinte compte-t-elle comme repos ?",
    answer: "B",
    note_sv:
      "SFS 1994:1297 3 § andra stycket: som dygnsvila räknas annan tid än den tid under vilken föraren a) utför eller är tillgänglig för transporter eller annat förvärvsarbete, b) medföljer i bilen under färd, eller c) är tillgänglig på arbetsplatsen eller i fordonet på grund av jourtjänst eller liknande.",
    note_fr:
      "Non : astreinte, travail ou présence en marche. SFS 1994:1297, art. 3.",
  }),
  q({
    id: "rs-off-tidbok-sju-dygn",
    type: "delprov-3",
    source: "SFS 1994:1297 6 §+transportstyrelsen/vilotider-latta-fordon",
    freq: "high",
    sv: "Hur många dygns anteckningar ska tidboken innehålla? | Alt: A. Bara innevarande dag | Alt: B. Anteckningar för de sju senaste dygnen under vilka föraren varit skyldig att göra anteckningar | Alt: C. Tio år | Alt: D. Inga, muntligt räcker",
    fr: "Combien de jours dans le tidbok ?",
    answer: "B",
    note_sv:
      "SFS 1994:1297 6 §: tidboken ska vara personlig och innehålla anteckningar för de sju senaste dygnen under vilka föraren varit skyldig att göra anteckningar. Formulär fastställs av Transportstyrelsen (TSFS 2015:17). Transportstyrelsen: namn på varje sida; en tidbok åt gången; avslutad bok behålls en vecka och lämnas sedan tillbaka.",
    note_fr: "Les sept derniers jours concernés. SFS 1994:1297, art. 6.",
  }),
  q({
    id: "rs-off-tidbok-medfora",
    type: "delprov-3",
    source: "SFS 1994:1297 7 §",
    freq: "high",
    sv: "Vad gäller för tidboken under färd? | Alt: A. Den får lämnas hemma | Alt: B. Den ska medföras och på begäran tillhandahållas polisman eller bilinspektör | Alt: C. Bara en kopia hos arbetsgivaren räcker i bilen | Alt: D. Den ska skickas till Skatteverket varje dag",
    fr: "Le tidbok doit-il être dans le véhicule ?",
    answer: "B",
    note_sv:
      "SFS 1994:1297 7 §: tidboken ska medföras under färden. Föraren ska på begäran av polisman eller bilinspektör tillhandahålla boken. Brott ger penningböter för både förare och arbetsgivare (12 §).",
    note_fr: "Oui, à présenter. SFS 1994:1297, art. 7.",
  }),
  q({
    id: "rs-off-ag-forteckning-tidbok",
    type: "delprov-3",
    source: "transportstyrelsen/vilotider-latta-fordon+SFS 1994:1297 9–10 §§",
    freq: "medium",
    sv: "Vad ska arbetsgivaren göra utöver att lämna ut tidböcker utan kostnad? | Alt: A. Inget mer | Alt: B. Anteckna utlämning och återlämning, föra förteckning, visa upp anteckningar på begäran och bevara dem minst tolv månader | Alt: C. Bara slänga böckerna efter en vecka | Alt: D. Bara skriva förarens smeknamn",
    fr: "Devoirs de l'employeur sur les tidbok ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen: ge tidböcker med företagets och utlämnarens namn, adress och telefon; anteckna datum för utlämning och återlämning; ha förteckning; visa upp på begäran; bevara minst tolv månader. SFS 1994:1297 9–10 §§: tillhandahålla tidbok utan kostnad, se till att anteckningar görs, tillhandahålla handlingar vid kontroll i lokalen eller hos Polismyndigheten.",
    note_fr:
      "Registre, dates, conservation 12 mois. Transportstyrelsen ; SFS 1994:1297, art. 9–10.",
  }),
  q({
    id: "rs-off-fardskrivare-istallet",
    type: "delprov-3",
    source: "transportstyrelsen/vilotider-latta-fordon",
    freq: "low",
    sv: "Får en godkänd färdskrivare användas i stället för personlig tidbok? | Alt: A. Nej, aldrig | Alt: B. Ja, om den är godkänd och fungerar; vid kontroll ska innevarande dag och de 28 närmast föregående kalenderdagarna kunna visas | Alt: C. Ja, utan några uppvisandekrav | Alt: D. Bara analog färdskrivare är tillåten",
    fr: "Tachygraphe à la place du tidbok ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen: om det finns en godkänd och fungerande färdskrivare får den användas i stället för personlig tidbok. Analog: namn på diagramblad och anteckning om dygnsvila. Digital/smart: förarkort, OUT-läge och manuell inmatning av föregående dygnsvila. Vid kontroll: innevarande dag + 28 föregående kalenderdagar.",
    note_fr:
      "Oui si le tachygraphe est agréé ; 28 jours à présenter. Transportstyrelsen, Vilotider för lätta fordon.",
  }),
  q({
    id: "rs-off-vilotid-galler-taxi",
    type: "delprov-3",
    source: "SFS 1994:1297 2 §",
    freq: "high",
    sv: "Gäller förordningen om vilotider vid vissa vägtransporter för taxitrafik? | Alt: A. Nej, bara för lastbil över 3,5 ton | Alt: B. Ja, den gäller bland annat fordon som används i taxitrafik enligt taxitrafiklagen | Alt: C. Bara på landsväg | Alt: D. Bara för skolskjuts med buss",
    fr: "Les règles de repos s'appliquent-elles au taxi ?",
    answer: "B",
    note_sv:
      "SFS 1994:1297 2 §: förordningen gäller bland annat bil som 2) används i taxitrafik enligt taxitrafiklagen (2012:211), och 3) används för skolskjutsning enligt 1970:340 om bilen är lämplig för högst nio personer inklusive föraren. Transportstyrelsen upprepar samma tillämpningsområde.",
    note_fr: "Oui. SFS 1994:1297, art. 2.",
  }),
  q({
    id: "rs-off-avvikelse-olycka",
    type: "delprov-3",
    source: "SFS 1994:1297 4 §",
    freq: "low",
    sv: "När får tillfälliga avvikelser från dygnsvilan göras? | Alt: A. När det är bra för intäkten | Alt: B. När det är påkallat av olyckshändelse eller annan särskild omständighet som inte har kunnat förutses | Alt: C. Varje fredag | Alt: D. Aldrig",
    fr: "Dérogation temporaire au repos ?",
    answer: "B",
    note_sv:
      "SFS 1994:1297 4 §: tillfälliga avvikelser från 3 § får göras när detta är påkallat av olyckshändelse eller annan särskild omständighet som inte har kunnat förutses. Det är inte en planeringsventil för extra pass.",
    note_fr:
      "Accident ou circonstance imprévisible. SFS 1994:1297, art. 4.",
  }),
  q({
    id: "rs-off-ag-penningboter-vila",
    type: "delprov-3",
    source: "SFS 1994:1297 12 §",
    freq: "medium",
    sv: "Vad kan arbetsgivaren dömas till om tidbok och vilotidsanteckningar inte sköts? | Alt: A. Inget | Alt: B. Penningböter | Alt: C. Alltid fängelse i två år | Alt: D. Bara erinran från kommunen",
    fr: "Sanction de l'employeur sur le tidbok ?",
    answer: "B",
    note_sv:
      "SFS 1994:1297 12 §: arbetsgivare som uppsåtligen eller av oaktsamhet bryter mot 5, 8, 9 eller 10 § döms till penningböter. Förare döms till penningböter vid brott mot 3, 5, 6 eller 7 §. Kopior av domar ska sändas till Transportstyrelsen.",
    note_fr: "Amende (penningböter). SFS 1994:1297, art. 12.",
  }),
  q({
    id: "rs-off-gula-skyltar-bestall",
    type: "delprov-3",
    source: "transportstyrelsen/fordon-i-taxitrafik",
    freq: "medium",
    sv: "Vad kan du göra i samband med att du anmäler ett fordon till taxitrafik? | Alt: A. Inget mer | Alt: B. Beställa gula registreringsskyltar och anmäla vilken redovisningscentral taxametern överför till | Alt: C. Bara byta till svarta skyltar | Alt: D. Avregistrera fordonet",
    fr: "Que faire lors de l'anmälan du véhicule ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Fordon i taxitrafik: när du gör fordonsanmälan kan du samtidigt beställa gula registreringsskyltar. Du ska också anmäla vilken redovisningscentral som fordonets taxameter överför uppgifter till. Vid avanmälan ska de gula skyltarna återlämnas.",
    note_fr:
      "Plaques jaunes + centrale. Transportstyrelsen, Fordon i taxitrafik.",
  }),
  q({
    id: "rs-off-fast-pris-i-taxameter",
    type: "delprov-3",
    source: "transportstyrelsen/taxameter",
    freq: "high",
    sv: "När ska ett i förväg uppgjort pris registreras i taxametern? | Alt: A. Efter färden | Alt: B. När körningen påbörjas | Alt: C. Bara om kunden ber om det | Alt: D. Aldrig, fast pris ska inte synas i taxametern",
    fr: "Quand enregistrer un prix fixe ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Taxameter: om föraren kör till ett fast pris ska priset registreras i taxametern när körningen påbörjas. För app-tjänster: om priset är uppgjort på förhand ska det registreras innan körningen påbörjas; annars ska taxametern beräkna priset. Föraren ska registrera varje köruppdrag och körpass så att kvitto, följesedel och körpassrapport kan framställas.",
    note_fr:
      "Au début de la course. Transportstyrelsen, Taxameter.",
  }),
  q({
    id: "rs-off-app-samma-regler",
    type: "delprov-3",
    source: "transportstyrelsen/taxameter",
    freq: "medium",
    sv: "Gäller reglerna om taxameteranvändning även körning för app-tjänster? | Alt: A. Nej, appar är undantagna | Alt: B. Ja, samma regler gäller när resan bokas och betalas i en app | Alt: C. Bara om jämförpriset överstiger 700 kronor | Alt: D. Bara nattetid",
    fr: "Les applis échappent-elles au taximètre ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Taxameter: reglerna om hur taxametern ska användas gäller även förare som kör för app-tjänster, det vill säga att resan bokas i en app och betalningen sker via appen. Fast pris registreras före start; annars beräknar taxametern priset.",
    note_fr: "Non, les mêmes règles s'appliquent. Transportstyrelsen, Taxameter.",
  }),
  q({
    id: "rs-off-tariff-i-taxameter",
    type: "delprov-3",
    source: "TSFS 2013:41 6 kap. 3 och 6 §§",
    freq: "medium",
    sv: "Hur ska tariffer vara registrerade och uttryckta? | Alt: A. Bara muntligt | Alt: B. Tariffer som bestämmer färdavgiften ska finnas registrerade i taxametern; tid i kr/timme, sträcka i kr/km, fast pris i kronor | Alt: C. Bara på företagets Facebook | Alt: D. Valfri enhet",
    fr: "Comment exprimer les tarifs ?",
    answer: "B",
    note_sv:
      "TSFS 2013:41 6 kap. 3 §: om färdavgiften bestäms med hjälp av tariffer ska dessa finnas registrerade i taxametern. 6 §: tariffparameter för tid anges i kronor per timme, för sträcka i kronor per kilometer, för fast pris i kronor.",
    note_fr:
      "Enregistrés dans le taximètre, kr/h et kr/km. TSFS 2013:41, ch. 6, art. 3 et 6.",
  }),
  q({
    id: "rs-off-upphandlad-taxa",
    type: "delprov-3",
    source: "SFS 2012:238 5 kap. 5 §",
    freq: "low",
    sv: "Gäller taxitrafiklagens krav på taxans uppbyggnad även när avtalet ingåtts genom upphandling med andra villkor? | Alt: A. Ja, alltid utan undantag | Alt: B. Nej, då gäller inte lagens och föreskrifternas krav på taxans uppbyggnad för sådana transporter | Alt: C. Bara på helger | Alt: D. Bara om jämförpriset är under 700 kronor",
    fr: "Tarif issu d'un marché public ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 5 kap. 5 §: för transporter där avtal om taxitrafik genom upphandling eller på liknande sätt ingåtts enligt andra villkor i fråga om taxans uppbyggnad än i taxitrafiklagen, gäller inte lagens och föreskrifternas krav på taxans uppbyggnad.",
    note_fr:
      "Les exigences de structure tarifaire cèdent devant le marché. SFS 2012:238, ch. 5, art. 5.",
  }),
  q({
    id: "rs-off-skylt-forvaring-vecka",
    type: "delprov-3",
    source: "SFS 2012:238 5 kap. 7 §",
    freq: "low",
    sv: "Hur länge förvaras omhändertagna taxiskyltar hos Polismyndigheten innan de förstörs om de inte återlämnas? | Alt: A. En dag | Alt: B. En vecka efter omhändertagandet; de får återlämnas om förhållandet i 5 kap. 8 § taxitrafiklagen inte längre gäller | Alt: C. Ett år | Alt: D. Tills vidare utan tidsgräns",
    fr: "Durée de conservation des plaques saisies ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 5 kap. 7 §: registreringsskyltar som tagits om hand ska förvaras hos Polismyndigheten under en vecka efter omhändertagandet. De får under denna tid återlämnas till ägaren om förhållandet i 5 kap. 8 § taxitrafiklagen inte längre gäller. Annars ska myndigheten förstöra dem.",
    note_fr: "Une semaine. SFS 2012:238, ch. 5, art. 7.",
  }),
  q({
    id: "rs-off-amne-teknik-4",
    type: "delprov-3",
    source: "TSFS 2021:118 3 kap. 16 §",
    freq: "medium",
    sv: "Vilka däckfrågor ska provdeltagaren kunna redogöra för? | Alt: A. Bara däckets färg | Alt: B. Mönsterdjup, dubbdäck, vinterdäck, fordonskombinationer, hjul- och däckdimensioner samt märkningar och egenskaper hos typgodkända däck | Alt: C. Bara sommardäck | Alt: D. Inga däckregler",
    fr: "Quels points pneus sont au programme ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 3 kap. 16 § 4: redogöra för bestämmelserna om användning av hjul och däck när det gäller a) mönsterdjup, b) dubbdäck, c) vinterdäck, d) olika fordonskombinationer, e) hjul- och däckdimensioner, och f) märkningar av och egenskaper hos typgodkända däck.",
    note_fr:
      "Profondeur, clous, hiver, combinaisons, dimensions, marquages. TSFS 2021:118, ch. 3, art. 16.",
  }),
  q({
    id: "rs-off-tungt-vinter-10-nov",
    type: "delprov-3",
    source: "SFS 1998:1276 4 kap. 18 b §+transportstyrelsen/vinterdack",
    freq: "low",
    sv: "Vilket vinterdäckskrav gäller tung lastbil och tung buss från 2025? | Alt: A. Samma som personbil, bara vid vinterväglag 1 december–31 mars | Alt: B. 10 november–10 april, vinterdäck eller likvärdig utrustning oavsett om det är vinterväglag eller inte | Alt: C. Inget krav | Alt: D. Bara dubbdäck hela året",
    fr: "Pneus hiver des poids lourds ?",
    answer: "B",
    note_sv:
      "Trafikförordningen 4 kap. 18 b § (SFS 2025:881): 10 november–10 april ska tung lastbil, tung buss och släpvagn till dessa ha vinterdäck eller likvärdig utrustning. Transportstyrelsen: detta gäller oavsett vinterväglag. Mönsterdjup minst 5 mm på de tunga bilarna; släp minst 1,6 mm. Taxi körs oftast med lätta fordon (18 a §), men kunskapskravet omfattar även kombinationer.",
    note_fr:
      "10 novembre–10 avril, même sans neige. SFS 1998:1276, ch. 4, art. 18 b.",
  }),

  // ——— Delprov 4: fördjupning / kontrollprov ———
  q({
    id: "rs-off-d4-format",
    type: "delprov-4",
    source: "TSFS 2021:118 2 kap. 3–4 §§",
    freq: "high",
    sv: "Hur ser delprov 4 i yrkeskunnande för taxitrafik ut? | Alt: A. 20 poänggivande frågor på 45 minuter | Alt: B. 15 poänggivande frågor (plus 5 testfrågor), minst 9 rätt, 120 minuter | Alt: C. Muntligt prov hos kommunen | Alt: D. Bara en fallstudie utan tidsgräns",
    fr: "Format de l'épreuve 4 ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 3–4 §§: delprov 4 ska bestå av 15 frågor; minst 9 rätta svar. Fem testfrågor räknas inte. Provtid 120 minuter (180 vid förlängd tid). Trafikverket: 20 frågor på skärmen, högst 15 poäng. Delprov 4 är också kontrollprovet enligt 2 kap. 6 § taxitrafikförordningen.",
    note_fr:
      "15 questions notées, 9 justes, 120 minutes. TSFS 2021:118, ch. 2, art. 3–4.",
  }),
  q({
    id: "rs-off-d4-kontrollprov",
    type: "delprov-4",
    source: "TSFS 2021:118 2 kap. 2 §+SFS 2012:238 2 kap. 6 §",
    freq: "high",
    sv: "Vad är delprov 4 utöver fördjupade kunskaper om delprov 1–3? | Alt: A. Inget mer | Alt: B. Det fungerar också som det kontrollprov som kan krävas vid undantag från provskyldigheten efter lång praktik | Alt: C. Det ersätter taxiförarlegitimationen | Alt: D. Det är bara en frivillig övning",
    fr: "L'épreuve 4 est-elle aussi un contrôle ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 2 §: delprov 4 fungerar också som det kontrollprov som avses i 2 kap. 6 § andra stycket taxitrafikförordningen. Den som har minst fem års erfarenhet som trafikansvarig eller på företagsledningsnivå kan få undantag från vanliga delprov om kontrollprovet godkänns.",
    note_fr:
      "Oui, c'est l'épreuve de contrôle. TSFS 2021:118, ch. 2, art. 2.",
  }),
  q({
    id: "rs-off-d4-scenario-utebliven",
    type: "delprov-4",
    source: "SFS 2012:211 2 a kap. 4 § och 4 kap. 2 §",
    freq: "high",
    sv: "Ett fordon har stått stilla en hel vecka. Tillståndshavaren skickar inga taxameteruppgifter och lämnar inget besked till redovisningscentralen. Vad gäller? | Alt: A. Inget krav, tystnad räcker | Alt: B. Besked om att taxametern inte brukats och om orsaken ska lämnas senast när överföringen skulle ha skett; upprepad underlåtenhet att överföra kan leda till återkallelse | Alt: C. Bara en påminnelse efter ett år | Alt: D. Bara föraren kan straffas",
    fr: "Véhicule à l'arrêt : que transmettre ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 a kap. 4 §: om taxametern inte brukats ska tillståndshavaren ge redovisningscentralen besked och ange orsak, senast vid tidpunkten för överföringen. 4 kap. 2 § 4: upprepad underlåtenhet att överföra taxameteruppgifter ska leda till återkallelse. Transportstyrelsen ser uteblivna överföringar i tillsynen.",
    note_fr:
      "Informer la centrale ; répétition = retrait. SFS 2012:211, ch. 2 a, art. 4 et ch. 4, art. 2.",
  }),
  q({
    id: "rs-off-d4-scenario-dod-forestandare",
    type: "delprov-4",
    source: "SFS 2012:211 2 kap. 15 §",
    freq: "high",
    sv: "Tillståndshavaren dör. Dödsboet vill fortsätta trafiken. Vad måste ske inom en månad? | Alt: A. Inget, tillståndet gäller livstid för arvingarna | Alt: B. En föreståndare som uppfyller lämplighetskraven i 2 kap. 5 § ska anmälas till prövningsmyndigheten, annars upphör tillståndet | Alt: C. Bara en anmälan till kommunen inom ett år | Alt: D. Trafiken måste upphöra samma dag",
    fr: "Décès : que faire sous un mois ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 15 §: tillståndet övergår på dödsboet i högst sex månader. För verksamheten ska det finnas en föreståndare godkänd av prövningsmyndigheten; 5 § ska tillämpas på denne. Om föreståndare inte anmälts inom en månad efter dödsfallet upphör tillståndet. Godkänns inte föreståndaren och ingen annan anmäls i tid, upphör tillståndet; om den andra heller inte godkänns upphör det tre veckor efter laga kraft.",
    note_fr:
      "Désigner un föreståndare sous un mois. SFS 2012:211, ch. 2, art. 15.",
  }),
  q({
    id: "rs-off-d4-scenario-utan-tfl",
    type: "delprov-4",
    source: "SFS 2012:211 3 kap. 1 § och 5 kap. 4 §",
    freq: "high",
    sv: "Tillståndshavaren sätter in en extra förare som bara har körkort B, ingen taxiförarlegitimation. Vad kan följa för tillståndshavaren? | Alt: A. Inget, körkort B räcker | Alt: B. Böter eller fängelse i högst sex månader om anlitandet skett uppsåtligen eller av oaktsamhet | Alt: C. Bara en parkeringsanmärkning | Alt: D. Bara föraren kan dömas",
    fr: "Recruter sans TFL : risque pour l'exploitant ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 3 kap. 1 §: personbil eller lätt lastbil får föras i taxitrafik endast av den som har giltig TFL (eller tillfällig rätt enligt 2016:145). 5 kap. 4 §: tillståndshavare som uppsåtligen eller av oaktsamhet anlitar förare utan sådan behörighet döms till böter eller fängelse i högst sex månader. TSFS 2021:118 3 kap. 19 § kräver att giltigheten kontrolleras.",
    note_fr:
      "Amende ou prison ≤ 6 mois. SFS 2012:211, ch. 3, art. 1 et ch. 5, art. 4.",
  }),
  q({
    id: "rs-off-d4-scenario-utoka-utan-kapital",
    type: "delprov-4",
    source: "SFS 2012:211 2 kap. 9–10 §§+SFS 2012:238 4 kap. 5 och 7 §§",
    freq: "high",
    sv: "Ett AB med tillstånd för ett fordon (100 000 kr visade) vill anmäla ett andra fordon utan att visa mer kapital. Vad gäller? | Alt: A. Det går alltid | Alt: B. Utökningen kräver kompletterande utredning; normalt ska ytterligare 50 000 kr kunna visas, och kraven ska fortlöpande vara uppfyllda | Alt: C. Andra fordonet är alltid fritt | Alt: D. Bara kommunen avgör beloppet",
    fr: "Deuxième véhicule sans fonds supplémentaires ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 9 §: 100 000 kr för ett fordon och 50 000 kr för varje ytterligare, om inte särskilda skäl. 10 §: fortlöpande styrkande. SFS 2012:238 4 kap. 5 och 7 §§: vid utökning ska ekonomisk utredning följa och Transportstyrelsen pröva resurserna på nytt.",
    note_fr:
      "50 000 kr de plus, justificatifs. SFS 2012:211, ch. 2, art. 9–10 ; SFS 2012:238, ch. 4, art. 5 et 7.",
  }),
  q({
    id: "rs-off-d4-scenario-bada-utrustningar",
    type: "delprov-4",
    source: "SFS 2012:238 5 kap. 1–2 §§",
    freq: "medium",
    sv: "Ett fordon har både taxameter och särskild utrustning för taxifordon monterad. Är det tillåtet att använda fordonet i taxitrafik? | Alt: A. Ja, det är säkrast | Alt: B. Nej, fordonet får inte samtidigt vara försett med båda utrustningarna | Alt: C. Ja, om båda är plomberade | Alt: D. Ja, under tre månader",
    fr: "Les deux équipements sur le même véhicule ?",
    answer: "B",
    note_sv:
      "SFS 2012:238 5 kap. 2 § förbjuder samtidig montering. 1 §: fordonet ska ha antingen godkänd, kontrollerad och plomberad taxameter eller särskild utrustning enligt 2 b kap. taxitrafiklagen — inte båda.",
    note_fr: "Non, l'un ou l'autre. SFS 2012:238, ch. 5, art. 1–2.",
  }),
  q({
    id: "rs-off-d4-scenario-pris-700",
    type: "delprov-4",
    source: "SFS 2012:211 2 kap. 20–21 §§+transportstyrelsen/prisinformation",
    freq: "high",
    sv: "Jämförpriset är 850 kronor och kunden bokar en taxameterresa utan fast pris. Vad måste ske? | Alt: A. Inget extra | Alt: B. Bindande prisuppgift (högsta pris) när färden beställs och bevis till passageraren före färden | Alt: C. Bara en dekal i vindrutan | Alt: D. Priset får höjas under färden",
    fr: "Jämförpris 850 kr : que faire ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 20–21 §§: prisuppgift ska lämnas när jämförpriset överstiger 1,2 procent av prisbasbeloppet (Transportstyrelsen: 700 kr). Den ska ange högsta pris, lämnas vid beställning, och bevis ska ges passageraren före färden. Undantag: fast pris. Grunderna får inte ändras under färden (18 §).",
    note_fr:
      "Prix plafond à la commande + preuve. SFS 2012:211, ch. 2, art. 20–21.",
  }),
  q({
    id: "rs-off-d4-scenario-betalning-bc",
    type: "delprov-4",
    source: "SFS 2012:211 2 b kap. 3–4 §§",
    freq: "high",
    sv: "Fordonet saknar taxameter och är anslutet till en beställningscentral. Kunden vill betala kontant till föraren i bilen. Är det tillåtet? | Alt: A. Ja, alltid | Alt: B. Nej; betalning ska göras till den beställningscentral som tog emot beställningen, utan förarens eller tillståndshavarens medverkan, och fast pris ska anges före start | Alt: C. Ja, om beloppet är under 700 kronor | Alt: D. Ja, på helger",
    fr: "Payer le conducteur sans taximètre ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 b kap. 3–4 §§: beställningar och betalningar får bara göras till beställningscentralen. Betalningen får inte göras genom förarens eller tillståndshavarens medverkan. Fast pris ska anges innan uppdraget påbörjas och bevis lämnas före färden.",
    note_fr:
      "Paiement uniquement à la centrale. SFS 2012:211, ch. 2 b, art. 3–4.",
  }),
  q({
    id: "rs-off-d4-scenario-aterkallelse-skatt",
    type: "delprov-4",
    source: "SFS 2012:211 4 kap. 1–2 §§",
    freq: "high",
    sv: "Företaget har väsentligt underlåtit att betala skatter och avgifter. Vad ska prövningsmyndigheten göra? | Alt: A. Ingenting | Alt: B. Återkalla tillståndet; om missförhållandena inte är så allvarliga får varning meddelas i stället | Alt: C. Bara höja jämförpriset | Alt: D. Bara meddela kommunen",
    fr: "Impôts impayés : quelle suite ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 4 kap. 2 § 3: tillstånd ska återkallas om någon prövad i väsentlig mån inte fullgjort skyldigheter mot det allmänna avseende skatter och avgifter. 1 §: allvarliga missförhållanden eller att förutsättningarna i 2 kap. 5 § inte längre är uppfyllda ska leda till återkallelse; annars varning. Innan beslut ska tillståndshavaren få skälig tid att byta ut en olämplig person (4 §).",
    note_fr:
      "Retrait, ou avertissement si moins grave. SFS 2012:211, ch. 4, art. 1–2.",
  }),
  q({
    id: "rs-off-d4-scenario-oanvant",
    type: "delprov-4",
    source: "SFS 2012:211 4 kap. 5 §+transportstyrelsen/tillsyn-for-taxitrafiktillstand",
    freq: "high",
    sv: "Tillståndet finns kvar men inget fordon är anmält i taxitrafik. Vad ska normalt ske? | Alt: A. Tillståndet vilar utan tidsgräns | Alt: B. Tillståndet ska återkallas om det inte används och särskilda skäl inte talar emot; avsaknad av anmält fordon ses som att tillståndet inte används | Alt: C. Automatisk förlängning i tio år | Alt: D. Bara en avgift på 100 kronor",
    fr: "Permis sans véhicule déclaré ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 4 kap. 5 §: tillstånd ska återkallas om det inte används och särskilda skäl inte talar emot, eller på begäran om verksamhet inte bedrivits eller upphör. Transportstyrelsen: saknas fordon anmält i taxitrafik ses tillståndet som oanvänt.",
    note_fr:
      "Retrait pour non-usage. SFS 2012:211, ch. 4, art. 5.",
  }),
  q({
    id: "rs-off-d4-scenario-vila-analys",
    type: "delprov-4",
    source: "SFS 1994:1297 3 §+TSFS 2021:118 3 kap. 22 §",
    freq: "high",
    sv: "Klockan 16.00 ska en förare påbörja ett uppdrag. Senaste dygnsvilan var 7 timmar i ett stycke. Får transporten genomföras? | Alt: A. Ja, 7 timmar räcker alltid | Alt: B. Nej; dygnsvilan ska vara minst 11 timmar, eller delad i två perioder varav en minst 8 timmar | Alt: C. Ja, om kunden betalar mer | Alt: D. Ja, på vardagar",
    fr: "7 h de repos suffisent-elles ?",
    answer: "B",
    note_sv:
      "SFS 1994:1297 3 §: minst 11 timmar under föregående 24-timmarsperiod, eller två perioder varav en minst 8 timmar. 7 timmar i ett stycke räcker inte. TSFS 2021:118 3 kap. 22 §: tillståndshavaren ska kunna analysera om transporten får genomföras. Att släppa ut föraren är arbetsgivaransvar.",
    note_fr:
      "Non : 11 h, ou 8 h dans une des deux périodes. SFS 1994:1297, art. 3.",
  }),
  q({
    id: "rs-off-d4-scenario-byta-vd",
    type: "delprov-4",
    source: "SFS 2012:211 2 kap. 4 och 7 §§+SFS 2012:238 2 kap. 10 §",
    freq: "medium",
    sv: "Ett aktiebolag med taxitrafiktillstånd byter verkställande direktör. Vad måste ske? | Alt: A. Inget, den gamle VD:n förblir trafikansvarig | Alt: B. Den nye VD:n är trafikansvarig och ska lämplighetsprövas; bytet ska anmälas till Transportstyrelsen | Alt: C. Bara en anmälan till Bolagsverket räcker för taxitillståndet | Alt: D. Bara revisorn behöver godkännas",
    fr: "Changement de PDG ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 4 §: i AB är VD trafikansvarig om det finns en sådan. 7 §: ny persons lämplighet ska prövas. SFS 2012:238 2 kap. 10 §: anmälan till Transportstyrelsen. Underlåten anmälan: 10 000 kr (7 kap. 4 §). Den nye måste ha godkänt yrkeskunnande.",
    note_fr:
      "Le nouveau DG est traficansvarig ; déclaration + examen. SFS 2012:211, ch. 2, art. 4 et 7.",
  }),
  q({
    id: "rs-off-d4-scenario-overklaga",
    type: "delprov-4",
    source: "SFS 2012:211 6 kap. 1–3 §§+transportstyrelsen/ansokan-om-trafiktillstand",
    freq: "medium",
    sv: "Du får avslag på taxitrafiktillstånd. Hur överklagar du? | Alt: A. Muntligt till kommunen inom ett år | Alt: B. Skriftligt inom tre veckor från delgivning; överklagandet ställs till förvaltningsrätten men skickas till Transportstyrelsen | Alt: C. Bara till Trafikverket | Alt: D. Beslutet kan inte överklagas",
    fr: "Comment contester un refus ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 6 kap. 1 §: beslut överklagas till allmän förvaltningsdomstol. 3 §: fysisk person till den förvaltningsrätt där personen är folkbokförd. Transportstyrelsen: överklaga inom tre veckor från delgivning, ange vilket beslut och vilken ändring, skicka till Transportstyrelsen ställt till förvaltningsrätten. Avslag på gott anseende ger olämplighetstid 6 månader–5 år (2 kap. 12 §).",
    note_fr:
      "Trois semaines, via Transportstyrelsen vers le tribunal. SFS 2012:211, ch. 6.",
  }),
  q({
    id: "rs-off-d4-scenario-rc-val",
    type: "delprov-4",
    source: "SFS 2012:211 2 a kap. 2 §+transportstyrelsen/redovisningscentraler-for-taxi",
    freq: "medium",
    sv: "Till vilken redovisningscentral ska taxameteruppgifter överföras? | Alt: A. Valfri tömningscentral | Alt: B. Den redovisningscentral som tillståndshavaren för varje taxameter har anmält till Transportstyrelsen | Alt: C. Alltid Skatteverket direkt | Alt: D. Kommunens växel",
    fr: "Quelle centrale de reporting ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 a kap. 2 §: överföring ska ske till den redovisningscentral som tillståndshavaren för varje taxameter har anmält. Transportstyrelsen: skriv avtal med en godkänd central som kan ta emot just din taxameter och anmäl via e-tjänsten Fordon i yrkestrafik.",
    note_fr:
      "Celle déclarée pour chaque taximètre. SFS 2012:211, ch. 2 a, art. 2.",
  }),
  q({
    id: "rs-off-d4-scenario-kvitto",
    type: "delprov-4",
    source: "TSFS 2013:41 5 kap. 1 §+transportstyrelsen/taxameter",
    freq: "medium",
    sv: "Efter en avslutad taxameterresa vägrar föraren att erbjuda kvitto. Vad gäller? | Alt: A. Kvitto är frivilligt | Alt: B. Kunden ska erbjudas kvitto från taxametern, eller följesedel om beloppet ska faktureras, i papper eller elektronisk form som kunden kan ta emot | Alt: C. Bara jämförprisdekalen räcker | Alt: D. Kvitto krävs bara över 700 kronor",
    fr: "Le reçu est-il obligatoire ?",
    answer: "B",
    note_sv:
      "TSFS 2013:41 5 kap. 1 § och Transportstyrelsen: efter varje avslutat köruppdrag ska kunden erbjudas kvitto, eller följesedel vid faktura. Elektroniska kvitton får användas om kunden kan ta emot dem. Kvittot ska visa körd sträcka och tid. Taxametern ställs på STOPPAD/KASSA när uppdraget är slut.",
    note_fr:
      "Reçu ou bordereau après chaque course. TSFS 2013:41, ch. 5, art. 1.",
  }),
  q({
    id: "rs-off-d4-sex-manader-glomt",
    type: "delprov-4",
    source: "TSFS 2021:118 2 kap. 7 §",
    freq: "high",
    sv: "Du blev godkänd på delprov 1 den 1 mars. Delprov 2–4 är fortfarande ogjorda den 2 september samma år. Vad gäller? | Alt: A. Delprov 1 gäller i tre år | Alt: B. Hela provet är inte godkänt; samtliga delprov måste vara godkända inom sex månader från det först godkända | Alt: C. Bara delprov 4 behöver göras | Alt: D. Inget problem, tidsgränsen är ett år",
    fr: "Premier succès le 1er mars, reste le 2 septembre ?",
    answer: "B",
    note_sv:
      "TSFS 2021:118 2 kap. 7 §: samtliga delprov ska vara godkända inom sex månader från och med datumet för det först godkända delprovet. 1 mars + sex månader innebär att 2 september ligger utanför fönstret. Då måste kedjan börjas om. Trafikverket beskriver samma regel.",
    note_fr:
      "La fenêtre de six mois est close. TSFS 2021:118, ch. 2, art. 7.",
  }),
  q({
    id: "rs-off-d4-handlaggning-ts",
    type: "delprov-4",
    source: "transportstyrelsen/ansokan-om-trafiktillstand",
    freq: "low",
    sv: "När startar Transportstyrelsens handläggning av en ansökan om taxitrafiktillstånd? | Alt: A. Samma sekund blanketten fylls i | Alt: B. Inom fem till sju veckor från betaldatum; betalda ansökningar hanteras i turordning | Alt: C. Efter tre år | Alt: D. Bara om kommunen begär det",
    fr: "Quand l'instruction commence-t-elle ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen, Ansökan om taxitrafiktillstånd: styrelsen tar ut en avgift. Handläggningen startar inom fem till sju veckor från betaldatum. Betalda ansökningar hanteras i turordning. E-tjänst med e-legitimation eller blankett TSTRY1201.",
    note_fr:
      "5–7 semaines après le paiement. Transportstyrelsen, Ansökan om taxitrafiktillstånd.",
  }),
  q({
    id: "rs-off-d4-komplettering",
    type: "delprov-4",
    source: "transportstyrelsen/ansokan-om-trafiktillstand+SFS 2012:238 2 kap. 5 §",
    freq: "low",
    sv: "Vad händer om Transportstyrelsen behöver fler uppgifter för att pröva ansökan? | Alt: A. Ansökan avslås tyst | Alt: B. Du får en begäran om komplettering med svarsdatum; uppgifter kan lämnas via e-tjänsten Komplettera ärende med dokument | Alt: C. Du måste söka om från början utan att få veta varför | Alt: D. Bara en telefonavisering utan datum",
    fr: "Demande de pièces complémentaires ?",
    answer: "B",
    note_sv:
      "Transportstyrelsen: ibland skickas ett brev med svarsdatum (begäran om komplettering). SFS 2012:238 2 kap. 5 §: sökanden ska på begäran ge in de uppgifter styrelsen behöver. Om kraven inte bedöms uppfyllda skickas en underrättelse med svarsdatum innan beslut. Exempel: upprepade trafikböter, brott, skulder hos Kronofogden, tidigare konkurs eller bristande taxameteröverföringar.",
    note_fr:
      "Complément écrit avec date limite. Transportstyrelsen ; SFS 2012:238, ch. 2, art. 5.",
  }),
  q({
    id: "rs-off-d4-amnen-8",
    type: "delprov-4",
    source: "SFS 2012:211 2 kap. 8 §+TSFS 2021:118 2 kap. 2 §",
    freq: "medium",
    sv: "Hur hänger taxitrafiklagens fyra kunskapsområden ihop med delproven? | Alt: A. De saknar koppling | Alt: B. Delprov 1–3 följer rättsregler, ekonomi/ledning samt teknik/drift/trafiksäkerhet; delprov 4 fördjupar 1–3 | Alt: C. Alla fyra områden ryms bara i delprov 1 | Alt: D. Delprov 4 handlar bara om kartläsning",
    fr: "Lien entre la loi et les épreuves ?",
    answer: "B",
    note_sv:
      "SFS 2012:211 2 kap. 8 §: provet ska avse rättsregler, företagsledning och ekonomisk ledning, tekniska normer och driftsförhållanden samt trafiksäkerhet. TSFS 2021:118 2 kap. 2 § lägger områdena i delprov 1, 2, 3 (teknik + trafiksäkerhet) och 4 (fördjupning). Det är samma fyra kunskapsblock, inte chaufförens kartprov.",
    note_fr:
      "Les quatre blocs de la loi = les quatre épreuves. SFS 2012:211, ch. 2, art. 8.",
  }),
];
