# AEGIS — Autonomous Migration Agent for Headless Commerce

AEGIS is an autonomous operational agent built to **identify, explain, and mitigate real production issues** that occur during headless e-commerce migrations.

Instead of acting as a chatbot or a passive monitoring tool, AEGIS behaves like a **decision-making system** that continuously evaluates system signals, forms hypotheses, and recommends safe actions — all while keeping humans in control.

---

## Why This Project Exists

Modern commerce teams are moving toward headless architectures using frameworks like React and Next.js. While this improves flexibility, it also introduces **new classes of failures** that are difficult to detect early:

- Webhooks failing due to raw body vs parsed JSON mismatches  
- Checkout errors triggered by secret misconfiguration  
- Silent failures during key rotation  
- Support tickets surfacing only after revenue impact  
- Engineers manually correlating logs, tickets, and docs under pressure  

Existing observability tools show **what failed**, but not **why it failed** or **what should be done next**.

AEGIS is designed to bridge that gap.

---

## What AEGIS Is (and Is Not)

### AEGIS Is:
- An autonomous reasoning agent
- A system that proposes operational mitigations
- A human-aligned AI assistant for engineers and support teams
- A continuously running decision loop

### AEGIS Is Not:
- A chatbot
- An auto-remediation tool
- A black-box AI
- A demo-only prototype

---

## How the Agent Operates

AEGIS runs a closed-loop operational cycle:

**Observe → Reason → Decide → Act → Reflect**

Each step is explicit, logged, and visible in the UI.

---

### Observe
The agent ingests multiple operational signals, including:
- Error telemetry and logs
- Support ticket summaries
- Documentation search patterns
- Migration and environment metadata

No single signal is trusted in isolation.

---

### Reason
AEGIS correlates signals across sources to:
- Identify likely failure patterns
- Generate multiple hypotheses
- Assign confidence scores
- Track uncertainty explicitly

Reasoning outputs are explainable and inspectable.

---

### Decide
Based on confidence and safety constraints, the agent:
- Selects the lowest-risk mitigation strategies
- Estimates blast radius (merchant-only vs broader impact)
- Prioritizes actions conservatively

Decisions are recommendations — not executions.

---

### Act (Human-Gated)
AEGIS never modifies production systems autonomously.

Every action:
- Requires human authorization
- Is scoped and reversible
- Is recorded in an audit trail

This mirrors real enterprise safety requirements.

---

### Reflect
After an action is approved and executed:
- Outcomes are observed
- Belief states are updated
- Future recommendations improve

Learning is driven by real outcomes, not synthetic training.

---

## System Overview

### Frontend — Agent Console
The UI acts as a control and transparency layer:
- Diagnostic conclusions with confidence levels
- Action queue requiring approval
- Internal agent reasoning state (read-only)
- Full lifecycle logs of the agent loop

The goal is trust through visibility.

---

### Backend — Agent Runtime
The backend hosts the agent logic:
- Signal ingestion and normalization
- Belief state management
- Reasoning and decision planning
- Policy enforcement and safety checks

The agent can be triggered manually or run continuously.

---

## Design Principles

- **Human-in-the-loop by default**
- **Explainability over automation**
- **Safety over aggressiveness**
- **Operational realism over demos**

AEGIS is intentionally conservative.

---

## Performance Characteristics

- Event-driven execution (no constant polling)
- Lightweight reasoning cycles
- Bounded inference windows
- Predictable memory and CPU usage

The system is optimized for **decision quality**, not AI token volume.

---

## Learning and Adaptation

AEGIS improves using feedback such as:
- Action approval or rejection
- Post-mitigation system health
- Repeated failure patterns across merchants

This enables adaptive behavior without unsafe autonomy.

---

## Running the Project Locally

### Requirements
- Node.js (v18+ recommended)
- npm

---

### Backend
```bash
cd backend
npm install
npm start
Backend runs on:

http://localhost:3001
Available endpoints:

/agent/status

/agent/scan

/agent/diagnostics

/agent/actions

/agent/logs

Frontend
cd frontend
npm install
npm run dev
Frontend runs on:

http://localhost:3000
