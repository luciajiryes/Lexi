/* =========================================================
   Lexi – courses
   One course per country on the globe. The same language can
   have different words in different countries (for example
   Portugal and Brazil), so each country gets its own list.
   Edit this file to add words or countries.
   ========================================================= */

/* Starter words that every course shares (same order in each course). */
const CONCEPTS = [
  ['apple', '🍎'], ['cat', '🐱'], ['house', '🏠'], ['book', '📚'], ['water', '💧'],
  ['bread', '🍞'], ['sun', '☀️'], ['dog', '🐶'], ['milk', '🥛'], ['beach', '🏖️']
];

/* Language colours on the globe */
const LANG_COLORS = {
  Spanish: '#FF7F6E', Portuguese: '#FFC24A', French: '#A890EE', English: '#2FA59B',
  Italian: '#7CC47F', German: '#F28FB0', Japanese: '#FF9F6B', Korean: '#C79BE8', Chinese: '#E8615A', Arabic: '#B07A52'
};

/*  country  = name used by the map data
    concepts = the 10 starter words, in the order of CONCEPTS (optional)
    extras   = [word, meaning, emoji] words that differ in this country, the ones marked "new"
    newFrom  = index in the full list where "new" words begin (default: after the starter words) */
const COURSES = {
  'pt-PT': {
    lang: 'Portuguese', dialect: 'European Portuguese', country: 'Portugal', flag: '🇵🇹',
    tip: 'In Portugal a bus is “o autocarro” and a train is “o comboio”. In Brazil people say “ônibus” and “trem”.',
    concepts: ['a maçã', 'o gato', 'a casa', 'o livro', 'a água', 'o pão', 'o sol', 'o cão', 'o leite', 'a praia'],
    extras: [['o autocarro', 'bus', '🚌'], ['o comboio', 'train', '🚆'], ['o pequeno-almoço', 'breakfast', '🥐'],
      ['o frigorífico', 'fridge', '🧊'], ['o telemóvel', 'mobile phone', '📱'], ['Como estás?', 'How are you?', '']]
  },
  'pt-BR': {
    lang: 'Portuguese', dialect: 'Brazilian Portuguese', country: 'Brazil', flag: '🇧🇷',
    tip: 'In Brazil people say “ônibus”, “trem” and “geladeira”. In Portugal it is “autocarro”, “comboio” and “frigorífico”. Brazilians commonly say “você” for “you”.',
    concepts: ['a maçã', 'o gato', 'a casa', 'o livro', 'a água', 'o pão', 'o sol', 'o cachorro', 'o leite', 'a praia'],
    extras: [['o ônibus', 'bus', '🚌'], ['o trem', 'train', '🚆'], ['o café da manhã', 'breakfast', '🥐'],
      ['a geladeira', 'fridge', '🧊'], ['o celular', 'mobile phone', '📱'], ['Tudo bem?', 'How are you? / All good?', '']]
  },
  'es-ES': {
    lang: 'Spanish', dialect: 'Spanish from Spain', country: 'Spain', flag: '🇪🇸',
    tip: 'In Spain people say “ordenador” for computer and “vosotros” for “you all”. In Latin America it is “computadora” and “ustedes”.',
    concepts: ['la manzana', 'el gato', 'la casa', 'el libro', 'el agua', 'el pan', 'el sol', 'el perro', 'la leche', 'la playa'],
    extras: [['el ordenador', 'computer', '💻'], ['el autobús', 'bus', '🚌'], ['el móvil', 'mobile phone', '📱'],
      ['el zumo', 'juice', '🧃'], ['¿Cómo te llamas?', 'What’s your name?', '']]
  },
  'es-MX': {
    lang: 'Spanish', dialect: 'Mexican Spanish', country: 'Mexico', flag: '🇲🇽',
    tip: 'In Mexico a bus is often “el camión”, and a mobile phone is “el celular”. In Spain they say “el autobús” and “el móvil”.',
    concepts: ['la manzana', 'el gato', 'la casa', 'el libro', 'el agua', 'el pan', 'el sol', 'el perro', 'la leche', 'la playa'],
    extras: [['la computadora', 'computer', '💻'], ['el camión', 'bus', '🚌'], ['el celular', 'mobile phone', '📱'],
      ['el jugo', 'juice', '🧃'], ['¿Qué onda?', 'What’s up?', '']]
  },
  'es-AR': {
    lang: 'Spanish', dialect: 'Argentine Spanish', country: 'Argentina', flag: '🇦🇷',
    tip: 'In Argentina people say “vos” instead of “tú”, and a bus is “el colectivo”.',
    concepts: ['la manzana', 'el gato', 'la casa', 'el libro', 'el agua', 'el pan', 'el sol', 'el perro', 'la leche', 'la playa'],
    extras: [['la computadora', 'computer', '💻'], ['el colectivo', 'bus', '🚌'], ['la frutilla', 'strawberry', '🍓'],
      ['el celular', 'mobile phone', '📱'], ['¿Cómo andás?', 'How are you doing?', '']]
  },
  'fr-FR': {
    lang: 'French', dialect: 'French from France', country: 'France', flag: '🇫🇷',
    tip: 'In France breakfast is “le petit déjeuner” and dinner is “le dîner”. In Quebec they say “le déjeuner” and “le souper”.',
    concepts: ['la pomme', 'le chat', 'la maison', 'le livre', 'l’eau', 'le pain', 'le soleil', 'le chien', 'le lait', 'la plage'],
    extras: [['la voiture', 'car', '🚗'], ['le petit déjeuner', 'breakfast', '🥐'], ['le portable', 'mobile phone', '📱'],
      ['le dîner', 'dinner', '🍽️'], ['Comment tu t’appelles ?', 'What’s your name?', '']]
  },
  'fr-CA': {
    lang: 'French', dialect: 'Quebec French', country: 'Canada', flag: '🇨🇦',
    tip: 'In Quebec breakfast is “le déjeuner” and dinner is “le souper”. In France they say “le petit déjeuner” and “le dîner”.',
    concepts: ['la pomme', 'le chat', 'la maison', 'le livre', 'l’eau', 'le pain', 'le soleil', 'le chien', 'le lait', 'la plage'],
    extras: [['le char', 'car (informal)', '🚗'], ['le déjeuner', 'breakfast', '🥐'], ['le souper', 'dinner', '🍽️'],
      ['le cellulaire', 'mobile phone', '📱'], ['Allô !', 'Hello!', '']]
  },
  'en-GB': {
    lang: 'English', dialect: 'British English', country: 'United Kingdom', flag: '🇬🇧', newFrom: 6,
    tip: 'British and American English use different words. A “lift” in the UK is an “elevator” in the US.',
    extras: [['the lift', 'elevator (US)', '🛗'], ['the flat', 'apartment (US)', '🏢'], ['the biscuit', 'cookie (US)', '🍪'],
      ['the crisps', 'chips (US)', '🥔'], ['the lorry', 'truck (US)', '🚚'], ['the pavement', 'sidewalk (US)', '🚶'],
      ['the boot', 'trunk of a car (US)', '🚗'], ['the petrol', 'gas (US)', '⛽'], ['the mobile', 'cell phone (US)', '📱'],
      ['the autumn', 'fall (US)', '🍂']]
  },
  'en-US': {
    lang: 'English', dialect: 'American English', country: 'United States of America', flag: '🇺🇸', newFrom: 6,
    tip: 'British and American English use different words. An “elevator” in the US is a “lift” in the UK.',
    extras: [['the elevator', 'lift (UK)', '🛗'], ['the apartment', 'flat (UK)', '🏢'], ['the cookie', 'biscuit (UK)', '🍪'],
      ['the chips', 'crisps (UK)', '🥔'], ['the truck', 'lorry (UK)', '🚚'], ['the sidewalk', 'pavement (UK)', '🚶'],
      ['the trunk', 'boot of a car (UK)', '🚗'], ['the gas', 'petrol (UK)', '⛽'], ['the cell phone', 'mobile (UK)', '📱'],
      ['the fall', 'autumn (UK)', '🍂']]
  },
  'it-IT': {
    lang: 'Italian', dialect: 'Italian', country: 'Italy', flag: '🇮🇹',
    tip: 'In Italy you say “Buongiorno” in the morning and “Buonasera” from the afternoon.',
    concepts: ['la mela', 'il gatto', 'la casa', 'il libro', 'l’acqua', 'il pane', 'il sole', 'il cane', 'il latte', 'la spiaggia'],
    extras: [['il caffè', 'coffee', '☕'], ['la pizza', 'pizza', '🍕'], ['il gelato', 'ice cream', '🍦'],
      ['Buongiorno', 'Good morning', ''], ['Come ti chiami?', 'What’s your name?', '']]
  },
  'de-DE': {
    lang: 'German', dialect: 'German', country: 'Germany', flag: '🇩🇪',
    tip: 'In German, “du” is for friends and “Sie” is the polite word for “you”.',
    concepts: ['der Apfel', 'die Katze', 'das Haus', 'das Buch', 'das Wasser', 'das Brot', 'die Sonne', 'der Hund', 'die Milch', 'der Strand'],
    extras: [['das Auto', 'car', '🚗'], ['die Brezel', 'pretzel', '🥨'], ['der Kaffee', 'coffee', '☕'],
      ['Guten Morgen', 'Good morning', ''], ['Wie heißt du?', 'What’s your name?', '']]
  },
  'ja-JP': {
    lang: 'Japanese', dialect: 'Japanese', country: 'Japan', flag: '🇯🇵',
    tip: 'Japanese uses three writing systems. Lexi shows the sounds in brackets (romaji) to help you read.',
    concepts: ['りんご (ringo)', 'ねこ (neko)', 'いえ (ie)', 'ほん (hon)', 'みず (mizu)', 'パン (pan)', 'たいよう (taiyou)', 'いぬ (inu)', 'ぎゅうにゅう (gyuunyuu)', 'ビーチ (biichi)'],
    extras: [['すし (sushi)', 'sushi', '🍣'], ['でんしゃ (densha)', 'train', '🚆'],
      ['ありがとう (arigatou)', 'thank you', ''], ['こんにちは (konnichiwa)', 'hello', '']]
  },
  'ko-KR': {
    lang: 'Korean', dialect: 'Korean', country: 'South Korea', flag: '🇰🇷',
    tip: 'Korean has polite and casual speech. Words ending in “요” or “니다” are polite.',
    concepts: ['사과 (sagwa)', '고양이 (goyangi)', '집 (jip)', '책 (chaek)', '물 (mul)', '빵 (ppang)', '해 (hae)', '개 (gae)', '우유 (uyu)', '해변 (haebyeon)'],
    extras: [['김치 (gimchi)', 'kimchi', '🥬'], ['지하철 (jihacheol)', 'subway', '🚇'], ['커피 (keopi)', 'coffee', '☕'],
      ['안녕하세요 (annyeonghaseyo)', 'hello', ''], ['감사합니다 (gamsahamnida)', 'thank you', '']]
  },
  'zh-CN': {
    lang: 'Chinese', dialect: 'Mandarin Chinese', country: 'China', flag: '🇨🇳',
    tip: 'Mandarin uses tones. The accent marks in brackets (pinyin) show which tone to use.',
    concepts: ['苹果 (píngguǒ)', '猫 (māo)', '房子 (fángzi)', '书 (shū)', '水 (shuǐ)', '面包 (miànbāo)', '太阳 (tàiyáng)', '狗 (gǒu)', '牛奶 (niúnǎi)', '海滩 (hǎitān)'],
    extras: [['茶 (chá)', 'tea', '🍵'], ['火车 (huǒchē)', 'train', '🚆'], ['咖啡 (kāfēi)', 'coffee', '☕'],
      ['你好 (nǐ hǎo)', 'hello', ''], ['谢谢 (xièxie)', 'thank you', '']]
  },
  'ar-LB': {
    lang: 'Arabic', dialect: 'Lebanese Arabic', country: 'Lebanon', flag: '🇱🇧',
    tip: 'Lebanese Arabic is mostly spoken, not written. People say “kifak?” for “how are you?” and “mersi” for thanks, and often mix in French and English words.',
    concepts: ['تفاحة (tuffeha)', 'بسّة (bissi)', 'بيت (bayt)', 'كتاب (ktéb)', 'مي (mayy)', 'خبز (khebez)', 'شمس (shams)', 'كلب (kalb)', 'حليب (haleeb)', 'شاطئ (shaati)'],
    extras: [['منقوشة (manousheh)', 'flatbread with za’atar', '🫓'], ['تبولة (tabbouleh)', 'parsley salad', '🥗'], ['قهوة (ahwe)', 'coffee', '☕'],
      ['مرحبا (marhaba)', 'hello', ''], ['كيفك؟ (kifak)', 'how are you? (to a man)', ''], ['شو اسمك؟ (shou ismak)', 'what’s your name? (to a man)', ''],
      ['يلا (yalla)', 'let’s go!', ''], ['ميرسي (mersi)', 'thank you', '']]
  },
  'ar-EG': {
    lang: 'Arabic', dialect: 'Egyptian Arabic', country: 'Egypt', flag: '🇪🇬',
    tip: 'Egyptian Arabic is understood across the Arab world thanks to Egyptian films and music. “Eish” means both bread and life.',
    concepts: ['تفاحة (toffaha)', 'قطة (otta)', 'بيت (beit)', 'كتاب (kitab)', 'مية (mayya)', 'عيش (eish)', 'شمس (shams)', 'كلب (kalb)', 'لبن (laban)', 'شاطئ (shati)'],
    extras: [['كشري (koshari)', 'rice, lentils and pasta dish', '🍲'], ['شاي (shay)', 'tea', '🍵'], ['فول (foul)', 'fava bean dish', '🫘'],
      ['إزيك؟ (ezzayyak)', 'how are you? (to a man)', ''], ['شكراً (shukran)', 'thank you', ''], ['يلا (yalla)', 'let’s go!', '']]
  }
};

/* ---------- little icons for each country (the “stickers”) ----------
   [icon, name]. An icon is an emoji, or "svg:name" for a drawing in STICKER_SVG. */
const STICKER_SVG = {
  cedar: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="28" y="44" width="8" height="15" rx="2" fill="#8B5E3C"/><ellipse cx="32" cy="46" rx="27" ry="7" fill="#3F8F4F"/><ellipse cx="32" cy="35" rx="22" ry="7" fill="#4FA35D"/><ellipse cx="32" cy="25" rx="16" ry="6.5" fill="#5DB36B"/><ellipse cx="32" cy="16" rx="10" ry="6" fill="#74C681"/><g fill="#EAF7E8"><circle cx="20" cy="46" r="1.6"/><circle cx="44" cy="46" r="1.6"/><circle cx="26" cy="35" r="1.5"/><circle cx="38" cy="35" r="1.5"/><circle cx="32" cy="25" r="1.4"/></g></svg>',
  fez: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 52 L20 18 H44 L50 52 Z" fill="#D63C2F"/><ellipse cx="32" cy="18" rx="12" ry="4" fill="#E8584B"/><rect x="14" y="46" width="36" height="8" rx="3" fill="#B52A20"/><path d="M32 18 Q48 14 47 32" stroke="#2B2B2B" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="47" cy="35" r="3.8" fill="#2B2B2B"/></svg>',
  pyramid: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="50" cy="15" r="7" fill="#FFD36B"/><path d="M5 54 L31 12 L57 54 Z" fill="#EBC76B"/><path d="M31 12 L57 54 H38 Z" fill="#D2A445"/><path d="M5 54 H57" stroke="#B88A33" stroke-width="2"/></svg>'
};
const COURSE_STICKERS = {
  'ar-LB': [['svg:cedar', 'Cedar tree'], ['🥗', 'Tabbouleh'], ['🫓', 'Manousheh'], ['☕', 'Coffee pot'], ['svg:fez', 'Tarboosh'], ['🚌', 'Red bus'], ['🏺', 'Clay jug'], ['🌊', 'Pigeon Rocks']],
  'ar-EG': [['svg:pyramid', 'Pyramids'], ['🐪', 'Camel'], ['🍵', 'Mint tea'], ['🏺', 'Ancient vase'], ['🐈', 'Cat'], ['🌴', 'Palm tree'], ['svg:fez', 'Tarboosh'], ['🥙', 'Falafel wrap']],
  'pt-PT': [['🐓', 'Rooster of Barcelos'], ['🚋', 'Lisbon tram'], ['🥧', 'Custard tart'], ['🐟', 'Sardines'], ['🏰', 'Castle'], ['⚓', 'Anchor'], ['🍷', 'Port wine'], ['🌊', 'Atlantic waves']],
  'pt-BR': [['🦜', 'Parrot'], ['⚽', 'Football'], ['🥥', 'Coconut'], ['🌴', 'Palm tree'], ['🎉', 'Carnival'], ['☕', 'Coffee'], ['🏖️', 'Beach'], ['🥭', 'Mango']],
  'es-ES': [['💃', 'Flamenco'], ['🥘', 'Paella'], ['🐂', 'Bull'], ['🍊', 'Oranges'], ['🏰', 'Castle'], ['⚽', 'Football'], ['🎸', 'Guitar'], ['☀️', 'Sunshine']],
  'es-MX': [['🌮', 'Taco'], ['🌵', 'Cactus'], ['💀', 'Day of the Dead'], ['🪅', 'Piñata'], ['🌶️', 'Chilli'], ['🎺', 'Mariachi'], ['🥑', 'Avocado'], ['🌽', 'Corn']],
  'es-AR': [['🧉', 'Mate'], ['🥩', 'Steak'], ['⚽', 'Football'], ['💃', 'Tango'], ['🏔️', 'Andes'], ['🦙', 'Llama'], ['🍦', 'Dulce de leche ice cream'], ['🐧', 'Penguin']],
  'fr-FR': [['🥐', 'Croissant'], ['🗼', 'Eiffel Tower'], ['🥖', 'Baguette'], ['🧀', 'Cheese'], ['🍷', 'Wine'], ['🎨', 'Art'], ['🥂', 'Cheers'], ['🚲', 'Bicycle']],
  'fr-CA': [['🍁', 'Maple leaf'], ['🏒', 'Hockey'], ['🍟', 'Poutine'], ['🐻', 'Bear'], ['❄️', 'Snow'], ['🥞', 'Pancakes with syrup'], ['🛶', 'Canoe'], ['🦫', 'Beaver']],
  'en-GB': [['🫖', 'Tea'], ['🚌', 'Red bus'], ['💂', 'Royal guard'], ['☔', 'Rain'], ['👑', 'Crown'], ['🏰', 'Castle'], ['🍪', 'Biscuit'], ['⚽', 'Football']],
  'en-US': [['🗽', 'Statue of Liberty'], ['🍔', 'Burger'], ['🏈', 'American football'], ['🌭', 'Hot dog'], ['🚕', 'Yellow taxi'], ['🤠', 'Cowboy'], ['🍿', 'Popcorn'], ['🎷', 'Jazz']],
  'it-IT': [['🍕', 'Pizza'], ['🍝', 'Pasta'], ['🍦', 'Gelato'], ['🛵', 'Scooter'], ['🏛️', 'Ancient Rome'], ['☕', 'Espresso'], ['🍋', 'Lemons'], ['🎭', 'Opera']],
  'de-DE': [['🥨', 'Pretzel'], ['🍺', 'Beer'], ['🏰', 'Castle'], ['🚗', 'Cars'], ['🎄', 'Christmas market'], ['🌭', 'Sausage'], ['🎻', 'Classical music'], ['🥁', 'Oompah band']],
  'ja-JP': [['🍣', 'Sushi'], ['🗻', 'Mount Fuji'], ['🌸', 'Cherry blossom'], ['🎎', 'Hina dolls'], ['🍜', 'Ramen'], ['⛩️', 'Torii gate'], ['🚅', 'Bullet train'], ['🍵', 'Green tea']],
  'ko-KR': [['🥬', 'Kimchi'], ['🎤', 'K-pop'], ['🍚', 'Rice'], ['🏯', 'Palace'], ['🥢', 'Chopsticks'], ['🎶', 'Music'], ['🍲', 'Stew'], ['🚇', 'Subway']],
  'zh-CN': [['🐼', 'Panda'], ['🏮', 'Lantern'], ['🥟', 'Dumplings'], ['🍵', 'Tea'], ['🐉', 'Dragon'], ['🧧', 'Red envelope'], ['🏯', 'Pagoda'], ['🥢', 'Chopsticks']]
};
Object.keys(COURSE_STICKERS).forEach(id => { COURSES[id].stickers = COURSE_STICKERS[id]; });

/* Country name on the map -> course id */
const COUNTRY_COURSE = {};
Object.keys(COURSES).forEach(id => { COURSES[id].id = id; COURSES[id].color = LANG_COLORS[COURSES[id].lang]; COUNTRY_COURSE[COURSES[id].country] = id; });

/* Country names as shown to people */
const COUNTRY_LABEL = { 'United States of America': 'United States', 'United Kingdom': 'United Kingdom' };
