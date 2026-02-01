import { 
  AgentStatus, 
  BeliefState, 
  AgentAction, 
  Signal, 
  AgentLoopLog,
  ActionType 
} from './types.js';
import { TelemetrySimulator } from './telemetry.js';
import { reasonOverSignals } from './geminiService.js';

export class AgentKernel {
  private static instance: AgentKernel;
  
  private status: AgentStatus = AgentStatus.IDLE;
  private beliefState: BeliefState;
  private pendingActions: AgentAction[] = [];
  private logs: AgentLoopLog[] = [];
  private telemetry = TelemetrySimulator.getInstance();
  private isProcessing: boolean = false;

  private constructor() {
    this.beliefState = {
      merchantId: 'm-99',
      currentMigrationStage: 'Beta Rollout',
      hypotheses: [],
      knownUnknowns: [],
      lastUpdate: new Date()
    };
  }

  public static getInstance(): AgentKernel {
    if (!AgentKernel.instance) {
      AgentKernel.instance = new AgentKernel();
    }
    return AgentKernel.instance;
  }

  public async runCycle(): Promise<void> {
    if (this.isProcessing) return;
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
    } catch (error: any) {
      const errorStr = JSON.stringify(error);
      const isRateLimit = errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED');
      
      if (isRateLimit) {
        this.addLog('REFLECT', "SYSTEM_THROTTLED: Reasoning engine hit API rate limits. Background backoff active.");
      } else {
        this.addLog('REFLECT', "CRITICAL: Reasoning engine failed to converge. Entering manual failover.");
      }
      console.error("Agent Cycle Error:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  public getStatus() { return this.status; }
  public getBeliefState() { return this.beliefState; }
  public getPendingActions() { return this.pendingActions; }
  public getLogs() { return this.logs; }

  public approveAction(id: string): void {
    const action = this.pendingActions.find(a => a.id === id);
    if (!action) return;

    this.status = AgentStatus.ACTING;
    this.addLog('ACT', `Authorized Mitigation: ${action.description}`);
    
    setTimeout(() => {
      this.addLog('REFLECT', `Feedback received: Action ${action.id} neutralized the pattern. Knowledge base updated.`);
      this.status = AgentStatus.MONITORING;
    }, 2000);

    this.pendingActions = this.pendingActions.filter(a => a.id !== id);
  }

  public rejectAction(id: string): void {
    this.addLog('REFLECT', `Human oversight dismissed action ${id}. Adjusting confidence decay models.`);
    this.pendingActions = this.pendingActions.filter(a => a.id !== id);
  }

  private addLog(stage: AgentLoopLog['stage'], summary: string) {
    this.logs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      stage,
      summary
    });
    if (this.logs.length > 50) this.logs.pop();
  }
}
