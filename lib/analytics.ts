import fs from 'fs';
import path from 'path';

export interface ExperimentMetadata {
  experimentId: string;
  variant: string;
}

interface AnalyticsEvent {
  event: string;
  experiment?: ExperimentMetadata;
  timestamp: number;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const eventsFile = path.join(__dirname, '..', 'storage', 'experimentEvents.json');

function readEvents(): AnalyticsEvent[] {
  try {
    const data = fs.readFileSync(eventsFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]): void {
  fs.mkdirSync(path.dirname(eventsFile), { recursive: true });
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
}

export function trackEvent(
  event: string,
  experiment?: ExperimentMetadata,
  ttlMs: number = DEFAULT_TTL_MS,
): void {
  const events = readEvents();
  const now = Date.now();
  events.push({
    event,
    experiment,
    timestamp: now,
    expiresAt: now + ttlMs,
  });
  writeEvents(events);
}

export function purgeExpiredExperimentData(): void {
  const now = Date.now();
  const events = readEvents().filter((e) => e.expiresAt > now);
  writeEvents(events);
}
