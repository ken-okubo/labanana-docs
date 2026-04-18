import type {ReactNode} from 'react';

interface Step {
  id: string;
  label: string;
  description?: string;
  actor?: 'cliente' | 'sistema' | 'admin' | 'external';
  note?: string;
}

interface ShippingTimelineProps {
  title?: string;
  steps: Step[];
}

const actorStyles: Record<string, {bg: string; border: string; text: string}> = {
  cliente:  {bg: '#1b2a3f', border: '#3b82f6', text: '#93c5fd'},
  sistema:  {bg: '#0e3b2a', border: '#10b981', text: '#6ee7b7'},
  admin:    {bg: '#3d2e0e', border: '#f59e0b', text: '#fbbf24'},
  external: {bg: '#2d1f3d', border: '#a855f7', text: '#d8b4fe'},
};

const actorLabel: Record<string, string> = {
  cliente: 'Cliente',
  sistema: 'Automático',
  admin: 'Admin',
  external: 'Externo',
};

export default function ShippingTimeline({
  title,
  steps,
}: ShippingTimelineProps): ReactNode {
  return (
    <div style={{
      margin: '2rem 0',
      padding: '1.5rem',
      borderRadius: '12px',
      background: 'var(--ifm-background-surface-color)',
      border: '1px solid var(--ifm-toc-border-color)',
    }}>
      {title && (
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--ifm-color-emphasis-600)',
          marginBottom: '1.25rem',
        }}>
          {title}
        </div>
      )}

      <div style={{position: 'relative'}}>
        {steps.map((step, idx) => {
          const palette = actorStyles[step.actor ?? 'sistema'];
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} style={{
              display: 'grid',
              gridTemplateColumns: '2.5rem 1fr',
              gap: '1rem',
              paddingBottom: isLast ? 0 : '1rem',
              position: 'relative',
            }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: palette.bg,
                  border: `2px solid ${palette.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: palette.text,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {idx + 1}
                </div>
                {!isLast && (
                  <div style={{
                    position: 'absolute',
                    top: '2rem',
                    bottom: '-1rem',
                    width: '2px',
                    background: 'var(--ifm-color-emphasis-200)',
                  }} />
                )}
              </div>

              <div style={{paddingTop: '0.25rem'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.25rem',
                }}>
                  <strong style={{
                    fontSize: '0.95rem',
                    color: 'var(--ifm-heading-color)',
                  }}>
                    {step.label}
                  </strong>
                  {step.actor && (
                    <span style={{
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: palette.text,
                      border: `1px solid ${palette.border}`,
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}>
                      {actorLabel[step.actor]}
                    </span>
                  )}
                </div>
                {step.description && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--ifm-color-emphasis-700)',
                    lineHeight: 1.5,
                  }}>
                    {step.description}
                  </div>
                )}
                {step.note && (
                  <div style={{
                    marginTop: '0.4rem',
                    fontSize: '0.75rem',
                    color: 'var(--ifm-color-emphasis-600)',
                    fontStyle: 'italic',
                  }}>
                    {step.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
