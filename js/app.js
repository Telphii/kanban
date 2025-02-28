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
            newTask: { title: '', description: '', deadline: '' },
            editingTask: null
        };
    },
    methods: {
        saveToLocalStorage() {
            localStorage.setItem('kanbanColumns', JSON.stringify(this.columns));
        },
        addTask() {
            if (!this.newTask.title || !this.newTask.description || !this.newTask.deadline) return;
            this.columns[0].tasks.push({
                ...this.newTask,
                createdAt: new Date().toLocaleString(),
                lastEdited: new Date().toLocaleString()
            });
            this.newTask = { title: '', description: '', deadline: '' };
            this.saveToLocalStorage();
        },
        editTask(task) {
            this.editingTask = task;
            this.newTask = { ...task };
        },
        saveEditedTask() {
            if (!this.newTask.title || !this.newTask.description || !this.newTask.deadline) return;
            this.editingTask.title = this.newTask.title;
            this.editingTask.description = this.newTask.description;
            this.editingTask.deadline = this.newTask.deadline;
            this.editingTask.lastEdited = new Date().toLocaleString();
            this.newTask = { title: '', description: '', deadline: '' };
            this.editingTask = null;
            this.saveToLocalStorage();
        },
        deleteTask(task, colIndex) {
            this.columns[colIndex].tasks = this.columns[colIndex].tasks.filter(t => t !== task);
            this.saveToLocalStorage();
        },
        moveTask(task, fromColumn, toColumn) {
            if (toColumn >= this.columns.length || toColumn < 0) return;
            this.columns[fromColumn].tasks = this.columns[fromColumn].tasks.filter(t => t !== task);
            this.columns[toColumn].tasks.push(task);
            task.lastEdited = new Date().toLocaleString();
            this.saveToLocalStorage();
        }
    },
    template: `
        <div>
            <div class="task-form">
                <input v-model="newTask.title" placeholder="Название задачи">
                <input v-model="newTask.description" placeholder="Описание задачи">
                <input v-model="newTask.deadline" type="date" placeholder="Дедлайн">
                <button @click="addTask" v-if="!editingTask">Добавить задачу</button>
                <button @click="saveEditedTask" v-else>Сохранить изменения</button>
            </div>

            <div class="kanban-board">
                <div v-for="(column, colIndex) in columns" :key="colIndex" class="kanban-column">
                    <h2>{{ column.title }}</h2>
                    <div v-for="(task, taskIndex) in column.tasks" :key="taskIndex" class="task">
                        <h3>{{ task.title }}</h3>
                        <p>{{ task.description }}</p>
                        <p>Дедлайн: {{ task.deadline }}</p>
                        <p>Создано: {{ task.createdAt }}</p>
                        <p>Последнее изменение: {{ task.lastEdited }}</p>
                        <button @click="editTask(task)">Редактировать</button>
                        <button @click="deleteTask(task, colIndex)">Удалить</button>
                        <button @click="moveTask(task, colIndex, colIndex - 1)" :disabled="colIndex === 0">←</button>
                        <button @click="moveTask(task, colIndex, colIndex + 1)" :disabled="colIndex === columns.length - 1">→</button>
                    </div>
                </div>
            </div>
        </div>
    `
});