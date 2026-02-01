export enum SignalType {
  SUPPORT_TICKET = 'SUPPORT_TICKET',
  LOG_ERROR = 'LOG_ERROR',
  CHECKOUT_METRIC = 'CHECKOUT_METRIC',
  DOC_SEARCH = 'DOC_SEARCH',
  MIGRATION_STATUS = 'MIGRATION_STATUS'
}

export interface Signal {
  id: string;
  type: SignalType;
  timestamp: Date;
  source: string;
  content: string;
  metadata: Record<string, any>;
}

export interface Hypothesis {
  id: string;
  name: string;
  description: string;
  confidence: number;
  evidenceIds: string[];
  isPrimary: boolean;
}

export interface BeliefState {
  merchantId: string;
  currentMigrationStage: string;
  hypotheses: Hypothesis[];
  knownUnknowns: string[];
  lastUpdate: Date;
}

export enum ActionType {
  PROACTIVE_COMMUNICATION = 'PROACTIVE_COMMUNICATION',
  TEMPORARY_MITIGATION = 'TEMPORARY_MITIGATION',
  ENGINEERING_ESCALATION = 'ENGINEERING_ESCALATION',
  DOC_UPDATE = 'DOC_UPDATE',
  INACTION = 'INACTION'
}

export enum AgentStatus {
  IDLE = 'IDLE',
  OBSERVING = 'VALIDATING EVIDENCE...',
  REASONING = 'REASONING...',
  DECIDING = 'DECIDING...',
  ACTING = 'EXECUTING ACTIONS...',
  MONITORING = 'MONITORING (NO ACTION TAKEN YET)'
}

export interface AgentAction {
  id: string;
  type: ActionType;
  description: string;
  target: string;
  riskAssessment: string;
  blastRadius: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceThreshold: number;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  reasoning: string;
}

export interface AgentLoopLog {
  id: string;
  timestamp: Date;
  stage: 'OBSERVE' | 'INTERPRET' | 'UPDATE' | 'DECIDE' | 'ACT' | 'REFLECT';
  summary: string;
  stateSnapshotId?: string;
}
