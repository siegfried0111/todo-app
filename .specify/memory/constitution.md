<!--
SYNC IMPACT REPORT
==================
Version Change: [NEW] → 1.0.0
Rationale: Initial constitution establishing core engineering principles

Modified Principles: N/A (new constitution)
Added Sections:
  - Core Principles (5 principles)
  - Quality Standards
  - Development Workflow
  - Governance

Removed Sections: N/A

Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligned
  ✅ spec-template.md - Acceptance criteria aligned with TDD
  ✅ tasks-template.md - Test-first workflow aligned
  ✅ All templates reviewed for consistency

Follow-up TODOs: None
-->

# Todo App Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)

**TDD is mandatory for all production code:**

- Tests MUST be written before implementation (Red-Green-Refactor cycle)
- Implementation begins ONLY after tests are written and approved
- Tests MUST fail first, then implementation makes them pass
- No code ships without corresponding tests
- Test coverage MUST be maintained above 80% for core business logic

**Rationale**: TDD ensures correctness from the start, serves as living documentation, enables confident refactoring, and prevents regression bugs. Quality cannot be retrofitted - it must be built in from the beginning.

### II. Simplicity & YAGNI (You Aren't Gonna Need It)

**Avoid over-engineering and premature abstraction:**

- Start with the simplest solution that solves the immediate problem
- Add abstraction ONLY when duplication or complexity demands it (Rule of Three)
- Reject speculative features - implement only what is currently needed
- Every layer of indirection MUST be justified by tangible benefits
- Complexity without clear necessity is a violation requiring explicit justification

**Rationale**: Simple code is easier to understand, modify, debug, and maintain. Over-design adds cognitive load, increases bugs, and wastes time solving problems that may never occur.

### III. Readability First

**Code is read far more often than written:**

- Self-documenting code: meaningful names for variables, functions, classes
- Functions MUST do one thing well (Single Responsibility)
- Maximum function length: 50 lines (hard limit: 100 lines with justification)
- Maximum cyclomatic complexity: 10 per function
- Comments explain "why", not "what" (code explains "what")
- Code formatting MUST be consistent (use automated formatters)

**Rationale**: Readable code reduces onboarding time, minimizes bugs from misunderstanding, enables faster debugging, and makes collaboration effective. Code is a communication medium for humans first, machines second.

### IV. Maintainability

**Build for the long term:**

- Loose coupling between modules - changes in one module MUST NOT cascade
- High cohesion within modules - related functionality stays together
- Clear module boundaries with well-defined interfaces
- Configuration separated from code (no magic numbers or hardcoded values)
- Dependencies MUST be explicit, minimal, and well-documented
- Breaking changes MUST include migration path and deprecation warnings

**Rationale**: Maintainable code survives team changes, technology evolution, and business pivots. Technical debt compounds exponentially - prevention is cheaper than cure.

### V. Code Quality Standards

**Non-negotiable quality gates:**

- Zero warnings from linters/static analyzers
- All tests passing before merge (no skipped or disabled tests without documented reason)
- Code reviews required for all changes (no direct commits to main)
- Build MUST succeed on CI/CD pipeline
- No commented-out code in production branches
- No "TODO" comments without associated tracked issues

**Rationale**: Quality standards prevent degradation over time. Small lapses accumulate into unmaintainable codebases. Automated enforcement removes subjectivity and ensures consistency.

## Quality Standards

### Testing Requirements

**Mandatory test types:**

1. **Unit Tests**: Test individual functions/methods in isolation
   - Fast execution (< 1ms per test ideal)
   - No external dependencies (mock/stub I/O, network, DB)
   - Cover edge cases, error paths, and boundary conditions

2. **Integration Tests**: Test module interactions
   - Verify contracts between components
   - Test with real dependencies where feasible
   - Focus on critical paths and data flow

3. **Acceptance Tests**: Verify user scenarios from spec.md
   - Map directly to "Given-When-Then" scenarios in specifications
   - Test full user journeys end-to-end
   - Should be runnable by non-technical stakeholders

**Test quality requirements:**

- Tests MUST be deterministic (no flaky tests)
- Tests MUST be independent (no order dependencies)
- Test names MUST clearly describe what is being tested and expected outcome
- Setup/teardown MUST be clean (no state leakage between tests)

### Code Review Standards

**Every pull request MUST:**

- Include test coverage for all new/modified code
- Pass all automated quality gates (linting, tests, build)
- Have clear description linking to requirements/issues
- Be reviewed by at least one team member
- Address all reviewer feedback or provide reasoned counterarguments

**Reviewers MUST verify:**

- Code follows constitution principles (especially simplicity and readability)
- Tests are meaningful and adequately cover the change
- No unnecessary complexity introduced
- Documentation updated if public interfaces changed

## Development Workflow

### Feature Development Process

1. **Specification** (spec.md)
   - Define user stories with clear acceptance criteria
   - Prioritize stories (P1 = MVP, P2+= enhancements)
   - Each story MUST be independently testable

2. **Planning** (plan.md)
   - Research technical approach
   - Design data models and contracts
   - Identify dependencies and risks
   - Verify constitution compliance

3. **Test Creation** (TDD Red Phase)
   - Write tests for acceptance criteria FIRST
   - Run tests - they MUST fail (red)
   - Get test approach approved before implementation

4. **Implementation** (TDD Green Phase)
   - Write minimal code to make tests pass
   - Focus on one user story at a time
   - Commit after each passing test or logical unit

5. **Refactoring** (TDD Refactor Phase)
   - Improve code structure while keeping tests green
   - Apply readability and simplicity principles
   - Remove duplication, clarify names, simplify logic

6. **Review & Merge**
   - Create pull request with context
   - Address review feedback
   - Merge only when all gates pass

### Definition of Done

A feature is complete when:

- [ ] All acceptance criteria tests pass
- [ ] Code reviewed and approved
- [ ] Test coverage ≥ 80% for new code
- [ ] Documentation updated (if public API changed)
- [ ] No linting errors or warnings
- [ ] CI/CD pipeline green
- [ ] Feature demonstrated to stakeholders (if P1)

## Governance

### Amendment Process

**Constitution changes require:**

1. Documented proposal with rationale
2. Team review and consensus
3. Impact analysis on existing code/processes
4. Version bump (MAJOR for breaking changes, MINOR for additions, PATCH for clarifications)
5. Update to all dependent templates and documentation
6. Migration plan for existing code if principles change

### Compliance

**All development MUST comply with this constitution:**

- Violations require explicit justification in plan.md Complexity Tracking table
- Repeated violations without justification may block PR merges
- Constitution supersedes individual preferences
- When in doubt, discuss with team before proceeding

**Enforcement:**

- Automated where possible (linting, test coverage, CI/CD gates)
- Manual verification in code reviews
- Regular constitution review sessions (quarterly) to assess effectiveness
- Continuous improvement - update constitution based on learnings

### Versioning

Constitution follows semantic versioning:

- **MAJOR** (X.0.0): Principle removal/redefinition that invalidates existing practices
- **MINOR** (x.Y.0): New principle added or expanded guidance
- **PATCH** (x.y.Z): Clarifications, wording improvements, typo fixes

**Version**: 1.0.0 | **Ratified**: 2025-10-30 | **Last Amended**: 2025-10-30
