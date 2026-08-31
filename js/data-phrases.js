/* Everyday phrases for script practice.
 * Rationale: Big CACTUS found word-finding gains do NOT transfer to conversation
 * on their own, so functional phrases are a first-class exercise, not an extra.
 * `p` = phrase split into rhythmic chunks. Chunking supports the rhythm/pitch
 * mechanism that carries the generalisation effect in Melodic Intonation Therapy.
 */
window.PHRASES = [
 {id:'p_hallo',grp:'sozial',de:{t:'Hallo, schön dich zu sehen.',p:['Hallo,','schön dich','zu sehen.']},
                             en:{t:'Hello, good to see you.',p:['Hello,','good to','see you.']}},
 {id:'p_gut',grp:'sozial',de:{t:'Mir geht es heute gut.',p:['Mir geht es','heute','gut.']},
                          en:{t:'I am doing well today.',p:['I am doing','well','today.']}},
 {id:'p_muede',grp:'sozial',de:{t:'Ich bin heute müde.',p:['Ich bin','heute','müde.']},
                            en:{t:'I am tired today.',p:['I am','tired','today.']}},
 {id:'p_danke',grp:'sozial',de:{t:'Danke, das ist lieb von dir.',p:['Danke,','das ist lieb','von dir.']},
                            en:{t:'Thank you, that is kind of you.',p:['Thank you,','that is kind','of you.']}},
 {id:'p_langsam',grp:'sozial',de:{t:'Bitte sprich langsamer.',p:['Bitte','sprich','langsamer.']},
                              en:{t:'Please speak more slowly.',p:['Please','speak','more slowly.']}},
 {id:'p_moment',grp:'sozial',de:{t:'Einen Moment, ich suche das Wort.',p:['Einen Moment,','ich suche','das Wort.']},
                             en:{t:'One moment, I am looking for the word.',p:['One moment,','I am looking for','the word.']}},
 {id:'p_nochmal',grp:'sozial',de:{t:'Kannst du das noch einmal sagen?',p:['Kannst du das','noch einmal','sagen?']},
                              en:{t:'Could you say that again?',p:['Could you','say that','again?']}},
 {id:'p_verstehe',grp:'sozial',de:{t:'Ich habe dich verstanden.',p:['Ich habe dich','verstanden.']},
                               en:{t:'I understood you.',p:['I','understood','you.']}},

 {id:'p_durst',grp:'grundbedarf',de:{t:'Ich habe Durst. Bitte ein Glas Wasser.',p:['Ich habe','Durst.','Bitte ein Glas','Wasser.']},
                                 en:{t:'I am thirsty. A glass of water, please.',p:['I am','thirsty.','A glass of water,','please.']}},
 {id:'p_hunger',grp:'grundbedarf',de:{t:'Ich habe Hunger.',p:['Ich habe','Hunger.']},
                                  en:{t:'I am hungry.',p:['I am','hungry.']}},
 {id:'p_toilette',grp:'grundbedarf',de:{t:'Ich muss zur Toilette.',p:['Ich muss','zur','Toilette.']},
                                    en:{t:'I need the toilet.',p:['I need','the','toilet.']}},
 {id:'p_kalt',grp:'grundbedarf',de:{t:'Mir ist kalt. Bitte eine Decke.',p:['Mir ist','kalt.','Bitte eine','Decke.']},
                                en:{t:'I am cold. A blanket, please.',p:['I am','cold.','A blanket,','please.']}},
 {id:'p_pause',grp:'grundbedarf',de:{t:'Ich brauche eine Pause.',p:['Ich brauche','eine','Pause.']},
                                 en:{t:'I need a break.',p:['I need','a','break.']}},
 {id:'p_hilfe',grp:'grundbedarf',de:{t:'Kannst du mir bitte helfen?',p:['Kannst du mir','bitte','helfen?']},
                                 en:{t:'Could you help me, please?',p:['Could you','help me,','please?']}},

 {id:'p_schmerz',grp:'klinik',de:{t:'Ich habe Schmerzen im Kopf.',p:['Ich habe','Schmerzen','im Kopf.']},
                              en:{t:'I have pain in my head.',p:['I have','pain','in my head.']}},
 {id:'p_besser',grp:'klinik',de:{t:'Heute geht es mir besser als gestern.',p:['Heute geht es mir','besser','als gestern.']},
                             en:{t:'Today I feel better than yesterday.',p:['Today I feel','better','than yesterday.']}},
 {id:'p_arzt',grp:'klinik',de:{t:'Ich möchte mit der Ärztin sprechen.',p:['Ich möchte','mit der Ärztin','sprechen.']},
                           en:{t:'I would like to speak to the doctor.',p:['I would like','to speak','to the doctor.']}},
 {id:'p_tablette',grp:'klinik',de:{t:'Wann bekomme ich meine Tablette?',p:['Wann bekomme ich','meine','Tablette?']},
                               en:{t:'When do I get my tablet?',p:['When do I get','my','tablet?']}},
 {id:'p_aufstehen',grp:'klinik',de:{t:'Ich möchte gern aufstehen.',p:['Ich möchte','gern','aufstehen.']},
                                en:{t:'I would like to get up.',p:['I would like','to','get up.']}},
 {id:'p_therapie',grp:'klinik',de:{t:'Wann ist die nächste Therapie?',p:['Wann ist','die nächste','Therapie?']},
                               en:{t:'When is the next therapy session?',p:['When is','the next','therapy session?']}},

 {id:'p_liebe',grp:'familie',de:{t:'Ich hab dich lieb.',p:['Ich hab','dich','lieb.']},
                             en:{t:'I love you.',p:['I','love','you.']}},
 {id:'p_bleib',grp:'familie',de:{t:'Bitte bleib noch ein bisschen.',p:['Bitte bleib','noch ein','bisschen.']},
                             en:{t:'Please stay a little longer.',p:['Please stay','a little','longer.']}},
 {id:'p_anruf',grp:'familie',de:{t:'Ich rufe dich später an.',p:['Ich rufe dich','später','an.']},
                             en:{t:'I will call you later.',p:['I will call you','later.']}},
 {id:'p_besuch',grp:'familie',de:{t:'Danke, dass du mich besuchst.',p:['Danke,','dass du mich','besuchst.']},
                              en:{t:'Thank you for visiting me.',p:['Thank you','for visiting','me.']}},
 {id:'p_morgen',grp:'familie',de:{t:'Bis morgen, schlaf gut.',p:['Bis morgen,','schlaf','gut.']},
                              en:{t:'See you tomorrow, sleep well.',p:['See you tomorrow,','sleep','well.']}},

 {id:'p_kaffee',grp:'unterwegs',de:{t:'Einen Kaffee, bitte.',p:['Einen','Kaffee,','bitte.']},
                                en:{t:'A coffee, please.',p:['A','coffee,','please.']}},
 {id:'p_zahlen',grp:'unterwegs',de:{t:'Ich möchte bitte zahlen.',p:['Ich möchte','bitte','zahlen.']},
                                en:{t:'I would like to pay, please.',p:['I would like','to pay,','please.']}},
 {id:'p_weg',grp:'unterwegs',de:{t:'Entschuldigung, wo ist der Ausgang?',p:['Entschuldigung,','wo ist','der Ausgang?']},
                             en:{t:'Excuse me, where is the exit?',p:['Excuse me,','where is','the exit?']}},
 {id:'p_ticket',grp:'unterwegs',de:{t:'Eine Fahrkarte nach Hause, bitte.',p:['Eine Fahrkarte','nach Hause,','bitte.']},
                                en:{t:'A ticket home, please.',p:['A ticket','home,','please.']}},
 {id:'p_wetter',grp:'unterwegs',de:{t:'Heute ist schönes Wetter.',p:['Heute ist','schönes','Wetter.']},
                                en:{t:'The weather is nice today.',p:['The weather is','nice','today.']}}
];

/* Automatic / serial speech. Often preserved in aphasia and a reliable
 * confidence-building warm-up: the sequence itself carries the retrieval. */
window.SERIES = [
 {id:'s_zahlen10',de:{t:'Von 1 bis 10 zählen',items:['eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn']},
                  en:{t:'Count from 1 to 10',items:['one','two','three','four','five','six','seven','eight','nine','ten']}},
 {id:'s_zahlen20',de:{t:'Von 11 bis 20 zählen',items:['elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn','zwanzig']},
                  en:{t:'Count from 11 to 20',items:['eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty']}},
 {id:'s_tage',de:{t:'Die Wochentage',items:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag']},
              en:{t:'The days of the week',items:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']}},
 {id:'s_monate',de:{t:'Die Monate',items:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']},
                en:{t:'The months',items:['January','February','March','April','May','June','July','August','September','October','November','December']}},
 {id:'s_jahreszeiten',de:{t:'Die Jahreszeiten',items:['Frühling','Sommer','Herbst','Winter']},
                      en:{t:'The seasons',items:['spring','summer','autumn','winter']}},
 {id:'s_farben',de:{t:'Die Farben',items:['rot','blau','gelb','grün','schwarz','weiß','braun','orange']},
                en:{t:'The colours',items:['red','blue','yellow','green','black','white','brown','orange']}},
 {id:'s_gruss',de:{t:'Grüße über den Tag',items:['Guten Morgen','Guten Tag','Guten Abend','Gute Nacht']},
               en:{t:'Greetings through the day',items:['Good morning','Good day','Good evening','Good night']}}
];
