# Todo List 项目

## 项目介绍
一个简单的待办事项管理应用，包含前端界面和后端API服务。

## 功能特性
- 添加新待办事项
- 标记待办事项完成状态
- 删除待办事项(软删除)
- 显示/隐藏已删除项目
- 还原已删除的待办事项【未完成】
- 实时更新待办事项列表

## 技术栈
- 前端: HTML/CSS/JavaScript
- 后端: Node.js + Express
- 数据存储: JSON文件

## API接口说明

### 获取所有待办事项
`GET /api/todos`

### 添加新待办事项
`POST /api/todos`
请求体: `{ "todo": "待办事项内容" }`

### 删除待办事项
`DELETE /api/todos/:index`

### 还原待办事项
`PATCH /api/todos/:index/restore`

### 更新待办事项状态
`PATCH /api/todos/:index`
请求体: `{ "completed": true/false }`

## 安装运行
1. 安装依赖: `npm install`
2. 启动服务: `node server.js`
3. 访问: `http://localhost:3000`

## 项目结构
- `app.js` - 前端逻辑
- `server.js` - 后端服务
- `todos.json` - 数据存储
- `index.html` - 前端界面
- `style.css` - 样式表

## 注意事项
- 确保Node.js已安装
- 运行前先安装依赖: `npm install`

## 改进建议
- 使用数据库存储待办事项【本项目使用JSON文件存储，并且每次操作都是全部读取文件，仅用作项目学习，但实际应用时，会因为文件过大导致处理时间较长。】
- 添加用户认证和权限控制
- 优化前端性能
- 增加更多功能，如编辑待办事项