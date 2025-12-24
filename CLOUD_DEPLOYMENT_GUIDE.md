# 云服务器生产环境部署指南

## 概述

本指南涵盖在云服务器上部署 tsmainite 企业网站系统的完整流程，包括：
- 云服务器选择和配置
- 域名配置与 DNS 解析
- SSL/TLS 证书配置
- 生产环境部署
- 监控和维护

---

## 📊 云服务器选择对比

| 服务商 | 价格 | 易用性 | 性能 | 适用场景 |
|------|------|------|------|--------|
| **阿里云 ECS** | 💰 便宜 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 国内用户 |
| **腾讯云 CVM** | 💰 便宜 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 国内用户 |
| **AWS EC2** | 💰 免费层 | ⭐⭐ | ⭐⭐⭐⭐⭐ | 国际用户 |
| **DigitalOcean** | 💰 中等 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 开发者友好 |
| **Vercel** (前端) | 💰 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 前端专用 |
| **Railway** | 💰 便宜 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 简单部署 |

**推荐组合：**
- **最简单：** Vercel (前端) + Railway (后端)
- **最便宜：** 阿里云/腾讯云 (两个应用)
- **最专业：** AWS (完整控制)

---

## 🛠️ 方案 1：完整云服务器部署（推荐新手）

### 使用 Vercel + Railway

**优点：**
- 无需配置服务器
- 自动 HTTPS
- 自动扩展
- 免费层充足

#### 前端部署到 Vercel

1. **推送到 GitHub**（已完成）

2. **访问 Vercel**
```
https://vercel.com
```

3. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择 GitHub 仓库 `tsmnt`
   - Root Directory: `tsmainite-website`

4. **配置环境变量**
   - 找到 Environment Variables 部分
   - 添加：`BACKEND_API_URL=https://api.yourdomain.com`

5. **部署**
   - 点击 Deploy
   - 等待完成
   - 获得默认域名：`tsmainite-website.vercel.app`

#### 后端部署到 Railway

1. **访问 Railway**
```
https://railway.app
```

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub"
   - 选择 `tsmnt` 仓库

3. **配置**
   - Root Directory: `backend`
   - 设置环境变量：
     ```
     DATABASE_URL=file:./prisma/dev.db
     PORT=3001
     NODE_ENV=production
     ```

4. **获取域名**
   - Railway 会自动分配 `xxx.railway.app`
   - 或绑定自己的域名

#### 域名配置（使用自己的域名）

假设你已有域名 `yourdomain.com`：

1. **Vercel 前端**
   - Settings → Domains
   - 添加 `www.yourdomain.com`
   - 按照 CNAME 指向 Vercel

2. **Railway 后端**
   - Project Settings → Domain
   - 添加 `api.yourdomain.com`
   - 配置 CNAME 指向 Railway

3. **DNS 配置**（在域名提供商处）
   ```
   Record Type: CNAME
   Name: www
   Value: yourdomain.vercel.app
   
   Record Type: CNAME
   Name: api
   Value: (Railway 提供的地址)
   ```

4. **等待 DNS 生效**（15分钟-48小时）

---

## 🛠️ 方案 2：单台云服务器部署

使用阿里云/腾讯云/DigitalOcean 等单台服务器部署前后端。

### 前提条件

- 云服务器 (Ubuntu 20.04 LTS 或更新)
- 域名一个
- SSH 访问

### 基本设置

#### 1. 购买云服务器

**推荐配置：**
- CPU: 2核
- 内存: 2GB
- 带宽: 1Mbps
- 系统: Ubuntu 20.04 LTS

#### 2. 购买域名

选择域名注册商：
- 阿里云
- 腾讯云
- GoDaddy
- Namecheap

#### 3. 配置安全组/防火墙

打开以下端口：
```
Port 22   - SSH
Port 80   - HTTP
Port 443  - HTTPS
Port 3000 - 前端（可选）
Port 3001 - 后端（不暴露）
```

### 部署步骤

#### 步骤 1：连接到服务器

```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

#### 步骤 2：安装环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 npm 依赖管理器
sudo apt install -y npm

# 安装 Git
sudo apt install -y git

# 安装 Nginx（反向代理）
sudo apt install -y nginx

# 安装 Certbot（SSL 证书）
sudo apt install -y certbot python3-certbot-nginx
```

#### 步骤 3：克隆项目

```bash
cd /opt
sudo git clone https://github.com/airgfa1-maker/tsmnt.git
cd tsmnt
sudo chown -R ubuntu:ubuntu .
```

#### 步骤 4：部署后端

```bash
cd backend

# 安装依赖
npm install

# 初始化数据库
npx prisma migrate deploy

# 创建管理员用户
npx ts-node src/create-admin.ts

# 构建
npm run build

# 使用 PM2 管理后端进程
sudo npm install -g pm2
pm2 start npm --name "backend" -- start
pm2 save
```

#### 步骤 5：部署前端

```bash
cd ../tsmainite-website

# 创建环境变量
cat > .env.production << EOF
BACKEND_API_URL=https://api.yourdomain.com
EOF

# 安装依赖
npm install

# 构建
npm run build

# 使用 PM2 管理前端进程
pm2 start npm --name "frontend" -- start
pm2 save
```

#### 步骤 6：配置 Nginx 反向代理

创建 `/etc/nginx/sites-available/yourdomain.com`：

```nginx
# 前端
upstream frontend {
    server 127.0.0.1:3000;
}

# 后端
upstream backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL 证书（使用 Certbot 自动生成）
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # 前端
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    # 后端
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 步骤 7：配置 SSL 证书

```bash
# 获取 SSL 证书（自动配置 Nginx）
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# 自动更新证书（每月检查一次）
sudo systemctl enable certbot.timer
```

#### 步骤 8：配置 DNS

在域名注册商处：

```
A 记录：
  Name: @
  Value: 你的云服务器公网 IP

A 记录：
  Name: www
  Value: 你的云服务器公网 IP

A 记录：
  Name: api
  Value: 你的云服务器公网 IP
```

等待 DNS 生效（15分钟-48小时）

### 验证部署

```bash
# 检查进程
pm2 list

# 查看日志
pm2 logs backend
pm2 logs frontend

# 测试后端
curl https://api.yourdomain.com/api/health

# 测试前端
curl https://yourdomain.com
```

---

## 🛠️ 方案 3：Docker 容器化部署

使用 Docker 和 Docker Compose 简化部署。

### 创建 Dockerfile

**后端** (`backend/Dockerfile`)：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
```

**前端** (`tsmainite-website/Dockerfile`)：
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ARG BACKEND_API_URL=http://localhost:3001
ENV BACKEND_API_URL=$BACKEND_API_URL

RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: file:./prisma/dev.db
      NODE_ENV: production
      PORT: 3001
    volumes:
      - ./backend/prisma:/app/prisma
      - ./backend/uploads:/app/uploads
    restart: always

  frontend:
    build:
      context: ./tsmainite-website
      args:
        BACKEND_API_URL: https://api.yourdomain.com
    ports:
      - "3000:3000"
    environment:
      BACKEND_API_URL: https://api.yourdomain.com
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: always
```

部署：
```bash
docker-compose up -d
```

---

## 📋 环境变量参考

### 前端 (.env.production)

```env
# 后端 API 地址（必须配置）
BACKEND_API_URL=https://api.yourdomain.com

# 可选：Google Analytics
NEXT_PUBLIC_GA_ID=

# 可选：其他第三方服务
```

### 后端 (.env.production)

```env
# 数据库
DATABASE_URL="file:./prisma/prod.db"

# 服务配置
PORT=3001
NODE_ENV=production

# 安全配置
SECRET_KEY=your-very-long-random-secret-key-min-32-chars

# Baidu Map API（如果使用）
BAIDU_MAP_AK=your_baidu_map_ak

# CORS 配置（可选）
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🔒 生产环境安全建议

### 1. 密钥管理

```bash
# 生成强密钥
openssl rand -base64 32
```

### 2. 数据库备份

```bash
# 定时备份脚本
#!/bin/bash
BACKUP_DIR="/backups/db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp /opt/tsmnt/backend/prisma/prod.db $BACKUP_DIR/prod_$TIMESTAMP.db
# 保留最近 30 天的备份
find $BACKUP_DIR -mtime +30 -delete
```

### 3. 日志管理

```bash
# 定时轮转日志
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
```

### 4. 监控告警

```bash
# 安装监控工具
pm2 install pm2-auto-pull
pm2 install pm2-shield

# 启用监控
pm2 monitor
```

---

## 📊 域名解析示例

假设域名 `example.com`，云服务器 IP 为 `1.2.3.4`：

### DNS 记录配置

| 记录类型 | 名称 | 值 | 说明 |
|---------|-----|-----|-----|
| A | @ | 1.2.3.4 | 根域名指向服务器 |
| A | www | 1.2.3.4 | www 子域指向服务器 |
| A | api | 1.2.3.4 | API 子域指向服务器 |
| MX | @ | mail.example.com | 邮件服务器（可选） |
| TXT | @ | v=spf1 mx ~all | SPF 记录（防欺骗） |

### 等待生效

DNS 生效时间：
- 通常：15-60 分钟
- 最长：48 小时

查询状态：
```bash
nslookup yourdomain.com
dig yourdomain.com
```

---

## 🚀 一键部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 开始部署 tsmainite...${NC}"

# 更新代码
echo -e "${BLUE}更新代码...${NC}"
cd /opt/tsmnt
sudo git pull origin master

# 更新后端
echo -e "${BLUE}更新后端...${NC}"
cd backend
npm install
npx prisma migrate deploy
npm run build
pm2 restart backend

# 更新前端
echo -e "${BLUE}更新前端...${NC}"
cd ../tsmainite-website
npm install
npm run build
pm2 restart frontend

echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}前端: https://yourdomain.com${NC}"
echo -e "${GREEN}后端: https://api.yourdomain.com${NC}"
```

使用：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔧 常见问题

### Q: 如何更新代码？
A: 推送到 GitHub → 在服务器运行 `git pull` → 重启 PM2 进程

### Q: SSL 证书过期了怎么办？
A: Certbot 自动更新，但可以手动更新：
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

### Q: 如何回滚版本？
A: 使用 Git tags：
```bash
git tag v1.0.0
git push origin v1.0.0
git checkout v1.0.0
npm run build && pm2 restart all
```

### Q: 如何扩展流量？
A: 
1. 升级服务器配置
2. 配置 CDN（如阿里云 CDN）
3. 使用负载均衡

---

## 📚 参考资源

- [Node.js 官方文档](https://nodejs.org/)
- [Nginx 官方文档](https://nginx.org/)
- [Let's Encrypt（免费 SSL）](https://letsencrypt.org/)
- [PM2 官方文档](https://pm2.keymetrics.io/)
- [Docker 官方文档](https://docs.docker.com/)

---

**祝部署顺利！** 🎉
