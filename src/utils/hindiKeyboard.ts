// Remington Gail (Mangal Unicode) mapping for standard QWERTY keys

export interface KeyMapEntry {
  normal: string;
  shift: string;
  code: string;
  labelEn: string;
}

// Remington Gail Key map
export const REMINGTON_GAIL_MAP: Record<string, { normal: string; shift: string }> = {
  // Row 1 (Numbers)
  '`': { normal: '़', shift: 'ॅ' },
  '1': { normal: '1', shift: '!' },
  '2': { normal: '2', shift: 'ऍ' },
  '3': { normal: '3', shift: '्र' },
  '4': { normal: '4', shift: 'र्' },
  '5': { normal: '5', shift: 'ज्ञ' },
  '6': { normal: '6', shift: 'त्र' },
  '7': { normal: '7', shift: 'क्ष' },
  '8': { normal: '8', shift: 'श्र' },
  '9': { normal: '9', shift: '(' },
  '0': { normal: '0', shift: ')' },
  '-': { normal: '-', shift: 'ः' },
  '=': { normal: 'ृ', shift: 'ऋ' },

  // Row 2 (QWERTYUIOP)
  'q': { normal: 'ु', shift: 'ू' },
  'w': { normal: 'ू', shift: 'ॅ' },
  'e': { normal: 'म', shift: 'म्' },
  'r': { normal: 'त', shift: 'त्' },
  't': { normal: 'ज', shift: 'ज्' },
  'y': { normal: 'ल', shift: 'ल्' },
  'u': { normal: 'न', shift: 'न्' },
  'i': { normal: 'प', shift: 'प्' },
  'o': { normal: 'व', shift: 'व्' },
  'p': { normal: 'च', shift: 'च्' },
  '[': { normal: 'ख', shift: 'ख्' },
  ']': { normal: ',', shift: ']' },
  '\\': { normal: '?', shift: '। ' },

  // Row 3 (ASDFGHJKL)
  'a': { normal: 'ं', shift: 'ं' },
  's': { normal: 'े', shift: 'ै' },
  'd': { normal: 'क', shift: 'क्' },
  'f': { normal: 'ि', shift: 'थ्' },
  'g': { normal: 'ह', shift: 'भ्' },
  'h': { normal: 'ी', shift: 'भ' },
  'j': { normal: 'र', shift: 'श्र' },
  'k': { normal: 'ा', shift: 'ज्ञ' },
  'l': { normal: 'स', shift: 'स्' },
  ';': { normal: 'य', shift: 'य्' },
  "'": { normal: 'श', shift: 'ष्' },

  // Row 4 (ZXCVBNM)
  'z': { normal: '्र', shift: 'र्' },
  'x': { normal: 'ग', shift: 'ग्' },
  'c': { normal: 'ब', shift: 'ब्' },
  'v': { normal: 'अ', shift: 'ट' },
  'b': { normal: 'इ', shift: 'ठ' },
  'n': { normal: 'द', shift: 'ड' },
  'm': { normal: 'उ', shift: 'ढ' },
  ',': { normal: 'ए', shift: 'ण' },
  '.': { normal: 'ण्', shift: 'ध' },
  '/': { normal: 'ध्', shift: '?' },
};

// Inscript Key map
export const INSCRIPT_MAP: Record<string, { normal: string; shift: string }> = {
  'q': { normal: 'ौ', shift: 'औ' },
  'w': { normal: 'ै', shift: 'ऐ' },
  'e': { normal: 'ा', shift: 'आ' },
  'r': { normal: 'ी', shift: 'ई' },
  't': { normal: 'ू', shift: 'ऊ' },
  'y': { normal: 'ब', shift: 'भ' },
  'u': { normal: 'ह', shift: 'ङ' },
  'i': { normal: 'ग', shift: 'घ' },
  'o': { normal: 'द', shift: 'ध' },
  'p': { normal: 'ज', shift: 'झ' },
  '[': { normal: 'ड', shift: 'ढ' },
  ']': { normal: '़', shift: 'ञ' },
  'a': { normal: 'ो', shift: 'ओ' },
  's': { normal: 'े', shift: 'ए' },
  'd': { normal: '्', shift: 'अ' },
  'f': { normal: 'ि', shift: 'इ' },
  'g': { normal: 'ु', shift: 'उ' },
  'h': { normal: 'प', shift: 'फ' },
  'j': { normal: 'र', shift: 'ऱ' },
  'k': { normal: 'क', shift: 'ख' },
  'l': { normal: 'त', shift: 'थ' },
  ';': { normal: 'च', shift: 'छ' },
  "'": { normal: 'ट', shift: 'ठ' },
  'z': { normal: 'े', shift: 'ऍ' },
  'x': { normal: 'ं', shift: 'ँ' },
  'c': { normal: 'म', shift: 'ण' },
  'v': { normal: 'न', shift: 'न' },
  'b': { normal: 'व', shift: 'व' },
  'n': { normal: 'ल', shift: 'ळ' },
  'm': { normal: 'स', shift: 'श' },
  ',': { normal: ',', shift: 'ष' },
  '.': { normal: '.', shift: '।' },
};

// Keyboard visual layout definitions
export const KEYBOARD_ROWS = [
  // Number Row
  [
    { code: 'Backquote', labelEn: '`', shiftEn: '~', remNormal: '़', remShift: 'ॅ', insNormal: '़', insShift: 'ॅ' },
    { code: 'Digit1', labelEn: '1', shiftEn: '!', remNormal: '1', remShift: '!', insNormal: '1', insShift: 'ऍ' },
    { code: 'Digit2', labelEn: '2', shiftEn: '@', remNormal: '2', remShift: 'ऍ', insNormal: '2', insShift: 'ॅ' },
    { code: 'Digit3', labelEn: '3', shiftEn: '#', remNormal: '3', remShift: '्र', insNormal: '3', insShift: '्र' },
    { code: 'Digit4', labelEn: '4', shiftEn: '$', remNormal: '4', remShift: 'र्', insNormal: '4', insShift: 'र्' },
    { code: 'Digit5', labelEn: '5', shiftEn: '%', remNormal: '5', remShift: 'ज्ञ', insNormal: '5', insShift: 'ज्ञ' },
    { code: 'Digit6', labelEn: '6', shiftEn: '^', remNormal: '6', remShift: 'त्र', insNormal: '6', insShift: 'त्र' },
    { code: 'Digit7', labelEn: '7', shiftEn: '&', remNormal: '7', remShift: 'क्ष', insNormal: '7', insShift: 'क्ष' },
    { code: 'Digit8', labelEn: '8', shiftEn: '*', remNormal: '8', remShift: 'श्र', insNormal: '8', insShift: 'श्र' },
    { code: 'Digit9', labelEn: '9', shiftEn: '(', remNormal: '9', remShift: '(', insNormal: '9', insShift: '(' },
    { code: 'Digit0', labelEn: '0', shiftEn: ')', remNormal: '0', remShift: ')', insNormal: '0', insShift: ')' },
    { code: 'Minus', labelEn: '-', shiftEn: '_', remNormal: '-', remShift: 'ः', insNormal: '-', insShift: 'ः' },
    { code: 'Equal', labelEn: '=', shiftEn: '+', remNormal: 'ृ', remShift: 'ऋ', insNormal: 'ृ', insShift: 'ऋ' },
    { code: 'Backspace', labelEn: 'Backspace', special: true, width: 'w-20' },
  ],
  // QWERTY Row
  [
    { code: 'Tab', labelEn: 'Tab', special: true, width: 'w-14' },
    { code: 'KeyQ', labelEn: 'Q', remNormal: 'ु', remShift: 'ू', insNormal: 'ौ', insShift: 'औ' },
    { code: 'KeyW', labelEn: 'W', remNormal: 'ू', remShift: 'ॅ', insNormal: 'ै', insShift: 'ऐ' },
    { code: 'KeyE', labelEn: 'E', remNormal: 'म', remShift: 'म्', insNormal: 'ा', insShift: 'आ' },
    { code: 'KeyR', labelEn: 'R', remNormal: 'त', remShift: 'त्', insNormal: 'ी', insShift: 'ई' },
    { code: 'KeyT', labelEn: 'T', remNormal: 'ज', remShift: 'ज्', insNormal: 'ू', insShift: 'ऊ' },
    { code: 'KeyY', labelEn: 'Y', remNormal: 'ल', remShift: 'ल्', insNormal: 'ब', insShift: 'भ' },
    { code: 'KeyU', labelEn: 'U', remNormal: 'न', remShift: 'न्', insNormal: 'ह', insShift: 'ङ' },
    { code: 'KeyI', labelEn: 'I', remNormal: 'प', remShift: 'प्', insNormal: 'ग', insShift: 'घ' },
    { code: 'KeyO', labelEn: 'O', remNormal: 'व', remShift: 'व्', insNormal: 'द', insShift: 'ध' },
    { code: 'KeyP', labelEn: 'P', remNormal: 'च', remShift: 'च्', insNormal: 'ज', insShift: 'झ' },
    { code: 'BracketLeft', labelEn: '[', shiftEn: '{', remNormal: 'ख', remShift: 'ख्', insNormal: 'ड', insShift: 'ढ' },
    { code: 'BracketRight', labelEn: ']', shiftEn: '}', remNormal: ',', remShift: ']', insNormal: '़', insShift: 'ञ' },
    { code: 'Backslash', labelEn: '\\', shiftEn: '|', remNormal: '?', remShift: '।', insNormal: 'ॉ', insShift: 'ऑ' },
  ],
  // ASDF Row
  [
    { code: 'CapsLock', labelEn: 'Caps', special: true, width: 'w-16' },
    { code: 'KeyA', labelEn: 'A', remNormal: 'ं', remShift: 'ं', insNormal: 'ो', insShift: 'ओ' },
    { code: 'KeyS', labelEn: 'S', remNormal: 'े', remShift: 'ै', insNormal: 'े', insShift: 'ए' },
    { code: 'KeyD', labelEn: 'D', remNormal: 'क', remShift: 'क्', insNormal: '्', insShift: 'अ' },
    { code: 'KeyF', labelEn: 'F', remNormal: 'ि', remShift: 'थ्', insNormal: 'ि', insShift: 'इ' },
    { code: 'KeyG', labelEn: 'G', remNormal: 'ह', remShift: 'भ्', insNormal: 'ु', insShift: 'उ' },
    { code: 'KeyH', labelEn: 'H', remNormal: 'ी', remShift: 'भ', insNormal: 'प', insShift: 'फ' },
    { code: 'KeyJ', labelEn: 'J', remNormal: 'र', remShift: 'श्र', insNormal: 'र', insShift: 'ऱ' },
    { code: 'KeyK', labelEn: 'K', remNormal: 'ा', remShift: 'ज्ञ', insNormal: 'क', insShift: 'ख' },
    { code: 'KeyL', labelEn: 'L', remNormal: 'स', remShift: 'स्', insNormal: 'त', insShift: 'थ' },
    { code: 'Semicolon', labelEn: ';', shiftEn: ':', remNormal: 'य', remShift: 'य्', insNormal: 'च', insShift: 'छ' },
    { code: 'Quote', labelEn: "'", shiftEn: '"', remNormal: 'श', remShift: 'ष्', insNormal: 'ट', insShift: 'ठ' },
    { code: 'Enter', labelEn: 'Enter', special: true, width: 'w-20' },
  ],
  // ZXCV Row
  [
    { code: 'ShiftLeft', labelEn: 'Shift', special: true, width: 'w-20' },
    { code: 'KeyZ', labelEn: 'Z', remNormal: '्र', remShift: 'र्', insNormal: 'े', insShift: 'ऍ' },
    { code: 'KeyX', labelEn: 'X', remNormal: 'ग', remShift: 'ग्', insNormal: 'ं', insShift: 'ँ' },
    { code: 'KeyC', labelEn: 'C', remNormal: 'ब', remShift: 'ब्', insNormal: 'म', insShift: 'ण' },
    { code: 'KeyV', labelEn: 'V', remNormal: 'अ', remShift: 'ट', insNormal: 'न', insShift: 'न' },
    { code: 'KeyB', labelEn: 'B', remNormal: 'इ', remShift: 'ठ', insNormal: 'व', insShift: 'व' },
    { code: 'KeyN', labelEn: 'N', remNormal: 'द', remShift: 'ड', insNormal: 'ल', insShift: 'ळ' },
    { code: 'KeyM', labelEn: 'M', remNormal: 'उ', remShift: 'ढ', insNormal: 'स', insShift: 'श' },
    { code: 'Comma', labelEn: ',', shiftEn: '<', remNormal: 'ए', remShift: 'ण', insNormal: ',', insShift: 'ष' },
    { code: 'Period', labelEn: '.', shiftEn: '>', remNormal: 'ण्', remShift: 'ध', insNormal: '.', insShift: '।' },
    { code: 'Slash', labelEn: '/', shiftEn: '?', remNormal: 'ध्', remShift: '?', insNormal: 'य', insShift: 'य़' },
    { code: 'ShiftRight', labelEn: 'Shift', special: true, width: 'w-24' },
  ],
  // Space Row
  [
    { code: 'ControlLeft', labelEn: 'Ctrl', special: true, width: 'w-14' },
    { code: 'AltLeft', labelEn: 'Alt', special: true, width: 'w-14' },
    { code: 'Space', labelEn: 'Space Bar', special: true, width: 'flex-1' },
    { code: 'AltRight', labelEn: 'Alt Gr', special: true, width: 'w-14' },
    { code: 'ControlRight', labelEn: 'Ctrl', special: true, width: 'w-14' },
  ],
];

// Alt Code Table for Remington Gail / KrutiDev in Hindi exams
export const HINDI_SPECIAL_CODES = [
  { code: 'Alt + 0161', char: 'ँ', name: 'Chandrabindu' },
  { code: 'Alt + 0216', char: 'क्त', name: 'Kta sanyuktakshar' },
  { code: 'Alt + 0228', char: 'द्व', name: 'Dva sanyukt' },
  { code: 'Alt + 0227', char: 'द्म', name: 'Dma sanyukt' },
  { code: 'Alt + 0226', char: 'द्य', name: 'Dya sanyukt' },
  { code: 'Alt + 0229', char: 'दृ', name: 'Dri matra' },
  { code: 'Alt + 0221', char: 'ड्ढ', name: 'D-dha sanyukt' },
  { code: 'Alt + 0188', char: 'द्ध', name: 'D-dha sanyukt' },
  { code: 'Alt + 0170', char: 'ट्र', name: 'Tra' },
  { code: 'Alt + 0171', char: 'ड्र', name: 'Dra' },
  { code: 'Alt + 0165', char: '¥', name: 'Nukta mark' },
  { code: 'Alt + 0163', char: '£', name: 'Virama' },
];
