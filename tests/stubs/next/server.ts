export class NextResponse {
  body?: any;
  status: number;
  constructor(body?: any, init: { status?: number } = {}) {
    this.body = body;
    this.status = init.status ?? 200;
  }
  static redirect(url: URL) {
    return { type: 'redirect', url } as any;
  }
  static next() {
    return { type: 'next' } as any;
  }
}

export interface NextRequest {
  nextUrl: any;
  cookies: {
    get(name: string): { value: string } | undefined;
  };
}
