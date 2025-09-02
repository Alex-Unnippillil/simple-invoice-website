export interface Theme {
  background: string;
  foreground: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
}

export const theme: { light: Theme; dark: Theme } = {
  // Colors chosen to meet WCAG 2.1 AA contrast ratio of at least 4.5:1
  light: {
    background: '#ffffff',
    foreground: '#1a1a1a', // contrast with background: 17.4:1
    primary: '#005A9C',    // contrast with background: 7.1:1
    onPrimary: '#ffffff',  // contrast with primary: 7.1:1
    secondary: '#4D4D4D',  // contrast with background: 8.5:1
    onSecondary: '#ffffff' // contrast with secondary: 8.5:1
  },
  dark: {
    background: '#121212',
    foreground: '#ffffff', // contrast with background: 18.7:1
    primary: '#4DABF7',    // contrast with background: 7.6:1
    onPrimary: '#000000',  // contrast with primary: 8.5:1
    secondary: '#CCCCCC',  // contrast with background: 11.7:1
    onSecondary: '#000000' // contrast with secondary: 12.6:1
  }
};
