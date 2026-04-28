# MeloVision

MeloVision 是一个基于 Next.js 的 AI MV 生成工作流应用，包含：

- 创意描述与草稿恢复
- Suno 音乐生成与试听
- 按歌词/音乐切段的分镜工作台
- 火山引擎图片与视频生成
- 生成进度、导出预览与下载

## 本地开发

### 1. 安装依赖

```bash
corepack enable
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填写真实值：

```bash
cp .env.example .env.local
```

必须关注的变量：

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `SUNO_API_KEY`
- `VOLCENGINE_ARK_API_KEY`

### 3. 初始化数据库

```bash
pnpm exec prisma migrate deploy
pnpm exec prisma generate
```

### 4. 启动项目

```bash
pnpm dev
```

默认地址：

- [http://localhost:3000](http://localhost:3000)

## 常用命令

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm exec prisma migrate status
pnpm exec prisma studio
```

## 环境变量说明

### 必填

- `DATABASE_URL`
  - 本地默认：`file:./dev.db`
  - Render 持久盘建议：`file:/var/data/dev.db`
- `NEXTAUTH_URL`
  - 本地：`http://localhost:3000`
  - Render：你的线上域名
- `SUNO_API_KEY`
- `VOLCENGINE_ARK_API_KEY`

### 可选

- `SUNO_API_BASE`
- `SUNO_CALLBACK_URL`
- `VOLCENGINE_ARK_BASE_URL`
- `VOLCENGINE_IMAGE_MODEL`
- `VOLCENGINE_CHAT_MODEL`
- `VOLCENGINE_VIDEO_MODEL`
- `VOLCENGINE_VIDEO_CALLBACK_URL`

## GitHub 上传前建议

确认以下文件不要提交：

- `.env.local`
- `dev.db`
- `dev.db-wal`
- `dev.db-shm`
- `.next`

当前仓库已经在 `.gitignore` 中补齐了 SQLite 本地文件忽略规则。

## Render 部署

仓库已补充 `render.yaml`，可以直接作为 Render Blueprint 使用。

### 推荐流程

1. 把项目推到 GitHub
2. 在 Render 中选择 `Blueprint`
3. 选择当前仓库
4. 填写 `render.yaml` 中标记为 `sync: false` 的环境变量
5. 创建持久盘，挂载到 `/var/data`

### 当前 Render 方案

- Web Service
- Node 20
- `pnpm` 构建
- SQLite 文件放在持久盘
- 启动时自动执行：

```bash
pnpm exec prisma migrate deploy && pnpm start
```

## 生产环境注意事项

### 1. SQLite 仅适合轻量生产

当前代码已经可以在 Render 上通过持久盘运行 SQLite，但如果后续用户量上来，建议切到 Postgres。

原因：

- SQLite 并发写能力有限
- Render 单实例还好，多实例不适合共享 SQLite
- 后续任务队列、生成状态同步会更依赖稳定数据库

### 2. 回调地址必须是公网可访问地址

以下服务依赖公网回调：

- Suno
- 火山视频生成

所以线上必须正确配置：

- `NEXTAUTH_URL`
- `SUNO_CALLBACK_URL` 或基于 `NEXTAUTH_URL` 的默认回调
- `VOLCENGINE_VIDEO_CALLBACK_URL` 或基于 `NEXTAUTH_URL` 的默认回调

### 3. 历史无声视频不会自动修复

代码现在已经改成新生成任务默认带音频，但旧任务产出的无声视频仍然需要重新生成。

## 已做的上线前优化

- `next.config.ts` 已开启 `standalone` 输出，适合 Render 部署
- 草稿项目支持按步骤恢复
- 音乐试听改为本地代理，避免前端直连不稳定地址
- 分镜预览会优先生成真实图，不再长期停留在占位图
- 导出预览从 `0:00` 开始，并挂载已选音乐轨

## 下一步建议

如果你准备正式上线，我建议优先继续做这几项：

- 把 SQLite 升级到 Postgres
- 给关键页面加服务端缓存策略与客户端预取
- 把内部 `<a>` 导航逐步替换为 `next/link`
- 增加 Sentry / Render Log Drain 等错误监控
- 为导出链路补真正的音视频混流，而不是只修页面预览
