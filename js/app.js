new Vue({
    el: '#app',
    data() {
        return {
            columns: JSON.parse(localStorage.getItem('kanbanColumns')) || [
                { title: 'Запланированные задачи', tasks: [] },
                { title: 'В работе', tasks: [] },
                { title: 'Тестирование', tasks: [] },
                { title: 'Выполненные задачи', tasks: [] }
            ],
            newTask: { title: '', description: '', deadline: '' }
        };
    },
    methods: {
        saveToLocalStorage() {
            localStorage.setItem('kanbanColumns', JSON.stringify(this.columns));
        },
        addTask() {
            if (this.newTask.title.trim() === '') return;
            this.columns[0].tasks.push({ ...this.newTask });
            this.newTask = { title: '', description: '', deadline: '' };
            this.saveToLocalStorage();
        }
    },
    template: `
        <div>
            <div class="task-form">
                <input v-model="newTask.title" placeholder="Название задачи">
                <input v-model="newTask.description" placeholder="Описание задачи">
                <input v-model="newTask.deadline" type="date" placeholder="Дедлайн">
                <button @click="addTask">Добавить задачу</button>
            </div>

            <div class="kanban-board">
                <div v-for="(column, index) in columns" :key="index" class="kanban-column">
                    <h2>{{ column.title }}</h2>
                    <div v-for="(task, taskIndex) in column.tasks" :key="taskIndex" class="task">
                        <h3>{{ task.title }}</h3>
                        <p>{{ task.description }}</p>
                        <p>Дедлайн: {{ task.deadline }}</p>
                    </div>
                </div>
            </div>
        </div>
    `
});