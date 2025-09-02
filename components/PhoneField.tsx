import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber } from 'libphonenumber-js';

export interface PhoneFieldProps {
  value?: string;
  onChange: (value?: string) => void;
}

/**
 * Phone input component with validation using libphonenumber.
 */
export const PhoneField: React.FC<PhoneFieldProps> = ({ value, onChange }) => {
  const handleChange = (val?: string) => {
    if (val) {
      const parsed = parsePhoneNumber(val);
      if (parsed && parsed.isValid()) {
        onChange(parsed.number);
      } else {
        onChange(val);
      }
    } else {
      onChange(val);
    }
  };

  return (
    <PhoneInput
      international
      defaultCountry="US"
      value={value}
      onChange={handleChange}
    />
  );
};
