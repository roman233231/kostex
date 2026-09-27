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
          background: 'linear-gradient(135deg, #08080C 0%, #150b28 50%, #08080C 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Multi-color glows */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: 200,
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 60%)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: 100,
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,70,239,0.4), transparent 60%)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '55%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 60%)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />

        {/* KOSTEX */}
        <div
          style={{
            display: 'flex',
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: '#FFFFFF',
            marginBottom: 24,
            marginLeft: '0.28em',
            lineHeight: 1,
            textShadow: '0 0 60px rgba(139,92,246,0.8)',
          }}
        >
          KOSTEX
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: '0.35em',
            color: '#C4B5FD',
            marginBottom: 50,
            textTransform: 'uppercase',
            marginLeft: '0.35em',
          }}
        >
          Digital Products Studio
        </div>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            width: 160,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #C026FF, transparent)',
            marginBottom: 44,
            borderRadius: 999,
          }}
        />

        {/* Services with colors */}
        <div
          style={{
            display: 'flex',
            gap: 30,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span style={{ color: '#A855F7' }}>Websites</span>
          <span style={{ color: '#60A5FA' }}>Web Apps</span>
          <span style={{ color: '#F472B6' }}>Software</span>
          <span style={{ color: '#34D399' }}>Bots</span>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 16,
            color: '#8B5CF6',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          kostex.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}