import { AgentStatus } from './types.js';
import { TelemetrySimulator } from './telemetry.js';
import { reasonOverSignals } from './geminiService.js';
export class AgentKernel {
    static instance;
    status = AgentStatus.IDLE;
    beliefState;
    pendingActions = [];
    logs = [];
    telemetry = TelemetrySimulator.getInstance();
    isProcessing = false;
    constructor() {
        this.beliefState = {
            merchantId: 'm-99',
            currentMigrationStage: 'Beta Rollout',
            hypotheses: [],
            knownUnknowns: [],
            lastUpdate: new Date()
        };
    }
    static getInstance() {
        if (!AgentKernel.instance) {
            AgentKernel.instance = new AgentKernel();
        }
        return AgentKernel.instance;
    }
    async runCycle() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        try {
            this.status = AgentStatus.OBSERVING;
            this.addLog('OBSERVE', `Scanning telemetry for Merchant ${this.beliefState.merchantId}.`);
            const signals = this.telemetry.getSignals();
            this.status = AgentStatus.REASONING;
            this.addLog('INTERPRET', "Correlating multi-source signals for pattern matching.");
            const { updatedBeliefs, recommendedActions } = await reasonOverSignals(signals, this.beliefState);
            this.beliefState = updatedBeliefs;
            this.status = AgentStatus.DECIDING;
            this.addLog('DECIDE', `Calculated ${recommendedActions.length} optimal mitigation vectors.`);
            this.pendingActions = recommendedActions;
            this.status = AgentStatus.MONITORING;
        }
        catch (error) {
            const errorStr = JSON.stringify(error);
            const isRateLimit = errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED');
            if (isRateLimit) {
                this.addLog('REFLECT', "SYSTEM_THROTTLED: Reasoning engine hit API rate limits. Background backoff active.");
            }
            else {
                this.addLog('REFLECT', "CRITICAL: Reasoning engine failed to converge. Entering manual failover.");
            }
            console.error("Agent Cycle Error:", error);
        }
        finally {
            this.isProcessing = false;
        }
    }
    getStatus() { return this.status; }
    getBeliefState() { return this.beliefState; }
    getPendingActions() { return this.pendingActions; }
    getLogs() { return this.logs; }
    approveAction(id) {
        const action = this.pendingActions.find(a => a.id === id);
        if (!action)
            return;
        this.status = AgentStatus.ACTING;
        this.addLog('ACT', `Authorized Mitigation: ${action.description}`);
        setTimeout(() => {
            this.addLog('REFLECT', `Feedback received: Action ${action.id} neutralized the pattern. Knowledge base updated.`);
            this.status = AgentStatus.MONITORING;
        }, 2000);
        this.pendingActions = this.pendingActions.filter(a => a.id !== id);
    }
    rejectAction(id) {
        this.addLog('REFLECT', `Human oversight dismissed action ${id}. Adjusting confidence decay models.`);
        this.pendingActions = this.pendingActions.filter(a => a.id !== id);
    }
    addLog(stage, summary) {
        this.logs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            stage,
            summary
        });
        if (this.logs.length > 50)
            this.logs.pop();
    }
}
