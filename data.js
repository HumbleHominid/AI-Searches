"use strict";
// Terminal window colors
const Chalk = require('chalk');
// Promise library
const Promise = require('promise');
// File reading library
const fs = require('fs');
// Shorthand for console.log
const log = console.log;
// Shorthand for err
const ERR = Chalk.bgRed('ERR:');

// Data structure exported
module.exports = {
  _roads: null,
  _sld: null,
  _start: null,
  _goal: null,
  
  // Initializer
  init(params = { }) {
    return new Promise((resolve, reject) => {
      this._roads = params.roads ? params.roads : null;
      this._sld = params.sld ? params.sld : null;
      this._start = params.start ? params.start : null;
      this._goal = params.goal ? params.goal : null;
      
      resolve();
    });
  },
  // Getters
  get roads() {
    return this._roads;
  },
  get sld() {
    return this._sld;
  },
  get start() {
    return this._start;
  },
  get goal() {
    return this._goal;
  },
  // Reads in the roads and sld information by calling the associated functions.
  // Returns a promise
  readData: function() {
    return Promise.all([this._readRoads(), this._readSLD()]).then((values) => {
      this._roads = values[0];
      this._sld = values[1];
    });
  },
  // Reads in the road information. Returns a promise
  _readRoads: function() {
    return new Promise((resolve, reject) => {
      fs.readFile('Roads.txt', (err, data) => {
        if (err) {
          log(`${ERR} ${err}`);
          
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
          log(`${ERR} ${err}`);
          
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
      log(`${ERR} No search function given.`);
      
      return;
    }
    
    searchAlg().then((data) => {
      let [ name, path, cost, numNodes ] = data;
      
      log(`--- ${Chalk.bgMagenta(name)} ---
        ${Chalk.bgCyan("Path:")} ${path}
        ${Chalk.bgCyan("Cost:")} ${cost}
        ${Chalk.bgCyan("Number Nodes Expanded:")} ${numNodes}`);
    });
  },
  // Performs the generic search
  genericSearch: function() {
    return this._search(this._generic);
  },
  // Performs the A* search
  aStarSearch: function() {
    return this._search(this._aStar);
  },
  // Generic search algorithm. Returns a promise that resolves an array as
  // [ search name, search path, cost of path, number of nodes expanded ]
  _generic: function() {
    return new Promise((resolve, reject) => {
      resolve([ "Generic Search", 'Path', 'Cost', 'Number Nodes Expanded' ]);
    });
  },
  // A* search algorithm. Returns a promise that resolves an array as
  // [ search name, search path, cost of path, number of nodes expanded ]
  _aStar: function() {
    return new Promise((resolve, reject) => {
      resolve([ "A* Search", 'Path', 'Cost', 'Number Nodes Expanded' ]);
    });
  }
};
