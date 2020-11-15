// const {serialize} = require('@jscad/stl-serializer');
// const scadApi = require('@jscad/scad-api');
const Landau = require('@landaujs/landau');
const { LandauElement } = require('@landaujs/landau');
const {Mirror, Translate, Cylinder, Rotate, Center, Cube, Union} = require('@landaujs/landau');
const {CableChainBarrel, CableChainMount1, CableChainMount2} = require('./cable_chain');

// const diff = (
//     <CableChainMount2 />
// );
const diff = (
  <Translate vector={[0, 10, 0]}>
    <CableChainMount2 />
  </Translate>
);

// console.log(Landau.renderTree(diff, 0, true));

// const result = diff.render();
// return result;
//
// const rawData = serialize(result, {binary: false});
// console.log(rawData[0]);
module.exports = diff;
