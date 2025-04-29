// `document.addEventListener('DOMContentLoaded', ...)` 这行代码的作用是监听 `DOMContentLoaded` 事件。
// 当 HTML 文档被完全加载和解析完成后，无需等待样式表、图像和子框架的加载完成，就会触发这个事件。
// 回调函数中的代码会在该事件触发时执行，确保在操作 DOM 元素之前，这些元素已经被正确加载到页面中。

// `addEventListener` 是 JavaScript 中用于为指定元素添加事件监听器的方法。
// 它接受三个参数：
// 1. 第一个参数是事件类型，这里是 `DOMContentLoaded`，表示 HTML 文档被完全加载和解析完成后触发的事件。
// 2. 第二个参数是回调函数，当指定的事件触发时，会执行这个函数。这里的回调函数用于在页面加载完成后执行一系列操作。
// 3. 第三个参数是一个可选参数，通常是一个布尔值或对象，用于指定事件捕获或冒泡的行为，这里未提供该参数，使用默认值 `false`，表示使用事件冒泡机制。什么是冒泡机制？
// 冒泡机制是指当一个事件发生在一个元素上时，该事件会沿着 DOM 树向上冒泡，直到到达文档的根元素。
// 也就是说，当一个元素的某个事件被触发时，它会先执行自己的事件处理程序，然后再依次执行它的父元素、祖父元素等的事件处理程序，直到到达文档的根元素。
// 冒泡机制可以让我们在处理事件时，不必为每个元素都单独添加事件监听器，只需要在文档的根元素上添加一个事件监听器，就可以处理所有元素的事件。
// 例如，我们可以在文档的根元素上添加一个 `click` 事件监听器，然后在回调函数中判断事件的目标元素，执行相应的操作。
// 这样，我们就可以在一个地方处理所有元素的点击事件，而不必为每个元素都单独添加事件监听器。
// 冒泡机制是 JavaScript 中事件处理的一种常见机制，它可以让我们更方便地处理事件，提高代码的可读性和可维护性。

document.addEventListener('DOMContentLoaded', function() {  // 页面加载完成后执行
    const form = document.getElementById('todo-form');      // 获取表单元素
    const input = document.getElementById('todo-input');    // 获取输入框元素
    const list = document.getElementById('todo-list');      // 获取待办事项列表元素
    
    // 从服务器获取待办事项
    let todos = [];
    
    // 获取最新待办事项
    function fetchTodos() {
        fetch('/api/todos')
            .then(response => response.json())
// 此处使用异步函数是因为 `fetch` 方法是一个异步操作。当我们调用 `fetch('/api/todos')` 时，它会向服务器发送一个 HTTP 请求，
// 但不会阻塞后续代码的执行。服务器响应可能需要一些时间才能返回，因此 `fetch` 返回一个 Promise 对象。
// 我们使用 `then` 方法来处理这个 Promise，当服务器响应成功返回时，`then` 方法中的回调函数会被执行。
// 这里的 `then(data => {` 就是在服务器返回数据并将其转换为 JSON 格式后，对转换后的数据 `data` 进行处理。
// 这样可以确保在数据准备好后再进行后续操作，比如更新 `todos` 变量和渲染待办事项列表。
            .then(data => {
                todos = data;
                renderTodos(); // 渲染待办事项列表
                // 这是一个异步操作，用于从服务器获取待办事项数据。
                // 当 fetch 请求成功时，会返回一个包含响应数据的 Promise 对象。
                // 然后，我们使用 then 方法来处理这个 Promise 对象，
                // 并将响应数据转换为 JSON 格式。
                // 最后，我们使用另一个 then 方法来处理转换后的 JSON 数据，
                // 并将其赋值给 todos 变量，然后调用 renderTodos 函数来渲染待办事项列表。
                // 这样，当页面加载完成后，我们就可以从服务器获取到最新的待办事项数据，并将其渲染到页面上。
            });
    }
    
    // 渲染待办事项列表
    function renderTodos() {
        list.innerHTML = '';//清空列表
        todos.forEach((todo, index) => {//遍历待办事项数组
            const li = document.createElement('li');    //创建列表项元素    
            // 这是一个 JavaScript 函数，用于根据待办事项的完成状态，
            // 动态生成待办事项的 HTML 代码。
            // 具体来说，这个函数会根据传入的 todo 对象的 completed 属性值，
            // 生成不同的 HTML 代码，以实现不同的样式效果。
            // 如果 completed 属性值为 true，则生成的 HTML 代码中，
            // 待办事项的文本会被添加一个 CSS 样式，
            // 使得文本内容被添加一条下划线，表示该待办事项已完成。
            // 如果 completed 属性值为 false，则生成的 HTML 代码中，
            // 待办事项的文本不会被添加任何样式，表示该待办事项未完成。
            // 这个函数通常用于在前端页面中动态生成待办事项列表，
            // 以便用户可以方便地查看和管理待办事项的状态。 
            // 例如，当用户点击待办事项的复选框时，
            // 可以调用这个函数来更新待办事项的样式，
            // 以反映其完成状态的变化。 
            // 这个函数通常与其他前端框架或库一起使用，
            // 以便实现更复杂的功能和交互效果。
            
            li.innerHTML = `
                <div class="todo-item">
                    <input type="checkbox" class="todo-checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}>
                    <span style="${todo.completed ? 'text-decoration: line-through' : ''}">${todo.text}</span>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;

            // div 元素用于包裹待办事项的文本和删除按钮，
            // input 元素用于表示待办事项的完成状态， data-index 属性用于存储待办事项的索引值，checked 属性用于表示待办事项的完成状态。
            // span 元素用于显示待办事项的文本内容，style 属性用于根据待办事项的完成状态，添加或移除文本的下划线样式。  
            // button 元素用于删除待办事项，data-index 属性用于存储待办事项的索引值。
            
            list.appendChild(li); //将列表项元素添加到列表中
        });
    }
    
    // （对form）添加新待办事项
    form.addEventListener('submit', function(e) {
        e.preventDefault();                         //阻止表单提交，防止页面刷新，而是通过 AJAX 请求发送数据到服务器。
        const todoText = input.value.trim();        // 变量 input 是在页面加载完成后，通过 document.getElementById('todo-input') 获取到的输入框元素
        if (todoText) {
            // fetch 函数用于向服务器发送 HTTP 请求，
            // 并返回一个 Promise 对象，该对象表示请求的响应。
            // 具体来说，fetch 函数接受两个参数：
            // 第一个参数是请求的 URL，
            // 第二个参数是一个可选的对象，用于配置请求的各种选项，
            // 例如请求方法、请求头、请求体等。
            fetch('/api/todos', {//向服务器发送 POST 请求，添加新的待办事项
                method: 'POST',                         //请求方法，指定为 POST
                headers: {
                    'Content-Type': 'application/json', //请求头，指定请求体的格式为 JSON
                },
                body: JSON.stringify({ todo: todoText })//请求体，将待办事项的文本转换为 JSON 格式的字符串，
                                                        // 并作为请求的主体发送到服务器。
                                                        // 这是因为在服务器端，我们通常需要从请求体中获取数据，
                                                        // 并将其转换为 JavaScript 对象进行处理。
                                                        // 因此，在发送 POST 请求时，我们需要将待办事项的文本转换为 JSON 格式的字符串，
                                                        // 并将其作为请求的主体发送到服务器。
            })
            .then(() => {   //请求成功后，调用 fetchTodos 函数，获取最新的待办事项数据，并渲染到页面上。
                            // 这是一个异步操作，用于向服务器发送 POST 请求，添加新的待办事项。
                            // 当 fetch 请求成功时，会返回一个包含响应数据的 Promise 对象。
                            // 然后，我们使用 then 方法来处理这个 Promise 对象，
                            // 并将响应数据转换为 JSON 格式。
                input.value = '';//清空输入框
                fetchTodos();
            });
        }
    });
    
    // （对list）删除待办事项
    list.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) { //判断点击的元素是否为删除按钮
            const index = e.target.getAttribute('data-index');  //获取待办事项的索引值
            fetch(`/api/todos/${index}`, {
                method: 'DELETE'
            })
            .then(() => {
                fetchTodos();
            });
        } else if (e.target.classList.contains('todo-checkbox')) {//判断点击的元素是否为复选框
            const index = e.target.getAttribute('data-index');
            const isChecked = e.target.checked;//获取复选框的选中状态
            fetch(`/api/todos/${index}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: isChecked })//将待办事项的完成状态转换为 JSON 格式的字符串
            }).then(() => {
                todos[index].completed = isChecked;//更新待办事项的完成状态
                const span = e.target.nextElementSibling;//获取待办事项的文本元素
                                                        // nextElementSibling 是 JavaScript 中的一个属性，用于获取当前元素的下一个兄弟元素。
                                                        // 具体来说，nextElementSibling 是一个只读属性，用于获取当前元素的下一个兄弟元素。
                                                        // 这个属性返回的是一个 DOM 元素对象，
                                                        // 表示当前元素的下一个兄弟元素。
                                                        // 如果当前元素没有下一个兄弟元素，或者下一个兄弟元素不是一个 DOM 元素，
                                                        // 则 nextElementSibling 返回 null。
                span.style.textDecoration = isChecked ? 'line-through' : '';  //  根据待办事项的完成状态，添加或移除文本的下划线样式。
            });
            // 在处理复选框点击事件时，不需要再次执行 `fetchTodos()` 函数，原因如下：
            // 1. 我们已经在本地更新了 `todos` 数组中对应待办事项的完成状态，即 `todos[index].completed = isChecked`。
            // 2. 同时，我们也直接操作了 DOM 元素，更新了待办事项文本的样式，即 `span.style.textDecoration = isChecked ? 'line-through' : ''`。
            // 3. 调用 `fetchTodos()` 会再次向服务器发送请求获取所有待办事项，然后重新渲染整个列表，这会带来不必要的网络请求和 DOM 操作，影响性能。
            // 因此，在这种情况下，我们只需在本地更新数据和样式即可，无需重新获取和渲染所有待办事项。
        }
    });
    
    // 初始获取数据
    fetchTodos();
});