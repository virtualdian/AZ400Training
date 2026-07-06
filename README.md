# Thuis Kracht 🏋️

Een persoonlijke fitness-app (PWA) voor krachttraining thuis — volledig in het Nederlands, zonder installatie of account. Alles draait lokaal in je browser en werkt ook offline.

## Afgestemd op deze thuissetup

- Bankdrukrek met verstelbare standaards
- Halterbank, verstelbaar van vlak naar schuin (incline)
- Halterstang van ± 2 meter
- Gietijzeren schijven: 2× 15 kg, 2× 10 kg, 4× 5 kg, 4× 4 kg, 4× 2,5 kg, 8× 2 kg, 8× 1 kg (totaal 120 kg)
- 2 verstelbare dumbbells
- Fitnessmat

## Functies

- **Oefeningenbibliotheek** — 80 oefeningen in het Nederlands met demonstratie-GIF, stapsgewijze uitvoering en tips, te filteren op spiergroep en materiaal. Gecureerde en vertaalde selectie uit de [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) (1.324 oefeningen); alleen oefeningen die met bovenstaande setup kunnen.
- **Krachtschema's** — vijf kant-en-klare workouts gericht op kracht (5×5 Workout A/B, boven-/onderlichaam kracht + volume, snelle dumbbell full-body), inclusief rust- en progressie-advies.
- **Training loggen** — start een schema of vrije training, log sets (gewicht × herhalingen) en bekijk je geschiedenis. Gegevens staan in `localStorage` van je browser.
- **Progressie** — geschat 1RM-verloop per oefening (Epley-formule) in een grafiek, met records en totaalstatistieken.
- **Schijvencalculator** — voer een doelgewicht in en zie precies welke schijven je per kant op de stang moet schuiven, op basis van jouw eigen schijvenset (aanpasbaar in Instellingen, net als het stanggewicht).

## Gebruik

### Lokaal

Open een terminal in deze map en start een simpele webserver:

```bash
python3 -m http.server 8000
```

Ga daarna naar `http://localhost:8000`. (Direct `index.html` openen werkt ook, alleen de offline-functionaliteit vereist een webserver.)

### Via GitHub Pages (aanrader voor op je telefoon)

1. Ga in deze repository naar **Settings → Pages**.
2. Kies bij *Source* voor **Deploy from a branch** en selecteer de branch met deze code (map: `/ (root)`).
3. Open de gepubliceerde URL op je telefoon en kies **Zet op beginscherm** — de app installeert zich dan als PWA en werkt offline.

## Techniek

- Statische web-app: HTML + CSS + vanilla JavaScript, geen dependencies of build-stap.
- PWA: `manifest.webmanifest` + service worker (`sw.js`) voor offline gebruik en installatie op het beginscherm.
- Gegevens (logboek, instellingen) blijven lokaal in de browser; er wordt niets verstuurd.

| Bestand | Inhoud |
|---|---|
| `index.html` | App-schil met navigatie |
| `js/data.js` | Oefeningen (NL), schema's, standaard schijvenset |
| `js/app.js` | App-logica: filters, logboek, grafiek, calculator |
| `css/style.css` | Donker thema, mobile-first |
| `sw.js` / `manifest.webmanifest` / `icons/` | PWA-onderdelen |

## Bron

Oefeningen gebaseerd op [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset); de `id`'s in `js/data.js` verwijzen naar de oorspronkelijke dataset. Namen en instructies zijn naar het Nederlands vertaald en aangepast aan de thuissetup.

De demonstratie-GIF's zijn **niet** in deze repository opgeslagen: de dataset-repo vermeldt eigendomsclaims op de media en heeft ze daarom zelf ook weggelaten. De app laadt ze tijdens gebruik rechtstreeks van de ExerciseDB-CDN (`static.exercisedb.dev`) via het `media`-veld per oefening; de service worker cachet elke bekeken GIF, waarna die offline beschikbaar blijft. Valt de CDN ooit weg, dan verbergt de app het beeld automatisch en blijven de tekstinstructies gewoon werken.
