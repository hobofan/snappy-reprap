const {serialize} = require('@jscad/stl-serializer');
const scadApi = require('@jscad/scad-api');
const {difference} = scadApi.booleanOps;
const {center, translate, rotate} = scadApi.transformations;
const {cube} = scadApi.primitives3d;
const {cable_chain_barrel} = require('./cable_chain');

const result = cable_chain_barrel();

// const op1 = cube({size: [10, 10, 1]})
// const op2 = cube({size: [1, 1, 10]})
// const op3 = cube({size: [3, 3, 10]})
// const result = difference(op1, op2, op3)

const rawData = serialize(result, {binary: false});

console.log(rawData[0]);
