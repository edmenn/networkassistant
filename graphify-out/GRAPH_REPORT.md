# Graph Report - steward  (2026-08-11)

## Corpus Check
- 423 files · ~490,778 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4531 nodes · 12857 edges · 227 communities (199 shown, 28 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea6a4762`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- StateStore
- device-contracts-panel.tsx
- AutonomyStore
- contracts.ts
- adoption/orchestrator.ts
- tool-skills.ts
- isAuthorized
- discovery/engine.ts
- loop.ts
- state/types.ts
- protocol-broker.ts
- settings/page.tsx
- device-inventory-page.tsx
- dashboard-widgets-panel.tsx
- autonomy/runtime.ts
- state/store.ts
- chat-workspace.tsx
- recoverCorruptDatabase
- remote-desktop/manager.ts
- device-actions.ts
- missions/repository.ts
- web-research.ts
- web-sessions/manager.ts
- contract-management.ts
- operator-notes.ts
- chat/route.ts
- Device
- classify.ts
- fingerprint.ts
- cn
- active.ts
- policies/page.tsx
- button.tsx
- gateway.ts
- defaultBrokerRequest
- db.ts
- defaults.ts
- .getState
- local-tools/runtime.ts
- controls.ts
- playbooks/registry.ts
- dashboard-widget-grid.ts
- autonomy/types.ts
- getDb
- topology/page.tsx
- winrm.ts
- operations.ts
- browser-observer.ts
- credentials.ts
- use-steward.tsx
- plan-ir/route.ts
- execution-kernel.ts
- oauth.ts
- compilerOptions
- guard.ts
- gateway/repository.ts
- subagents/repository.ts
- incidents/page.tsx
- normalizeCredentialProtocol
- mqtt-client.ts
- applyOperationalFindingPacks
- dependencies
- notifications/manager.ts
- widgets/generator.ts
- automations.ts
- devices/[id]/page.tsx
- adapters/types.ts
- providers.ts
- models.ts
- install-prod.sh
- protocol-sessions/manager.ts
- evidence.ts
- openai-oauth-server.ts
- playbooks/runtime.ts
- devDependencies
- adapterRecordFromRow
- getAuthContext
- vault.ts
- remote-desktop-viewer.tsx
- ProtocolSessionManager
- ensure-remote-desktop-runtime.mjs
- catalog.ts
- conversation.ts
- adapters/registry.ts
- devices/[id]/route.ts
- policies/[id]/route.ts
- exchange/route.ts
- graph-query.ts
- .withAuditDbRecovery
- callback/route.ts
- remote-terminal/route.ts
- jobs.ts
- skills.ts
- discovery/types.ts
- graph.ts
- Steward
- hashApiToken
- local-tools/[id]/route.ts
- AdapterRegistry
- widget-routing.ts
- agent.ts
- components.json
- ensure-network-tools.mjs
- queue.ts
- multicast.ts
- device-remote-desktop-panel.tsx
- os-keystore.ts
- scripts
- metrics.ts
- LLMProvider
- remote-desktop/sessions/route.ts
- PlaybookRun
- chat-playbook-run-widget.tsx
- errors.ts
- Core endpoints
- Operator Guide
- README.md
- free-port.mjs
- start-prod.mjs
- lookup.ts
- Steward Architecture
- run-prod.ps1
- oidc.ts
- session/route.ts
- InvestigationRecord
- channels/route.ts
- playbooks/orchestrator.ts
- ServiceContract
- validateGeneratedWidgetAgainstContext
- proposal/route.ts
- onboarding-contract.ts
- nmap-deep.ts
- runtimeLeaseFromRow
- validateGeneratedWidgetStartupJs
- Security
- install-prod.ps1
- Packs SDK
- ensure-playwright.mjs
- OperationSpec
- tool-call-repair.ts
- capability-broker.ts
- Core Capabilities
- DeviceWidget
- scheduler.ts
- hostname-resolution.ts
- mission-lab-replay.test.ts
- Discovery Engine
- Phased Delivery Plan
- package.json
- run-prod.sh
- audit-events/route.ts
- assurances/route.ts
- bindings/[id]/route.ts
- assistant/context.ts
- Policy Engine and Guardrails
- Proposed Defaults (v1 Decisions)
- Security and Compliance Requirements
- Canonical Entity Shape (v1)
- Detailed System Architecture
- Management Surface
- Product Goals and Success Metrics
- adapters/[id]/route.ts
- operation/route.ts
- system/route.ts
- formatWinrmRemediationHintsForDevice
- OperationKind
- chat-stream-registry.ts
- normalizeShellReadCommand
- output-json.ts
- Core User Journeys
- API Contract Sketch (v1)
- Autonomy Model
- Deployment and Operations
- Observability of Steward Itself
- Decisioning and Remediation Flow (Executable Semantics)
- Deployment Model
- Incident Severity and SLOs
- Knowledge Graph Schema (Expanded)
- The Conversational Layer
- Product Scope
- Validation and Test Strategy
- Quickstart
- adapters/route.ts
- cancel/route.ts
- [pageId]/route.ts
- digest/route.ts
- saga.ts
- http-client.ts
- Extensibility Model
- API Surface (Product-Level)
- Notifications and Approvals
- Configuration and State Model (DB-Backed)
- Core Architecture
- Reporting
- UX and Information Architecture
- Security Posture
- vendor-modules.d.ts
- @ai-sdk/cohere
- @ai-sdk/google
- @ai-sdk/groq
- @ai-sdk/mistral
- @ai-sdk/openai
- @ai-sdk/xai
- eslint.config.mjs
- framer-motion
- guacamole-common-js
- guacamole-lite
- lucide-react
- next
- next.config.ts
- @novnc/novnc
- playwright
- radix-ui
- @radix-ui/react-slot
- react
- react-dom
- react-markdown
- ws
- zod
- postcss.config.mjs
- stop-prod.sh script
- vitest.config.mts
- synthesizeOnboardingContracts

## God Nodes (most connected - your core abstractions)
1. `StateStore` - 366 edges
2. `isAuthorized()` - 299 edges
3. `cn()` - 126 edges
4. `buildAdapterSkillTools()` - 125 edges
5. `Device` - 81 edges
6. `AutonomyStore` - 76 edges
7. `getDb()` - 62 edges
8. `normalizeCredentialProtocol()` - 50 edges
9. `Steward` - 44 edges
10. `useSteward()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `ChatRuntimeProvider()` --indirect_call--> `userMessage()`  [INFERRED]
  src/lib/hooks/use-chat-runtime.tsx → tests/lib/device-actions-adhoc-context.test.ts
- `tableColumns()` --calls--> `getDb()`  [EXTRACTED]
  tests/lib/autonomy-schema.test.ts → src/lib/state/db.ts
- `KindBadge()` --calls--> `cn()`  [EXTRACTED]
  src/app/activity/page.tsx → src/lib/utils.ts
- `GET()` --calls--> `isAuthorized()`  [EXTRACTED]
  src/app/api/adapters/[id]/route.ts → src/lib/auth/guard.ts
- `DELETE()` --calls--> `isAuthorized()`  [EXTRACTED]
  src/app/api/adapters/[id]/route.ts → src/lib/auth/guard.ts

## Import Cycles
- None detected.

## Communities (227 total, 28 thin omitted)

### Community 0 - "StateStore"
Cohesion: 0.03
Nodes (16): deviceAutomationFromRow(), deviceWidgetOperationRunFromRow(), localToolApprovalFromRow(), localToolRecordFromRow(), metricSeriesFromRow(), notificationDeliveryFromRow(), protocolSessionLeaseFromRow(), protocolSessionRecordFromRow() (+8 more)

### Community 1 - "device-contracts-panel.tsx"
Cohesion: 0.08
Nodes (64): AdaptersPage(), CAPABILITY_COLORS, DEFAULT_MANIFEST_TEMPLATE, parseJsonValue(), STATUS_CONFIG, stringifyConfig(), TOOL_OPERATION_KIND_OPTIONS, BriefingItem (+56 more)

### Community 2 - "AutonomyStore"
Cohesion: 0.07
Nodes (29): builtinMissions(), AutonomyStore, briefingFromRow(), gatewayBindingFromRow(), gatewayInboundEventFromRow(), investigationFromRow(), investigationStepFromRow(), missionFromRow() (+21 more)

### Community 3 - "contracts.ts"
Cohesion: 0.05
Nodes (67): AdapterCandidateHint, dedupeBy(), DeviceAdoptionProfile, DeviceCredentialIntent, extractJsonObject(), fallbackProfile(), generateDeviceAdoptionProfile(), OnboardingQuestionDraft (+59 more)

### Community 4 - "adoption/orchestrator.ts"
Cohesion: 0.06
Nodes (68): bindSchema, deriveAccessMethodKeys(), guessManualBindingRequirements(), isRecord(), POST(), preferredAccessKeyForKind(), profileUpdateSchema, selectedAccessMethodKeysFromSnapshot() (+60 more)

### Community 5 - "tool-skills.ts"
Cohesion: 0.06
Nodes (73): actionClassForOperation(), augmentToolCallParameters(), buildAdapterPackagePayload(), buildAdapterSkillTools(), buildCommonToolArgumentProperties(), buildContractSnapshotPayload(), buildDeviceWebUrl(), buildDiscoveryHintBuckets() (+65 more)

### Community 6 - "isAuthorized"
Cohesion: 0.04
Nodes (50): ConfigSchema, GET(), POST(), POST(), DELETE(), PATCH(), UpdateDashboardWidgetPageItemSchema, CreateDashboardWidgetPageSchema (+42 more)

### Community 7 - "discovery/engine.ts"
Cohesion: 0.06
Nodes (70): annotateDiscoveryPhaseTargets(), applyPacketIntelSnapshot(), applyProbeResults(), computeStepBudgetMs(), countBrowserEndpoints(), deferredTargetNote(), DiscoveryRunOptions, DNS_PORTS (+62 more)

### Community 8 - "loop.ts"
Cohesion: 0.07
Nodes (63): POST(), agentWakeLeaseTtlMs(), AssuranceSweepSummary, buildBaseline(), coordinatorIntervalMs(), cycleLeaseTtlMs(), daysUntilIso(), discoverPhase() (+55 more)

### Community 9 - "state/types.ts"
Cohesion: 0.03
Nodes (67): AccessMethodKind, AccessMethodStatus, AdoptionRunStage, AdoptionRunStatus, AuthMode, AuthSession, ChatToolEventStatus, ChatToolOnboardingMutationAction (+59 more)

### Community 10 - "protocol-broker.ts"
Cohesion: 0.10
Nodes (63): interpolateOperationValue(), analyzeSmbFailure(), analyzeWmiFailure(), appendHostNetworkSummary(), applyExpectationToOutput(), BrokerExecutionContext, brokerResult(), buildSshRemoteCommand() (+55 more)

### Community 11 - "settings/page.tsx"
Cohesion: 0.06
Nodes (56): ActionEntry(), ActivityPage(), ACTOR_OPTIONS, formatTimestamp(), isDiscoveryEnrichmentLane(), KIND_COLORS, KIND_OPTIONS, KindBadge() (+48 more)

### Community 12 - "device-inventory-page.tsx"
Cohesion: 0.06
Nodes (50): buildEditorState(), cadenceLabel(), DeviceItem, formatScope(), formatWhen(), MissionEditorState, MissionItem, MissionSelector (+42 more)

### Community 13 - "dashboard-widgets-panel.tsx"
Cohesion: 0.10
Nodes (37): AccessPageContent(), apiFetch(), MeResponse, roleOptions, SubagentItem, DashboardWidgetsPanelProps, GridMetrics, PendingDeleteTarget (+29 more)

### Community 14 - "autonomy/runtime.ts"
Cohesion: 0.09
Nodes (45): BriefingRequestSchema, GET(), POST(), POST(), addMinutes(), AUTONOMY_JOB_KINDS, briefingRecordId(), dedupeKeyForApprovalFollowup() (+37 more)

### Community 15 - "state/store.ts"
Cohesion: 0.05
Nodes (31): FindingsPayload, getAuditDbPath(), getDbPath(), accessMethodFromRow(), accessSurfaceFromRow(), adoptionQuestionFromRow(), assuranceRunFromRow(), dashboardWidgetInventoryEntryFromRow() (+23 more)

### Community 16 - "chat-workspace.tsx"
Cohesion: 0.05
Nodes (44): artifactImageSrc(), AssistantMessageBlock, BrowserStepPreview, browserStepScreenshotSrc(), BrowserToolPreview, buildAssistantBlocks(), buildCollapsedToolOutputPreview(), ChatMessage (+36 more)

### Community 17 - "recoverCorruptDatabase"
Cohesion: 0.09
Nodes (30): DELETE(), GET(), PackPatchSchema, PATCH(), GET(), PackCreateSchema, POST(), GET() (+22 more)

### Community 18 - "remote-desktop/manager.ts"
Cohesion: 0.09
Nodes (50): acquireLease(), activeLeasesForSession(), bridgeRuntime(), BridgeRuntimeState, buildBridgeToken(), buildClaims(), buildExternalBridgeWsUrl(), buildRdpConnectionSettings() (+42 more)

### Community 19 - "device-actions.ts"
Cohesion: 0.07
Nodes (47): ADHOC_PLAN_JSON_SHAPE_LINES, AdhocPlan, AdhocPlanSchema, AdhocPlanStepSchema, AdhocTaskRequestResolution, AdhocTaskRequestResolutionSchema, buildAdhocTaskResolutionPrompt(), buildPlaybookChatMetadata() (+39 more)

### Community 20 - "missions/repository.ts"
Cohesion: 0.09
Nodes (31): GET(), GET(), MissionPatchSchema, PATCH(), GET(), MissionCreateSchema, POST(), slugify() (+23 more)

### Community 21 - "web-research.ts"
Cohesion: 0.10
Nodes (47): GET(), POST(), schema, BLOCKED_HOST_SUFFIXES, buildBraveSearchUrl(), buildDuckDuckGoSearchUrl(), buildProviderFallbackOrder(), clampInt() (+39 more)

### Community 22 - "web-sessions/manager.ts"
Cohesion: 0.09
Nodes (38): ProtocolSessionRecord, authResponseState(), BrowserFlowArgs, BrowserFlowStepInput, buildCookieHeaderFromState(), buildLease(), chooseLoginSelector(), clampInt() (+30 more)

### Community 23 - "contract-management.ts"
Cohesion: 0.08
Nodes (44): criticalitySchema, DELETE(), desiredStateSchema, PATCH(), updateAssuranceSchema, createWorkloadSchema, criticalitySchema, GET() (+36 more)

### Community 24 - "operator-notes.ts"
Cohesion: 0.08
Nodes (45): buildDeviceSnapshot(), buildFallbackOperatorNotes(), buildFallbackStructuredContext(), buildToolEventDigest(), clampText(), currentIdentityRecord(), currentNotesRecord(), getCurrentOperatorNotes() (+37 more)

### Community 25 - "chat/route.ts"
Cohesion: 0.09
Nodes (42): autoContinueIfTruncated(), buildDirectWidgetResponse(), buildToolOnlyFallback(), CHAT_ARTIFACTS_DIR, CHAT_AUTO_CONTINUE_FINISH_REASONS, CHAT_BROWSER_ARTIFACT_DIR, CHAT_REMOTE_DESKTOP_ARTIFACT_DIR, clampText() (+34 more)

### Community 26 - "Device"
Cohesion: 0.08
Nodes (31): AdoptionSnapshot, AdoptionSnapshot, AdoptionSnapshot, AdoptionSnapshot, Snapshot, AdoptionSnapshot, DeviceAdoptionSnapshot, RouteFindingInput (+23 more)

### Community 27 - "classify.ts"
Cohesion: 0.09
Nodes (45): candidateToDevice(), ClassificationResult, ClassificationSignal, classifyDevice(), friendlyNamesFromMetadata(), hasAirplayMdnsHints(), hasAirplayServiceHints(), hasAny() (+37 more)

### Community 28 - "fingerprint.ts"
Cohesion: 0.07
Nodes (46): AGGRESSIVE_HINT_PORTS, applyProtocolHintToService(), BANNER_PORTS, buildDnsQueryPacket(), buildNetbiosQueryPacket(), DNS_PORTS, encodeDnsName(), encodeNetbiosName() (+38 more)

### Community 29 - "cn"
Cohesion: 0.07
Nodes (33): WidgetSurface(), ACTION_CLASS_COLORS, decisionBadgeVariant(), decisionLabel(), formatTimestamp(), PlaybookRunCard(), statusBadgeVariant(), statusLabel() (+25 more)

### Community 30 - "active.ts"
Cohesion: 0.12
Nodes (41): ActiveDiscoveryOptions, buildHostCandidatesFromLocalInterfaces(), buildHostCandidatesFromSubnets(), collectActiveCandidates(), COMMON_TCP_SERVICES, discoverySweepSubnetForIp(), isEligibleIp(), parseNmapLine() (+33 more)

### Community 31 - "policies/page.tsx"
Cohesion: 0.08
Nodes (39): DashboardAutonomyMetrics, DashboardBriefingItem, DashboardInvestigationItem, DashboardMissionItem, DashboardPage(), formatWhen(), priorityVariant(), relativeTime() (+31 more)

### Community 32 - "button.tsx"
Cohesion: 0.07
Nodes (33): metadata, monoFont, uiFont, AppShell(), navGroups, NavItem, NavLink(), ACTION_CLASS_COLORS (+25 more)

### Community 33 - "gateway.ts"
Cohesion: 0.10
Nodes (36): BindingCreateSchema, GET(), POST(), redactBinding(), POST(), buildGlobalBriefing(), buildOperatorStatusText(), formatBullet() (+28 more)

### Community 34 - "defaultBrokerRequest"
Cohesion: 0.09
Nodes (41): buildOperationFromDescriptor(), clampInt(), coercePort(), defaultBrokerRequest(), defaultCommandTemplate(), DOCKER_PORT_PREFERENCE, dockerHostTarget(), hasMqttPublishInput() (+33 more)

### Community 35 - "db.ts"
Cohesion: 0.10
Nodes (35): applyAuditSchemaAndMigrations(), applyStateSchemaAndMigrations(), AUDIT_DB_PATH, chooseCanonicalInvestigationRow(), closeAuditDbQuietly(), closeDbQuietly(), closeOpenDatabases(), CORRUPT_ARCHIVE_DIR (+27 more)

### Community 36 - "defaults.ts"
Cohesion: 0.10
Nodes (19): defaultAuthSettings(), defaultPolicyRules(), defaultProviderConfigs(), defaultState(), defaultSystemSettings(), ensureDefaults(), initAction(), normalizeEnabledProviders() (+11 more)

### Community 37 - ".getState"
Cohesion: 0.08
Nodes (15): agentRunFromRow(), baselineFromRow(), graphEdgeFromRow(), graphNodeFromRow(), incidentFromRow(), maintenanceWindowFromRow(), oauthStateFromRow(), providerConfigFromRow() (+7 more)

### Community 38 - "local-tools/runtime.ts"
Cohesion: 0.14
Nodes (21): ApprovalDecision, defaultRecordForManifest(), ensureInstallScaffold(), installDirForTool(), LocalToolActionResult, LocalToolHealthResult, LocalToolRuntime, localToolsRoot() (+13 more)

### Community 39 - "controls.ts"
Cohesion: 0.08
Nodes (33): CapabilitySchema, createWidgetSchema, GET(), POST(), ExecuteControlSchema, GET(), POST(), CapabilitySchema (+25 more)

### Community 40 - "playbooks/registry.ts"
Cohesion: 0.10
Nodes (27): GET(), httpBrokerRequest(), sshBrokerRequest(), sshShellBrokerRequest(), backupRetryPlaybooks, mutateSafety, readSafety, certRenewalPlaybooks (+19 more)

### Community 41 - "dashboard-widget-grid.ts"
Cohesion: 0.13
Nodes (23): createInteractionShield(), DashboardWidgetsPanel(), DashboardWidgetTile(), replacePage(), compareDashboardWidgetGridItems(), DashboardWidgetGridItem, findDashboardWidgetGridPlacement(), getColumnEnd() (+15 more)

### Community 42 - "autonomy/types.ts"
Cohesion: 0.07
Nodes (33): autonomy(), builtinPack(), builtinPacks(), builtinSubagents(), nowIso(), scope(), AutonomyWorkerHealth, GatewayBindingKind (+25 more)

### Community 43 - "getDb"
Cohesion: 0.15
Nodes (28): DELETE(), ownerCount(), PATCH(), UpdateSchema, CreateUserSchema, GET(), POST(), AuthSessionRow (+20 more)

### Community 44 - "topology/page.tsx"
Cohesion: 0.11
Nodes (32): buildDeviceDependencyMaps(), buildDeviceSubnetMap(), buildTopologySections(), COLUMN_LABELS, COLUMN_ORDER, EDGE_DEVICE_TYPES, formatDeviceType(), formatLastSeen() (+24 more)

### Community 45 - "winrm.ts"
Cohesion: 0.12
Nodes (32): buildWindowsRemoteHostCandidates(), buildWinrmAuthenticationCandidates(), buildWinrmConnectionAttempts(), buildWinrmHostCandidates(), uniqStrings(), buildWinrmPowerShellScript(), candidateList(), decodeClixmlEncodedBreaks() (+24 more)

### Community 46 - "operations.ts"
Cohesion: 0.10
Nodes (32): ProtocolBrokerRequest, WidgetOperationResult, actionClassForOperation(), buildOperationSpec(), buildWidgetExecutionParams(), createWidgetOperationRun(), criticalityForOperation(), extractSerialFromSubject() (+24 more)

### Community 47 - "browser-observer.ts"
Cohesion: 0.11
Nodes (30): ALLOWED_ARTIFACT_PREFIXES, CHAT_ARTIFACTS_ROOT, GET(), inferContentType(), normalizeRelativeArtifactPath(), BrowserObservationOptions, BrowserProbeResult, BrowserProbeTarget (+22 more)

### Community 48 - "credentials.ts"
Cohesion: 0.12
Nodes (29): defaultScope(), findExistingCredential(), isRecord(), mergeCredentialScope(), normalizeAccountLabel(), nowIso(), scopeIdentityKey(), storeDeviceCredential() (+21 more)

### Community 49 - "use-steward.tsx"
Cohesion: 0.09
Nodes (25): DigestViewProps, persistApiToken(), AdapterPackageClient, AdapterPackageMutationPayload, AdapterRecordClient, fetchAuthStatus(), fetchJson(), mergeStatePatch() (+17 more)

### Community 50 - "plan-ir/route.ts"
Cohesion: 0.18
Nodes (23): BodySchema, inferCriticality(), POST(), toPlaybookDefinition(), GET(), POST(), TriggerSchema, CREDENTIAL_GATED_PROTOCOLS (+15 more)

### Community 51 - "execution-kernel.ts"
Cohesion: 0.13
Nodes (28): PolicyRuleFormState, ADAPTER_ALIASES, adapterMatchesDevice(), collectSemanticProtocols(), computeDeviceStateHash(), dryRunIfSupported(), executeOperationWithGates(), gate() (+20 more)

### Community 52 - "oauth.ts"
Cohesion: 0.15
Nodes (22): RFC-8693, bodySchema, POST(), GET(), GET(), ANTHROPIC_SCOPES, AnthropicOAuthMode, AnthropicTokenResponse (+14 more)

### Community 53 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 54 - "guard.ts"
Cohesion: 0.10
Nodes (21): POST(), ToggleSchema, CreateDashboardWidgetPageItemSchema, POST(), GET(), POST(), ToggleSchema, GET() (+13 more)

### Community 55 - "gateway/repository.ts"
Cohesion: 0.13
Nodes (13): DELETE(), GET(), PATCH(), patchSchema, gatewayThreadFromRow(), ChannelDeliveryRecord, GatewayBindingRecord, GatewayThreadRecord (+5 more)

### Community 56 - "subagents/repository.ts"
Cohesion: 0.14
Nodes (16): createSchema, GET(), POST(), PATCH(), SubagentPatchSchema, StandingOrderRecord, SubagentMemoryRecord, SubagentRecord (+8 more)

### Community 57 - "incidents/page.tsx"
Cohesion: 0.14
Nodes (24): POST(), formatDateTime(), formatRelativeTime(), IncidentDetailPage(), severityBadgeVariant(), severityIcon(), statusBadgeVariant(), formatTimeSince() (+16 more)

### Community 58 - "normalizeCredentialProtocol"
Cohesion: 0.14
Nodes (27): credentialProtocolLabel(), credentialStatusLabel(), DeviceCredentialsPanel(), credentialUsageHints(), deviceHasObservedProtocol(), inferAdapterForKind(), inferFallbackMatchedAdapters(), resolveCredentialForDevice() (+19 more)

### Community 59 - "mqtt-client.ts"
Cohesion: 0.14
Nodes (27): KernelExecutionResult, BrokerExecutionResult, clampInt(), clampQos(), executeRenderedMqttRequest(), inferMqttScheme(), loadMqttConnect(), matchingMqttService() (+19 more)

### Community 60 - "applyOperationalFindingPacks"
Cohesion: 0.11
Nodes (28): applyOperationalFindingPacks(), assuranceText(), criticalityToIncidentSeverity(), criticalityToRecommendationPriority(), dedupeRecommendations(), emptyAssuranceSweepSummary(), enqueueAssuranceJob(), ensureRecommendation() (+20 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): ai, @ai-sdk/anthropic, better-sqlite3, class-variance-authority, clsx, jose, ldapts, mqtt (+19 more)

### Community 62 - "notifications/manager.ts"
Cohesion: 0.15
Nodes (24): FindingIncidentInput, incidentKey(), resolveIncidentByKey(), routeFinding(), upsertIncident(), average(), latencyBounds(), recordDeviceLatencyMetric() (+16 more)

### Community 63 - "widgets/generator.ts"
Cohesion: 0.15
Nodes (26): autoContinueWidgetGeneration(), buildDraftWidgetForVerification(), DeviceWidgetGenerationContext, extractFirstJsonObject(), generateAndStoreDeviceWidget(), GenerateDeviceWidgetInput, GenerateDeviceWidgetResult, GeneratedWidget (+18 more)

### Community 64 - "automations.ts"
Cohesion: 0.17
Nodes (22): DELETE(), GET(), PATCH(), GET(), POST(), CreateAutomationSchema, GET(), POST() (+14 more)

### Community 65 - "devices/[id]/page.tsx"
Cohesion: 0.12
Nodes (24): AnimatedTabPanel(), asRecord(), cleanSnapshotVendor(), DeviceDetailPage(), DeviceManageTab, DevicePrimaryTab, formatDate(), formatProtocolChip() (+16 more)

### Community 66 - "adapters/types.ts"
Cohesion: 0.10
Nodes (23): AdapterPackageRecord, LoadedAdapterEntry, BUILTIN_ADAPTERS, BuiltinAdapterBundle, WINDOWS_SERVER_ADAPTER_SOURCE, WINDOWS_WORKSTATION_ADAPTER_SOURCE, AdapterCapability, AdapterConfigField (+15 more)

### Community 67 - "providers.ts"
Cohesion: 0.16
Nodes (21): refreshOpenAIToken(), getProviderConfig(), modelSupportsTemperature(), OPENAI_OAUTH_CODEX_MODEL_SET, OPENAI_OAUTH_CODEX_MODELS, buildAnthropicOAuth(), buildCodexJsonResponseFromSse(), buildLanguageModel() (+13 more)

### Community 68 - "models.ts"
Cohesion: 0.17
Nodes (24): anthropicCallableModelCache, anthropicCallableModelCacheKey(), anthropicFallbackRank(), AnthropicOAuthModelResolution, fetchAnthropicModels(), fetchCohereModels(), fetchGoogleModels(), fetchJson() (+16 more)

### Community 69 - "install-prod.sh"
Cohesion: 0.31
Nodes (24): detect_linux_package_manager(), ensure_apk_node(), ensure_apk_powershell(), ensure_apt_node(), ensure_apt_powershell(), ensure_homebrew(), ensure_linux_prereqs(), ensure_macos_node() (+16 more)

### Community 70 - "protocol-sessions/manager.ts"
Cohesion: 0.12
Nodes (21): createSessionSchema, GET(), mqttBrokerSchema, POST(), selectCredential(), MqttReceivedMessage, RenderedMqttRequest, buildSessionId() (+13 more)

### Community 71 - "evidence.ts"
Cohesion: 0.14
Nodes (23): BASE_EVIDENCE_WEIGHT, clamp(), dedupeObservations(), DEFAULT_TTL_BY_EVIDENCE, DiscoveryFusionResult, evaluateDiscoveryEvidence(), normalizeObservation(), parseTime() (+15 more)

### Community 72 - "openai-oauth-server.ts"
Cohesion: 0.16
Nodes (18): POST(), defaultProviderConfigMap, GET(), POST(), providerSchema, buildOpenAIAuthorizeUrl(), exchangeOpenAICode(), exchangeOpenAITokenForApiKey() (+10 more)

### Community 73 - "playbooks/runtime.ts"
Cohesion: 0.14
Nodes (21): clearWaitingState(), executePlaybook(), executeSequence(), executeStep(), markWaitingStep(), parseRegex(), recentFailureCount(), recordOperation() (+13 more)

### Community 74 - "devDependencies"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/better-sqlite3 (+15 more)

### Community 75 - "adapterRecordFromRow"
Cohesion: 0.19
Nodes (16): adapterPath(), adapterRecordFromRow(), BUILTIN_ADAPTER_IDS, ensureBuiltinAdaptersInstalled(), normalizeManifestToolSkills(), normalizeMutationActor(), parseManifestMutation(), readFileIfExists() (+8 more)

### Community 76 - "getAuthContext"
Cohesion: 0.21
Nodes (17): POST(), TestSchema, GET(), AuthSettingsSchema, GET(), POST(), getAuthContext(), countAuthUsers() (+9 more)

### Community 77 - "vault.ts"
Cohesion: 0.11
Nodes (14): POST(), schema, GET(), platformName(), EncryptedEnvelope, encryptPayload(), ensureVaultDir(), legacyMetaFile (+6 more)

### Community 78 - "remote-desktop-viewer.tsx"
Cohesion: 0.13
Nodes (20): RemoteDesktopPage(), renderError(), clamp(), GuacamoleClientInstance, GuacamoleDisplay, GuacamoleKeyboardInstance, GuacamoleMouseInstance, GuacamoleNamespace (+12 more)

### Community 79 - "ProtocolSessionManager"
Cohesion: 0.29
Nodes (3): nowIso(), ProtocolSessionManager, readMqttSessionConfig()

### Community 80 - "ensure-remote-desktop-runtime.mjs"
Cohesion: 0.26
Nodes (19): BEST_EFFORT, commandExists(), dockerContainerExists(), dockerDaemonReady(), dockerDesktopCandidates(), dockerInstalled(), ensureDockerGuacd(), fail() (+11 more)

### Community 81 - "catalog.ts"
Cohesion: 0.19
Nodes (15): GET(), DELETE(), PATCH(), updateSchema, POST(), createSchema, GET(), POST() (+7 more)

### Community 82 - "conversation.ts"
Cohesion: 0.19
Nodes (18): ResponsibilityRow, buildOnboardingLocalContext(), buildOnboardingSystemPrompt(), credentialStatusRank(), deviceLooksLikeGateway(), extractJsonObject(), isRecord(), normalizeProposal() (+10 more)

### Community 83 - "adapters/registry.ts"
Cohesion: 0.23
Nodes (18): AdapterMutationOptions, AdapterPackageMutation, buildManifestFromRow(), defaultsFromManifest(), defaultToolConfigFromManifest(), DeviceWebFlowBinding, ensureRecord(), isRecord() (+10 more)

### Community 84 - "devices/[id]/route.ts"
Cohesion: 0.20
Nodes (15): GET(), POST(), startSchema, GET(), PATCH(), updateDeviceSchema, createDeviceSchema, GET() (+7 more)

### Community 85 - "policies/[id]/route.ts"
Cohesion: 0.16
Nodes (14): DELETE(), PATCH(), UpdateWindowSchema, CreateWindowSchema, GET(), POST(), DELETE(), GET() (+6 more)

### Community 86 - "exchange/route.ts"
Cohesion: 0.20
Nodes (15): bodySchema, clearStoredAnthropicApiKey(), POST(), createAnthropicApiKey(), exchangeAnthropicCode(), refreshAnthropicToken(), AnthropicOAuthSession, clearAnthropicOAuthTokens() (+7 more)

### Community 87 - "graph-query.ts"
Cohesion: 0.22
Nodes (18): buildDeviceSearchHaystack(), clampInt(), extractHours(), formatDependents(), formatRecentChanges(), GraphQueryResult, inventoryMatchScore(), LOCAL_INTERFACES (+10 more)

### Community 88 - ".withAuditDbRecovery"
Cohesion: 0.13
Nodes (3): actionFromRow(), ActionLog, CredentialAccessLog

### Community 89 - "callback/route.ts"
Cohesion: 0.29
Nodes (14): BootstrapSchema, POST(), LoginSchema, POST(), GET(), consumeOidcState(), createAuthSession(), touchAuthUserLogin() (+6 more)

### Community 90 - "remote-terminal/route.ts"
Cohesion: 0.21
Nodes (17): buildTerminalBrokerRequest(), buildTerminalOperation(), deviceLooksWindows(), escapePowerShellSingleQuoted(), escapeShellSingleQuoted(), GET(), hasObservedProtocol(), hasStoredCredential() (+9 more)

### Community 91 - "jobs.ts"
Cohesion: 0.24
Nodes (15): isJobsTabValue(), JobsPageContent(), ACTIVE_JOB_STATUSES, ATTENTION_JOB_STATUSES, bucketPlaybookRuns(), countOpenJobs(), countRunningPlaybookRuns(), HISTORY_JOB_STATUSES (+7 more)

### Community 92 - "skills.ts"
Cohesion: 0.18
Nodes (16): AdapterCapabilitySchema, formatManifestError(), loadAdapterModule(), ManifestSchema, parseManifest(), readManifest(), shouldRefreshBuiltinFiles(), buildToolSkillMarkdown() (+8 more)

### Community 93 - "discovery/types.ts"
Cohesion: 0.24
Nodes (16): asFiniteNumber(), asString(), isDiscoveryEnrichmentPhase(), isPhaseStatus(), isRecord(), parseDiscoveryDiagnostics(), parseDiscoveryEnrichmentPhaseSummary(), parseDiscoveryEnrichmentSummary() (+8 more)

### Community 94 - "graph.ts"
Cohesion: 0.19
Nodes (14): findEdgeById(), findNode(), graphEdgeFromRow(), graphNodeFromRow(), graphStore, LOCAL_INTERFACES, recordEdgeVersion(), recordNodeVersion() (+6 more)

### Community 95 - "Steward"
Cohesion: 0.12
Nodes (16): Acceptance Criteria (v1), Example Playbook Families, Incident Response Pipeline, Key Risks and Mitigations, Non-Negotiable Configuration Rule, Open Questions, Personality & Design Philosophy, Playbook Model (+8 more)

### Community 96 - "hashApiToken"
Cohesion: 0.17
Nodes (14): POST(), GET(), POST(), schema, presentedApiToken(), resolveSessionIdentity(), resolveTokenIdentity(), deleteSessionByToken() (+6 more)

### Community 97 - "local-tools/[id]/route.ts"
Cohesion: 0.15
Nodes (12): POST(), POST(), GET(), POST(), PUT(), GET(), POST(), localToolActionSchema (+4 more)

### Community 98 - "AdapterRegistry"
Cohesion: 0.25
Nodes (5): AdapterRegistry, adaptersDir(), asAdapterSource(), AdapterProfileMatch, DiscoveryCandidate

### Community 99 - "widget-routing.ts"
Cohesion: 0.15
Nodes (13): planWidgetRoute(), summarizeRecentMessages(), summarizeRecentWidgetToolEvents(), summarizeWidgets(), WidgetGenerateToolArgsSchema, WidgetGetToolArgsSchema, WidgetInventoryEntry, WidgetListToolArgsSchema (+5 more)

### Community 100 - "agent.ts"
Cohesion: 0.18
Nodes (15): captureSnapshot(), clampInt(), normalizeStepResult(), performStep(), PlaywrightBrowser, PlaywrightChromium, PlaywrightPage, RemoteDesktopFlowStepInput (+7 more)

### Community 101 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, lib, ui, utils, rsc, $schema, style (+7 more)

### Community 102 - "ensure-network-tools.mjs"
Cohesion: 0.31
Nodes (15): BEST_EFFORT, canUseSudoNonInteractive(), commandExists(), exitOrWarn(), getSudoMode(), isWindowsExecutable(), main(), manualHelp() (+7 more)

### Community 103 - "queue.ts"
Cohesion: 0.31
Nodes (11): ActionSchema, POST(), GET(), GET(), approveAction(), denyAction(), expireStale(), ttlForRun() (+3 more)

### Community 104 - "multicast.ts"
Cohesion: 0.19
Nodes (15): buildDnsSdBrowseQuery(), discoverMdns(), discoverMulticast(), discoverSsdp(), fetchUpnpDescription(), MDNS_SERVICE_TYPE_MAP, MDNS_TYPE_HINT_WEIGHT, MdnsRecord (+7 more)

### Community 105 - "device-remote-desktop-panel.tsx"
Cohesion: 0.22
Nodes (13): defaultPort(), DeviceRemoteDesktopPanel(), DeviceRemoteDesktopPanelProps, LiveViewerState, normalizeProtocol(), ViewerAccessResponse, ViewerBootstrapResponse, SessionLeaseRequest (+5 more)

### Community 106 - "os-keystore.ts"
Cohesion: 0.30
Nodes (14): execFileAsync, fallbackProtect(), fallbackUnprotect(), getMachineEntropy(), macProtect(), macUnprotect(), parseKeychainMarker(), protectKey() (+6 more)

### Community 107 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, lint, network-tools:install, playwright:install, postinstall, predev (+6 more)

### Community 108 - "metrics.ts"
Cohesion: 0.24
Nodes (11): GET(), getAutonomyMetricsSnapshot(), percentile(), summarizeLatency(), withAuditDbRecovery(), withStateDbRecovery(), AutonomyLatencySummary, AutonomyMetricsSnapshot (+3 more)

### Community 109 - "LLMProvider"
Cohesion: 0.22
Nodes (11): GET(), GET(), OAuthSettings, ALL_PROVIDER_IDS, getProviderMeta(), OAuthMethod, PROVIDER_MAP, PROVIDER_REGISTRY (+3 more)

### Community 110 - "remote-desktop/sessions/route.ts"
Cohesion: 0.15
Nodes (10): GET(), POST(), schema, POST(), schema, createSessionSchema, GET(), POST() (+2 more)

### Community 111 - "PlaybookRun"
Cohesion: 0.18
Nodes (7): ApprovalCardRun, PlaybookRunCardProps, playbookRunFromRow(), ChatMessage, PlaybookRun, mocks, userMessage()

### Community 112 - "chat-playbook-run-widget.tsx"
Cohesion: 0.27
Nodes (12): buildProgressSummary(), ChatPlaybookRunWidget(), ChatPlaybookRunWidgetProps, decisionBadgeVariant(), decisionLabel(), findCurrentStep(), formatTimestamp(), statusBadgeVariant() (+4 more)

### Community 113 - "errors.ts"
Cohesion: 0.32
Nodes (11): collectErrorCandidates(), GENERIC_ERROR_PATTERNS, getProperty(), isMeaningfulErrorMessage(), isRecord(), maybeParseJsonString(), normalizeChatError(), PRIORITY_KEYS (+3 more)

### Community 114 - "Core endpoints"
Cohesion: 0.17
Nodes (11): API Guide, Chat and remote access, Compatibility, Core endpoints, Devices and inventory, Health and state, Incidents and approvals, Live updates (+3 more)

### Community 115 - "Operator Guide"
Cohesion: 0.17
Nodes (11): Approvals and autonomy, Daily operations, Data location, Docker, First 30 minutes, Host requirements, Local development, Operator Guide (+3 more)

### Community 116 - "README.md"
Cohesion: 0.17
Nodes (11): API Surface, Contributing, Documentation, Host tooling, License, LLM and Provider Support, Notification MVP, Screenshots (+3 more)

### Community 117 - "free-port.mjs"
Cohesion: 0.29
Nodes (10): freePort(), isProcessAlive(), listListeningPids(), listListeningPidsUnix(), listListeningPidsWindows(), parsePidList(), rawPorts, signalProcess() (+2 more)

### Community 118 - "start-prod.mjs"
Cohesion: 0.26
Nodes (11): builtStandaloneServerPath, child, cleanupOldRuntimeDirectories(), fail(), latestMtimeMs(), parseArgs(), { port, hostname }, replaceDirectory() (+3 more)

### Community 119 - "lookup.ts"
Cohesion: 0.38
Nodes (9): buildLookupAliases(), compactLookupToken(), exactTokenMatch(), isLiteralIpAddress(), normalizeLookupToken(), resolveDeviceByTarget(), scoreExactDeviceMatch(), scoreLookupAlias() (+1 more)

### Community 120 - "Steward Architecture"
Cohesion: 0.18
Nodes (10): Control plane, Core model, Discovery pipeline, Extensibility, Learn and diagnosis layers, Policy and remediation, Public release posture, State model (+2 more)

### Community 121 - "run-prod.ps1"
Cohesion: 0.36
Nodes (9): Expand-StewardProcessTree(), Get-ListeningProcessIds(), Get-NodeProcessInfo(), Get-ProcessInfoById(), Stop-LegacyStandaloneServer(), Stop-ProcessesById(), Stop-StewardListenerOnPort(), Test-IsDockerPortRelayProcess() (+1 more)

### Community 122 - "oidc.ts"
Cohesion: 0.35
Nodes (9): GET(), createOidcState(), buildOidcAuthorizeUrl(), fetchOidcDiscovery(), OidcDiscovery, OidcResolvedUser, OidcTokens, pkceCodeChallenge() (+1 more)

### Community 123 - "session/route.ts"
Cohesion: 0.31
Nodes (9): buildPayload(), GET(), isBrokenSeedMessage(), POST(), ensureOnboardingSession(), getOnboardingSession(), isOnboardingSession(), nowIso() (+1 more)

### Community 124 - "InvestigationRecord"
Cohesion: 0.29
Nodes (3): GET(), InvestigationRecord, InvestigationRepository

### Community 125 - "channels/route.ts"
Cohesion: 0.24
Nodes (9): DELETE(), eventKindSchema, PATCH(), updateChannelSchema, createChannelSchema, eventKindSchema, GET(), POST() (+1 more)

### Community 126 - "playbooks/orchestrator.ts"
Cohesion: 0.31
Nodes (8): executeQueuedPlaybookRun(), executionStamp(), kickRuntimeExecutionPlane(), queueApprovedPlaybookRuns(), queuePlaybookExecution(), runWithTimestamp(), terminalStatus(), mocks

### Community 127 - "ServiceContract"
Cohesion: 0.18
Nodes (4): assuranceFromRow(), inferWorkloadCategoryFromText(), slugifyKey(), ServiceContract

### Community 128 - "validateGeneratedWidgetAgainstContext"
Cohesion: 0.20
Nodes (11): accessMethodStatusRank(), buildWidgetGenerationHints(), collectGeneratedWidgetHttpRequests(), collectGeneratedWidgetWinrmRequests(), controlLooksLikeRefresh(), isHttpBrokerRequest(), isHueClipV2Context(), isWinrmBrokerRequest() (+3 more)

### Community 129 - "proposal/route.ts"
Cohesion: 0.29
Nodes (8): applySchema, GET(), getStoredSynthesis(), POST(), saveSynthesis(), ProposalPayload, OnboardingSynthesis, mocks

### Community 130 - "onboarding-contract.ts"
Cohesion: 0.40
Nodes (8): OnboardingAssuranceProposal, buildDraftAssurancesFromProposals(), buildDraftSeedFromSynthesis(), buildDraftWorkloadsFromResponsibilities(), clampIntervalSec(), dedupeStrings(), hasDraftProposalContent(), slugifyContractKey()

### Community 131 - "nmap-deep.ts"
Cohesion: 0.33
Nodes (9): buildPortList(), decodeXmlEntities(), deepScanCandidate(), FALLBACK_PORTS, NmapDeepOptions, NmapScriptFinding, parsePortAttributes(), scriptFindingsFromBlock() (+1 more)

### Community 132 - "runtimeLeaseFromRow"
Cohesion: 0.31
Nodes (5): leaseHolderPid(), parseJsonObject(), processExists(), runtimeLeaseFromRow(), ControlPlaneLeaseRecord

### Community 133 - "validateGeneratedWidgetStartupJs"
Cohesion: 0.33
Nodes (10): canAutoVerifyControl(), createVerificationElement(), describeVerificationError(), isRecord(), normalizeVerificationHttpResponse(), normalizeVerificationMqttMessages(), unwrapVerificationResult(), validateGeneratedWidgetOperationally() (+2 more)

### Community 134 - "Security"
Cohesion: 0.22
Nodes (8): Auditability, Configuration model, Execution safety, Identity and access, Network posture, Release checklist, Secrets and vault, Security

### Community 135 - "install-prod.ps1"
Cohesion: 0.47
Nodes (6): Add-CommonInstallPaths(), Ensure-DockerDesktop(), Ensure-Node(), Install-WingetPackageIfNeeded(), Test-CommandAvailable(), Test-NodeSupported()

### Community 136 - "Packs SDK"
Cohesion: 0.25
Nodes (7): Authoring workflow, Packs SDK, Public ecosystem direction, Runtime behavior, Signing and verification, What packs can contain, Why packs matter

### Community 137 - "ensure-playwright.mjs"
Cohesion: 0.39
Nodes (7): BEST_EFFORT, browserInstalled(), main(), reportSpawnFailure(), require, resolvePlaywrightCli(), run()

### Community 138 - "OperationSpec"
Cohesion: 0.32
Nodes (7): LlmPlanIr, OperationSafetySchema, OperationSpecSchema, parsePlanIr(), PlanIrSchema, PlanStepSchema, OperationSpec

### Community 139 - "tool-call-repair.ts"
Cohesion: 0.46
Nodes (6): createToolCallRepair(), isRecord(), parseObjectFromText(), repairMalformedToolCall(), repairWithModel(), { generateTextMock }

### Community 140 - "capability-broker.ts"
Cohesion: 0.43
Nodes (4): CapabilityBroker, StoredToken, CapabilityToken, CapabilityTokenScope

### Community 141 - "Core Capabilities"
Cohesion: 0.29
Nodes (7): Assistant, remotes, and generated surfaces, Core Capabilities, Discovery and inventory, Durable autonomy, Extensibility, Operator control plane, Safe automation and remediation

### Community 142 - "DeviceWidget"
Cohesion: 0.38
Nodes (3): DeviceWidgetRuntimeFrameProps, deviceWidgetFromRow(), DeviceWidget

### Community 143 - "scheduler.ts"
Cohesion: 0.57
Nodes (6): datePartsAt(), dueForToday(), ensureDigestScheduler(), localDateKey(), maybeGenerateScheduledDigest(), scheduleKey()

### Community 144 - "hostname-resolution.ts"
Cohesion: 0.43
Nodes (6): buildHostnameResolutionSummary(), HostnameResolutionStep, HostnameResolutionSummary, isRecord(), listSummary(), uniqueStrings()

### Community 145 - "mission-lab-replay.test.ts"
Cohesion: 0.48
Nodes (5): loadMissionLabScenario(), MissionLabScenario, parseMissionLabScenario(), ScenarioSchema, scenarioState

### Community 146 - "Discovery Engine"
Cohesion: 0.33
Nodes (6): Continuous Discovery, Discovery Engine, Phase 1: Passive Sweep, Phase 2: Active Enumeration, Phase 3: Protocol Negotiation, Phase 4: Credential Onboarding

### Community 147 - "Phased Delivery Plan"
Cohesion: 0.33
Nodes (6): Phase 0: Foundation (Complete in current repo baseline), Phase 1: Trustworthy Autonomy, Phase 2: Production Integrations, Phase 3: Multi-Site and MSP, Phase 4: Optimization Intelligence, Phased Delivery Plan

### Community 148 - "package.json"
Cohesion: 0.33
Nodes (5): name, overrides, flatted, private, version

### Community 149 - "run-prod.sh"
Cohesion: 0.60
Nodes (5): expand_steward_process_tree(), is_steward_command_line(), run-prod.sh script, stop_legacy_standalone_server(), stop_steward_listener_on_port()

### Community 150 - "audit-events/route.ts"
Cohesion: 0.47
Nodes (5): Cursor, decodeCursor(), encodeCursor(), GET(), querySchema

### Community 151 - "assurances/route.ts"
Cohesion: 0.33
Nodes (5): createAssuranceSchema, criticalitySchema, desiredStateSchema, GET(), POST()

### Community 152 - "bindings/[id]/route.ts"
Cohesion: 0.53
Nodes (5): BindingPatchSchema, DELETE(), GET(), PATCH(), redactBinding()

### Community 153 - "assistant/context.ts"
Cohesion: 0.47
Nodes (4): AssistantContext, buildAssistantContext(), trimForPrompt(), buildStewardSystemPrompt()

### Community 154 - "Policy Engine and Guardrails"
Cohesion: 0.40
Nodes (5): Action Classes, Decision Outcomes, Policy Engine and Guardrails, Policy Inputs, Safety Gates

### Community 155 - "Proposed Defaults (v1 Decisions)"
Cohesion: 0.40
Nodes (5): Agent Strategy, Cloud Relay Compliance Gate (Before GA), Data Retention Defaults by Deployment Type, Minimum Adapter Pack for "Works Out of the Box", Proposed Defaults (v1 Decisions)

### Community 156 - "Security and Compliance Requirements"
Cohesion: 0.40
Nodes (5): Auditability, Compliance Alignment (Target), Cryptography and Secrets, Identity and Access, Security and Compliance Requirements

### Community 157 - "Canonical Entity Shape (v1)"
Cohesion: 0.40
Nodes (5): Canonical Entity Shape (v1), Device, Incident, PlaybookRun, Service

### Community 158 - "Detailed System Architecture"
Cohesion: 0.40
Nodes (5): Control Plane Components, Data Plane Components, Detailed System Architecture, Execution Model, Storage Components

### Community 159 - "Management Surface"
Cohesion: 0.40
Nodes (5): Management Surface, Network Gear (Switches, Routers, APs), Printers, IoT, Everything Else, Servers (Linux/Windows), Storage (NAS, SAN)

### Community 160 - "Product Goals and Success Metrics"
Cohesion: 0.40
Nodes (5): Non-Goals (v1), North-Star Metric, Product Goals, Product Goals and Success Metrics, Supporting Metrics

### Community 161 - "adapters/[id]/route.ts"
Cohesion: 0.50
Nodes (4): DELETE(), GET(), PackageMutationSchema, PUT()

### Community 162 - "operation/route.ts"
Cohesion: 0.60
Nodes (4): POST(), WidgetOperationRequestSchema, executeWidgetOperation(), WidgetOperationSchema

### Community 163 - "system/route.ts"
Cohesion: 0.50
Nodes (4): GET(), isValidTimezone(), POST(), schema

### Community 164 - "formatWinrmRemediationHintsForDevice"
Cohesion: 0.50
Nodes (5): formatWinrmRemediationHints(), formatWinrmRemediationHintsForDevice(), looksLikeDomainController(), summarizeWinrmFailureStage(), analyzeWinrmFailure()

### Community 165 - "OperationKind"
Cohesion: 0.50
Nodes (5): AdapterToolSkill, SkillExecutionConfig, SkillRuntimeDescriptor, OperationKind, OperationMode

### Community 166 - "chat-stream-registry.ts"
Cohesion: 0.40
Nodes (4): ActiveChatStream, activeChatStreams, registerActiveChatStream(), releaseActiveChatStream()

### Community 167 - "normalizeShellReadCommand"
Cohesion: 0.50
Nodes (5): looksLikeSshTarget(), normalizeShellReadCommand(), SSH_OPTIONS_WITH_VALUE, stripOuterQuotes(), tokenizeCommand()

### Community 168 - "output-json.ts"
Cohesion: 0.70
Nodes (4): extractFirstJsonString(), isMatchingJsonBracket(), parseWidgetOutputJson(), stripWidgetOutputNoise()

### Community 169 - "Core User Journeys"
Cohesion: 0.50
Nodes (4): 1) First 30 Minutes, 2) Daily Operations, 3) Incident Mode, Core User Journeys

### Community 170 - "API Contract Sketch (v1)"
Cohesion: 0.50
Nodes (4): API Contract Sketch (v1), Contract Requirements, Core Endpoint Patterns, Event Streaming

### Community 171 - "Autonomy Model"
Cohesion: 0.50
Nodes (4): Autonomy Model, Tier 1: Observe Only, Tier 2: Safe Auto-Remediation, Tier 3: Full Autonomy

### Community 172 - "Deployment and Operations"
Cohesion: 0.50
Nodes (4): Backup and Restore, Deployment and Operations, Installation Modes, Upgrade Strategy

### Community 173 - "Observability of Steward Itself"
Cohesion: 0.50
Nodes (4): Control Plane Health Signals, Observability of Steward Itself, Operator-Facing Transparency, Self-Protection Behaviors

### Community 174 - "Decisioning and Remediation Flow (Executable Semantics)"
Cohesion: 0.50
Nodes (4): Decision Inputs, Decisioning and Remediation Flow (Executable Semantics), Deterministic Decision Order, Escalation Rules

### Community 175 - "Deployment Model"
Cohesion: 0.50
Nodes (4): Deployment Model, Multi-Site, Optional Cloud Relay, Self-Hosted (Primary)

### Community 176 - "Incident Severity and SLOs"
Cohesion: 0.50
Nodes (4): Error Budget Policy, Incident Severity and SLOs, Severity Model, SLO Targets (Default)

### Community 177 - "Knowledge Graph Schema (Expanded)"
Cohesion: 0.50
Nodes (4): Knowledge Graph Schema (Expanded), Primary Edge Types, Primary Node Types, Temporal Model

### Community 178 - "The Conversational Layer"
Cohesion: 0.50
Nodes (4): Natural Language Queries, Proactive Reporting, Task Delegation, The Conversational Layer

### Community 179 - "Product Scope"
Cohesion: 0.50
Nodes (4): Product Scope, v1.5 Scope, v1 Scope, v2 Scope

### Community 180 - "Validation and Test Strategy"
Cohesion: 0.50
Nodes (4): Release Gates, Required v1 Test Artifacts, Test Layers, Validation and Test Strategy

### Community 181 - "Quickstart"
Cohesion: 0.50
Nodes (4): Docker compose, Local development, Production scripts, Quickstart

### Community 182 - "adapters/route.ts"
Cohesion: 0.67
Nodes (3): CreateAdapterSchema, GET(), POST()

### Community 183 - "cancel/route.ts"
Cohesion: 0.67
Nodes (3): POST(), schema, cancelActiveChatStream()

### Community 184 - "[pageId]/route.ts"
Cohesion: 0.67
Nodes (3): DELETE(), PATCH(), UpdateDashboardWidgetPageSchema

### Community 185 - "digest/route.ts"
Cohesion: 0.67
Nodes (3): GET(), POST(), generateDigest()

### Community 187 - "http-client.ts"
Cohesion: 0.50
Nodes (3): HttpTextRequestOptions, HttpTextResponse, requestText()

### Community 188 - "Extensibility Model"
Cohesion: 0.67
Nodes (3): Adapter SDK, Extensibility Model, Marketplace Direction

### Community 189 - "API Surface (Product-Level)"
Cohesion: 0.67
Nodes (3): API Surface (Product-Level), Core Resources, Design Principles

### Community 190 - "Notifications and Approvals"
Cohesion: 0.67
Nodes (3): Approval UX Requirements, Channels, Notifications and Approvals

### Community 191 - "Configuration and State Model (DB-Backed)"
Cohesion: 0.67
Nodes (3): Configuration and State Model (DB-Backed), Configuration Domains, Required Configuration Behaviors

### Community 192 - "Core Architecture"
Cohesion: 0.67
Nodes (3): Core Architecture, The Agent Loop, The Knowledge Graph

### Community 193 - "Reporting"
Cohesion: 0.67
Nodes (3): Daily Briefing, Reporting, Weekly Executive Summary

### Community 194 - "UX and Information Architecture"
Cohesion: 0.67
Nodes (3): Design Requirements, Primary Views, UX and Information Architecture

### Community 195 - "Security Posture"
Cohesion: 0.67
Nodes (3): For Itself, For the Network, Security Posture

## Knowledge Gaps
- **860 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+855 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StateStore` connect `StateStore` to `AutonomyStore`, `contracts.ts`, `adoption/orchestrator.ts`, `tool-skills.ts`, `isAuthorized`, `discovery/engine.ts`, `loop.ts`, `protocol-broker.ts`, `autonomy/runtime.ts`, `state/store.ts`, `recoverCorruptDatabase`, `remote-desktop/manager.ts`, `device-actions.ts`, `missions/repository.ts`, `web-sessions/manager.ts`, `contract-management.ts`, `operator-notes.ts`, `chat/route.ts`, `Device`, `gateway.ts`, `defaults.ts`, `.getState`, `local-tools/runtime.ts`, `controls.ts`, `dashboard-widget-grid.ts`, `getDb`, `operations.ts`, `credentials.ts`, `use-steward.tsx`, `plan-ir/route.ts`, `execution-kernel.ts`, `oauth.ts`, `guard.ts`, `gateway/repository.ts`, `subagents/repository.ts`, `incidents/page.tsx`, `notifications/manager.ts`, `widgets/generator.ts`, `automations.ts`, `providers.ts`, `protocol-sessions/manager.ts`, `openai-oauth-server.ts`, `playbooks/runtime.ts`, `getAuthContext`, `vault.ts`, `catalog.ts`, `conversation.ts`, `adapters/registry.ts`, `devices/[id]/route.ts`, `policies/[id]/route.ts`, `exchange/route.ts`, `graph-query.ts`, `.withAuditDbRecovery`, `callback/route.ts`, `remote-terminal/route.ts`, `graph.ts`, `hashApiToken`, `widget-routing.ts`, `queue.ts`, `metrics.ts`, `remote-desktop/sessions/route.ts`, `PlaybookRun`, `lookup.ts`, `session/route.ts`, `channels/route.ts`, `playbooks/orchestrator.ts`, `ServiceContract`, `proposal/route.ts`, `runtimeLeaseFromRow`, `DeviceWidget`, `scheduler.ts`, `audit-events/route.ts`, `assurances/route.ts`, `bindings/[id]/route.ts`, `assistant/context.ts`, `operation/route.ts`, `system/route.ts`, `[pageId]/route.ts`, `digest/route.ts`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `isAuthorized()` connect `isAuthorized` to `proposal/route.ts`, `AutonomyStore`, `adoption/orchestrator.ts`, `loop.ts`, `autonomy/runtime.ts`, `recoverCorruptDatabase`, `missions/repository.ts`, `web-research.ts`, `audit-events/route.ts`, `contract-management.ts`, `assurances/route.ts`, `chat/route.ts`, `bindings/[id]/route.ts`, `adapters/[id]/route.ts`, `operation/route.ts`, `gateway.ts`, `system/route.ts`, `.getState`, `controls.ts`, `playbooks/registry.ts`, `browser-observer.ts`, `plan-ir/route.ts`, `oauth.ts`, `adapters/route.ts`, `gateway/repository.ts`, `[pageId]/route.ts`, `guard.ts`, `cancel/route.ts`, `subagents/repository.ts`, `digest/route.ts`, `incidents/page.tsx`, `automations.ts`, `protocol-sessions/manager.ts`, `openai-oauth-server.ts`, `getAuthContext`, `vault.ts`, `catalog.ts`, `devices/[id]/route.ts`, `policies/[id]/route.ts`, `exchange/route.ts`, `remote-terminal/route.ts`, `hashApiToken`, `local-tools/[id]/route.ts`, `queue.ts`, `metrics.ts`, `LLMProvider`, `remote-desktop/sessions/route.ts`, `session/route.ts`, `InvestigationRecord`, `channels/route.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `AutonomyStore` connect `AutonomyStore` to `gateway.ts`, `autonomy/runtime.ts`, `recoverCorruptDatabase`, `missions/repository.ts`, `guard.ts`, `gateway/repository.ts`, `bindings/[id]/route.ts`, `subagents/repository.ts`, `InvestigationRecord`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _860 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StateStore` be split into smaller, more focused modules?**
  _Cohesion score 0.03459383753501401 - nodes in this community are weakly interconnected._
- **Should `device-contracts-panel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07581545694975023 - nodes in this community are weakly interconnected._
- **Should `AutonomyStore` be split into smaller, more focused modules?**
  _Cohesion score 0.07111372318542462 - nodes in this community are weakly interconnected._