import { parseSeedTable } from "../lib/glossary-core.mjs";

/** Additional exam-bank lemmas — curated for remaining frequent tokens. */
const TABLE = `
allvarliga	graves
anordnar	organise
bruk	usage
svenska	suédois
utformar	conçoit
alkoholpåverkad	sous l’emprise de l’alcool
anvisningen	l’indication
användning	utilisation
arm	bras
avgöra	trancher
avsikt	intention
avstigning	descente
avvisa	refuser
bakomvarande	celui de derrière
baktill	à l’arrière
belastning	charge
belysning	éclairage
beräknar	calcule
besked	réponse
betalning	paiement
bilinspektör	inspecteur automobile
bilkörning	conduite automobile
blyplattorna	les plaques de plomb
bogsera	remorquer
bred	large
bromssystem	système de freinage
bromsverkan	efficacité de freinage
böjd	courbé
chauffören	le chauffeur
cyklar	vélos / pédale
diabetiker	diabétique
dömas	être condamné
dörr	porte
epilepsiskt	épileptique
erbjuder	propose
fobi	phobie
fordonstrafik	circulation motorisée
främst	surtout
fyrkantigt	carré
färdriktning	sens de circulation
fönstret	la fenêtre
förbudsmärket	le panneau d’interdiction
fördelar	avantages
förstärker	renforce
förtur	priorité
förvissar	s’assure
gångfartsområde	zone de rencontre
halsen	le cou
husvagn	caravane
husvagnen	la caravane
huvudvärk	mal de tête
hälsa	santé
inga	aucun
inre	intérieur
inrett	aménagé
klagar	se plaint
kliver	monte
konstruerad	construit
kortsträcka	courte distance
kretsloppet	le cycle
krokig	sinueux
känselnedsättning	perte de sensibilité
körriktningsvisare	clignotant
lastsäkra	arrimer
ligga	être couché
livslängd	durée de vie
lokalkännedom	connaissance du lieu
luftfilter	filtre à air
låsningsfria	antiblocage
lämplig	approprié
medvetande	conscience
mineral	minéral
minskad	réduit
mobiltelefon	téléphone portable
motorstadion	stade automobile
nödhjul	roue de secours
ojämn	inégal
orena	impurs
polisbilen	la voiture de police
polisman	policier
punktsbälte	ceinture à points
påkörda	heurtés
rullstol	fauteuil roulant
rullstolen	le fauteuil roulant
rörelse	mouvement
schizofreni	schizophrénie
sjuktransport	transport sanitaire
skakning	tremblement
skatteverket	administration fiscale
skolstyrelse	autorité scolaire
skäl	motif
spetsen	la pointe
spänna	boucler
stiger	monte
stum	muet
stund	moment
styrsystemet	le système de direction
tabellen	le tableau
tag	prise
taxiförbundet	fédération du taxi
tidsangivelse	indication d’heure
trafikansvarig	responsable circulation
turistmål	site touristique
underlätta	faciliter
uppfyller	remplit
upphör	cesse
utfärdandet	la délivrance
utvecklar	développe
yrkeskunnande	compétence professionnelle
yttre	extérieur
åkkomforten	le confort de conduite
åring	âge en années
återkallad	retirée
återkallas	est retirée
öga	œil
ömsesidig	réciproque
överhettas	surchauffe
allergi	allergie
allergiska	allergiques
andning	respiration
andningen	la respiration
andningshjälp	aide respiratoire
andnöd	essoufflement
antas	est supposé
anteckna	noter
arbetet	le travail
arbetstemperatur	température de service
automatiskt	automatiquement
avgasutsläpp	émissions d’échappement
avgörande	décisif
avjoniserat	désionisé
avsluta	terminer
avslutad	terminé
avslutar	termine
avstigningen	la descente
avståndsregel	règle de distance
backe	côte
backkrön	sommet de côte
bagageutrymmet	le coffre
bakdel	arrière
bakdäcken	pneus arrière
behov	besoin
bensinbil	voiture essence
betydligt	nettement
bildörren	la portière
bilister	automobilistes
bladet	la feuille
blicken	le regard
blixtlåsprincipen	principe de la fermeture éclair
bogserar	remorque
bok	livre
breda	larges
bromsservo	assistance de freinage
bromsskivorna	les disques de frein
brukar	a l’habitude
bränslebesparande	économe en carburant
buketten	le bouquet
bullret	le bruit
böjda	courbés
cykel	vélo
cykelbehållare	porte-vélo
cykelpassage	passage cyclable
defensiv	défensif
dem	eux
dimension	dimension
djup	profond
drabbar	frappe
dragkroken	le crochet d’attelage
drivs	est propulsé
dåligt	mal
energi	énergie
erbjuda	proposer
fartblindhet	adaptation à la vitesse
fartkamera	radar
felaktig	incorrect
fläkten	le ventilateur
fokuserar	se concentre
foten	le pied
framdäck	pneu avant
framstupa	à plat ventre
framåtvänd	face à la route
frontalkrock	collision frontale
fyrkantiga	carrés
färdriktningen	le sens de circulation
förbrukning	consommation
fördubblas	double
förhindra	empêcher
förkorta	raccourcir
förlamning	paralysie
förlora	perdre
förmåga	capacité
försämras	se dégrade
förvar	garde
förvara	ranger
gasbilar	voitures au gaz
glider	glace
godkänt	approuvé
golvet	le sol
gott	bon
grepp	adhérence
grupptryck	pression du groupe
gummit	le caoutchouc
hajtänder	dents de requin
halmstad	Halmstad
hastighetsbegränsning	limitation de vitesse
hjärnan	le cerveau
hotfull	menaçant
huvudsak	essentiel
huvudsakliga	principaux
hälla	verser
hälsobesvär	troubles de santé
hälsokort	carte de santé
ibland	parfois
ikapp	rattraper
impulsiva	impulsifs
inför	devant
inifrån	de l’intérieur
innehålla	contenir
inopererad	implanté
instrumentpanel	tableau de bord
jobbar	travaille
jämt	également
kasta	jeter
kognitiv	cognitif
kolväten	hydrocarbures
kommunalt	communal
konstgjord	artificiel
konstruerat	construit
kostnad	coût
kostnader	coûts
kramper	crampes
kroppen	le corps
krupp	croup
krönet	le sommet
kylarvätska	liquide de refroidissement
kyler	refroidit
kylvätskan	le liquide de refroidissement
kännetecken	signe distinctif
körfältsbyte	changement de voie
lagkrav	exigence légale
lastad	chargé
ledighet	congé
ledigheten	le congé
ledsagare	accompagnateur
leker	joue
liv	vie
lov	permission
lucka	trappe
luftkonditioneringen	la climatisation
lugn	calme
långsamtgående	lent
låser	verrouille
markant	nettement
markerad	marqué
markägaren	le propriétaire du terrain
maximilasten	la charge maximale
mekaniskt	mécaniquement
mil	mille suédois
miljösynpunkt	point de vue environnemental
miljözon	zone environnementale
miljözonen	la zone environnementale
monteras	est monté
motorfordon	véhicule à moteur
motorstopp	calage
muntligt	oralement
målad	peint
mönster	sculptures
nattetid	de nuit
nedre	inférieur
nollvision	Vision Zéro
olycksfallsförsäkring	assurance accidents
olycksförebyggande	prévention des accidents
olycksrisken	le risque d’accident
ombesiktning	contre-visite
omedvetet	inconsciemment
omfattas	est couvert
omkörande	qui dépasse
onödig	inutile
passagen	le passage
passar	convient
pekar	pointe
permanent	permanent
polismannen	le policier
positivt	positif
prata	parler
pressar	presse
problemet	le problème
påslagen	allumé
reaktionsförmåga	capacité de réaction
receptbelagd	sur ordonnance
receptionen	la réception
reflekteras	est réfléchi
reparation	réparation
reparationer	réparations
reserverat	réservé
resväg	itinéraire
river	arrache
roll	rôle
rullmotståndet	la résistance au roulement
rök	fumée
samplaneringssystem	système de planification
samtal	appel
selektiv	sélectif
servon	l’assistance
signal	signal
signalera	signaler
sikt	visibilité
singelolycka	accident isolé
skakningar	tremblements
skymd	masqué
skymma	masquer
skymmer	masque
sladd	dérapage
slitet	usé
slå	frapper
solljus	soleil
sotpartiklar	particules de suie
sparsamt	avec économie
spårområdet	la zone de voies
spårvagnsförare	conducteur de tram
starkt	fortement
startkablar	câbles de démarrage
stoppskylt	panneau stop
större	plus grand
summan	la somme
svavelsyra	acide sulfurique
svensk	suédois
sverige	Suède
swedac	Swedac
synskärpa	acuité visuelle
sådan	tel
såret	la plaie
säga	dire
säkerhetskontroll	contrôle de sécurité
särskildanordnade	spécialement aménagé
tack	merci
taket	le toit
tidsgräns	délai
tillräckligt	suffisamment
timmarsperiod	période de heures
tomgångskörning	marche au ralenti
trafiksäkerhet	sécurité routière
trafiksäkert	sûr pour la circulation
trekantigt	triangulaire
trevligt	agréable
triangel	triangle
träd	arbre
tränger	pénètre
tuta	klaxonner
tvinga	forcer
tvingar	force
tvärbromsar	freine brusquement
täcker	couvre
tätbebyggt	aggloméré
uppmanar	invite
uppstår	survient
utrustat	équipé
vaken	éveillé
valfri	au choix
vartannat	un sur deux
vinkeln	l’angle
väggrepp	adhérence
vägmarkeringen	le marquage au sol
vätskenivån	le niveau de liquide
yrkesmässig	professionnel
yrkesmässigtrafik	trafic professionnel
åldersgrupp	tranche d’âge
åldras	vieillir
årsålder	âge
återlämna	rendre
återställa	rétablir
ägare	propriétaire
ögat	l’œil
överskrider	dépasse
överstyrd	survirage
airbag	airbag
aktiv	actif
aktiverade	activés
aktuella	actuels
alert	alerte
alzheimer	Alzheimer
ammoniak	ammoniac
ange	indiquer
anledningen	la raison
anlitar	fait appel
anläggning	installation
anordnade	aménagés
anslutning	raccordement
anvisad	indiqué
använts	été utilisé
asfalterad	asphalté
avgasrörsystemet	le système d’échappement
avgassystemet	le système d’échappement
avgiftsfri	gratuit
avståndskrav	exigence de distance
axlarna	les essieux
bakhjul	roue arrière
bakterier	bactéries
batterisyra	acide de batterie
bedriver	exerce
befinner	se trouve
befogenhet	compétence
befriad	exempté
begreppet	la notion
belastar	charge
belastningskraven	les exigences de charge
bensinstation	station-service
besiktiga	contrôler
besiktigas	être contrôlé
beskriver	décrit
består	consiste
bevara	conserver
bilavgaser	gaz d’échappement
bilbatteri	batterie de voiture
bilbälteskravet	l’obligation de ceinture
billängder	longueurs de voiture
bilolycka	accident de voiture
bilprovning	contrôle technique
biltvätt	lavage auto
binda	lier
binder	lie
blad	feuille
blockerar	bloque
blåaktig	bleuâtre
bländad	ébloui
blöt	mouillé
boende	habitant
bogserlina	sangle de remorquage
boka	réserver
bolagsman	associé
bottenfärg	couleur de fond
brand	incendie
breddad	élargi
brett	large
bromskraft	force de freinage
bromsskick	état des freins
bromstryck	pression de freinage
bromstrycket	la pression de freinage
bromsvätskenivån	le niveau de liquide de frein
bron	le pont
bruten	rompue
brådskande	urgent
bränslecellsfordon	véhicule à pile à combustible
bränsleinsprutning	injection
buller	bruit
buren	porté
bärga	dépanner
bärgas	être dépanné
cancerframkallande	cancérigène
centralstation	gare centrale
cerebral	cérébral
dagsljus	lumière du jour
damm	poussière
deciliter	décilitre
defibrillator	défibrillateur
delvis	en partie
densamma	la même
dieselbilar	voitures diesel
diket	le fossé
direktseendet	la vision centrale
dissonans	dissonance
djupa	profonds
djupt	profondément
dragkrok	crochet d’attelage
drivas	être propulsé
drivmedel	carburant
dryck	boisson
dubbarna	les clous
dålig	mauvais
däckdimension	dimension de pneu
däckslitaget	l’usure des pneus
däcktrycket	la pression des pneus
dömd	condamné
dörrar	portes
effektiv	efficace
effektivare	plus efficace
efterkontroll	contrôle ultérieur
ekipaget	l’attelage
ekonomisk	économique
ekonomiska	économiques
elektroniska	électroniques
elsystem	système électrique
enkelt	simple
enklast	le plus simple
enstaka	isolé
epileptiskt	épileptique
ersätta	remplacer
exploderas	exploser
externt	externe
fastsatt	fixé
femmans	cinquième
fjädrande	suspendu
fjädrar	ressorts
flesta	la plupart
flödet	le flux
fordonsförare	conducteur
framhjulen	les roues avant
framifrån	de face
framkörningssträckan	la distance d’approche
framme	arrivé
frikoppla	débrayer
frikopplar	débraye
fulladdat	entièrement chargé
fylld	rempli
fyrdubblas	quadruplé
fyrhjulsdrift	quatre roues motrices
färdbroms	frein de service
färdbromsen	le frein de service
färdväg	itinéraire
färja	ferry
färjan	le ferry
förblir	reste
fördel	avantage
fördubblar	double
föreläggande	injonction
föreskrivet	prescrit
företagetsnamn	nom de l’entreprise
förföljer	suit
förhållande	rapport
förlusten	la perte
förmågan	la capacité
föroreningar	polluants
försenad	en retard
förskola	école maternelle
försäkringsbolaget	l’assureur
förvaras	est rangé
föräldrar	parents
gamla	vieux
gaspedalen	l’accélérateur
gatusidan	le côté rue
generellt	en général
genomsnitt	moyenne
glapp	jeu
glödlampa	ampoule
glömde	oublia
godkänns	est approuvé
grannens	du voisin
greppet	l’adhérence
grovt	grossièrement
grupp	groupe
grusplan	terre-plein
gryning	aube
gräns	limite
gummi	caoutchouc
gågata	rue piétonne
gästhamnen	le port de plaisance
hal	glissant
halkrisk	risque de glissade
halsduk	écharpe
halvsidig	hémicorporel
hamnar	se retrouve
handlingsberedskap	état de préparation
handsfree	mains libres
hastighetsgräns	limitation de vitesse
hastighetsskyltar	panneaux de vitesse
hekto	hectogramme
hjullåsning	blocage des roues
hjärna	cerveau
hjärtinfarkt	infarctus
hund	chien
huvud	tête
hydraulik	hydraulique
hydrauliska	hydrauliques
hård	dur
hälsofarliga	dangereux pour la santé
hälsorisken	le risque pour la santé
högerfilen	la voie de droite
hörselskadad	malentendant
idag	aujourd’hui
ifatt	rattraper
ifylld	rempli
igång	en marche
illamående	nausée
informerar	informe
innanför	à l’intérieur de
inneha	détenir
innehavaren	le titulaire
innehåll	contenu
instabilt	instable
intensiv	intense
invändigt	à l’intérieur
jobba	travailler
jord	terre
jämförelse	comparaison
jämnhöjd	à hauteur
kaffe	café
kamera	caméra
kloster	couvent
klädseln	la sellerie
knappen	le bouton
knän	genoux
koldioxidutsläpp	émissions de CO₂
koldioxidutsläppen	les émissions de CO₂
koloxid	monoxyde de carbone
kombinationen	la combinaison
komplexa	complexes
konkurs	faillite
konsekvensen	la conséquence
kontantbetalning	paiement en espèces
kontrollbesiktigas	passer le contrôle
kontrollerad	contrôlé
kostsamma	coûteux
kranvatten	eau du robinet
krock	collision
krockar	entre en collision
kurva	virage
kurvor	virages
kvinna	femme
kvinnor	femmes
kylvätska	liquide de refroidissement
känsliga	sensibles
käpp	canne
kö	file
köpa	acheter
köpt	acheté
körbana	chaussée
körpassrapport	rapport de vacation
körriktning	sens de marche
körstabiliteten	la stabilité
lastvikt	poids utile
lastvikter	poids utiles
ledgångsreumatism	polyarthrite
ledig	libre
ledning	conduite
ljudsignal	signal sonore
ljusstyrkan	l’intensité lumineuse
lokaler	locaux
lokalt	localement
luftmotstånd	résistance de l’air
lugnande	calmant
lukt	odeur
lungorna	les poumons
lykta	feu
lyktorna	les feux
lämpliga	appropriés
läsbar	lisible
löpande	en continu
mamma	maman
manöver	manœuvre
marginal	marge
marginaler	marges
marken	le sol
material	matériau
maximilast	charge maximale
medelpriset	le prix moyen
medvetandet	la conscience
mikrosömn	micro-sommeil
milen	le mille
miljöeffekten	l’effet environnemental
miljöstation	déchetterie
minibuss	minibus
minnessvårigheter	troubles de mémoire
minusgrader	degrés négatifs
minuspolen	le pôle négatif
missat	manqué
mittfilen	la voie du milieu
mobiltelefonen	le téléphone
modell	modèle
montera	monter
motorredskap	engin motorisé
motortrafik	trafic motorisé
motståndet	la résistance
motverkar	contre
multiplicera	multiplier
munskydd	masque
museum	musée
mätningen	la mesure
mörkklädd	vêtu de sombre
navigationssystem	système de navigation
nedförsbacke	descente
nerv	nerf
nollgradigt	zéro degré
nollvisionen	la Vision Zéro
norrut	vers le nord
noteras	est noté
nå	atteindre
näsa	nez
nödhjulet	la roue de secours
obegränsad	illimité
oljelampan	le témoin d’huile
oljenivån	le niveau d’huile
oljetryck	pression d’huile
olämpligt	inapproprié
omdömet	le jugement
omgivningen	l’entourage
omledning	déviation
omständigheter	circonstances
onödan	inutilement
optimal	optimal
ordentligt	correctement
order	ordre
ordinarie	ordinaire
orenat	non épuré
originella	originaux
oro	inquiétude
osäker	incertain
oundviklig	inévitable
pacemaker	stimulateur
panikbromsa	freiner d’urgence
parkeringsbiljett	ticket de stationnement
parkeringsbroms	frein de parking
passage	passage
plan	plan
planerar	planifie
pluspolerna	les pôles positifs
polisbil	voiture de police
position	position
positionsljus	feux de position
pratar	parle
pressa	presser
provet	l’examen
psykisk	psychique
psykos	psychose
pulserar	pulse
pyser	fuit
pålastning	chargement
påsken	Pâques
påskynda	accélérer
rapportera	signaler
recept	ordonnance
registreras	est enregistré
registreringsskylt	plaque d’immatriculation
resenärer	voyageurs
reservdäcket	le pneu de secours
reserverad	réservé
revisorn	le commissaire aux comptes
riva	arracher
rullmotstånd	résistance au roulement
rullstolburen	en fauteuil roulant
ryck	à-coup
ryggstödet	le dossier
rödljus	feu rouge
rörelseenergi	énergie cinétique
sammanhängande	continu
sanktionsavgift	amende administrative
service	entretien
serviceanläggning	station-service
sidorutor	vitres latérales
sidvind	vent latéral
signalerar	signale
signalmärke	panneau de signalisation
sjukresa	transport sanitaire
självsvängning	lacet
skadeförebyggande	prévention des dommages
skapa	créer
skattevikt	poids fiscal
skivbromsar	freins à disque
skivbromsarna	les freins à disque
skjutsa	conduire quelqu’un
skolpatrull	patrouille scolaire
skoskydd	protège-chaussures
skriftligt	par écrit
skyddsutrustning	équipement de protection
skyddsutrustningar	équipements de protection
skyltad	signalé
skymning	crépuscule
slippa	éviter
slitaget	l’usure
slutsiffran	le dernier chiffre
slänga	jeter
släpfordon	véhicule remorqué
slösa	gaspiller
smärtor	douleurs
solglasögon	lunettes de soleil
sommar	été
speciella	spéciaux
specifik	spécifique
spolarvätskanivå	niveau de lave-glace
springa	courir
spärr	barrière
stabilt	stable
stannandeförbud	interdiction de s’arrêter
stark	fort
stelt	rigide
stillastående	à l’arrêt
stoplinje	ligne d’arrêt
stoplinjen	la ligne d’arrêt
stoppsträcka	distance d’arrêt
straffas	est sanctionné
stryka	rayer
strålar	rayons
strålkastare	phares
strålkastarljuset	la lumière des phares
styrservosystemet	le système de direction assistée
styrservovätska	liquide de direction
stående	debout
ställe	endroit
summatariff	tarif additionné
svag	faible
svampig	spongieux
svavel	soufre
symtom	symptômes
symtomen	les symptômes
synpunkt	point de vue
synrubbningar	troubles de la vue
synsinnet	la vue
syntetisk	synthétique
sådana	tels
sådant	tel
söka	chercher
söt	sucré
taget	la prise
takboxen	le coffre de toit
talrubbningar	troubles de la parole
tankning	ravitaillement
taxameterutrustningen	l’équipement taximètre
taxitillstånd	autorisation taxi
telefonisten	l’opérateur
testar	teste
tillgänglig	disponible
tillhör	appartient
tillkopplad	attelé
tillräcklig	suffisant
tillståndhavare	titulaire de l’autorisation
tillståndspliktig	soumis à autorisation
tillåtelse	permission
tillämpar	applique
tjänstvikt	poids à vide
trafikförsäkringsföreningen	fonds de garantie automobile
trafikkorsning	carrefour
trafikljuset	le feu
trafikolycksplats	lieu d’accident
trafiksituation	situation de circulation
trafiksituationer	situations de circulation
trafiksäkerheten	la sécurité routière
trafiktillståndet	l’autorisation de trafic
trampa	appuyer
trampar	appuie
tredubblar	triple
trekantig	triangulaire
trekantiga	triangulaires
trottoaren	le trottoir
tryckförband	pansement compressif
tungstyrd	direction lourde
turistväg	route touristique
tutan	le klaxon
tvåhjuliga	à deux roues
tvåårigt	de deux ans
typgodkända	homologués
tystnadsplikt	secret professionnel
tända	allumer
tändas	s’allumer
tättort	agglomération
undan	de côté
underkänns	est refusé
uppfatta	percevoir
uppfattar	perçoit
uppgraderas	est mis à niveau
upplysning	renseignement
upprepade	répétés
urlastning	déchargement
utfartsregeln	règle de sortie
utifrån	de l’extérieur
utkanten	la périphérie
utmärker	caractérise
utmärkt	excellent
utrymme	espace
utrymmer	évacue
utrymmet	l’espace
utsidan	l’extérieur
utslitna	usés
utsläppsklass	classe d’émissions
utsläppskraven	les exigences d’émissions
uttröttad	épuisé
utvecklad	développé
utövare	praticien
utöver	en plus de
vagnskadeförsäkring	assurance dommages
vagnskadegaranti	garantie dommages
valfritt	au choix
vall	talus
vanligtvis	habituellement
vardera	chacun
varken	ni
varningsmärke	panneau de danger
varseblivning	perception
vattenplana	faire de l’aquaplanage
vattenånga	vapeur d’eau
verkar	semble
verkställande	directeur
vibrationer	vibrations
vilotidbok	livret de repos
vilotidsförordning	règlement sur les temps de repos
viltstängsel	clôture à gibier
vinterväg	route d’hiver
vridning	torsion
vägfärja	ferry routier
vägmarkeringar	marquages au sol
vägmärkeskombinationen	la combinaison de panneaux
vägsträckan	le tronçon
väjningslinje	ligne de céder le passage
väjningspliktsskylt	panneau de céder
vändzon	aire de retournement
värk	douleur
vätgas	hydrogène
webbplats	site web
xenonstrålkastare	phares xénon
yngre	plus jeune
ytter	extérieur
åker	roule
årligt	annuel
årliga	annuels
återställas	être rétabli
återställs	est rétabli
återvinning	recyclage
åtsittande	ajusté
åttakantigt	octogonal
ägaren	le propriétaire
ändringar	modifications
äter	mange
önskemål	souhait
öppet	ouvert
överblicka	embrasser du regard
överföra	transférer
övergår	passe
överhettad	en surchauffe
överkänslig	hypersensible
överskrida	dépasser
övertala	persuader
övningskörning	conduite accompagnée
egna	propres
bäckeby	Bäckeby
allergisanerade	assainis pour allergiques
avgasarutsläpp	émissions d’échappement
baktungbil	voiture trop chargée à l’arrière
battariet	la batterie
alva	Alva
hyraulisk	hydraulique
demenision	dimension
passagrare	passager
länna	laisser
stoplinje	ligne d’arrêt
stoplinjen	la ligne d’arrêt
stäcka	distance
sultet	faim
transportsstyrelse	Direction des transports
tättort	agglomération
underhållfritt	sans entretien
viltsvin	sanglier
värnhemstorget	Värnhemstorget
hejde	Hejde
burgsvik	Burgsvik
buttle	Buttle
björkö	Björkö
sproge	Sproge
roma	Roma
sturup	Sturup
mantorps	Mantorp
framtungbil	voiture trop chargée à l’avant
driftstömning	vidange de service
tillfredställande	satisfaisant
körpassrapportar	rapports de vacation
företagetsnamn	nom de l’entreprise
sommarförvarning	préavis d’été
cerebral	cérébral
airbag	airbag
b-körkort	permis B
b-behörighet	catégorie B
lgf-skylt	panneau LGF
ecall	eCall
ecall-lampa	témoin eCall
kpa	kPa
sverige	Suède
ägaren	le propriétaire
ägare	propriétaire
prov	épreuve
provdeltagare	candidat
provdeltagaren	le candidat
deltagaren	le participant
delprov	épreuve partielle
avtal	contrat
millimeter	millimètre
redogöra	rendre compte
bokföringslagen	loi sur la comptabilité
bokföring	comptabilité
bokföringen	la comptabilité
bokföringsskyldighet	obligation comptable
bokföringsskyldigheten	l’obligation comptable
innebörd	signification
innebörden	la signification
olaga	illicite
sak	chose
skriftlig	écrit
skriftliga	écrits
språk	langue
vd	directeur général
arbetsplats	lieu de travail
arbetsplatsen	le lieu de travail
beställare	client
beställaren	le client
bolagsverket	registre des sociétés
erinran	rappel
genomföra	réaliser
genomföras	être réalisé
kollektivavtal	convention collective
påföra	imposer
påföras	être imposé
registreringsbesiktning	réception à l’immatriculation
respektive	respectivement
resurs	ressource
resurser	ressources
testfråga	question d’essai
testfrågor	questions d’essai
tillämpa	appliquer
anseende	réputation
balansräkning	bilan
balansräkningen	le bilan
handelsbolag	société en nom collectif
juridisk	juridique
kapital	capital
körprov	épreuve de conduite
otillåten	non autorisé
provtid	temps d’épreuve
provtiden	le temps d’épreuve
prövningsmyndighet	autorité d’instruction
prövningsmyndigheten	l’autorité d’instruction
riksfärdtjänst	transport adapté intercommunal
samtliga	tous
semesterdag	jour de congé
semesterdagar	jours de congé
taxameterutrustning	équipement taximètre
uppnå	atteindre
uppnås	être atteint
uppsåtlig	intentionnel
uppsåtligen	intentionnellement
årsbokslut	clôture annuelle
årsbokslutet	la clôture annuelle
överföring	transmission
överföringen	la transmission
analog	analogique
analysera	analyser
anbud	offre
anhörig	proche
ansluten	raccordé
anslutet	raccordé
anvisning	consigne
anvisningar	consignes
app	application
arbetsmiljö	environnement de travail
arbetstid	temps de travail
automatisk	automatique
avanmäla	retirer la déclaration
avanmäler	retire la déclaration
avregistrera	radier
avse	viser
avses	est visé
avslag	refus
avslå	rejeter
avslås	est rejeté
avvikelse	écart
avvikelser	écarts
beakta	prendre en compte
beaktas	être pris en compte
bedriva	exploiter
beställa	commander
beställs	est commandé
bestämma	déterminer
bestämmas	être déterminé
blankett	formulaire
blanketten	le formulaire
bälte	ceinture
dekal	vignette
därutöver	en outre
dödsbo	succession
dödsboet	la succession
egenskap	propriété
egenskaper	propriétés
engelska	anglais
fakturera	facturer
faktureras	est facturé
mervärdesskatt	TVA
arbetsgivaravgift	cotisation patronale
egenavgift	cotisation d’indépendant
förmånsbeskattning	imposition de l’avantage
resultatbudget	budget de résultat
likviditetsbudget	budget de trésorerie
resultaträkning	compte de résultat
årsredovisning	rapport annuel
god	bon
redovisningssed	pratique comptable
räkenskapsår	exercice
räkenskapsinformation	information comptable
verifikation	pièce justificative
affärshändelse	opération
öppningsbalansräkning	bilan d’ouverture
sjuklön	salaire maladie
föräldraledighet	congé parental
semesterlagen	loi sur les congés
anställningsskydd	protection de l’emploi
rehabilitering	réadaptation
upphandling	marché public
förfrågningsunderlag	dossier de consultation
gruppundantag	exemption de groupe
taxisamverkan	coopération taxi
kompanjonsavtal	pacte d’associés
kompanjonsförsäkring	assurance d’associés
konkurs	faillite
föreståndare	gérant
olämplighetstid	durée d’interdiction
sanktionsavgift	amende administrative
penningböter	amende
klampning	immobilisation
värdeberäknad	calculé en valeur
mönsterdjup	profondeur de sculpture
dubbdäck	pneus à clous
vinterväglag	conditions hivernales
vinterdäck	pneus hiver
kontrollbesiktning	contrôle technique
nollvisionen	Vision Zéro
jourtjänst	astreinte
körpassrapport	rapport de vacation
följesedel	bordereau
upptagen	occupé
stoppad	arrêté
ledig	libre
tariff	tarif
timtaxa	tarif horaire
kilometertaxa	tarif kilométrique
jämförpriset	le prix de comparaison
prisbasbelopp	montant de base
ideell	idéel
stiftelse	fondation
verksamhetsansvarig	responsable d’activité
tystnadsplikt	secret professionnel
skolskjuts	transport scolaire
sjukresa	trajet médical
färdtjänst	transport adapté
persontransport	transport de personnes
persontransporttjänster	services de transport de personnes
normalskattesats	taux normal
beskattningsunderlag	assiette
e-legitimation	identité électronique
engagemangsbild	relevé d’engagements
kreditupplysning	renseignement de crédit
värderingsintyg	certificat d’évaluation
periodbokslut	situation intermédiaire
handläggning	instruction
komplettering	complément
underrättelse	notification
förvaltningsrätt	tribunal administratif
prövningstillstånd	autorisation de pourvoi
laga	ayant force
kraft	force
delgivning	notification
ackreditering	accréditation
besiktningsorgan	organisme de contrôle
kontrollrapport	rapport de contrôle
plomberad	plombé
plombering	plombage
tillsatsanordning	dispositif additionnel
körpass	vacation
app-tjänst	service par application
app-tjänster	services par application
`;

export const BANK_SEED = parseSeedTable(TABLE);
