// Query Selectors
const habits = document.querySelectorAll('.habit-btn');
const themeBtn = document.querySelector('#theme');

// Functions

const storage = {

}

const ui = {
    theme() {
        themeBtn.classList.toggle('dark');
        const root = document.querySelector(':root');
        root.classList.toggle('dark');
    }
}

// Event Listeners

// Event: theme button
themeBtn.addEventListener('click', ui.theme);

// Delete
habits.forEach(habit => {
    habit.addEventListener('click', () => {
        habit.classList.toggle('completed');
    });
});