# HR Workflow Designer

A visual workflow builder built with React, TypeScript, Redux Toolkit, and React Flow.
Users can design workflows using drag-and-drop nodes and simulate execution with validation.

---

##  Features

*  Drag-and-drop workflow builder
*  Connect nodes visually
*  Dynamic node configuration panel
*  Multiple node types:

  * Start
  * Task
  * Approval
  * Automated Step
  * End

*  Workflow validation:

  * Cycle detection (DFS)
  * Missing Start/End nodes
  * Disconnected nodes
  * Simulation engine with step-by-step execution
  * Clean UI using TailwindCSS

---

##  Tech Stack

* React (Vite)
* TypeScript
* Redux Toolkit
* React Flow (@xyflow/react)
* TailwindCSS

---

##  Demo Workflow

Example flow:

Start → Task → Approval → Auto → End

Simulation Output:

* Workflow initiated
* Task assigned
* Approval requested
* Email sent (simulated)
* Workflow completed

---

##  Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Hitesh1789/hr-workflow-designer.git
cd hr-workflow-designer
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Run the development server

```bash
npm run dev
```

---

### 4️⃣ Open in browser

```
http://localhost:5173
```

---

##  Test Scenarios

### Valid Workflow

Start → Task → End

### Cycle Detection

Task → Approval → Task

### Missing Start

Task → End

---

##  Key Learnings

* Managing complex state using Redux Toolkit
* Graph-based validation (cycle detection using DFS)
* Building scalable UI with React Flow
* Separation of UI and execution logic

---

## Future Improvements

* Undo / Redo functionality
* Backend integration (save workflows)
* Real API execution (email, Slack, etc.)
* Role-based access control

---
