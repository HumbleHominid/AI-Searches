var Chalk = require('chalk');
var Promise = require('promise');
var fs = require('fs');

var roads = null;
var sld = null;

var roadsPromise = new Promise((resolve, reject) => {
  fs.readFile('Roads.txt', (err, data) => {
    if (err) {
      console.log(Chalk.red(err));
      
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

var sldPromise = new Promise((resolve, reject) => {
  fs.readFile('SLD.txt', (err, data) => {
    if (err) {
      console.log(Chalk.red(err));
      
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

Promise.all([roadsPromise, sldPromise]).then((values) => {
  roads = values[0];
  sld = values[1];
})
