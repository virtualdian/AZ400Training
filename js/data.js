// Oefeningendata — gecureerde selectie uit hasaneyldrm/exercises-dataset (1.324 oefeningen),
// gefilterd op thuissetup: halterstang + rek, verstelbare halterbank (vlak/schuin),
// gietijzeren schijven, 2 verstelbare dumbbells, fitnessmat en lichaamsgewicht.
// De id's verwijzen naar de oorspronkelijke dataset; namen en instructies zijn vertaald naar het Nederlands.

// Demonstratie-GIF's worden rechtstreeks van de ExerciseDB-CDN geladen (niet in deze repo
// opgeslagen vanwege de eigendomsclaims die de dataset-repo vermeldt). Elke bekeken GIF
// wordt door de service worker gecachet en is daarna ook offline beschikbaar.
const GIF_BASIS = "https://static.exercisedb.dev/media/";

const MATERIAAL = {
  stang: "Halterstang + schijven",
  dumbbells: "Dumbbells",
  bank: "Halterbank",
  rek: "Rek (standaards)",
  lichaam: "Lichaamsgewicht",
  mat: "Fitnessmat",
};

const GROEPEN = ["Borst", "Rug", "Schouders", "Biceps", "Triceps", "Benen & billen", "Core"];

const OEFENINGEN = [
  // ============ BORST ============
  {
    id: "0025", media: "EIeI8Vf", naam: "Bankdrukken", en: "barbell bench press", groep: "Borst",
    doelspier: "Borst", secundair: ["Triceps", "Voorste schouders"], materiaal: ["stang", "bank", "rek"],
    instructies: [
      "Ga op de vlakke bank liggen met je ogen recht onder de stang en zet je voeten stevig op de grond.",
      "Pak de stang iets breder dan schouderbreedte, til hem uit het rek en houd hem gestrekt boven je borst.",
      "Laat de stang gecontroleerd zakken tot hij je borst licht raakt, ter hoogte van je tepellijn.",
      "Druk de stang krachtig terug omhoog tot je armen gestrekt zijn en herhaal.",
    ],
    tip: "Knijp je schouderbladen samen en houd een lichte holling in je onderrug. Zet de vangpennen van het rek op de juiste hoogte als je alleen traint.",
  },
  {
    id: "0047", media: "3TZduzM", naam: "Incline bankdrukken", en: "barbell incline bench press", groep: "Borst",
    doelspier: "Bovenkant borst", secundair: ["Triceps", "Voorste schouders"], materiaal: ["stang", "bank", "rek"],
    instructies: [
      "Zet de rugleuning van de bank schuin omhoog op 30–45 graden.",
      "Pak de stang iets breder dan schouderbreedte en til hem uit het rek boven je bovenborst.",
      "Laat de stang langzaam zakken tot vlak boven je sleutelbeenderen.",
      "Druk de stang terug omhoog tot gestrekte armen en herhaal.",
    ],
    tip: "Hoe steiler de bank, hoe meer de schouders het overnemen — 30 graden is ideaal voor de bovenborst.",
  },
  {
    id: "0289", media: "SpYC0Kp", naam: "Dumbbell bankdrukken", en: "dumbbell bench press", groep: "Borst",
    doelspier: "Borst", secundair: ["Triceps", "Voorste schouders"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga op de vlakke bank liggen met in elke hand een dumbbell op borsthoogte, handpalmen naar voren.",
      "Druk de dumbbells omhoog tot je armen gestrekt zijn en de dumbbells elkaar bijna raken.",
      "Laat ze gecontroleerd zakken tot je ellebogen iets onder bankhoogte komen.",
      "Druk weer omhoog en herhaal.",
    ],
    tip: "Dumbbells geven een grotere bewegingsuitslag dan de stang — perfect als aanvulling op bankdrukken.",
  },
  {
    id: "0314", media: "ns0SIbU", naam: "Incline dumbbell press", en: "dumbbell incline bench press", groep: "Borst",
    doelspier: "Bovenkant borst", secundair: ["Triceps", "Voorste schouders"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Zet de bank op 30–45 graden en ga zitten met een dumbbell in elke hand op schouderhoogte.",
      "Druk de dumbbells schuin omhoog tot je armen gestrekt zijn.",
      "Laat ze langzaam zakken tot naast je bovenborst.",
      "Druk weer omhoog en herhaal.",
    ],
  },
  {
    id: "0308", media: "yz9nUhF", naam: "Dumbbell fly", en: "dumbbell fly", groep: "Borst",
    doelspier: "Borst", secundair: ["Voorste schouders"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga op de vlakke bank liggen met de dumbbells gestrekt boven je borst, handpalmen naar elkaar.",
      "Spreid je armen wijd in een boog naar buiten, met een lichte buiging in de ellebogen.",
      "Zak tot je een rek voelt op je borst, ongeveer tot schouderhoogte.",
      "Breng de dumbbells in dezelfde boog weer samen boven je borst.",
    ],
    tip: "Gebruik minder gewicht dan bij drukken — het is een isolatieoefening. Houd de elleboogshoek constant.",
  },
  {
    id: "0319", media: "ESOd5Pl", naam: "Incline dumbbell fly", en: "dumbbell incline fly", groep: "Borst",
    doelspier: "Bovenkant borst", secundair: ["Voorste schouders"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Zet de bank op 30–45 graden en houd de dumbbells gestrekt boven je borst, handpalmen naar elkaar.",
      "Spreid je armen in een wijde boog naar buiten met licht gebogen ellebogen.",
      "Zak tot je een rek op je bovenborst voelt.",
      "Knijp je borstspieren aan en breng de dumbbells weer samen.",
    ],
  },
  {
    id: "0375", media: "9XjtHvS", naam: "Dumbbell pullover", en: "dumbbell pullover", groep: "Borst",
    doelspier: "Borst", secundair: ["Brede rugspier", "Triceps"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga dwars of in de lengte op de bank liggen en houd één dumbbell met beide handen gestrekt boven je borst.",
      "Laat de dumbbell met licht gebogen armen in een boog achter je hoofd zakken.",
      "Zak tot je een rek voelt in borst en rug.",
      "Trek de dumbbell in dezelfde boog terug boven je borst.",
    ],
  },
  {
    id: "0662", media: "I4hDWkc", naam: "Push-up", en: "push-up", groep: "Borst",
    doelspier: "Borst", secundair: ["Triceps", "Schouders", "Core"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Neem een plankpositie aan met je handen iets breder dan schouderbreedte.",
      "Houd je lichaam in één rechte lijn van hoofd tot hielen.",
      "Buig je ellebogen en zak tot je borst bijna de grond raakt.",
      "Druk jezelf terug omhoog tot gestrekte armen.",
    ],
    tip: "Te zwaar? Doe ze op je knieën of met je handen op de bank (incline push-up).",
  },
  {
    id: "0493", media: "B1EVP9F", naam: "Incline push-up", en: "incline push-up", groep: "Borst",
    doelspier: "Borst (onderkant)", secundair: ["Triceps", "Schouders"], materiaal: ["lichaam", "bank"],
    instructies: [
      "Plaats je handen op de rand van de bank, iets breder dan schouderbreedte.",
      "Loop met je voeten naar achteren tot je lichaam een rechte lijn vormt.",
      "Zak gecontroleerd tot je borst de bank bijna raakt.",
      "Druk jezelf terug omhoog en herhaal.",
    ],
    tip: "Makkelijker dan een gewone push-up — ideaal om mee te beginnen of als afsluiter.",
  },
  {
    id: "0279", media: "i5cEhka", naam: "Decline push-up", en: "decline push-up", groep: "Borst",
    doelspier: "Bovenkant borst", secundair: ["Triceps", "Schouders"], materiaal: ["lichaam", "bank"],
    instructies: [
      "Leg je voeten op de bank en plaats je handen op de grond, iets breder dan schouderbreedte.",
      "Houd je lichaam in een rechte lijn.",
      "Zak tot je neus de grond bijna raakt.",
      "Druk jezelf krachtig terug omhoog.",
    ],
    tip: "Zwaarder dan een gewone push-up en meer nadruk op de bovenborst.",
  },
  {
    id: "1311", media: "JmMVpR3", naam: "Brede push-up", en: "wide hand push up", groep: "Borst",
    doelspier: "Borst", secundair: ["Schouders", "Triceps"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Neem een plankpositie aan met je handen ruim breder dan schouderbreedte.",
      "Houd je lichaam gestrekt en zak gecontroleerd naar de grond.",
      "Druk jezelf terug omhoog vanuit je borstspieren.",
    ],
  },

  // ============ RUG ============
  {
    id: "0032", media: "ila4NZS", naam: "Deadlift", en: "barbell deadlift", groep: "Rug",
    doelspier: "Billen & onderrug", secundair: ["Hamstrings", "Bovenrug", "Grip"], materiaal: ["stang", "mat"],
    instructies: [
      "Sta met je middenvoet onder de stang, voeten op heupbreedte.",
      "Buig voorover met een rechte rug en pak de stang net buiten je schenen.",
      "Span je rug aan, duw je borst vooruit en til de stang op door je benen te strekken en je heupen naar voren te brengen.",
      "Sta volledig rechtop, laat de stang dan langs je benen gecontroleerd terug naar de grond zakken.",
    ],
    tip: "Houd de stang dicht tegen je lichaam en je rug de hele beweging recht. Dé oefening voor totale kracht.",
  },
  {
    id: "0117", media: "KgI0tqW", naam: "Sumo deadlift", en: "barbell sumo deadlift", groep: "Rug",
    doelspier: "Billen", secundair: ["Binnenkant dijen", "Hamstrings", "Rug"], materiaal: ["stang"],
    instructies: [
      "Sta breed met je tenen licht naar buiten en de stang boven je middenvoet.",
      "Pak de stang met je handen binnen je knieën, rug recht.",
      "Duw je knieën naar buiten en strek je benen terwijl je de stang omhoog tilt.",
      "Zak gecontroleerd terug en herhaal.",
    ],
    tip: "Door de brede stand belast je onderrug minder — fijne variant als deadliften zwaar op je rug voelt.",
  },
  {
    id: "0074", media: "za9Ni4z", naam: "Rack pull", en: "barbell rack pull", groep: "Rug",
    doelspier: "Bovenrug & billen", secundair: ["Trapezius", "Grip"], materiaal: ["stang", "rek"],
    instructies: [
      "Leg de stang op de vangpennen van het rek, rond kniehoogte.",
      "Pak de stang op schouderbreedte met een rechte rug.",
      "Strek je heupen en sta volledig rechtop, schouders naar achteren.",
      "Laat de stang gecontroleerd terug op de pennen zakken.",
    ],
    tip: "Doordat de beweging korter is kun je zwaarder laden dan bij een volledige deadlift.",
  },
  {
    id: "0027", media: "eZyBC3j", naam: "Barbell row (voorovergebogen)", en: "barbell bent over row", groep: "Rug",
    doelspier: "Bovenrug", secundair: ["Brede rugspier", "Biceps", "Onderrug"], materiaal: ["stang"],
    instructies: [
      "Pak de stang op schouderbreedte en buig voorover tot je romp bijna horizontaal is, knieën licht gebogen.",
      "Laat de stang hangen aan gestrekte armen.",
      "Trek de stang naar je onderbuik en knijp je schouderbladen samen.",
      "Laat de stang gecontroleerd terugzakken en herhaal.",
    ],
    tip: "Houd je rug recht en gebruik geen zwaai — kracht komt uit je rug, niet uit je heupen.",
  },
  {
    id: "3017", media: "r0z6xzQ", naam: "Pendlay row", en: "barbell pendlay row", groep: "Rug",
    doelspier: "Bovenrug", secundair: ["Brede rugspier", "Biceps"], materiaal: ["stang"],
    instructies: [
      "Laat de stang tussen elke herhaling volledig op de grond rusten, romp horizontaal.",
      "Pak de stang iets breder dan schouderbreedte.",
      "Trek de stang explosief naar je onderborst.",
      "Laat hem gecontroleerd terug naar de grond zakken en herhaal vanuit stilstand.",
    ],
    tip: "Elke herhaling vanuit stilstand — perfect voor pure trekkracht.",
  },
  {
    id: "0292", media: "C0MA9bC", naam: "Eénarmige dumbbell row", en: "dumbbell one arm bent-over row", groep: "Rug",
    doelspier: "Brede rugspier", secundair: ["Bovenrug", "Biceps"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Zet je linkerknie en linkerhand op de bank, rug horizontaal en recht.",
      "Houd de dumbbell in je rechterhand aan een gestrekte arm.",
      "Trek de dumbbell naar je heup, elleboog langs je lichaam.",
      "Laat gecontroleerd zakken, maak de set af en wissel van kant.",
    ],
  },
  {
    id: "0293", media: "BJ0Hz5L", naam: "Dumbbell row (voorovergebogen)", en: "dumbbell bent over row", groep: "Rug",
    doelspier: "Bovenrug", secundair: ["Brede rugspier", "Biceps"], materiaal: ["dumbbells"],
    instructies: [
      "Sta met een dumbbell in elke hand en buig voorover met een rechte rug.",
      "Laat de dumbbells hangen aan gestrekte armen.",
      "Trek beide dumbbells tegelijk naar je heupen en knijp je schouderbladen samen.",
      "Laat gecontroleerd zakken en herhaal.",
    ],
  },
  {
    id: "0327", media: "7vG5o25", naam: "Chest-supported dumbbell row", en: "dumbbell incline row", groep: "Rug",
    doelspier: "Bovenrug", secundair: ["Brede rugspier", "Achterste schouders"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Zet de bank schuin op ±45 graden en ga er met je borst voorover op liggen.",
      "Laat de dumbbells recht naar beneden hangen.",
      "Trek de dumbbells omhoog naar je ribben en knijp je schouderbladen samen.",
      "Laat langzaam zakken en herhaal.",
    ],
    tip: "Doordat je borst ondersteund is, kan je onderrug niet valsspelen — pure rugtraining.",
  },
  {
    id: "0499", media: "bZGHsAZ", naam: "Inverted row (aan de stang)", en: "inverted row", groep: "Rug",
    doelspier: "Bovenrug", secundair: ["Biceps", "Core"], materiaal: ["stang", "rek", "lichaam"],
    instructies: [
      "Leg de stang stevig op de standaards van het rek, ongeveer op heuphoogte.",
      "Hang eronder met gestrekte armen, hielen op de grond, lichaam in een rechte lijn.",
      "Trek je borst naar de stang toe.",
      "Zak gecontroleerd terug en herhaal.",
    ],
    tip: "Hoe horizontaler je hangt, hoe zwaarder. Controleer dat de stang niet kan wegrollen.",
  },
  {
    id: "0073", media: "i6LWjok", naam: "Barbell pullover", en: "barbell pullover", groep: "Rug",
    doelspier: "Brede rugspier", secundair: ["Borst", "Triceps"], materiaal: ["stang", "bank"],
    instructies: [
      "Ga op de bank liggen en houd de stang met een smalle greep gestrekt boven je borst.",
      "Laat de stang met licht gebogen armen in een boog achter je hoofd zakken.",
      "Zak tot je een flinke rek in je rug voelt.",
      "Trek de stang terug boven je borst.",
    ],
  },
  {
    id: "0095", media: "dG7tG5y", naam: "Barbell shrug", en: "barbell shrug", groep: "Rug",
    doelspier: "Trapezius (nek/schouders)", secundair: ["Grip"], materiaal: ["stang"],
    instructies: [
      "Sta rechtop met de stang aan gestrekte armen voor je lichaam.",
      "Trek je schouders zo hoog mogelijk op richting je oren.",
      "Houd bovenin even vast en laat langzaam zakken.",
    ],
    tip: "Armen blijven gestrekt — de beweging komt puur uit je schouders.",
  },
  {
    id: "0406", media: "NJzBsGJ", naam: "Dumbbell shrug", en: "dumbbell shrug", groep: "Rug",
    doelspier: "Trapezius (nek/schouders)", secundair: ["Grip"], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in elke hand naast je lichaam.",
      "Trek je schouders recht omhoog richting je oren.",
      "Knijp bovenin aan en laat langzaam zakken.",
    ],
  },

  // ============ SCHOUDERS ============
  {
    id: "1456", media: "wdRZISl", naam: "Military press (staand)", en: "barbell standing close grip military press", groep: "Schouders",
    doelspier: "Schouders", secundair: ["Triceps", "Core", "Bovenborst"], materiaal: ["stang", "rek"],
    instructies: [
      "Pak de stang uit het rek op schouderhoogte, greep net buiten schouderbreedte.",
      "Sta rechtop met de stang op je voorste schouders, ellebogen iets voor de stang.",
      "Druk de stang recht omhoog langs je gezicht tot gestrekte armen boven je hoofd.",
      "Laat gecontroleerd terugzakken naar je schouders en herhaal.",
    ],
    tip: "Span je billen en buik aan zodat je onderrug niet doorbuigt.",
  },
  {
    id: "0091", media: "kTbSH9h", naam: "Overhead press (zittend)", en: "barbell seated overhead press", groep: "Schouders",
    doelspier: "Schouders", secundair: ["Triceps"], materiaal: ["stang", "bank", "rek"],
    instructies: [
      "Zet de rugleuning van de bank rechtop en ga zitten met de stang op schouderhoogte.",
      "Druk de stang recht omhoog tot gestrekte armen.",
      "Laat de stang gecontroleerd zakken tot kinhoogte.",
      "Druk weer omhoog en herhaal.",
    ],
  },
  {
    id: "0426", media: "A6wtbuL", naam: "Dumbbell overhead press (staand)", en: "dumbbell standing overhead press", groep: "Schouders",
    doelspier: "Schouders", secundair: ["Triceps", "Core"], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in elke hand op schouderhoogte, handpalmen naar voren.",
      "Druk de dumbbells omhoog tot gestrekte armen boven je hoofd.",
      "Laat gecontroleerd terugzakken tot schouderhoogte en herhaal.",
    ],
  },
  {
    id: "0405", media: "znQUdHY", naam: "Dumbbell shoulder press (zittend)", en: "dumbbell seated shoulder press", groep: "Schouders",
    doelspier: "Schouders", secundair: ["Triceps"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Zet de rugleuning rechtop en ga zitten met de dumbbells op schouderhoogte.",
      "Druk ze omhoog tot je armen gestrekt zijn boven je hoofd.",
      "Laat langzaam zakken tot oorhoogte en herhaal.",
    ],
    tip: "De rugleuning geeft steun waardoor je iets zwaarder kunt drukken dan staand.",
  },
  {
    id: "2137", media: "Xy4jlWA", naam: "Arnold press", en: "dumbbell arnold press", groep: "Schouders",
    doelspier: "Schouders (alle koppen)", secundair: ["Triceps"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Zit rechtop met de dumbbells voor je schouders, handpalmen naar je toe.",
      "Druk de dumbbells omhoog en draai onderweg je handpalmen naar voren.",
      "Bovenin zijn je armen gestrekt met de handpalmen van je af.",
      "Draai op de terugweg je handen weer terug en herhaal.",
    ],
  },
  {
    id: "1700", media: "FS63wTN", naam: "Dumbbell push press", en: "dumbbell push press", groep: "Schouders",
    doelspier: "Schouders", secundair: ["Benen", "Triceps", "Core"], materiaal: ["dumbbells"],
    instructies: [
      "Sta met de dumbbells op schouderhoogte.",
      "Zak licht door je knieën en strek explosief je benen terwijl je de dumbbells omhoog drukt.",
      "Vang het gewicht bovenin op met gestrekte armen.",
      "Laat gecontroleerd zakken en herhaal.",
    ],
    tip: "Door de beenzet kun je zwaarder drukken — mooie krachtoefening voor het hele lichaam.",
  },
  {
    id: "0334", media: "DsgkuIt", naam: "Zijwaartse raise", en: "dumbbell lateral raise", groep: "Schouders",
    doelspier: "Zijkant schouders", secundair: [], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in elke hand naast je lichaam.",
      "Hef je armen zijwaarts met licht gebogen ellebogen tot schouderhoogte.",
      "Houd kort vast en laat langzaam zakken.",
    ],
    tip: "Licht gewicht, strakke uitvoering — niet zwaaien. Dit maakt je schouders breder.",
  },
  {
    id: "0310", media: "3eGE2JC", naam: "Front raise", en: "dumbbell front raise", groep: "Schouders",
    doelspier: "Voorste schouders", secundair: [], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met de dumbbells voor je bovenbenen, handpalmen naar je lichaam.",
      "Hef één of beide armen gestrekt naar voren tot schouderhoogte.",
      "Laat langzaam zakken en herhaal.",
    ],
  },
  {
    id: "0380", media: "v1qBec9", naam: "Bent-over rear raise", en: "dumbbell rear lateral raise", groep: "Schouders",
    doelspier: "Achterste schouders", secundair: ["Bovenrug"], materiaal: ["dumbbells"],
    instructies: [
      "Buig voorover met een rechte rug tot je romp bijna horizontaal is.",
      "Laat de dumbbells onder je borst hangen, handpalmen naar elkaar.",
      "Hef je armen zijwaarts tot schouderhoogte en knijp je schouderbladen samen.",
      "Laat langzaam zakken en herhaal.",
    ],
    tip: "Belangrijk voor gezonde schouders en een goede houding — vaak vergeten spiergroep.",
  },
  {
    id: "0383", media: "EAs3xL9", naam: "Reverse fly", en: "dumbbell reverse fly", groep: "Schouders",
    doelspier: "Achterste schouders", secundair: ["Bovenrug"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga met je borst voorover op de schuine bank liggen, dumbbells hangend onder je.",
      "Spreid je armen zijwaarts met licht gebogen ellebogen tot schouderhoogte.",
      "Knijp je schouderbladen samen en laat langzaam zakken.",
    ],
  },
  {
    id: "0120", media: "UDlhcO8", naam: "Upright row", en: "barbell upright row", groep: "Schouders",
    doelspier: "Schouders & trapezius", secundair: ["Biceps"], materiaal: ["stang"],
    instructies: [
      "Sta rechtop met de stang aan gestrekte armen voor je lichaam, greep op schouderbreedte.",
      "Trek de stang langs je lichaam omhoog tot borsthoogte, ellebogen wijzen naar buiten.",
      "Laat gecontroleerd zakken en herhaal.",
    ],
    tip: "Voelt het vervelend in je schouders? Pak dan iets breder vast of kies zijwaartse raises.",
  },

  // ============ BICEPS ============
  {
    id: "0031", media: "25GPyDY", naam: "Barbell curl", en: "barbell curl", groep: "Biceps",
    doelspier: "Biceps", secundair: ["Onderarmen"], materiaal: ["stang"],
    instructies: [
      "Sta rechtop met de stang aan gestrekte armen, onderhandse greep op schouderbreedte.",
      "Krul de stang omhoog naar je schouders zonder je ellebogen naar voren te bewegen.",
      "Knijp bovenin je biceps aan en laat langzaam zakken.",
    ],
    tip: "Houd je ellebogen tegen je zij en gebruik geen zwaai vanuit je rug.",
  },
  {
    id: "0080", media: "xNrS20v", naam: "Reverse curl", en: "barbell reverse curl", groep: "Biceps",
    doelspier: "Onderarmen & biceps", secundair: [], materiaal: ["stang"],
    instructies: [
      "Pak de stang met een bovenhandse greep op schouderbreedte.",
      "Krul de stang omhoog terwijl je ellebogen tegen je zij blijven.",
      "Laat langzaam zakken en herhaal.",
    ],
  },
  {
    id: "0294", media: "NbVPDMW", naam: "Dumbbell curl", en: "dumbbell biceps curl", groep: "Biceps",
    doelspier: "Biceps", secundair: ["Onderarmen"], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in elke hand, handpalmen naar voren.",
      "Krul beide dumbbells tegelijk omhoog naar je schouders.",
      "Knijp bovenin aan en laat langzaam zakken.",
    ],
  },
  {
    id: "0285", media: "BU15nH4", naam: "Alternerende dumbbell curl", en: "dumbbell alternate biceps curl", groep: "Biceps",
    doelspier: "Biceps", secundair: ["Onderarmen"], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in elke hand naast je lichaam.",
      "Krul één arm omhoog en draai onderweg je handpalm naar boven.",
      "Laat zakken en herhaal met de andere arm, om en om.",
    ],
  },
  {
    id: "0313", media: "slDvUAU", naam: "Hammer curl", en: "dumbbell hammer curl", groep: "Biceps",
    doelspier: "Biceps & onderarmen", secundair: [], materiaal: ["dumbbells"],
    instructies: [
      "Houd de dumbbells naast je lichaam met de handpalmen naar elkaar toe (hamergreep).",
      "Krul de dumbbells omhoog zonder je polsen te draaien.",
      "Laat langzaam zakken en herhaal.",
    ],
  },
  {
    id: "0297", media: "gvsWLQw", naam: "Concentration curl", en: "dumbbell concentration curl", groep: "Biceps",
    doelspier: "Biceps", secundair: [], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga op de bank zitten en steun je elleboog tegen de binnenkant van je dij.",
      "Krul de dumbbell omhoog naar je schouder.",
      "Knijp bovenin aan en laat heel langzaam zakken.",
    ],
  },
  {
    id: "0318", media: "ae9UoXQ", naam: "Incline dumbbell curl", en: "dumbbell incline curl", groep: "Biceps",
    doelspier: "Biceps (lange kop)", secundair: [], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga op de schuine bank liggen (±45 graden) met de dumbbells recht naar beneden hangend.",
      "Krul de dumbbells omhoog terwijl je bovenarmen stil blijven.",
      "Laat langzaam volledig zakken — juist de strekking maakt deze oefening effectief.",
    ],
  },
  {
    id: "0439", media: "kXaIn5A", naam: "Zottman curl", en: "dumbbell zottman curl", groep: "Biceps",
    doelspier: "Biceps & onderarmen", secundair: [], materiaal: ["dumbbells"],
    instructies: [
      "Krul de dumbbells omhoog met de handpalmen naar boven.",
      "Draai bovenin je polsen zodat je handpalmen naar beneden wijzen.",
      "Laat met deze bovenhandse greep langzaam zakken en draai onderin weer terug.",
    ],
  },

  // ============ TRICEPS ============
  {
    id: "0030", media: "J6Dx1Mu", naam: "Bankdrukken met smalle greep", en: "barbell close-grip bench press", groep: "Triceps",
    doelspier: "Triceps", secundair: ["Borst", "Voorste schouders"], materiaal: ["stang", "bank", "rek"],
    instructies: [
      "Ga op de vlakke bank liggen en pak de stang op schouderbreedte of net iets smaller.",
      "Laat de stang zakken naar je onderborst met de ellebogen dicht langs je lichaam.",
      "Druk de stang krachtig terug omhoog tot gestrekte armen.",
    ],
    tip: "Dé zware basisoefening voor triceps. Niet extreem smal vastpakken — schouderbreedte is genoeg.",
  },
  {
    id: "0060", media: "h8LFzo9", naam: "Skull crusher", en: "barbell lying triceps extension skull crusher", groep: "Triceps",
    doelspier: "Triceps", secundair: [], materiaal: ["stang", "bank"],
    instructies: [
      "Ga op de bank liggen met de stang aan gestrekte armen boven je borst, smalle greep.",
      "Buig alleen je ellebogen en laat de stang zakken tot vlak boven je voorhoofd.",
      "Strek je armen weer volledig terwijl je bovenarmen stil blijven.",
    ],
  },
  {
    id: "0092", media: "5uFK1xr", naam: "Overhead triceps extension (barbell)", en: "barbell seated overhead triceps extension", groep: "Triceps",
    doelspier: "Triceps", secundair: [], materiaal: ["stang", "bank"],
    instructies: [
      "Ga zitten en houd de stang met een smalle greep gestrekt boven je hoofd.",
      "Laat de stang achter je hoofd zakken door alleen je ellebogen te buigen.",
      "Strek je armen weer volledig boven je hoofd.",
    ],
  },
  {
    id: "0351", media: "mpKZGWz", naam: "Liggende dumbbell extension", en: "dumbbell lying triceps extension", groep: "Triceps",
    doelspier: "Triceps", secundair: [], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga op de bank liggen met in elke hand een dumbbell gestrekt boven je borst.",
      "Buig je ellebogen en laat de dumbbells naast je hoofd zakken.",
      "Strek je armen weer en houd je bovenarmen de hele tijd stil.",
    ],
  },
  {
    id: "2188", media: "kont8Ut", naam: "Zittende dumbbell extension", en: "dumbbell seated triceps extension", groep: "Triceps",
    doelspier: "Triceps", secundair: [], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Ga zitten en houd één dumbbell met beide handen achter je hoofd, ellebogen omhoog.",
      "Strek je armen tot de dumbbell boven je hoofd is.",
      "Laat langzaam terugzakken achter je hoofd en herhaal.",
    ],
  },
  {
    id: "0333", media: "W6PxUkg", naam: "Dumbbell kickback", en: "dumbbell kickback", groep: "Triceps",
    doelspier: "Triceps", secundair: [], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Steun met één hand en knie op de bank, rug horizontaal.",
      "Houd je bovenarm langs je lichaam, elleboog 90 graden gebogen.",
      "Strek je arm volledig naar achteren en knijp je triceps aan.",
      "Buig langzaam terug en herhaal.",
    ],
  },
  {
    id: "0129", media: "RrLske5", naam: "Bench dip", en: "bench dip (knees bent)", groep: "Triceps",
    doelspier: "Triceps", secundair: ["Borst", "Schouders"], materiaal: ["lichaam", "bank"],
    instructies: [
      "Zet je handen op de rand van de bank, vingers naar voren, voeten op de grond.",
      "Schuif je billen van de bank af en zak door je ellebogen tot ±90 graden.",
      "Druk jezelf terug omhoog tot gestrekte armen.",
    ],
    tip: "Zwaarder maken? Strek je benen of leg een schijf op je schoot.",
  },
  {
    id: "0259", media: "x6KpKpq", naam: "Close-grip push-up", en: "close-grip push-up", groep: "Triceps",
    doelspier: "Triceps", secundair: ["Borst", "Core"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Neem een plankpositie aan met je handen op schouderbreedte of smaller.",
      "Zak met je ellebogen dicht langs je lichaam naar de grond.",
      "Druk jezelf terug omhoog en herhaal.",
    ],
  },
  {
    id: "0283", media: "soIB2rj", naam: "Diamond push-up", en: "diamond push-up", groep: "Triceps",
    doelspier: "Triceps", secundair: ["Borst"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Plaats je handen onder je borst met duimen en wijsvingers tegen elkaar in een ruitvorm.",
      "Zak gecontroleerd tot je borst je handen bijna raakt.",
      "Druk jezelf krachtig terug omhoog.",
    ],
  },

  // ============ BENEN & BILLEN ============
  {
    id: "1436", media: "Gnfo4FM", naam: "Squat (barbell)", en: "barbell high bar squat", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Core", "Onderrug"], materiaal: ["stang", "rek"],
    instructies: [
      "Zet de stang op de standaards op schouderhoogte en stap eronder, stang op je trapezius.",
      "Til de stang uit het rek en doe een stap naar achteren, voeten op schouderbreedte.",
      "Zak gecontroleerd door je knieën tot je heupen onder kniehoogte komen, rug recht.",
      "Druk jezelf krachtig terug omhoog en herhaal.",
    ],
    tip: "Dé basisoefening voor beenkracht. Knieën volgen de richting van je tenen; hielen blijven op de grond.",
  },
  {
    id: "0042", media: "zG0zs85", naam: "Front squat", en: "barbell front squat", groep: "Benen & billen",
    doelspier: "Bovenbenen (voorkant)", secundair: ["Billen", "Core"], materiaal: ["stang", "rek"],
    instructies: [
      "Leg de stang op je voorste schouders met je ellebogen hoog naar voren.",
      "Stap uit het rek en zet je voeten op schouderbreedte.",
      "Zak diep door je knieën terwijl je romp rechtop blijft.",
      "Druk jezelf terug omhoog en herhaal.",
    ],
    tip: "Meer nadruk op je quadriceps en core dan de gewone squat; je romp blijft rechter.",
  },
  {
    id: "0054", media: "t8iSghb", naam: "Barbell lunge", en: "barbell lunge", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Core"], materiaal: ["stang", "rek"],
    instructies: [
      "Zet de stang op je trapezius zoals bij een squat.",
      "Doe een grote stap naar voren en zak tot beide knieën ±90 graden gebogen zijn.",
      "Druk jezelf vanuit je voorste been terug naar de beginpositie.",
      "Wissel van been en herhaal.",
    ],
  },
  {
    id: "0099", media: "gGNQmVt", naam: "Bulgaarse split squat (barbell)", en: "barbell single leg split squat", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Core", "Balans"], materiaal: ["stang", "bank", "rek"],
    instructies: [
      "Leg de stang op je rug en plaats de wreef van je achterste voet op de bank.",
      "Zak gecontroleerd door je voorste been tot je achterste knie bijna de grond raakt.",
      "Druk jezelf terug omhoog en maak de set af voordat je van been wisselt.",
    ],
    tip: "Brute oefening voor benen en billen — begin licht, de balans is het lastigst.",
  },
  {
    id: "0114", media: "Kxquu2E", naam: "Barbell step-up", en: "barbell step-up", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Balans"], materiaal: ["stang", "bank"],
    instructies: [
      "Leg de stang op je rug en ga voor de bank (of een stevige verhoging) staan.",
      "Stap met één voet volledig op de verhoging en druk jezelf omhoog.",
      "Stap gecontroleerd terug naar beneden en wissel van been.",
    ],
  },
  {
    id: "0085", media: "wQ2c4XD", naam: "Romanian deadlift", en: "barbell romanian deadlift", groep: "Benen & billen",
    doelspier: "Hamstrings & billen", secundair: ["Onderrug"], materiaal: ["stang"],
    instructies: [
      "Sta rechtop met de stang aan gestrekte armen voor je bovenbenen.",
      "Duw je heupen naar achteren en laat de stang langs je benen zakken, knieën licht gebogen.",
      "Zak tot je een flinke rek in je hamstrings voelt en je rug nog recht is.",
      "Duw je heupen naar voren en kom terug omhoog.",
    ],
    tip: "Het is een heupbeweging, geen squat — de stang blijft dicht tegen je benen.",
  },
  {
    id: "0044", media: "XlZ4lAC", naam: "Good morning", en: "barbell good morning", groep: "Benen & billen",
    doelspier: "Hamstrings & onderrug", secundair: ["Billen"], materiaal: ["stang", "rek"],
    instructies: [
      "Leg de stang op je trapezius zoals bij een squat, voeten op heupbreedte.",
      "Duw je heupen naar achteren en buig voorover met een rechte rug, knieën licht gebogen.",
      "Zak tot je romp bijna horizontaal is of tot je hamstrings op rek staan.",
      "Kom met een rechte rug terug omhoog.",
    ],
    tip: "Begin licht — techniek gaat hier vóór gewicht.",
  },
  {
    id: "1409", media: "qKBpF7I", naam: "Hip thrust / glute bridge (barbell)", en: "barbell glute bridge", groep: "Benen & billen",
    doelspier: "Billen", secundair: ["Hamstrings", "Core"], materiaal: ["stang", "bank", "mat"],
    instructies: [
      "Zit op de grond met je bovenrug tegen de bank en rol de stang over je heupen.",
      "Zet je voeten plat op de grond, knieën gebogen.",
      "Duw je heupen krachtig omhoog tot je lichaam van knieën tot schouders een rechte lijn vormt.",
      "Knijp bovenin je billen aan, zak gecontroleerd en herhaal.",
    ],
    tip: "Leg een handdoek of mat om de stang voor comfort op je heupen.",
  },
  {
    id: "1760", media: "yn8yg1r", naam: "Goblet squat", en: "dumbbell goblet squat", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Core"], materiaal: ["dumbbells"],
    instructies: [
      "Houd één dumbbell verticaal met beide handen tegen je borst.",
      "Zak diep door je knieën met een rechte rug, ellebogen binnen je knieën.",
      "Druk jezelf terug omhoog en herhaal.",
    ],
    tip: "Ideaal om squat-techniek te oefenen of als warming-up voor de barbell squat.",
  },
  {
    id: "0336", media: "RRWFUcw", naam: "Dumbbell lunge", en: "dumbbell lunge", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Balans"], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in elke hand naast je lichaam.",
      "Doe een grote stap naar voren en zak tot beide knieën ±90 graden gebogen zijn.",
      "Druk jezelf terug naar de beginpositie en wissel van been.",
    ],
  },
  {
    id: "1460", media: "IZVHb27", naam: "Walking lunge", en: "walking lunge", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Balans", "Core"], materiaal: ["lichaam"],
    instructies: [
      "Doe een grote stap naar voren en zak tot je achterste knie bijna de grond raakt.",
      "Druk jezelf omhoog en stap direct door met het andere been.",
      "Loop zo al lungend vooruit.",
    ],
    tip: "Zwaarder maken? Pak de dumbbells erbij.",
  },
  {
    id: "0410", media: "qx4fgX7", naam: "Bulgaarse split squat (dumbbell)", en: "dumbbell single leg split squat", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Balans", "Core"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Houd een dumbbell in elke hand en leg de wreef van je achterste voet op de bank.",
      "Zak gecontroleerd tot je achterste knie bijna de grond raakt.",
      "Druk jezelf vanuit je voorste been terug omhoog.",
      "Maak de set af en wissel van been.",
    ],
  },
  {
    id: "0431", media: "aXtJhlg", naam: "Dumbbell step-up", en: "dumbbell step-up", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Balans"], materiaal: ["dumbbells", "bank"],
    instructies: [
      "Houd een dumbbell in elke hand en ga voor de bank staan.",
      "Stap met één voet op de bank en druk jezelf volledig omhoog.",
      "Stap gecontroleerd terug en wissel van been.",
    ],
  },
  {
    id: "1459", media: "rR0LJzx", naam: "Romanian deadlift (dumbbell)", en: "dumbbell romanian deadlift", groep: "Benen & billen",
    doelspier: "Hamstrings & billen", secundair: ["Onderrug"], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met de dumbbells voor je bovenbenen.",
      "Duw je heupen naar achteren en laat de dumbbells langs je benen zakken.",
      "Zak tot je een rek in je hamstrings voelt, rug recht.",
      "Kom terug omhoog door je heupen naar voren te duwen.",
    ],
  },
  {
    id: "0514", media: "LIlE5Tn", naam: "Jump squat", en: "jump squat", groep: "Benen & billen",
    doelspier: "Bovenbenen & billen", secundair: ["Kuiten", "Explosiviteit"], materiaal: ["lichaam"],
    instructies: [
      "Zak door je knieën tot een squatpositie.",
      "Spring explosief zo hoog mogelijk omhoog.",
      "Land zacht door je knieën te buigen en ga direct door in de volgende herhaling.",
    ],
  },
  {
    id: "1372", media: "8ozhUIZ", naam: "Staande kuit-raise (barbell)", en: "barbell standing calf raise", groep: "Benen & billen",
    doelspier: "Kuiten", secundair: [], materiaal: ["stang", "rek"],
    instructies: [
      "Leg de stang op je rug zoals bij een squat.",
      "Duw jezelf zo hoog mogelijk op je tenen.",
      "Houd bovenin even vast en zak langzaam terug.",
    ],
    tip: "Extra bewegingsuitslag? Zet je voorvoeten op een schijf of drempel.",
  },
  {
    id: "0417", media: "dPmaUaU", naam: "Staande kuit-raise (dumbbell)", en: "dumbbell standing calf raise", groep: "Benen & billen",
    doelspier: "Kuiten", secundair: [], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in elke hand naast je lichaam.",
      "Duw jezelf zo hoog mogelijk op je tenen.",
      "Zak langzaam terug en herhaal.",
    ],
  },

  // ============ CORE ============
  {
    id: "0274", media: "TFqbd8t", naam: "Crunch", en: "crunch floor", groep: "Core",
    doelspier: "Buikspieren", secundair: [], materiaal: ["lichaam", "mat"],
    instructies: [
      "Ga op je rug liggen met gebogen knieën en je voeten plat op de grond.",
      "Plaats je handen achter je hoofd of gekruist op je borst.",
      "Krul je schouders van de grond richting je knieën en span je buikspieren aan.",
      "Zak langzaam terug zonder volledig te ontspannen.",
    ],
  },
  {
    id: "0735", media: "Bn6TXyO", naam: "Sit-up", en: "sit-up v. 2", groep: "Core",
    doelspier: "Buikspieren", secundair: ["Heupbuigers"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Ga op je rug liggen met gebogen knieën.",
      "Kom met je hele romp omhoog tot je rechtop zit.",
      "Zak gecontroleerd terug naar de mat en herhaal.",
    ],
  },
  {
    id: "0872", media: "nCU1Ekp", naam: "Reverse crunch", en: "reverse crunch", groep: "Core",
    doelspier: "Onderste buikspieren", secundair: [], materiaal: ["lichaam", "mat"],
    instructies: [
      "Ga op je rug liggen met je benen omhoog en knieën 90 graden gebogen.",
      "Trek je knieën richting je borst en til je heupen van de grond.",
      "Laat je heupen langzaam terugzakken en herhaal.",
    ],
  },
  {
    id: "0687", media: "XVDdcoj", naam: "Russian twist", en: "russian twist", groep: "Core",
    doelspier: "Schuine buikspieren", secundair: [], materiaal: ["lichaam", "mat"],
    instructies: [
      "Zit op de mat, leun licht achterover en til je voeten van de grond.",
      "Draai je romp afwisselend naar links en rechts.",
      "Raak met je handen (of een schijf) de grond naast je heup aan.",
    ],
    tip: "Zwaarder maken? Houd een schijf van 2,5 of 5 kg vast.",
  },
  {
    id: "0276", media: "iny3m5y", naam: "Dead bug", en: "dead bug", groep: "Core",
    doelspier: "Diepe buikspieren", secundair: ["Onderrug"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Ga op je rug liggen met je armen recht omhoog en je knieën 90 graden gebogen boven je heupen.",
      "Strek langzaam je rechterbeen en linkerarm richting de grond, onderrug blijft plat op de mat.",
      "Kom terug en herhaal met de andere arm en het andere been.",
    ],
  },
  {
    id: "0630", media: "RJgzwny", naam: "Mountain climber", en: "mountain climber", groep: "Core",
    doelspier: "Core & conditie", secundair: ["Schouders", "Benen"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Neem een plankpositie aan op gestrekte armen.",
      "Trek afwisselend je knieën in een vlot tempo richting je borst.",
      "Houd je heupen laag en je rug recht.",
    ],
  },
  {
    id: "0620", media: "WhuFnR7", naam: "Liggende beenheffing (op bank)", en: "lying leg raise flat bench", groep: "Core",
    doelspier: "Onderste buikspieren", secundair: ["Heupbuigers"], materiaal: ["lichaam", "bank"],
    instructies: [
      "Ga op je rug op de bank liggen en houd de bank naast je hoofd vast.",
      "Hef je gestrekte benen tot ze loodrecht op je romp staan.",
      "Laat ze langzaam zakken tot net onder bankhoogte en herhaal.",
    ],
  },
  {
    id: "0570", media: "OyoZ3Pu", naam: "Leg pull-in (op bank)", en: "leg pull in flat bench", groep: "Core",
    doelspier: "Onderste buikspieren", secundair: ["Heupbuigers"], materiaal: ["lichaam", "bank"],
    instructies: [
      "Zit op de rand van de bank en leun licht achterover, benen gestrekt naar voren.",
      "Trek je knieën naar je borst terwijl je romp iets naar voren komt.",
      "Strek je benen weer uit zonder de grond te raken en herhaal.",
    ],
  },
  {
    id: "0705", media: "RKjH6Lt", naam: "Zijplank", en: "side bridge v. 2", groep: "Core",
    doelspier: "Schuine buikspieren", secundair: ["Schouders", "Billen"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Ga op je zij liggen en steun op je onderarm, elleboog onder je schouder.",
      "Til je heupen op tot je lichaam een rechte lijn vormt.",
      "Houd deze positie vast (bijv. 20–45 seconden) en wissel van kant.",
    ],
  },
  {
    id: "0464", media: "CosupLu", naam: "Plank met draai", en: "front plank with twist", groep: "Core",
    doelspier: "Core & schuine buikspieren", secundair: ["Schouders"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Neem een plankpositie aan op je onderarmen, lichaam in een rechte lijn.",
      "Draai je heupen afwisselend naar links en rechts, net boven de grond.",
      "Houd je bovenlichaam zo stil mogelijk.",
    ],
  },
  {
    id: "0407", media: "IpONWYv", naam: "Side bend (dumbbell)", en: "dumbbell side bend", groep: "Core",
    doelspier: "Schuine buikspieren", secundair: [], materiaal: ["dumbbells"],
    instructies: [
      "Sta rechtop met een dumbbell in één hand naast je lichaam.",
      "Buig zijwaarts naar de kant van de dumbbell en laat hem langs je been zakken.",
      "Kom vanuit je zij terug omhoog. Maak de set af en wissel van kant.",
    ],
  },
  {
    id: "3699", media: "yRpV5TC", naam: "Shoulder taps", en: "shoulder tap", groep: "Core",
    doelspier: "Core", secundair: ["Schouders"], materiaal: ["lichaam", "mat"],
    instructies: [
      "Neem een plankpositie aan op gestrekte armen, voeten iets uit elkaar.",
      "Tik met je rechterhand je linkerschouder aan en zet hem terug.",
      "Wissel af en houd je heupen zo stil mogelijk.",
    ],
  },
];

// ============ SCHEMA'S ============
// Krachtgericht: zware basisoefeningen, lage herhalingen, veel rust.
// Progressie met jouw schijven: kleinste stap = 2 kg op de stang (1 kg per kant).

const SCHEMAS = [
  {
    id: "kracht-a",
    naam: "Kracht 5×5 — Workout A",
    focus: "Kracht · hele lichaam",
    duur: "± 45–60 min",
    beschrijving:
      "Klassiek 5×5-krachtschema. Wissel Workout A en B af en train 3× per week met minimaal één rustdag ertussen (bijv. ma–wo–vr). " +
      "Lukken alle 5 sets van 5 herhalingen? Voeg de volgende training 2 kg toe (1 kg per kant). " +
      "Mislukt een gewicht drie trainingen op rij, ga dan 10% terug en bouw opnieuw op.",
    rust: "3 minuten tussen zware sets, 90 sec bij de core-oefening.",
    oefeningen: [
      { ref: "1436", sets: 5, reps: "5", notitie: "Begin licht en voeg elke training 2 kg toe." },
      { ref: "0025", sets: 5, reps: "5", notitie: "Zet de vangpennen op borsthoogte als je alleen traint." },
      { ref: "0027", sets: 5, reps: "5", notitie: "Rug recht, geen zwaai." },
      { ref: "0705", sets: 3, reps: "30 sec per kant", notitie: "Afsluiter voor je core." },
    ],
  },
  {
    id: "kracht-b",
    naam: "Kracht 5×5 — Workout B",
    focus: "Kracht · hele lichaam",
    duur: "± 45–60 min",
    beschrijving:
      "De tegenhanger van Workout A. Zelfde regels: wissel af met A, train 3× per week en voeg 2 kg toe zodra alle herhalingen lukken. " +
      "Bij de deadlift kun je grotere stappen maken (2–4 kg per training) zolang de techniek goed blijft.",
    rust: "3 minuten tussen zware sets, 90 sec bij de lichtere oefeningen.",
    oefeningen: [
      { ref: "1436", sets: 5, reps: "5", notitie: "Zelfde gewicht als bij Workout A." },
      { ref: "1456", sets: 5, reps: "5", notitie: "Overhead press gaat traag vooruit — soms is 1 kg per kant al veel." },
      { ref: "0032", sets: 3, reps: "5", notitie: "Zwaar maar kort: 3 werksets is genoeg." },
      { ref: "0499", sets: 3, reps: "8–10", notitie: "Stang op heuphoogte in het rek." },
    ],
  },
  {
    id: "upper-volume",
    naam: "Bovenlichaam — kracht + volume",
    focus: "Borst, rug, schouders & armen",
    duur: "± 60 min",
    beschrijving:
      "Voor als je 4× per week wilt trainen: wissel deze af met de onderlichaam-workout (boven/onder-split). " +
      "Eerst zwaar drukken en trekken voor kracht, daarna hogere herhalingen voor spiergroei.",
    rust: "3 min bij de eerste twee oefeningen, daarna 90 sec.",
    oefeningen: [
      { ref: "0025", sets: 5, reps: "5", notitie: "Zwaarste oefening eerst." },
      { ref: "3017", sets: 4, reps: "6", notitie: "Explosief trekken, elke herhaling vanaf de grond." },
      { ref: "0314", sets: 3, reps: "8–10" },
      { ref: "0334", sets: 3, reps: "12–15", notitie: "Licht gewicht, strakke uitvoering." },
      { ref: "0031", sets: 3, reps: "8–10" },
      { ref: "0060", sets: 3, reps: "8–10" },
    ],
  },
  {
    id: "lower-volume",
    naam: "Onderlichaam — kracht + volume",
    focus: "Benen, billen & core",
    duur: "± 60 min",
    beschrijving:
      "De tegenhanger van de bovenlichaam-workout. Zwaar squatten voor kracht, daarna eenbenig werk en billen voor spiergroei en balans.",
    rust: "3 min bij squat en RDL, daarna 90 sec.",
    oefeningen: [
      { ref: "1436", sets: 5, reps: "5" },
      { ref: "0085", sets: 4, reps: "8" },
      { ref: "0410", sets: 3, reps: "8–10 per been", notitie: "Achterste voet op de bank." },
      { ref: "1409", sets: 3, reps: "10", notitie: "Mat of handdoek om de stang voor comfort." },
      { ref: "1372", sets: 3, reps: "12–15" },
      { ref: "0687", sets: 3, reps: "20", notitie: "Eventueel met een schijf van 2,5–5 kg." },
    ],
  },
  {
    id: "dumbbell-full",
    naam: "Full-body met dumbbells (snelle sessie)",
    focus: "Hele lichaam · alleen dumbbells",
    duur: "± 30–40 min",
    beschrijving:
      "Voor drukke dagen: geen stang opbouwen, alleen de dumbbells en de bank. " +
      "Kies een gewicht waarmee de laatste 2 herhalingen zwaar zijn en rust kort.",
    rust: "60–90 seconden tussen de sets.",
    oefeningen: [
      { ref: "1760", sets: 3, reps: "10–12" },
      { ref: "0289", sets: 3, reps: "10" },
      { ref: "0292", sets: 3, reps: "10 per arm" },
      { ref: "0405", sets: 3, reps: "10" },
      { ref: "1459", sets: 3, reps: "12" },
      { ref: "0313", sets: 2, reps: "12" },
      { ref: "0274", sets: 3, reps: "15–20" },
    ],
  },
];

// Jouw schijvenset (totaal aantal schijven; de calculator rekent per kant)
const STANDAARD_SCHIJVEN = [
  { kg: 15, aantal: 2 },
  { kg: 10, aantal: 2 },
  { kg: 5, aantal: 4 },
  { kg: 4, aantal: 4 },
  { kg: 2.5, aantal: 4 },
  { kg: 2, aantal: 8 },
  { kg: 1, aantal: 8 },
];

const STANDAARD_STANG_KG = 10; // pas aan in Instellingen als jouw stang anders weegt
