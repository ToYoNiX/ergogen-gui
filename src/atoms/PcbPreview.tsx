import { useRef, useEffect } from 'react';

type Props = {
  pcb: string;
  'aria-label'?: string;
  'data-testid'?: string;
};

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
    source.textContent = pcb;
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
