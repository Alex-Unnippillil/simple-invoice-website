import React from 'react';
import { Html, Head, Body, Text } from '@react-email/components';

const TestEmail = () => (
  React.createElement(Html, null,
    React.createElement(Head, null),
    React.createElement(Body, null,
      React.createElement(Text, null, 'Hello from React Email!')
    )
  )
);

export default TestEmail;
