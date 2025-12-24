# 部署配置指南

## 环境变量配置

### 前端配置 (tsmainite-website)

前端需要配置后端 API 地址，以便在不同部署环境下能正确连接后端。

#### 配置步骤

1. **进入前端目录**
```bash
cd tsmainite-website
```

2. **创建或编辑 `.env.local` 文件**
```bash
cp .env.example .env.local
```

3. **编辑 `.env.local`，修改 BACKEND_API_URL**

#### 配置示例

**情况 1：本地开发（localhost）**
```env
BACKEND_API_URL=http://localhost:3001
```
- 使用场景：在本机上开发
- 访问地址：`http://localhost:3000`

**情况 2：内网部署（通过内网 IP 访问）**
```env
BACKEND_API_URL=http://192.168.0.136:3001
```
- 替换 `192.168.0.136` 为你的服务器内网 IP
- 使用场景：办公室内网、局域网
- 访问地址：`http://192.168.0.136:3000`

**情况 3：公网部署（通过域名访问）**
```env
BACKEND_API_URL=https://api.yourdomain.com
```
- 替换 `yourdomain.com` 为你的域名
- 使用场景：互联网部署
- 访问地址：`https://yourdomain.com`

**情况 4：云服务器部署**
```env
BACKEND_API_URL=http://203.0.113.45:3001
```
- 替换 `203.0.113.45` 为云服务器公网 IP
- 使用场景：AWS、阿里云、腾讯云等
- 访问地址：`http://203.0.113.45:3000`

---

## 后端配置 (backend)

### 数据库配置

编辑 `backend/.env` 文件：

```env
DATABASE_URL="file:./prisma/dev.db"  # SQLite 本地数据库
# 或
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"  # PostgreSQL
```

### 端口配置

编辑 `backend/.env` 文件：

```env
PORT=3001  # 后端服务端口
```

### 秘钥配置（生产环境）

```env
SECRET_KEY="change-this-in-production"  # 修改为强密钥
NODE_ENV=production  # 生产环境标识
```

---

## 常见部署场景

### 场景 1：单机部署（同一台电脑）

**前端配置** (tsmainite-website/.env.local)
```env
BACKEND_API_URL=http://localhost:3001
```

**启动命令**
```bash
# 终端 1 - 启动后端
cd backend
npm run dev

# 终端 2 - 启动前端
cd tsmainite-website
npm run dev
```

**访问地址**：`http://localhost:3000`

---

### 场景 2：内网分离部署（不同机器）

**假设：**
- 后端服务器：`192.168.0.100`
- 前端访问 IP：`192.168.0.136`

**前端配置** (tsmainite-website/.env.local)
```env
BACKEND_API_URL=http://192.168.0.100:3001
```

**后端启动** (在 192.168.0.100 上)
```bash
cd backend
npm run dev
```

**前端启动** (在 192.168.0.136 上)
```bash
cd tsmainite-website
npm run dev
```

**访问地址**：`http://192.168.0.136:3000`

---

### 场景 3：生产环境部署（使用 Vercel + 自建后端）

**前端配置** (tsmainite-website/.env.local)
```env
BACKEND_API_URL=https://api.yourdomain.com
```

**部署流程**
1. 后端部署到云服务器（如阿里云、腾讯云）
2. 配置 Nginx 反向代理（可选）
3. 部署前端到 Vercel
4. 在 Vercel 环境变量中设置 `BACKEND_API_URL`

---

## 常见问题

### Q: 为什么改了 .env.local 后仍然不生效？
A: **必须重启 Next.js 服务器**。环境变量在服务器启动时读取，修改后需要完全重新启动（Ctrl+C 停止，然后 `npm run dev` 重启）。

### Q: 怎么验证配置是否正确？
A: 打开浏览器控制台（F12），查看网络请求。如果图片请求地址是 `http://192.168.0.136:3001/uploads/...`，说明配置正确。

### Q: 如果从外部网络无法访问怎么办？
A: 检查以下几点：
1. 防火墙是否开放了 3000 和 3001 端口？
2. 是否使用了正确的 IP 地址？
3. 后端服务是否正常运行？
4. 运行 `curl http://IP:3001/api/health` 测试后端连接

### Q: 生产环境如何安全地配置敏感信息？
A: 
- 不要在代码中硬编码敏感信息
- 使用环境变量或密钥管理服务
- 生产环境使用 HTTPS
- 定期更换 SECRET_KEY

---

## 配置模板总结

| 部署方式 | 前端地址 | 后端配置 | .env.local |
|---------|---------|--------|-----------|
| 本地开发 | localhost:3000 | localhost:3001 | `http://localhost:3001` |
| 内网部署 | 192.168.0.x:3000 | 192.168.0.y:3001 | `http://192.168.0.y:3001` |
| 公网部署 | yourdomain.com | yourdomain.com | `https://api.yourdomain.com` |
| 云服务器 | 云IP:3000 | 云IP:3001 | `http://云IP:3001` |

---

**提示**：根据你的实际部署环境，选择对应的配置方案并修改相应的 IP 地址或域名。
