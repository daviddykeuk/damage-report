# Damage Report
Damage report can be run in your CI/CD pipeline to check the results of [Artillery.io](https://artillery.io) reports.

## Installation
Easy, peasy
```bash
$ npm install -g damage-report
```

## Running
Run an Artillery load test and output the results to a file
```bash
$ artillery run my-load-test.yaml -o performance.results.json
```
Afterward this is completed run a damage report
```bash
$ damage-report --file ./performance.results.json --median 50 --p95 95 --p99 100 --rps 50
```

If rules are broken then the process will return an exit code of 1

## Options
```bash
$ damage-report --help
```
* **--median**: Median threshold in ms
* **--p95**: p95 threshold in ms
* **--p99**: p99 threshold in ms
* **--rps**: Mean requests per seconds required
* **--file**: Location of the artillery results json (default: "./performance.results.json")
## Example
```text
 _____                                                               _
|  __ \                                                             | |
| |  | | __ _ _ __ ___   __ _  __ _  ___   _ __ ___ _ __   ___  _ __| |_
| |  | |/ _` | '_ ` _ \ / _` |/ _` |/ _ \ | '__/ _ \ '_ \ / _ \| '__| __|
| |__| | (_| | | | | | | (_| | (_| |  __/ | | |  __/ |_) | (_) | |  | |_
|_____/ \__,_|_| |_| |_|\__,_|\__, |\___| |_|  \___| .__/ \___/|_|   \__|
                               __/ |               | |
                              |___/                |_|
Version: x.x.x

Checking artillery results in ./performance.results.json for:

- Any errors
- Any 50x result codes
- Median response time < 50ms
- p95 response time < 95ms
- p99 response time < 100ms
- Requests per second > 50

Results:

✓ No errors found in results
✓ No 50x error codes found in results

|▓                             |         |    ✓   Median latency below threshold of 50ms at: 1.7ms
|▓▓▓                           |         |    ✓   p95 latency below threshold of 95ms at: 9.8ms
|▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             |         |    ✓   p99 latency below threshold of 100ms at: 59.7ms

|▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓|▓▓▓▓▓    |    ✓   rps above threshold of 50 at: 59.76
```