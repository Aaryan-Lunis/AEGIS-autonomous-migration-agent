import { ActionType } from './types.js';
export async function reasonOverSignals(signals, currentBeliefs) {
    const webhookHypothesis = {
        id: 'hyp-1',
        name: 'Merchant Webhook Signature Misconfiguration',
        description: "The merchant's Next.js backend is rejecting valid webhook payloads because the signature verification logic is likely reading the parsed JSON body instead of the raw body, or using the wrong environment secret. This failure pattern is commonly observed during hosted-to-headless migrations using custom frameworks such as Next.js.",
        confidence: 0.92,
        evidenceIds: ['sig-1', 'sig-2', 'sig-3'],
        isPrimary: true
    };
    const platformHypothesis = {
        id: 'hyp-2',
        name: 'Platform Key Rollover Latency',
        description: "The platform may have rotated keys, and the merchant is validating against an old secret, or the platform is signing with a key not yet propagated.",
        confidence: 0.65,
        evidenceIds: [],
        isPrimary: false
    };
    const communicationAction = {
        id: 'action-1',
        type: ActionType.PROACTIVE_COMMUNICATION,
        description: "Reply to the support ticket referencing the detected 'Invalid Webhook Signature' errors. Provide a code snippet for verifying HMAC signatures specifically for Next.js API routes (checking raw body parsing vs. JSON parsing).",
        target: 'MERCHANT_ONLY',
        riskAssessment: 'Low risk; strictly informational.',
        blastRadius: 'LOW',
        confidenceThreshold: 0.85,
        status: 'PENDING',
        reasoning: '"Rationale: The correlation between the 500 error logs regarding signatures and the merchant\'s documentation search history strongly suggests an implementation error in their new headless backend."'
    };
    const docsAction = {
        id: 'action-2',
        type: ActionType.DOC_UPDATE,
        description: "Add a troubleshooting callout to the headless migration guide warning about raw body vs. parsed body for webhook validation in serverless/framework environments.",
        target: 'GLOBAL',
        riskAssessment: 'Low risk; preventative documentation improvement.',
        blastRadius: 'LOW',
        confidenceThreshold: 0.7,
        status: 'PENDING',
        reasoning: '"This error pattern has appeared in 3+ migrations this quarter. Proactive docs reduce future support load."'
    };
    return {
        updatedBeliefs: {
            ...currentBeliefs,
            hypotheses: [webhookHypothesis, platformHypothesis],
            knownUnknowns: [
                'Has the merchant confirmed which webhook library they are using?',
                'Are they parsing the body with bodyParser or manually reading stream?'
            ],
            lastUpdate: new Date()
        },
        recommendedActions: [communicationAction, docsAction]
    };
}
