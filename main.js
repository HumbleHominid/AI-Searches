"use strict";
// Sets data to be the data object
const data = require('./data');
// Imports Chalk
const Chalk = require('chalk');
// Shorthand for console.log
const log = console.log;

log(Chalk.bgBlue("Search Program Start"));

data.readData().then(() => {
  data.search();
});
