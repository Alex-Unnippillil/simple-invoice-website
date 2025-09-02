import { Html, Body, Container, Heading, Text } from '@react-email/components';

interface DueReminderEmailProps {
  name: string;
  dueDate: string;
  amount: string;
}

export function DueReminderEmail({ name, dueDate, amount }: DueReminderEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Payment Reminder</Heading>
          <Text>Hi {name},</Text>
          <Text>This is a reminder that {amount} is due on {dueDate}.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default DueReminderEmail;
