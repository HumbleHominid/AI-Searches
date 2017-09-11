"use strict";

//----------------
// Global includes
//----------------
// Sets graph to be the graph object
const graph = require('./graph');
// Imports Chalk
const Chalk = require('chalk');
// Shorthand for console.log
const log = console.log;
// Shorthand for err
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
  let Test = require('./tests');
  
  Test.run().then(() => {
    exitMessage();
  });
}
// If not in test environment
else {
  let graph = require('./graph');
  
  graph.readData().then(() => {
    graph.set({
      start: "Jordan",
      goal: "Whitefish"
    }).then(() => {
      graph.search("generic");
      graph.search("aStar");
    }).finally(() => {
      exitMessage();
    });
  });
}

//------------
// Program end
//------------
