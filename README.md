# CSV reader with span-based field parsing

[![make.fun CSV reader bounty](https://make.fun/badge/csv-reader-speed-01-run-20261121.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)
[![Rank](https://make.fun/badge/csv-reader-speed-01-run-20261121/mrbuho-O/csv-reader-spans/rank.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)
[![Reward](https://make.fun/badge/csv-reader-speed-01-run-20261121/mrbuho-O/csv-reader-spans/reward.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)

`run(input)` reads CSV into strings and reports malformed records according to
make.fun's `csv-reader` 1.0.0 rules. The parser slices uninterrupted field text
in one operation and joins spans when it has to remove or replace a character.

## Run locally

Use Node.js 22. Put `cases.json` in an `input` folder and create an `output`
folder. Set `MAKEFUN_INPUT_DIR` to `input` and `MAKEFUN_OUTPUT_DIR` to `output`,
then run `node main.ts`. The program writes `output/answers.json` in input order.

The parser matched all six published practice cases and 50,020 generated edge
cases against the reference implementation before submission.
