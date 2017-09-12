"use strict";

//----------------
// Global includes
//----------------
const Graph = require('./graph');
const Chalk = require('chalk');
const Promise = require('promise');
const tests = require('./testData');

//-----------------
// Global Variables
//-----------------
const log = console.log;
const ERR = Chalk.bgRed('ERR:')
const assert = {
  ok: function(bool, message = "NOT OK.") {
    if (bool) {
      return Chalk.bgGreen('OK');
    }
    
    return `${ERR} ${message}`
  }
};

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
        Graph.readData().then(() => {
          let aStar = Graph._aStar();
          let generic = Graph._generic();
          let assertData = testData.assert;
          
          log(Chalk.bgGreen(`Test ${testNum}:`) + ' ' + Chalk.green(`${testData.start} to ${testData.goal}.`));
          
          log(`--- ${Chalk.bgYellow("Asserting A*")} ---`);
          log(`  Asserting path - ${assert.ok(aStar[1].toString() === assertData.aStar.path)}`);
          log(`  Asserting cost - ${assert.ok(aStar[2] === assertData.aStar.cost)}`);
          
          log(`--- ${Chalk.bgYellow("Asserting generic")} ---`);
          log(`  Asserting path - ${assert.ok(generic[1].toString() === assertData.generic.path)}`);
          log(`  Asserting cost - ${assert.ok(generic[2] === assertData.generic.cost)}`);
          
          resolve();
        }).catch(() => {
          log(`${ERR} There was an error reading the data.`);
          
          reject();
        });
      }).catch(() => {
        log(`${ERR} There was an error setting the data.`);
        
        reject();
      });
    });
  }
};
