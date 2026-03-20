# Business Requirements Document (BRD) - OmniLog Test Genesis App

## 1. Executive Summary
OmniLog is a lightweight application designed to reduce cognitive load and "Tool Fatigue". Its sole purpose is a highly accessible, single text-field interface for rapidly logging ideas, tasks, or bugs without requiring immediate organization.

## 2. Product Scope
- **Minimalistic UI**: A clean, distraction-free landing page with a single prominent input box.
- **Fast Input**: Hitting `Enter` logs the entry immediately.
- **Chronological Feed**: Below the input, a feed of recently logged items is displayed.
- **Data Persistence**: Store data locally (localStorage for this test app).
- **Responsive Design**: Mobile-first, works equally well on desktop.

## 3. Tech Stack (Test Version)
- **Framework**: Next.js (App Router or Pages Router, dealer's choice)
- **Styling**: TailwindCSS
- **State Management**: React State & LocalStorage

## 4. Key Deliverables for Claude-Worker
- Bootstrap the Next.js app in this directory.
- Create the single-page layout with the input and list feed.
- Ensure the UX feels fast and satisfying.
- Initialize a local git repository, commit the files, and optionally push to a mock or temporary GitHub repository if accessible via CLI.

## 5. Success Criteria
A fully functional local web app that can take input instantly, display it in a list, persist it across refreshes, and is committed to git.