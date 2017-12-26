const Landau = require('@landaujs/landau');
const {
  Component,
  Rotate,
  Translate,
  Scale,
  Center,
  Difference,
  Union,
  Cube,
  Cylinder,
} = require('@landaujs/landau');
const {ChamfCube, MirrorCopy} = require('./gdm_utils');

const config = require('./config');

class CableChainBarrel extends Component {
  constructor(props) {
    super(props);
    this.height = config.cable_chain_height;
    this.width = config.cable_chain_width;
    this.length = config.cable_chain_length;
    this.wall = config.cable_chain_wall;
  }

  render() {
    const {width, length, height, wall} = this;

    const cube1 = (
      <Cube
        size={[
          width,
          length - 20,
          height
        ]}
        center={true}
      />
    );
    const cube2 = (
      <Center>
        <ChamfCube
          size={[
            width - 4 * wall,
            length,
            height - wall,
          ]}
          chamfer={2}
        />
      </Center>
    );
    const cube3 = (
      <Cube
        size={[
          2,
          (length - 15) / Math.cos(40),
          2 * wall,
        ]}
        center={true}
      />
    );

    const part = (
      <Union>
        <Difference>
          <Translate vector={[0, 0, height/2]}>{cube1}</Translate>
          <Translate vector={[0, 0, height/2]}>{cube2}</Translate>
          <Rotate vector={[0, 0, 50]}>{cube3}</Rotate>
        </Difference>
      </Union>
    );

    const coloredPart = part;
    // const coloredPart = color(css2rgb('springgreen'), part);
    return coloredPart;
  }
}

class CableChainMount1 extends Component {
  constructor() {
    super();
    this.height = config.cable_chain_height;
    this.width = config.cable_chain_width;
    this.length = config.cable_chain_length;
    this.rotation = config.cable_chain_pivot / 2;
    this.wall = config.cable_chain_wall;
    this.bump = config.cable_chain_bump;
    this.printer_slop = config.printer_slop;
  }

  render() {
    const {width, length, height, wall, printer_slop, rotation, bump} = this;
    const part = (
      <Union>
        <Difference>
          {/* Sides and tabs */}
          <MirrorCopy normal={[1,0,0]}>
            <Translate vector={[width/2 - 3*wall/2 - printer_slop/2, -length/4, height/2]} >
              <Cube center={true}
                size={[
                  wall-printer_slop,
                  length/2,
                  height
                ]}
              />
            </Translate>
          </MirrorCopy>
          {/* Chamfer Bottom Front */}
          <Translate vector={[0, -length/2, 0]} >
            <Scale vector={[1, Math.tan(30 * Math.PI / 180), 1]} >
              <Rotate vector={[45,0,0]} >
                <Cube center={true}
                  size={[
                    width + 2,
                    height/2 * Math.sqrt(2),
                    height/2 * Math.sqrt(2)
                  ]}
                />
              </Rotate>
            </Scale>
          </Translate>
          {/* Round out top front */}
          <Translate vector={[0, -length/2, height]} >
            <Difference>
              <Cube center={true}
                size={[
                  width+2,
                  height,
                  height
                ]}
              />
              <Translate vector={[0, height/2, -height/2]} >
                <Rotate vector={[0,90,0]} >
                  <Cylinder
                    fn={32}
                    center={true}
                    h={width+3}
                    r={height/2}
                  />
                </Rotate>
              </Translate>
            </Difference>
          </Translate>
          {/* Pivot Divot */}
          <MirrorCopy normal={[1,0,0]}>
            <Translate vector={[(width-wall)/2, 0, height/2]} >
              <Translate vector={[-wall/2-bump/2, -length/2+rotation+2.75-printer_slop, 0]} >
                <Rotate vector={[0,90,0]} >
                  <Cylinder
                    fn={32}
                    center={true}
                    h={bump+0.05}
                    r1={rotation}
                    r2={rotation+bump}
                  />
                </Rotate>
              </Translate>
            </Translate>
          </MirrorCopy>
        </Difference>
      </Union>
    );

    const coloredPart = part;
    // const coloredPart = color(css2rgb('springgreen'), part);
    return coloredPart;
  }
}

class CableChainMount2 extends Component {
  constructor() {
    super();
    this.height = config.cable_chain_height;
    this.width = config.cable_chain_width;
    this.length = config.cable_chain_length;
    this.rotation = config.cable_chain_pivot / 2;
    this.wall = config.cable_chain_wall;
    this.bump = config.cable_chain_bump;
    this.printer_slop = config.printer_slop;
  }

  render() {
    const {width, length, height, wall, printer_slop, rotation, bump} = this;
    const part = (
      <Union>
        <Difference>
          <MirrorCopy normal={[1,0,0]}>
            <Translate vector={[(width-wall)/2, 0, height/2]}>
              <Translate vector={[0, length/4, 0]}>
                <Cube center={true} size={[wall, length/2, height]} />
              </Translate>
              <Translate vector={[0, length/2-height/3, 0]}>
                <Rotate vector={[0,90,0]}>
                  <Cylinder h={wall} r={rotation + 1.333} center={true} fn={64} />
                </Rotate>
              </Translate>
              {/* Pivot bump */}
              <Translate vector={[-wall/2-bump/2, length/2-height/3, 0]}>
                <Rotate vector={[0,90,0]}>
                  <Cylinder h={bump} r1={rotation} r2={rotation+bump} center={true} fn={32} />
                </Rotate>
              </Translate>
            </Translate>
          </MirrorCopy>
          {/* Chamfer top back */}
          <Translate vector={[0, length/2, height]} >
            { ([5, 15, 25, 35, 45].map(ang =>
              <Scale vector={[1, Math.sin(ang), Math.cos(ang)]}>
                <Rotate vector={[45, 0, 0]}>
                  <Cube center={true} size={[width+2, height/2*Math.sqrt(2), height/2*Math.sqrt(2)]} />
                </Rotate>
              </Scale>
            ))}
          </Translate>
            {/*
              //
              translate([0, l/2, h]) {
                for (ang = [5:10:45]) {
                  scale([1, sin(ang), cos(ang)])
                    xrot(45)
                      cube(size=[w+2, h/2*sqrt(2), h/2*sqrt(2)], center=true);
                }
              }
            */}
        </Difference>
      </Union>
    );

    const coloredPart = part;
    // const coloredPart = color(css2rgb('springgreen'), part);
    return coloredPart;
  }
}

module.exports = {
  CableChainBarrel,
  CableChainMount1,
  CableChainMount2,
};
