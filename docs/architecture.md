# MindDrop Architecture

## Overview

MindDrop is a local-first AI note-taking application.

## Backend architecture

The backend follows a layered architecture.

- Routes: HTTP endpoint definitions.
- Middleware: Request validation and error handling.
- Controllers: HTTP request and response handling.
- Services: Business logic.
- Repositories: Database queries.
- Database: SQLite persistence.

## AI architecture

Ollama is accessed exclusively through the backend.

The frontend never communicates directly with Ollama.

## Design principles

1. Preserve original user notes.
2. Keep AI-generated content separate.
3. Keep database access out of controllers.
4. Validate external input.
5. Keep AI providers replaceable.
6. Prefer local processing and storage.