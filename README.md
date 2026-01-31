# VectorShift Pipeline Demo

**A Resilient, Low-Code AI Pipeline Orchestration Tool.**

VectorShift Pipeline Demo is a drag-and-drop editor that allows users to design, validate, and simulate complex AI workflows. It mimics the behavior of production-grade tools like LangFlow or ComfyUI, offering a seamless experience from "Idea" to "Execution Simulation." It features a custom-built Breadth-First Search (BFS) execution engine, real-time variable detection, and robust state management.

---
### [See Live Frontend](https://vector-shift-assignment-delta.vercel.app/) | [Walkthrough Demo](https://drive.google.com/file/d/15YWeIMw2Oi10wlJ1O8yoLXpgyv6aofxo/view?usp=drivesdk)

---

## 🚀 Key Features & Nuances Handled

* **Theatrical Simulation Engine:** Unlike static "Run" buttons, this uses a custom BFS (Breadth-First Search) algorithm to traverse the graph. Nodes light up sequentially (Input → LLM → Output), and edges animate to visualize data packets flowing in real-time.
* **Smart Variable Detection:** The `TextNode` features a mini-compiler that parses `{{variable_name}}` patterns in real-time. It automatically creates dynamic input handles for every variable detected, enabling complex data chaining.
* **"Ghost Edge" Prevention:** The persistence layer includes a sanitation check on load. It filters out "Ghost Edges" (connections to nodes that no longer exist), preventing the dreaded "React Flow handle not found" crash.
* **Adaptive Floating Inspector:** A single, polymorphic `Properties.js` panel handles configuration for 9 different node types. It adapts its fields dynamically (e.g., showing "Model/Temperature" for LLMs, but "Headers/Method" for APIs).
* **Robust History Stack:** Full Undo/Redo (Ctrl+Z / Ctrl+Y) capability that tracks not just position, but deep data changes (like tweaking a prompt or changing an API method).

---

## 🛠 Tech Stack

* **Frontend:** React 18, React Flow (Core Engine), Zustand (State Management), Tailwind CSS (via variables), React Toastify.
* **Backend:** Python 3, FastAPI (DAG Validation), Uvicorn.
* **State Management:** `zustand` + `zustand/shallow` for high-performance selective re-rendering.
* **Styling:** Pure CSS Modules with CSS Variables for global Dark/Light mode switching.

---

## 🏗 Architecture and Project Structure

The project follows a Monorepo-style structure separating the Visual Engine (Frontend) from the Logic Validator (Backend).

```bash
📦 vectorshift-monorepo
 ┣ 📂 backend              # THE LOGIC VALIDATOR (Python/FastAPI)
 ┃ ┣ 📂 __pycache__      # Python compiled bytecode (auto-generated)
 ┃ ┣ 📜 main.py            # The Entry Point. Contains the FastAPI app, the `/pipelines/parse` endpoint, and the DAG cycle detection logic.
 ┃ ┗ 📜 requirements.txt   # List of Python libraries needed (fastapi, uvicorn, pydantic).
 ┃
 ┣ 📂 frontend             # THE VISUAL EDITOR (React)
 ┃ ┣ 📂 node_modules     # Installed JavaScript dependencies (React, React Flow, etc.).
 ┃ ┣ 📂 public           # Static Assets served directly to the browser.
 ┃ ┃ ┣ 📜 favicon.ico      # The browser tab icon.
 ┃ ┃ ┣ 📜 index.html       # The HTML "Shell" where React mounts the app.
 ┃ ┃ ┣ 📜 logo192.png      # App icons for manifests.
 ┃ ┃ ┣ 📜 manifest.json    # Metadata for PWA (Progressive Web App) behavior.
 ┃ ┃ ┗ 📜 robots.txt       # Instructions for web crawlers.
 ┃ ┣ 📜 .gitignore         # Frontend-specific git ignore rules.
 ┃ ┣ 📜 package-lock.json  # Exact version tree of installed dependencies (ensures stability).
 ┃ ┣ 📜 package.json       # Project manifest. Scripts (start, build) and dependency list.
 ┃ ┣ 📜 README.md          # Documentation for the frontend.
 ┃ ┣ 📜 project_file_structure.txt # A text copy of this structure.
 ┃ ┃
 ┃ ┗ 📂 src              # SOURCE CODE
 ┃ ┃ ┣ 📂 nodes        # CUSTOM NODE COMPONENTS
 ┃ ┃ ┃ ┣ 📜 BaseNode.js        # The Higher-Order Component. Wraps *all* nodes with common UI (border, handles, delete btn, resizing).
 ┃ ┃ ┃ ┣ 📜 inputNode.js       # Node for User Inputs (Type: Text/File).
 ┃ ┃ ┃ ┣ 📜 outputNode.js      # Node for Final Results (Type: Text/Image).
 ┃ ┃ ┃ ┣ 📜 textNode.js        # The "Smart" Node. Handles {{variable}} detection, dynamic handles, and auto-resizing text areas.
 ┃ ┃ ┃ ┣ 📜 llmNode.js         # Node for LLM Settings (Model, Prompt, Temperature).
 ┃ ┃ ┃ ┗ 📜 integrationNodes.js # (New) Collection of Integration Nodes: Timer, API, Database, Slack, Note.
 ┃ ┃ ┃
 ┃ ┃ ┣ 📜 App.js             # The Layout Root. Holds the Header, Toolbar, Canvas, and Properties Panel together.
 ┃ ┃ ┣ 📜 ButtonEdge.js      # Custom Edge Component. Renders the connection line with a red "X" delete button.
 ┃ ┃ ┣ 📜 draggableNode.js   # The draggable items in the Toolbar (Sidebar).
 ┃ ┃ ┣ 📜 index.css          # Global Styles. Handles Variables (Colors), Dark Mode overrides, and Animations.
 ┃ ┃ ┣ 📜 index.js           # The React Entry Point. Mounts <App /> to the DOM.
 ┃ ┃ ┣ 📜 PipelineTemplatePanel.js # The UI Modal/Panel for selecting pre-built templates.
 ┃ ┃ ┣ 📜 pipelineTemplates.js     # The "Database" of hardcoded templates (JSON data for Resume Parser, Chatbot, etc.).
 ┃ ┃ ┣ 📜 Properties.js      # The "Inspector" Widget. A floating panel to edit the data of the currently selected node.
 ┃ ┃ ┣ 📜 store.js           # The Brain (Zustand). Manages Nodes, Edges, Undo/Redo history, and the Simulation Engine state.
 ┃ ┃ ┣ 📜 submit.js          # The Submit Button logic. Sends graph data to the Backend API.
 ┃ ┃ ┣ 📜 toolbar.js         # The Node Selector Bar (Left/Top). Contains the draggable icons.
 ┃ ┃ ┗ 📜 ui.js              # The React Flow Canvas Wrapper. Handles Drop events, MiniMap, and Grid.

```

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v16+)
* Python (v3.9+)

### 1. Frontend Setup (The Visual Editor)

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000

```

### 2. Backend Setup (The DAG Validator)

```bash
cd backend
pip install fastapi uvicorn pydantic
python main.py
# Runs on [http://127.0.0.1:8000](http://127.0.0.1:8000)
# Docs available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

```

---

## 📸 Screenshots
<img width="1922" height="923" alt="vs1" src="https://github.com/user-attachments/assets/448766d9-a2ed-4f0c-acc9-9ea19f23874d" />
<img width="1922" height="923" alt="vs2" src="https://github.com/user-attachments/assets/915bc778-3dae-4836-82e6-91f89a310e17" />
<img width="1919" height="921" alt="vs3" src="https://github.com/user-attachments/assets/989eb1eb-29bd-45f9-952b-a6c8dd9b6e2a" />
<img width="1919" height="922" alt="vs4" src="https://github.com/user-attachments/assets/e20c482a-da66-4505-bc91-25f5da3fca4f" />
<img width="1922" height="2496" alt="vs5" src="https://github.com/user-attachments/assets/21e8857b-4f2c-43ba-9132-e8244d16fb47" />
<img width="1915" height="921" alt="vs6" src="https://github.com/user-attachments/assets/785f81a9-ac91-4661-a613-227196250c18" />
<img width="1922" height="923" alt="vs7" src="https://github.com/user-attachments/assets/043b6cf5-b64e-4002-b6fc-4bfeed5e4444" />
<img width="1915" height="1017" alt="image" src="https://github.com/user-attachments/assets/dbbf725e-0cbf-41c4-8d71-237c54d1e671" />



---

## 🛠️ Engineering Challenges & Edge Cases Handling Details

### 1. The "Over-Rendering" Lag (Performance)
* **Challenge:** Initially, dragging a single node caused the entire canvas to lag. This was because the `BaseNode` was subscribing to the entire `store.activeNodes` array. Even if Node A moved, Node B would re-render to check if it was "active".
* **Solution:** We implemented **Selective Subscriptions** using `zustand/shallow`. Now, a node only re-renders if its *specific* ID enters or leaves the active list.
```javascript
// Before (Laggy)
const isActive = useStore(state => state.activeNodes.includes(id));

// After (60 FPS)
const isActive = useStore(state => state.activeNodes.includes(id), shallow);

```

### 2. Handling Circular Dependencies in Simulation

* **Challenge:** If a user created a loop (Node A -> Node B -> Node A), a naive recursive simulation would crash the browser with a stack overflow.
* **Solution:** The Simulation Engine in `store.js` implements a `visited` Set during its BFS traversal. It tracks nodes processed in the current run cycle and explicitly prevents re-triggering a node that is already "lit," effectively handling loops gracefully.

### 3. The "White Block" Conflict (Layout Engine)

* **Challenge:** We transitioned from a fixed Sidebar to a Floating Property Panel. For a while, the old `sidebar.js` was rendering an empty white div that pushed the canvas, breaking the layout.
* **Solution:** We completely deprecated `sidebar.js` and consolidated all logic into `Properties.js`. We used absolute positioning with z-indexing to ensure the new panel floats *over* the canvas rather than fighting for layout space.

### 4. Dynamic Handle Generation (Regex Logic)

* **Challenge:** Standard nodes have static inputs. The `TextNode` needed to generate connection points dynamically based on user typing (e.g., typing `{{userName}}` should create a "userName" input).
* **Solution:** We implemented a real-time Regex parser (`/{{(.*?)}}/g`) inside the node. It extracts unique variables and maps them to dynamic `<Handle />` components. We calculated `top` positions using percentages (`(index + 1) * (100 / total)`) to ensure handles are always evenly distributed regardless of the node's height.

### 5. "Ghost Edge" Crashes (Persistence Sanitization)

* **Challenge:** When loading a pipeline from Local Storage, if a saved edge pointed to a node that was deleted in a previous session (or failed to load), React Flow would throw a hard error and crash the entire app.
* **Solution:** We added a sanitization layer in the `loadPipeline` action. It filters the edges against the *current* list of loaded node IDs, silently discarding any "Ghost Edges" before they reach the render engine.

---

## 🧠 Architecture Decision Record (ADR)

### Why Zustand over Redux?

We chose Zustand because its transient update model is superior for high-frequency updates like dragging nodes (60hz). Redux boilerplate would have made handling the `onNodesChange` events excessively verbose and slower.

### Why separate `BaseNode.js`?

Instead of repeating styling logic (borders, shadows, delete buttons) in every node file (`llmNode.js`, `inputNode.js`), we created a Higher-Order Component (`BaseNode`). This ensures that if we want to change the "Selected" color from Blue to Purple, we change it in one file, and it propagates to all 9 node types instantly.

### Why Client-Side BFS Simulation?

Instead of requiring a heavy backend execution for simple testing, we built a client-side Breadth-First Search (BFS) engine. This allows users to instantly visualize the *flow* of logic (Order of Operations) without needing valid API keys or server resources, providing immediate tactile feedback.

---

## 🔮 Future Roadmap & Scalability

* **Branched Numbered Flow Run (Figma-Style):** Support for executing specific sub-flows separately, similar to Figma prototypes where you can run distinct "User Journeys" within a larger board.
* **Real Backend Execution:** Sending the JSON graph to a Python Celery worker to actually execute the LangChain logic.
* **Collaborative Editing:** Integrating `yjs` or `Liveblocks` to allow multiple users to drag nodes in the same room simultaneously.
* **Custom Node Creator:** Allowing users to define new node types via a UI form instead of code.

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Can I connect any node to any node?**
A: No. The `store.js` contains a `CONNECTION_GUIDELINES` engine. It prevents illogical connections, such as connecting an "Output" directly to an "Input" or connecting a "Slack" node to nothing.

**Q: Does it save my work?**
A: Yes. The app uses Local Storage persistence. You can close the tab, restart your browser, and your graph will be exactly where you left it.

**Q: How do I delete a link?**
A: Hover over any connecting line. A red "X" button will appear. Click it to sever the connection.

**Q: Why doesn't the Text Node show scrollbars?**
A: We use an auto-resizing text area to maintain immersion. The node grows vertically with your content, so you never have to scroll inside a tiny box.

---

**Made with 💚 by Avii**
