import { Html, Body, Container, Heading, Text } from '@react-email/components';

interface FailedPaymentEmailProps {
  name: string;
  date: string;
}

export function FailedPaymentEmail({ name, date }: FailedPaymentEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Payment Failed</Heading>
          <Text>Hi {name},</Text>
          <Text>Your payment on {date} could not be processed.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default FailedPaymentEmail;
