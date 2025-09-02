import { Html, Body, Container, Heading, Text } from '@react-email/components';

interface ReceiptEmailProps {
  name: string;
  amount: string;
  date: string;
}

export function ReceiptEmail({ name, amount, date }: ReceiptEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Payment Receipt</Heading>
          <Text>Hi {name},</Text>
          <Text>We received your payment of {amount} on {date}.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ReceiptEmail;
