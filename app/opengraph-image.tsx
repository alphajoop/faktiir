import { ImageResponse } from 'next/og';

export const alt = 'Connectez-vous à FAKTIIR';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #5b4fe8 0%, #7c6ef5 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        gap: 24,
      }}
    >
      {/* Logo text */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-2px',
        }}
      >
        FAKTIIR
      </div>
      {/* Tagline */}
      <div
        style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.85)',
          fontWeight: 400,
          textAlign: 'center',
          maxWidth: 720,
          lineHeight: 1.4,
        }}
      >
        Logiciel de facturation open source
      </div>
      {/* Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 32,
          padding: '10px 28px',
          fontSize: 18,
          color: 'white',
          marginTop: 8,
        }}
      >
        faktiir.com
      </div>
    </div>,
    { ...size },
  );
}
