import * as React from "react";

export const InvoiceReady = ({ recipientName = "Customer", invoiceUrl = "#" }) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Invoice Ready</title>
      <style>{`
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 10px !important; }
          .button { width: 100% !important; }
        }
      `}</style>
    </head>
    <body style={{ margin: 0, padding: 0, backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: '#f6f9fc', padding: '20px 0' }}
      >
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
                  Hi {recipientName},
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '20px', fontSize: '16px', color: '#555555' }}>
                  Your invoice is ready. Please click the button below to view and pay your invoice.
                </td>
              </tr>
              <tr>
                <td align="center" style={{ paddingTop: '30px' }}>
                  <a
                    href={invoiceUrl}
                    className="button"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#007bff',
                      color: '#ffffff',
                      padding: '12px 20px',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                  >
                    View Invoice
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

export default InvoiceReady;
