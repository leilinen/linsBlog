# Notion 数据库配置指南

本文档说明如何配置Notion作为博客数据库。

## 数据库设计

### 必需属性

| 属性名称 | 类型 | 说明 | 示例 |
|---------|------|------|------|
| **Title** | Title | 文章标题 | "十年谢幕；苏打汽水～" |
| **Slug** | Text | URL唯一标识符 | "ten-years" |
| **Date** | Date | 发布日期 | 2026-02-11 |
| **Published** | Checkbox | 是否发布 | ✅ |

### 可选属性（推荐）

| 属性名称 | 类型 | 说明 | 示例 |
|---------|------|------|------|
| **Summary** | Text | 文章摘要 | "这篇文章讨论了..." |
| **Tags** | Multi-select | 文章标签 | ["设计", "思考"] |
| **Category** | Select | 文章分类 | "技艺" |
| **Updated** | Date | 最后更新日期 | 2026-02-12 |
| **Status** | Select | 文章状态 | "已发布" / "草稿" / "归档" |
| **Featured** | Checkbox | 是否精选 | ✅ |
| **Reading Time** | Number | 预计阅读时间（分钟） | 5 |
| **Cover Image** | URL | 封面图片链接 | https://... |

### 状态选项（Status属性）

- **草稿** - 正在编辑，未完成
- **已发布** - 正式发布
- **归档** - 已归档的历史文章

### 分类选项（Category属性）

根据博客导航菜单：
- **关于**
- **技艺**
- **生活**
- **乱翻书**
- **看天下**
- **图展**

### 标签选项（Tags属性）

一些常用标签：
- **设计** - 设计相关内容
- **思考** - 思考和感悟
- **技术** - 技术相关
- **读书** - 读书笔记
- **观察** - 观察世界
- **生活** - 生活记录

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
2. 按照上述表格添加属性
3. 设置默认视图和排序

### 推荐视图设置

**主视图（All Posts）:**
- 排序：Date (降序)
- 筛选：Published = ✅, Status ≠ 归档
- 展示：Title, Date, Category, Tags

**草稿视图:**
- 排序：Updated (降序)
- 筛选：Published = ❌ 或 Status = 草稿

**分类视图:**
- 按Category分组

4. 在Database中创建页面并填写内容

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

## 数据内容示例

创建一篇完整的文章：

### 属性
- **Title**: "十年谢幕；苏打汽水～"
- **Slug**: "ten-years"
- **Date**: 2026-02-11
- **Summary**: "十年前的今天，我开始了一段旅程..."
- **Tags**: ["思考", "生活"]
- **Category**: "生活"
- **Status**: "已发布"
- **Published**: ✅
- **Reading Time**: 5

### 页面内容
可以使用各种 Notion block：

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

## 最佳实践

### 1. Slug 命名规范

- 使用小写字母
- 使用连字符（-）分隔单词
- 使用英文，避免中文
- 保持简洁有描述性

**示例：**
- ✅ `ten-years`
- ✅ `design-thinking`
- ✅ `minimalism-web`
- ❌ `十年谢幕` (包含中文)
- ❌ `Ten_Years` (大写和下划线)

### 2. 分类使用

根据文章内容选择合适的分类：
- 技术和设计类 → 技艺
- 日常生活记录 → 生活
- 读书笔记 → 乱翻书
- 观察和评论 → 看天下
- 图片作品 → 图展
- 个人介绍 → 关于

### 3. 标签使用

标签比分类更灵活，一篇文章可以有多个标签：
- 用于细分内容
- 用于主题归类
- 用于快速筛选

### 4. 文章状态管理

- 写作时：Status = 草稿, Published = ❌
- 完成后：Status = 已发布, Published = ✅
- 过期内容：Status = 归档, Published = ❌

### 5. 定期更新

- 每次更新文章后，更新 Updated 字段
- 重新计算 Reading Time
- 更新 Summary（如果内容变化较大）

## 步骤 6: 测试

重启开发服务器：

```bash
npm run dev
```

访问 http://localhost:3000，应该能看到从Notion加载的文章列表。

## 故障排查

**问题：看不到文章列表**

- 检查 `.env.local` 文件是否正确配置
- 确认 Integration 已连接到 Database
- 检查数据库中是否有 Published = ✅ 的文章
- 查看浏览器控制台错误信息

**问题：页面内容显示不完整**

- 确认 Notion 页面有公开权限
- 检查页面 block 是否包含不支持的类型
- 查看服务器日志

**问题：API 错误**

- 检查 API Token 是否有效（未过期）
- 确认 Database ID 正确
- 检查 Integration 权限
- 查看 Notion API 状态页面

**问题：Slug 冲突**

- 每篇文章的 Slug 必须唯一
- 使用日期或随机字符串确保唯一性
- 示例：`ten-years-2024`, `design-thinking-001`
