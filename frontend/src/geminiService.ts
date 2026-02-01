import { Signal } from './types';

const BACKEND_URL = 'http://localhost:3001';

export async function getSignals(): Promise<Signal[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/agent/signals`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    }));
  } catch (error) {
    console.error('Failed to fetch signals:', error);
    return [];
  }
}
