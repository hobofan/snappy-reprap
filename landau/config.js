module.exports = {
  // Cable chain dimensions
  cable_chain_height: 13,  // mm
  cable_chain_width:  25,  // mm
  cable_chain_length: 26,  // mm
  cable_chain_pivot:   6,  // mm
  cable_chain_bump:    1,  // mm
  cable_chain_wall:    3,  // mm
  // This is the slop needed to make parts fit more exactly, and might be
  // printer and slicer dependant.  Printing a slop calibration block should
  // help dial this setting in for your printer.
  printer_slop: 0.20,  // mm
  gear_backlash: 0,    // mm
};
