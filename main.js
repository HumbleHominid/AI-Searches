"use strict";
// Sets data to be the data object
const data = require('./data');
// Imports Chalk
const Chalk = require('chalk');
// Shorthand for console.log
const log = console.log;

log(Chalk.bgBlue("Search Program Start"));

data.set({
  start: "Jordan",
  goal: "Glendive"
});

data.readData().then(() => {
  data.search("generic");
  data.search("aStar");
}).finally(() => {
  log(Chalk.bgBlue("Search Program End"));
});
