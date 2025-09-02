import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#1a1a1a',
          color: '#fff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>Simple Invoice</div>
        <div style={{ fontSize: 32, marginTop: 24 }}>Rent receipts made easy</div>
      </div>
    ),
    { ...size }
  );
}
