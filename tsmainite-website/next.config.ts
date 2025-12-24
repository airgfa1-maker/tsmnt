import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    // 获取后端 API 地址，支持通过环境变量配置
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    
    return {
      beforeFiles: [
        // 代理所有 /api 请求到后端
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${backendUrl}/uploads/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

