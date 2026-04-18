import type {ReactNode} from 'react';

interface State {
  id: string;
  label: string;
  description?: string;
  terminal?: boolean;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

interface Transition {
  from: string;
  to: string;
  label: string;
  style?: 'solid' | 'dashed';
  trigger?: 'auto' | 'admin' | 'external';
}

interface StatusFlowDiagramProps {
  title?: string;
  states: State[];
  transitions: Transition[];
}

const toneMap: Record<string, {bg: string; border: string; text: string}> = {
  neutral: {bg: '#1f232c', border: '#3a4150', text: '#d1d5db'},
  success: {bg: '#0e3b2a', border: '#10b981', text: '#6ee7b7'},
  warning: {bg: '#3d2e0e', border: '#f59e0b', text: '#fbbf24'},
  danger:  {bg: '#3d1f22', border: '#ef4444', text: '#fca5a5'},
};

const triggerLabel: Record<string, string> = {
  auto: 'auto',
  admin: 'admin',
  external: 'externo',
};

export default function StatusFlowDiagram({
  title,
  states,
  transitions,
}: StatusFlowDiagramProps): ReactNode {
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
          marginBottom: '1rem',
        }}>
          {title}
        </div>
      )}

      <div style={{display: 'grid', gap: '0.75rem'}}>
        {states.map((state) => {
          const palette = toneMap[state.tone ?? 'neutral'];
          const outgoing = transitions.filter((t) => t.from === state.id);

          return (
            <div key={state.id} style={{
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              background: palette.bg,
              borderLeft: `3px solid ${palette.border}`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                marginBottom: outgoing.length > 0 ? '0.5rem' : 0,
              }}>
                <code style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: palette.text,
                  background: 'transparent',
                  padding: 0,
                }}>
                  {state.label}
                </code>
                {state.terminal && (
                  <span style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--ifm-color-emphasis-500)',
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    padding: '1px 6px',
                    borderRadius: '999px',
                  }}>
                    terminal
                  </span>
                )}
                {state.description && (
                  <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--ifm-color-emphasis-600)',
                  }}>
                    {state.description}
                  </span>
                )}
              </div>

              {outgoing.length > 0 && (
                <div style={{display: 'grid', gap: '0.25rem', paddingLeft: '0.5rem'}}>
                  {outgoing.map((t, i) => {
                    const target = states.find((s) => s.id === t.to);
                    const isLoop = t.to === t.from;
                    return (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                      }}>
                        <span style={{
                          color: 'var(--ifm-color-emphasis-500)',
                          fontFamily: 'var(--ifm-font-family-monospace)',
                          fontSize: '0.9rem',
                          borderTop: t.style === 'dashed' ? '1px dashed currentColor' : 'none',
                          opacity: t.style === 'dashed' ? 0.7 : 1,
                        }}>
                          {isLoop ? '↻' : '→'}
                        </span>
                        <span style={{
                          color: 'var(--ifm-color-emphasis-800)',
                        }}>
                          {t.label}
                        </span>
                        {!isLoop && target && (
                          <code style={{
                            fontSize: '0.75rem',
                            background: 'transparent',
                            padding: 0,
                            color: toneMap[target.tone ?? 'neutral'].text,
                          }}>
                            {target.label}
                          </code>
                        )}
                        {t.trigger && (
                          <span style={{
                            marginLeft: 'auto',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'var(--ifm-color-emphasis-500)',
                            border: '1px solid var(--ifm-color-emphasis-200)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}>
                            {triggerLabel[t.trigger]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
