# À compléter (non lisible sur le site — rien n'a été inventé)

- Prix, devise, abonnement, durée d'offre : `plans` = null, `currency` = null. Aucun montant dans l'interface ni dans le code (pas de Stripe).
- Contact (e-mail public, téléphone, WhatsApp) : `contact` = null.
- Résolution, bitrate, nombre de chaînes, délai d'activation : `tech.maxResolution`, `tech.bitrate`, `tech.channelCount`, `tech.activationMinutes` = null. Le site est un teoriprov, pas un service de streaming.
- HowTo : aucun tutoriel d'installation (pas de Firestick, Android TV, Apple TV). Les pages Taxi Kalkyl sont des exercices (formule + exemple), pas un guide pas à pas. `tutorials` = null, aucun HowTo émis.
- Product / Offer : aucune offre tarifée. Aucun bloc Product.
- Page de vente dédiée : il n'y en a pas. FAQPage est sur la page d'accueil, seule page publique d'entrée.
- Vidéos de tutoriel hébergées : aucun `<video>` ni iframe YouTube/Vimeo. Les transcriptions dans `data/youtube-transcripts/` alimentent le RAG, elles ne sont pas un lecteur. Pas de champ `.aio-transcript` ajouté.
- Images de questions : dessinées sur `<canvas>` (protection), pas des `<img>`. Le nom accessible reprend la légende lisible, sinon l'énoncé suédois. La page d'accueil n'affiche pas ces images.
- Icônes SVG décoratives (`BrandGlyph`) : `aria-hidden`, pas de contenu à décrire.
- Google Rich Results : non exécuté ici (pas d'accès au validateur connecté). Le JSON-LD est dans le HTML brut pour un contrôle manuel.
