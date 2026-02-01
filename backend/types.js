export var SignalType;
(function (SignalType) {
    SignalType["SUPPORT_TICKET"] = "SUPPORT_TICKET";
    SignalType["LOG_ERROR"] = "LOG_ERROR";
    SignalType["CHECKOUT_METRIC"] = "CHECKOUT_METRIC";
    SignalType["DOC_SEARCH"] = "DOC_SEARCH";
    SignalType["MIGRATION_STATUS"] = "MIGRATION_STATUS";
})(SignalType || (SignalType = {}));
export var ActionType;
(function (ActionType) {
    ActionType["PROACTIVE_COMMUNICATION"] = "PROACTIVE_COMMUNICATION";
    ActionType["TEMPORARY_MITIGATION"] = "TEMPORARY_MITIGATION";
    ActionType["ENGINEERING_ESCALATION"] = "ENGINEERING_ESCALATION";
    ActionType["DOC_UPDATE"] = "DOC_UPDATE";
    ActionType["INACTION"] = "INACTION";
})(ActionType || (ActionType = {}));
export var AgentStatus;
(function (AgentStatus) {
    AgentStatus["IDLE"] = "IDLE";
    AgentStatus["OBSERVING"] = "VALIDATING EVIDENCE...";
    AgentStatus["REASONING"] = "REASONING...";
    AgentStatus["DECIDING"] = "DECIDING...";
    AgentStatus["ACTING"] = "EXECUTING ACTIONS...";
    AgentStatus["MONITORING"] = "MONITORING (NO ACTION TAKEN YET)";
})(AgentStatus || (AgentStatus = {}));
