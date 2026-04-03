import type {ReactNode} from 'react';

interface WaterfallStep {
  label: string;
  value: number;
  type: 'start' | 'subtract' | 'subtotal' | 'split';
  recipient?: string;
  color?: string;
}

interface WaterfallChartProps {
  steps: WaterfallStep[];
  title?: string;
  currency?: string;
}

function formatCurrency(cents: number, currency: string): string {
  return `${currency} ${(Math.abs(cents) / 100).toFixed(2).replace('.', ',')}`;
}

export default function WaterfallChart({
  steps,
  title,
  currency = 'R$',
}: WaterfallChartProps): ReactNode {
  const maxValue = Math.max(...steps.map((s) => Math.abs(s.value)));

  return (
    <div style={{
      margin: '2rem 0',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
    }}>
      {title && (
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--ifm-color-emphasis-500)',
          marginBottom: '1rem',
        }}>
          {title}
        </div>
      )}

      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        {steps.map((step, i) => {
          const barWidth = Math.max((Math.abs(step.value) / maxValue) * 100, 8);
          const isNegative = step.type === 'subtract';
          const isSubtotal = step.type === 'subtotal';
          const isSplit = step.type === 'split';

          let barColor: string;
          if (step.color) {
            barColor = step.color;
          } else if (isSubtotal) {
            barColor = '#10b981';
          } else if (isNegative) {
            barColor = '#ef4444';
          } else if (isSplit) {
            barColor = '#6366f1';
          } else {
            barColor = '#10b981';
          }

          return (
            <div key={i}>
              {isSubtotal && (
                <div style={{
                  borderTop: '1px dashed var(--ifm-color-emphasis-300)',
                  margin: '8px 0',
                }} />
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 120px',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 0',
              }}>
                {/* Label */}
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: isSubtotal ? 700 : 500,
                  color: isSubtotal
                    ? 'var(--ifm-font-color-base)'
                    : 'var(--ifm-color-emphasis-600)',
                  textAlign: 'right',
                  lineHeight: 1.3,
                }}>
                  {isSplit && (
                    <span style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: barColor,
                      marginRight: 6,
                      verticalAlign: 'middle',
                    }} />
                  )}
                  {step.label}
                  {step.recipient && (
                    <div style={{
                      fontSize: '0.65rem',
                      color: 'var(--ifm-color-emphasis-500)',
                      fontWeight: 400,
                    }}>
                      {step.recipient}
                    </div>
                  )}
                </div>

                {/* Bar */}
                <div style={{
                  position: 'relative',
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <div
                    style={{
                      height: isSubtotal ? 28 : 22,
                      width: `${barWidth}%`,
                      backgroundColor: barColor,
                      borderRadius: 4,
                      opacity: isSubtotal ? 1 : isSplit ? 0.85 : 0.7,
                      transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>

                {/* Value */}
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: isSubtotal ? 700 : 600,
                  color: isNegative
                    ? '#ef4444'
                    : isSubtotal
                      ? '#10b981'
                      : 'var(--ifm-font-color-base)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {isNegative ? '- ' : ''}{formatCurrency(step.value, currency)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
