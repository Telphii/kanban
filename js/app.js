Vue.component('task-card', {
    props: ['task', 'colIndex', 'columnsLength'],
    data() {
        return {
            isEditing: false,
            editedTask: { title: '', description: '', deadline: '' },
            returnReason: '',
        };
    },
    methods: {
        toggleEdit() {
            if (!this.isEditing) {
                this.editedTask = { ...this.task };
            }
            this.isEditing = !this.isEditing;
        },
        saveEdit() {
            this.task.title = this.editedTask.title;
            this.task.description = this.editedTask.description;
            this.task.deadline = this.editedTask.deadline;
            this.task.lastEdited = new Date().toLocaleString();
            this.isEditing = false;
            this.$emit('update-storage');
        },
        deleteTask() {
            this.$emit('delete-task', this.task, this.colIndex);
        },
        moveTask(direction) {
            const toColumn = direction === 'left' ? this.colIndex - 1 : this.colIndex + 1;
            this.$emit('move-task', this.task, this.colIndex, toColumn);
        }
    },
    template: `
        <div class="task">
            <div v-if="!isEditing">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
                <p>Дедлайн: {{ task.deadline }}</p>
                <p>Создано: {{ task.createdAt }}</p>
                <p>Последнее изменение: {{ task.lastEdited }}</p>
                <button @click="toggleEdit">Редактировать</button>
                <button @click="deleteTask">Удалить</button>
                <button @click="moveTask('left')" :disabled="colIndex === 0">←</button>
                <button @click="moveTask('right')" :disabled="colIndex === columnsLength - 1">→</button>
            </div>
            <div v-else>
                <input v-model="editedTask.title" placeholder="Название задачи">
                <input v-model="editedTask.description" placeholder="Описание задачи">
                <input v-model="editedTask.deadline" type="date" placeholder="Дедлайн">
                <button @click="saveEdit">Сохранить</button>
                <button @click="toggleEdit">Отмена</button>
            </div>
        </div>
    `
});

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
                <button @click="addTask">Добавить задачу</button>
            </div>

            <div class="kanban-board">
                <div v-for="(column, colIndex) in columns" :key="colIndex" class="kanban-column">
                    <h2>{{ column.title }}</h2>
                    <task-card
                        v-for="(task, taskIndex) in column.tasks"
                        :key="taskIndex"
                        :task="task"
                        :colIndex="colIndex"
                        :columnsLength="columns.length"
                        @delete-task="deleteTask"
                        @move-task="moveTask"
                        @update-storage="saveToLocalStorage"
                    ></task-card>
                </div>
            </div>
        </div>
    `
});