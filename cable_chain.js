const scadApi = require('@jscad/scad-api');

const config = require('./config');

const {cube} = scadApi.primitives3d;
const {translate, rotate, center} = scadApi.transformations;
const {union, difference} = scadApi.booleanOps;
const {css2rgb, color} = scadApi.color;
const {chamfcube} = require('./gdm_utils');

const cable_chain_barrel = () => {
  const h = config.cable_chain_height;
  const w = config.cable_chain_width;
  const l = config.cable_chain_length;
  const wall = config.cable_chain_wall;
  // const r = config.cable_chain_pivot / 2;

  const cube1 = cube({
    size: [w, l - 20, h],
    center: true,
  });
  const cube2 = center([0, 0, 0],
    chamfcube({
      size: [
        w - 4 * wall,
        l,
        h - wall,
      ],
      chamfer: 2,
    })
  );
  const cube3 = cube({
    size: [
      2,
      (l - 15) / Math.cos(40),
      2 * wall,
    ],
    center: true,
  });

  const part = union(difference([
    translate([0, 0, h/2], cube1),
    translate([0, 0, h/2], cube2),
    rotate([0, 0, 40], cube3),
  ]));

  const coloredPart = color(css2rgb('springgreen'), part);
  return coloredPart;
};

module.exports = {
  cable_chain_barrel,
};
