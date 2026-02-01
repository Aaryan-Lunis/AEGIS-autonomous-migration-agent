import React, { useState, useEffect } from 'react';
import { AgentStatus, BeliefState, AgentAction, Signal, AgentLoopLog } from './types';
import * as geminiService from './geminiService';

const BACKEND_URL = 'http://localhost:3001';

export default function App() {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [backendOnline, setBackendOnline] = useState(true);
  const [beliefState, setBeliefState] = useState<BeliefState | null>(null);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [logs, setLogs] = useState<AgentLoopLog[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'actions' | 'logs'>('diagnostics');
  const [isScanning, setIsScanning] = useState(false);

  // Poll backend every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusRes = await fetch(`${BACKEND_URL}/agent/status`);
        if (!statusRes.ok) throw new Error('Backend offline');
        
        const statusData = await statusRes.json();
        setStatus(statusData.status);
        setBackendOnline(true);

        const [diagnosticsRes, actionsRes, logsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/agent/diagnostics`),
          fetch(`${BACKEND_URL}/agent/actions`),
          fetch(`${BACKEND_URL}/agent/logs`)
        ]);

        const diagnostics = await diagnosticsRes.json();
        const actionsData = await actionsRes.json();
        const logsData = await logsRes.json();

        setBeliefState(diagnostics);
        setActions(actionsData);
        setLogs(logsData);
        
        // Get signals from gemini service (which now fetches from backend)
        const signalsData = await geminiService.getSignals();
        setSignals(signalsData);
      } catch (error) {
        console.error('Backend fetch error:', error);
        setBackendOnline(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRescan = async () => {
    setIsScanning(true);
    try {
      await fetch(`${BACKEND_URL}/agent/scan`, { method: 'POST' });
      // Data will update via polling
    } catch (error) {
      console.error('Rescan failed:', error);
    } finally {
      setTimeout(() => setIsScanning(false), 1000);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/agent/actions/${id}/approve`, { method: 'POST' });
    } catch (error) {
      console.error('Approve failed:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/agent/actions/${id}/reject`, { method: 'POST' });
    } catch (error) {
      console.error('Reject failed:', error);
    }
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatFullTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="aegis-app">
      {/* Top Bar */}
      <header className="top-bar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div>
            <span className="brand-name">AEGIS</span>
            <span className="brand-subtitle">Pilot</span>
          </div>
        </div>
        
        <div className="environment-badge">
          <span className="env-label">ENVIRONMENT</span>
          <span className="env-value">MIGRATION-BETA-099</span>
        </div>

        <div className="status-section">
          <span className="status-label">STATUS</span>
          <div className="status-indicator">
            <span className={`status-dot ${backendOnline ? 'online' : 'offline'}`}></span>
            <span className="status-text">{status}</span>
          </div>
        </div>

        <button 
          className="rescan-btn" 
          onClick={handleRescan}
          disabled={isScanning}
        >
          FORCE RE-SCAN
        </button>
      </header>

      <div className="main-layout">
        {/* Left Sidebar - Telemetry Stream */}
        <aside className="telemetry-sidebar">
          <div className="sidebar-header">
            <h3>TELEMETRY STREAM</h3>
            <button className="sidebar-menu-btn">⋯</button>
          </div>
          
          <div className="signal-list">
            {signals.map(signal => (
              <div key={signal.id} className="signal-item">
                <div className="signal-type-badge">
                  {signal.type.replace('_', ':')}
                </div>
                <div className="signal-time">{formatTime(signal.timestamp)}</div>
                <div className="signal-content">{signal.content}</div>
              </div>
            ))}
            {signals.length === 0 && (
              <div className="signal-empty">
                <p>No signals detected</p>
              </div>
            )}
          </div>

          <div className="sidebar-footer">
            <p>EOF // ARCHIVE_ACTIVE</p>
          </div>
        </aside>

        {/* Center Panel - Main Content */}
        <main className="content-panel">
          {beliefState && (
            <>
              <div className="merchant-header">
                <h1>LuxuryLoom (m-99)</h1>
                <div className="merchant-meta">
                  <span>Stage: {beliefState.currentMigrationStage}</span>
                  <span>Headless Transition Pilot</span>
                </div>
                <div className="last-analysis">
                  <span className="analysis-label">LAST ANALYSIS</span>
                  <span className="analysis-time">{formatFullTime(beliefState.lastUpdate)}</span>
                </div>
              </div>

              <nav className="tab-nav">
                <button 
                  className={activeTab === 'diagnostics' ? 'active' : ''}
                  onClick={() => setActiveTab('diagnostics')}
                >
                  DIAGNOSTICS
                </button>
                <button 
                  className={activeTab === 'actions' ? 'active' : ''}
                  onClick={() => setActiveTab('actions')}
                >
                  ACTIONS {actions.length > 0 && <span className="badge">{actions.length}</span>}
                </button>
                <button 
                  className={activeTab === 'logs' ? 'active' : ''}
                  onClick={() => setActiveTab('logs')}
                >
                  LOGS
                </button>
              </nav>

              {/* Tab Content */}
              {activeTab === 'diagnostics' && (
                <div className="tab-content">
                  <div className="diagnostics-header">
                    <h3>DIAGNOSTIC CONCLUSIONS</h3>
                    <span className="confidence-note">Confidence Interval: Auto-scaling</span>
                  </div>

                  {beliefState.hypotheses.map((hyp, idx) => (
                    <div key={hyp.id} className={`hypothesis-card ${hyp.isPrimary ? 'primary' : 'secondary'}`}>
                      <div className="hyp-header">
                        <div className="hyp-indicator"></div>
                        <h4>{hyp.name}</h4>
                        <span className="confidence">{Math.round(hyp.confidence * 100)}%</span>
                        <span className="confidence-label">CONFIDENCE</span>
                      </div>
                      <p className="hyp-description">{hyp.description}</p>
                      {hyp.evidenceIds.length > 0 && (
                        <div className="hyp-evidence">
                          <span className="evidence-count">
                            {hyp.evidenceIds.map((_, i) => (
                              <span key={i} className="evidence-number">{i + 1}</span>
                            ))}
                          </span>
                          <span className="evidence-label">Verified by {hyp.evidenceIds.length} telemetry signals</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {beliefState.knownUnknowns.length > 0 && (
                    <div className="known-unknowns-section">
                      <h3>OPEN QUESTIONS (CONFIDENCE PENDING)</h3>
                      {beliefState.knownUnknowns.map((unknown, idx) => (
                        <div key={idx} className="unknown-item">
                          <span className="unknown-icon">⚠</span>
                          <p>{unknown}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="tab-content">
                  <div className="actions-header">
                    <h3>PROPOSED MITIGATIONS</h3>
                    <span className="auth-required">● HUMAN AUTHORIZATION REQUIRED</span>
                  </div>

                  {actions.map(action => (
                    <div key={action.id} className="action-card">
                      <div className="action-header">
                        <span className={`action-type-badge ${action.type.toLowerCase()}`}>
                          {action.type.replace('_', ' ')}
                        </span>
                        <div className="action-impact">
                          <span className="impact-label">IMPACT SCOPE</span>
                          <span className="impact-value">{action.target}</span>
                        </div>
                      </div>
                      
                      <p className="action-description">{action.description}</p>
                      
                      <div className="action-rationale">
                        <em>"{action.reasoning}"</em>
                      </div>

                      <div className="action-meta">
                        <div className="risk-assessment">
                          <span className="meta-label">RISK CONTROL ASSESSMENT</span>
                          <p>{action.riskAssessment}</p>
                        </div>
                      </div>

                      <div className="action-buttons">
                        <button 
                          className="btn-approve"
                          onClick={() => handleApprove(action.id)}
                        >
                          Authorize Mitigation
                        </button>
                        <button 
                          className="btn-dismiss"
                          onClick={() => handleReject(action.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}

                  {actions.length === 0 && (
                    <div className="empty-state">
                      <p>No pending actions</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="tab-content">
                  <div className="logs-list">
                    {logs.map(log => (
                      <div key={log.id} className="log-entry">
                        <span className="log-time">{formatFullTime(log.timestamp)}</span>
                        <span className={`log-stage ${log.stage.toLowerCase()}`}>{log.stage}</span>
                        <span className="log-summary">{log.summary}</span>
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <div className="empty-state">
                        <p>No logs yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {!beliefState && (
            <div className="loading-state">
              <p>Connecting to agent kernel...</p>
            </div>
          )}
        </main>

        {/* Right Sidebar - Inspector */}
        <aside className="inspector-sidebar">
          <div className="inspector-header">
            <span className="inspector-status">● INTERNAL AGENT STATE (READ-ONLY)</span>
          </div>
          
          <div className="inspector-content">
            <div className="kernel-status">
              <p className="kernel-label">AEGIS_KERNEL: {status}</p>
            </div>

            <div className="log-stream">
              {logs.slice(0, 5).map(log => (
                <p key={log.id} className="log-line">[{log.stage.toLowerCase()}] {log.summary.substring(0, 60)}...</p>
              ))}
            </div>

            {beliefState && beliefState.hypotheses.length > 0 && (
              <div className="inference-output">
                <p className="inference-label">INFERENCE_ENGINE_OUTPUT:</p>
                <p className="inference-text">
                  {beliefState.hypotheses[0].description}
                </p>
              </div>
            )}

            <div className="monitoring-status">
              <p>&gt; Listening for auth_signal...</p>
              <p>&gt; Monitoring migration_integrity...</p>
            </div>
          </div>

          <div className="inspector-footer">
            <p className="footer-meta">
              <span>LOGIC CONSISTENCY</span>
              <span className="footer-status">HIGH (94%)</span>
            </p>
            <p className="footer-meta">
              <span>SAFETY GUARDRAILS</span>
              <span className="footer-status">ACTIVE</span>
            </p>
            <p className="footer-brand">Aegis Autonomous Migration Pilot</p>
            <p className="footer-version">Enterprise Release v2.4</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
