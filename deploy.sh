#!/bin/bash

# tsmainite 云服务器部署脚本
# 用法: chmod +x deploy.sh && ./deploy.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印消息函数
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖..."
    
    for cmd in git node npm pm2; do
        if ! command -v $cmd &> /dev/null; then
            print_error "$cmd 未安装"
            return 1
        fi
    done
    
    print_success "所有依赖已安装"
}

# 更新代码
update_code() {
    print_info "更新源代码..."
    cd /opt/tsmnt
    git pull origin master
    print_success "源代码已更新"
}

# 部署后端
deploy_backend() {
    print_info "部署后端..."
    cd /opt/tsmnt/backend
    
    # 安装依赖
    print_info "安装后端依赖..."
    npm install --production
    
    # 数据库迁移
    print_info "执行数据库迁移..."
    npx prisma migrate deploy
    
    # 构建
    print_info "构建后端..."
    npm run build
    
    # 重启进程
    print_info "重启后端服务..."
    pm2 restart backend || pm2 start npm --name "backend" -- start
    
    print_success "后端部署完成"
}

# 部署前端
deploy_frontend() {
    print_info "部署前端..."
    cd /opt/tsmnt/tsmainite-website
    
    # 检查环境变量
    if [ ! -f .env.production ]; then
        print_warning ".env.production 不存在，请先创建"
        print_info "创建 .env.production 示例..."
        cat > .env.production << 'EOF'
# 根据你的域名修改以下地址
BACKEND_API_URL=https://api.yourdomain.com
EOF
        print_warning "请编辑 .env.production 并设置正确的后端地址"
        return 1
    fi
    
    # 安装依赖
    print_info "安装前端依赖..."
    npm install --production
    
    # 构建
    print_info "构建前端..."
    npm run build
    
    # 重启进程
    print_info "重启前端服务..."
    pm2 restart frontend || pm2 start npm --name "frontend" -- start
    
    print_success "前端部署完成"
}

# 配置 PM2 开机启动
setup_pm2() {
    print_info "配置 PM2 开机启动..."
    
    pm2 save
    sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup ubuntu -u ubuntu --hp /home/ubuntu
    
    print_success "PM2 已配置开机启动"
}

# 显示状态
show_status() {
    print_info "服务状态:"
    pm2 list
    
    print_info "日志:"
    print_info "后端日志: pm2 logs backend"
    print_info "前端日志: pm2 logs frontend"
}

# 主程序
main() {
    echo ""
    print_info "========================================="
    print_info "tsmainite 云服务器部署脚本"
    print_info "========================================="
    echo ""
    
    # 检查依赖
    if ! check_dependencies; then
        print_error "依赖检查失败"
        exit 1
    fi
    
    # 更新代码
    if ! update_code; then
        print_error "更新代码失败"
        exit 1
    fi
    
    # 部署后端
    if ! deploy_backend; then
        print_error "后端部署失败"
        exit 1
    fi
    
    # 部署前端
    if ! deploy_frontend; then
        print_warning "前端部署需要先配置 .env.production"
        exit 1
    fi
    
    # 配置 PM2
    setup_pm2
    
    # 显示状态
    echo ""
    show_status
    
    echo ""
    print_success "========================================="
    print_success "部署完成！"
    print_success "========================================="
    echo ""
    print_info "访问地址:"
    print_info "  前端: https://yourdomain.com"
    print_info "  后端: https://api.yourdomain.com"
    echo ""
}

# 运行主程序
main
