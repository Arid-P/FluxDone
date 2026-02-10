/**
 * FluxDone - Task Management Application
 * A TickTick clone with dark minimalist design
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE_URL: '/api', // Change this to your backend URL
    DEFAULT_LIST: 'inbox',
    PRIORITIES: {
        1: { color: '#FF5E5E', label: 'High' },
        2: { color: '#FAA05A', label: 'Medium' },
        3: { color: '#5EB1FF', label: 'Low' },
        4: { color: '#808080', label: 'None' }
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    tasks: [],
    currentList: CONFIG.DEFAULT_LIST,
    currentSort: 'custom',
    selectedPriority: 4,
    isLoading: false,
    sidebarOpen: false
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.getElementById('menu-toggle'),
    navItems: document.querySelectorAll('.nav-item'),
    inboxCount: document.getElementById('inbox-count'),
    todayCount: document.getElementById('today-count'),
    weekCount: document.getElementById('week-count'),
    
    // Header
    currentListTitle: document.getElementById('current-list-title'),
    sortBtn: document.getElementById('sort-btn'),
    sortMenu: document.getElementById('sort-menu'),
    
    // Add Task (Desktop)
    taskInput: document.getElementById('task-input'),
    addTaskBtn: document.getElementById('add-task-btn'),
    setPriorityBtn: document.getElementById('set-priority-btn'),
    
    // Task List
    taskList: document.getElementById('task-list'),
    emptyState: document.getElementById('empty-state'),
    
    // Mobile
    bottomNav: document.getElementById('bottom-nav'),
    fabAddTask: document.getElementById('fab-add-task'),
    
    // Modals
    addTaskModal: document.getElementById('add-task-modal'),
    modalTaskInput: document.getElementById('modal-task-input'),
    closeModalBtn: document.getElementById('close-modal'),
    cancelTaskBtn: document.getElementById('cancel-task'),
    saveTaskBtn: document.getElementById('save-task'),
    modalPriorityBtn: document.getElementById('modal-priority-btn'),
    
    // Priority Modal
    priorityModal: document.getElementById('priority-modal'),
    closePriorityModalBtn: document.getElementById('close-priority-modal'),
    priorityOptions: document.querySelectorAll('.priority-option'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate UUID v4
 * @returns {string} UUID string
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

/**
 * Check if date is overdue
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
function isOverdue(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

/**
 * Check if date is today
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
function isToday(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info)
 */
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    
    const icon = elements.toast.querySelector('i');
    icon.className = 'fas';
    
    switch (type) {
        case 'success':
            icon.classList.add('fa-check-circle');
            icon.style.color = 'var(--accent-success)';
            break;
        case 'error':
            icon.classList.add('fa-exclamation-circle');
            icon.style.color = 'var(--accent-danger)';
            break;
        case 'info':
            icon.classList.add('fa-info-circle');
            icon.style.color = 'var(--accent-primary)';
            break;
    }
    
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch tasks from backend
 * @param {string} listId - List identifier
 * @returns {Promise<Array>} Array of tasks
 */
async function fetchTasks(listId = 'inbox') {
    try {
        state.isLoading = true;
        
        // Uncomment when backend is ready
        // const response = await fetch(`${CONFIG.API_BASE_URL}/tasks?list=${listId}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // 
        // if (!response.ok) throw new Error('Failed to fetch tasks');
        // const data = await response.json();
        // return data.tasks || [];
        
        // Mock data for demonstration
        return getMockTasks(listId);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showToast('Failed to load tasks', 'error');
        return [];
    } finally {
        state.isLoading = false;
    }
}

/**
 * Add task to backend
 * @param {Object} task - Task object
 * @returns {Promise<Object>} Created task
 */
async function addTaskAPI(task) {
    try {
        // Uncomment when backend is ready
        // const response = await fetch(`${CONFIG.API_BASE_URL}/tasks`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(task)
        // });
        // 
        // if (!response.ok) throw new Error('Failed to add task');
        // return await response.json();
        
        // Mock response
        return { ...task, id: generateUUID() };
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
}

/**
 * Toggle task completion status
 * @param {string} taskId - Task UUID
 * @param {boolean} completed - New completion status
 * @returns {Promise<Object>} Updated task
 */
async function toggleTaskCompletionAPI(taskId, completed) {
    try {
        // Uncomment when backend is ready
        // const response = await fetch(`${CONFIG.API_BASE_URL}/tasks/${taskId}`, {
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ completed })
        // });
        // 
        // if (!response.ok) throw new Error('Failed to update task');
        // return await response.json();
        
        // Mock response
        return { id: taskId, completed };
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

/**
 * Delete task from backend
 * @param {string} taskId - Task UUID
 * @returns {Promise<boolean>} Success status
 */
async function deleteTaskAPI(taskId) {
    try {
        // Uncomment when backend is ready
        // const response = await fetch(`${CONFIG.API_BASE_URL}/tasks/${taskId}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // 
        // if (!response.ok) throw new Error('Failed to delete task');
        // return true;
        
        // Mock response
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// ============================================
// MOCK DATA
// ============================================
function getMockTasks(listId) {
    const mockTasks = {
        inbox: [
            {
                id: generateUUID(),
                title: 'Review project proposal',
                completed: false,
                priority: 1,
                dueDate: new Date().toISOString(),
                list: 'inbox',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Buy groceries for dinner',
                completed: false,
                priority: 2,
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                list: 'inbox',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Schedule dentist appointment',
                completed: true,
                priority: 3,
                dueDate: null,
                list: 'inbox',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Read article about productivity',
                completed: false,
                priority: 4,
                dueDate: null,
                list: 'inbox',
                createdAt: new Date().toISOString()
            }
        ],
        today: [
            {
                id: generateUUID(),
                title: 'Review project proposal',
                completed: false,
                priority: 1,
                dueDate: new Date().toISOString(),
                list: 'inbox',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Team standup meeting',
                completed: false,
                priority: 2,
                dueDate: new Date().toISOString(),
                list: 'work',
                createdAt: new Date().toISOString()
            }
        ],
        next7days: [
            {
                id: generateUUID(),
                title: 'Review project proposal',
                completed: false,
                priority: 1,
                dueDate: new Date().toISOString(),
                list: 'inbox',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Buy groceries for dinner',
                completed: false,
                priority: 2,
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                list: 'inbox',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Submit expense report',
                completed: false,
                priority: 1,
                dueDate: new Date(Date.now() + 172800000).toISOString(),
                list: 'work',
                createdAt: new Date().toISOString()
            }
        ],
        personal: [
            {
                id: generateUUID(),
                title: 'Buy groceries for dinner',
                completed: false,
                priority: 2,
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                list: 'personal',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Call mom',
                completed: false,
                priority: 3,
                dueDate: null,
                list: 'personal',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Plan weekend trip',
                completed: false,
                priority: 4,
                dueDate: new Date(Date.now() + 345600000).toISOString(),
                list: 'personal',
                createdAt: new Date().toISOString()
            }
        ],
        work: [
            {
                id: generateUUID(),
                title: 'Team standup meeting',
                completed: false,
                priority: 2,
                dueDate: new Date().toISOString(),
                list: 'work',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Submit expense report',
                completed: false,
                priority: 1,
                dueDate: new Date(Date.now() + 172800000).toISOString(),
                list: 'work',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Update documentation',
                completed: true,
                priority: 3,
                dueDate: null,
                list: 'work',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Code review for PR #234',
                completed: false,
                priority: 2,
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                list: 'work',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Prepare presentation slides',
                completed: false,
                priority: 1,
                dueDate: new Date(Date.now() + 259200000).toISOString(),
                list: 'work',
                createdAt: new Date().toISOString()
            }
        ],
        shopping: [
            {
                id: generateUUID(),
                title: 'Milk',
                completed: false,
                priority: 3,
                dueDate: null,
                list: 'shopping',
                createdAt: new Date().toISOString()
            },
            {
                id: generateUUID(),
                title: 'Eggs',
                completed: false,
                priority: 3,
                dueDate: null,
                list: 'shopping',
                createdAt: new Date().toISOString()
            }
        ]
    };
    
    return mockTasks[listId] || [];
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render task list
 */
function renderTasks() {
    const tasks = getFilteredAndSortedTasks();
    
    // Update counts
    updateCounts();
    
    // Clear current list
    elements.taskList.innerHTML = '';
    
    // Show empty state if no tasks
    if (tasks.length === 0) {
        elements.emptyState.classList.add('show');
        return;
    }
    
    elements.emptyState.classList.remove('show');
    
    // Render each task
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        elements.taskList.appendChild(taskCard);
    });
}

/**
 * Create task card element
 * @param {Object} task - Task object
 * @returns {HTMLElement} Task card element
 */
function createTaskCard(task) {
    const li = document.createElement('li');
    li.className = `task-card ${task.completed ? 'completed' : ''}`;
    li.dataset.taskId = task.id;
    
    // Checkbox
    const checkbox = document.createElement('div');
    checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
    checkbox.innerHTML = '<i class="fas fa-check"></i>';
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskCompletion(task.id);
    });
    
    // Task content
    const content = document.createElement('div');
    content.className = 'task-content';
    
    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.title;
    
    content.appendChild(text);
    
    // Meta information
    if (task.dueDate || task.list !== state.currentList) {
        const meta = document.createElement('div');
        meta.className = 'task-meta';
        
        if (task.dueDate) {
            const dateItem = document.createElement('span');
            dateItem.className = 'task-meta-item';
            if (isOverdue(task.dueDate) && !task.completed) {
                dateItem.classList.add('overdue');
            } else if (isToday(task.dueDate) && !task.completed) {
                dateItem.classList.add('today');
            }
            dateItem.innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}`;
            meta.appendChild(dateItem);
        }
        
        if (task.list !== state.currentList) {
            const listItem = document.createElement('span');
            listItem.className = 'task-meta-item';
            listItem.innerHTML = `<i class="fas fa-folder"></i> ${task.list}`;
            meta.appendChild(listItem);
        }
        
        content.appendChild(meta);
    }
    
    // Priority bar
    const priorityBar = document.createElement('div');
    priorityBar.className = `priority-bar priority-${task.priority}`;
    
    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(priorityBar);
    
    // Long press for delete (mobile)
    let pressTimer;
    li.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
            if (confirm('Delete this task?')) {
                deleteTask(task.id);
            }
        }, 800);
    });
    li.addEventListener('mouseup', () => clearTimeout(pressTimer));
    li.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    
    return li;
}

/**
 * Get filtered and sorted tasks
 * @returns {Array} Filtered and sorted tasks
 */
function getFilteredAndSortedTasks() {
    let tasks = [...state.tasks];
    
    // Filter by list
    switch (state.currentList) {
        case 'inbox':
            tasks = tasks.filter(t => t.list === 'inbox');
            break;
        case 'today':
            const today = new Date().toDateString();
            tasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today);
            break;
        case 'next7days':
            const now = new Date();
            const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            tasks = tasks.filter(t => {
                if (!t.dueDate) return false;
                const due = new Date(t.dueDate);
                return due >= now && due <= nextWeek;
            });
            break;
        default:
            tasks = tasks.filter(t => t.list === state.currentList);
    }
    
    // Sort
    switch (state.currentSort) {
        case 'priority':
            tasks.sort((a, b) => a.priority - b.priority);
            break;
        case 'due-date':
            tasks.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            break;
        case 'title':
            tasks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            // Custom: incomplete first, then by creation date
            tasks.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }
    
    return tasks;
}

/**
 * Update badge counts
 */
function updateCounts() {
    const allTasks = state.tasks;
    
    // Inbox count (incomplete tasks in inbox)
    const inboxTasks = allTasks.filter(t => t.list === 'inbox' && !t.completed);
    elements.inboxCount.textContent = inboxTasks.length;
    elements.inboxCount.style.display = inboxTasks.length > 0 ? 'block' : 'none';
    
    // Today count
    const today = new Date().toDateString();
    const todayTasks = allTasks.filter(t => {
        return t.dueDate && new Date(t.dueDate).toDateString() === today && !t.completed;
    });
    elements.todayCount.textContent = todayTasks.length;
    elements.todayCount.style.display = todayTasks.length > 0 ? 'block' : 'none';
    
    // Week count
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekTasks = allTasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const due = new Date(t.dueDate);
        return due >= now && due <= nextWeek;
    });
    elements.weekCount.textContent = weekTasks.length;
    elements.weekCount.style.display = weekTasks.length > 0 ? 'block' : 'none';
}

// ============================================
// TASK OPERATIONS
// ============================================

/**
 * Add new task
 * @param {string} title - Task title
 */
async function addTask(title) {
    if (!title.trim()) {
        showToast('Please enter a task title', 'error');
        return;
    }
    
    const newTask = {
        title: title.trim(),
        completed: false,
        priority: state.selectedPriority,
        dueDate: null,
        list: state.currentList === 'today' || state.currentList === 'next7days' 
            ? 'inbox' 
            : state.currentList,
        createdAt: new Date().toISOString()
    };
    
    try {
        const createdTask = await addTaskAPI(newTask);
        state.tasks.push(createdTask);
        
        // Reset input
        elements.taskInput.value = '';
        elements.modalTaskInput.value = '';
        state.selectedPriority = 4;
        
        // Close modal if open
        closeAddTaskModal();
        
        // Re-render
        renderTasks();
        showToast('Task added successfully');
    } catch (error) {
        showToast('Failed to add task', 'error');
    }
}

/**
 * Toggle task completion
 * @param {string} taskId - Task UUID
 */
async function toggleTaskCompletion(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newCompleted = !task.completed;
    
    try {
        await toggleTaskCompletionAPI(taskId, newCompleted);
        task.completed = newCompleted;
        
        // Update UI immediately for smooth feel
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskCard) {
            taskCard.classList.toggle('completed', newCompleted);
            const checkbox = taskCard.querySelector('.task-checkbox');
            checkbox.classList.toggle('checked', newCompleted);
        }
        
        // Update counts
        updateCounts();
        
        showToast(newCompleted ? 'Task completed' : 'Task uncompleted');
    } catch (error) {
        showToast('Failed to update task', 'error');
    }
}

/**
 * Delete task
 * @param {string} taskId - Task UUID
 */
async function deleteTask(taskId) {
    try {
        await deleteTaskAPI(taskId);
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        renderTasks();
        showToast('Task deleted');
    } catch (error) {
        showToast('Failed to delete task', 'error');
    }
}

// ============================================
// UI INTERACTIONS
// ============================================

/**
 * Switch to different list
 * @param {string} listId - List identifier
 */
function switchList(listId) {
    state.currentList = listId;
    
    // Update title
    const listNames = {
        inbox: 'Inbox',
        today: 'Today',
        next7days: 'Next 7 Days',
        personal: 'Personal',
        work: 'Work',
        shopping: 'Shopping'
    };
    elements.currentListTitle.textContent = listNames[listId] || listId;
    
    // Update sidebar active state
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.list === listId);
    });
    
    // Update bottom nav active state
    const bottomNavBtns = document.querySelectorAll('.bottom-nav .nav-btn');
    bottomNavBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.list === listId);
    });
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
        closeSidebar();
    }
    
    // Re-render tasks
    renderTasks();
}

/**
 * Toggle sidebar on mobile
 */
function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    elements.sidebar.classList.toggle('open', state.sidebarOpen);
    
    // Create/remove overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (state.sidebarOpen && !overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', closeSidebar);
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 0);
    } else if (!state.sidebarOpen && overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
}

/**
 * Close sidebar
 */
function closeSidebar() {
    state.sidebarOpen = false;
    elements.sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
}

/**
 * Toggle sort menu
 */
function toggleSortMenu() {
    elements.sortMenu.classList.toggle('show');
}

/**
 * Set sort option
 * @param {string} sortType - Sort type
 */
function setSort(sortType) {
    state.currentSort = sortType;
    elements.sortMenu.classList.remove('show');
    renderTasks();
    showToast(`Sorted by ${sortType.replace('-', ' ')}`);
}

/**
 * Open add task modal (mobile)
 */
function openAddTaskModal() {
    elements.addTaskModal.classList.add('show');
    elements.modalTaskInput.focus();
}

/**
 * Close add task modal
 */
function closeAddTaskModal() {
    elements.addTaskModal.classList.remove('show');
    elements.modalTaskInput.value = '';
}

/**
 * Open priority selector
 */
function openPriorityModal() {
    elements.priorityModal.classList.add('show');
}

/**
 * Close priority selector
 */
function closePriorityModal() {
    elements.priorityModal.classList.remove('show');
}

/**
 * Set selected priority
 * @param {number} priority - Priority level (1-4)
 */
function setPriority(priority) {
    state.selectedPriority = priority;
    closePriorityModal();
    
    // Update button color indicator
    const color = CONFIG.PRIORITIES[priority].color;
    elements.setPriorityBtn.style.color = color;
    elements.modalPriorityBtn.style.color = color;
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    // Sidebar toggle (mobile)
    elements.menuToggle.addEventListener('click', toggleSidebar);
    
    // List navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchList(item.dataset.list);
        });
    });
    
    // Bottom navigation (mobile)
    const bottomNavBtns = document.querySelectorAll('.bottom-nav .nav-btn');
    bottomNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.list === 'lists') {
                toggleSidebar();
            } else {
                switchList(btn.dataset.list);
            }
        });
    });
    
    // Sort menu
    elements.sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSortMenu();
    });
    
    document.addEventListener('click', (e) => {
        if (!elements.sortMenu.contains(e.target) && e.target !== elements.sortBtn) {
            elements.sortMenu.classList.remove('show');
        }
    });
    
    // Sort options
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            setSort(item.dataset.sort);
        });
    });
    
    // Add task (desktop)
    elements.addTaskBtn.addEventListener('click', () => {
        addTask(elements.taskInput.value);
    });
    
    elements.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(elements.taskInput.value);
        }
    });
    
    // FAB (mobile)
    elements.fabAddTask.addEventListener('click', openAddTaskModal);
    
    // Modal controls
    elements.closeModalBtn.addEventListener('click', closeAddTaskModal);
    elements.cancelTaskBtn.addEventListener('click', closeAddTaskModal);
    elements.saveTaskBtn.addEventListener('click', () => {
        addTask(elements.modalTaskInput.value);
    });
    
    elements.modalTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(elements.modalTaskInput.value);
        }
    });
    
    // Priority selector
    elements.setPriorityBtn.addEventListener('click', openPriorityModal);
    elements.modalPriorityBtn.addEventListener('click', openPriorityModal);
    elements.closePriorityModalBtn.addEventListener('click', closePriorityModal);
    
    elements.priorityOptions.forEach(option => {
        option.addEventListener('click', () => {
            setPriority(parseInt(option.dataset.priority));
        });
    });
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            closeAddTaskModal();
            closePriorityModal();
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAddTaskModal();
            closePriorityModal();
            closeSidebar();
        }
        
        // Ctrl/Cmd + N to add task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            if (window.innerWidth < 768) {
                openAddTaskModal();
            } else {
                elements.taskInput.focus();
            }
        }
    });
    
    // Window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeSidebar();
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    // Load initial tasks
    state.tasks = await fetchTasks(state.currentList);
    
    // Render
    renderTasks();
    
    // Setup event listeners
    initEventListeners();
    
    console.log('FluxDone initialized successfully');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
