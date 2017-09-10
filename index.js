"use strict";
// Sets graph to be the graph object
const graph = require('./graph');
// Imports Chalk
const Chalk = require('chalk');
// Shorthand for console.log
const log = console.log;
// Shorthand for err
const ERR = Chalk.bgRed('ERR:');
// Test cases for running tests
const tests = {
  test0: {
    desc: "undefined to undefined",
  },
  test1: {
    desc: "Jordan to undefined",
    start: "Jordan"
  },
  test2: {
    desc: "undefined to Whitefish",
    goal: "Whitefish"
  },
  test3: {
    desc: "Jordan to Whitefish",
    start: "Jordan",
    goal: "Whitefish"
  },
  test4: {
    desc: "Invalid to Whitefish",
    start: "Invalid",
    goal: "Whitefish"
  },
  test5: {
    desc: "Jordan to Invalid",
    start: "Jordan",
    goal: "Invalid"
  },
  test6: {
    desc: "Jordan to Polson",
    start: "Jordan",
    goal: "Polson"
  }
};

log(Chalk.bgBlue("Search Program Start"));

graph.readData().then(() => {
  if (process.argv.indexOf("--test") !== -1) {
    runTests().then(() => {
      exitMessage();
    });
  }
  else {
    graph.set({
      start: "Jordan",
      goal: "Whitefish"
    }).then(() => {
      graph.search("generic");
      graph.search("aStar");
    }).finally(() => {
      exitMessage();
    });
  }
});

function exitMessage() {
  log(Chalk.bgBlue("Search Program End"));
}

async function runTests() {
  for (let test in tests) {
    await runTest(test, tests[test]);
  }
}

function runTest(testName = "", testData = { }) {
  return new Promise((resolve, reject) => {
    graph.set({
      start: testData.start ? testData.start : null,
      goal: testData.goal ? testData.goal : null
    }).then(() => {
      log(`${Chalk.bgGreen(testName)} - ${testData.desc}`);
      
      graph.search("generic");
      graph.search("aStar");
      
      resolve();
    }).catch(() => {
      log(`${ERR} There was an error setting the data.`);
      
      reject();
    });
  });
}
