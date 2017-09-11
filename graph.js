/************************
 * @file graph.js
 * 
 * @author{Michael Fryer}
 ***********************/
"use strict";

//----------------
// Global includes
//----------------
const Chalk = require('chalk');
const Promise = require('promise');
const fs = require('fs');

//-----------------
// Global Variables
//-----------------
const log = console.log;
const ERR = Chalk.bgRed('ERR:');

// Data structure exported
module.exports = {
  _roads: null,
  _sld: null,
  _start: null,
  _goal: null,
  
  // Setter
  set(params = { }) {
    return new Promise((resolve, reject) => {
      for (let option in params) {
        this[`_${option}`] = params[option];
      }
      
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
  /**
   * Reads the roads and sld data
   *
   * @return{Promise} returns a promise waiting for roads and sld to be read
   */
  readData: function() {
    return Promise.all([this._readRoads(), this._readSLD()]).then((values) => {
      this._roads = values[0];
      this._sld = values[1];
    });
  },
  /**
   * @return{Promise} Returns a promise for reading road data. resolves when
   *  data has successfully been reads. rejects on error
   */
  _readRoads: function() {
    return new Promise((resolve, reject) => {
      fs.readFile('Data/Roads.txt', (err, data) => {
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
  /**
   * @return{Promise} Returns a promise for reading sld data. resolves when
   *  data has successfully been reads. rejects on error
   */
  _readSLD: function() {
    return new Promise((resolve, reject) => {
      fs.readFile('Data/SLD.txt', (err, data) => {
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
  /**
   * Checks if the search algorithm is in the object then runs if true
   *
   * @param{searchAlg} Name of the search algorith to run.
   *
   * @return{} Returns a promise for reading road data. resolves when
   *  data has successfully been reads. rejects on error
   */
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
  /**
   * Runs a deapth first search on the data
   *
   * @return{Array} array with [ search name, search path, cost of path, number of nodes expanded ]
   */
  _generic: function() {
    let start = this.start;
    let roads = this.roads;
    
    if (!(start in roads)) {
      return [ "Generic (DFS) Search", [ "Invalid starting city." ], 0, 0 ];
    }
    
    let frontier = [ start ];
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
    
    path.unshift(start)
    
    return [ "Generic (DFS) Search", path, cost, numNodes ];
  },
  /**
   * Runs an A* search on the data
   *
   * @return{Array} array with [ search name, search path, cost of path, number of nodes expanded ]
   */
  _aStar: function() {
    let start = this.start;
    let roads = this.roads;
    
    if (!(start in roads)) {
      return [ "A* Search", [ "Invalid starting city." ], 0, 0 ];
    }
    
    let sld = this.sld;
    let goal = this.goal;
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
  /**
   * Reconstructs a path based on a came from map and a start
   *
   * @param{cameFrom} Map of node relations
   * @param{current} The current node to start from
   *
   * @return{Array} array with [ path, cost ]
   */
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
