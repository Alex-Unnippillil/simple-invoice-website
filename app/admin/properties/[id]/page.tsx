import { useState } from 'react';
import type { Property } from '@/db/schema/properties';

export default function PropertyPage() {
  const [property, setProperty] = useState<Partial<Property>>({});

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProperty(prev => ({ ...prev, logo: url }));
    }
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProperty(prev => ({ ...prev, color: e.target.value }));
  }

  return (
    <form>
      <div>
        <label htmlFor="logo">Logo</label>
        <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} />
        {property.logo && <img src={property.logo} alt="Logo preview" style={{ maxWidth: '200px' }} />}
      </div>
      <div>
        <label htmlFor="color">Brand Color</label>
        <input id="color" type="color" value={property.color} onChange={handleColorChange} />
      </div>
      {/* other property fields would live here */}
    </form>
  );
}
