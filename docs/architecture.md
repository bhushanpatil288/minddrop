# MindDrop Architecture

This document describes the current application structure, module
boundaries, persistence model, and the main request flows.

## 1. Architectural goals

MindDrop is designed around a few constraints:

-   Capture raw thoughts quickly, without requiring structure at input
    time.
-   Keep original note content separate from AI-generated content.
-   Store notes and generated versions locally.
-   Keep frontend UI, frontend state, API communication, backend
    business logic, persistence, and AI-provider communication in
    distinct responsibilities.
-   Make it possible to replace or extend the AI provider without
    rewriting the notes feature.

The current application is a local web application served through a
browser. It is not yet packaged as an Electron or Tauri desktop
application.

## 2. System overview

``` text
┌─────────────────────────────────────────────┐
│                 React client                │
│                                             │
│  Notes feature             AI feature       │
│  ├─ pages                  ├─ components    │
│  ├─ components             ├─ hooks          │
│  ├─ hooks                  └─ services       │
│  └─ services                                │
│          │                  │               │
│          └────── HTTP API ──┘               │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                Express server               │
│                                             │
│  Notes module              AI module        │
│  ├─ routes                 ├─ routes         │
│  ├─ controller             ├─ controller     │
│  ├─ service                ├─ service        │
│  ├─ validation             ├─ validation     │
│  └─ repository             ├─ provider       │
│                            ├─ prompts        │
│                            └─ repository     │
│                                  │          │
└──────────────────┬───────────────┼──────────┘
                   │               │
                   ▼               ▼
             ┌──────────┐     ┌──────────┐
             │  SQLite  │     │  Ollama  │
             │          │     │ Qwen 2.5 │
             └──────────┘     └──────────┘
```

## 3. Repository structure

The following reflects the current implemented structure and the
intended feature boundaries. Some directories may gain files as the
application develops.

``` text
minddrop/
├── client/
│   └── src/
│       ├── features/
│       │   ├── notes/
│       │   │   ├── components/
│       │   │   │   ├── NoteEditor.jsx
│       │   │   │   ├── NoteList.jsx
│       │   │   │   └── NoteListItem.jsx
│       │   │   ├── hooks/
│       │   │   │   ├── useNotes.js
│       │   │   │   └── useDraftPersistence.js
│       │   │   ├── pages/
│       │   │   │   └── NotesPage.jsx
│       │   │   └── services/
│       │   │       └── notesApi.js
│       │   └── ai/
│       │       ├── components/
│       │       │   └── AIResultPanel.jsx
│       │       ├── hooks/
│       │       │   └── useNoteAI.js
│       │       └── services/
│       │           └── aiApi.js
│       └── shared/
│           ├── components/
│           │   └── StatusIndicator.jsx
│           └── services/
│               └── apiClient.js
│
├── server/
│   ├── data/
│   │   └── minddrop.db          # generated locally; not committed
│   └── src/
│       ├── config/
│       │   └── env.js
│       ├── database/
│       │   ├── migrations/
│       │   │   ├── 001_create_notes.sql
│       │   │   └── 002_create_note_versions.sql
│       │   └── connection.js
│       ├── modules/
│       │   ├── notes/
│       │   │   ├── notes.routes.js
│       │   │   ├── notes.controller.js
│       │   │   ├── notes.service.js
│       │   │   ├── notes.repository.js
│       │   │   └── notes.validation.js
│       │   └── ai/
│       │       ├── repositories/
│       │       │   └── noteVersions.repository.js
│       │       ├── ai.routes.js
│       │       ├── ai.controller.js
│       │       ├── ai.service.js
│       │       ├── ai.provider.js
│       │       ├── ai.prompts.js
│       │       └── ai.validation.js
│       ├── middlewares/
│       │   ├── validateRequest.js
│       │   └── errorHandler.js
│       ├── app.js
│       └── server.js
│
├── docs/
│   ├── api-reference.md
│   └── architecture.md
└── README.md
```

## 4. Frontend responsibilities

### `features/notes`

Owns note-related screens, interactions, and client-side note state.

-   `NotesPage.jsx`: page-level composition and coordination. It
    connects note selection, draft state, saving, deletion, and AI
    feature state.
-   `NoteEditor.jsx`: renders the raw note editor and emits user actions
    through props. It does not call the API directly.
-   `NoteList.jsx` / `NoteListItem.jsx`: render the saved note list and
    selection/deletion controls.
-   `useNotes.js`: manages note loading and CRUD operations.
-   `useDraftPersistence.js`: restores and persists the current working
    draft in browser local storage. This is separate from the durable
    SQLite note store.
-   `notesApi.js`: maps note operations to HTTP requests.

### `features/ai`

Owns AI-related client state and presentation.

-   `AIResultPanel.jsx`: displays a generated version and allows
    switching between versions. It does not generate content itself.
-   `useNoteAI.js`: manages generation state, version history, selected
    version, and AI errors.
-   `aiApi.js`: communicates with the backend AI endpoints.

### `shared`

Contains cross-feature infrastructure, such as the shared `apiClient.js`
and reusable status UI.

### Page coordination

`NotesPage` is the composition boundary between the notes and AI
features. It coordinates user actions but should not absorb API
implementation, prompt construction, database logic, or AI provider
details.

## 5. Backend responsibilities

The backend uses a feature-oriented module structure. Within each
module, responsibilities are separated by layer.

### Routes

Declare HTTP paths and attach request validation and controller
handlers. Routes should remain thin.

### Controllers

Translate HTTP requests into service calls and service results into HTTP
responses. They should not contain SQL queries or prompt-building logic.

### Services

Contain application use cases and business rules.

Examples: - The notes service coordinates note creation, retrieval,
updating, and deletion. - The AI service coordinates optimization, note
existence checks, and creation/retrieval of AI versions.

### Repositories

Own database access and SQL statements. They map database rows into
application-facing objects.

### Validation

Zod schemas validate request bodies and route parameters. AI output is
also parsed and validated before it is persisted.

### AI provider and prompts

-   `ai.provider.js` communicates with Ollama.
-   `ai.prompts.js` builds the instruction sent to the model.
-   `ai.validation.js` validates the JSON returned by the model.

This boundary means the AI service does not need to know the low-level
details of the Ollama HTTP request.

## 6. Database model

SQLite is the durable local store. Database initialization enables
foreign keys and configures the connection for local use. SQL migrations
are tracked so each migration is applied once.

### `notes`

Stores the original user-authored note.

  Column          Purpose
  --------------- -----------------------
  `id`            UUID primary key
  `raw_content`   Original note text
  `created_at`    Creation timestamp
  `updated_at`    Last update timestamp

An index supports ordering notes by creation time.

### `note_versions`

Stores each AI-generated version independently.

  Column             Purpose
  ------------------ ------------------------------------------
  `id`               UUID primary key
  `note_id`          Parent note ID
  `version_number`   Incrementing version number per note
  `source_content`   Exact content sent for this optimization
  `title`            Generated title
  `summary`          Generated summary
  `key_points`       JSON-encoded array
  `topics`           JSON-encoded array
  `action_items`     JSON-encoded array
  `note_type`        Classified note type
  `model_name`       Model identifier used
  `prompt_version`   Prompt version used
  `created_at`       Version creation timestamp

Constraints: - `note_id` references `notes.id`. - Deleting a note
cascades to its AI versions. - `(note_id, version_number)` is unique. -
An index supports retrieving a note's versions in descending version
order.

### Why keep `source_content`?

The user may edit a note after saving it. An AI version should preserve
the exact text used to generate it, even if the original note is edited
later. This makes each generated result traceable to its input.

## 7. Main data flows

### 7.1 Save a raw note

1.  The user types in `NoteEditor`.
2.  `NotesPage` updates the draft state.
3.  `useDraftPersistence` keeps the active working draft in local
    storage while it is dirty.
4.  On Save, `NotesPage` calls the relevant method from `useNotes`.
5.  `notesApi` sends the HTTP request through the shared API client.
6.  The notes route validates the request and invokes the controller.
7.  The service applies the use case and the repository writes to
    SQLite.
8.  The client updates the active note ID and marks the draft clean.

### 7.2 Optimize a saved note

1.  The user opens a saved note and selects Optimize.
2.  `NotesPage` passes the selected note ID and the current editor
    content to `useNoteAI`.
3.  `aiApi` sends the request to the AI version endpoint.
4.  The AI route validates the note ID and raw content.
5.  The AI service verifies that the parent note exists.
6.  The prompt builder constructs the optimization prompt.
7.  The provider sends the prompt to Ollama.
8.  The response is parsed as JSON and validated with Zod.
9.  The version repository creates the next version number and stores
    the generated fields and source content in SQLite.
10. The client displays the new version and adds it to the version
    history.

**Important:** the optimization request uses the current editor content
as its source. It does not update `notes.raw_content`. If the user has
edited the note but not saved those edits, the AI version can therefore
contain that newer editor content while the saved raw note still
contains its previous content.

### 7.3 Load version history

1.  The selected note ID is passed to `useNoteAI.loadVersions`.
2.  `aiApi` requests the note's versions.
3.  The backend retrieves versions ordered by descending version number.
4.  The hook selects the newest version by default.
5.  The result panel lets the user switch between versions.

### 7.4 Restore the working draft

`useDraftPersistence` restores the active draft from local storage. Once
hydration is complete, the page can request the AI history for the
restored active note. Draft persistence and AI version history are
separate concerns.

## 8. API and error handling

The frontend uses a shared API client so request headers, base URL
configuration, and response handling are consistent.

The backend validates input at the route boundary and forwards
unexpected errors to a centralized error handler. Request validation
failures should return HTTP 400; missing notes return HTTP 404; invalid
model output or upstream AI failures should be surfaced as server
errors.

See [`api-reference.md`](api-reference.md) for the current HTTP
contract.

## 9. Configuration

Backend configuration is loaded and validated from `server/.env`:

``` env
PORT=5000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

The frontend may use:

``` env
VITE_API_URL=http://localhost:5000/api
```

The frontend defaults to the local API URL if `VITE_API_URL` is not set.

## 10. Current boundaries and known limitations

-   The application is currently a browser-based local web app, not a
    packaged native desktop application.
-   AI optimization currently requires an existing saved note ID.
-   The AI model must return valid JSON matching the expected schema;
    invalid output is rejected rather than silently stored.
-   Browser local storage is used for the active draft; SQLite is the
    durable store for saved notes and AI versions.
-   The current UI's AI panel is designed for wider screens; responsive
    presentation can be expanded.
-   Import/export, automated test coverage, and a formal backup/restore
    workflow are future improvements, not claims about the current
    implementation.

## 11. Extension guidelines

When adding a feature:

1.  Put feature-specific UI, hooks, and API modules inside that feature.
2.  Keep shared infrastructure in `shared` only when more than one
    feature needs it.
3.  Keep SQL in repositories, not controllers or React components.
4.  Keep business rules in services, not route definitions.
5.  Keep provider-specific HTTP details inside provider adapters.
6.  Add a migration for schema changes; do not silently mutate an
    existing database schema.
7.  Preserve the raw note and version AI output rather than overwriting
    source data.
8.  Update the API reference and this architecture document when
    contracts or responsibilities change.
