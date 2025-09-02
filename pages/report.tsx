import { GetServerSideProps } from 'next';
import { getConversionMetrics } from '../database';

interface Metric {
  variant_id: string;
  conversions: number;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const metrics: Metric[] = await new Promise((resolve) => {
    getConversionMetrics('experiment-1', (err, rows) => {
      if (err) {
        resolve([]);
      } else {
        resolve(rows as Metric[]);
      }
    });
  });

  return { props: { metrics } };
};

export default function ReportPage({ metrics }: { metrics: Metric[] }) {
  return (
    <div>
      <h1>Experiment Report</h1>
      <table>
        <thead>
          <tr>
            <th>Variant</th>
            <th>Conversions</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.variant_id}>
              <td>{m.variant_id}</td>
              <td>{m.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
