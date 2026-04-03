import type {ReactNode} from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  endpoint?: string;
  highlight?: boolean;
}

interface FlowStepsProps {
  steps: Step[];
}

export default function FlowSteps({steps}: FlowStepsProps): ReactNode {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      margin: '2rem 0',
    }}>
      {steps.map((step, i) => (
        <div key={i} style={{display: 'flex', gap: '16px', position: 'relative'}}>
          {/* Vertical line + number */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,
            width: 40,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: step.highlight ? '#10b981' : 'var(--ifm-background-surface-color)',
              border: `2px solid ${step.highlight ? '#10b981' : 'var(--ifm-color-emphasis-300)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: step.highlight ? '#fff' : 'var(--ifm-color-emphasis-600)',
              flexShrink: 0,
              zIndex: 1,
            }}>
              {step.number}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 2,
                flex: 1,
                minHeight: 24,
                backgroundColor: 'var(--ifm-color-emphasis-200)',
              }} />
            )}
          </div>

          {/* Content */}
          <div style={{
            paddingBottom: i < steps.length - 1 ? '24px' : 0,
            flex: 1,
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: 4,
              lineHeight: 1.4,
              paddingTop: 4,
            }}>
              {step.title}
            </div>
            {step.endpoint && (
              <code style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: 'var(--ifm-background-surface-color)',
                color: '#10b981',
                display: 'inline-block',
                marginBottom: 6,
              }}>
                {step.endpoint}
              </code>
            )}
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--ifm-color-emphasis-600)',
              lineHeight: 1.5,
            }}>
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
