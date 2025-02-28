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
            editingTask: null // Для хранения задачи, которую редактируем
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
            // Устанавливаем задачу для редактирования
            this.editingTask = task;
            // Заполняем форму данными задачи
            this.newTask = { ...task };
        },
        saveEditedTask() {
            if (!this.newTask.title || !this.newTask.description || !this.newTask.deadline) return;
            // Обновляем задачу
            this.editingTask.title = this.newTask.title;
            this.editingTask.description = this.newTask.description;
            this.editingTask.deadline = this.newTask.deadline;
            this.editingTask.lastEdited = new Date().toLocaleString();
            // Сбрасываем форму и редактируемую задачу
            this.newTask = { title: '', description: '', deadline: '' };
            this.editingTask = null;
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
                <div v-for="(column, index) in columns" :key="index" class="kanban-column">
                    <h2>{{ column.title }}</h2>
                    <div v-for="(task, taskIndex) in column.tasks" :key="taskIndex" class="task">
                        <h3>{{ task.title }}</h3>
                        <p>{{ task.description }}</p>
                        <p>Дедлайн: {{ task.deadline }}</p>
                        <p>Создано: {{ task.createdAt }}</p>
                        <p>Последнее изменение: {{ task.lastEdited }}</p>
                        <button @click="editTask(task)">Редактировать</button>
                    </div>
                </div>
            </div>
        </div>
    `
});