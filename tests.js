"use strict";

//----------------
// Global includes
//----------------
const Graph = require('./graph');
const Chalk = require('chalk');
const Promise = require('promise');

//-----------------
// Global Variables
//-----------------
const log = console.log;
const ERR = Chalk.bgRed('ERR:');
// Test cases for running tests
const tests = [
  { }, // Note this is testing an undefined starting/ending point.
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
  },
  {
    start: "Lewistown",
    goal: "GreatFalls"
  }
];

module.exports = {
  run: async function() {
    log(Chalk.bgYellow("Running in test environment."))
    
    await Graph.readData().then(async () => {
      for (let test in tests) {
        await this._runTest(test, tests[test]);
      }
    });
  },
  /**
   * Handles actually running the test. Note this does not assert but just runs
   * the search
   *
   * @param{testNum} The number of the test
   * @param{testData} Data for the test consisting of start and goal
   *
   * @return{Promise} Returns a promise that is resolved when the searches
   *   complete or rejected if something goes awry
   **/
  _runTest(testNum = "", testData = { }) {
    return new Promise((resolve, reject) => {
      Graph.set({
        start: testData.start ? testData.start : null,
        goal: testData.goal ? testData.goal : null
      }).then(() => {
        log(Chalk.bgGreen(`Test ${testNum}:`) + ` ${testData.start} to ${testData.goal}.`);
        
        Graph.search("generic");
        Graph.search("aStar");
        
        resolve();
      }).catch(() => {
        log(`${ERR} There was an error setting the data.`);
        
        reject();
      });
    });
  }
};
