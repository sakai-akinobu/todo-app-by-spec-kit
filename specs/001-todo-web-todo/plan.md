# Implementation Plan: Personal TODO Management Web Application

**Branch**: `001-todo-web-todo` | **Date**: 2025-09-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-todo-web-todo/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
個人用TODO管理Webアプリケーション。認証不要でTODOの追加・完了/未完了ステータス更新・削除・ステータス別フィルタ機能を提供。TypeScript + React + Next.js構成、2000年代スタイルのデザイン、Tailwind CSS使用。データは永続化不要（ブラウザローカル保存）。

## Technical Context
**Language/Version**: TypeScript with React 18+ and Next.js 14+  
**Primary Dependencies**: React, Next.js, Tailwind CSS, Vitest (testing)  
**Storage**: Browser localStorage (no persistent database required)  
**Testing**: Vitest with React Testing Library  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari)
**Project Type**: web (frontend only - no backend required)  
**Performance Goals**: Responsive UI interaction (<100ms), smooth filtering  
**Constraints**: 2000年代の古き良きWebスタイルのデザイン, no authentication  
**Scale/Scope**: Personal use (single user), estimated 100-1000 TODO items max

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (frontend web app only)
- Using framework directly? Yes (React/Next.js without wrappers)
- Single data model? Yes (Todo entity only)
- Avoiding patterns? Yes (direct state management, no unnecessary abstractions)

**Architecture**:
- EVERY feature as library? N/A (single frontend application)
- Libraries listed: Core React components + localStorage service
- CLI per library: N/A (web application)
- Library docs: N/A (simple web app)

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? Yes (tests with Vitest)
- Git commits show tests before implementation? Yes
- Order: Contract→Integration→E2E→Unit strictly followed? Adapted for frontend
- Real dependencies used? Yes (actual localStorage, DOM)
- Integration tests for: component interactions, localStorage operations
- FORBIDDEN: Implementation before test, skipping RED phase

**Observability**:
- Structured logging included? Console logging for errors
- Frontend logs → backend? N/A (no backend)
- Error context sufficient? Yes (user-friendly error messages)

**Versioning**:
- Version number assigned? 1.0.0
- BUILD increments on every change? Yes
- Breaking changes handled? N/A (single user app)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 1 (Single project) - Frontend-only web application, no backend needed

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
Based on our data model, component contracts, and quickstart scenarios, the /tasks command will generate:

1. **Setup & Configuration Tasks** (4-5 tasks):
   - Initialize Next.js project with TypeScript and Tailwind
   - Configure Vitest testing environment  
   - Set up 2000s styling theme configuration
   - Create basic project structure and types

2. **Core Data Layer Tasks** (3-4 tasks):
   - Implement Todo interface and types (from data-model.md)
   - Create localStorage service with error handling
   - Build filter utility functions
   - Write comprehensive storage tests

3. **Component Development Tasks** (8-10 tasks):
   - TodoForm component with validation (TDD approach)
   - TodoItem component with 2000s styling
   - TodoList component with filtering
   - FilterControls component with counts
   - Layout component with retro design theme

4. **Integration & Testing Tasks** (5-6 tasks):
   - Component integration tests
   - End-to-end user journey tests (based on quickstart.md)
   - LocalStorage persistence tests
   - Cross-browser compatibility verification

5. **Validation & Polish Tasks** (3-4 tasks):
   - Performance testing with large datasets
   - Accessibility compliance check
   - 2000s design refinement and consistency
   - Final quickstart validation

**Ordering Strategy**:
- TDD mandatory: Test files created before implementation
- Dependency order: Types → Services → Components → Integration
- Mark [P] for parallel execution where components are independent
- Critical path: Storage service → Data types → Core components

**Technical Approach**:
- Each component gets dedicated test file first (RED phase)
- Implementation follows to make tests pass (GREEN phase) 
- Refactoring and styling refinement (REFACTOR phase)
- Integration tests validate component interactions

**Estimated Output**: 23-29 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*