import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

async function getInvoice(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/invoices/${id}`);
  if (!res.ok) {
    throw new Error('Invoice fetch failed');
  }
  return res.json();
}

async function getProperty(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/properties/${id}`);
  if (!res.ok) {
    throw new Error('Property fetch failed');
  }
  return res.json();
}

export default async function Image({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id);
  const property = invoice.property ?? (await getProperty(invoice.propertyId));

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: property.brandColor || '#1a1a1a',
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
        {property.logo && (
          <img src={property.logo} width={128} height={128} alt="" />
        )}
        <div style={{ fontSize: 56, fontWeight: 700, marginTop: 32 }}>
          Invoice #{invoice.number ?? params.id}
        </div>
        <div style={{ fontSize: 36 }}>{property.name}</div>
      </div>
    ),
    { ...size }
  );
}
