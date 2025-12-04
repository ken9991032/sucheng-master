
import { RootMapping, WordEntry } from './types';

export const ROOT_DATA: RootMapping[] = [
  { key: 'A', root: '日' }, { key: 'B', root: '月' }, { key: 'C', root: '金' },
  { key: 'D', root: '木' }, { key: 'E', root: '水' }, { key: 'F', root: '火' },
  { key: 'G', root: '土' }, { key: 'H', root: '竹' }, { key: 'I', root: '戈' },
  { key: 'J', root: '十' }, { key: 'K', root: '大' }, { key: 'L', root: '中' },
  { key: 'M', root: '一' }, { key: 'N', root: '弓' }, { key: 'O', root: '人' },
  { key: 'P', root: '心' }, { key: 'Q', root: '手' }, { key: 'R', root: '口' },
  { key: 'S', root: '尸' }, { key: 'T', root: '廿' }, { key: 'U', root: '山' },
  { key: 'V', root: '女' }, { key: 'W', root: '田' }, { key: 'X', root: '難' },
  { key: 'Y', root: '卜' }, { key: 'Z', root: '重' },
];

export const WORD_DATA: WordEntry[] = [
  // Page 1: High Frequency
  { char: '我', code: 'HI', category: 'HighFreq', hint: '竹 + 戈' },
  { char: '你', code: 'OF', category: 'HighFreq', hint: '人 + 火' },
  { char: '他', code: 'OD', category: 'HighFreq', hint: '人 + 木' },
  { char: '的', code: 'HI', category: 'HighFreq', hint: '竹 + 戈 (選)' },
  { char: '是', code: 'AO', category: 'HighFreq', hint: '日 + 人' },
  
  // Page 2: Common
  { char: '在', code: 'KG', category: 'Common', hint: '大 + 土' },
  { char: '不', code: 'MF', category: 'Common', hint: '一 + 火' },
  { char: '了', code: 'NN', category: 'Common', hint: '弓 + 弓' },
  { char: '有', code: 'KB', category: 'Common', hint: '大 + 月' },
  { char: '和', code: 'HR', category: 'Common', hint: '竹 + 口' },
  { char: '好', code: 'VD', category: 'Common', hint: '女 + 木' },
  { char: '要', code: 'MV', category: 'Common', hint: '一 + 女' },
  { char: '這', code: 'YR', category: 'Common', hint: '卜 + 口' },
  { char: '那', code: 'SL', category: 'Common', hint: '尸 + 中' },
  { char: '會', code: 'OA', category: 'Common', hint: '人 + 日' },
  { char: '對', code: 'TI', category: 'Common', hint: '廿 + 戈' },
  { char: '說', code: 'YU', category: 'Common', hint: '卜 + 山' },
  { char: '做', code: 'OK', category: 'Common', hint: '人 + 大' },
  { char: '想', code: 'DP', category: 'Common', hint: '木 + 心' },
  { char: '愛', code: 'BE', category: 'Common', hint: '月 + 水' },

  // Page 2: Pronouns & Family
  { char: '們', code: 'ON', category: 'Pronoun', hint: '人弓' },
  { char: '誰', code: 'YG', category: 'Pronoun', hint: '卜土' },
  { char: '大', code: 'K', category: 'Pronoun', hint: '大' },
  { char: '家', code: 'JO', category: 'Family', hint: '十人' },
  { char: '爸', code: 'CU', category: 'Family', hint: '金山' },
  { char: '媽', code: 'VM', category: 'Family', hint: '女一' },

  // Page 2-3: Time
  { char: '時', code: 'AI', category: 'Time', hint: '日戈' },
  { char: '間', code: 'AA', category: 'Time', hint: '日日' },
  { char: '今', code: 'ON', category: 'Time', hint: '人弓' },
  { char: '天', code: 'MK', category: 'Time', hint: '一大' },
  { char: '年', code: 'OQ', category: 'Time', hint: '人手' },
  { char: '早', code: 'AJ', category: 'Time', hint: '日十' },
  { char: '晚', code: 'AU', category: 'Time', hint: '日山' },

  // Page 3: Questions
  { char: '嗎', code: 'RF', category: 'Question', hint: '口火' },
  { char: '什麼', code: 'OJ', category: 'Question', hint: '人十' },
  { char: '為', code: 'BF', category: 'Question', hint: '月火' },
  { char: '吧', code: 'RU', category: 'Question', hint: '口山' },
  { char: '呢', code: 'RP', category: 'Question', hint: '口心' },

  // Page 3: Verbs
  { char: '看', code: 'HU', category: 'Verb', hint: '竹山' },
  { char: '聽', code: 'SP', category: 'Verb', hint: '尸心' },
  { char: '寫', code: 'JF', category: 'Verb', hint: '十火' },
  { char: '吃', code: 'RN', category: 'Verb', hint: '口弓' },
  { char: '喝', code: 'RV', category: 'Verb', hint: '口女' },
  { char: '去', code: 'GI', category: 'Verb', hint: '土戈' },
  { char: '來', code: 'DO', category: 'Verb', hint: '木人' },
  { char: '走', code: 'GO', category: 'Verb', hint: '土人' },
  { char: '打', code: 'QN', category: 'Verb', hint: '手弓' },

  // Page 3: Adjectives
  { char: '多', code: 'NI', category: 'Adjective', hint: '弓戈' },
  { char: '少', code: 'FH', category: 'Adjective', hint: '火竹' },
  { char: '美', code: 'TK', category: 'Adjective', hint: '廿大' },
  { char: '快', code: 'PK', category: 'Adjective', hint: '心大' },
  { char: '慢', code: 'PE', category: 'Adjective', hint: '心水' },
  { char: '高', code: 'YB', category: 'Adjective', hint: '卜月' },
  { char: '興', code: 'HC', category: 'Adjective', hint: '竹金' },

  // Page 4: Difficult/Special
  { char: '身', code: 'HH', category: 'Difficult', hint: '竹竹' },
  { char: '齊', code: 'YX', category: 'Difficult', hint: '卜難' },
  { char: '龜', code: 'NX', category: 'Difficult', hint: '弓難' },
  { char: '謝', code: 'YI', category: 'Difficult', hint: '卜戈' },
  { char: '灣', code: 'EN', category: 'Difficult', hint: '水弓' },
  { char: '餐', code: 'YV', category: 'Difficult', hint: '卜女' }, // Fixed from EV
  
  // New Words - School & Daily Life
  { char: '學', code: 'HD', category: 'School', hint: '竹木' },
  { char: '校', code: 'DK', category: 'School', hint: '木大' },
  { char: '師', code: 'LB', category: 'School', hint: '中月' },
  { char: '生', code: 'HM', category: 'School', hint: '竹一' },
  { char: '書', code: 'LA', category: 'School', hint: '中日' },
  { char: '筆', code: 'HQ', category: 'School', hint: '竹手' },
  { char: '課', code: 'YD', category: 'School', hint: '卜木' },
  { char: '文', code: 'YK', category: 'School', hint: '卜大' },
  { char: '英', code: 'TK', category: 'School', hint: '廿大' },
  { char: '數', code: 'FK', category: 'School', hint: '火大' },
  
  // New Words - Food & Nature
  { char: '水', code: 'E', category: 'Nature', hint: '水' },
  { char: '果', code: 'WD', category: 'Food', hint: '田木' },
  { char: '飯', code: 'OE', category: 'Food', hint: '人水' },
  { char: '麵', code: 'JW', category: 'Food', hint: '十田' },
  { char: '貓', code: 'BT', category: 'Nature', hint: '月廿' },
  { char: '狗', code: 'KR', category: 'Nature', hint: '大口' },
  { char: '花', code: 'TP', category: 'Nature', hint: '廿心' },
  { char: '草', code: 'TJ', category: 'Nature', hint: '廿十' },

  // Punctuation
  { char: '，', code: 'ZA', category: 'Punct', hint: 'ZA' },
  { char: '。', code: 'ZB', category: 'Punct', hint: 'ZB' },
  { char: '？', code: 'ZI', category: 'Punct', hint: 'ZI' },
  { char: '！', code: 'ZJ', category: 'Punct', hint: 'ZJ' },
];
