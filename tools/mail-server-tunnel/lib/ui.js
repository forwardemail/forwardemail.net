/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import process from 'node:process';
import readline from 'node:readline';

//
// What the command line prints and asks: colors, marks, a spinner, and the
// questions of the guided setup (text, secret, yes/no, pick one, pick some).
//
// In a terminal the questions are answered with the keyboard (arrows, space,
// Enter). When the input is not a terminal (a pipe, a script) each question
// reads one line instead, so the same setup can be scripted.
//

// Raised when a question is cancelled (Ctrl+C, Esc, or the input ended)
export class CancelError extends Error {
  constructor(message = 'Cancelled') {
    super(message);
    this.name = 'CancelError';
    this.isCancel = true;
  }
}

//
// Text that came from elsewhere (the API, DNS, a mail server, a file) is
// printed without control characters, so it cannot move the cursor, change
// colors or rewrite what is on the screen.
//
export function clean(value) {
  return (
    String(value ?? '')
      // eslint-disable-next-line no-control-regex
      .replace(/\u001B\[[\d;?]*[ -/]*[@-~]/g, '')
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '')
  );
}

// Colors follow NO_COLOR and FORCE_COLOR, and are off when not a terminal
export function hasColor(stream = process.stdout, env = process.env) {
  if (env.NO_COLOR) return false;
  if (env.FORCE_COLOR)
    return env.FORCE_COLOR !== '0' && env.FORCE_COLOR !== 'false';
  return Boolean(stream?.isTTY) && env.TERM !== 'dumb';
}

// Older Windows consoles cannot draw the marks used elsewhere
export function hasUnicode(env = process.env, platform = process.platform) {
  if (platform !== 'win32') return env.TERM !== 'linux';
  return Boolean(
    env.WT_SESSION ||
      env.TERM_PROGRAM === 'vscode' ||
      env.ConEmuTask ||
      env.TERM === 'xterm-256color'
  );
}

const CODES = {
  bold: [1, 22],
  dim: [2, 22],
  underline: [4, 24],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  cyan: [36, 39],
  gray: [90, 39]
};

export function createStyle({ color = hasColor(), unicode = hasUnicode() }) {
  const style = {};
  for (const [name, [open, close]] of Object.entries(CODES))
    style[name] = (text) =>
      color ? `\u001B[${open}m${text}\u001B[${close}m` : String(text);
  style.marks = unicode
    ? {
        ok: '✔',
        bad: '✖',
        warn: '▲',
        info: '●',
        ask: '?',
        pointer: '❯',
        on: '◉',
        off: '◯',
        brand: '◆',
        arrow: '›',
        dot: '·',
        mask: '•',
        cursor: '▏',
        line: '─',
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
      }
    : {
        ok: '√',
        bad: 'x',
        warn: '!',
        info: '*',
        ask: '?',
        pointer: '>',
        on: '(x)',
        off: '( )',
        brand: '*',
        arrow: '>',
        dot: '-',
        mask: '*',
        cursor: '_',
        line: '-',
        frames: ['-', '\\', '|', '/']
      };
  return style;
}

// The closest of the known words to what was typed, when it is close enough
export function suggest(word, known) {
  // (two letters typed in the wrong order count as one mistake)
  const distance = (a, b) => {
    const rows = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) =>
        i === 0 ? j : j === 0 ? i : 0
      )
    );
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        rows[i][j] = Math.min(
          rows[i - 1][j] + 1,
          rows[i][j - 1] + 1,
          rows[i - 1][j - 1] + cost
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
          rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }

    return rows[a.length][b.length];
  };

  let best;
  for (const candidate of known) {
    const score = candidate.startsWith(word) ? 0 : distance(word, candidate);
    if (!best || score < best.score) best = { candidate, score };
  }

  return best && best.score <= Math.max(1, Math.floor(word.length / 3))
    ? best.candidate
    : undefined;
}

//
// The terminal: `input` and `output` are streams (the process's own by
// default; tests pass theirs).
//
export function createUi({
  input = process.stdin,
  output = process.stdout,
  env = process.env,
  color,
  unicode
} = {}) {
  const style = createStyle({
    color: color ?? hasColor(output, env),
    unicode: unicode ?? hasUnicode(env)
  });
  const { marks } = style;
  const isInteractive = Boolean(
    input.isTTY && output.isTTY && typeof input.setRawMode === 'function'
  );
  const write = (text) => output.write(text);
  const line = (text = '') => write(`${text}\n`);

  // ---- output -----------------------------------------------------------

  const ui = {
    style,
    isInteractive,
    line,
    ok: (message) => line(`  ${style.green(marks.ok)} ${clean(message)}`),
    bad: (message) => line(`  ${style.red(marks.bad)} ${clean(message)}`),
    warn: (message) => line(`  ${style.yellow(marks.warn)} ${clean(message)}`),
    info: (message) => line(`  ${style.cyan(marks.info)} ${clean(message)}`),
    note: (message) => line(`    ${style.gray(clean(message))}`),
    // (a command or an address to copy, set apart from the sentence)
    code: (text) => line(`      ${style.cyan(clean(text))}`),
    title(name, detail) {
      line();
      line(
        `${style.cyan(style.bold(`${marks.brand} ${clean(name)}`))}${
          detail ? ` ${style.gray(clean(detail))}` : ''
        }`
      );
    },
    step(number, total, name) {
      line();
      line(
        `${style.gray(`Step ${number} of ${total}`)} ${style.gray(
          marks.dot
        )} ${style.bold(clean(name))}`
      );
    },
    // Two columns, e.g. the summary before the settings are saved
    table(rows) {
      const width = Math.max(...rows.map(([key]) => key.length));
      for (const [key, value] of rows)
        line(`  ${style.gray(key.padEnd(width))}  ${clean(value)}`);
    }
  };

  //
  // Runs `task` under a spinner and leaves one line with how it went:
  // `done(result)` gives the line of a success, a thrown error its own
  // message. Without a terminal only that line is printed.
  //
  ui.spin = async (label, task, done) => {
    let timer;
    let frame = 0;
    const draw = () =>
      write(
        `\r\u001B[2K  ${style.cyan(
          marks.frames[frame++ % marks.frames.length]
        )} ${clean(label)}`
      );
    if (isInteractive) {
      write('\u001B[?25l');
      draw();
      timer = setInterval(draw, 80);
      timer.unref?.();
    }

    const stop = () => {
      if (!isInteractive) return;
      clearInterval(timer);
      write('\r\u001B[2K\u001B[?25h');
    };

    try {
      const result = await task();
      stop();
      const message = typeof done === 'function' ? done(result) : done ?? label;
      if (message) ui.ok(message);
      return result;
    } catch (error) {
      stop();
      throw error;
    }
  };

  // ---- questions, one line each (not a terminal) ------------------------

  let reader;
  const lines = [];
  const waiting = [];
  let isEnded = false;
  const readLine = () => {
    if (!reader) {
      reader = readline.createInterface({ input, terminal: false });
      reader.on('line', (text) => {
        const next = waiting.shift();
        if (next) next.resolve(text);
        else lines.push(text);
      });
      reader.on('close', () => {
        isEnded = true;
        for (const next of waiting.splice(0))
          next.reject(new CancelError('The input ended before every answer'));
      });
    }

    if (lines.length > 0) return Promise.resolve(lines.shift());
    if (isEnded)
      return Promise.reject(
        new CancelError('The input ended before every answer')
      );
    return new Promise((resolve, reject) => {
      waiting.push({ resolve, reject });
    });
  };

  ui.close = () => {
    reader?.close();
  };

  // ---- questions, with the keyboard (a terminal) ------------------------

  //
  // Draws `render()` (lines of text), calls `onKey` for each key, and
  // redraws until `onKey` returns `{ value }`. The question is then
  // replaced with the one line of `summary(value)`.
  //
  const interact = ({ render, onKey, summary }) =>
    new Promise((resolve, reject) => {
      let height = 0;
      const clear = () => {
        if (height > 0) write(`\u001B[${height}A`);
        write('\r\u001B[0J');
      };

      const draw = () => {
        clear();
        const text = render();
        write(`${text}\n`);
        height = text.split('\n').length;
      };

      const finish = (error, value) => {
        input.off('keypress', listener);
        input.setRawMode(false);
        input.pause();
        clear();
        write('\u001B[?25h');
        if (error) return reject(error);
        line(summary(value));
        resolve(value);
      };

      const listener = (text, key = {}) => {
        if ((key.ctrl && key.name === 'c') || (key.ctrl && key.name === 'd'))
          return finish(new CancelError());
        let result;
        try {
          result = onKey(text, key);
        } catch (error) {
          return finish(error);
        }

        if (result && 'value' in result) return finish(null, result.value);
        draw();
      };

      readline.emitKeypressEvents(input);
      write('\u001B[?25l');
      input.setRawMode(true);
      input.resume();
      input.on('keypress', listener);
      draw();
    });

  const question = (message) =>
    `${style.cyan(marks.ask)} ${style.bold(clean(message))}`;
  const answered = (message, value) =>
    `${style.green(marks.ok)} ${style.bold(clean(message))} ${style.gray(
      marks.dot
    )} ${style.cyan(clean(value))}`;
  const hint = (text) => style.gray(text);

  //
  // A line of text. `validate(value)` returns a message when the answer
  // cannot be used; the question is then asked again.
  //
  ui.text = async (
    message,
    { defaultValue = '', validate, secret = false, help } = {}
  ) => {
    const check = (value) => {
      const problem = validate ? validate(value) : undefined;
      return typeof problem === 'string' ? problem : undefined;
    };

    if (!isInteractive) {
      for (;;) {
        write(
          `${clean(message)}${
            defaultValue && !secret ? ` [${clean(defaultValue)}]` : ''
          }: `
        );
        const value = (await readLine()).trim() || defaultValue;
        if (!input.isTTY) line();
        const problem = check(value);
        if (!problem) return value;
        ui.bad(problem);
        // (the same answer would come again from a script)
        if (isEnded && lines.length === 0) throw new CancelError(problem);
      }
    }

    let value = '';
    let problem;
    const shown = () =>
      secret ? marks.mask.repeat(Math.min(value.length, 40)) : clean(value);
    return interact({
      render: () =>
        [
          `${question(message)} ${
            value
              ? shown()
              : defaultValue && !secret
              ? hint(`(${clean(defaultValue)}) `)
              : ''
          }${style.cyan(marks.cursor)}`,
          problem
            ? `  ${style.red(`${marks.bad} ${clean(problem)}`)}`
            : help
            ? `  ${hint(help)}`
            : undefined
        ]
          .filter((item) => item !== undefined)
          .join('\n'),
      onKey(text, key) {
        if (key.name === 'escape') throw new CancelError();
        if (key.name === 'return' || key.name === 'enter') {
          const answer = value.trim() || defaultValue;
          problem = check(answer);
          if (!problem) return { value: answer };
          return undefined;
        }

        problem = undefined;
        if (key.name === 'backspace') value = [...value].slice(0, -1).join('');
        else if (key.ctrl && key.name === 'u') value = '';
        else if (key.ctrl && key.name === 'w')
          value = value.replace(/\S*\s*$/, '');
        // (typed or pasted text; never a control or an escape sequence)
        else if (text && !key.ctrl && !key.meta && !text.startsWith('\u001B'))
          // eslint-disable-next-line no-control-regex
          value += text.replace(/[\u0000-\u001F\u007F]/g, '');
        return undefined;
      },
      summary: (answer) =>
        answered(
          message,
          secret ? marks.mask.repeat(Math.min(answer.length, 8)) : answer
        )
    });
  };

  // What is typed is never shown (a token, a password)
  ui.secret = (message, options = {}) =>
    ui.text(message, { ...options, secret: true });

  ui.confirm = async (message, defaultValue = true) => {
    if (!isInteractive) {
      for (;;) {
        write(`${clean(message)} (${defaultValue ? 'Y/n' : 'y/N'}): `);
        const value = (await readLine()).trim().toLowerCase();
        if (!input.isTTY) line();
        if (!value) return defaultValue;
        if (/^(y|yes)$/.test(value)) return true;
        if (/^(n|no)$/.test(value)) return false;
        ui.bad('Answer yes or no');
      }
    }

    let value = defaultValue;
    return interact({
      render: () =>
        `${question(message)} ${
          value
            ? `${style.cyan(style.underline('Yes'))} ${hint('/ No')}`
            : `${hint('Yes /')} ${style.cyan(style.underline('No'))}`
        }\n  ${hint('y or n, Enter to confirm')}`,
      onKey(text, key) {
        if (key.name === 'escape') throw new CancelError();
        if (key.name === 'return' || key.name === 'enter') return { value };
        if (/^y$/i.test(text || '')) return { value: true };
        if (/^n$/i.test(text || '')) return { value: false };
        if (
          ['left', 'right', 'up', 'down', 'tab', 'h', 'l', 'j', 'k'].includes(
            key.name
          )
        )
          value = !value;
        return undefined;
      },
      summary: (answer) => answered(message, answer ? 'Yes' : 'No')
    });
  };

  // The rows that fit, around the one the pointer is on
  const getWindow = (count, cursor) => {
    const size = Math.max(3, Math.min(count, (output.rows || 24) - 6));
    const start = Math.max(
      0,
      Math.min(cursor - Math.floor(size / 2), count - size)
    );
    return { start, end: start + size };
  };

  const describe = (choice) =>
    `${clean(choice.label)}${
      choice.hint ? ` ${hint(`(${clean(choice.hint)})`)}` : ''
    }`;

  //
  // One of `choices` ({ value, label, hint }). Without a terminal: its
  // number or its label.
  //
  ui.select = async (message, choices, { defaultValue } = {}) => {
    if (choices.length === 0) throw new Error(`${message}: nothing to choose`);
    let cursor = Math.max(
      0,
      choices.findIndex((choice) => choice.value === defaultValue)
    );

    if (!isInteractive) {
      line(clean(message));
      for (const [index, choice] of choices.entries())
        line(`  ${index + 1}. ${describe(choice)}`);
      for (;;) {
        write(`Number [${cursor + 1}]: `);
        const value = (await readLine()).trim();
        if (!input.isTTY) line();
        if (!value) return choices[cursor].value;
        const found = /^\d+$/.test(value)
          ? choices[Number(value) - 1]
          : choices.find(
              (choice) =>
                String(choice.label).toLowerCase() === value.toLowerCase() ||
                String(choice.value).toLowerCase() === value.toLowerCase()
            );
        if (found) return found.value;
        ui.bad(`Answer with a number from 1 to ${choices.length}`);
      }
    }

    return interact({
      render() {
        const { start, end } = getWindow(choices.length, cursor);
        return [
          question(message),
          ...choices
            .slice(start, end)
            .map((choice, offset) =>
              start + offset === cursor
                ? `${style.cyan(marks.pointer)} ${style.cyan(describe(choice))}`
                : `  ${describe(choice)}`
            ),
          `  ${hint(
            `${
              choices.length > end - start
                ? `${cursor + 1} of ${choices.length}, `
                : ''
            }↑↓ to move, Enter to choose`
          )}`
        ].join('\n');
      },
      onKey(text, key) {
        if (key.name === 'escape') throw new CancelError();
        if (key.name === 'return' || key.name === 'enter')
          return { value: choices[cursor].value };
        if (key.name === 'up' || key.name === 'k')
          cursor = (cursor - 1 + choices.length) % choices.length;
        else if (key.name === 'down' || key.name === 'j' || key.name === 'tab')
          cursor = (cursor + 1) % choices.length;
        else if (/^[1-9]$/.test(text || '') && choices[Number(text) - 1])
          cursor = Number(text) - 1;
        return undefined;
      },
      summary: (value) =>
        answered(
          message,
          choices.find((choice) => choice.value === value).label
        )
    });
  };

  //
  // Any number of `choices`. Without a terminal: numbers or labels with
  // commas between them, or "all".
  //
  ui.multiselect = async (
    message,
    choices,
    { defaultValues = [], required = true } = {}
  ) => {
    if (choices.length === 0) throw new Error(`${message}: nothing to choose`);
    const selected = new Set(
      choices
        .filter((choice) => defaultValues.includes(choice.value))
        .map((choice) => choice.value)
    );

    if (!isInteractive) {
      line(clean(message));
      for (const [index, choice] of choices.entries())
        line(`  ${index + 1}. ${describe(choice)}`);
      const fallback = choices
        .map((choice, index) => (selected.has(choice.value) ? index + 1 : 0))
        .filter(Boolean)
        .join(',');
      for (;;) {
        write(
          `Numbers with commas between them, or "all"${
            fallback ? ` [${fallback}]` : ''
          }: `
        );
        const value = (await readLine()).trim() || fallback;
        if (!input.isTTY) line();
        if (value.toLowerCase() === 'all')
          return choices.map((choice) => choice.value);
        const items = value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        const found = items.map((item) =>
          /^\d+$/.test(item)
            ? choices[Number(item) - 1]
            : choices.find(
                (choice) =>
                  String(choice.label).toLowerCase() === item.toLowerCase() ||
                  String(choice.value).toLowerCase() === item.toLowerCase()
              )
        );
        if (found.every(Boolean) && (found.length > 0 || !required))
          return [...new Set(found.map((choice) => choice.value))];
        ui.bad(
          found.length === 0
            ? 'Choose at least one'
            : `"${items[found.indexOf(undefined)]}" is not in the list`
        );
        if (isEnded && lines.length === 0) throw new CancelError();
      }
    }

    let cursor = 0;
    let problem;
    return interact({
      render() {
        const { start, end } = getWindow(choices.length, cursor);
        return [
          question(message),
          ...choices.slice(start, end).map((choice, offset) => {
            const isOn = selected.has(choice.value);
            const box = isOn ? style.green(marks.on) : style.gray(marks.off);
            return start + offset === cursor
              ? `${style.cyan(marks.pointer)} ${box} ${style.cyan(
                  describe(choice)
                )}`
              : `  ${box} ${describe(choice)}`;
          }),
          problem
            ? `  ${style.red(`${marks.bad} ${problem}`)}`
            : `  ${hint(
                `${selected.size} chosen ${marks.dot} ↑↓ to move, Space to choose, a for all, Enter to confirm`
              )}`
        ].join('\n');
      },
      onKey(text, key) {
        if (key.name === 'escape') throw new CancelError();
        if (key.name === 'return' || key.name === 'enter') {
          if (selected.size === 0 && required) {
            problem = 'Choose at least one with Space';
            return undefined;
          }

          return {
            value: choices
              .filter((choice) => selected.has(choice.value))
              .map((choice) => choice.value)
          };
        }

        problem = undefined;
        if (key.name === 'up' || key.name === 'k')
          cursor = (cursor - 1 + choices.length) % choices.length;
        else if (key.name === 'down' || key.name === 'j' || key.name === 'tab')
          cursor = (cursor + 1) % choices.length;
        else if (key.name === 'space' || text === ' ') {
          const { value } = choices[cursor];
          if (selected.has(value)) selected.delete(value);
          else selected.add(value);
        } else if (text === 'a') {
          const isAll = selected.size === choices.length;
          selected.clear();
          if (!isAll) for (const choice of choices) selected.add(choice.value);
        }

        return undefined;
      },
      summary: (values) =>
        answered(
          message,
          values.length === 0
            ? 'None'
            : choices
                .filter((choice) => values.includes(choice.value))
                .map((choice) => choice.label)
                .join(', ')
        )
    });
  };

  return ui;
}
