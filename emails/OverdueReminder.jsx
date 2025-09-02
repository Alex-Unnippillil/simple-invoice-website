import * as React from "react";

export const OverdueReminder = ({ recipientName = "Customer", dueDate = "", paymentUrl = "#" }) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Overdue Invoice Reminder</title>
      <style>{`
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 10px !important; }
          .button { width: 100% !important; }
        }
      `}</style>
    </head>
    <body style={{ margin: 0, padding: 0, backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f6f9fc', padding: '20px 0' }}>
        <tr>
          <td align="center">
            <table
              className="container"
              width="600"
              cellPadding="0"
              cellSpacing="0"
              style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', padding: '40px' }}
            >
              <tr>
                <td style={{ fontSize: '20px', fontWeight: 'bold', color: '#333333' }}>
                  Payment Reminder
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '20px', fontSize: '16px', color: '#555555' }}>
                  Hi {recipientName}, this is a friendly reminder that your invoice due on {dueDate} is overdue. Please make your payment as soon as possible.
                </td>
              </tr>
              <tr>
                <td align="center" style={{ paddingTop: '30px' }}>
                  <a
                    href={paymentUrl}
                    className="button"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#dc3545',
                      color: '#ffffff',
                      padding: '12px 20px',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                  >
                    Pay Now
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
);

export default OverdueReminder;
