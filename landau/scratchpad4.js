// const {serialize} = require('@jscad/stl-serializer');
// const scadApi = require('@jscad/scad-api');
const Landau = require('@landaujs/landau');
const { LandauElement } = require('@landaujs/landau');
const {Difference, Mirror, Translate, Cylinder, Rotate, Center, Cube, Union} = require('@landaujs/landau');
const {CableChainBarrel, CableChainMount1, CableChainMount2} = require('./cable_chain');

// const diff = (
//     <CableChainMount2 />
// );
const diff = (x) => (
  <Difference>
    <Cube size={[x * 3, 1, x * 3]} />
    <Translate vector={[1, -5, 1]}>
      <Union>
        { Array.from(Array(x)).map((a, j) => 
          <Translate vector={[0, 0, j * 3]}>
            <Union>
              { Array.from(Array(x)).map((b, i) => 
                <Translate vector={[3 * i, 0, 0]}>
                  <Cube size={[1, 10, 1]} />
                </Translate>
              )}
            </Union>
          </Translate>
        )}
      </Union>
    </Translate>
  </Difference>
);

// const result = diff.render();
// return result;
//
// const rawData = serialize(result, {binary: false});
// console.log(rawData[0]);
module.exports = diff(9);
