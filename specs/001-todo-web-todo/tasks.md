# Tasks: Personal TODO Management Web Application

**Input**: Design documents from `/specs/001-todo-web-todo/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: TypeScript + React + Next.js + Tailwind + Vitest
   → Structure: Single frontend project with localStorage
2. Load optional design documents:
   → data-model.md: Todo entity, FilterStatus type, localStorage schema
   → contracts/: TodoList, TodoItem, TodoForm, FilterControls components
   → research.md: 2000s styling, pnpm package manager decisions
3. Generate tasks by category:
   → Setup: Next.js init, dependencies, 2000s styling config
   → Tests: component tests, integration tests, localStorage tests
   → Core: types, services, components
   → Integration: localStorage persistence, component interactions
   → Polish: validation, performance, accessibility
4. Apply TDD rules:
   → All tests written before implementation
   → Component tests marked [P] (parallel)
   → Different files = [P], same file = sequential
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph and parallel execution examples
7. SUCCESS: 27 tasks ready for execution
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single frontend project**: `src/`, `tests/` at repository root
- Using Next.js App Router structure with component-based organization

## Phase 3.1: Setup & Configuration
- [ ] T001 Initialize Next.js project with TypeScript, Tailwind CSS, and App Router
- [ ] T002 Install testing dependencies (Vitest, React Testing Library, happy-dom)
- [ ] T003 [P] Configure Vitest test environment in vitest.config.ts
- [ ] T004 [P] Install UUID library for unique ID generation
- [ ] T005 [P] Configure 2000s styling theme in tailwind.config.js
- [ ] T006 Create project structure: src/types/, src/services/, src/components/

## Phase 3.2: Types & Data Layer (TDD) ⚠️ MUST COMPLETE TESTS BEFORE IMPLEMENTATION
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T007 [P] Test file for Todo types in tests/types/todo.test.ts
- [ ] T008 [P] Test file for localStorage service in tests/services/todoStorage.test.ts
- [ ] T009 [P] Test file for filter utilities in tests/services/todoFilter.test.ts
- [ ] T010 Create Todo interface and FilterStatus type in src/types/todo.ts
- [ ] T011 Implement localStorage service in src/services/todoStorage.ts
- [ ] T012 Implement filter utility functions in src/services/todoFilter.ts

## Phase 3.3: Component Tests (TDD) ⚠️ MUST FAIL BEFORE IMPLEMENTATION
- [ ] T013 [P] Test file for TodoForm component in tests/components/TodoForm.test.tsx
- [ ] T014 [P] Test file for TodoItem component in tests/components/TodoItem.test.tsx
- [ ] T015 [P] Test file for TodoList component in tests/components/TodoList.test.tsx
- [ ] T016 [P] Test file for FilterControls component in tests/components/FilterControls.test.tsx
- [ ] T017 [P] Test file for Layout component in tests/components/Layout.test.tsx

## Phase 3.4: Component Implementation (ONLY after tests are failing)
- [ ] T018 [P] TodoForm component with validation in src/components/TodoForm.tsx
- [ ] T019 [P] TodoItem component with 2000s styling in src/components/TodoItem.tsx
- [ ] T020 [P] TodoList component with filtering in src/components/TodoList.tsx
- [ ] T021 [P] FilterControls component with counts in src/components/FilterControls.tsx
- [ ] T022 [P] Layout component with 2000s design in src/components/Layout.tsx

## Phase 3.5: Integration & Main App
- [ ] T023 Main App component integrating all features in src/app/page.tsx
- [ ] T024 [P] Integration test for localStorage persistence in tests/integration/persistence.test.ts
- [ ] T025 [P] Integration test for component interactions in tests/integration/components.test.ts
- [ ] T026 [P] End-to-end user journey test in tests/integration/userJourney.test.ts

## Phase 3.6: Polish & Validation
- [ ] T027 [P] Validate quickstart scenarios match implementation

## Dependencies
- Setup (T001-T006) before all other phases
- Type tests (T007-T009) before type implementation (T010-T012) 
- Component tests (T013-T017) before component implementation (T018-T022)
- Component implementation before integration (T023-T026)
- All core features before polish (T027)

## Parallel Execution Examples
```bash
# Phase 3.2 - Type Tests (parallel):
Task: "Test file for Todo types in tests/types/todo.test.ts"
Task: "Test file for localStorage service in tests/services/todoStorage.test.ts" 
Task: "Test file for filter utilities in tests/services/todoFilter.test.ts"

# Phase 3.3 - Component Tests (parallel):
Task: "Test file for TodoForm component in tests/components/TodoForm.test.tsx"
Task: "Test file for TodoItem component in tests/components/TodoItem.test.tsx"
Task: "Test file for TodoList component in tests/components/TodoList.test.tsx"
Task: "Test file for FilterControls component in tests/components/FilterControls.test.tsx"
Task: "Test file for Layout component in tests/components/Layout.test.tsx"

# Phase 3.4 - Component Implementation (parallel):
Task: "TodoForm component with validation in src/components/TodoForm.tsx"
Task: "TodoItem component with 2000s styling in src/components/TodoItem.tsx"
Task: "TodoList component with filtering in src/components/TodoList.tsx"
Task: "FilterControls component with counts in src/components/FilterControls.tsx"
Task: "Layout component with 2000s design in src/components/Layout.tsx"
```

## Detailed Task Specifications

### Setup Tasks (T001-T006)
- **T001**: Use `pnpm create next-app@latest` with TypeScript and Tailwind flags
- **T002**: Add vitest, @testing-library/react, @testing-library/jest-dom, happy-dom
- **T003**: Configure test environment, jsdom, TypeScript support
- **T004**: Add uuid package and @types/uuid for unique ID generation
- **T005**: Custom color scheme (blue/silver gradients), retro fonts, button styles
- **T006**: Create organized folder structure following Next.js 14 App Router conventions

### Type & Service Tests (T007-T009)
- **T007**: Test Todo interface validation, FilterStatus enum, type guards
- **T008**: Test localStorage operations, error handling, data serialization
- **T009**: Test filtering logic for all/active/completed states, count calculations

### Component Tests (T013-T017)  
- **T013**: Test form validation, submission, input clearing, Enter key handling
- **T014**: Test todo display, completion toggle, delete action, long content handling
- **T015**: Test filtering display, empty states, callback propagation
- **T016**: Test filter buttons, active state, count display, selection handling
- **T017**: Test 2000s styling application, responsive behavior, accessibility

### Integration Tests (T024-T026)
- **T024**: Test localStorage persistence across app restarts, error graceful handling
- **T025**: Test component interaction flows, state management, callback chains
- **T026**: Test complete user scenarios from quickstart.md validation

## Notes
- [P] tasks = different files, can run in parallel
- Verify all tests fail before implementing (RED phase)
- Follow TDD: Red → Green → Refactor cycle strictly
- Commit after completing each phase
- 2000s styling: gradients, beveled buttons, table layouts, Arial fonts

## Task Generation Rules Applied

1. **From Contracts (components.md)**:
   - TodoForm → T013 test + T018 implementation [P]
   - TodoItem → T014 test + T019 implementation [P] 
   - TodoList → T015 test + T020 implementation [P]
   - FilterControls → T016 test + T021 implementation [P]
   - Layout → T017 test + T022 implementation [P]

2. **From Data Model (data-model.md)**:
   - Todo interface → T007 test + T010 implementation [P]
   - localStorage service → T008 test + T011 implementation [P]
   - Filter utilities → T009 test + T012 implementation [P]

3. **From Quickstart (quickstart.md)**:
   - Setup instructions → T001-T006 configuration tasks
   - User scenarios → T026 end-to-end validation
   - Installation steps → T002 dependency management

4. **From Research (research.md)**:
   - Next.js + TypeScript → T001 project initialization
   - 2000s styling → T005 Tailwind configuration
   - Vitest framework → T003 test environment setup

## Validation Checklist ✅
- [x] All component contracts have corresponding tests (T013-T017)
- [x] All entities have model tasks (T007, T010)  
- [x] All tests come before implementation (T007-T017 before T018-T022)
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task
- [x] TDD cycle enforced: test → implementation → refactor