// Barcode scanners act as a US keyboard and send physical key codes. `KeyboardEvent.key` follows the
// OS layout (e.g. Thai), so we map `KeyboardEvent.code` to US characters to stay layout-independent.
const SYMBOLS: Record<string, [string, string]> = {
  Minus: ['-', '_'],
  Equal: ['=', '+'],
  BracketLeft: ['[', '{'],
  BracketRight: [']', '}'],
  Backslash: ['\\', '|'],
  Semicolon: [';', ':'],
  Quote: ["'", '"'],
  Comma: [',', '<'],
  Period: ['.', '>'],
  Slash: ['/', '?'],
  Backquote: ['`', '~'],
  Space: [' ', ' '],
  NumpadDecimal: ['.', '.'],
  NumpadSubtract: ['-', '-'],
  NumpadAdd: ['+', '+'],
  NumpadMultiply: ['*', '*'],
  NumpadDivide: ['/', '/'],
};

const SHIFTED_DIGITS = ')!@#$%^&*(';

export const keyCodeToChar = (code: string, shift: boolean): string | null => {
  const letter = /^Key([A-Z])$/.exec(code);
  if (letter) return shift ? letter[1] : letter[1].toLowerCase();

  const digit = /^Digit([0-9])$/.exec(code);
  if (digit) return shift ? SHIFTED_DIGITS[Number(digit[1])] : digit[1];

  const numpad = /^Numpad([0-9])$/.exec(code);
  if (numpad) return numpad[1];

  const symbol = SYMBOLS[code];
  return symbol ? symbol[shift ? 1 : 0] : null;
};
