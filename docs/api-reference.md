# MindDrop API Reference

This document describes the local Express API used by the MindDrop React
client.

## Base URL

Default local base URL:

``` text
http://localhost:5000/api
```

The frontend can override this through `VITE_API_URL`.

## Conventions

-   Request and response bodies use JSON.
-   The API uses UUIDs for note and AI-version identifiers.
-   Successful responses use the envelope:

``` json
{
  "success": true,
  "data": {}
}
```

-   Error responses are handled by the centralized Express error
    middleware. The exact validation details may vary by error type.
-   Unless otherwise stated, timestamps are ISO 8601 strings.

## Health

### `GET /health`

Checks whether the Express application is responding.

Full URL:

``` text
GET http://localhost:5000/api/health
```

### `GET /ai/health`

Checks the AI module/provider health endpoint.

Full URL:

``` text
GET http://localhost:5000/api/ai/health
```

Use this endpoint when diagnosing local AI connectivity. The Ollama
service must be running and configured correctly.

## Notes

### Note object

A note returned by the API has this shape:

``` json
{
  "id": "UUID",
  "rawContent": "The original note text",
  "createdAt": "2026-11-11T10:00:00.000Z",
  "updatedAt": "2026-11-11T10:00:00.000Z"
}
```

### `GET /notes`

Returns the saved notes.

``` http
GET /api/notes
```

Example response:

``` json
{
  "success": true,
  "data": [
    {
      "id": "61b5115a-cc27-434b-8a6d-3c31ff4078d5",
      "rawContent": "Today I learned about JavaScript closures.",
      "createdAt": "2026-11-11T10:00:00.000Z",
      "updatedAt": "2026-11-11T10:00:00.000Z"
    }
  ]
}
```

### `POST /notes`

Creates a note.

``` http
POST /api/notes
Content-Type: application/json
```

Request:

``` json
{
  "rawContent": "A rough thought or a set of lecture notes..."
}
```

Validation: - `rawContent` must be a non-empty string after trimming. -
Maximum length: 100,000 characters.

Success: HTTP `201`, with the created note in `data`.

### `GET /notes/:id`

Returns one note.

``` http
GET /api/notes/61b5115a-cc27-434b-8a6d-3c31ff4078d5
```

Success: HTTP `200`.

If the note does not exist, the service returns HTTP `404`.

### `PUT /notes/:id`

Updates the original raw content of a note.

``` http
PUT /api/notes/61b5115a-cc27-434b-8a6d-3c31ff4078d5
Content-Type: application/json
```

Request:

``` json
{
  "rawContent": "The revised original note text..."
}
```

Validation is the same as note creation.

Updating the raw note does not rewrite previously generated AI versions.
Each version retains the `sourceContent` that was used to generate it.

### `DELETE /notes/:id`

Deletes a note.

``` http
DELETE /api/notes/61b5115a-cc27-434b-8a6d-3c31ff4078d5
```

The database foreign-key cascade removes AI versions associated with the
deleted note.

## AI optimization

### Optimized note object

The model output is validated against this structure:

``` json
{
  "title": "Understanding JavaScript Closures",
  "summary": "An inner function can access variables from its outer function.",
  "keyPoints": [
    "An inner function can remember and access variables from its outer function."
  ],
  "topics": [
    "JavaScript closures"
  ],
  "actionItems": [],
  "noteType": "learning"
}
```

Allowed `noteType` values:

-   `idea`
-   `learning`
-   `task`
-   `reflection`
-   `reference`
-   `general`

The response must contain the expected fields and valid types.
Unexpected or invalid model output is rejected.

### `POST /ai/optimize`

Generates a structured result without creating a persisted version.

``` http
POST /api/ai/optimize
Content-Type: application/json
```

Request:

``` json
{
  "rawContent": "Today I learned about closures. Inner functions can access outer variables."
}
```

Validation: - `rawContent` must be a non-empty string after trimming. -
Maximum length: 100,000 characters.

Success response uses the standard envelope with the validated
optimized-note object in `data`.

### `POST /ai/notes/:noteId/versions`

Generates and persists a new AI version for an existing note.

``` http
POST /api/ai/notes/61b5115a-cc27-434b-8a6d-3c31ff4078d5/versions
Content-Type: application/json
```

Request:

``` json
{
  "rawContent": "Today I learned about JavaScript closures. An inner function remembers variables from its outer function."
}
```

Validation: - `noteId` must be a UUID. - `rawContent` must be a
non-empty string after trimming. - Maximum content length: 100,000
characters. - The referenced note must exist.

Success: HTTP `201`.

Example response:

``` json
{
  "success": true,
  "data": {
    "id": "5b3ede7f-5b88-47da-a2db-74aa6964ac03",
    "noteId": "61b5115a-cc27-434b-8a6d-3c31ff4078d5",
    "versionNumber": 1,
    "sourceContent": "Today I learned about JavaScript closures. An inner function remembers variables from its outer function.",
    "title": "Understanding JavaScript Closures",
    "summary": "The note discusses JavaScript closures and how an inner function can access variables from its outer function.",
    "keyPoints": [
      "An inner function can remember and access variables from its outer function."
    ],
    "topics": [
      "JavaScript closures"
    ],
    "actionItems": [],
    "noteType": "learning",
    "modelName": "qwen2.5:3b",
    "promptVersion": "1.0",
    "createdAt": "2026-11-11T12:59:34.282Z"
  }
}
```

Version numbers increase independently for each note. The source text
sent in this request is stored in `sourceContent`.

**Important:** this endpoint does not update the parent note's
`rawContent`. The request can contain the current editor text, including
edits not yet saved to the note.

### `GET /ai/notes/:noteId/versions`

Returns the AI versions for one note, newest first.

``` http
GET /api/ai/notes/61b5115a-cc27-434b-8a6d-3c31ff4078d5/versions
```

Success response:

``` json
{
  "success": true,
  "data": [
    {
      "id": "5b3ede7f-5b88-47da-a2db-74aa6964ac03",
      "noteId": "61b5115a-cc27-434b-8a6d-3c31ff4078d5",
      "versionNumber": 1,
      "sourceContent": "Original text used for this version",
      "title": "Generated title",
      "summary": "Generated summary",
      "keyPoints": [],
      "topics": [],
      "actionItems": [],
      "noteType": "general",
      "modelName": "qwen2.5:3b",
      "promptVersion": "1.0",
      "createdAt": "2026-11-11T12:59:34.282Z"
    }
  ]
}
```

If the note exists but has no AI versions, `data` is an empty array. If
the note does not exist, the service returns HTTP `404`.

## Error handling

Common status codes:

  -----------------------------------------------------------------------
  Status                              Meaning
  ----------------------------------- -----------------------------------
  `400`                               Request body or route parameters
                                      failed validation

  `404`                               Requested note does not exist

  `500`                               Unexpected server-side error

  `502`                               AI returned invalid JSON or an
                                      unexpected response structure,
                                      where surfaced by the AI validation
                                      layer
  -----------------------------------------------------------------------

An error response includes `success: false` and a message. Validation
middleware may also include structured validation details.

## Local configuration

Backend `server/.env`:

``` env
PORT=5000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

Frontend `client/.env` (optional):

``` env
VITE_API_URL=http://localhost:5000/api
```

## Notes for API consumers

-   Save a note before requesting a persisted AI version; the version
    endpoint requires an existing note ID.
-   The version endpoint optimizes the content supplied in the request,
    not necessarily the latest persisted `rawContent`.
-   AI-generated content is stored as a separate version. It does not
    replace the raw note.
-   The API is intended for local use in the current application setup.
