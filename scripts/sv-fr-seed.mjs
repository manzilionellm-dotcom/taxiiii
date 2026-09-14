import { parseSeedTable } from "../lib/glossary-core.mjs";

/**
 * Curated Swedish → French lemmas for Körkort / taxi theory.
 * Quality over invention: only attested, common, or exam-specific senses.
 */
const TABLE = `
# function
och	et
en	un / une
ett	un / une
i	dans
på	sur
är	est
att	que / de
för	pour
med	avec
ska	doit
skall	doit
den	la / le
det	ce / cela
har	a
som	qui / que
jag	je
om	si / à propos de
till	vers / à
vad	quoi / que
av	de
kör	conduit
hur	comment
ja	oui
när	quand
inte	ne … pas
vid	auprès de / à
köra	conduire
kan	peut
din	ton / ta
från	de / depuis
vilken	quel / laquelle
måste	doit
efter	après
nej	non
eller	ou
stanna	s’arrêter
cirka	environ
de	ils / les
gäller	s’applique
blir	devient
men	mais
endast	seulement
mot	vers / contre
före	avant
vilket	lequel
år	an / années
lång	long
vara	être
fram	en avant
eftersom	parce que
dig	toi
vägen	la route
alla	tous
lämna	laisser / quitter
så	ainsi / donc
göra	faire
höger	droite
ut	dehors
vänster	gauche
ha	avoir
under	sous / pendant
än	que
fordon	véhicule
trafik	circulation
väg	route
bilden	l’image
kunden	le client
använda	utiliser
kommer	vient
passagerare	passager
körning	conduite
utan	sans
där	là
personen	la personne
minuter	minutes
in	dans
innan	avant
alltid	toujours
ungefär	environ
enbart	uniquement
trafiken	la circulation
parkera	se garer
timmar	heures
enligt	selon
uppdrag	mission
bara	seulement
bör	devrait
korsningen	l’intersection
senast	au plus tard
däck	pneu
bilens	de la voiture
hastighet	vitesse
tid	temps
månader	mois
två	deux
innebär	signifie
mycket	beaucoup
sig	se
person	personne
kund	client
högst	au plus
mellan	entre
vilka	quels
stannar	s’arrête
körfält	voie
motorn	le moteur
var	était / où
börjar	commence
resan	le trajet
båda	les deux
över	au-dessus / trop
runt	autour
ta	prendre
företräde	priorité
finns	il y a
svänga	tourner
körkort	permis de conduire
här	ici
upp	en haut
föraren	le conducteur
mig	moi
förare	conducteur
mötande	venant en face
bild	image
ser	voit
däcken	les pneus
barn	enfant
avstånd	distance
han	il
sedan	ensuite
dag	jour
åt	vers
rätt	correct / droit
personer	personnes
minskar	diminue
gatan	la rue
tillåtna	autorisé
andra	autres
vägmärket	le panneau
ökar	augmente
rakt	tout droit
längre	plus longtemps
gående	piéton
tar	prend
fått	reçu
totalvikt	poids total
förbjudet	interdit
hastigheten	la vitesse
första	premier
personbil	voiture particulière
högsta	la plus élevée
hålla	tenir / maintenir
först	d’abord
tillåtet	permis
skylten	le panneau
få	obtenir / pouvoir
helt	entièrement
någon	quelqu’un
gör	fait
aldrig	jamais
minsta	le plus petit
körningen	la course
risken	le risque
helgdag	jour férié
röd	rouge
använder	utilise
inom	dans / en
korsning	intersection
bränsleförbrukning	consommation de carburant
sida	côté
ge	donner
märket	le panneau / la marque
minst	au moins
visar	montre
behöver	a besoin
länge	longtemps
dagar	jours
järnvägskorsning	passage à niveau
farten	l’allure
varför	pourquoi
bromsar	freine / freins
varje	chaque
går	va
tre	trois
senaste	dernier
minut	minute
mörker	obscurité
ingen	aucun
ditt	ton
närmaste	le plus proche
fungerar	fonctionne
gods	marchandises
ur	hors de
gånger	fois
vardagar	jours ouvrables
förbud	interdiction
påverkar	influence
mest	le plus
buss	bus
precis	exactement
möjligt	possible
ljus	lumière
ner	en bas
hög	haut
tiden	le temps
bussen	le bus
bromspedalen	la pédale de frein
polisen	la police
tillbaka	en arrière
plats	place
vänta	attendre
körfältet	la voie
sidan	le côté
fortsätta	continuer
släppa	lâcher
upptäcker	découvre
verkstad	atelier
man	on
lätt	facile / léger
område	zone
betyder	signifie
något	quelque chose
bromssträckan	la distance de freinage
honom	lui
närmar	s’approche
halvljus	feux de croisement
lågt	bas
hjälpa	aider
framför	devant
låg	bas
tecken	signe
släp	remorque
fordonet	le véhicule
kronor	couronnes
bilar	voitures
långt	loin
byta	changer
högt	haut
bromsa	freiner
dubbdäck	pneus à clous
varv	tour
rött	rouge
cyklisten	le cycliste
mer	plus
vem	qui
lufttryck	pression d’air
bli	devenir
påverkas	est influencé
lastbil	camion
minska	diminuer
sitta	être assis
husnummer	numéro de maison
då	alors
samma	même
taxibil	taxi
vit	blanc
promille	taux d’alcoolémie
nästa	suivant
hela	tout / toute
omedelbart	immédiatement
motorvägen	l’autoroute
motorväg	autoroute
varnar	avertit
kontrollerar	contrôle
togs	a été pris
utom	sauf
många	beaucoup
bilbälte	ceinture de sécurité
linjen	la ligne
parkeringsförbud	interdiction de stationner
plötsligt	soudainement
kunna	pouvoir
bakgrund	arrière-plan
kvar	restant
bommar	barrières
sänka	abaisser
luft	air
hårt	fort / dur
bakom	derrière
se	voir
föregående	précédent
fast	fixe / bien que
månad	mois
barnet	l’enfant
inget	rien
blå	bleu
parkering	stationnement
vill	veut
lördag	samedi
ny	nouveau
svänger	tourne
svårt	difficile
största	le plus grand
nära	près
orsaken	la cause
totalvikten	le poids total
lastvikten	le poids de charge
anger	indique
genom	par / à travers
tills	jusqu’à
passera	passer
huvudled	route prioritaire
sekunder	secondes
mindre	moins
sämre	pire
trafikanter	usagers
ratten	le volant
kontrollera	contrôler
cyklister	cyclistes
situation	situation
tilläggstavla	panonceau
sjukdom	maladie
gul	jaune
lasta	charger
körningar	courses
köruppdrag	course / mission
normalt	normalement
sammanlagda	total
grund	base
direkt	directement
mönsterdjup	profondeur des sculptures
även	aussi
detta	ceci
vinterdäck	pneus hiver
vi	nous
däcket	le pneu
katalysator	catalyseur
mars	mars
känner	sent / connaît
situationen	la situation
linje	ligne
taxiförare	chauffeur de taxi
både	à la fois
högre	plus élevé
timme	heure
fart	allure
helljus	feux de route
bränsle	carburant
växel	vitesse / rapport
sikten	la visibilité
gå	aller / marcher
förbudet	l’interdiction
söndag	dimanche
ersätter	remplace
medicin	médicament
anfall	crise
heldragen	continue
taxitrafik	trafic de taxi
arbetsgivaren	l’employeur
fem	cinq
via	via
väglag	état de la chaussée
håller	tient
snabbt	vite
motorvärmaren	le préchauffage moteur
ger	donne
starta	démarrer
symbol	symbole
hon	elle
kvitto	reçu
dygnsvila	repos journalier
själv	soi-même
fri	libre
vägrenen	l’accotement
markering	marquage
fylla	remplir
annan	autre
passerar	passe
står	est debout / indique
sevärdhet	site touristique
bäst	le mieux
stopp	stop / arrêt
oavsett	quel que soit
lite	un peu
skador	dégâts
april	avril
fara	danger
fotgängare	piéton
framsätet	le siège avant
torr	sec
övergångsställe	passage piéton
landsväg	route nationale
hjälp	aide
skylt	panneau
jämna	pairs
trycker	appuie
släpvagn	remorque
tjänstevikt	poids à vide
odubbade	sans clous
baksätet	le siège arrière
uppträda	se comporter
användas	être utilisé
fel	faute / erreur
text	texte
dygnen	les 24 heures
tariff	tarif
följande	suivant
behörighet	catégorie de permis
tättbebyggt	aggloméré
sätt	manière
saknas	manque
ned	en bas
skolskjuts	transport scolaire
igen	de nouveau
lämnar	quitte
visa	montrer
händer	arrive / mains
alkohol	alcool
kraftigt	fortement
kortare	plus court
röda	rouges
kort	court / carte
varningsblinkers	feux de détresse
all	tout
udda	impairs
grönt	vert
taxilegitimation	carte professionnelle taxi
utrustad	équipé
tidboken	le livret de temps
körpass	vacation
utanför	à l’extérieur
regeln	la règle
vecka	semaine
tidbok	livret de temps
vilotid	temps de repos
färd	trajet
fyra	quatre
krävs	est exigé
bort	loin
saknar	manque de
intill	à côté de
byter	change
skyldig	obligé
lika	égal
dina	tes
klockan	l’heure
tidigast	au plus tôt
långsamt	lentement
bränsleförbrukningen	la consommation
växla	changer de rapport
personbilar	voitures particulières
snabbare	plus vite
olja	huile
vikten	le poids
egen	propre
stor	grand
olyckan	l’accident
gångfart	allure du pas
sakta	lentement
framåt	en avant
släpvagnen	la remorque
besiktning	contrôle technique
pris	prix
används	est utilisé
vattenplaning	aquaplanage
annat	autre
prisinformationen	l’information tarifaire
busshållplats	arrêt de bus
krav	exigence
taxibilen	le taxi
linjetrafik	service de ligne
måndag	lundi
räkna	calculer
särskilt	surtout
låter	laisse / sonne
klass	classe
lägga	poser
lägre	plus bas
last	chargement
medan	pendant que
störst	le plus grand
platsen	l’endroit
placera	placer
märke	panneau / marque
förbjuden	interdit
anpassa	adapter
sidor	côtés
tung	lourd
välja	choisir
sjunker	baisse
bromsen	le frein
väger	pèse
bete	appât / se comporter
situationer	situations
vinter	hiver
hos	chez
samtidigt	en même temps
börja	commencer
vidare	plus loin
grön	vert
påbörja	commencer
ton	tonne
trafikolycka	accident de la circulation
kört	conduit
ringer	appelle
tomgång	ralenti
andas	respirer
temperaturen	la température
motor	moteur
tillstånd	autorisation
vatten	eau
allra	le plus
extra	supplémentaire
bilbarnstol	siège-auto
krockkudde	airbag
sitter	est assis
skadorna	les dégâts
väntar	attend
kallsvettig	en sueur froide
påbudsmärke	panneau d’obligation
gata	rue
vardag	jour ouvrable
trafikförsäkring	assurance circulation
vinterväglag	chaussée d’hiver
lyser	brille
släpet	la remorque
hastighetsbegränsningen	la limitation de vitesse
situationerna	les situations
påverka	influencer
troliga	probable
kosta	coûter
veckan	la semaine
tätort	agglomération
godkänd	approuvé
streck	trait
däckens	des pneus
riktning	direction
samt	ainsi que
max	maximum
avståndet	la distance
tillfälle	occasion
blivit	devenu
funktion	fonction
typ	type
dubbade	à clous
åka	aller / rouler
flygplats	aéroport
hälften	la moitié
växeln	le rapport
barnen	les enfants
strax	bientôt
högerregeln	règle de la priorité à droite
rulla	rouler
katalysatorn	le catalyseur
några	quelques
håll	côté / tiens
fungera	fonctionner
effektivt	efficacement
december	décembre
startar	démarre
reaktionstid	temps de réaction
sekund	seconde
olyckor	accidents
tänds	s’allume
försiktigt	prudemment
säker	sûr
dricka	boire
förbi	au-delà
ringa	appeler
fortsätter	continue
kräver	exige
ram	cadre
vägmärke	panneau de signalisation
vända	faire demi-tour
bruttovikt	poids brut
förra	précédent
vätska	liquide
kunder	clients
bor	habite
hjul	roue
dygnsvilan	le repos journalier
begär	demande
kontroll	contrôle
ofta	souvent
räknas	compte
påstående	affirmation
taxiförarlegitimation	carte professionnelle de taxi
råder	règne
alternativ	alternative
finnas	exister
sex	six
nya	nouveaux
regel	règle
längs	le long de
behövs	est nécessaire
besiktningen	le contrôle
regelbundet	régulièrement
taxitrafiken	le trafic de taxi
polis	police
avstängd	fermé
halva	moitié
hämta	aller chercher
denna	cette
oktober	octobre
frågar	demande
fornlämning	vestige
växlar	change de rapport
varvtal	régime moteur
fortare	plus vite
slits	s’use
natten	la nuit
sin	son / sa
drar	tire
trött	fatigué
sträcka	distance
förändras	change
rak	droit
förutom	sauf
högra	droit
helljuset	les feux de route
blinka	clignoter
följa	suivre
styra	diriger
lastbilen	le camion
ihop	ensemble
beredd	prêt
luften	l’air
korsande	qui croise
god	bon
väja	céder
be	prier / demander
bakifrån	par derrière
sön	dim.
lördagar	samedis
söndagar	dimanches
körförbud	interdiction de circuler
stoppförbud	interdiction de s’arrêter
datumparkering	stationnement selon la date
dess	son
övergångsstället	le passage piéton
hållplatsskylten	le panneau d’arrêt
kommit	venu
försäkring	assurance
bak	arrière
dimljus	feux de brouillard
cirkulationsplatsen	le giratoire
medicinen	le médicament
rygg	dos
jämförpriset	le prix de comparaison
därefter	ensuite
besiktas	être contrôlé
tillsammans	ensemble
sju	sept
arbetsgivare	employeur
riktigt	correct
ålder	âge
väl	bien
parkerar	se gare
smal	étroit
komma	venir
körförmåga	aptitude à conduire
augusti	août
dygnet	les 24 heures
slutar	termine
halt	glissant
avfart	sortie
accelererar	accélère
når	atteint
ljud	bruit
koldioxid	dioxyde de carbone
ute	dehors
effekt	effet / puissance
ämnen	substances
bränslesnålt	économe en carburant
start	démarrage
system	système
bils	de la voiture
vikt	poids
varm	chaud
vet	sait
reflexer	réflecteurs
upptäcka	découvrir
kallas	s’appelle
bakåtvänd	orienté vers l’arrière
bälteskudde	rehausseur
bakåt	en arrière
rekommenderas	est recommandé
hinna	avoir le temps
bältet	la ceinture
sakert	sûrement
säkert	sûrement
smuts	saleté
låta	laisser
rör	touche / tubes
blek	pâle
lastbilens	du camion
vägar	routes
hastighetsgränsen	la limitation de vitesse
asfalt	asphalte
flera	plusieurs
stannat	arrêté
trötthet	fatigue
parkeringsljus	feux de stationnement
runda	ronds
botten	fond
tillåten	autorisé
krysset	la croix
pil	flèche
fordonen	les véhicules
dra	tirer
bromssystemet	le système de freinage
bromsvätska	liquide de frein
värme	chaleur
sönder	cassé
förarens	du conducteur
astma	asthme
benet	la jambe
period	période
gång	fois / passage
priset	le prix
kilometer	kilomètres
skriva	écrire
per	par
alls	du tout
gången	la fois
behålla	conserver
dygn	vingt-quatre heures
antal	nombre
kopia	copie
vänstra	gauche
hinder	obstacle
ändras	est modifié
september	septembre
viloperiod	période de repos
fastställd	fixé
lagen	la loi
fredag	vendredi
hinner	a le temps
ligger	se trouve
reaktionssträcka	distance de réaction
fort	vite
sidled	latéralement
spara	économiser
lägger	pose
kolmonoxid	monoxyde de carbone
grader	degrés
bensin	essence
förbrukningen	la consommation
systemet	le système
jämfört	par rapport à
kall	froid
motorbromsa	freiner moteur
skada	dommage
bedöma	évaluer
stoppa	arrêter
skillnad	différence
nedsatt	réduit
äldre	plus âgé
oskyddade	usagers vulnérables
moped	cyclomoteur
varna	avertir
dagen	le jour
skadade	blessés
styrservon	la direction assistée
hållplats	arrêt
förlorar	perd
förbjuder	interdit
helgdagar	jours fériés
rekommendation	recommandation
allmän	général
hänsyn	égard
stopplinje	ligne d’arrêt
gula	jaunes
trafiksignalen	le feu
avfarten	la sortie
parkeringsbromsen	le frein de parking
helförsäkring	assurance tous risques
lättare	plus léger
släpets	de la remorque
lampan	la lampe
bilderna	les images
taxin	le taxi
henne	elle
högerregel	priorité à droite
ätit	mangé
körkortsbehörighet	catégorie de permis
sjukhus	hôpital
lyfter	soulève
epilepsi	épilepsie
nivå	niveau
obalans	déséquilibre
tog	prit
koppla	atteler
timmars	heures
personliga	personnel
inklusive	y compris
plombera	plomber
godstransport	transport de marchandises
resa	voyage
belopp	montant
ansvarar	est responsable
synlig	visible
korta	courts
vägkanten	le bord de la chaussée
beror	dépend
vägbanan	la chaussée
tillståndshavare	titulaire de l’autorisation
kallad	appelé
länsstyrelse	préfecture de comté
betryggande	suffisant
förordning	règlement
tidtabell	horaire
motorcykel	moto
vilar	se repose
vissa	certains
inblandad	impliqué
beräknas	est calculé
sällskapet	la compagnie
godo	à l’actif
undrar	se demande
kyrka	église
hittar	trouve
dessa	ceux-ci
möter	rencontre
temperatur	température
noll	zéro
asfalten	l’asphalte
gasen	l’accélérateur
ozon	ozone
undvika	éviter
batteri	batterie
öka	augmenter
miljön	l’environnement
vattnet	l’eau
köras	être conduit
onödigt	inutile
öppna	ouvrir
oftast	le plus souvent
risk	risque
rullar	roule
bromsarna	les freins
viktigaste	le plus important
deras	leur
längd	longueur
krockkudden	l’airbag
hindra	empêcher
farligt	dangereux
mängd	quantité
mitt	mon / milieu
midnatt	minuit
larma	alerter
hjulen	les roues
sidoläge	position latérale
vägbana	chaussée
cyklist	cycliste
blinkar	clignote
tänker	pense
misstag	erreur
innehåller	contient
kollision	collision
siffror	chiffres
tecknet	le signe
korsa	traverser
påstigning	montée à bord
parentes	parenthèse
framdäcken	pneus avant
månaden	le mois
kryss	croix
spårvagn	tramway
vägren	accotement
bötesbeloppet	l’amende
ambulansen	l’ambulance
troligaste	le plus probable
bromsservon	l’assistance de freinage
behållaren	le réservoir
gammal	vieux
halvförsäkring	assurance au tiers étendu
vanligt	habituel
maxlast	charge maximale
november	novembre
kultryck	charge sur le crochet
antingen	soit
läkare	médecin
transport	transport
kostnaden	le coût
angående	concernant
diabetes	diabète
körsätt	style de conduite
eventuell	éventuel
samband	lien
utrustning	équipement
ansvaret	la responsabilité
anställd	salarié
felskrivna	mal écrit
fastställt	fixé
bland	parmi
taxiförarlegitimationen	la carte professionnelle de taxi
böter	amende
trafikverket	Administration des transports
följer	suit
färg	couleur
mittlinje	ligne médiane
varning	avertissement
vänder	fait demi-tour
ifrån	de
sluta	arrêter
färdtjänst	transport adapté
ske	se produire
transportstyrelse	Direction des transports
uppehåll	arrêt
vila	repos
poliskontroll	contrôle de police
vilotidsförordningen	règlement sur les temps de repos
tio	dix
tanke	pensée
svart	noir
tala	parler
centrum	centre
sträckan	le trajet
regna	pleuvoir
skolan	l’école
medför	entraîne
framkörningen	l’approche
sommardäck	pneus été
blända	éblouir
höjd	hauteur
motorvärmare	préchauffage moteur
motorbromsar	freine moteur
riskerar	risque
sliter	use
mjukt	doucement
bidrar	contribue
marknära	près du sol
inkopplad	branché
nedtryckt	enfoncé
elbilar	voitures électriques
bättre	meilleur
inbromsning	freinage
oförändrad	inchangé
höga	élevés
hastigheter	vitesses
full	plein
gas	accélérateur / gaz
istället	au lieu de
lag	loi
regn	pluie
tunga	lourds
vanlig	habituel
köregenskaper	comportement routier
klara	réussir / clair
vägmärken	panneaux
namn	nom
fritt	libre
långsammare	plus lentement
tillåter	autorise
kläder	vêtements
blodet	le sang
skyddade	protégés
varningslampa	témoin d’alerte
is	glace
närmare	plus près
bra	bien
kant	bord
springer	court
mitten	le milieu
svarta	noirs
uppmärksam	attentif
invänta	attendre
varmt	chaud
dit	là-bas
exempelvis	par exemple
redan	déjà
korsar	traverse
meddela	informer
slutat	terminé
irriterad	irrité
omkörning	dépassement
tyngre	plus lourd
spår	voie / traces
övriga	autres
cykelbana	piste cyclable
vita	blancs
infart	entrée
vitt	blanc
cykelöverfart	traversée cyclable
överfarten	la traversée
stopplikt	obligation d’arrêt
pilen	la flèche
enkelriktad	à sens unique
leder	mène
vägvisare	jalonnement
motortrafikled	voie rapide
mål	but / destination
strecket	le trait
angivelsen	l’indication
snarast	dès que possible
nu	maintenant
markeringen	le marquage
skyldighet	obligation
sker	se produit
rörelsehindrade	personnes à mobilité réduite
inne	à l’intérieur
stör	dérange
böterna	l’amende
gällande	en vigueur
anmärkning	observation
slitna	usés
styrningen	la direction
pedalen	la pédale
styrservo	direction assistée
nivån	le niveau
passageraren	le passager
glykol	glycol
skick	état
övergångställe	passage piéton
tvungen	obligé
övergångstället	le passage piéton
cykeln	le vélo
punktering	crevaison
bilbältet	la ceinture
körpassrapporten	le rapport de vacation
lyfta	soulever
ben	jambe
afasi	aphasie
huvudet	la tête
hör	entend
påverkad	sous influence
fråga	question
kupén	l’habitacle
regummerade	rechapés
motoroljan	l’huile moteur
sidorna	les côtés
spännband	sangle
delas	est partagé
närmast	le plus proche
avslutat	terminé
grundavgift	prise en charge
påbörjat	commencé
fordonets	du véhicule
särskild	particulier
reglerna	les règles
haft	eu
skrivit	écrit
transportstyrelsen	Direction des transports
betydelse	signification
barnets	de l’enfant
lägsta	la plus basse
registreringsbevis	certificat d’immatriculation
därför	c’est pourquoi
regler	règles
fängelse	prison
exempel	exemple
fastighet	immeuble
uppdraget	la mission
fall	cas
nedanstående	ci-dessous
motsvarar	correspond
promillehalt	taux d’alcool
taxiföretag	entreprise de taxi
anteckningar	annotations
persontransport	transport de personnes
åtta	huit
passet	la vacation
tillfälligt	temporairement
tisdag	mardi
registrerad	enregistré
texten	le texte
utföra	effectuer
jämförpris	prix de comparaison
flygplatsen	l’aéroport
stycken	pièces
markeringar	marquages
slott	château
badplats	lieu de baignade
telemast	antenne
vandringsled	sentier de randonnée
frågan	la question
morgontrafiken	le trafic du matin
sjukresan	le transport sanitaire
avståndsmarkeringarna	les repères de distance
kartan	la carte
garaget	le garage
utsatt	exposé
sänker	abaisse
tidigt	tôt
säger	dit
skadliga	nocifs
försvinner	disparaît
släpper	lâche
kväveoxider	oxydes d’azote
bästa	le meilleur
motorns	du moteur
laddhybrider	hybrides rechargeables
stadstrafik	trafic urbain
batteriet	la batterie
rekommenderat	recommandé
tappar	perd
kopplingen	l’embrayage
vintern	l’hiver
del	partie
reagerar	réagit
varandra	l’un l’autre
lämpligt	approprié
oljor	huiles
lufttrycket	la pression
korrekt	correct
luftmotståndet	la résistance de l’air
kraft	force
kännetecknar	caractérise
hjälper	aide
information	information
menas	on entend
uppgift	information / tâche
viss	certain
rattfylleri	conduite en état d’ivresse
agera	agir
stänga	fermer
snabbast	le plus vite
ändå	quand même
äta	manger
slår	frappe
syn	vue
skadan	le dégât
kraftig	fort
mobilen	le téléphone
instrumentpanelen	le tableau de bord
hand	main
kontakta	contacter
försöker	essaie
vrida	tourner
rullatorn	le déambulateur
flytta	déplacer
genast	aussitôt
olycksplats	lieu d’accident
känns	se sent
syns	se voit
dubbelt	double
fryser	gèle
just	justement
hårdare	plus fort
vanligaste	le plus courant
eventuella	éventuels
ljuset	la lumière
närheten	les environs
bashastigheten	la vitesse de base
skillnaden	la différence
anges	est indiqué
form	forme
motordrivna	à moteur
staket	clôture
spårväg	voie de tram
motorcyklar	motos
cykelgata	rue cyclable
tåg	train
varningsmärket	le panneau de danger
datum	date
mötesplats	aire de croisement
ånglok	locomotive à vapeur
parkeringsplats	place de parking
rekommenderad	recommandé
passerat	dépassé
uppsatt	placé
avsedd	destiné
körbanan	la chaussée
ambulans	ambulance
sirener	sirènes
blåljus	gyrophare
hindrar	empêche
traktor	tracteur
obevakat	non gardé
parkeringsplatser	places de parking
bussar	bus
bromsbeläggen	les plaquettes
kontrollbesiktas	passer le contrôle
felet	le défaut
destillerat	distillé
utökad	élargie
personskador	blessures
vållande	responsabilité
bromssträcka	distance de freinage
axel	essieu
tungt	lourdement
spolarvätska	lave-glace
tryck	pression
dela	partager
parkerad	garé
förhindrar	empêche
taxiförarelegitimation	carte professionnelle de taxi
inrättad	aménagé
korsningar	intersections
tillkopplat	attelé
början	le début
bagage	bagages
tänka	penser
sjuk	malade
råkar	arrive à
lättar	allège
insulinkänning	hypoglycémie
bakdörren	la portière arrière
öppnas	s’ouvre
stroke	AVC
synskadad	malvoyant
öppnar	ouvre
årsmodell	année-modèle
växthuseffekten	l’effet de serre
hjärtfel	maladie cardiaque
symbolen	le symbole
lider	souffre
instrument	instrument
panel	panneau
frisk	en bonne santé
markerar	marque
kroppsvikten	le poids du corps
läckage	fuite
parkinson	Parkinson
bröstet	la poitrine
armar	bras
darrig	tremblant
trafikfarlig	dangereux pour la circulation
syfte	but
hjulinställning	géométrie des roues
lastsäkring	arrimage
tåla	supporter
avgasar	gaz d’échappement
förankrad	amarré
bokstav	lettre
vägverket	ancien office des routes
följesedel	bordereau
skolskjutsning	transport scolaire
dispens	dérogation
transporter	transports
räcker	suffit
hemma	à la maison
nytt	nouveau
visas	est montré
beställningscentralen	la centrale de réservation
överstiger	dépasse
bindande	contraignant
köruppdraget	la course
förnyas	est renouvelé
stockholm	Stockholm
tappat	perdu
anmäla	déclarer
typer	types
vägens	de la route
tillfällig	temporaire
vägarbete	travaux
exakt	exact
hållet	le côté
stoppad	arrêté
färden	le trajet
fastpris	prix forfaitaire
företagets	de l’entreprise
förutsatt	à condition que
olika	différents
procent	pour cent
bestämmelser	dispositions
maximalt	au maximum
långkörning	longue course
ytterligare	supplémentaire
maximal	maximal
morgon	matin
tidboksbladet	la feuille du livret
onsdag	mercredi
tillfälliga	temporaires
norrköping	Norrköping
linköping	Linköping
hämtningen	la prise en charge
restiden	le temps de trajet
vägkorsning	intersection
ögonkontakt	contact visuel
ni	vous
gram	gramme
kilo	kilo
kroppsvikt	poids corporel
timmen	l’heure
stress	stress
partiklar	particules
tungmetaller	métaux lourds
hoppa	sauter
friläge	point mort
sent	tard
koppling	attelage / embrayage
försämrar	dégrade
modern	moderne
friktion	frottement
strängaste	le plus strict
klarar	réussit
accelerationen	l’accélération
normal	normal
diesel	diesel
avgaser	gaz d’échappement
svaveldioxid	dioxyde de soufre
kallstart	démarrage à froid
brant	raide
moderna	modernes
marginellt	marginalement
tvätta	laver
människor	personnes
renar	purifie
yrkestrafik	trafic professionnel
giftiga	toxiques
utsläppen	les émissions
etanol	éthanol
manuell	manuel
aggressiv	agressif
skapar	crée
längst	le plus loin
vanliga	habituels
bredare	plus large
årligen	chaque année
miljoner	millions
bensinbilen	la voiture essence
dieselbilen	la voiture diesel
stilla	immobile
periferiseende	vision périphérique
utgör	constitue
nästan	presque
rörelser	mouvements
döda	morts
snett	en biais
reflex	réflecteur
mörkerseendet	la vision nocturne
tunnelseende	vision tunnel
godkända	approuvés
babyskydd	cosy bébé
bältesstol	siège rehausseur
säkerhetsbälte	ceinture de sécurité
tittar	regarde
mörkerseende	vision nocturne
stolen	le siège
andel	part
omkommer	décède
färdas	voyage
säkrast	le plus sûr
reaktionstiden	le temps de réaction
ungefärliga	approximatif
ingenting	rien
års	ans
spelar	joue
tidig	précoce
synfält	champ visuel
läkaren	le médecin
svårare	plus difficile
tydligt	clairement
viktigt	important
rådjur	chevreuil
älgen	l’élan
djur	animal
kolliderat	est entré en collision
snö	neige
rullator	déambulateur
oväntat	inattendu
varningstriangel	triangle de présignalisation
telefonnummer	numéro de téléphone
upplever	ressent
faktiskt	en fait
föremål	objet
# units & abbreviations
km	kilomètres
min	minutes
kg	kilogrammes
h	heures
kr	couronnes
mm	millimètres
cm	centimètres
tim	heures
ca	environ
kl	à (heure)
abs	ABS
ac	climatisation
euro	euro
rv	route nationale
lgf	LGF
ex	par ex.
ii	II
cl	centilitres
# pronouns & grammar leftover
du	tu
bilen	la voiture
bil	voiture
taxi	taxi
meter	mètres
din	ton / ta
de	ils / les
a	a
b	b
c	c
d	d
e	e
p	p
g	g
m	m
s	s
t	t
r	r
an	vers
# more common exam
väjningsplikt	obligation de céder le passage
taxameter	taximètre
taxametern	le taximètre
plomberad	plombé
prisinformation	information tarifaire
taxitrafiktillstånd	autorisation d’exploiter un taxi
tillståndshavaren	le titulaire de l’autorisation
yrkesförare	conducteur professionnel
säkerhetsavstånd	distance de sécurité
alkoholkoncentration	concentration d’alcool
viltolycka	collision avec un animal sauvage
skyddsanordning	dispositif de retenue
cirkulationsplats	giratoire
stopplikt	obligation d’arrêt
tättbebyggt område	agglomération
sommarväglag	chaussée d’été
arbetspass	vacation
arbetspassets	de la vacation
besiktningsorgan	organisme de contrôle agréé
ackrediterad	accrédité
jourtjänst	astreinte
trottoarkanten	la bordure de trottoir
trottoarkant	bordure de trottoir
yrkestrafikmärke	vignette trafic professionnel
förnyelse	renouvellement
redovisningscentral	centre de déclaration fiscale
redovisningscentralen	le centre de déclaration
plombering	plombage
plomberingsrapport	rapport de plombage
taxameteruppgifter	données du taximètre
taxameterns	du taximètre
kontrollbesiktning	contrôle technique
vilotids	des temps de repos
vilotiden	le temps de repos
vilotider	temps de repos
jämförpris	prix de comparaison
prisuppgift	prix maximal contraignant
prisuppgiften	le prix indiqué
startavgift	prise en charge
grundavgift	prise en charge
heldragen linje	ligne continue
heldragna	continue
särskild utrustning	équipement spécial
taxikörning	conduite de taxi
taxifordon	véhicule taxi
legitimation	carte professionnelle
taxiförarlegitimation	carte professionnelle de taxi
förarlegitimation	carte professionnelle
körkortet	le permis
vägmärken	panneaux
högerregeln	priorité à droite
behörigheten	la catégorie
europaväg	route européenne
europavägen	la route européenne
säkerhetsbältet	la ceinture
vägkorsningen	l’intersection
# verbs irregular extras
är	est
varit	été
vore	serait
hade	avait
haft	eu
kunde	pouvait
kunnat	pu
skulle	devrait
får	peut / a le droit
fick	obtint
gjorde	fit
gjort	fait
gick	alla
gått	allé
såg	vit
sett	vu
kom	vint
kommit	venu
blev	devint
blivit	devenu
gav	donna
gett	donné
tagit	pris
sa	dit
sagt	dit
visste	savait
velat	voulu
körde	conduisit
kört	conduit
stod	se tenait
stått	tenu
låg	était couché
legat	été couché
satt	était assis
höll	tenait
hållit	tenu
fanns	existait
funnits	existé
lade	posa
lagt	posé
drog	tira
dragit	tiré
slog	frappa
slagit	frappé
drack	but
druckit	bu
sov	dormit
föll	tomba
# numbers as words
noll	zéro
en	un
ett	un
två	deux
tre	trois
fyra	quatre
fem	cinq
sex	six
sju	sept
åtta	huit
nio	neuf
tio	dix
elva	onze
tolv	douze
tretton	treize
fjorton	quatorze
femton	quinze
sexton	seize
sjutton	dix-sept
arton	dix-huit
nitton	dix-neuf
tjugo	vingt
trettio	trente
fyrtio	quarante
femtio	cinquante
sextio	soixante
sjuttio	soixante-dix
åttio	quatre-vingts
nittio	quatre-vingt-dix
hundra	cent
tusen	mille
första	premier
andra	deuxième
tredje	troisième
# months days
januari	janvier
februari	février
mars	mars
april	avril
maj	mai
juni	juin
juli	juillet
augusti	août
september	septembre
oktober	octobre
november	novembre
december	décembre
måndag	lundi
tisdag	mardi
onsdag	mercredi
torsdag	jeudi
fredag	vendredi
lördag	samedi
söndag	dimanche
# more function
ju	donc
nog	assez
väl	sans doute
även	aussi
också	aussi
redan	déjà
fortfarande	encore
kanske	peut-être
endast	seulement
just	juste
precis	précisément
ungefär	environ
cirka	environ
ofta	souvent
sällan	rarement
alltid	toujours
aldrig	jamais
igen	encore
redan	déjà
snart	bientôt
sedan	ensuite
därefter	ensuite
innan	avant
efteråt	après
nu	maintenant
då	alors
här	ici
där	là
dit	là-bas
hit	ici
hem	à la maison
bort	loin
kvar	rester
ner	en bas
upp	en haut
in	dedans
ut	dehors
fram	en avant
bak	en arrière
igenom	à travers
emot	contre
emellan	entre
bredvid	à côté
ovanför	au-dessus
under	sous
efter	après
före	avant
sedan	depuis
mot	vers
från	de
till	à
åt	vers
ur	hors
av	de
hos	chez
via	via
per	par
plus	plus
minus	moins
# more driving
broms	frein
gasreglage	accélérateur
kopplingspedal	pédale d’embrayage
backspegel	rétroviseur
sidobackspegel	rétroviseur latéral
vindruta	pare-brise
torkare	essuie-glace
blinkers	clignotants
helljus	feux de route
halvljus	feux de croisement
parkeringsljus	feux de position
dimbakljus	feu de brouillard arrière
varningsblinkers	feux de détresse
stopp	arrêt
väjningsplikt	obligation de céder
cirkulationsplats	giratoire
övergångsställe	passage piéton
cykelbana	piste cyclable
vägren	accotement
mittlinje	ligne médiane
heldragen	continue
streckad	discontinue
spärrlinje	ligne de délimitation
körfält	voie
fil	file
filbyte	changement de file
omkörning	dépassement
möte	croisement
mötande	en face
gående	piéton
cyklist	cycliste
mopedist	cyclomotoriste
motorcyklist	motard
lastbil	camion
buss	bus
spårvagn	tram
utryckningsfordon	véhicule d’urgence
blåljus	gyrophare
siren	sirène
ambulans	ambulance
polis	police
räddningstjänst	secours
brandkår	pompiers
olycka	accident
kollision	collision
viltolycka	collision avec un animal
vilt	gibier
älg	élan
rådjur	chevreuil
djur	animal
varningstriangel	triangle
förstahjälpen	premiers secours
larm	alerte
nödläge	urgence
sjukvård	soins
skada	blessure
blödning	saignement
medvetslös	inconscient
chock	choc
alkohol	alcool
narkotika	stupéfiants
läkemedel	médicament
trötthet	fatigue
synfält	champ visuel
reaktionstid	temps de réaction
säkerhetsavstånd	distance de sécurité
bromssträcka	distance de freinage
stopsträcka	distance d’arrêt
väglag	chaussée
halka	verglas
is	glace
snö	neige
regn	pluie
dimma	brouillard
mörker	obscurité
sol	soleil
bländning	éblouissement
vattenplaning	aquaplanage
däck	pneu
mönsterdjup	profondeur des sculptures
lufttryck	pression
dubbdäck	pneus à clous
vinterdäck	pneus hiver
sommardäck	pneus été
slirskydd	dispositif antidérapant
abs	ABS
esp	ESP
krockkudde	airbag
bilbälte	ceinture
barnstol	siège enfant
babyskydd	cosy
bälteskudde	rehausseur
nackstöd	appui-tête
backkamera	caméra de recul
döda vinkeln	angle mort
dödavinkeln	angle mort
spegel	miroir
ratt	volant
pedal	pédale
handbroms	frein à main
växellåda	boîte de vitesses
automat	automatique
manuell	manuelle
koppling	embrayage
motor	moteur
batteri	batterie
generator	alternateur
kylare	radiateur
olja	huile
bensin	essence
diesel	gazole
etanol	éthanol
el	électricité
hybrid	hybride
laddhybrid	hybride rechargeable
elbil	voiture électrique
utsläpp	émissions
avgas	échappement
katalysator	catalyseur
partikelfilter	filtre à particules
miljö	environnement
bränsleförbrukning	consommation
eko	éco
tomgång	ralenti
acceleration	accélération
motorbroms	frein moteur
varvtal	régime
växla	changer de vitesse
starta	démarrer
stanna	s’arrêter
parkera	se garer
backa	reculer
svänga	tourner
köra	conduire
passera	passer
väja	céder
stanna	s’arrêter
# taxi specific extras
taxameter	taximètre
taxametern	le taximètre
plomberad	plombé
plombering	plombage
tidbok	livret de temps
tidboken	le livret
dygnsvila	repos journalier
vilotid	temps de repos
jämförpris	prix de comparaison
prisuppgift	devis contraignant
bindande	contraignant
kvitto	reçu
följesedel	bordereau
redovisningscentral	centre de déclaration
taxitrafiktillstånd	autorisation d’exploiter
tillståndshavare	titulaire
taxiförarlegitimation	carte professionnelle
legitimationen	la carte
beställningscentral	centrale de réservation
prisinformation	information tarifaire
startavgift	prise en charge
jämförpris	prix de comparaison
taxitrafiklag	loi sur le trafic de taxi
taxitrafikförordning	règlement taxi
yrkestrafik	trafic professionnel
körpass	vacation
arbetspass	vacation
arbetsgivare	employeur
anställd	salarié
egenföretagare	indépendant
redovisning	déclaration
skatt	impôt
moms	TVA
kvitto	reçu
kontant	espèces
kortbetalning	paiement par carte
# owner / company
företag	entreprise
bolag	société
aktiebolag	société anonyme
enskild	individuelle
tillstånd	autorisation
fordonspark	parc de véhicules
anställda	salariés
# common adjectives
stor	grand
liten	petit
lång	long
kort	court
hög	haut
låg	bas
snabb	rapide
långsam	lent
farlig	dangereux
säker	sûr
rätt	juste
fel	faux
ny	nouveau
gammal	vieux
varm	chaud
kall	froid
torr	sec
våt	humide
mörk	sombre
ljus	clair
svart	noir
vit	blanc
röd	rouge
blå	bleu
grön	vert
gul	jaune
grå	gris
orange	orange
brun	brun
fri	libre
full	plein
tom	vide
öppen	ouvert
stängd	fermé
synlig	visible
osynlig	invisible
möjlig	possible
omöjlig	impossible
viktig	important
vanlig	habituel
ovanlig	inhabituel
särskild	particulier
allmän	général
privat	privé
offentlig	public
laglig	légal
olaglig	illégal
tillåten	autorisé
förbjuden	interdit
obligatorisk	obligatoire
frivillig	volontaire
personlig	personnel
gemensam	commun
lika	égal
olika	différent
samma	même
nästa	suivant
förra	précédent
första	premier
sista	dernier
enda	seul
båda	les deux
alla	tous
ingen	aucun
någon	quelqu’un
varje	chaque
annan	autre
egen	propre
# more verbs common
använda	utiliser
behöva	avoir besoin
börja	commencer
sluta	terminer
fortsätta	continuer
försöka	essayer
lyckas	réussir
misslyckas	échouer
vänta	attendre
hjälpa	aider
fråga	demander
svara	répondre
berätta	raconter
förklara	expliquer
förstå	comprendre
lära	apprendre
träna	s’entraîner
plugga	étudier
läsa	lire
skriva	écrire
räkna	compter
visa	montrer
titta	regarder
lyssna	écouter
höra	entendre
känna	sentir
tro	croire
tycka	trouver
men	mais
mena	vouloir dire
veta	savoir
känna	connaître
hitta	trouver
leta	chercher
tappa	perdre
glömma	oublier
komma ihåg	se souvenir
ta	prendre
ge	donner
få	obtenir
behöva	devoir
låta	laisser
sätta	mettre
ställa	placer
lägga	poser
hålla	tenir
släppa	lâcher
öppna	ouvrir
stänga	fermer
starta	démarrer
stoppa	arrêter
stanna	s’arrêter
köra	conduire
gå	aller
komma	venir
åka	rouler
resa	voyager
flyga	voler
passera	passer
svänga	tourner
vända	retourner
backa	reculer
parkera	se garer
bromsa	freiner
accelerera	accélérer
öka	augmenter
minska	diminuer
sänka	abaisser
höja	augmenter
ändra	modifier
byta	changer
välja	choisir
anpassa	adapter
kontrollera	contrôler
undersöka	examiner
upptäcka	découvrir
märka	remarquer
se	voir
titta	regarder
undvika	éviter
hindra	empêcher
förbjuda	interdire
tillåta	autoriser
kräva	exiger
gälla	s’appliquer
innebära	signifier
betyda	signifier
orsaka	causer
leda	mener
påverka	influencer
riskera	risquer
skydda	protéger
rädda	sauver
larma	alerter
ringa	appeler
anmäla	déclarer
betala	payer
kosta	coûter
spara	économiser
förbruka	consommer
lasta	charger
tömma	vider
fylla	remplir
tanka	faire le plein
ladda	charger
koppla	brancher
lossa	dételer
säkra	sécuriser
# extra exam leftovers
bashastighet	vitesse de base
tättbebyggt	aggloméré
tättbebyggda	aggloméré
område	zone
väjningsplikt	obligation de céder le passage
väjningsplikten	l’obligation de céder
utfart	sortie de propriété
infart	entrée
avfart	sortie
påfart	bretelle d’accès
rondell	rond-point
cirkulationsplats	giratoire
refug	îlot
mittrefug	îlot central
farthinder	ralentisseur
gupp	bosse
vägbulor	coussins
busshållplats	arrêt de bus
hållplats	arrêt
taxiplats	station de taxi
lastzon	zone de livraison
parkering	stationnement
parkeringsplats	place
p-plats	place de parking
p-skiva	disque de stationnement
avgift	taxe
böter	amende
felparkering	stationnement irrégulier
flyttning	mise en fourrière
bärgning	remorquage
verkstad	atelier
besiktning	contrôle
kontrollbesiktning	contrôle technique
registrering	immatriculation
registreringsbevis	carte grise
trafikförsäkring	assurance
vagnskada	dommages au véhicule
trafikskada	dommage circulation
självrisk	franchise
skadestånd	dommages-intérêts
ansvar	responsabilité
vållande	faute
oaktsamhet	négligence
uppsåt	intention
brott	infraction
påföljd	sanction
böter	amende
fängelse	prison
prickar	points
återkallelse	retrait
spärrtid	période d’interdiction
ögonblickligen	sur-le-champ
omedelbart	immédiatement
först	d’abord
sedan	ensuite
därefter	ensuite
slutligen	enfin
alltså	donc
nämligen	à savoir
dock	cependant
däremot	en revanche
däremot	en revanche
trots	malgré
oavsett	quel que soit
såvida	sauf si
såvitt	pour autant que
ifall	au cas où
således	ainsi
därmed	ainsi
dessutom	en outre
däremot	en revanche
emellertid	cependant
# place names kept dignified
kivik	Kivik
simrishamn	Simrishamn
tomelilla	Tomelilla
landvetter	Landvetter
arlanda	Arlanda
gotland	Gotland
hemse	Hemse
klintehamn	Klintehamn
tofte	Tofte
säby	Säby
asige	Asige
norrköping	Norrköping
linköping	Linköping
göteborg	Göteborg
malmö	Malmö
uppsala	Uppsala
örebro	Örebro
sundsvall	Sundsvall
umeå	Umeå
luleå	Luleå
kalmar	Kalmar
växjö	Växjö
jönköping	Jönköping
karlstad	Karlstad
östersund	Östersund
visby	Visby
helsingborg	Helsingborg
lund	Lund
# compounds / bank forms
taxameterkravet	l’obligation de taximètre
taxameteruppgifter	données du taximètre
kontroll-	contrôle
plomberingsrapport	rapport de plombage
anteckningsskyldighet	obligation de noter
tidböcker	livrets de temps
färdskrivare	chronotachygraphe
godstransport	transport de marchandises
prisresan	le prix du trajet
prisräkning	calcul du prix
bindande prisuppgift	prix maximal contraignant
yrkestrafikmärke	vignette professionnelle
särskild	spécial
utrustning	équipement
taxifordon	véhicule taxi
förnyelse	renouvellement
skolskjuts	transport scolaire
andvända	utiliser
andvänd	utiliser
utrusning	équipement
övergångställe	passage piéton
legtimation	carte professionnelle
taxiförarlegtimation	carte professionnelle de taxi
taxa	tarif
mettern	taximètre
heldragna	continue
trottoarkanten	bordure de trottoir
väjningsplikt	obligation de céder
# extras frequent leftovers
ca	environ
abs	ABS
km	km
h	h
min	min
kg	kg
mm	mm
cm	cm
kr	kr
tim	h
kl	à
euro	euro
# more leftover mid-freq I know
delprov	épreuve partielle
lagstiftning	législation
säkerhet	sécurité
kartläsning	lecture de carte
teoriprov	examen théorique
kunskapsprov	épreuve de connaissances
trafikverket	Trafikverket
transportstyrelsen	Transportstyrelsen
länsstyrelsen	préfecture de comté
kommun	commune
myndighet	autorité
föreskrift	prescription
lag	loi
förordning	règlement
bestämmelse	disposition
regel	règle
undantag	exception
krav	exigence
villkor	condition
giltig	valable
ogiltig	invalide
giltighet	validité
förnya	renouveler
ansöka	demander
ansökan	demande
beslut	décision
överklaga	contester
avgift	redevance
legitimation	pièce d’identité
identitet	identité
personnummer	numéro personnel
adress	adresse
namn	nom
underskrift	signature
kopia	copie
original	original
dokument	document
handling	acte / document
intyg	attestation
bevis	preuve
tillstånd	autorisation
förbud	interdiction
skyldighet	obligation
rättighet	droit
ansvar	responsabilité
tillsyn	surveillance
kontroll	contrôle
besiktning	inspection
godkännande	approbation
underkännande	refus
anmärkning	observation
brist	défaut
fel	erreur
åtgärd	mesure
rätta	corriger
anmäla	signaler
anmälan	déclaration
polisanmälan	plainte
vittne	témoin
olycka	accident
skada	dommage
försäkring	assurance
ersättning	indemnité
självrisk	franchise
# body / health leftover
ögon	yeux
öra	oreille
öra	oreille
öron	oreilles
syn	vue
hörsel	ouïe
hjärta	cœur
blod	sang
socker	sucre
insulin	insuline
epilepsi	épilepsie
diabetes	diabète
astma	asthme
stroke	AVC
afasi	aphasie
parkinson	Parkinson
medicin	médicament
tablett	comprimé
dos	dose
biverkning	effet secondaire
påverkad	sous influence
nykter	sobre
berusad	ivre
trött	fatigué
sömn	sommeil
vila	repos
paus	pause
rast	pause
# time leftovers
sekund	seconde
minut	minute
timme	heure
dygn	24 heures
vecka	semaine
månad	mois
år	année
kvart	quart
halv	demi
hel	entier
natt	nuit
morgon	matin
förmiddag	matinée
eftermiddag	après-midi
kväll	soir
helg	week-end
vardag	jour de semaine
helgdag	jour férié
datum	date
klockan	l’heure
tidpunkt	moment
period	période
intervall	intervalle
# spatial leftovers
framför	devant
bakom	derrière
bredvid	à côté
ovan	au-dessus
nedan	ci-dessous
emellan	entre
genom	à travers
runt	autour
inuti	à l’intérieur
utanför	à l’extérieur
hitom	en deçà
bortom	au-delà
norr	nord
söder	sud
öster	est
väster	ouest
norra	nord
södra	sud
östra	est
västra	ouest
riktning	direction
håll	sens
# question words
vad	que
vem	qui
vilken	quel
vilket	lequel
vilka	quels
var	où
vart	où (direction)
varifrån	d’où
hur	comment
när	quand
varför	pourquoi
vilkendera	lequel
# polite / exam options
stämmer	est exact
påståendet	l’affirmation
alternativet	l’option
svar	réponse
rätt	juste
fel	faux
ja	oui
nej	non
kanske	peut-être
vet	sais
ej	ne … pas
icke	non
# more bank-ish
ungefärligt	approximatif
respris	prix du trajet
slutpris	prix final
jämförpris	prix de comparaison
startavgift	prise en charge
kilometerpris	prix au kilomètre
minutpris	prix à la minute
taxameterpris	prix taximètre
fast pris	prix forfaitaire
fastpris	prix forfaitaire
tillägg	supplément
nattaxa	tarif de nuit
helgtaxa	tarif week-end
storhelg	grand week-end
beställning	réservation
hämtning	prise en charge
lämning	dépose
destination	destination
adress	adresse
flygplats	aéroport
centralen	la gare
sjukhus	hôpital
skola	école
`;

export const SEED = parseSeedTable(TABLE);
