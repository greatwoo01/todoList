document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');


    let todos = [];


    function fetchTodos() {
        fetch('/api/todos')
            .then(response => response.json())

            .then(data => {
                todos = data;
                renderTodos();

            });
    }


    let showDeleted = false;

    function renderTodos() {
        const activeList = document.getElementById('todo-list');
        const deletedList = document.getElementById('deleted-list');

        activeList.innerHTML = '';
        deletedList.innerHTML = '';

        todos.forEach((todo, index) => {
            if (!todo.deleted) {
                const li = document.createElement('li');

                li.innerHTML = `
                    <div class="todo-item">
                        <span style="margin-right: 10px;">${index + 1}.</span>
                        <input type="checkbox" class="todo-checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}>
                        <span style="${todo.completed ? 'text-decoration: line-through' : ''}">${todo.text}</span>
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                `;

                activeList.appendChild(li);
            } else if (showDeleted) {
                const li = document.createElement('li');

                li.innerHTML = `
                    <div class="todo-item">
                        <span style="margin-right: 10px;">${index + 1}.</span>
                        <span style="text-decoration: line-through; color: #999;">${todo.text}</span>
                        <button class="restore-btn" data-index="${index}">Restore</button>
                    </div>
                `;

                deletedList.appendChild(li);
            }
        });
    }

    // 添加显示/隐藏已删除项目的复选框事件
    document.getElementById('toggle-deleted-btn').addEventListener('change', function () {
        showDeleted = this.checked;
        renderTodos();
    });

    // （对form）添加新待办事项
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const todoText = input.value.trim();
        if (todoText) {

            fetch('/api/todos', {//向服务器发送 POST 请求，添加新的待办事项
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ todo: todoText })
            })
                .then(() => {
                    input.value = '';
                    fetchTodos();
                });
        }
    });

    // （对list）删除待办事项
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
            console.log(`delete按钮点击事件触发，处理索引值: ${e.target.getAttribute('data-index')}`);
            const index = e.target.getAttribute('data-index');
            fetch(`/api/todos/${index}`, {
                method: 'DELETE'
            })
                .then(() => {
                    fetchTodos();
                });
        } else if (e.target.classList.contains('restore-btn')) {
            console.log(`restore按钮点击事件触发，处理索引值: ${e.target.getAttribute('data-index')}`);
            const index = e.target.getAttribute('data-index');
            fetch(`/api/todos/${index}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    fetchTodos();
                });
        } else if (e.target.classList.contains('edit-btn')) {
            const index = e.target.getAttribute('data-index');
            const span = e.target.previousElementSibling;
            const currentText = span.textContent;
            const newText = prompt('修改Todo事项：', currentText);
            if (newText && newText !== currentText) {
                fetch(`/api/todos/${index}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: newText })
                }).then(() => {
                    fetchTodos();
                });
            }
        } else if (e.target.classList.contains('todo-checkbox')) {
            const index = e.target.getAttribute('data-index');
            const isChecked = e.target.checked;
            fetch(`/api/todos/${index}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: isChecked })
            }).then(() => {
                todos[index].completed = isChecked;
                const span = e.target.nextElementSibling;
                span.style.textDecoration = isChecked ? 'line-through' : '';
            });

        }
    });


    // 全选按钮事件监听
    document.getElementById('select-all-btn').addEventListener('change', function() {
        const isChecked = this.checked;
        const promises = [];
        
        todos.forEach((todo, index) => {
            if (!todo.deleted) {
                promises.push(
                    fetch(`/api/todos/${index}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ completed: isChecked })
                    })
                );
            }
        });
        
        Promise.all(promises).then(() => {
            todos.forEach((todo, index) => {
                if (!todo.deleted) {
                    todos[index].completed = isChecked;
                }
            });
            
            const checkboxes = document.querySelectorAll('.todo-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                const span = checkbox.nextElementSibling;
                span.style.textDecoration = isChecked ? 'line-through' : '';
            });
        });
    });

    fetchTodos();
});