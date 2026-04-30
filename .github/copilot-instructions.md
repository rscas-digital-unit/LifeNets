# LifeNets – Copilot Repository Instructions

This repository contains the LifeNets project.

## Repository structure

- `/docs` contains project documentation.
- `/workspace-life-nets` contains the Angular application source code.

## Documentation rules

When asked to create or update documentation:

- Always write documentation files inside `/docs`.
- Do not create documentation inside `/workspace-life-nets`.
- Use Markdown.
- Keep the style clear, professional, and concise.
- Prefer short sections, tables where useful, and concrete implementation notes.
- If information is missing, add a `TODO:` note instead of inventing details.

## Documentation structure

Use this structure:

- `/docs/00-overview/project-overview.md`
- `/docs/00-overview/goals-and-scope.md`
- `/docs/00-overview/stakeholders.md`

- `/docs/01-requirements/functional-requirements.md`
- `/docs/01-requirements/non-functional-requirements.md`

- `/docs/02-architecture/system-architecture.md`
- `/docs/02-architecture/data-flow.md`
- `/docs/02-architecture/integrations.md`

- `/docs/03-backend/api-spec.md`
- `/docs/03-backend/services.md`
- `/docs/03-backend/database.md`

- `/docs/04-frontend/ui-structure.md`
- `/docs/04-frontend/components.md`
- `/docs/04-frontend/state-management.md`

- `/docs/05-guidelines/coding-standards.md`
- `/docs/05-guidelines/naming-conventions.md`

- `/docs/06-feedback/team-feedback.md`
- `/docs/06-feedback/objectives.md`

## Angular code rules

When reviewing or documenting the Angular application:

- Read code from `/workspace-life-nets`.
- Document components, services, models, routing, API integrations, and state/data flow.
- Do not change business logic unless explicitly requested.
- When adding comments to code, add only useful comments explaining non-obvious logic.