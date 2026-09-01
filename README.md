# Sociopolis
Gamified Sociology Learning App									Sep 2025
Built a full-stack sociology learning app with React, TypeScript, Sass, Tailwind, and Firebase.
Developed gamified lesson plan UIs using Tailwind and personally created animations with an emphasis on emotional design principles.


## Table of Contents

- [What is the Sociopolis project?](#what-is-the-sociopolis-project)
- [Tech Stack](#tech-stack)
  - [Frontend \& Project Infrastructure](#frontend--project-infrastructure)
- [Prerequisites](#prerequisites)
- [How to get started](#how-to-get-started)
- [How to contribute](#how-to-contribute)
- [How to review code](#how-to-review-code)


## What is the Sociopolis project?

**Sociopolis** is a gamified sociology learning application designed to build social literacy through playful, accessible pathways. Born at the University of Florida, it empowers learners from diverse backgrounds to understand sociological concepts through interactive lessons, micro-check-ins, XP reward systems, and real-time leaderboards. 

Key product experiences include:
- **Interactive Lessons**: Multi-slide learning modules covering communication skills, building relationships, emotional intelligence, and conflict resolution.
- **Embedded Check-Ins**: Multiple-choice assessment questions embedded directly within lesson sections to reinforce learning with instant feedback.
- **XP Progression \& Leaderboard**: Leveling mechanics, XP counters, attempt logs, and real-time rank updates.
- **Emotional Design**: Visual-first layouts utilizing custom SVG designs, dark/light theme options, and smooth animations to reduce cognitive friction and delight users.


## Tech Stack

### Frontend \& Project Infrastructure

The project organizes shared settings at the root and houses the client code under the `FrontEnd` subdirectory.

- **React 19 & TypeScript**: High-performance rendering, component-driven architecture, and static type safety.
- **Vite**: Ultra-fast bundler, development server, and Hot Module Replacement (HMR).
- **Tailwind CSS v4 \& Sass (embedded)**: Tailored layout styles, responsive design, custom styling mixins, and design tokens mapped to CSS variables for light/dark mode support.
- **Framer Motion**: Smooth card entries, active-state buttons, and gamification feedback/notifications.
- **Zustand**: Lightweight, reactive client-side state store.
- **React Router DOM v7**: Seamless single-page routing, featuring custom public route redirects and protected session guards (`ProtectedRoute`).
- **Firebase (Authentication & Cloud Firestore)**: Client-side session tokens, secure login flows, and a serverless backend database to persist progress logs, vocab terms, and XP milestones.
- **Vitest**: Zero-config testing framework for database payload validation and model assertion.
- **tsx**: Execution engine for executing script utilities directly (e.g., seeding data).


## Prerequisites

Before starting, ensure you have:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or another package manager
- A **Firebase Project** with Authentication and Firestore Database enabled.


## How to get started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Sociopolis.git
cd Sociopolis
```

### 2. Install dependencies
Run `npm install` in both the workspace root and the `FrontEnd` directory:
```bash
# Install root configuration dependencies
npm install

# Navigate to FrontEnd and install client packages
cd FrontEnd
npm install
```

### 3. Setup Firebase credentials
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Create or select a project, then enable **Authentication** (Email/Password) and **Cloud Firestore**.
3. Obtain your web app configuration credentials.
4. Replace the values in [firebaseConfig.ts](file:///c:/Users/emily/Documents/Coding/WebApps/Sociopolis/FrontEnd/src/services/firebaseConfig.ts):
   ```typescript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### 4. Seed database lessons
Sociopolis features a custom script to import lesson resources (e.g., Unit 1 text and check-ins) and vocabulary definitions into Firestore:
```bash
npm run upload-lesson
```

### 5. Run the application
Start the Vite local development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` to explore the application.


## How to contribute

1. **Branch Naming**: Work on a clean branch named after your feature (e.g., `feature/lesson-completion-animation`).
2. **Coding & Styling Standards**: Maintain clean component organization. Leverage the CSS tokens defined in `FrontEnd/src/styles/tokens/` instead of hardcoding colors or padding.
3. **Write Unit Tests**: Ensure new helper functions, schemas, or hooks have test files located in the `FrontEnd/src/tests/` directory.
4. **Validation**: Check for linting problems or build errors before committing:
   ```bash
   npm run lint
   ```
5. **Open a Pull Request**: Submit your changes back to the main branch with clear verification notes.


## How to review code

When reviewing pull requests, pay attention to the following:
- **Routing Safety**: Ensure dashboard features are wrapped inside a `<ProtectedRoute>` component in [Router.tsx](file:///c:/Users/emily/Documents/Coding/WebApps/Sociopolis/FrontEnd/src/Router.tsx).
- **Modular Directory Layout**: Verify pages and features are separated cleanly into domains inside [src/apps](file:///c:/Users/emily/Documents/Coding/WebApps/Sociopolis/FrontEnd/src/apps) (e.g., `auth`, `lesson`, `register`, `welcome`, `game`).
- **Database Schemas**: Confirm database mutation models are structured using Zod objects for validation.
- **Run the Test Suite**: Run the validation tests locally:
   ```bash
   npm run test
   ```
