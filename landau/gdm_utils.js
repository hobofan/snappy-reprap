const Landau = require('@landaujs/landau');
const {
  LandauElement,
  Rotate,
  Translate,
  Scale,
  Difference,
  Union,
  Mirror,
  Cube,
  Polyhedron,
} = require('@landaujs/landau');

class ChamfCube extends LandauElement {
  constructor(props) {
    super(props);
    this.props.size = this.props.size || [1,1,1];
    this.props.chamfer = this.props.chamfer || 0.25;
    this.props.chamfaxes = this.props.chamfaxes || [1,1,1];
    this.props.chamfcorners = this.props.chamfcorners || true;
  }

  build() {
    const {size, chamfer, chamfaxes, chamfcorners} = this.props;
    const ch_width = Math.sqrt(2) * chamfer;

    const basecube = <Cube size={size} center={true} />;
    let substractions = [];
    for (let xs of [-1, 1]) {
      for (let ys of [-1, 1]) {
        if (chamfaxes[0] == 1) {
          substractions.push(
            <Translate vector={[
              0,
              xs * size[1] / 2,
              ys * size[2] / 2
            ]} >
              <Rotate vector={[45, 0, 0]} >
                <Cube center={true} size={[
                  size[0] + 0.1,
                  ch_width,
                  ch_width
                ]} />
              </Rotate>
            </Translate>
          );
        }
        if (chamfaxes[1] == 1) {
          substractions.push(
            <Translate vector={[
              xs * size[0] / 2,
              0,
              ys * size[2] / 2
            ]} >
              <Rotate vector={[0, 45, 0]} >
                <Cube center={true} size={[
                  ch_width,
                  size[1] + 0.1,
                  ch_width
                ]} />
              </Rotate>
            </Translate>
          );
        }
        if (chamfaxes[2] == 1) {
          substractions.push(
            <Translate vector={[
              xs * size[0] / 2,
              ys * size[1] / 2,
              0
            ]} >
              <Rotate vector={[0, 0, 45]} >
                <Cube center={true} size={[
                  ch_width,
                  ch_width,
                  size[2] + 0.1
                ]} />
              </Rotate>
            </Translate>
          );
        }
        if (chamfcorners) {
          for (let zs of [-1, 1]) {
            substractions.push(
              <Translate
                vector={[
                  xs * size[0] / 2,
                  ys * size[1] / 2,
                  zs * size[2] / 2
                ]}
              >
                <Scale vector={[chamfer,chamfer,chamfer]}>
                  <Polyhedron
                    points={[
                      [0,-1,-1], [0,-1,1], [0,1,1], [0,1,-1],
                      [-1,0,-1], [-1,0,1], [1,0,1], [1,0,-1],
                      [-1,-1,0], [-1,1,0], [1,1,0], [1,-1,0]
                    ]}
                    polygons={[
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
                    ]}
                  />
                </Scale>
              </Translate>
            );
          }
        }
      }
    }

    return (
      <Difference>
        {[basecube, ...substractions]}
      </Difference>
    );
  }
}

class MirrorCopy extends LandauElement {
  constructor(props) {
    super(props);
    this.props.normal = this.props.normal || [0,0,1];
  }

  render() {
    const mirror = (<Mirror normal={this.props.normal} children={this.props.children} />);
    return (
      <Union children={[...this.props.children, mirror]} />
    ).render();
  }
}

module.exports = {
  ChamfCube,
  MirrorCopy
};
