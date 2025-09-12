## Project Name

Kanban Task Management System

## Setup Instructions

First, install dependencies

```bash
npm install
```

Second, run the server

```bash
npm run dev
```

# Then Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture Overview

Routes

- / => Main Board Page
- /tasks/[id] => Task detail & edit page
  State
- Global state is stored in localstorage
- State updates on create,edit, and move
- Filtered results stored in filteredTask state, updated by Filters
  Data Flow
- On load fetchTasks() reads tasks from localstorage
- Board splits tasks into 3 columns
- Tasg are handle with CreatableSelect, which supports both selectin existing tags and creating new ones dynamically
- Actions(CRUD) => call service function => update both state and localStorage
- Filters pass filtered tasks back to Board => Board rerenders columns

## Key Decisions & Tradeoffs

Use localStorage for easy demo, no backend needed(no backend need)
Modal for create, page for edit(simpler to use)
No drag and drop, use move button(faster to build)
Simple responsive layout(3 columns on desktop, stacked on mobile/tablet)

## Accessibility & Performance Notes

Inputs have labels, icons have hidden text
Works with keyboard navigation
Filter is optimized with useMemo
Future: save filters between sessions

## Testing Approach

Manual test for create, edit, delete, move
Checked filters(search, assignee, tags)
Checked empty state
Tested on desktop, tablet, and mobile

## Time Spent

Create seed data & localstorage function ~45min
Build all basic CRUD functions and responsive mobile layout ~3h40min
Review all requirements & hints ~10min
Total: ~4h30min

## If I had More Time

In some places, assignee, proprity and tags options are currently hardcoded; they could be fetch dynamically or made configurable by the user
Drag and drop for moving tasks
Save filters after refresh
Bulk delete/move

## Boilerplate & External Libraries

Project initialized with create-next-app
Used **React-Select** for multi-select tags: supports creating new tags as well as selecting existing ones
Adapted **Flowbite modal/button/avatar styless** for task editor layout
