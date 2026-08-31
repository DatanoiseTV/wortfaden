/* Communication board (AAC) for when speaking is not working right now.
 *
 * This is not an exercise. It is the thing you hand someone in an ICU bed who
 * needs to say "my head hurts" to a nurse who is three metres away.
 *
 * Structure follows what hospital communication boards actually carry —
 * responses, needs, symptoms and pain, feelings, and the care team — with the
 * yes/no pair first, because establishing a reliable yes/no is step one in
 * every hospital communication protocol.
 *
 * IMPORTANT: aphasia is a language impairment, not an intellectual one. A
 * board that only offers "water / toilet / pain" hands an adult a toddler's
 * vocabulary and takes away everything they actually want to say. So this
 * board carries three more things a needs-grid does not:
 *   - a sentence builder, so utterances can be composed rather than picked
 *   - writing and letter-by-letter spelling, which reaches anything at all
 *   - phrases about agency and dignity ("please talk to me, not about me"),
 *     which is among the most common complaints of people with aphasia.
 *
 * `s` is what gets spoken, `t` what is shown. They differ only where the
 * spoken form needs to be a bit more complete than the label on the tile.
 */
window.BOARD = {
  de: [
    {
      id: 'antwort', title: 'Antworten', icon: '💬',
      items: [
        { e: '👍', t: 'Ja', big: true, tone: 'yes' },
        { e: '👎', t: 'Nein', big: true, tone: 'no' },
        { e: '🤷', t: 'Ich weiß nicht' },
        { e: '✋', t: 'Warte kurz', s: 'Warte bitte kurz.' },
        { e: '🔁', t: 'Nochmal bitte', s: 'Sag das bitte noch einmal.' },
        { e: '🐢', t: 'Langsamer', s: 'Bitte sprich langsamer.' },
        { e: '❓', t: 'Ich verstehe nicht' },
        { e: '✍️', t: 'Bitte aufschreiben', s: 'Kannst du das bitte aufschreiben?' },
        { e: '🙏', t: 'Danke' }
      ]
    },
    {
      id: 'brauche', title: 'Ich brauche', icon: '🙋',
      items: [
        { e: '💧', t: 'Wasser', s: 'Ich möchte etwas trinken.' },
        { e: '🚻', t: 'Toilette', s: 'Ich muss zur Toilette.', chain: 'toilet' },
        { e: '💊', t: 'Schmerzmittel', s: 'Ich brauche etwas gegen die Schmerzen.' },
        { e: '🛏️', t: 'Anders liegen', s: 'Ich möchte anders liegen.' },
        { e: '🧣', t: 'Eine Decke', s: 'Mir ist kalt. Bitte eine Decke.' },
        { e: '💡', t: 'Licht', s: 'Bitte das Licht an oder aus.' },
        { e: '🪟', t: 'Frische Luft', s: 'Bitte das Fenster öffnen.' },
        { e: '👓', t: 'Meine Brille' },
        { e: '📱', t: 'Mein Handy' },
        { e: '🤫', t: 'Ruhe', s: 'Ich möchte etwas Ruhe.' },
        { e: '😴', t: 'Schlafen', s: 'Ich möchte schlafen.' },
        { e: '🪥', t: 'Mund pflegen', s: 'Mein Mund ist trocken.' }
      ]
    },
    {
      id: 'schmerz', title: 'Schmerz', icon: '🤕',
      items: [
        { e: '🤕', t: 'Ich habe Schmerzen', big: true, tone: 'no', chain: 'pain' },
        { e: '🧠', t: 'Kopf', s: 'Mein Kopf tut weh.' },
        { e: '🦴', t: 'Nacken', s: 'Mein Nacken tut weh.' },
        { e: '👁️', t: 'Augen', s: 'Meine Augen tun weh.' },
        { e: '🫁', t: 'Brust', s: 'Meine Brust tut weh.' },
        { e: '🫃', t: 'Bauch', s: 'Mein Bauch tut weh.' },
        { e: '🦵', t: 'Bein', s: 'Mein Bein tut weh.' },
        { e: '💪', t: 'Arm', s: 'Mein Arm tut weh.' },
        { e: '📈', t: 'Schlimmer geworden', s: 'Die Schmerzen sind schlimmer geworden.' },
        { e: '📉', t: 'Besser geworden', s: 'Die Schmerzen sind besser geworden.' }
      ]
    },
    {
      id: 'gefuehl', title: 'Wie es mir geht', icon: '🫀',
      items: [
        { e: '🙂', t: 'Es geht mir gut', tone: 'yes' },
        { e: '😐', t: 'Es geht so' },
        { e: '😢', t: 'Mir geht es schlecht' },
        { e: '😨', t: 'Ich habe Angst' },
        { e: '🤢', t: 'Mir ist übel' },
        { e: '💫', t: 'Mir ist schwindelig' },
        { e: '🥱', t: 'Ich bin müde' },
        { e: '🥶', t: 'Mir ist kalt' },
        { e: '🥵', t: 'Mir ist heiß' },
        { e: '😮‍💨', t: 'Ich bekomme schlecht Luft', tone: 'no' }
      ]
    },
    {
      id: 'naehe', title: 'Nähe', icon: '💛',
      items: [
        { e: '💛', t: 'Ich möchte {p} sehen', s: 'Ich möchte {p} sehen.', big: true, tone: 'yes' },
        { e: '🤍', t: 'Ich vermisse dich' },
        { e: '🫱', t: 'Halt meine Hand', s: 'Halt bitte meine Hand.' },
        { e: '🫂', t: 'Bleib noch da', s: 'Bleib bitte noch ein bisschen.' },
        { e: '💭', t: 'Ich denke an dich' },
        { e: '📷', t: 'Zeig mir ein Foto', s: 'Zeig mir bitte ein Foto.' },
        { e: '🗣️', t: 'Erzähl mir was', s: 'Erzähl mir bitte etwas.' },
        { e: '🙂', t: 'Wie war dein Tag?' },
        { e: '📖', t: 'Lies mir was vor', s: 'Liest du mir etwas vor?' },
        { e: '😌', t: 'Es tut gut, dass du da bist' },
        { e: '🌙', t: 'Schlaf gut' },
        { e: '👋', t: 'Bis morgen' }
      ]
    },
    {
      id: 'tag', title: 'Der Tag', icon: '🌤️',
      items: [
        { e: '🌤️', t: 'Wie ist das Wetter?' },
        { e: '🕐', t: 'Ist es früh oder spät?' },
        { e: '🍽️', t: 'Was gibt es zu essen?' },
        { e: '🪟', t: 'Ich möchte ans Fenster' },
        { e: '🚶', t: 'Ich möchte ein Stück laufen' },
        { e: '🎵', t: 'Ich möchte Musik hören' },
        { e: '📺', t: 'Ich möchte fernsehen' },
        { e: '📰', t: 'Gibt es Neuigkeiten?' },
        { e: '🌱', t: 'Was macht ihr zu Hause?' },
        { e: '☕', t: 'Ich hätte gern einen Kaffee' },
        { e: '🧴', t: 'Ich möchte mich frisch machen' },
        { e: '💇', t: 'Ich möchte mich kämmen' },
        { e: '🧦', t: 'Ich möchte etwas anderes anziehen' },
        { e: '🙂', t: 'Heute war ein guter Moment dabei' }
      ]
    },
    {
      id: 'wichtig', title: 'Wichtig', icon: '❗',
      items: [
        { e: '🧠', t: 'Ich verstehe alles', s: 'Ich verstehe dich. Ich finde nur die Worte nicht.', big: true },
        { e: '👤', t: 'Sprich mit mir', s: 'Bitte sprich mit mir, nicht über mich.' },
        { e: '⏳', t: 'Gib mir Zeit', s: 'Gib mir bitte Zeit. Das Wort kommt gleich.' },
        { e: '🚫', t: 'Nicht vorsagen', s: 'Bitte sag das Wort nicht für mich.' },
        { e: '❓', t: 'Ich habe eine Frage', s: 'Ich habe eine Frage.' },
        { e: '🗯️', t: 'Das ist mir zu viel', s: 'Das ist mir gerade zu viel.' },
        { e: '🕐', t: 'Später besprechen', s: 'Können wir das später besprechen?' },
        { e: '✅', t: 'Ich entscheide das', s: 'Das möchte ich selbst entscheiden.' },
        { e: '📝', t: 'Erklär es mir bitte', s: 'Kannst du mir das bitte erklären?' },
        { e: '🤝', t: 'Ich bin einverstanden' },
        { e: '🙅', t: 'Ich bin nicht einverstanden' }
      ]
    },
    {
      id: 'fragen', title: 'Fragen', icon: '🔍',
      items: [
        { e: '🕐', t: 'Wie spät ist es?' },
        { e: '📅', t: 'Welcher Tag ist heute?' },
        { e: '🩺', t: 'Wann kommt die Visite?' },
        { e: '🗣️', t: 'Wann ist die Therapie?' },
        { e: '🏠', t: 'Wann darf ich nach Hause?' },
        { e: '💊', t: 'Was ist das für ein Medikament?' },
        { e: '📋', t: 'Was passiert als Nächstes?' },
        { e: '👨‍👩‍👧', t: 'War jemand für mich da?' },
        { e: '📞', t: 'Hat jemand angerufen?' }
      ]
    },
    {
      id: 'menschen', title: 'Menschen', icon: '👥',
      items: [
        { e: '👩‍⚕️', t: 'Bitte die Pflege', s: 'Bitte hol jemanden von der Pflege.' },
        { e: '🩺', t: 'Bitte die Ärztin', s: 'Ich möchte mit der Ärztin sprechen.' },
        { e: '🗣️', t: 'Bitte die Logopädin' },
        { e: '💛', t: '{p} anrufen', s: 'Kannst du bitte {p} anrufen?' },
        { e: '👨‍👩‍👧', t: 'Meine Familie', s: 'Ich möchte meine Familie sehen.' },
        { e: '📞', t: 'Bitte anrufen', s: 'Bitte ruf jemanden für mich an.' },
        { e: '🫂', t: 'Bitte bleib da', s: 'Bitte bleib noch ein bisschen bei mir.' },
        { e: '🚪', t: 'Ich möchte allein sein' }
      ]
    }
  ],

  en: [
    {
      id: 'antwort', title: 'Answers', icon: '💬',
      items: [
        { e: '👍', t: 'Yes', big: true, tone: 'yes' },
        { e: '👎', t: 'No', big: true, tone: 'no' },
        { e: '🤷', t: "I don't know" },
        { e: '✋', t: 'Wait a moment', s: 'Please wait a moment.' },
        { e: '🔁', t: 'Again please', s: 'Please say that again.' },
        { e: '🐢', t: 'More slowly', s: 'Please speak more slowly.' },
        { e: '❓', t: "I don't understand" },
        { e: '✍️', t: 'Please write it down', s: 'Could you write that down?' },
        { e: '🙏', t: 'Thank you' }
      ]
    },
    {
      id: 'brauche', title: 'I need', icon: '🙋',
      items: [
        { e: '💧', t: 'Water', s: 'I would like something to drink.' },
        { e: '🚻', t: 'Toilet', s: 'I need the toilet.', chain: 'toilet' },
        { e: '💊', t: 'Pain relief', s: 'I need something for the pain.' },
        { e: '🛏️', t: 'Move me', s: 'I would like to lie differently.' },
        { e: '🧣', t: 'A blanket', s: 'I am cold. A blanket, please.' },
        { e: '💡', t: 'Light', s: 'Please turn the light on or off.' },
        { e: '🪟', t: 'Fresh air', s: 'Please open the window.' },
        { e: '👓', t: 'My glasses' },
        { e: '📱', t: 'My phone' },
        { e: '🤫', t: 'Quiet', s: 'I would like some quiet.' },
        { e: '😴', t: 'Sleep', s: 'I would like to sleep.' },
        { e: '🪥', t: 'Mouth care', s: 'My mouth is dry.' }
      ]
    },
    {
      id: 'schmerz', title: 'Pain', icon: '🤕',
      items: [
        { e: '🤕', t: 'I am in pain', big: true, tone: 'no', chain: 'pain' },
        { e: '🧠', t: 'Head', s: 'My head hurts.' },
        { e: '🦴', t: 'Neck', s: 'My neck hurts.' },
        { e: '👁️', t: 'Eyes', s: 'My eyes hurt.' },
        { e: '🫁', t: 'Chest', s: 'My chest hurts.' },
        { e: '🫃', t: 'Stomach', s: 'My stomach hurts.' },
        { e: '🦵', t: 'Leg', s: 'My leg hurts.' },
        { e: '💪', t: 'Arm', s: 'My arm hurts.' },
        { e: '📈', t: 'It got worse', s: 'The pain has got worse.' },
        { e: '📉', t: 'It got better', s: 'The pain has got better.' }
      ]
    },
    {
      id: 'gefuehl', title: 'How I feel', icon: '🫀',
      items: [
        { e: '🙂', t: 'I feel good', tone: 'yes' },
        { e: '😐', t: 'So-so' },
        { e: '😢', t: 'I feel bad' },
        { e: '😨', t: 'I am frightened' },
        { e: '🤢', t: 'I feel sick' },
        { e: '💫', t: 'I feel dizzy' },
        { e: '🥱', t: 'I am tired' },
        { e: '🥶', t: 'I am cold' },
        { e: '🥵', t: 'I am hot' },
        { e: '😮‍💨', t: 'I cannot breathe well', tone: 'no' }
      ]
    },
    {
      id: 'naehe', title: 'Closeness', icon: '💛',
      items: [
        { e: '💛', t: 'I want to see {p}', s: 'I want to see {p}.', big: true, tone: 'yes' },
        { e: '🤍', t: 'I miss you' },
        { e: '🫱', t: 'Hold my hand', s: 'Please hold my hand.' },
        { e: '🫂', t: 'Stay a while', s: 'Please stay a little longer.' },
        { e: '💭', t: 'I am thinking of you' },
        { e: '📷', t: 'Show me a photo', s: 'Please show me a photo.' },
        { e: '🗣️', t: 'Tell me something', s: 'Please tell me something.' },
        { e: '🙂', t: 'How was your day?' },
        { e: '📖', t: 'Read to me', s: 'Would you read to me?' },
        { e: '😌', t: 'It is good that you are here' },
        { e: '🌙', t: 'Sleep well' },
        { e: '👋', t: 'See you tomorrow' }
      ]
    },
    {
      id: 'tag', title: 'The day', icon: '🌤️',
      items: [
        { e: '🌤️', t: 'What is the weather like?' },
        { e: '🕐', t: 'Is it early or late?' },
        { e: '🍽️', t: 'What is there to eat?' },
        { e: '🪟', t: 'I want to go to the window' },
        { e: '🚶', t: 'I want to walk a little' },
        { e: '🎵', t: 'I want to listen to music' },
        { e: '📺', t: 'I want to watch television' },
        { e: '📰', t: 'Is there any news?' },
        { e: '🌱', t: 'What are you all doing at home?' },
        { e: '☕', t: 'I would like a coffee' },
        { e: '🧴', t: 'I would like to freshen up' },
        { e: '💇', t: 'I would like to comb my hair' },
        { e: '🧦', t: 'I would like to wear something else' },
        { e: '🙂', t: 'There was a good moment today' }
      ]
    },
    {
      id: 'wichtig', title: 'Important', icon: '❗',
      items: [
        { e: '🧠', t: 'I understand everything', s: 'I understand you. I just cannot find the words.', big: true },
        { e: '👤', t: 'Talk to me', s: 'Please talk to me, not about me.' },
        { e: '⏳', t: 'Give me time', s: 'Please give me time. The word is coming.' },
        { e: '🚫', t: "Don't finish my words", s: 'Please do not say the word for me.' },
        { e: '❓', t: 'I have a question', s: 'I have a question.' },
        { e: '🗯️', t: 'This is too much', s: 'This is too much for me right now.' },
        { e: '🕐', t: 'Discuss it later', s: 'Could we discuss this later?' },
        { e: '✅', t: 'That is my decision', s: 'I would like to decide that myself.' },
        { e: '📝', t: 'Please explain it', s: 'Could you explain that to me?' },
        { e: '🤝', t: 'I agree' },
        { e: '🙅', t: 'I do not agree' }
      ]
    },
    {
      id: 'fragen', title: 'Questions', icon: '🔍',
      items: [
        { e: '🕐', t: 'What time is it?' },
        { e: '📅', t: 'What day is it today?' },
        { e: '🩺', t: 'When is the ward round?' },
        { e: '🗣️', t: 'When is therapy?' },
        { e: '🏠', t: 'When can I go home?' },
        { e: '💊', t: 'What medicine is this?' },
        { e: '📋', t: 'What happens next?' },
        { e: '👨‍👩‍👧', t: 'Has anyone been here for me?' },
        { e: '📞', t: 'Has anyone called?' }
      ]
    },
    {
      id: 'menschen', title: 'People', icon: '👥',
      items: [
        { e: '👩‍⚕️', t: 'Please get a nurse', s: 'Please get someone from nursing.' },
        { e: '🩺', t: 'Please get the doctor', s: 'I would like to speak to the doctor.' },
        { e: '🗣️', t: 'Speech therapist' },
        { e: '💛', t: 'Call {p}', s: 'Could you call {p}, please?' },
        { e: '👨‍👩‍👧', t: 'My family', s: 'I would like to see my family.' },
        { e: '📞', t: 'Please call someone', s: 'Please call someone for me.' },
        { e: '🫂', t: 'Please stay', s: 'Please stay with me a little longer.' },
        { e: '🚪', t: 'I want to be alone' }
      ]
    }
  ]
};

/* Sentence builder.
 *
 * Picking a whole ready-made phrase caps what a person can say at whatever the
 * author thought of. Composing from a starter plus a continuation does not:
 * two taps reach a few hundred utterances, and it keeps the grammar the
 * person's own choice rather than the app's.
 */
window.COMPOSE = {
  de: [
    { s: 'Ich möchte', next: ['aufstehen', 'schlafen', 'nach Hause', 'duschen', 'essen', 'trinken', 'telefonieren', 'fernsehen', 'lesen', 'allein sein', 'Besuch haben', 'raus an die Luft', 'mit dir reden', 'das selbst machen'] },
    { s: 'Ich brauche', next: ['Wasser', 'Hilfe', 'eine Pause', 'meine Brille', 'mein Handy', 'eine Decke', 'ein Kissen', 'Schmerzmittel', 'Ruhe', 'mehr Zeit', 'frische Luft'] },
    { s: 'Ich habe', next: ['Schmerzen', 'Hunger', 'Durst', 'Angst', 'eine Frage', 'schlecht geschlafen', 'gut geschlafen', 'keine Kraft', 'genug'] },
    { s: 'Mir ist', next: ['kalt', 'heiß', 'übel', 'schwindelig', 'langweilig', 'alles zu laut', 'alles zu hell'] },
    { s: 'Kannst du bitte', next: ['die Pflege holen', 'die Ärztin holen', 'meine Familie anrufen', 'das Fenster öffnen', 'das Licht ausmachen', 'langsamer sprechen', 'das aufschreiben', 'noch bleiben', 'mir helfen', 'das wiederholen'] },
    { s: 'Ich kann', next: ['das Wort nicht finden', 'gerade nicht sprechen', 'das nicht lesen', 'nicht gut hören', 'das nicht allein', 'das selbst', 'es später versuchen'] },
    { s: 'Bitte', next: ['nicht so schnell', 'nicht alle gleichzeitig', 'schreib es auf', 'frag noch einmal', 'lass mir Zeit', 'komm später wieder', 'bleib da'] },
    { s: 'Wann', next: ['kommt die Visite', 'ist die Therapie', 'darf ich nach Hause', 'gibt es Essen', 'kommt der Besuch'] },
    { s: 'Wo ist', next: ['meine Brille', 'mein Handy', 'meine Familie', 'die Toilette', 'meine Tasche'] },
    { s: 'Es geht mir', next: ['gut', 'besser als gestern', 'nicht gut', 'schlechter als gestern', 'so wie gestern'] },
    { s: 'Ich freue mich', next: ['auf den Besuch', 'auf zu Hause', 'dass du da bist', 'auf das Essen', 'auf morgen'] },
    { s: 'Erzähl mir', next: ['von deinem Tag', 'was zu Hause los ist', 'etwas Schönes', 'von früher', 'wer gefragt hat'] },
    { s: 'Ich bin', next: ['müde', 'wach', 'traurig', 'wütend', 'erleichtert', 'nervös', 'zufrieden', 'ungeduldig'] }
  ],
  en: [
    { s: 'I would like to', next: ['get up', 'sleep', 'go home', 'have a shower', 'eat', 'drink', 'make a call', 'watch television', 'read', 'be alone', 'have visitors', 'get some air', 'talk with you', 'do this myself'] },
    { s: 'I need', next: ['water', 'help', 'a break', 'my glasses', 'my phone', 'a blanket', 'a pillow', 'pain relief', 'quiet', 'more time', 'fresh air'] },
    { s: 'I have', next: ['pain', 'hunger', 'thirst', 'fear', 'a question', 'slept badly', 'slept well', 'no energy', 'had enough'] },
    { s: 'I feel', next: ['cold', 'hot', 'sick', 'dizzy', 'bored', 'overwhelmed by the noise', 'that the light is too bright'] },
    { s: 'Could you please', next: ['get a nurse', 'get the doctor', 'call my family', 'open the window', 'turn off the light', 'speak more slowly', 'write that down', 'stay a bit longer', 'help me', 'repeat that'] },
    { s: 'I cannot', next: ['find the word', 'speak right now', 'read that', 'hear well', 'do that alone', 'do it yet'] },
    { s: 'Please', next: ['not so fast', 'not all at once', 'write it down', 'ask again', 'give me time', 'come back later', 'stay here'] },
    { s: 'When', next: ['is the ward round', 'is therapy', 'can I go home', 'is there food', 'are visitors coming'] },
    { s: 'Where is', next: ['my glasses', 'my phone', 'my family', 'the toilet', 'my bag'] },
    { s: 'I am doing', next: ['well', 'better than yesterday', 'not well', 'worse than yesterday', 'the same as yesterday'] },
    { s: 'I am looking forward to', next: ['the visit', 'going home', 'you being here', 'the food', 'tomorrow'] },
    { s: 'Tell me', next: ['about your day', 'what is happening at home', 'something nice', 'about the old days', 'who asked after me'] },
    { s: 'I am', next: ['tired', 'awake', 'sad', 'angry', 'relieved', 'nervous', 'content', 'impatient'] }
  ]
};

/* Follow-up chains.
 *
 * "I am in pain" on its own makes a nurse ask two more questions the person
 * then cannot answer — which is exactly the dead end a board is supposed to
 * remove. So the high-stakes tiles carry their own follow-ups and the whole
 * exchange happens in two or three taps.
 *
 * The toilet chain includes the things that are hardest to ask for and worst
 * to be unable to ask for. Leaving them out is not neutrality, it is leaving
 * someone stuck.
 */
window.BOARD_CHAINS = {
  de: {
    pain: [
      {
        q: 'Wo genau tut es weh?',
        options: [
          { e: '🧠', t: 'Kopf', s: 'Mein Kopf tut weh.' },
          { e: '🦴', t: 'Nacken', s: 'Mein Nacken tut weh.' },
          { e: '👁️', t: 'Augen', s: 'Meine Augen tun weh.' },
          { e: '👂', t: 'Ohren', s: 'Meine Ohren tun weh.' },
          { e: '🦷', t: 'Mund', s: 'Mein Mund tut weh.' },
          { e: '🫁', t: 'Brust', s: 'Meine Brust tut weh.' },
          { e: '🫃', t: 'Bauch', s: 'Mein Bauch tut weh.' },
          { e: '🔙', t: 'Rücken', s: 'Mein Rücken tut weh.' },
          { e: '💪', t: 'Arm', s: 'Mein Arm tut weh.' },
          { e: '🦵', t: 'Bein', s: 'Mein Bein tut weh.' },
          { e: '🩹', t: 'Die Wunde', s: 'Meine Wunde tut weh.' },
          { e: '🤷', t: 'Überall', s: 'Es tut überall weh.' }
        ]
      },
      { q: 'Wie stark ist es?', kind: 'painScale' }
    ],
    toilet: [
      {
        q: 'Was brauchst du genau?',
        options: [
          { e: '💧', t: 'Klein', s: 'Ich muss Wasser lassen.' },
          { e: '💩', t: 'Groß', s: 'Ich muss groß auf die Toilette.' },
          { e: '🚽', t: 'Zur Toilette gehen', s: 'Ich möchte zur Toilette gehen.' },
          { e: '🛏️', t: 'Bettpfanne', s: 'Ich brauche die Bettpfanne.' },
          { e: '🧻', t: 'Hilfe beim Saubermachen', s: 'Ich brauche Hilfe beim Saubermachen.' },
          { e: '🩲', t: 'Einlage wechseln', s: 'Bitte die Einlage wechseln.' },
          { e: '⏳', t: 'Es ist dringend', s: 'Es ist dringend.' },
          { e: '💦', t: 'Es ist schon passiert', s: 'Es ist schon passiert. Bitte hilf mir.' },
          { e: '🤝', t: 'Ich brauche Hilfe dabei', s: 'Ich brauche Hilfe dabei.' },
          { e: '🚪', t: 'Bitte allein lassen', s: 'Bitte lass mich dabei allein.' }
        ]
      }
    ]
  },
  en: {
    pain: [
      {
        q: 'Where exactly does it hurt?',
        options: [
          { e: '🧠', t: 'Head', s: 'My head hurts.' },
          { e: '🦴', t: 'Neck', s: 'My neck hurts.' },
          { e: '👁️', t: 'Eyes', s: 'My eyes hurt.' },
          { e: '👂', t: 'Ears', s: 'My ears hurt.' },
          { e: '🦷', t: 'Mouth', s: 'My mouth hurts.' },
          { e: '🫁', t: 'Chest', s: 'My chest hurts.' },
          { e: '🫃', t: 'Stomach', s: 'My stomach hurts.' },
          { e: '🔙', t: 'Back', s: 'My back hurts.' },
          { e: '💪', t: 'Arm', s: 'My arm hurts.' },
          { e: '🦵', t: 'Leg', s: 'My leg hurts.' },
          { e: '🩹', t: 'The wound', s: 'My wound hurts.' },
          { e: '🤷', t: 'Everywhere', s: 'It hurts everywhere.' }
        ]
      },
      { q: 'How strong is it?', kind: 'painScale' }
    ],
    toilet: [
      {
        q: 'What exactly do you need?',
        options: [
          { e: '💧', t: 'Number one', s: 'I need to pass water.' },
          { e: '💩', t: 'Number two', s: 'I need the toilet, number two.' },
          { e: '🚽', t: 'Go to the toilet', s: 'I would like to go to the toilet.' },
          { e: '🛏️', t: 'Bedpan', s: 'I need the bedpan.' },
          { e: '🧻', t: 'Help cleaning up', s: 'I need help cleaning up.' },
          { e: '🩲', t: 'Change the pad', s: 'Please change the pad.' },
          { e: '⏳', t: 'It is urgent', s: 'It is urgent.' },
          { e: '💦', t: 'It already happened', s: 'It has already happened. Please help me.' },
          { e: '🤝', t: 'I need help with it', s: 'I need help with it.' },
          { e: '🚪', t: 'Please leave me alone', s: 'Please leave me alone for this.' }
        ]
      }
    ]
  }
};
