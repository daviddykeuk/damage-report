#!/usr/bin/env node

var p = require('./package.json');
var flags = require('flags');
var fs = require("fs");
var flags = require("flags");
var colors = require('colors');
var bar = require('./bar');

flags.defineString("median", null, "Median threshold in ms");
flags.defineString("p95", null, "p95 threshold in ms");
flags.defineString("p99", null, "p99 threshold in ms");
flags.defineString("rps", null, "Mean requests per seconds required");
flags.defineString("file", "./performance.results.json", "Location of the artillery results json");

flags.parse();

var exit = 0;

console.info("\n");
console.info(" _____                                                               _    ".yellow);
console.info("|  __ \\                                                             | |   ".yellow);
console.info("| |  | | __ _ _ __ ___   __ _  __ _  ___   _ __ ___ _ __   ___  _ __| |_  ".yellow);
console.info("| |  | |/ _` | '_ ` _ \\ / _` |/ _` |/ _ \\ | '__/ _ \\ '_ \\ / _ \\| '__| __| ".yellow);
console.info("| |__| | (_| | | | | | | (_| | (_| |  __/ | | |  __/ |_) | (_) | |  | |_  ".yellow);
console.info("|_____/ \\__,_|_| |_| |_|\\__,_|\\__, |\\___| |_|  \\___| .__/ \\___/|_|   \\__| ".yellow);
console.info("                               __/ |               | |".yellow);
console.info("                              |___/                |_|".yellow);

console.info("Version: %s", p.version);

console.info("\nChecking artillery results in %s for:\n", flags.get("file"));

console.info("- Any errors");
console.info("- Any 50x result codes");

if (flags.get("median") != null) console.info("- Median response time < %sms", flags.get("median"));
if (flags.get("p95") != null) console.info("- p95 response time < %sms", flags.get("p95"));
if (flags.get("p99") != null) console.info("- p99 response time < %sms", flags.get("p99"));
if (flags.get("rps") != null) console.info("- Requests per second > %s", flags.get("rps"));
console.info("\nResults:\n");

// get the file
var results = fs.readFileSync(flags.get("file"));
results = JSON.parse(results);

// check for generic errors
if (Object.keys(results.aggregate.errors).length > 0) {
	console.error("X ERR!! Errors detected in results: %s".red, JSON.stringify(results.aggregate.errors));
	exit = 1;

} else {
	console.info("✓ No errors found in results".green);
}

// check for 50X errors
if ((results.aggregate.codes['500'] || 0) +
	(results.aggregate.codes['501'] || 0) +
	(results.aggregate.codes['502'] || 0) +
	(results.aggregate.codes['503'] || 0) > 0) {
	console.error("X ERR!! 50x error codes detected in results".red);
	exit = 1;
} else {
	console.info("✓ No 50x error codes found in results".green);
}

console.log("");

// median threshold check
if (flags.get("median") == null) {

} else if (results.aggregate.latency.median > flags.get("median")) {
	console.error(bar(results.aggregate.latency.median, flags.get("median")).red + "    X   ERR!! Median latency above threshold of %sms at: %sms".red, flags.get("median"), results.aggregate.latency.median)
	exit = 1;

} else {
	console.info(bar(results.aggregate.latency.median, flags.get("median")).green + "    ✓   Median latency below threshold of %sms at: %sms".green, flags.get("median"), results.aggregate.latency.median);
}

// 95th percentile threshold check
if (flags.get("p95") == null) {

} else if (results.aggregate.latency.p95 > flags.get("p95")) {
	console.error(bar(results.aggregate.latency.p95, flags.get("p95")).red + "    X   ERR!! p95 latency above threshold of %sms at: %sms".red, flags.get("p95"), results.aggregate.latency.p95);
	exit = 1;

} else {
	console.info(bar(results.aggregate.latency.p95, flags.get("p95")).green + "    ✓   p95 latency below threshold of %sms at: %sms".green, flags.get("p95"), results.aggregate.latency.p95);
}

// 99th percentile threshold check
if (flags.get("p99") == null) {

} else if (results.aggregate.latency.p99 > flags.get("p99")) {
	console.error(bar(results.aggregate.latency.p99, flags.get("p99")).red + "    X   ERR!! p99 latency above threshold of %sms at: %sms".red, flags.get("p99"), results.aggregate.latency.p99);
	exit = 1;

} else {
	console.info(bar(results.aggregate.latency.p99, flags.get("p99")).green + "    ✓   p99 latency below threshold of %sms at: %sms".green, flags.get("p99"), results.aggregate.latency.p99);
}

// requests per second check
if (flags.get("rps") == null) {

} else if (results.aggregate.rps.mean < flags.get("rps")) {
	console.info("");
	console.error(bar(results.aggregate.rps.mean, flags.get("rps")).red + "    X   ERR!! rps below threshold of %s at: %s".red, flags.get("rps"), results.aggregate.rps.mean);
	exit = 1;

} else {
	console.info("");
	console.info(bar(results.aggregate.rps.mean, flags.get("rps")).green + "    ✓   rps above threshold of %s at: %s".green, flags.get("rps"), results.aggregate.rps.mean);
}


console.log("");

process.exit(exit);