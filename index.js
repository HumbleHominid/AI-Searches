"use strict";

//----------------
// Global includes
//----------------
const Chalk = require('chalk');
const Graph = require('./graph');

//-----------------
// Global Variables
//-----------------
const log = console.log;
const ERR = Chalk.bgRed('ERR:');

//-----------------
// Helper Functions
//-----------------
function exitMessage() {
  log(Chalk.bgBlue("Search Program End"));
}

//--------------
// Program start
//--------------
log(Chalk.bgBlue("Search Program Start"));

// Handles running tests
if (process.argv.indexOf("-t") !== -1) {
  let Tests = require('./tests');
  
  Tests.run().then(() => {
    exitMessage();
  });
}
// If not in test environment
else {
  Graph.readData().then(() => {
    Graph.set({
      start: "Jordan",
      goal: "Whitefish"
    }).then(() => {
      Graph.search("generic");
      Graph.search("aStar");
    }).finally(() => {
      exitMessage();
    });
  });
}
