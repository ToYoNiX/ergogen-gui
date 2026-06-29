// TRRS Audio Jack Breakout Module
// Board size: 19mm wide x 15mm tall (normal)
//
// When reverse: true, a second set of pads is added
// offset by x_shift and y_shift units (1 unit = 2.54mm)
// Outline auto-expands in any direction (positive or negative shifts)
//
module.exports = {
  params: {
    designator: 'TRRS',
    reverse: false,
    x_shift: 1,
    y_shift: 1,
    TIP: undefined,
    R1:  undefined,
    R2:  undefined,
    S:   undefined,
    NC_T1: undefined,
    NC_T2: undefined,
    NC_B1: undefined,
    NC_B2: undefined,
  },
  body: p => {
    const u = 2.54;
    const dx = p.x_shift * u;
    const dy = p.y_shift * u;

    const hx  = -7.5;
    const hy  = [-3.81, -1.27, 1.27, 3.81];
    const nc_t = { x1: 3.0, x2: 5.54, y: -6.5 };
    const nc_b = { x1: 3.0, x2: 5.54, y:  6.5 };

    // Outline corners — expand in whichever direction shift goes
    const fab_right  = p.reverse ? Math.max( 9.5, nc_b.x2 + dx + 0.85 + 0.5) :  9.5;
    const fab_bottom = p.reverse ? Math.max( 7.5, nc_b.y  + dy + 0.85 + 0.5) :  7.5;
    const fab_left   = p.reverse ? Math.min(-9.5, hx      + dx - 0.85 - 0.5) : -9.5;
    const fab_top    = p.reverse ? Math.min(-7.5, nc_t.y  + dy - 0.85 - 0.5) : -7.5;

    const crt_right  = fab_right  + 0.5;
    const crt_bottom = fab_bottom + 0.5;
    const crt_left   = fab_left   - 0.5;
    const crt_top    = fab_top    - 0.5;

    return `
    (module trrs_breakout (layer F.Cu) (tedit 00000001)
${p.at}
      (fp_text reference "${p.ref}" (at 0 -9) (layer F.SilkS)
${p.ref_hide} (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value "TRRS_Breakout" (at 0 9) (layer F.Fab)
        (effects (font (size 1 1) (thickness 0.15))))

${'' /* =============================================
           OUTLINES
           ============================================= */}
      (fp_line (start ${fab_left}  ${fab_top})    (end   ${fab_right} ${fab_top})    (layer F.Fab) (width 0.12))
      (fp_line (start ${fab_right} ${fab_top})    (end   ${fab_right} ${fab_bottom}) (layer F.Fab) (width 0.12))
      (fp_line (start ${fab_right} ${fab_bottom}) (end   ${fab_left}  ${fab_bottom}) (layer F.Fab) (width 0.12))
      (fp_line (start ${fab_left}  ${fab_bottom}) (end   ${fab_left}  ${fab_top})    (layer F.Fab) (width 0.12))

      (fp_line (start ${crt_left}  ${crt_top})    (end   ${crt_right} ${crt_top})    (layer F.CrtYd) (width 0.05))
      (fp_line (start ${crt_right} ${crt_top})    (end   ${crt_right} ${crt_bottom}) (layer F.CrtYd) (width 0.05))
      (fp_line (start ${crt_right} ${crt_bottom}) (end   ${crt_left}  ${crt_bottom}) (layer F.CrtYd) (width 0.05))
      (fp_line (start ${crt_left}  ${crt_bottom}) (end   ${crt_left}  ${crt_top})    (layer F.CrtYd) (width 0.05))

      (fp_line (start ${fab_left}  ${fab_top})    (end   ${fab_right} ${fab_top})    (layer F.SilkS) (width 0.12))
      (fp_line (start ${fab_right} ${fab_top})    (end   ${fab_right} ${fab_bottom}) (layer F.SilkS) (width 0.12))
      (fp_line (start ${fab_right} ${fab_bottom}) (end   ${fab_left}  ${fab_bottom}) (layer F.SilkS) (width 0.12))
      (fp_line (start ${fab_left}  ${fab_bottom}) (end   ${fab_left}  ${fab_top})    (layer F.SilkS) (width 0.12))

${'' /* =============================================
           SET A — always present
           S at top, TIP at bottom
           ============================================= */}
${ p.reverse ? `      (fp_text user "L" (at ${hx - 1.5} ${hy[0]}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))` : '' }

      (pad S   thru_hole rect   (at ${hx} ${hy[0]} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.S})
      (pad R2  thru_hole circle (at ${hx} ${hy[1]} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.R2})
      (pad R1  thru_hole circle (at ${hx} ${hy[2]} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.R1})
      (pad TIP thru_hole circle (at ${hx} ${hy[3]} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.TIP})

      (pad NC_T1 thru_hole rect   (at ${nc_t.x1} ${nc_t.y} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_T1})
      (pad NC_T2 thru_hole circle (at ${nc_t.x2} ${nc_t.y} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_T2})
      (pad NC_B1 thru_hole rect   (at ${nc_b.x1} ${nc_b.y} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_B1})
      (pad NC_B2 thru_hole circle (at ${nc_b.x2} ${nc_b.y} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_B2})

${'' /* =============================================
           SET B — only when reverse: true
           TIP at top, S at bottom (reversed)
           all pads offset by dx, dy
           ============================================= */}
${ p.reverse ? `
      (fp_text user "R" (at ${hx + dx - 1.5} ${hy[0] + dy}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))

      (pad TIP thru_hole circle (at ${hx + dx} ${hy[0] + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.TIP})
      (pad R1  thru_hole circle (at ${hx + dx} ${hy[1] + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.R1})
      (pad R2  thru_hole circle (at ${hx + dx} ${hy[2] + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.R2})
      (pad S   thru_hole rect   (at ${hx + dx} ${hy[3] + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.S})

      (pad NC_T1 thru_hole rect   (at ${nc_t.x1 + dx} ${nc_t.y + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_T1})
      (pad NC_T2 thru_hole circle (at ${nc_t.x2 + dx} ${nc_t.y + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_T2})
      (pad NC_B1 thru_hole rect   (at ${nc_b.x1 + dx} ${nc_b.y + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_B1})
      (pad NC_B2 thru_hole circle (at ${nc_b.x2 + dx} ${nc_b.y + dy} ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${p.NC_B2})
` : '' }
    )
  `}
}
