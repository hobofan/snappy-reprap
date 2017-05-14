const scadApi = require('@jscad/scad-api');
const {difference} = scadApi.booleanOps;
const {scale, translate, rotate} = scadApi.transformations;
const {cube, polyhedron} = scadApi.primitives3d;

const chamfcube = (argsx = {}) => {
  const args = {
    size: argsx.size || [2,2,2],
    chamfer: argsx.chamfer || 0.25,
    chamfaxes: argsx.chamfaxes || [1,1,1],
    chamfcorners: argsx.chamfcorners || true,
  };

  const ch_width = Math.sqrt(2) * args.chamfer;

  const basecube = cube({size: args.size, center: true});
  let substractions = [];
  for (let xs of [-1, 1]) {
    for (let ys of [-1, 1]) {
      if (args.chamfaxes[0] == 1) {
        const cutCube = rotate([45, 0, 0], cube({size: [args.size[0]+0.1,ch_width,ch_width], center: true}));
        substractions.push(translate([0,xs*args.size[1]/2,ys*args.size[2]/2], cutCube));
      }
      if (args.chamfaxes[1] == 1) {
        const cutCube = rotate([0, 45, 0], cube({size: [ch_width,args.size[1]+0.1,ch_width], center: true}));
        substractions.push(translate([xs*args.size[0]/2,0,ys*args.size[2]/2], cutCube));
      }
      if (args.chamfaxes[2] == 1) {
        const cutCube = rotate([0,0,45], cube({size: [ch_width,ch_width,args.size[2]+0.1], center: true}));
        substractions.push(translate([xs*args.size[0]/2,ys*args.size[1]/2,0], cutCube));
      }
      if (args.chamfcorners) {
        for (let zs of [-1, 1]) {
          const cutPoly = translate([xs*args.size[0]/2,ys*args.size[1]/2,zs*args.size[2]/2],
            scale([args.chamfer,args.chamfer,args.chamfer],
              polyhedron({
                points:[
                  [0,-1,-1], [0,-1,1], [0,1,1], [0,1,-1],
                  [-1,0,-1], [-1,0,1], [1,0,1], [1,0,-1],
                  [-1,-1,0], [-1,1,0], [1,1,0], [1,-1,0]
                ],
                polygons:[
                  [ 8,  4,  9,  5],
                  [ 9,  3, 10,  2],
                  [10,  7, 11,  6],
                  [11,  0,  8,  1],
                  [ 0,  7,  3,  4],
                  [ 1,  5,  2,  6],

                  [ 1,  8,  5],
                  [ 5,  9,  2],
                  [ 2, 10,  6],
                  [ 6, 11,  1],

                  [ 0,  4,  8],
                  [ 4,  3,  9],
                  [ 3,  7, 10],
                  [ 7,  0, 11],
                ]
              })
            )
          );
          substractions.push(cutPoly);
        }
      }
    }
  }

  return difference(basecube, ...substractions);
};

module.exports = {
  chamfcube,
};
