const COMMA = 44;
const QUOTE = 34;
const LF = 10;
const CR = 13;

export function run(input) {
  const text = String(input.text);
  const header = input.header === true;
  const end = text.length;
  const rows = [];
  const errors = [];
  let columns = null;
  let width = -1;
  let cursor = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let line = 1;

  while (cursor < end) {
    const first = text.charCodeAt(cursor);
    if (first === LF || (first === CR && text.charCodeAt(cursor + 1) === LF)) {
      cursor += first === LF ? 1 : 2;
      line += 1;
      continue;
    }

    const startLine = line;
    const row = header && columns === null ? null : rows.length;
    const fields = [];
    let separator;
    let quoted;

    do {
      let value = '';
      let closedQuote = false;
      quoted = text.charCodeAt(cursor) === QUOTE;
      if (quoted) {
        const opening = cursor++;
        let start = cursor;
        let innerLines = 0;

        while (cursor < end) {
          const character = text.charCodeAt(cursor);
          if (character === QUOTE) {
            value += text.slice(start, cursor++);
            if (text.charCodeAt(cursor) !== QUOTE) {
              closedQuote = true;
              break;
            }
            value += '"';
            start = ++cursor;
          } else if (character === CR) {
            value += text.slice(start, cursor) + '\n';
            cursor += text.charCodeAt(cursor + 1) === LF ? 2 : 1;
            start = cursor;
            innerLines += 1;
          } else {
            if (character === LF) innerLines += 1;
            cursor += 1;
          }
        }

        if (closedQuote) {
          line += innerLines;
        } else {
          // Restart at the literal opening quote so line and field boundaries
          // inside the unclosed field are handled by the unquoted scanner.
          cursor = opening;
          value = '';
          errors.push({code: 'unterminated_quote', line: startLine, row});
        }
      }

      let start = cursor;
      const prefixLength = value.length;
      separator = -1;
      while (cursor < end) {
        const character = text.charCodeAt(cursor);
        if (character === COMMA || character === LF) {
          separator = character;
          break;
        }
        if (character !== CR) {
          cursor += 1;
          continue;
        }
        if (text.charCodeAt(cursor + 1) === LF) {
          separator = CR;
          break;
        }
        value += text.slice(start, cursor);
        start = ++cursor;
        errors.push({code: 'stray_cr', line: startLine, row});
      }
      value += text.slice(start, cursor);
      if (closedQuote && value.length > prefixLength) {
        errors.push({code: 'quote_junk', line: startLine, row});
      }
      fields.push(value);
      if (separator === COMMA) {
        cursor += 1;
      } else if (separator !== -1) {
        cursor += separator === CR ? 2 : 1;
        line += 1;
      }
    } while (separator === COMMA);

    if (fields.length === 1 && fields[0] === '' && !quoted) continue;
    if (width === -1) width = fields.length;
    if (row === null) {
      columns = fields;
      continue;
    }
    if (fields.length < width) {
      errors.push({code: 'short_row', line: startLine, row, fields: fields.length});
      while (fields.length < width) fields.push('');
    } else if (fields.length > width) {
      errors.push({code: 'long_row', line: startLine, row, extra: fields.splice(width)});
    }
    rows.push(fields);
  }

  return {columns: header ? (columns ?? []) : null, rows, errors};
}
