const {serialize} = require('@jscad/stl-serializer');
const scadApi = require('@jscad/scad-api');
const {difference} = scadApi.booleanOps;
const {center, translate, rotate} = scadApi.transformations;
const {cube} = scadApi.primitives3d;
const {cable_chain_barrel} = require('./cable_chain');
const Landau = require('landau');
const {Difference, Cube} = require('landau');
const {ChamfCube} = require('./gdm_utils_landau');
const {CableChainBarrel, CableChainMount1} = require('./cable_chain_landau');

// const result = cable_chain_barrel();

const op1 = cube({size: [10, 10, 1]});
const op2 = cube({size: [1, 1, 10]});
const op3 = cube({size: [3, 3, 10]});
// const result = difference(op1, op2, op3)

// const diff = (
//   <Difference>
//     <Cube size={[10, 10, 1]} />
//     <Cube size={[1, 7, 10]} />
//     <Cube size={[3, 8, 10]} />
//   </Difference>
// );

// const diff = (<ChamfCube chamfcorners={false} chamfer={0.1}/>);

const diff = (<CableChainMount1/>);

// const processDiff = (diff) => {
//   const renderedChildren = diff.children.map((child) => {
//     if (child.elementName === 'Cube') {
//       return processCube(child);
//     } else {
//       return child;
//     }
//   });
//   return difference(...renderedChildren);
// };
//
// const processCube = (cubeEl) => {
//   return cube({size: cubeEl.attributes.size});
// };

const result = diff.render();

const rawData = serialize(result, {binary: false});
console.log(rawData[0]);
