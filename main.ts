import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {setFlagsFromString} from 'node:v8';

setFlagsFromString('--no-incremental-marking');
const {run} = await import('./solve.js');

const cases = JSON.parse(readFileSync(join(process.env.MAKEFUN_INPUT_DIR ?? '/input', 'cases.json'), 'utf8')) as {
  input: {text: string; header: boolean};
}[];
const answers = cases.map(({input}) => run(input));
const output = join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'answers.json');
writeFileSync(output, JSON.stringify(answers));
