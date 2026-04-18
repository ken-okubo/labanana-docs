import type {ReactNode} from 'react';

type Tone = 'blue' | 'green' | 'purple' | 'amber';

interface ViewRule {
  label: string;
  value: string | ReactNode;
  emphasis?: 'normal' | 'do' | 'dont';
}

interface ViewColumn {
  title: string;
  subtitle?: string;
  tone: Tone;
  icon?: string;
  rules: ViewRule[];
}

interface ViewRulesMatrixProps {
  title?: string;
  columns: ViewColumn[];
}

const tonePalette: Record<Tone, {bg: string; border: string; accent: string}> = {
  blue:   {bg: '#1b2a3f', border: '#3b82f6', accent: '#93c5fd'},
  green:  {bg: '#0e3b2a', border: '#10b981', accent: '#6ee7b7'},
  purple: {bg: '#2d1f3d', border: '#a855f7', accent: '#d8b4fe'},
  amber:  {bg: '#3d2e0e', border: '#f59e0b', accent: '#fbbf24'},
};

const emphasisStyles: Record<string, {color: string; prefix: string}> = {
  do:   {color: '#6ee7b7', prefix: '✓'},
  dont: {color: '#fca5a5', prefix: '✗'},
  normal: {color: 'var(--ifm-color-emphasis-800)', prefix: '•'},
};

export default function ViewRulesMatrix({
  title,
  columns,
}: ViewRulesMatrixProps): ReactNode {
  return (
    <div style={{margin: '2rem 0'}}>
      {title && (
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--ifm-color-emphasis-600)',
          marginBottom: '1rem',
        }}>
          {title}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        gap: '1rem',
      }}>
        {columns.map((col, colIdx) => {
          const palette = tonePalette[col.tone];
          return (
            <div key={colIdx} style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: palette.bg,
              border: `1px solid ${palette.border}40`,
              borderTop: `3px solid ${palette.border}`,
            }}>
              <div style={{marginBottom: '1rem'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem',
                }}>
                  {col.icon && (
                    <span style={{fontSize: '1.1rem'}}>{col.icon}</span>
                  )}
                  <strong style={{
                    fontSize: '1rem',
                    color: palette.accent,
                    letterSpacing: '-0.01em',
                  }}>
                    {col.title}
                  </strong>
                </div>
                {col.subtitle && (
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--ifm-color-emphasis-600)',
                  }}>
                    {col.subtitle}
                  </div>
                )}
              </div>

              <div style={{display: 'grid', gap: '0.75rem'}}>
                {col.rules.map((rule, ruleIdx) => {
                  const em = emphasisStyles[rule.emphasis ?? 'normal'];
                  return (
                    <div key={ruleIdx}>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--ifm-color-emphasis-500)',
                        marginBottom: '0.25rem',
                      }}>
                        {rule.label}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: em.color,
                        lineHeight: 1.5,
                        display: 'flex',
                        gap: '0.4rem',
                        alignItems: 'baseline',
                      }}>
                        <span style={{
                          opacity: 0.7,
                          fontSize: '0.9rem',
                        }}>
                          {em.prefix}
                        </span>
                        <span>{rule.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
