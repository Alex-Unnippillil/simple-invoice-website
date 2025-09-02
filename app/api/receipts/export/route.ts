import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '../../../../authOptions';
import archiver from 'archiver';
import { readdir } from 'fs/promises';
import path from 'path';
import { PassThrough } from 'stream';

function nodeStreamToWeb(stream: NodeJS.ReadableStream): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : new Uint8Array(chunk)));
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    }
  });
}

export async function GET() {
  const session = await getServerSession(buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const receiptsDir = path.join(process.cwd(), 'storage', 'receipts');
  const files = await readdir(receiptsDir);

  const manifestLines: string[] = ['filename'];
  const pass = new PassThrough();
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(pass);

  for (const file of files) {
    if (file.endsWith('.pdf')) {
      const filePath = path.join(receiptsDir, file);
      archive.file(filePath, { name: file });
      manifestLines.push(file);
    }
  }

  archive.append(manifestLines.join('\n'), { name: 'manifest.csv' });
  archive.finalize();

  const stream = nodeStreamToWeb(pass);

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="receipts.zip"'
    }
  });
}
