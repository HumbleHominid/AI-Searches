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
  // Accepts a search function.
  search: function(searchAlg = undefined) {
    if (searchAlg === undefined) {
      log(`${ERR} No search function given.`);
      
      return;
    }
    
    if (!(`_${searchAlg}` in this)) {
      log(`${ERR} Search algoritm not found.`);
      
      return;
    }
    
    let [ name, path, cost, numNodes ] = this[`_${searchAlg}`]();
      
    log(`--- ${Chalk.bgMagenta(name)} ---
      ${Chalk.bgCyan("Path:")} ${path.toString()}
      ${Chalk.bgCyan("Cost:")} ${cost}
      ${Chalk.bgCyan("Number Nodes Expanded:")} ${numNodes}`);
  },
  // Generic search algorithm. Returns an array as
  // [ search name, search path, cost of path, number of nodes expanded ]
  _generic: function() {
    let start = this.start;
    let frontier = [ start ];
    let roads = this.roads;
    let parentMap = { };
    let numNodes = 0;
    let discovered = [ ];
    let goal = this.goal;
    
    while (frontier.length) {
      let parent = frontier.pop();
      
      if (discovered.indexOf(parent) !== -1) {
        continue;
      }
      
      if (parent === goal) {
        break;
      }
      
      discovered.push(parent);
      
      for (let child in roads[parent]) {
        if (discovered.indexOf(child) === -1) {
          frontier.push(child);
          
          parentMap[child] = parent;
          numNodes = numNodes + 1;
        }
      }
    }
    
    let curr = goal;
    let cost = 0;
    let path = [ ];
    
    while (curr in parentMap) {
      if (path[0] && curr in roads[path[0]]) {
        cost = cost + roads[path[0]][curr];
      }
      
      path.unshift(curr);
      
      curr = parentMap[curr];
    }
    
    // Path build from bottom up. If nothing on path put start on path
    if (!path.length) {
      path = [ start ];
    }
    
    return [ "Generic (Depth First) Search", path, cost, numNodes ];
  },
  // A* search algorithm. Returns an array as
  // [ search name, search path, cost of path, number of nodes expanded ]
  _aStar: function() {
    let start = this.start;
    let sld = this.sld;
    let goal = this.goal;
    let roads = this.roads;
    let numNodes = 0;
    
    let closedSet = [ ];
    let openSet = [ start ];
    let cameFrom = { };
    let gScore = Object.assign({}, sld);
    let fScore = Object.assign({}, sld);
    
    for (let node in sld) {
      gScore[node] = Infinity;
      fScore[node] = Infinity;
    }
    
    gScore[start] = 0;
    fScore[start] = sld[start];
    
    while (openSet.length) {
      function sortOpenSet(a, b) {
        return fScore[a] < fScore[b]
      }
      
      openSet.sort(sortOpenSet);
      
      let current = openSet.pop();
      
      if (current === goal) {
        let [ path, cost ] = this._reconstructPath(cameFrom, current);
        
        return [ "A* Search", path, cost, numNodes ];
      }
      
      closedSet.push(current);
      
      for (let neighbor in roads[current]) {
        if (closedSet.indexOf(neighbor) !== -1) {
          continue;
        }
        
        if (openSet.indexOf(neighbor) === -1) {
          openSet.push(neighbor);
        }
        
        let tentative_gScore = gScore[current] + roads[current][neighbor];
        
        if (tentative_gScore >= gScore[neighbor]) {
          continue;
        }
        
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentative_gScore;
        fScore[neighbor] = gScore[neighbor] + sld[neighbor];
        numNodes = numNodes + 1;
      }
    }
    
    return [ "A* Search", [ start ], 0, numNodes ];
  },
  // Returns a path and cost for the path as [ path, cost ]
  _reconstructPath: function(cameFrom = { }, current = "") {
    let roads = this.roads;
    let totalPath = [ current ];
    let totalCost = 0;
    
    while (current in cameFrom) {
      let next = cameFrom[current];
      
      totalCost = totalCost + roads[current][next];
      current = next;
      
      totalPath.unshift(current);
    }
      
    return [ totalPath, totalCost ];
  }
};
