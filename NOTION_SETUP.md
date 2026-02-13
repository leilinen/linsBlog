# Notion 数据库配置指南

本文档说明如何配置Notion作为博客数据库。

## 步骤 1: 创建 Notion Integration

1. 访问 https://www.notion.so/my-integrations
2. 点击 "+ New integration"
3. 填写信息：
   - Name: `linsBlog` (或其他名称)
   - Associated workspace: 选择你的工作区
   - Type: Internal
4. 点击 "Submit"
5. 复制生成的 "Internal Integration Token"（以 `secret_` 开头）

## 步骤 2: 创建 Notion Database

1. 在你的 Notion 工作区创建一个新的 Database
2. 设置以下属性：

   | 属性名称 | 类型 | 说明 |
   |---------|------|------|
   | Title | Title | 文章标题 |
   | Slug | Text | URL友好的唯一标识符（如 `ten-years`） |
   | Date | Date | 发布日期 |
   | Published | Checkbox | 是否发布（可选） |

3. 在Database中创建页面并填写内容

## 步骤 3: 连接 Integration 到 Database

1. 打开你的 Database 页面
2. 点击右上角 "..."
3. 选择 "Add connections"
4. 搜索并选择你的 integration (如 `linsBlog`)
5. 确认连接

## 步骤 4: 获取 Database ID

1. 打开你的 Database 页面
2. 查看 URL，格式类似：
   ```
   https://www.notion.so/your-workspace/数据库ID?v=xxx
   ```
3. 复制 `数据库ID` 部分（32个字符）

## 步骤 5: 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NOTION_API_KEY=secret_xxx...
NOTION_DATABASE_ID=xxx...
```

将步骤1和4获取的值填入。

## 步骤 6: 测试

重启开发服务器：

```bash
npm run dev
```

访问 http://localhost:3000，应该能看到从Notion加载的文章列表。

## 数据结构示例

在 Notion Database 中创建一篇文章：

- **Title**: `十年谢幕；苏打汽水～`
- **Slug**: `ten-years`
- **Date**: `2026-02-11`
- **Published**: ✅

页面内容可以使用各种 Notion block：
- 标题（H1, H2, H3）
- 段落
- 列表（有序/无序）
- 引用
- 代码块
- 分隔线

## 故障排查

**问题：看不到文章列表**

- 检查 `.env.local` 文件是否正确配置
- 确认 Integration 已连接到 Database
- 检查数据库中是否有文章
- 查看浏览器控制台错误信息

**问题：页面内容显示不完整**

- 确认 Notion 页面有公开权限
- 检查页面 block 是否包含不支持的类型

**问题：API 错误**

- 检查 API Token 是否有效
- 确认 Database ID 正确
- 查看服务器日志
