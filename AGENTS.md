# Verify-ADS Repository Instructions

## Mission
Reconstruct the target application from observable evidence. The target system is the behavioral source of truth.

## Non-negotiable rules
1. Do not invent target behavior. Mark unknowns explicitly.
2. Separate observed facts from implementation choices.
3. Every implemented flow must have a corresponding spec or test.
4. Preserve observable contracts: routes, copy, validation, state transitions, API behavior and responsive behavior.
5. Prefer a single coherent application and deterministic tests over unnecessary abstraction.
6. Never commit credentials, cookies, auth state, API secrets or captured personal data.
7. Visual parity is not considered verified without screenshot comparison at matching viewports.
8. A feature is not complete until its observable success and failure paths are verified.

## Workflow
Observe -> Inventory -> Specify -> Implement -> Verify -> Diff -> Iterate.

## Evidence labels
- OBSERVED: directly verified on the target.
- INFERRED: strongly suggested but not directly verified.
- UNKNOWN: not yet observable.
- IMPLEMENTATION: a choice in this repository, not a claim about target internals.
