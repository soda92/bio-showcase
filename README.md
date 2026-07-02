# Bio-Showcase (生物信息学工具展示平台)

这是一个集成了生物信息学实用工具与投票功能的 Web 平台。项目采用前后端分离的 Monorepo（单体仓库）架构：
*   **后端**：基于 Python Django 和 Django REST Framework，提供引物设计算法和数据服务接口。
*   **前端**：基于现代高性能 TypeScript 框架 **Deno Fresh**，实现无客户端 JS 负载的高效动态交互界面。

---

## 主要功能

1.  **PCR 引物设计 (PCR Primer Design)**
    *   后端集成 `primer3-py` 科学计算库。
    *   支持用户输入 DNA 序列、设定起始位置与终止位置。
    *   在前端直观展示筛选优化后的左引物 (Left Primers)、右引物 (Right Primers) 以及内插物 (Internal Primers) 序列及其 GC 含量。
2.  **投票系统 (Django Polls)**
    *   经典的问答投票服务，提供直观的投票与统计功能。
    *   提供完整的 REST APIs，支持获取问题列表、新增选项及投票操作。

---

## 目录结构说明

```
bio-showcase/
├── bio_showcase/           # Django 项目全局配置 (settings.py, urls.py 等)
├── bio_primer/             # PCR 引物设计后端 App 模块 (包含 primer3-py 计算逻辑)
├── bio_polls/              # 投票系统后端 App 模块 (含 Django REST Framework 接口)
├── frontend/               # Deno Fresh 前端工程目录
│   ├── routes/             # 前端路由页面 (首页、引物设计页、投票页)
│   ├── islands/            # Preact 客户端交互岛组件 (如 PrimerDesign.tsx)
│   ├── components/         # 页面公共静态组件 (Header, Button, Card 等)
│   └── counter_test.tsx    # 前端单元测试
└── .github/workflows/      # 自动化 CI/CD 部署脚本 (Deno Deploy & Firebase & Server)
```

---

## 本地开发指南

### 环境准备
*   **Python** >= 3.11
*   **Deno** >= 2.0
*   **uv** (推荐，Python 依赖管理工具)

### 1. 启动后端 API 服务
```bash
# 同步并安装依赖
uv sync

# 运行数据库迁移
python manage.py migrate

# 启动 Django 本地开发服务（运行在 9000 端口）
python manage.py runserver 9000
```
后端服务启动后，可以通过访问 `http://127.0.0.1:9000/admin/` 进行后台管理。

### 2. 启动前端 UI 服务
```bash
cd frontend

# 启动 Fresh 开发服务器 (包含热重载)
deno task dev
```
前端开发服务启动后，通过浏览器访问 `http://localhost:8000` 即可使用系统。

---

## 运行自动化测试

本项目配有完整的单元测试和集成测试，确保前后端功能稳定。

### 运行后端测试
在根目录下执行：
```bash
uv run python manage.py test
```

### 运行前端测试
在 `frontend` 目录下执行：
```bash
cd frontend
deno test
```

---

## 持续集成与部署 (CI/CD)

项目在 `.github/workflows/` 中配置了三个自动化部署流程：
1.  **Deno Deploy (前端部署)**:
    *   配置文件：`.github/workflows/deploy-frontend.yml`
    *   触发时机：当代码推送到 `main` 分支或提交 PR 时。
    *   功能：自动构建前端并部署至 Deno Deploy 平台。
2.  **Firebase Hosting (静态资源托管)**:
    *   配置文件：`.github/workflows/firebase-hosting-*.yml`
    *   功能：收集 Django 静态文件并发布至 Firebase 托管。
3.  **云服务器部署 (Django 后端部署)**:
    *   配置文件：`.github/workflows/release-and-deploy.yml`
    *   功能：当发布新 Tag 时，自动通过 SSH 登录目标服务器拉取最新代码、更新依赖、执行迁移并重启服务。
