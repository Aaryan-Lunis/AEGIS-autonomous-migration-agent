import { SignalType } from './types.js';
export class TelemetrySimulator {
    static instance;
    signals = [];
    constructor() {
        this.reset();
    }
    static getInstance() {
        if (!TelemetrySimulator.instance) {
            TelemetrySimulator.instance = new TelemetrySimulator();
        }
        return TelemetrySimulator.instance;
    }
    reset() {
        this.signals = [
            {
                id: 'sig-1',
                type: SignalType.LOG_ERROR,
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                source: 'Headless-API-Gateway',
                content: '500 Internal Server Error on POST /v3/cart/checkout - Invalid Webhook Signature',
                metadata: { merchantId: 'm-99', severity: 'critical' }
            },
            {
                id: 'sig-2',
                type: SignalType.SUPPORT_TICKET,
                timestamp: new Date(Date.now() - 1000 * 60 * 2),
                source: 'Zendesk',
                content: 'Merchant reports: "Our new React storefront is failing at checkout. Customers seeing empty carts."',
                metadata: { merchantId: 'm-99', priority: 'high' }
            },
            {
                id: 'sig-3',
                type: SignalType.DOC_SEARCH,
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                source: 'Algolia-Docs',
                content: 'Search query: "how to verify webhook security headers in nextjs"',
                metadata: { merchantId: 'm-99' }
            }
        ];
    }
    getSignals() {
        return [...this.signals];
    }
    addSignal(signal) {
        this.signals.push({
            ...signal,
            id: `sig-${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date()
        });
    }
}
