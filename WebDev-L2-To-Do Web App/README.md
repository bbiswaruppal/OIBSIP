# TaskFlow · Interactive To-Do Web Application

An interactive, responsive, and accessible To-Do web application crafted with semantic HTML5, modern CSS3, and Vanilla JavaScript.

---

## 🎯 Feature Checklist & Implementation Status

| Feature | Status | Details |
| :--- | :---: | :--- |
| **Input field + "Add Task" button** | ✅ Implemented | Accessible form with Enter key submission, character limit, and blank input validation feedback. |
| **Immediate Pending list placement** | ✅ Implemented | Newly created tasks appear immediately at the top of the Pending Tasks list with an entry transition. |
| **Mark Complete toggle** | ✅ Implemented | Accessible checkbox toggle. Toggling completes the task, strikes through text, and moves it to the Completed list (and vice-versa). |
| **Inline Edit button & quick edit** | ✅ Implemented | Dedicated "Edit" button and double-click handler that switches text into an inline input with Save, Cancel, and Enter/Esc keyboard shortcuts. |
| **Delete button** | ✅ Implemented | Removes task permanently from either list with smooth exit animation and an undo toast option. |
| **Task count indicators** | ✅ Implemented | Dynamic badges displaying `"X pending"` and `"Y completed"` above their respective lists. |
| **Timestamps (Bonus)** | ✅ Implemented | Displays readable timestamp chips on each task: `"Added: Today, 12:45 PM"` and `"Completed: Today, 12:50 PM"`. |
| **LocalStorage persistence (Bonus)** | ✅ Implemented | Tasks and completion states persist across browser refreshes and sessions automatically. |
| **Empty state messaging** | ✅ Implemented | Friendly SVG illustrations and encouraging messages when either the pending or completed list has no items. |

---

## 🌟 Extra Polish & Enhancements

- **Dynamic Progress Bar**: Displays real-time completion percentage and total completion status.
- **Dark / Light Mode**: System theme detection with one-click toggle, persisted in `localStorage`.
- **Live Search / Filter**: Search bar to filter tasks dynamically with quick clear button.
- **Clear All Completed**: One-click bulk action to clear completed tasks.
- **Undo Toast**: 4.5-second undo toast allowing accidental deletions to be immediately restored.
- **Keyboard Navigation**: Full keyboard accessibility (`Enter` to submit/save, `Escape` to cancel editing, `Tab` focus rings).
- **Zero Dependencies**: 100% Vanilla JavaScript, no external libraries required.

---

## 📁 File Structure

```
todo-app/
├── index.html        # Semantic HTML5 layout with accessible forms and dual list structure
├── styles.css        # Modern CSS design system, responsive layout, dark/light themes, animations
├── app.js            # State-driven Vanilla JS controller, storage sync, and DOM event handling
├── test_runner.html  # Automated test suite with iframe sandboxing and assertion reporting
└── README.md         # Documentation and feature guide
```

---

## 🚀 How to Run

1. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari):
   - Double-click `index.html` in Windows Explorer, or
   - Right-click and choose **Open with > Google Chrome** / **Microsoft Edge**.
2. To run the automated verification test suite, open `test_runner.html` in your browser.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Enter` | Submit new task (in main input) / Save edits (in inline edit mode) |
| `Escape` | Cancel inline editing and revert to original text |
| `Double Click` | Quickly trigger inline edit mode directly on task text |
