// --- Query Selectors ---
const habits = document.querySelectorAll('.habit-btn');
const themeBtn = document.querySelector('#theme');
const modalContainer = document.querySelector('.modal-container');
const habitContainer = document.querySelector('.habit-container');
const createHabitBtn = document.querySelector('.new-habit__add');
const newHabitTitle = document.querySelector('#title');
const icons = document.querySelectorAll('.icon');
const addBtn = document.querySelector('#add');
const cancelBtn = document.querySelector('#cancel');
const deleteBtn = document.querySelector('#deleteHabit');
const contextMenu = document.querySelector('.context-menu');
let habitToBeDeleted;


// --- Functions ---

const storage = {
    saveTheme(value) {
        localStorage.setItem('habitsapp.theme', `${value}`);
    },
    checkTheme() {
        return localStorage.getItem('habitsapp.theme')
    },
    saveHabit(object) {
        const currentHabits = storage.getHabits();
        if (currentHabits === null || currentHabits === '') {
            localStorage.setItem('habitsapp.habits', JSON.stringify(object));
        } else {
            currentHabits.push(object);
            localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
        }
    },
    getHabits() {
        let currentHabits;
        if (localStorage.getItem('habitsapp.habits') === null) {
            currentHabits = [];
        } else {
            currentHabits = JSON.parse(localStorage.getItem('habitsapp.habits'));
        }
        return currentHabits;
    },
    habitStatus(id) {
        const currentHabits = storage.getHabits();
        currentHabits.forEach(habit => {
            if (habit.id !== Number(id)) return;
            habit.completed === true ? habit.completed = false : habit.completed = true;
        });
        localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
    },
    deleteHabit(id) {
        const currentHabits = storage.getHabits();

        currentHabits.forEach((habit, index) => {
            if (habit.id === Number(id)) {
                currentHabits.splice(index, 1);
            }
            localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
        })
    }
}


const ui = {
    theme() {
        themeBtn.classList.toggle('dark');
        const root = document.querySelector(':root');
        root.classList.toggle('dark');
        themeBtn.classList.contains('dark') 
          ? storage.saveTheme('dark')
          : storage.saveTheme('light');
    },
        openModal() {
        modalContainer.classList.add('active'); // adds 'active' class
        modalContainer.setAttribute('aria-hidden', 'false'); // reveals 'aria-hidden'
        newHabitTitle.focus(); // 'title' field is ready for input once modal opens (no need to click)
    },
        closeModal() {
        modalContainer.classList.remove('active'); // removes 'active' class
        modalContainer.setAttribute('aria-hidden', 'true'); // hides 'aria-hidden'
        newHabitTitle.value = ''; // prevents text entered into 'title' from persisting
        ui.removeSelectedIcon();
    },
    removeSelectedIcon() {
        icons.forEach(icon => {
            icon.classList.remove('selected'); // prevents more than one icon being selected at a time
        })
    },
    addNewHabit(title, icon, id, completed) {
        const habitDiv = document.createElement('div');
        habitDiv.classList.add('habit');
        habitDiv.innerHTML = `
            <button class="habit-btn ${completed === true ? 'completed' : ''}" data-id="${id}" data-title="${title}">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    ${icon}
                </svg>
            </button>
            `;
            habitContainer.appendChild(habitDiv);
    },
    refreshHabits() {
        const uiHabits = document.querySelectorAll('.habit');
        uiHabits.forEach(habit => habit.remove());
        const currentHabits = storage.getHabits();

        currentHabits.forEach(habit => {
            ui.addNewHabit(habit.title, habit.icon, habit.id, habit.completed);
        });
    console.table(currentHabits);
    },
    deleteHabit(id) {
        const habitToDelete = document.querySelector(`[data-id="${id}"]`);
        habitToDelete.remove();
        ui.refreshHabits();
    }
}

// --- Event Listeners ---

// Event: window load
window.addEventListener('DOMContentLoaded', () => {
    // Load stored theme
    const theme = storage.checkTheme();
    if (theme === 'dark') ui.theme();

    // update UI
    ui.refreshHabits(); // makes sure habits saved in local storage are displayed on UI
})

// Event: theme button
themeBtn.addEventListener('click', ui.theme);

// Event: add habit button
createHabitBtn.addEventListener('click', ui.openModal);

// Event: close modal button
cancelBtn.addEventListener('click', ui.closeModal);

// Event: selected icon
icons.forEach(icon => { // loops through each icon
    icon.addEventListener('click', () => { // event listener for click on any icon
        ui.removeSelectedIcon(); // removes 'selected' class from all icons
        icon.classList.add('selected'); // adds 'selected' class to clicked icon
    })
})

// Event: add new habit button
addBtn.addEventListener('click', () => {
    const habitTitle = newHabitTitle.value;
    let habitIcon;
    icons.forEach(icon => {
        if (!icon.classList.contains('selected')) return;
        habitIcon = icon.querySelector('svg').innerHTML;
    });
    const habitID = Math.random();
    ui.addNewHabit(habitTitle, habitIcon, habitID);
    ui.closeModal();
    const habit = {
        title: habitTitle,
        icon: habitIcon,
        id: habitID,
        completed: false,
    };
    storage.saveHabit(habit);
})

// Event: complete habit
habitContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('habit-btn')) return; // only habit buttons are clickable
    e.target.classList.toggle('completed'); // runs if button clicked is habbit button
    storage.habitStatus(e.target.dataset.id);
})

// habits.forEach(habit => {
//    habit.addEventListener('click', () => {
//       habit.classList.toggle('completed');
//    });
//});

// Event: context menu
habitContainer.addEventListener('contextmenu', e => {
    if(!e.target.classList.contains('habit-btn')) return;
    e.preventDefault();
    habitToBeDeleted = e.target.dataset.id; // specifies id of habit to be deleted
    const { clientX: mouseX, clientY: mouseY } = e; // gets mouse coordinates
    contextMenu.style.top = `${mouseY}px`; // Y position of mouse when clicked
    contextMenu.style.left = `${mouseX}px`; // X position of mouse when clicked
    const contextTitle = document.querySelector('#habitTitle');
    contextTitle.textContent = e.target.dataset.title;
    contextMenu.classList.add('active');
})

// Event: delete habit button
deleteBtn.addEventListener('click', () => {
    storage.deleteHabit(habitToBeDeleted);
    ui.deleteHabit(habitToBeDeleted);
    contextMenu.classList.remove('active');
})