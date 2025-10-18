// Query Selectors
const habits = document.querySelectorAll('.habit-btn');
const themeBtn = document.querySelector('#theme');

// Functions

const storage = {
    saveTheme(value) {
        localStorage.setItem('habitsapp.theme', `${value}`);
    },
    checkTheme() {
        return localStorage.getItem('habitsapp.theme')
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
    }
}

// Event Listeners

// Event: window load
window.addEventListener('DOMContentLoaded', () => {
    // Load stored theme
    const theme = storage.checkTheme();
    console.log(theme);
    if (theme === 'dark') ui.theme();
})

// Event: theme button
themeBtn.addEventListener('click', ui.theme);

// Delete
habits.forEach(habit => {
    habit.addEventListener('click', () => {
        habit.classList.toggle('completed');
    });
});