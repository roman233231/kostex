import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'KOSTEX — Digital Products Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          background: 'linear-gradient(135deg, #08080C 0%, #0E0E16 50%, #08080C 100%)',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '20%',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            right: '10%',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,38,255,0.25), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Logo X */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
            }}
          >
            <svg width="140" height="140" viewBox="0 0 200 200" fill="none">
              <path
                d="M 30 40 L 80 40 L 170 160 L 120 160 Z"
                fill="url(#grad1)"
              />
              <path
                d="M 80 40 L 130 40 L 40 160 L 0 160 Z"
                fill="white"
                opacity="0.9"
              />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#C026FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Brand name */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: '#FFFFFF',
              marginBottom: '16px',
              marginLeft: '0.3em',
            }}
          >
            KOSTEX
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              color: '#9A9AA8',
              marginBottom: '40px',
              textTransform: 'uppercase',
              marginLeft: '0.35em',
            }}
          >
            Digital Products Studio
          </div>

          {/* Divider */}
          <div
            style={{
              width: '100px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
              marginBottom: '30px',
            }}
          />

          {/* Services */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '16px',
              color: '#CFCFD6',
              letterSpacing: '0.05em',
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
        </div>

        {/* Bottom right label */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '16px',
            color: '#55555F',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          kostex.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}