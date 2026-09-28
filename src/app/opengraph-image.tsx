import { ImageResponse } from 'next/og';

export const alt = 'KOSTEX — Digital Products Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#08080C',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: 300,
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: 200,
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,38,255,0.3), transparent 65%)',
            filter: 'blur(80px)',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: '#FFFFFF',
            marginBottom: 20,
            marginLeft: '0.28em',
          }}
        >
          KOSTEX
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '0.35em',
            color: '#9A9AA8',
            marginBottom: 40,
            textTransform: 'uppercase',
            marginLeft: '0.35em',
          }}
        >
          Digital Products Studio
        </div>

        <div
          style={{
            display: 'flex',
            width: 120,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
            marginBottom: 36,
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: 24,
            fontSize: 18,
            color: '#CFCFD6',
          }}
        >
          <span>Websites</span>
          <span style={{ color: '#8B5CF6' }}>✦</span>
          <span>Web Apps</span>
          <span style={{ color: '#8B5CF6' }}>✦</span>
          <span>Bots</span>
          <span style={{ color: '#8B5CF6' }}>✦</span>
          <span>CRM</span>
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 14,
            color: '#55555F',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          kostex.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}