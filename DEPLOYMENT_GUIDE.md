# Linux 服务器部署指导（Ubuntu 20.04 LTS）

## 一、前置准备

### 1. 更新系统包
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. 安装必要工具
```bash
sudo apt install -y curl wget git build-essential
```

---

## 二、安装 Node.js 20.x（必须）

> 重要：Next.js 16 要求 Node.js 20.x 及以上

### 方式 1：使用 NodeSource 官方源（推荐）
```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 安装 Node.js 和 npm
sudo apt install -y nodejs

# 验证安装
node --version  # 应显示 v20.x.x
npm --version   # 应显示 10.x.x
```

### 方式 2：使用 NVM（Node Version Manager）
```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载 shell
source ~/.bashrc

# 安装 Node.js 20
nvm install 20
nvm use 20

# 验证
node --version
```

---

## 三、安装并配置 Git

```bash
sudo apt install -y git

# 配置 Git（可选，用于提交时显示正确的用户信息）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 生成 SSH key（如需通过 SSH 克隆项目）
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
cat ~/.ssh/id_rsa.pub  # 复制到 GitHub SSH 设置
```

---

## 四、克隆项目到服务器

```bash
# 创建项目目录
sudo mkdir -p /opt/tsmnt
sudo chown $USER:$USER /opt/tsmnt
cd /opt/tsmnt

# 克隆项目（使用 HTTPS）
git clone https://github.com/airgfa1-maker/tsmnt.git .

# 或使用 SSH（需配置 SSH key）
git clone git@github.com:airgfa1-maker/tsmnt.git .
```

---

## 五、部署后端（Express + Prisma）

### 1. 进入后端目录
```bash
cd /opt/tsmnt/backend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 编译 TypeScript
```bash
npm run build
```

### 4. 初始化数据库
```bash
# 运行 Prisma 迁移
npx prisma migrate deploy

# 或者重置数据库并添加初始数据
npm run db:init
```

### 5. 启动后端（使用 PM2）
```bash
# 全局安装 PM2
sudo npm install -g pm2

# 启动后端服务
pm2 start "npm start" --name "backend" --cwd /opt/tsmnt/backend

# 设置 PM2 开机自启
pm2 startup
pm2 save
```

### 6. 验证后端运行
```bash
# 检查 PM2 进程
pm2 list

# 查看日志
pm2 logs backend

# 测试 API
curl http://localhost:3001/api/products
```

---

## 六、部署前端（Next.js）

### 1. 进入前端目录
```bash
cd /opt/tsmnt/tsmainite-website
```

### 2. 安装依赖
```bash
npm install
```

### 3. 构建前端
```bash
npm run build
```

### 4. 启动前端（使用 PM2）
```bash
pm2 start "npm start" --name "frontend" --cwd /opt/tsmnt/tsmainite-website

# 设置开机自启
pm2 save
```

### 5. 验证前端运行
```bash
# 检查进程
pm2 list

# 查看日志
pm2 logs frontend

# 测试前端
curl http://localhost:3000
```

---

## 七、安装和配置 Nginx（反向代理）

### 1. 安装 Nginx
```bash
sudo apt install -y nginx
```

### 2. 编辑 Nginx 配置
```bash
sudo nano /etc/nginx/sites-available/default
```

### 3. 替换配置内容
```nginx
# 删除原有内容，替换为：

upstream frontend {
    server localhost:3000;
}

upstream backend {
    server localhost:3001;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    # 前端请求
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API 和上传文件请求
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 4. 测试 Nginx 配置
```bash
sudo nginx -t
```

### 5. 启动并启用 Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx

# 查看状态
sudo systemctl status nginx
```

---

## 八、配置环境变量

### 后端环境变量
```bash
# 编辑后端 .env 文件
nano /opt/tsmnt/backend/.env
```

**必要配置：**
```
DATABASE_URL="file:./dev.db"
NODE_ENV="production"
PORT=3001
```

### 前端环境变量
```bash
# 编辑前端 .env.local 文件
nano /opt/tsmnt/tsmainite-website/.env.local
```

**必要配置：**
```
NEXT_PUBLIC_API_URL=http://121.36.225.66:3001
# 或者使用域名
NEXT_PUBLIC_API_URL=http://your-domain.com
```

---

## 九、验证部署

### 1. 检查所有服务运行状态
```bash
# 检查 PM2 进程
pm2 list

# 预期输出：
# frontend     │ running │ 0
# backend      │ running │ 0
```

### 2. 测试 API 连接
```bash
# 测试后端 API
curl http://localhost:3001/api/products

# 测试前端
curl http://localhost:3000
```

### 3. 从浏览器访问
- 前端：`http://121.36.225.66` 或 `http://your-ip`
- 后端 API：`http://121.36.225.66:3001/api/products`

### 4. 检查日志
```bash
# 后端日志
pm2 logs backend

# 前端日志
pm2 logs frontend

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 十、常见操作命令

### PM2 常用命令
```bash
# 查看所有进程
pm2 list

# 查看特定进程日志
pm2 logs backend
pm2 logs frontend

# 重启进程
pm2 restart backend
pm2 restart frontend
pm2 restart all

# 停止进程
pm2 stop backend
pm2 stop frontend

# 删除进程
pm2 delete backend
pm2 delete frontend

# 保存 PM2 配置
pm2 save

# 清除 PM2 缓存
pm2 flush
```

### 更新项目代码
```bash
cd /opt/tsmnt

# 拉取最新代码
git pull origin master

# 更新后端
cd backend
npm install
npm run build
pm2 restart backend

# 更新前端
cd ../tsmainite-website
npm install
npm run build
pm2 restart frontend
```

### Nginx 操作
```bash
# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看日志
sudo tail -f /var/log/nginx/error.log
```

---

## 十一、故障排查

### 后端无法启动
```bash
# 检查端口占用
sudo netstat -tlnp | grep 3001

# 查看错误日志
pm2 logs backend

# 检查数据库文件
ls -la /opt/tsmnt/backend/dev.db
```

### 前端无法访问
```bash
# 检查前端进程
pm2 list | grep frontend

# 查看前端日志
pm2 logs frontend

# 检查 3000 端口
sudo netstat -tlnp | grep 3000
```

### Nginx 无法反向代理
```bash
# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 确保后端和前端都在运行
pm2 list
```

### 数据库连接错误
```bash
# 重置数据库
cd /opt/tsmnt/backend
npx prisma migrate reset

# 或运行初始化脚本
npm run db:init
```

---

## 十二、快速部署脚本（一键部署）

创建文件 `/opt/tsmnt/deploy.sh`：

```bash
#!/bin/bash

echo "=== 开始部署 ==="

# 进入项目目录
cd /opt/tsmnt

# 拉取最新代码
echo "1. 更新代码..."
git pull origin master

# 部署后端
echo "2. 部署后端..."
cd backend
npm install
npm run build
pm2 restart backend || pm2 start "npm start" --name "backend" --cwd /opt/tsmnt/backend

# 部署前端
echo "3. 部署前端..."
cd ../tsmainite-website
npm install
npm run build
pm2 restart frontend || pm2 start "npm start" --name "frontend" --cwd /opt/tsmnt/tsmainite-website

# 重启 Nginx
echo "4. 重启 Nginx..."
sudo systemctl restart nginx

echo "=== 部署完成 ==="
pm2 list
```

使用脚本：
```bash
chmod +x /opt/tsmnt/deploy.sh
/opt/tsmnt/deploy.sh
```

---

## 总结

| 步骤 | 命令 | 验证 |
|------|------|------|
| 安装 Node.js | `sudo apt install nodejs` | `node -v` |
| 克隆项目 | `git clone https://...` | `ls /opt/tsmnt` |
| 后端部署 | `npm install && npm run build` | `pm2 list` |
| 前端部署 | `npm install && npm run build` | `curl localhost:3000` |
| Nginx 配置 | 编辑 `/etc/nginx/sites-available/default` | `sudo nginx -t` |
| 启动服务 | `pm2 start ...` `systemctl start nginx` | `pm2 list` |
| 访问网站 | 浏览器打开 IP 地址 | 显示网站 ✅ |

---

## 需要帮助？

- 检查日志：`pm2 logs` 或 `sudo tail -f /var/log/nginx/error.log`
- 重启服务：`pm2 restart all && sudo systemctl restart nginx`
- 查看进程：`pm2 list && sudo netstat -tlnp`
