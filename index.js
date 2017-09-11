/************************
 * @file index.js
 * 
 * @author{Michael Fryer}
 ***********************/
"use strict";

//----------------
// Global includes
//----------------
const Chalk = require('chalk');

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
  let Graph = require('./graph');
  
  let start = "Jordan";
  let goal = "Whitefish";
  
  Graph.readData().then(() => {
    log(`${Chalk.bgGreen("Running searches:")} ${start} to ${goal}.`);
    
    Graph.set({
      start: start,
      goal: goal
    }).then(() => {
      Graph.search("generic");
      Graph.search("aStar");
    }).finally(() => {
      exitMessage();
    });
  });
}
