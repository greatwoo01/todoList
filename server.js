// 使用 const 声明变量是因为 express 模块的引用在程序运行期间不需要改变，
// const 保证了变量的引用不可变，有助于代码的安全性和可维护性，避免意外的变量重新赋值。

// 导入所需要的模块
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// 创建 Express 应用
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'todos.json'); // 数据文件路径

// 中间件设置
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));



// 初始化数据文件
if (!fs.existsSync(DATA_FILE)) {
    // 数据文件不存在时，以同步的方式创建该文件，并将一个空数组以 JSON 字符串的形式写入文件。
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 获取所有待办事项
// 当客户端向 /api/todos 发送 GET 请求时，服务器会读取数据文件中的 JSON 数据，并将其作为响应发送给客户端。
// 这是一个简单的 RESTful API，用于获取和操作待办事项数据。
// 在 RESTful API 设计中，HTTP 方法被用来表示对资源的不同操作。

app.get('/api/todos', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }
        res.json(JSON.parse(data));
    });
});

// 添加新待办事项
app.post('/api/todos', (req, res) => { //有请求req，就有响应res
// req.body.todo 存在的原因可能是客户端在发送 POST 请求时，
// 将新的待办事项数据以 JSON 格式放在请求体中，并且使用 'todo' 作为键名。
// 例如客户端可能使用如下代码发送请求：
// fetch('/api/todos', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ todo: '新的待办事项内容' })
// });
const newTodo = req.body.todo;
    if (!newTodo) {
        // 检查请求体中是否存在 'todo' 键，如果不存在，则返回一个 400 状态码的响应，提示用户输入待办事项文本。
        // 这是一种常见的错误处理方式，用于确保客户端发送的请求数据是有效的。
        // 例如客户端可能发送一个空的请求体，或者请求体中缺少 'todo' 键，
        // 这都会导致服务器返回一个 400 状态码的响应，提示用户输入待办事项文本。 
        return res.status(400).send('Todo text is required');
    }
    
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {//读取数据文件中的 JSON 数据
        if (err) {
            return res.status(500).send('Error reading data');
        }
        
        const todos = JSON.parse(data);
        todos.push({text: newTodo, completed: false, deleted: false});//将新的待办事项添加到数组中
        
        fs.writeFile(DATA_FILE, JSON.stringify(todos), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }
            res.status(201).send('Todo added');
        });
    });
});

// 删除待办事项
app.delete('/api/todos/:index', (req, res) => {//:index是一个占位符，用于表示待删除待办事项的索引
    const index = parseInt(req.params.index);//将字符串类型的索引转换为整数类型
    
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }
        
        let todos = JSON.parse(data);//将 JSON 字符串解析为 JavaScript 对象数组
        if (index < 0 || index >= todos.length) {
            return res.status(404).send('Todo not found');
        }
        
        todos[index].deleted = true;//将待办事项标记为已删除
        /*
        修改为标记删除而非直接删除数组元素
        这样可以保留数据以便后续恢复或查看
        */
        
        fs.writeFile(DATA_FILE, JSON.stringify(todos), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }
            res.send('Todo deleted');
        });
    });
});

// 更新待办事项完成状态
app.patch('/api/todos/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const isChecked = req.body.completed;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }
        
        const todos = JSON.parse(data);
        if (index < 0 || index >= todos.length) {
            return res.status(404).send('Todo not found');
        }
        
        todos[index].completed = isChecked;
        
        fs.writeFile(DATA_FILE, JSON.stringify(todos), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }
            res.send('Todo updated');
        });
    });
});

// 还原待办事项
app.patch('/api/todos/:index/restore', (req, res) => {
    console.log(`restore OK`);
    const index = parseInt(req.params.index);
    
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }
        
        const todos = JSON.parse(data);
        if (index < 0 || index >= todos.length) {
            return res.status(404).send('Todo not found');
        }
        
        todos[index].deleted = false;
        
        fs.writeFile(DATA_FILE, JSON.stringify(todos), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }
            res.send('Todo restored');
        });
    });
});

// 编辑待办事项
app.put('/api/todos/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const newText = req.body.text;
    
    if (!newText) {
        return res.status(400).send('Todo text is required');
    }
    
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }
        
        const todos = JSON.parse(data);
        if (index < 0 || index >= todos.length) {
            return res.status(404).send('Todo not found');
        }
        
        todos[index].text = newText;
        
        fs.writeFile(DATA_FILE, JSON.stringify(todos), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }
            res.send('Todo updated');
        });
    });
});

// // 示例 1：将字符串转换为十进制整数
// const str1 = "123";
// const num1 = parseInt(str1);
// console.log(num1); // 输出: 123

// // 示例 2：指定基数为 16（十六进制）
// const str2 = "FF";
// const num2 = parseInt(str2, 16);
// console.log(num2); // 输出: 255

// // 示例 3：处理包含非数字字符的字符串，parseInt 会从左到右解析，直到遇到非数字字符
// const str3 = "12abc";
// const num3 = parseInt(str3);
// console.log(num3); // 输出: 12

// // 示例 4：当第一个字符无法转换为数字时，返回 NaN
// const str4 = "abc123";
// const num4 = parseInt(str4);
// console.log(num4); // 输出: NaN
   
// 我们需要从请求体中获取 completed 属性的值，是因为在更新待办事项完成状态的 API 中，
// 客户端会通过 PATCH 请求将待办事项的新完成状态发送到服务器。
// 服务器需要根据这个值来更新对应待办事项的 completed 字段，从而实现标记待办事项完成状态的功能。
// 例如，当用户在前端界面点击待办事项的复选框时，前端会发送一个 PATCH 请求，
// 并在请求体中包含 completed 属性，其值为 true 或 false，以此告知服务器该待办事项是否已完成。

    

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});