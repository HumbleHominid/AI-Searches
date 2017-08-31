"use strict";
// Terminal window colors
const Chalk = require('chalk');
// Promise library
const Promise = require('promise');
// File reading library
const fs = require('fs');
// Shorthand for console.log
const log = console.log;

// Data structure exported
module.exports = {
  _Roads: null,
  _SLD: null,
  
  // Gets the "private" road information
  getRoads: function() {
    return this._Roads;
  },
  // Gets the "private" sld information
  getSLD: function() {
    return this._SLD;
  },
  // Reads in the roads and sld information by calling the associated functions.
  // Returns a promise
  readData: function() {
    return Promise.all([this._readRoads(), this._readSLD()]).then((values) => {
      this._Roads = values[0];
      this._SLD = values[1];
    });
  },
  // Reads in the road information. Returns a promise
  _readRoads: function() {
    return new Promise((resolve, reject) => {
      fs.readFile('Roads.txt', (err, data) => {
        if (err) {
          log(`${Chalk.bgRed("ERR:")} ${err}`);
          
          reject(err);
        }
        
        let roads = { };
        let dataLines = data.toString().split('\n');
        
        dataLines.forEach((line) => {
          let lineContents = line.split(" ");
          let first = lineContents[0];
          let second = lineContents[1];
          let dist = parseInt(lineContents[2]);
          
          if (first !== '' && second !== '') {
            if (!(first in roads)) {
              roads[first] = { };
            }
            if (!(second in roads)) {
              roads[second] = { };
            }
            
            roads[first][second] = dist;
            roads[second][first] = dist;
          }
        });
        
        resolve(roads);
      });
    });
  },
  // Reads in the sld information. Returns a promise
  _readSLD: function() {
    return new Promise((resolve, reject) => {
      fs.readFile('SLD.txt', (err, data) => {
        if (err) {
          log(`${Chalk.bgRed("ERR:")} ${err}`);
          
          reject(err);
        }
        
        let sld = { };
        let dataLines = data.toString().split('\n');
        
        dataLines.forEach((line) => {
          let lineContents = line.split(" ");
          let name = lineContents[0];
          let dist = parseInt(lineContents[1]);
          
          if (name !== '') {
            sld[name] = dist;
          }
        });
        
        resolve(sld);
      });
    });
  },
  // Accepts a searc function.
  _search: function(searchAlg = undefined) {
    if (searchAlg === undefined) {
      log(`${Chalk.bgRed("ERR:")} No search function given.`);
      
      return;
    }
    
    searchAlg();
  },
  // Performs the generic search
  genericSearch: function() {
    log(`--- ${Chalk.bgMagenta("Generic")} ---`);
    
    this._search(this._generic);
  },
  // Performs the A* search
  aStarSearch: function() {
    log(`--- ${Chalk.bgMagenta("A*")} ---`);
    
    this._search(this._aStar);
  },
  // Generic search algorithm
  _generic: function() {log("Generic Search")
    return;
  },
  // A* search algorithm
  _aStar: function() {log("A* Search")
    return;
  }
};
