/**
 * TaskFlow · Interactive To-Do Web Application
 * Complete Vanilla JavaScript implementation with MVC State Architecture,
 * localStorage synchronization, inline editing, and accessible UI interactions.
 */

(() => {
  'use strict';

  // --- Storage Constants ---
  const STORAGE_KEY = 'taskflow_tasks_v1';
  const THEME_KEY = 'taskflow_theme_v1';

  // --- State ---
  const state = {
    tasks: [],
    filterQuery: '',
    editingTaskId: null,
    theme: 'light',
    lastDeleted: null,
    toastTimeout: null
  };

  // --- DOM Elements ---
  const elements = {
    taskForm: document.getElementById('task-form'),
    taskInput: document.getElementById('task-input'),
    formFeedback: document.getElementById('form-feedback'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    clearCompletedBtn: document.getElementById('clear-completed-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    currentDateEl: document.getElementById('current-date'),
    
    // Progress
    progressBarFill: document.getElementById('progress-bar-fill'),
    progressPercentage: document.getElementById('progress-percentage'),
    progressMetaText: document.getElementById('progress-meta-text'),
    progressBarContainer: document.getElementById('progress-bar-container'),

    // Lists & Badges
    pendingList: document.getElementById('pending-list'),
    completedList: document.getElementById('completed-list'),
    pendingCountBadge: document.getElementById('pending-count-badge'),
    completedCountBadge: document.getElementById('completed-count-badge'),
    pendingEmpty: document.getElementById('pending-empty'),
    completedEmpty: document.getElementById('completed-empty'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    toastAction: document.getElementById('toast-action')
  };

  // --- Initial Sample Tasks for First-Time Users ---
  const DEFAULT_TASKS = [
    {
      id: 'task_' + (Date.now() - 3600000),
      text: 'Explore TaskFlow features: Add, Complete, Edit, and Delete tasks',
      completed: false,
      createdAt: Date.now() - 3600000,
      completedAt: null
    },
    {
      id: 'task_' + (Date.now() - 7200000),
      text: 'Try inline editing by clicking the Edit button or double-clicking this text',
      completed: false,
      createdAt: Date.now() - 7200000,
      completedAt: null
    },
    {
      id: 'task_' + (Date.now() - 86400000),
      text: 'Welcome to TaskFlow! Initial setup completed',
      completed: true,
      createdAt: Date.now() - 86400000,
      completedAt: Date.now() - 43200000
    }
  ];

  // --- Utility Functions ---

  /**
   * Escape HTML entities to prevent XSS attacks
   */
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Format timestamp into a human-friendly readable date/time string
   */
  function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    
    // Formatting options
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today, ${timeString}`;
    } else if (isYesterday) {
      return `Yesterday, ${timeString}`;
    } else {
      const monthDay = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `${monthDay}, ${timeString}`;
    }
  }

  /**
   * Format the current date for the header display
   */
  function updateHeaderDate() {
    const today = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    elements.currentDateEl.textContent = today.toLocaleDateString('en-US', options);
  }

  // --- Storage Management ---

  /**
   * Load tasks from localStorage or initialize with sample tasks
   */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.tasks = JSON.parse(stored);
      } else {
        state.tasks = [...DEFAULT_TASKS];
        saveTasks();
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using in-memory state.', e);
      state.tasks = [...DEFAULT_TASKS];
    }
  }

  /**
   * Persist current tasks array to localStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
      showToast('Could not save to localStorage. Storage might be full.');
    }
  }

  /**
   * Initialize and manage dark/light theme
   */
  function initTheme() {
    let savedTheme = localStorage.getItem(THEME_KEY);
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      savedTheme = prefersDark ? 'dark' : 'light';
    }
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // Ignore storage errors
    }
  }

  function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // --- Core CRUD Operations ---

  /**
   * Add a new task to the Pending list
   */
  function addTask(rawText) {
    const text = rawText.trim();
    if (!text) {
      showInputError('Task description cannot be blank.');
      return false;
    }

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      text: text,
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    };

    // Prepend to pending list
    state.tasks.unshift(newTask);
    saveTasks();
    clearInputError();
    render();
    showToast('Task added successfully');
    return true;
  }

  /**
   * Toggle completion state of a task
   */
  function toggleTaskCompletion(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;

    // Reset editing state if currently editing this task
    if (state.editingTaskId === id) {
      state.editingTaskId = null;
    }

    saveTasks();
    render();

    const statusMsg = task.completed ? 'Task marked as completed' : 'Task moved back to pending';
    showToast(statusMsg);
  }

  /**
   * Enter inline editing mode for a task
   */
  function startEditing(id) {
    state.editingTaskId = id;
    render();

    // Auto-focus the input field
    const editInput = document.getElementById(`edit-input-${id}`);
    if (editInput) {
      editInput.focus();
      // Position cursor at end of input
      editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
    }
  }

  /**
   * Save inline edited text
   */
  function saveEditing(id, newRawText) {
    const text = newRawText.trim();
    const task = state.tasks.find(t => t.id === id);

    if (!task) {
      state.editingTaskId = null;
      render();
      return;
    }

    if (!text) {
      // Shake or warn if trying to save empty text
      const editInput = document.getElementById(`edit-input-${id}`);
      if (editInput) {
        editInput.classList.add('input-error');
        editInput.placeholder = 'Please enter a description or cancel';
        setTimeout(() => editInput.classList.remove('input-error'), 400);
      }
      return;
    }

    task.text = text;
    state.editingTaskId = null;
    saveTasks();
    render();
    showToast('Task updated');
  }

  /**
   * Cancel inline editing
   */
  function cancelEditing() {
    state.editingTaskId = null;
    render();
  }

  /**
   * Delete a task with undo support
   */
  function deleteTask(id) {
    const taskItemElement = document.querySelector(`[data-task-id="${id}"]`);
    
    // Smooth exit animation
    if (taskItemElement) {
      taskItemElement.style.animation = 'slideOut 0.2s forwards';
      setTimeout(() => {
        performDelete(id);
      }, 180);
    } else {
      performDelete(id);
    }
  }

  function performDelete(id) {
    const taskIndex = state.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const [deletedTask] = state.tasks.splice(taskIndex, 1);
    state.lastDeleted = { task: deletedTask, index: taskIndex };

    if (state.editingTaskId === deletedTask.id) {
      state.editingTaskId = null;
    }

    saveTasks();
    render();
    showToast('Task deleted', true);
  }

  /**
   * Undo last deleted task
   */
  function undoDelete() {
    if (!state.lastDeleted) return;

    const { task, index } = state.lastDeleted;
    const insertIndex = Math.min(index, state.tasks.length);
    state.tasks.splice(insertIndex, 0, task);
    state.lastDeleted = null;

    saveTasks();
    render();
    hideToast();
    showToast('Task restored');
  }

  /**
   * Clear all completed tasks
   */
  function clearAllCompleted() {
    const completedCount = state.tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    if (confirm(`Are you sure you want to permanently clear all ${completedCount} completed task${completedCount === 1 ? '' : 's'}?`)) {
      state.tasks = state.tasks.filter(t => !t.completed);
      saveTasks();
      render();
      showToast(`Cleared ${completedCount} completed task${completedCount === 1 ? '' : 's'}`);
    }
  }

  // --- Validation and Toast UI ---

  function showInputError(msg) {
    elements.taskInput.classList.add('input-error');
    elements.formFeedback.textContent = msg;
    elements.formFeedback.classList.remove('hidden');
    elements.taskInput.focus();
  }

  function clearInputError() {
    elements.taskInput.classList.remove('input-error');
    elements.formFeedback.classList.add('hidden');
    elements.formFeedback.textContent = '';
  }

  function showToast(message, allowUndo = false) {
    if (state.toastTimeout) {
      clearTimeout(state.toastTimeout);
    }

    elements.toastMessage.textContent = message;

    if (allowUndo && state.lastDeleted) {
      elements.toastAction.classList.remove('hidden');
    } else {
      elements.toastAction.classList.add('hidden');
    }

    elements.toast.classList.add('show');

    state.toastTimeout = setTimeout(() => {
      hideToast();
    }, 4500);
  }

  function hideToast() {
    elements.toast.classList.remove('show');
    if (state.toastTimeout) {
      clearTimeout(state.toastTimeout);
      state.toastTimeout = null;
    }
  }

  // --- Rendering Functions ---

  /**
   * Render a single task item DOM node
   */
  function createTaskItemHTML(task) {
    const isEditing = state.editingTaskId === task.id;
    const isCompleted = task.completed;
    const escapedText = escapeHTML(task.text);
    const createdFormatted = formatTimestamp(task.createdAt);
    const completedFormatted = task.completedAt ? formatTimestamp(task.completedAt) : null;

    if (isEditing) {
      return `
        <li class="task-item" data-task-id="${task.id}">
          <form class="task-edit-form" onsubmit="return false;">
            <input 
              type="text" 
              id="edit-input-${task.id}" 
              class="inline-edit-input" 
              value="${escapedText}"
              maxlength="200" 
              autocomplete="off"
              aria-label="Edit task description"
            >
            <div class="inline-edit-actions">
              <button type="button" class="btn-inline btn-inline-cancel cancel-edit-btn" data-id="${task.id}">
                ✕ Cancel
              </button>
              <button type="button" class="btn-inline btn-inline-save save-edit-btn" data-id="${task.id}">
                ✓ Save
              </button>
            </div>
          </form>
        </li>
      `;
    }

    return `
      <li class="task-item ${isCompleted ? 'completed-item' : ''}" data-task-id="${task.id}">
        <div class="task-main-row">
          <button 
            type="button" 
            class="task-toggle-btn ${isCompleted ? 'is-checked' : ''}" 
            data-action="toggle" 
            data-id="${task.id}"
            aria-label="${isCompleted ? 'Mark as pending' : 'Mark as completed'}"
          >
            <div class="custom-checkbox" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <div class="task-content">
            <span 
              class="task-text" 
              data-action="start-edit" 
              data-id="${task.id}" 
              title="Double click to edit"
            >${escapedText}</span>
            <div class="task-meta">
              <span class="timestamp-chip" title="Created on ${new Date(task.createdAt).toLocaleString()}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Added: ${createdFormatted}
              </span>
              ${completedFormatted ? `
                <span class="timestamp-chip completed-chip" title="Completed on ${new Date(task.completedAt).toLocaleString()}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Completed: ${completedFormatted}
                </span>
              ` : ''}
            </div>
          </div>

          <div class="task-actions">
            <button 
              type="button" 
              class="action-btn edit-btn" 
              data-action="start-edit" 
              data-id="${task.id}" 
              title="Edit task text inline"
              aria-label="Edit task"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button 
              type="button" 
              class="action-btn delete-btn" 
              data-action="delete" 
              data-id="${task.id}" 
              title="Delete task permanently"
              aria-label="Delete task"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </li>
    `;
  }

  /**
   * Main Render function: updates lists, badges, empty states, and progress bar
   */
  function render() {
    const query = state.filterQuery.trim().toLowerCase();

    // Filter tasks based on search query
    const filteredTasks = state.tasks.filter(t => {
      if (!query) return true;
      return t.text.toLowerCase().includes(query);
    });

    const pendingTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);

    // Actual total counts (independent of filter)
    const totalPendingCount = state.tasks.filter(t => !t.completed).length;
    const totalCompletedCount = state.tasks.filter(t => t.completed).length;
    const totalCount = state.tasks.length;

    // 1. Update Badges
    elements.pendingCountBadge.textContent = `${totalPendingCount} pending`;
    elements.completedCountBadge.textContent = `${totalCompletedCount} completed`;

    // 2. Render Pending List
    if (pendingTasks.length === 0) {
      elements.pendingList.innerHTML = '';
      elements.pendingEmpty.classList.remove('hidden');
      
      // If query is active and nothing found
      if (query && totalPendingCount > 0) {
        elements.pendingEmpty.querySelector('.empty-title').textContent = 'No matching pending tasks';
        elements.pendingEmpty.querySelector('.empty-desc').textContent = `No pending tasks match "${query}". Try another search term.`;
      } else {
        elements.pendingEmpty.querySelector('.empty-title').textContent = 'All caught up!';
        elements.pendingEmpty.querySelector('.empty-desc').textContent = 'No pending tasks right now. Relax or create a new task using the form above.';
      }
    } else {
      elements.pendingEmpty.classList.add('hidden');
      elements.pendingList.innerHTML = pendingTasks.map(createTaskItemHTML).join('');
    }

    // 3. Render Completed List
    if (completedTasks.length === 0) {
      elements.completedList.innerHTML = '';
      elements.completedEmpty.classList.remove('hidden');

      if (query && totalCompletedCount > 0) {
        elements.completedEmpty.querySelector('.empty-title').textContent = 'No matching completed tasks';
        elements.completedEmpty.querySelector('.empty-desc').textContent = `No completed tasks match "${query}".`;
      } else {
        elements.completedEmpty.querySelector('.empty-title').textContent = 'No completed tasks yet';
        elements.completedEmpty.querySelector('.empty-desc').textContent = 'Mark tasks as complete to celebrate your achievements here!';
      }
    } else {
      elements.completedEmpty.classList.add('hidden');
      elements.completedList.innerHTML = completedTasks.map(createTaskItemHTML).join('');
    }

    // 4. Update Clear Completed Button Visibility
    if (totalCompletedCount > 0) {
      elements.clearCompletedBtn.classList.remove('hidden');
    } else {
      elements.clearCompletedBtn.classList.add('hidden');
    }

    // 5. Update Progress Bar
    const percent = totalCount > 0 ? Math.round((totalCompletedCount / totalCount) * 100) : 0;
    elements.progressBarFill.style.width = `${percent}%`;
    elements.progressPercentage.textContent = `${percent}%`;
    elements.progressMetaText.textContent = `${totalCompletedCount} of ${totalCount} task${totalCount === 1 ? '' : 's'} completed`;
    elements.progressBarContainer.setAttribute('aria-valuenow', percent);

    // 6. Update search clear button
    if (state.filterQuery) {
      elements.clearSearchBtn.classList.remove('hidden');
    } else {
      elements.clearSearchBtn.classList.add('hidden');
    }
  }

  // --- Event Bindings & Listeners ---

  function attachEventListeners() {
    // Form Submission for New Task
    elements.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = elements.taskInput.value;
      if (addTask(text)) {
        elements.taskInput.value = '';
        elements.taskInput.focus();
      }
    });

    // Real-time input typing clears error state
    elements.taskInput.addEventListener('input', () => {
      if (elements.taskInput.value.trim().length > 0) {
        clearInputError();
      }
    });

    // Theme Toggle
    elements.themeToggle.addEventListener('click', () => {
      toggleTheme();
    });

    // Search / Filter Input
    elements.searchInput.addEventListener('input', (e) => {
      state.filterQuery = e.target.value;
      render();
    });

    // Clear Search Button
    elements.clearSearchBtn.addEventListener('click', () => {
      state.filterQuery = '';
      elements.searchInput.value = '';
      render();
      elements.searchInput.focus();
    });

    // Clear All Completed Button
    elements.clearCompletedBtn.addEventListener('click', () => {
      clearAllCompleted();
    });

    // Toast Undo Action
    elements.toastAction.addEventListener('click', () => {
      undoDelete();
    });

    // Delegated Event Handling on Lists Container (Pending & Completed)
    const handleListClick = (e) => {
      // 1. Toggle completion button or checkbox clicked
      const toggleBtn = e.target.closest('[data-action="toggle"]');
      if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        toggleTaskCompletion(id);
        return;
      }

      // 2. Start inline editing button
      const editBtn = e.target.closest('[data-action="start-edit"]');
      if (editBtn) {
        const id = editBtn.dataset.id;
        startEditing(id);
        return;
      }

      // 3. Delete button
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteTask(id);
        return;
      }

      // 4. Save inline edit button
      const saveBtn = e.target.closest('.save-edit-btn');
      if (saveBtn) {
        const id = saveBtn.dataset.id;
        const input = document.getElementById(`edit-input-${id}`);
        if (input) {
          saveEditing(id, input.value);
        }
        return;
      }

      // 5. Cancel inline edit button
      const cancelBtn = e.target.closest('.cancel-edit-btn');
      if (cancelBtn) {
        cancelEditing();
        return;
      }
    };

    // Double click to trigger inline editing on task text
    const handleListDblClick = (e) => {
      const textSpan = e.target.closest('.task-text');
      if (textSpan && textSpan.dataset.id) {
        startEditing(textSpan.dataset.id);
      }
    };

    // Keyboard navigation inside inline edit inputs
    const handleListKeyDown = (e) => {
      if (e.target.classList.contains('inline-edit-input')) {
        const taskId = state.editingTaskId;
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEditing(taskId, e.target.value);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEditing();
        }
      }
    };

    // Attach to both lists
    [elements.pendingList, elements.completedList].forEach(list => {
      list.addEventListener('click', handleListClick);
      list.addEventListener('dblclick', handleListDblClick);
      list.addEventListener('keydown', handleListKeyDown);
    });
  }

  // --- App Initialization ---
  function init() {
    updateHeaderDate();
    initTheme();
    loadTasks();
    attachEventListeners();
    render();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
