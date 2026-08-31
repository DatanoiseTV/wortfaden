/* Word bank for naming practice.
 * Feature keys follow the Semantic Feature Analysis question set
 * (category / function / action / location / association / properties).
 *   k  = category      "Was für ein Ding ist das?"      / "What type of thing is it?"
 *   fn = function      "Wofür braucht man das?"          / "What is it used for?"
 *   ak = action        "Was macht man damit?"            / "What does it do?"
 *   o  = location      "Wo findet man das?"              / "Where do you find it?"
 *   as = association   "Woran denkst du dabei?"          / "What does it make you think of?"
 *   e  = properties    "Wie sieht/fühlt es sich an?"     / "What is it like?"
 * c = cloze sentence with ___ (high-cloze sentence completion cue)
 * s = syllables, r = rhyme cue (optional, omitted where no natural rhyme exists)
 */
window.WORDS = [

/* ---------- Klinik & Gesundheit ---------- */
{id:'wasser',emoji:'💧',cat:'klinik',
 de:{w:'Wasser',a:'das',s:['Was','ser'],c:'Ich habe Durst, ich möchte ___.',r:'blasser',
     f:{k:'ein Getränk',fn:'zum Trinken',ak:'es fließt',o:'im Glas, aus dem Hahn',as:'Durst, Glas',e:'klar, kühl, ohne Geschmack'}},
 en:{w:'water',a:'the',s:['wa','ter'],c:"I'm thirsty, I would like some ___.",r:'daughter',
     f:{k:'a drink',fn:'for drinking',ak:'it flows',o:'in a glass, from the tap',as:'thirst, glass',e:'clear, cool, no taste'}}},

{id:'tablette',emoji:'💊',cat:'klinik',
 de:{w:'Tablette',a:'die',s:['Ta','blet','te'],c:'Gegen die Schmerzen nehme ich eine ___.',
     f:{k:'ein Medikament',fn:'gegen Schmerzen, zum Gesundwerden',ak:'man schluckt sie',o:'in der Apotheke, am Bett',as:'Arzt, Wasserglas',e:'klein, rund, weiß'}},
 en:{w:'tablet',a:'a',s:['tab','let'],c:'For the pain I take a ___.',
     f:{k:'a medicine',fn:'for pain, for getting better',ak:'you swallow it',o:'pharmacy, bedside table',as:'doctor, glass of water',e:'small, round, white'}}},

{id:'aerztin',emoji:'🩺',cat:'klinik',
 de:{w:'Ärztin',a:'die',s:['Ärz','tin'],c:'Bei Schmerzen frage ich die ___.',
     f:{k:'ein Beruf',fn:'sie macht Menschen gesund',ak:'sie untersucht und erklärt',o:'im Krankenhaus, in der Praxis',as:'Kittel, Stethoskop',e:'freundlich, sie hört zu'}},
 en:{w:'doctor',a:'the',s:['doc','tor'],c:'When something hurts I ask the ___.',
     f:{k:'a profession',fn:'makes people well',ak:'examines and explains',o:'hospital, clinic',as:'white coat, stethoscope',e:'friendly, listens'}}},

{id:'pflegerin',emoji:'👩‍⚕️',cat:'klinik',
 de:{w:'Pflegerin',a:'die',s:['Pfle','ge','rin'],c:'Wenn ich Hilfe brauche, rufe ich die ___.',
     f:{k:'ein Beruf',fn:'sie hilft und pflegt',ak:'sie bringt Essen und Medikamente',o:'im Krankenhaus, auf der Station',as:'Klingel, Station',e:'geduldig, hilfsbereit'}},
 en:{w:'nurse',a:'the',s:['nurse'],c:'When I need help I call the ___.',r:'purse',
     f:{k:'a profession',fn:'helps and cares for people',ak:'brings food and medicine',o:'hospital, ward',as:'call button, ward',e:'patient, helpful'}}},

{id:'bett',emoji:'🛏️',cat:'klinik',
 de:{w:'Bett',a:'das',s:['Bett'],c:'Abends lege ich mich ins ___.',r:'nett',
     f:{k:'ein Möbelstück',fn:'zum Schlafen und Ausruhen',ak:'man liegt darin',o:'im Schlafzimmer, im Zimmer',as:'Kissen, Decke, Nacht',e:'weich, warm'}},
 en:{w:'bed',a:'the',s:['bed'],c:'In the evening I lie down in ___.',r:'red',
     f:{k:'a piece of furniture',fn:'for sleeping and resting',ak:'you lie in it',o:'bedroom, hospital room',as:'pillow, blanket, night',e:'soft, warm'}}},

{id:'schmerz',emoji:'🤕',cat:'klinik',
 de:{w:'Schmerz',a:'der',s:['Schmerz'],c:'Mein Kopf tut weh, ich habe ___.',r:'Herz',
     f:{k:'ein Gefühl im Körper',fn:'er warnt uns',ak:'er sticht oder pocht',o:'im Kopf, im Arm',as:'Tablette, Arzt',e:'scharf, dumpf, stark'}},
 en:{w:'pain',a:'the',s:['pain'],c:'My head hurts, I have ___.',r:'rain',
     f:{k:'a body feeling',fn:'it warns us',ak:'it stabs or throbs',o:'head, arm',as:'tablet, doctor',e:'sharp, dull, strong'}}},

{id:'brille',emoji:'👓',cat:'klinik',
 de:{w:'Brille',a:'die',s:['Bril','le'],c:'Zum Lesen setze ich meine ___ auf.',r:'Grille',
     f:{k:'eine Sehhilfe',fn:'damit man besser sieht',ak:'man setzt sie auf',o:'auf der Nase, auf dem Tisch',as:'Lesen, Augen',e:'leicht, aus Glas'}},
 en:{w:'glasses',a:'the',s:['glas','ses'],c:'To read I put on my ___.',
     f:{k:'a seeing aid',fn:'to see better',ak:'you put them on',o:'on your nose, on the table',as:'reading, eyes',e:'light, made of glass'}}},

{id:'rollstuhl',emoji:'🦽',cat:'klinik',
 de:{w:'Rollstuhl',a:'der',s:['Roll','stuhl'],c:'Wer nicht laufen kann, fährt im ___.',
     f:{k:'eine Gehhilfe',fn:'zum Fahren statt Laufen',ak:'er rollt',o:'im Krankenhaus, auf dem Flur',as:'Räder, Rampe',e:'stabil, mit Rädern'}},
 en:{w:'wheelchair',a:'a',s:['wheel','chair'],c:'Someone who cannot walk uses a ___.',
     f:{k:'a mobility aid',fn:'for moving instead of walking',ak:'it rolls',o:'hospital, hallway',as:'wheels, ramp',e:'sturdy, has wheels'}}},

{id:'handy',emoji:'📱',cat:'klinik',
 de:{w:'Handy',a:'das',s:['Han','dy'],c:'Ich rufe dich an mit dem ___.',
     f:{k:'ein Gerät',fn:'zum Telefonieren und Schreiben',ak:'es klingelt',o:'in der Tasche, am Bett',as:'Anruf, Akku',e:'flach, glatt'}},
 en:{w:'phone',a:'the',s:['phone'],c:'I will call you on the ___.',r:'bone',
     f:{k:'a device',fn:'for calling and texting',ak:'it rings',o:'pocket, bedside',as:'call, battery',e:'flat, smooth'}}},

{id:'buch',emoji:'📕',cat:'freizeit',
 de:{w:'Buch',a:'das',s:['Buch'],c:'Vor dem Schlafen lese ich ein ___.',r:'Tuch',
     f:{k:'etwas zum Lesen',fn:'zum Lesen und Lernen',ak:'man blättert darin',o:'im Regal, auf dem Nachttisch',as:'Geschichte, Bibliothek',e:'aus Papier, hat Seiten'}},
 en:{w:'book',a:'a',s:['book'],c:'Before sleeping I read a ___.',r:'look',
     f:{k:'something to read',fn:'for reading and learning',ak:'you turn its pages',o:'shelf, bedside table',as:'story, library',e:'made of paper, has pages'}}},

/* ---------- Körper ---------- */
{id:'hand',emoji:'✋',cat:'koerper',
 de:{w:'Hand',a:'die',s:['Hand'],c:'Zur Begrüßung gebe ich dir die ___.',r:'Land',
     f:{k:'ein Körperteil',fn:'zum Greifen und Halten',ak:'sie greift und winkt',o:'am Arm',as:'Finger, Handschuh',e:'fünf Finger, warm'}},
 en:{w:'hand',a:'the',s:['hand'],c:'To say hello I shake your ___.',r:'sand',
     f:{k:'a body part',fn:'for holding and grasping',ak:'it grips and waves',o:'at the end of the arm',as:'fingers, glove',e:'five fingers, warm'}}},

{id:'auge',emoji:'👁️',cat:'koerper',
 de:{w:'Auge',a:'das',s:['Au','ge'],c:'Ich sehe dich mit meinem ___.',
     f:{k:'ein Sinnesorgan',fn:'zum Sehen',ak:'es blinzelt',o:'im Gesicht',as:'Brille, Licht',e:'rund, blau oder braun'}},
 en:{w:'eye',a:'the',s:['eye'],c:'I see you with my ___.',r:'sky',
     f:{k:'a sense organ',fn:'for seeing',ak:'it blinks',o:'in the face',as:'glasses, light',e:'round, blue or brown'}}},

{id:'mund',emoji:'👄',cat:'koerper',
 de:{w:'Mund',a:'der',s:['Mund'],c:'Beim Sprechen bewege ich den ___.',r:'Hund',
     f:{k:'ein Körperteil',fn:'zum Sprechen und Essen',ak:'er öffnet sich',o:'im Gesicht',as:'Zähne, Lippen',e:'weich, rot'}},
 en:{w:'mouth',a:'the',s:['mouth'],c:'When I speak I move my ___.',r:'south',
     f:{k:'a body part',fn:'for speaking and eating',ak:'it opens',o:'in the face',as:'teeth, lips',e:'soft, red'}}},

{id:'fuss',emoji:'🦶',cat:'koerper',
 de:{w:'Fuß',a:'der',s:['Fuß'],c:'In den Schuh kommt der ___.',r:'Gruß',
     f:{k:'ein Körperteil',fn:'zum Gehen und Stehen',ak:'er tritt auf',o:'am Bein, unten',as:'Schuh, Socke',e:'hat Zehen'}},
 en:{w:'foot',a:'the',s:['foot'],c:'The shoe goes on the ___.',
     f:{k:'a body part',fn:'for walking and standing',ak:'it steps',o:'at the end of the leg',as:'shoe, sock',e:'has toes'}}},

{id:'haar',emoji:'💇',cat:'koerper',
 de:{w:'Haar',a:'das',s:['Haar'],c:'Mit der Bürste kämme ich mein ___.',r:'Paar',
     f:{k:'ein Körperteil',fn:'es wächst auf dem Kopf',ak:'es wächst',o:'auf dem Kopf',as:'Bürste, Friseur',e:'weich, lang oder kurz'}},
 en:{w:'hair',a:'the',s:['hair'],c:'With a brush I comb my ___.',r:'chair',
     f:{k:'a body part',fn:'grows on the head',ak:'it grows',o:'on the head',as:'brush, hairdresser',e:'soft, long or short'}}},

{id:'ohr',emoji:'👂',cat:'koerper',
 de:{w:'Ohr',a:'das',s:['Ohr'],c:'Musik höre ich mit dem ___.',r:'Tor',
     f:{k:'ein Sinnesorgan',fn:'zum Hören',ak:'es hört',o:'am Kopf, seitlich',as:'Musik, Ohrring',e:'klein, rund'}},
 en:{w:'ear',a:'the',s:['ear'],c:'I hear music with my ___.',r:'year',
     f:{k:'a sense organ',fn:'for hearing',ak:'it hears',o:'on the side of the head',as:'music, earring',e:'small, round'}}},

/* ---------- Familie & Menschen ---------- */
{id:'mutter',emoji:'👩',cat:'menschen',
 de:{w:'Mutter',a:'die',s:['Mut','ter'],c:'Mein Vater und meine ___.',r:'Futter',
     f:{k:'ein Mensch, Familie',fn:'sie hat mich großgezogen',ak:'sie sorgt für die Familie',o:'zu Hause',as:'Vater, Kind, Muttertag',e:'vertraut, nah'}},
 en:{w:'mother',a:'my',s:['mo','ther'],c:'My father and my ___.',r:'brother',
     f:{k:'a person, family',fn:'raised me',ak:'cares for the family',o:'at home',as:'father, child',e:'familiar, close'}}},

{id:'kind',emoji:'🧒',cat:'menschen',
 de:{w:'Kind',a:'das',s:['Kind'],c:'Es spielt im Sandkasten, es ist ein ___.',r:'Wind',
     f:{k:'ein Mensch',fn:'es lernt und wächst',ak:'es spielt und lacht',o:'im Kindergarten, auf dem Spielplatz',as:'Spielzeug, Schule',e:'klein, fröhlich'}},
 en:{w:'child',a:'a',s:['child'],c:'It plays in the sandbox, it is a ___.',r:'mild',
     f:{k:'a person',fn:'learns and grows',ak:'plays and laughs',o:'kindergarten, playground',as:'toy, school',e:'small, cheerful'}}},

{id:'freund',emoji:'🤝',cat:'menschen',
 de:{w:'Freund',a:'der',s:['Freund'],c:'Er besucht mich oft, er ist mein bester ___.',
     f:{k:'ein Mensch',fn:'er ist für mich da',ak:'er besucht und hilft',o:'überall',as:'Vertrauen, Besuch',e:'vertraut, treu'}},
 en:{w:'friend',a:'a',s:['friend'],c:'He visits me often, he is my best ___.',r:'end',
     f:{k:'a person',fn:'is there for me',ak:'visits and helps',o:'everywhere',as:'trust, visit',e:'familiar, loyal'}}},

{id:'baby',emoji:'👶',cat:'menschen',
 de:{w:'Baby',a:'das',s:['Ba','by'],c:'Es ist gerade geboren, es ist ein ___.',
     f:{k:'ein kleiner Mensch',fn:'es wächst heran',ak:'es schläft und weint',o:'im Kinderwagen, auf dem Arm',as:'Windel, Flasche',e:'winzig, weich'}},
 en:{w:'baby',a:'a',s:['ba','by'],c:'It was just born, it is a ___.',
     f:{k:'a small person',fn:'grows up',ak:'sleeps and cries',o:'in a pram, in your arms',as:'nappy, bottle',e:'tiny, soft'}}}
,
/* ---------- Essen & Trinken ---------- */
{id:'apfel',emoji:'🍎',cat:'essen',
 de:{w:'Apfel',a:'der',s:['Ap','fel'],c:'Rot, rund und süß — das ist ein ___.',
     f:{k:'Obst',fn:'zum Essen',ak:'er wächst am Baum',o:'im Obstkorb, im Garten',as:'Birne, Saft, Baum',e:'rot oder grün, rund, knackig'}},
 en:{w:'apple',a:'an',s:['ap','ple'],c:'Red, round and sweet — that is an ___.',
     f:{k:'fruit',fn:'for eating',ak:'grows on a tree',o:'fruit bowl, garden',as:'pear, juice, tree',e:'red or green, round, crunchy'}}},

{id:'brot',emoji:'🍞',cat:'essen',
 de:{w:'Brot',a:'das',s:['Brot'],c:'Zum Frühstück esse ich ein Butter___.',r:'rot',
     f:{k:'ein Lebensmittel',fn:'zum Essen, macht satt',ak:'man schneidet es',o:'beim Bäcker, in der Küche',as:'Butter, Messer, Bäcker',e:'braune Kruste, weich innen'}},
 en:{w:'bread',a:'the',s:['bread'],c:'For breakfast I eat butter and ___.',r:'red',
     f:{k:'a food',fn:'for eating, fills you up',ak:'you slice it',o:'bakery, kitchen',as:'butter, knife, baker',e:'brown crust, soft inside'}}},

{id:'kaffee',emoji:'☕',cat:'essen',
 de:{w:'Kaffee',a:'der',s:['Kaf','fee'],c:'Morgens trinke ich eine Tasse ___.',
     f:{k:'ein Getränk',fn:'macht wach',ak:'er dampft',o:'in der Tasse, im Café',as:'Milch, Zucker, Morgen',e:'heiß, braun, bitter'}},
 en:{w:'coffee',a:'the',s:['cof','fee'],c:'In the morning I drink a cup of ___.',
     f:{k:'a drink',fn:'wakes you up',ak:'it steams',o:'in a cup, in a café',as:'milk, sugar, morning',e:'hot, brown, bitter'}}},

{id:'suppe',emoji:'🍲',cat:'essen',
 de:{w:'Suppe',a:'die',s:['Sup','pe'],c:'Mit dem Löffel esse ich eine warme ___.',
     f:{k:'ein Essen',fn:'zum Essen, wärmt',ak:'sie dampft',o:'im Teller, im Topf',as:'Löffel, Erkältung',e:'heiß, flüssig, salzig'}},
 en:{w:'soup',a:'the',s:['soup'],c:'With a spoon I eat warm ___.',r:'group',
     f:{k:'a dish',fn:'for eating, warms you',ak:'it steams',o:'in a bowl, in a pot',as:'spoon, cold weather',e:'hot, liquid, salty'}}},

{id:'kaese',emoji:'🧀',cat:'essen',
 de:{w:'Käse',a:'der',s:['Kä','se'],c:'Auf das Brot lege ich ___.',
     f:{k:'ein Milchprodukt',fn:'zum Essen',ak:'man schneidet ihn',o:'im Kühlschrank',as:'Milch, Brot, Maus',e:'gelb, fest, würzig'}},
 en:{w:'cheese',a:'the',s:['cheese'],c:'On my bread I put ___.',r:'keys',
     f:{k:'a dairy food',fn:'for eating',ak:'you slice it',o:'in the fridge',as:'milk, bread, mouse',e:'yellow, firm, savoury'}}},

{id:'banane',emoji:'🍌',cat:'essen',
 de:{w:'Banane',a:'die',s:['Ba','na','ne'],c:'Gelb und krumm — das ist eine ___.',
     f:{k:'Obst',fn:'zum Essen',ak:'man schält sie',o:'im Obstkorb',as:'Affe, Schale',e:'gelb, krumm, weich'}},
 en:{w:'banana',a:'a',s:['ba','na','na'],c:'Yellow and curved — that is a ___.',
     f:{k:'fruit',fn:'for eating',ak:'you peel it',o:'fruit bowl',as:'monkey, peel',e:'yellow, curved, soft'}}},

{id:'ei',emoji:'🥚',cat:'essen',
 de:{w:'Ei',a:'das',s:['Ei'],c:'Zum Frühstück koche ich ein ___.',r:'drei',
     f:{k:'ein Lebensmittel',fn:'zum Essen und Backen',ak:'man kocht es',o:'im Kühlschrank, im Nest',as:'Huhn, Ostern, Pfanne',e:'oval, weiß, zerbrechlich'}},
 en:{w:'egg',a:'an',s:['egg'],c:'For breakfast I boil an ___.',r:'leg',
     f:{k:'a food',fn:'for eating and baking',ak:'you boil it',o:'fridge, nest',as:'hen, Easter, pan',e:'oval, white, fragile'}}},

{id:'schokolade',emoji:'🍫',cat:'essen',
 de:{w:'Schokolade',a:'die',s:['Scho','ko','la','de'],c:'Süß und braun, sie schmilzt im Mund: ___.',
     f:{k:'eine Süßigkeit',fn:'zum Naschen',ak:'sie schmilzt',o:'im Schrank, im Supermarkt',as:'Kakao, Geschenk',e:'braun, süß, weich'}},
 en:{w:'chocolate',a:'the',s:['choc','o','late'],c:'Sweet and brown, it melts in your mouth: ___.',
     f:{k:'a sweet',fn:'for a treat',ak:'it melts',o:'cupboard, supermarket',as:'cocoa, gift',e:'brown, sweet, soft'}}},

{id:'kartoffel',emoji:'🥔',cat:'essen',
 de:{w:'Kartoffel',a:'die',s:['Kar','tof','fel'],c:'Aus der Erde kommt die ___.',
     f:{k:'ein Gemüse',fn:'zum Kochen und Essen',ak:'sie wächst in der Erde',o:'im Feld, im Keller',as:'Pommes, Salz, Acker',e:'braun, rund, fest'}},
 en:{w:'potato',a:'a',s:['po','ta','to'],c:'It comes out of the soil: the ___.',
     f:{k:'a vegetable',fn:'for cooking and eating',ak:'it grows underground',o:'field, cellar',as:'chips, salt, farm',e:'brown, round, firm'}}},

{id:'salz',emoji:'🧂',cat:'essen',
 de:{w:'Salz',a:'das',s:['Salz'],c:'Die Suppe schmeckt fad, sie braucht ___.',
     f:{k:'ein Gewürz',fn:'zum Würzen',ak:'man streut es',o:'auf dem Tisch, in der Küche',as:'Pfeffer, Meer',e:'weiß, körnig, salzig'}},
 en:{w:'salt',a:'the',s:['salt'],c:'The soup is bland, it needs ___.',
     f:{k:'a seasoning',fn:'for seasoning',ak:'you sprinkle it',o:'on the table, in the kitchen',as:'pepper, sea',e:'white, grainy, salty'}}},

/* ---------- Küche & Geschirr ---------- */
{id:'tasse',emoji:'🍵',cat:'kueche',
 de:{w:'Tasse',a:'die',s:['Tas','se'],c:'Den Tee trinke ich aus der ___.',
     f:{k:'ein Geschirr',fn:'zum Trinken',ak:'man hält sie am Henkel',o:'im Schrank, auf dem Tisch',as:'Tee, Kaffee, Untertasse',e:'aus Porzellan, hat einen Henkel'}},
 en:{w:'cup',a:'a',s:['cup'],c:'I drink my tea from a ___.',
     f:{k:'tableware',fn:'for drinking',ak:'you hold it by the handle',o:'cupboard, table',as:'tea, coffee, saucer',e:'ceramic, has a handle'}}},

{id:'loeffel',emoji:'🥄',cat:'kueche',
 de:{w:'Löffel',a:'der',s:['Löf','fel'],c:'Die Suppe esse ich mit dem ___.',
     f:{k:'ein Besteck',fn:'zum Essen von Suppe',ak:'man schöpft damit',o:'in der Schublade',as:'Gabel, Messer, Suppe',e:'aus Metall, rund vorne'}},
 en:{w:'spoon',a:'a',s:['spoon'],c:'I eat the soup with a ___.',r:'moon',
     f:{k:'cutlery',fn:'for eating soup',ak:'you scoop with it',o:'in the drawer',as:'fork, knife, soup',e:'metal, round at the end'}}},

{id:'messer',emoji:'🔪',cat:'kueche',
 de:{w:'Messer',a:'das',s:['Mes','ser'],c:'Das Brot schneide ich mit dem ___.',
     f:{k:'ein Besteck',fn:'zum Schneiden',ak:'es schneidet',o:'in der Küche, in der Schublade',as:'Gabel, Brot',e:'scharf, aus Metall'}},
 en:{w:'knife',a:'a',s:['knife'],c:'I cut the bread with a ___.',r:'life',
     f:{k:'cutlery',fn:'for cutting',ak:'it cuts',o:'kitchen, drawer',as:'fork, bread',e:'sharp, metal'}}},

{id:'teller',emoji:'🍽️',cat:'kueche',
 de:{w:'Teller',a:'der',s:['Tel','ler'],c:'Das Essen liegt auf dem ___.',
     f:{k:'ein Geschirr',fn:'zum Essen servieren',ak:'man stellt ihn hin',o:'auf dem Tisch, im Schrank',as:'Gabel, Essen',e:'rund, flach, weiß'}},
 en:{w:'plate',a:'a',s:['plate'],c:'The food is on the ___.',r:'gate',
     f:{k:'tableware',fn:'for serving food',ak:'you set it down',o:'table, cupboard',as:'fork, food',e:'round, flat, white'}}},

{id:'topf',emoji:'🍳',cat:'kueche',
 de:{w:'Topf',a:'der',s:['Topf'],c:'Die Nudeln koche ich im ___.',r:'Kopf',
     f:{k:'ein Küchengerät',fn:'zum Kochen',ak:'er steht auf dem Herd',o:'in der Küche',as:'Herd, Deckel, Wasser',e:'aus Metall, rund, heiß'}},
 en:{w:'pot',a:'a',s:['pot'],c:'I cook the pasta in a ___.',r:'hot',
     f:{k:'a kitchen tool',fn:'for cooking',ak:'it sits on the stove',o:'kitchen',as:'stove, lid, water',e:'metal, round, hot'}}},

{id:'kuehlschrank',emoji:'🧊',cat:'kueche',
 de:{w:'Kühlschrank',a:'der',s:['Kühl','schrank'],c:'Die Milch stelle ich in den ___.',
     f:{k:'ein Gerät',fn:'hält Essen kalt',ak:'er brummt',o:'in der Küche',as:'Milch, Eis, Strom',e:'groß, weiß, kalt'}},
 en:{w:'fridge',a:'the',s:['fridge'],c:'I put the milk in the ___.',
     f:{k:'an appliance',fn:'keeps food cold',ak:'it hums',o:'kitchen',as:'milk, ice, electricity',e:'big, white, cold'}}}
,
/* ---------- Haus & Wohnen ---------- */
{id:'haus',emoji:'🏠',cat:'haus',
 de:{w:'Haus',a:'das',s:['Haus'],c:'Ich schließe die Tür auf und gehe ins ___.',r:'Maus',
     f:{k:'ein Gebäude',fn:'zum Wohnen',ak:'es steht fest',o:'in der Straße, im Dorf',as:'Tür, Dach, Familie',e:'groß, hat Fenster'}},
 en:{w:'house',a:'a',s:['house'],c:'I unlock the door and go into the ___.',r:'mouse',
     f:{k:'a building',fn:'for living in',ak:'it stands',o:'on a street, in a village',as:'door, roof, family',e:'big, has windows'}}},

{id:'tuer',emoji:'🚪',cat:'haus',
 de:{w:'Tür',a:'die',s:['Tür'],c:'Es klingelt, ich öffne die ___.',
     f:{k:'ein Teil vom Haus',fn:'zum Hineingehen',ak:'sie öffnet und schließt',o:'am Eingang, im Flur',as:'Schlüssel, Klingel',e:'aus Holz, hat eine Klinke'}},
 en:{w:'door',a:'the',s:['door'],c:'The bell rings, I open the ___.',r:'floor',
     f:{k:'part of a house',fn:'for going in',ak:'it opens and closes',o:'entrance, hallway',as:'key, doorbell',e:'wooden, has a handle'}}},

{id:'fenster',emoji:'🪟',cat:'haus',
 de:{w:'Fenster',a:'das',s:['Fens','ter'],c:'Es ist stickig, ich öffne das ___.',
     f:{k:'ein Teil vom Haus',fn:'für Licht und Luft',ak:'man schaut hindurch',o:'in der Wand',as:'Glas, Aussicht, Vorhang',e:'aus Glas, durchsichtig'}},
 en:{w:'window',a:'the',s:['win','dow'],c:'The room is stuffy, I open the ___.',
     f:{k:'part of a house',fn:'for light and air',ak:'you look through it',o:'in the wall',as:'glass, view, curtain',e:'glass, see-through'}}},

{id:'stuhl',emoji:'🪑',cat:'haus',
 de:{w:'Stuhl',a:'der',s:['Stuhl'],c:'Ich setze mich auf den ___.',
     f:{k:'ein Möbelstück',fn:'zum Sitzen',ak:'man setzt sich darauf',o:'am Tisch, in der Küche',as:'Tisch, Sitzen',e:'aus Holz, hat vier Beine'}},
 en:{w:'chair',a:'a',s:['chair'],c:'I sit down on the ___.',r:'hair',
     f:{k:'furniture',fn:'for sitting',ak:'you sit on it',o:'at the table, kitchen',as:'table, sitting',e:'wooden, four legs'}}},

{id:'lampe',emoji:'💡',cat:'haus',
 de:{w:'Lampe',a:'die',s:['Lam','pe'],c:'Es wird dunkel, ich schalte die ___ an.',
     f:{k:'ein Gerät',fn:'macht Licht',ak:'sie leuchtet',o:'an der Decke, auf dem Tisch',as:'Strom, Dunkelheit',e:'hell, warm'}},
 en:{w:'lamp',a:'the',s:['lamp'],c:'It is getting dark, I switch on the ___.',
     f:{k:'a device',fn:'makes light',ak:'it shines',o:'ceiling, table',as:'electricity, darkness',e:'bright, warm'}}},

{id:'schluessel',emoji:'🔑',cat:'haus',
 de:{w:'Schlüssel',a:'der',s:['Schlüs','sel'],c:'Ich schließe die Tür auf mit dem ___.',
     f:{k:'ein Gegenstand',fn:'zum Auf- und Zuschließen',ak:'man dreht ihn',o:'in der Tasche, im Schloss',as:'Tür, Schloss',e:'klein, aus Metall'}},
 en:{w:'key',a:'the',s:['key'],c:'I unlock the door with the ___.',r:'tea',
     f:{k:'an object',fn:'for locking and unlocking',ak:'you turn it',o:'pocket, lock',as:'door, lock',e:'small, metal'}}},

{id:'uhr',emoji:'⏰',cat:'haus',
 de:{w:'Uhr',a:'die',s:['Uhr'],c:'Wie spät ist es? Ich schaue auf die ___.',
     f:{k:'ein Gerät',fn:'zeigt die Zeit',ak:'sie tickt',o:'an der Wand, am Arm',as:'Zeit, Wecker',e:'rund, hat Zeiger'}},
 en:{w:'clock',a:'the',s:['clock'],c:'What time is it? I look at the ___.',r:'sock',
     f:{k:'a device',fn:'shows the time',ak:'it ticks',o:'on the wall',as:'time, alarm',e:'round, has hands'}}},

{id:'seife',emoji:'🧼',cat:'haus',
 de:{w:'Seife',a:'die',s:['Sei','fe'],c:'Ich wasche die Hände mit Wasser und ___.',
     f:{k:'ein Waschmittel',fn:'zum Waschen',ak:'sie schäumt',o:'am Waschbecken, im Bad',as:'Hände, Schaum',e:'glatt, rutschig, duftet'}},
 en:{w:'soap',a:'the',s:['soap'],c:'I wash my hands with water and ___.',r:'rope',
     f:{k:'a cleaning product',fn:'for washing',ak:'it foams',o:'sink, bathroom',as:'hands, foam',e:'smooth, slippery, scented'}}},

/* ---------- Kleidung ---------- */
{id:'schuh',emoji:'👟',cat:'kleidung',
 de:{w:'Schuh',a:'der',s:['Schuh'],c:'Bevor ich rausgehe, ziehe ich den ___ an.',
     f:{k:'ein Kleidungsstück',fn:'zum Schutz der Füße',ak:'man zieht ihn an',o:'im Flur, am Fuß',as:'Socke, Schnürsenkel',e:'aus Leder, mit Sohle'}},
 en:{w:'shoe',a:'a',s:['shoe'],c:'Before going out I put on my ___.',
     f:{k:'clothing',fn:'protects the feet',ak:'you put it on',o:'hallway, on your foot',as:'sock, laces',e:'leather, has a sole'}}},

{id:'jacke',emoji:'🧥',cat:'kleidung',
 de:{w:'Jacke',a:'die',s:['Ja','cke'],c:'Draußen ist es kalt, ich ziehe eine ___ an.',
     f:{k:'ein Kleidungsstück',fn:'hält warm',ak:'man zieht sie an',o:'an der Garderobe',as:'Winter, Reißverschluss',e:'warm, weich'}},
 en:{w:'jacket',a:'a',s:['jack','et'],c:'It is cold outside, I put on a ___.',
     f:{k:'clothing',fn:'keeps you warm',ak:'you put it on',o:'coat rack',as:'winter, zip',e:'warm, soft'}}},

{id:'hose',emoji:'👖',cat:'kleidung',
 de:{w:'Hose',a:'die',s:['Ho','se'],c:'Über die Beine ziehe ich die ___.',r:'Rose',
     f:{k:'ein Kleidungsstück',fn:'zum Anziehen',ak:'man steigt hinein',o:'im Schrank',as:'Gürtel, Beine',e:'blau, aus Stoff'}},
 en:{w:'trousers',a:'the',s:['trou','sers'],c:'I pull the ___ over my legs.',
     f:{k:'clothing',fn:'for wearing',ak:'you step into them',o:'wardrobe',as:'belt, legs',e:'blue, made of cloth'}}},

{id:'hut',emoji:'🎩',cat:'kleidung',
 de:{w:'Hut',a:'der',s:['Hut'],c:'Gegen die Sonne trage ich einen ___.',r:'gut',
     f:{k:'ein Kleidungsstück',fn:'schützt den Kopf',ak:'man setzt ihn auf',o:'auf dem Kopf, an der Garderobe',as:'Sonne, Kopf',e:'rund, mit Rand'}},
 en:{w:'hat',a:'a',s:['hat'],c:'Against the sun I wear a ___.',r:'cat',
     f:{k:'clothing',fn:'protects the head',ak:'you put it on',o:'on your head, coat rack',as:'sun, head',e:'round, has a brim'}}},

{id:'socke',emoji:'🧦',cat:'kleidung',
 de:{w:'Socke',a:'die',s:['So','cke'],c:'In den Schuh kommt zuerst die ___.',r:'Glocke',
     f:{k:'ein Kleidungsstück',fn:'hält die Füße warm',ak:'man zieht sie an',o:'in der Schublade, am Fuß',as:'Schuh, Fuß, Wolle',e:'weich, gestrickt'}},
 en:{w:'sock',a:'a',s:['sock'],c:'The ___ goes on before the shoe.',r:'clock',
     f:{k:'clothing',fn:'keeps feet warm',ak:'you pull it on',o:'drawer, on your foot',as:'shoe, foot, wool',e:'soft, knitted'}}}
,
/* ---------- Tiere ---------- */
{id:'hund',emoji:'🐕',cat:'tiere',
 de:{w:'Hund',a:'der',s:['Hund'],c:'Er bellt und wedelt mit dem Schwanz: der ___.',r:'Mund',
     f:{k:'ein Tier',fn:'ein Haustier, ein Begleiter',ak:'er bellt und läuft',o:'zu Hause, im Park',as:'Leine, Katze, Knochen',e:'treu, hat ein Fell'}},
 en:{w:'dog',a:'a',s:['dog'],c:'It barks and wags its tail: the ___.',r:'fog',
     f:{k:'an animal',fn:'a pet, a companion',ak:'barks and runs',o:'at home, in the park',as:'lead, cat, bone',e:'loyal, furry'}}},

{id:'katze',emoji:'🐈',cat:'tiere',
 de:{w:'Katze',a:'die',s:['Kat','ze'],c:'Sie schnurrt auf dem Sofa: die ___.',r:'Tatze',
     f:{k:'ein Tier',fn:'ein Haustier',ak:'sie schnurrt und schleicht',o:'zu Hause, im Garten',as:'Maus, Hund, Milch',e:'weich, leise'}},
 en:{w:'cat',a:'a',s:['cat'],c:'It purrs on the sofa: the ___.',r:'hat',
     f:{k:'an animal',fn:'a pet',ak:'purrs and prowls',o:'at home, garden',as:'mouse, dog, milk',e:'soft, quiet'}}},

{id:'vogel',emoji:'🐦',cat:'tiere',
 de:{w:'Vogel',a:'der',s:['Vo','gel'],c:'Er singt im Baum und fliegt weg: der ___.',
     f:{k:'ein Tier',fn:'er fliegt und singt',ak:'er fliegt',o:'im Baum, am Himmel',as:'Nest, Feder, Ei',e:'klein, leicht, bunt'}},
 en:{w:'bird',a:'a',s:['bird'],c:'It sings in the tree and flies away: the ___.',r:'word',
     f:{k:'an animal',fn:'it flies and sings',ak:'it flies',o:'tree, sky',as:'nest, feather, egg',e:'small, light, colourful'}}},

{id:'pferd',emoji:'🐴',cat:'tiere',
 de:{w:'Pferd',a:'das',s:['Pferd'],c:'Auf dem Hof reite ich auf dem ___.',
     f:{k:'ein Tier',fn:'zum Reiten',ak:'es galoppiert',o:'auf der Wiese, im Stall',as:'Sattel, Reiten, Heu',e:'groß, stark, braun'}},
 en:{w:'horse',a:'a',s:['horse'],c:'At the farm I ride the ___.',
     f:{k:'an animal',fn:'for riding',ak:'it gallops',o:'meadow, stable',as:'saddle, riding, hay',e:'big, strong, brown'}}},

{id:'fisch',emoji:'🐟',cat:'tiere',
 de:{w:'Fisch',a:'der',s:['Fisch'],c:'Er schwimmt im Wasser: der ___.',r:'Tisch',
     f:{k:'ein Tier',fn:'er lebt im Wasser',ak:'er schwimmt',o:'im Meer, im Aquarium',as:'Wasser, Angel, Schuppen',e:'glatt, nass, glitzernd'}},
 en:{w:'fish',a:'a',s:['fish'],c:'It swims in the water: the ___.',r:'dish',
     f:{k:'an animal',fn:'lives in water',ak:'it swims',o:'sea, aquarium',as:'water, fishing rod, scales',e:'smooth, wet, shiny'}}},

/* ---------- Natur & Wetter ---------- */
{id:'baum',emoji:'🌳',cat:'natur',
 de:{w:'Baum',a:'der',s:['Baum'],c:'Im Wald steht ein hoher ___.',r:'Traum',
     f:{k:'eine Pflanze',fn:'spendet Schatten, gibt Holz',ak:'er wächst',o:'im Wald, im Garten',as:'Blatt, Vogel, Apfel',e:'hoch, grün, aus Holz'}},
 en:{w:'tree',a:'a',s:['tree'],c:'In the forest there is a tall ___.',r:'free',
     f:{k:'a plant',fn:'gives shade and wood',ak:'it grows',o:'forest, garden',as:'leaf, bird, apple',e:'tall, green, wooden'}}},

{id:'blume',emoji:'🌷',cat:'natur',
 de:{w:'Blume',a:'die',s:['Blu','me'],c:'Zum Geburtstag schenke ich dir eine ___.',
     f:{k:'eine Pflanze',fn:'zum Schenken, zur Freude',ak:'sie blüht und duftet',o:'im Garten, in der Vase',as:'Vase, Duft, Geschenk',e:'bunt, zart, duftend'}},
 en:{w:'flower',a:'a',s:['flow','er'],c:'For your birthday I give you a ___.',
     f:{k:'a plant',fn:'a gift, a joy',ak:'it blooms and smells',o:'garden, vase',as:'vase, scent, gift',e:'colourful, delicate, fragrant'}}},

{id:'sonne',emoji:'☀️',cat:'natur',
 de:{w:'Sonne',a:'die',s:['Son','ne'],c:'Am Himmel scheint hell die ___.',r:'Tonne',
     f:{k:'am Himmel',fn:'gibt Licht und Wärme',ak:'sie scheint',o:'am Himmel',as:'Sommer, Wärme, Schatten',e:'hell, gelb, heiß'}},
 en:{w:'sun',a:'the',s:['sun'],c:'In the sky shines the bright ___.',r:'fun',
     f:{k:'in the sky',fn:'gives light and warmth',ak:'it shines',o:'in the sky',as:'summer, warmth, shade',e:'bright, yellow, hot'}}},

{id:'regen',emoji:'🌧️',cat:'natur',
 de:{w:'Regen',a:'der',s:['Re','gen'],c:'Nimm den Schirm mit, draußen ist ___.',
     f:{k:'ein Wetter',fn:'gibt den Pflanzen Wasser',ak:'er fällt und tropft',o:'draußen, am Himmel',as:'Schirm, Wolke, Pfütze',e:'nass, kühl, grau'}},
 en:{w:'rain',a:'the',s:['rain'],c:'Take the umbrella, outside there is ___.',r:'train',
     f:{k:'weather',fn:'waters the plants',ak:'it falls and drips',o:'outside, from the sky',as:'umbrella, cloud, puddle',e:'wet, cool, grey'}}},

{id:'schnee',emoji:'❄️',cat:'natur',
 de:{w:'Schnee',a:'der',s:['Schnee'],c:'Im Winter liegt weißer ___.',r:'See',
     f:{k:'ein Wetter',fn:'man kann darin rodeln',ak:'er fällt und schmilzt',o:'draußen, im Winter',as:'Winter, Schlitten, kalt',e:'weiß, kalt, weich'}},
 en:{w:'snow',a:'the',s:['snow'],c:'In winter there is white ___.',r:'slow',
     f:{k:'weather',fn:'you can sledge on it',ak:'it falls and melts',o:'outside, in winter',as:'winter, sledge, cold',e:'white, cold, soft'}}},

/* ---------- Verkehr & Unterwegs ---------- */
{id:'auto',emoji:'🚗',cat:'verkehr',
 de:{w:'Auto',a:'das',s:['Au','to'],c:'Ich steige ein und fahre mit dem ___.',
     f:{k:'ein Fahrzeug',fn:'zum Fahren',ak:'es fährt und hupt',o:'auf der Straße, in der Garage',as:'Schlüssel, Benzin, Rad',e:'schnell, aus Metall'}},
 en:{w:'car',a:'a',s:['car'],c:'I get in and drive the ___.',r:'star',
     f:{k:'a vehicle',fn:'for driving',ak:'it drives and honks',o:'road, garage',as:'key, petrol, wheel',e:'fast, metal'}}},

{id:'zug',emoji:'🚆',cat:'verkehr',
 de:{w:'Zug',a:'der',s:['Zug'],c:'Am Bahnhof warte ich auf den ___.',
     f:{k:'ein Fahrzeug',fn:'bringt viele Menschen weit',ak:'er fährt auf Schienen',o:'am Bahnhof, auf den Gleisen',as:'Bahnhof, Fahrkarte',e:'lang, schnell'}},
 en:{w:'train',a:'the',s:['train'],c:'At the station I wait for the ___.',r:'rain',
     f:{k:'a vehicle',fn:'carries many people far',ak:'it runs on rails',o:'station, tracks',as:'station, ticket',e:'long, fast'}}},

{id:'fahrrad',emoji:'🚲',cat:'verkehr',
 de:{w:'Fahrrad',a:'das',s:['Fahr','rad'],c:'Ich trete in die Pedale und fahre ___.',
     f:{k:'ein Fahrzeug',fn:'zum Fahren ohne Motor',ak:'man tritt in die Pedale',o:'auf dem Radweg, im Keller',as:'Helm, Kette, Rad',e:'leicht, zwei Räder'}},
 en:{w:'bicycle',a:'a',s:['bi','cy','cle'],c:'I push the pedals and ride my ___.',
     f:{k:'a vehicle',fn:'travel without a motor',ak:'you pedal it',o:'cycle path, cellar',as:'helmet, chain, wheel',e:'light, two wheels'}}},

{id:'strasse',emoji:'🛣️',cat:'verkehr',
 de:{w:'Straße',a:'die',s:['Stra','ße'],c:'Schau nach links und rechts, dann über die ___.',
     f:{k:'ein Weg',fn:'darauf fahren die Autos',ak:'sie führt irgendwohin',o:'in der Stadt, im Dorf',as:'Ampel, Zebrastreifen',e:'lang, grau, hart'}},
 en:{w:'street',a:'the',s:['street'],c:'Look left and right, then cross the ___.',r:'sweet',
     f:{k:'a path',fn:'cars drive on it',ak:'it leads somewhere',o:'town, village',as:'traffic light, crossing',e:'long, grey, hard'}}},

/* ---------- Freizeit ---------- */
{id:'musik',emoji:'🎵',cat:'freizeit',
 de:{w:'Musik',a:'die',s:['Mu','sik'],c:'Ich schalte das Radio an und höre ___.',
     f:{k:'etwas zum Hören',fn:'macht Freude, entspannt',ak:'sie klingt',o:'im Radio, im Konzert',as:'Lied, Tanzen, Radio',e:'laut oder leise, schön'}},
 en:{w:'music',a:'the',s:['mu','sic'],c:'I turn on the radio and listen to ___.',
     f:{k:'something to hear',fn:'brings joy, relaxes',ak:'it sounds',o:'radio, concert',as:'song, dancing, radio',e:'loud or soft, beautiful'}}},

{id:'garten',emoji:'🌻',cat:'freizeit',
 de:{w:'Garten',a:'der',s:['Gar','ten'],c:'Hinter dem Haus liegt der ___.',
     f:{k:'ein Ort',fn:'zum Pflanzen und Sitzen',ak:'dort wächst alles',o:'hinter dem Haus',as:'Blume, Rasen, Gießkanne',e:'grün, ruhig'}},
 en:{w:'garden',a:'the',s:['gar','den'],c:'Behind the house is the ___.',
     f:{k:'a place',fn:'for planting and sitting',ak:'things grow there',o:'behind the house',as:'flower, lawn, watering can',e:'green, quiet'}}},

{id:'foto',emoji:'📷',cat:'freizeit',
 de:{w:'Foto',a:'das',s:['Fo','to'],c:'Zur Erinnerung mache ich ein ___.',
     f:{k:'ein Bild',fn:'hält Erinnerungen fest',ak:'man macht es',o:'im Album, am Handy',as:'Kamera, Erinnerung',e:'flach, bunt'}},
 en:{w:'photo',a:'a',s:['pho','to'],c:'To remember it I take a ___.',
     f:{k:'a picture',fn:'keeps memories',ak:'you take it',o:'album, phone',as:'camera, memory',e:'flat, colourful'}}},

{id:'brief',emoji:'✉️',cat:'freizeit',
 de:{w:'Brief',a:'der',s:['Brief'],c:'Ich klebe die Marke auf den ___.',
     f:{k:'eine Nachricht',fn:'zum Schreiben an jemanden',ak:'man schickt ihn',o:'im Briefkasten, bei der Post',as:'Marke, Post, Umschlag',e:'aus Papier, gefaltet'}},
 en:{w:'letter',a:'a',s:['let','ter'],c:'I stick the stamp on the ___.',
     f:{k:'a message',fn:'for writing to someone',ak:'you send it',o:'postbox, post office',as:'stamp, post, envelope',e:'paper, folded'}}},

{id:'geld',emoji:'💶',cat:'freizeit',
 de:{w:'Geld',a:'das',s:['Geld'],c:'An der Kasse bezahle ich mit ___.',r:'Held',
     f:{k:'ein Zahlungsmittel',fn:'zum Bezahlen',ak:'man gibt es aus',o:'im Portemonnaie, in der Bank',as:'Kasse, Bank, Einkauf',e:'aus Papier oder Metall'}},
 en:{w:'money',a:'the',s:['mo','ney'],c:'At the till I pay with ___.',r:'honey',
     f:{k:'means of payment',fn:'for paying',ak:'you spend it',o:'wallet, bank',as:'till, bank, shopping',e:'paper or metal'}}},

{id:'zeitung',emoji:'📰',cat:'freizeit',
 de:{w:'Zeitung',a:'die',s:['Zei','tung'],c:'Beim Kaffee lese ich die ___.',
     f:{k:'etwas zum Lesen',fn:'zeigt die Nachrichten',ak:'man blättert darin',o:'am Kiosk, auf dem Tisch',as:'Nachrichten, Kaffee',e:'groß, aus Papier'}},
 en:{w:'newspaper',a:'the',s:['news','pa','per'],c:'With my coffee I read the ___.',
     f:{k:'something to read',fn:'shows the news',ak:'you turn its pages',o:'kiosk, table',as:'news, coffee',e:'large, made of paper'}}}
];
