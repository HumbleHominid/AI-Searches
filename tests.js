"use strict";
// Sets graph to be the graph object
const graph = require('./graph');
// Imports Chalk
const Chalk = require('chalk');
// Shorthand for console.log
const log = console.log;
// Shorthand for err
const ERR = Chalk.bgRed('ERR:');
// Promise library
const Promise = require('promise');
// Test cases for running tests
const tests = [
  { },
  {
    start: "Jordan"
  },
  {
    goal: "Whitefish"
  },
  {
    start: "Jordan",
    goal: "Whitefish"
  },
  {
    start: "Invalid",
    goal: "Whitefish"
  },
  {
    start: "Jordan",
    goal: "Invalid"
  },
  {
    start: "Jordan",
    goal: "Polson"
  },
  {
    start: "Jordan",
    goal: "Jordan"
  },
  {
    start: "Jordan",
    goal: "Dillon"
  }
];

module.exports = {
  run: async function() {
    log(Chalk.bgYellow("Running in test environment."))
    
    for (let test in tests) {
      await this._runTest(test, tests[test]);
    }
  },
  _runTest(testName = "", testData = { }) {
    return new Promise((resolve, reject) => {
      let graph = require('./graph');
      
      graph.readData().then(() => {
        graph.set({
          start: testData.start ? testData.start : null,
          goal: testData.goal ? testData.goal : null
        }).then(() => {
          log(Chalk.bgGreen(`Test ${testName}:`) + ` ${testData.start} to ${testData.goal}.`);
          
          graph.search("generic");
          graph.search("aStar");
          
          resolve();
        }).catch(() => {
          log(`${ERR} There was an error setting the data.`);
          
          reject();
        });
      });
    });
  }
}
