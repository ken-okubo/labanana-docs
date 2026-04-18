import type {ReactNode} from 'react';

interface PayoutStage {
  id: string;
  label: string;
  amountCents: number;
  description: string;
  trigger?: string;
  tone: 'neutral' | 'hold' | 'ready' | 'pending' | 'paid' | 'failed';
  terminal?: boolean;
}

interface PayoutBreakdownProps {
  title?: string;
  total?: number;
  stages: PayoutStage[];
  currency?: string;
}

const tonePalette: Record<string, {bg: string; border: string; text: string; dot: string}> = {
  neutral: {bg: '#1f232c', border: '#3a4150', text: '#d1d5db', dot: '#6b7280'},
  hold:    {bg: '#3d2e0e', border: '#f59e0b', text: '#fbbf24', dot: '#f59e0b'},
  ready:   {bg: '#1b2a3f', border: '#3b82f6', text: '#93c5fd', dot: '#3b82f6'},
  pending: {bg: '#2d1f3d', border: '#a855f7', text: '#d8b4fe', dot: '#a855f7'},
  paid:    {bg: '#0e3b2a', border: '#10b981', text: '#6ee7b7', dot: '#10b981'},
  failed:  {bg: '#3d1f22', border: '#ef4444', text: '#fca5a5', dot: '#ef4444'},
};

function formatCents(cents: number, currency: string): string {
  return `${currency} ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function PayoutBreakdown({
  title,
  total,
  stages,
  currency = 'R$',
}: PayoutBreakdownProps): ReactNode {
  const maxAmount = Math.max(...stages.map((s) => s.amountCents), 1);

  return (
    <div style={{
      margin: '2rem 0',
      padding: '1.5rem',
      borderRadius: '12px',
      background: 'var(--ifm-background-surface-color)',
      border: '1px solid var(--ifm-toc-border-color)',
    }}>
      {(title || total !== undefined) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1.25rem',
        }}>
          {title && (
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ifm-color-emphasis-600)',
            }}>
              {title}
            </div>
          )}
          {total !== undefined && (
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--ifm-color-emphasis-600)',
            }}>
              Total histórico:{' '}
              <strong style={{color: 'var(--ifm-heading-color)'}}>
                {formatCents(total, currency)}
              </strong>
            </div>
          )}
        </div>
      )}

      <div style={{display: 'grid', gap: '0.75rem'}}>
        {stages.map((stage) => {
          const palette = tonePalette[stage.tone];
          const pct = (stage.amountCents / maxAmount) * 100;

          return (
            <div key={stage.id} style={{
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              background: palette.bg,
              borderLeft: `3px solid ${palette.border}`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${palette.border}14, transparent)`,
                pointerEvents: 'none',
              }} />

              <div style={{position: 'relative', display: 'grid', gap: '0.4rem'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: palette.dot,
                      display: 'inline-block',
                    }} />
                    <strong style={{
                      fontSize: '0.95rem',
                      color: palette.text,
                    }}>
                      {stage.label}
                    </strong>
                    {stage.terminal && (
                      <span style={{
                        fontSize: '0.6rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--ifm-color-emphasis-500)',
                        border: '1px solid var(--ifm-color-emphasis-300)',
                        padding: '1px 5px',
                        borderRadius: '999px',
                      }}>
                        terminal
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'var(--ifm-font-family-monospace)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: palette.text,
                    whiteSpace: 'nowrap',
                  }}>
                    {formatCents(stage.amountCents, currency)}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--ifm-color-emphasis-700)',
                  lineHeight: 1.5,
                }}>
                  {stage.description}
                </div>

                {stage.trigger && (
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'var(--ifm-color-emphasis-500)',
                    fontStyle: 'italic',
                  }}>
                    {stage.trigger}
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
