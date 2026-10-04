import { DiffWord } from '../types/steno';

// Tokenize text into words preserving punctuation attached to tokens
export function tokenizeWords(text: string): string[] {
  if (!text) return [];
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

// Strip leading and trailing punctuation for root comparison
export function stripPunctuation(w: string): string {
  if (!w) return '';
  return w.replace(/^[.,/#!$%^&*;:{}=\-_`~()।?"'॥\[\]]+|[.,/#!$%^&*;:{}=\-_`~()।?"'॥\[\]]+$/g, '');
}

// Normalize Hindi Chandrabindu (ँ) vs Anusvara (ं)
export function normalizeHindiChandrabindu(text: string): string {
  if (!text) return '';
  // Chandrabindu U+0901 to Anusvara U+0902
  return text.replace(/\u0901/g, '\u0902');
}

// Normalize Hindi hyphens in compound words (e.g., विचार-विमर्श -> विचार विमर्श)
export function normalizeHindiHyphen(text: string): string {
  if (!text) return '';
  return text.replace(/([^\s])-([^\s])/g, '$1 $2');
}

// Check for official ignored equivalent pairs/symbols (Note v)
const EQUIVALENT_MAPPINGS: Array<Set<string>> = [
  new Set(['%', 'percent', 'percentage', 'प्रतिशत']),
  new Set(['&', 'and', 'तथा', 'और']),
  new Set(['₹', 'rs.', 'rs', 'rupee', 'rupees', 'रुपये', 'रुपए']),
  new Set(['ld.', 'ld', 'learned']),
  new Set(['v/s', 'vs.', 'vs', 'versus', 'बनाम']),
  new Set(['u/s', 'under section']),
];

export function isEquivalentSymbol(wordA: string, wordB: string): boolean {
  const a = stripPunctuation(wordA).toLowerCase();
  const b = stripPunctuation(wordB).toLowerCase();
  if (a === b) return true;

  for (const group of EQUIVALENT_MAPPINGS) {
    if (group.has(a) && group.has(b)) {
      return true;
    }
  }
  return false;
}

// Check if two tokens are date format variations (Note iv: e.g. 04 July, 1990 or 04/07/1990 or 04.07.1990)
export function isEquivalentDate(a: string, b: string): boolean {
  const normA = a.replace(/[.\-/]/g, '').toLowerCase();
  const normB = b.replace(/[.\-/]/g, '').toLowerCase();
  return normA.length > 3 && normA === normB;
}

// Check if words match under Hindi Chandrabindu / Hyphen ignore rules (Note vi)
export function isHindiIgnoredEquivalent(expected: string, typed: string): boolean {
  const normExp = normalizeHindiChandrabindu(stripPunctuation(expected));
  const normTyp = normalizeHindiChandrabindu(stripPunctuation(typed));

  if (normExp === normTyp) return true;

  // Hyphen ignore: 'विचार-विमर्श' vs 'विचारविमर्श'
  const unhyphenExp = normExp.replace(/[-]/g, '');
  const unhyphenTyp = normTyp.replace(/[-]/g, '');
  if (unhyphenExp === unhyphenTyp) return true;

  return false;
}

// Check if differences are singular vs plural noun (Half-Mistake Rule 1)
const IRREGULAR_PLURALS: Record<string, string> = {
  man: 'men',
  men: 'man',
  woman: 'women',
  women: 'woman',
  child: 'children',
  children: 'child',
  tooth: 'teeth',
  teeth: 'tooth',
  foot: 'feet',
  feet: 'foot',
  mouse: 'mice',
  mice: 'mouse',
  person: 'people',
  people: 'person',
  life: 'lives',
  lives: 'life',
  leaf: 'leaves',
  leaves: 'leaf',
  datum: 'data',
  data: 'datum',
};

export function isSingularPluralMismatch(wordA: string, wordB: string): boolean {
  const a = stripPunctuation(wordA).toLowerCase();
  const b = stripPunctuation(wordB).toLowerCase();

  if (!a || !b || a === b) return false;

  // English regular plurals
  if (a + 's' === b || b + 's' === a) return true;
  if (a + 'es' === b || b + 'es' === a) return true;
  if (a.endsWith('y') && a.slice(0, -1) + 'ies' === b) return true;
  if (b.endsWith('y') && b.slice(0, -1) + 'ies' === a) return true;

  // English irregular plurals
  if (IRREGULAR_PLURALS[a] === b) return true;

  // Hindi singular-plural variations (e.g. लड़का/लड़के/लड़कों, किताब/किताबें/किताबों, बात/बातें, वस्तु/वस्तुएं)
  const hindiStems = [
    { from: /ा$/, to: /े|ों$/ },
    { from: /े$/, to: /ा|ों$/ },
    { from: /ों$/, to: /ा|े$/ },
    { from: /ें$/, to: /ों$|$/ },
    { from: /ी$/, to: /ियाँ|ियों$/ },
    { from: /ियाँ|ियों$/, to: /ी$/ },
    { from: /एं|ए$/, to: /ों$|$/ },
  ];

  for (const rule of hindiStems) {
    if (rule.from.test(a) && rule.to.test(b)) return true;
    if (rule.from.test(b) && rule.to.test(a)) return true;
  }

  // Base stem match in Hindi (difference of only 1 or 2 matra characters at end)
  if (a.length >= 3 && b.length >= 3) {
    const minLen = Math.min(a.length, b.length);
    if (a.substring(0, minLen - 1) === b.substring(0, minLen - 1)) {
      const diffSuffix = a.slice(minLen - 1) + b.slice(minLen - 1);
      if (/[\u0900-\u097F]/.test(diffSuffix)) {
        return true;
      }
    }
  }

  return false;
}

// Check if sentence beginning small letter (Half-Mistake Rule 2)
export function isSentenceBeginningSmallLetter(
  expected: string,
  typed: string,
  isSentenceStart: boolean
): boolean {
  if (!isSentenceStart) return false;
  // Expected begins with uppercase letter, typed begins with lowercase, and the rest matches
  if (/^[A-Z]/.test(expected) && /^[a-z]/.test(typed)) {
    if (expected.slice(1) === typed.slice(1)) {
      return true;
    }
  }
  return false;
}

export function evaluateTyping(
  masterText: string,
  typedText: string,
  timeTakenSeconds: number
) {
  // Pre-check for undesired space between word and Full Stop (.) - Full Mistake (Image 1, Rule 5 note)
  let spaceBeforeFullStopCount = 0;
  const spaceBeforeDotMatches = typedText.match(/\S\s+[.।]/g);
  if (spaceBeforeDotMatches) {
    spaceBeforeFullStopCount = spaceBeforeDotMatches.length;
  }

  const masterWords = tokenizeWords(masterText);
  const typedWords = tokenizeWords(typedText);
  const timeMinutes = Math.max(0.1, timeTakenSeconds / 60);

  const diffAnalysis: DiffWord[] = [];
  let correctCount = 0;
  let fullMistakes = 0;
  let halfMistakes = 0;

  let mIdx = 0;
  let tIdx = 0;

  // Track if current word is start of a sentence
  let isNextSentenceStart = true;

  while (mIdx < masterWords.length || tIdx < typedWords.length) {
    const expected = masterWords[mIdx] || '';
    const typed = typedWords[tIdx] || '';

    // Check sentence punctuation in previous expected word
    const isCurSentenceStart = isNextSentenceStart;
    if (expected.endsWith('.') || expected.endsWith('?') || expected.endsWith('!') || expected.endsWith('।')) {
      isNextSentenceStart = true;
    } else {
      isNextSentenceStart = false;
    }

    if (mIdx < masterWords.length && tIdx < typedWords.length) {
      // 1. Exact match
      if (expected === typed) {
        correctCount++;
        diffAnalysis.push({ expected, typed, status: 'correct' });
        mIdx++;
        tIdx++;
        continue;
      }

      // 2. Official Ignored equivalents (Chandrabindu / Anusvara, Hindi Hyphen, Currency/Symbols, Dates)
      if (
        isHindiIgnoredEquivalent(expected, typed) ||
        isEquivalentSymbol(expected, typed) ||
        isEquivalentDate(expected, typed)
      ) {
        correctCount++;
        diffAnalysis.push({
          expected,
          typed,
          status: 'correct',
          mistakeType: 'ignored',
          mistakeReason: 'Accepted Equivalent (Hindi Matra/Hyphen/Symbol)',
        });
        mIdx++;
        tIdx++;
        continue;
      }

      // 3. No Space Between Two Words (Full Mistake - Image 1, Rule 5)
      // e.g. student typed 'inthe' when expected was 'in' and 'the'
      if (mIdx + 1 < masterWords.length) {
        const joinedExpected = stripPunctuation(expected + masterWords[mIdx + 1]).toLowerCase();
        const cleanTyp = stripPunctuation(typed).toLowerCase();
        if (joinedExpected === cleanTyp) {
          fullMistakes += 1;
          diffAnalysis.push({
            expected: `${expected} ${masterWords[mIdx + 1]}`,
            typed,
            status: 'wrong',
            mistakeType: 'full',
            mistakeReason: 'Full Mistake: No space between words',
          });
          mIdx += 2;
          tIdx++;
          continue;
        }
      }

      // 4. Check Half Mistakes (Image 2)
      // Rule 2: Small letter at beginning of sentence (Half Mistake)
      if (isSentenceBeginningSmallLetter(expected, typed, isCurSentenceStart)) {
        halfMistakes++;
        diffAnalysis.push({
          expected,
          typed,
          status: 'wrong',
          isHalfMistake: true,
          mistakeType: 'half',
          mistakeReason: 'Half Mistake: Small letter at beginning of sentence',
        });
        mIdx++;
        tIdx++;
        continue;
      }

      // Rule 1: Singular or Plural noun mismatch (Half Mistake)
      if (isSingularPluralMismatch(expected, typed)) {
        halfMistakes++;
        diffAnalysis.push({
          expected,
          typed,
          status: 'wrong',
          isHalfMistake: true,
          mistakeType: 'half',
          mistakeReason: 'Half Mistake: Singular / Plural noun mismatch',
        });
        mIdx++;
        tIdx++;
        continue;
      }

      // 5. Lookahead for Omission vs Addition vs Substitution
      const cleanExp = stripPunctuation(expected).toLowerCase();
      const cleanTyp = stripPunctuation(typed).toLowerCase();

      // Check if capitalization error inside sentence (Full Mistake - Image 1, Rule 4)
      if (cleanExp === cleanTyp && expected !== typed) {
        fullMistakes++;
        diffAnalysis.push({
          expected,
          typed,
          status: 'wrong',
          mistakeType: 'full',
          mistakeReason: 'Full Mistake: Wrong use of capital/small letter',
        });
        mIdx++;
        tIdx++;
        continue;
      }

      // Check omission (missing word)
      const nextExpectedMatches =
        mIdx + 1 < masterWords.length &&
        (masterWords[mIdx + 1] === typed ||
          stripPunctuation(masterWords[mIdx + 1]).toLowerCase() === cleanTyp);

      // Check addition (extra word)
      const nextTypedMatches =
        tIdx + 1 < typedWords.length &&
        (expected === typedWords[tIdx + 1] ||
          cleanExp === stripPunctuation(typedWords[tIdx + 1]).toLowerCase());

      if (nextExpectedMatches) {
        // Omission of a word (Full Mistake - Image 1, Rule 1)
        fullMistakes++;
        diffAnalysis.push({
          expected,
          typed: '',
          status: 'missing',
          mistakeType: 'full',
          mistakeReason: 'Full Mistake: Omission of word',
        });
        mIdx++;
      } else if (nextTypedMatches) {
        // Addition of a word (Full Mistake - Image 1, Rule 3)
        fullMistakes++;
        diffAnalysis.push({
          expected: '',
          typed,
          status: 'extra',
          mistakeType: 'full',
          mistakeReason: 'Full Mistake: Addition of extra word',
        });
        tIdx++;
      } else {
        // Substitution of a word (Full Mistake - Image 1, Rule 2)
        fullMistakes++;
        diffAnalysis.push({
          expected,
          typed,
          status: 'wrong',
          mistakeType: 'full',
          mistakeReason: 'Full Mistake: Substitution of word',
        });
        mIdx++;
        tIdx++;
      }
    } else if (mIdx < masterWords.length) {
      // Remaining expected words were omitted
      fullMistakes++;
      diffAnalysis.push({
        expected,
        typed: '',
        status: 'missing',
        mistakeType: 'full',
        mistakeReason: 'Full Mistake: Omission of word',
      });
      mIdx++;
    } else {
      // Remaining typed words are extra additions
      fullMistakes++;
      diffAnalysis.push({
        expected: '',
        typed,
        status: 'extra',
        mistakeType: 'full',
        mistakeReason: 'Full Mistake: Addition of extra word',
      });
      tIdx++;
    }
  }

  // Add space before full stop errors as full mistakes
  if (spaceBeforeFullStopCount > 0) {
    fullMistakes += spaceBeforeFullStopCount;
  }

  // Official SSC Steno & Court Formula: Total Mistakes = Full Mistakes + (Half Mistakes * 0.5)
  const totalMistakes = fullMistakes + halfMistakes * 0.5;
  const totalMasterWords = masterWords.length || 1;
  const typedCharCount = typedText.length;

  const grossWpm = Math.round((typedCharCount / 5) / timeMinutes);
  const netWpm = Math.max(0, Math.round(grossWpm - (totalMistakes / timeMinutes)));

  const accuracy = Math.max(
    0,
    Math.min(
      100,
      Math.round(((totalMasterWords - totalMistakes) / totalMasterWords) * 10000) / 100
    )
  );

  const mistakePercentage = Math.round((totalMistakes / totalMasterWords) * 10000) / 100;

  // SSC Steno standard criteria: Pass if mistake percentage <= 7.0% (UR) or 10.0% (OBC/SC/ST)
  const passed = mistakePercentage <= 7.0 && netWpm >= 20;

  return {
    totalWordsMaster: totalMasterWords,
    typedWordsCount: typedWords.length,
    grossWpm,
    netWpm,
    accuracy,
    correctWords: correctCount,
    fullMistakes,
    halfMistakes,
    totalMistakes,
    mistakePercentage,
    passed,
    spaceBeforeFullStopCount,
    diffAnalysis,
  };
}
