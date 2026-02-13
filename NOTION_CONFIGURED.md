# Notion 数据库已配置

数据库已通过API创建完成！

## 数据库信息

- **数据库名称**: Blog Posts
- **数据库ID**: `675a0225-7fce-488b-afa4-7b67c4628d13`
- **所属页面**: 林林多喝水
- **页面ID**: `305efcd8-f486-80b1-bcab-db4364efff70`

## 环境变量

已配置在 `.env.local` 文件中（已添加到.gitignore，不会提交到GitHub）：
```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=675a0225-7fce-488b-afa4-7b67c4628d13
```

## 数据库属性

已创建的属性包括：

### 必需属性
- **Title** (title) - 文章标题
- **Slug** (rich_text) - URL唯一标识符
- **Date** (date) - 发布日期
- **Published** (checkbox) - 是否发布

### 可选属性
- **Summary** (rich_text) - 文章摘要
- **Tags** (multi_select) - 文章标签
  - 设计、思考、技术、读书、观察、生活
- **Category** (select) - 文章分类
  - 关于、技艺、生活、乱翻书、看天下、图展
- **Updated** (date) - 最后更新日期
- **Status** (select) - 文章状态
  - 草稿、已发布、归档
- **Featured** (checkbox) - 是否精选
- **Reading Time** (number) - 预计阅读时间（分钟）
- **Cover Image** (url) - 封面图片链接

## 使用说明

### 在 Notion 中添加文章

1. 打开你的 Notion 工作区
2. 找到"林林多喝水"页面
3. 点击"Blog Posts"数据库
4. 点击"New"创建新页面
5. 填写属性：
   - Title: 文章标题
   - Slug: URL标识符（如 `ten-years`）
   - Date: 发布日期
   - Published: 勾选（发布）
   - 其他属性根据需要填写
6. 在页面中添加内容（支持各种 Notion block）

### 查看博客

开发服务器已配置好 Notion 连接，访问 http://localhost:3000 即可看到从 Notion 加载的文章。

### 重启服务器

如果修改了 `.env.local` 文件，需要重启开发服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## 示例文章数据

创建一篇文章：

**属性：**
- Title: "十年谢幕；苏打汽水～"
- Slug: "ten-years"
- Date: 2026-02-11
- Summary: "十年前的今天，我开始了一段旅程..."
- Tags: ["思考", "生活"]
- Category: "生活"
- Status: "已发布"
- Published: ✅
- Reading Time: 5

**页面内容：**
```
# 十年谢幕；苏打汽水～

这里是文章的开头段落...

## 小标题

这里是一些内容...

- 列表项1
- 列表项2

> 引用的内容

```js
const code = "code block";
```
```

## 故障排查

**看不到文章**

- 确认在 Notion 中已创建文章
- 确认 Published 已勾选
- 确认 Status 不是"归档"
- 重启开发服务器
- 检查浏览器控制台错误信息

**API 错误**

- 检查 `.env.local` 文件是否存在
- 确认 API Key 正确
- 确认 Database ID 正确
- 查看 Notion API 状态页面

**数据库属性缺失**

- 数据库已通过API创建，应该包含所有属性
- 如果发现属性缺失，可能需要手动在Notion中添加
- 或者在Notion UI中检查数据库结构
