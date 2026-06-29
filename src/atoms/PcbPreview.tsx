import { useRef, useEffect } from 'react';

type Props = {
  pcb: string;
  'aria-label'?: string;
  'data-testid'?: string;
};

// kicanvas only understands KiCad 8 syntax. KiCad 5 footprints use (module ...)
// with unquoted layer names. This upgrades just enough for kicanvas to parse them.
// Only the viewer sees this; the exported .kicad_pcb is untouched.
const upgradeFootprints = (pcb: string): string =>
  pcb
    // (module NAME (layer X) (tedit|tstamp Y)) → (footprint "NAME" (layer "X"))
    .replace(
      /\(module\s+(\S+)\s+\(layer\s+([^)]+)\)\s+\((?:tedit|tstamp)\s+[0-9A-Fa-f]+\)/g,
      '(footprint "$1" (layer "$2")'
    )
    // Quote unquoted pad numbers: (pad S thru_hole ...) → (pad "S" thru_hole ...)
    .replace(/\(pad\s+(?!")(\S+)\s/g, '(pad "$1" ')
    // Quote unquoted single-layer refs inside footprints: (layer F.Cu) → (layer "F.Cu")
    .replace(/\(layer\s+(?!")([^"\s)]+)\s*\)/g, '(layer "$1")')
    // Quote unquoted pad layer lists: (layers *.Cu *.Mask) → (layers "*.Cu" "*.Mask")
    // [^()] avoids touching the top-level (layers ...) declaration block
    .replace(/\(layers\s+([^()]+?)\s*\)/g, (match, layers) => {
      const tokens = layers.trim().split(/\s+/);
      if (tokens[0].startsWith('"')) return match;
      return `(layers ${tokens.map((l: string) => `"${l}"`).join(' ')})`;
    });

const PcbPreview = ({
  pcb,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: Props): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !pcb) return;

    const embed = document.createElement('kicanvas-embed');
    embed.setAttribute('controls', 'full');
    embed.setAttribute('controlslist', 'nodownload nooverlay');
    embed.setAttribute('theme', 'kicad');

    const source = document.createElement('kicanvas-source');
    source.setAttribute('type', 'board');
    source.textContent = upgradeFootprints(pcb);
    embed.appendChild(source);

    container.innerHTML = '';
    container.appendChild(embed);

    return () => {
      container.innerHTML = '';
    };
  }, [pcb]);

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%' }}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    />
  );
};

export default PcbPreview;
