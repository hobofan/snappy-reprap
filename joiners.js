const scadApi = require('@jscad/scad-api')
const {serialize} = require('@jscad/stl-serializer')

const {cube, sphere} = scadApi.primitives3d
const {union} = scadApi.booleanOps

const base = cube({size: 1, center: true});
const top = sphere({r: 10, fn: 100, type: 'geodesic'});

const result = union(base, top)
const rawData = serialize(result, {binary: false})

console.log(rawData[0]);
