// 通用API代理路由 - 用于转发除了特定路由外的所有其他请求
// 注意：特定路由如 /api/home/hero-slides 优先级更高，不会被此路由处理
// Catch-all routes: /api/auth/*, /api/products/*, /api/content/* 等

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  try {
    const { route } = await params;
    const path = route.join('/');
    const url = `http://localhost:3001/api/${path}${request.nextUrl.search}`;
    
    console.log(`🔄 API代理: GET /api/${path} -> ${url}`);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // 转发授权头
    const authHeader = request.headers.get('authorization');
    console.log(`🔑 [GET] 收到authorization: ${authHeader ? '已设置' : '未设置'}`);
    console.log(`🔑 [GET] authorization值: "${authHeader}"`);
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log(`📤 [GET] 转发Authorization: ${authHeader.substring(0, 60)}...`);
    } else {
      console.log(`❌ [GET] 没有Authorization头`);
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log(`📨 后端响应状态: ${response.status}`);
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.log('❌ 后端响应不是有效的JSON，尝试获取文本响应');
      const textData = await response.text();
      console.log('❌ 原始响应文本:', textData);
      data = { error: 'Invalid JSON response', details: textData, status: response.status };
    }
    console.log(`✅ 代理返回数据`);
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ API代理错误:', error.message);
    console.error('错误堆栈:', error.stack);
    return NextResponse.json(
      { error: 'API request failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  try {
    const { route } = await params;
    const path = route.join('/');
    const url = `http://localhost:3001/api/${path}`;
    
    console.log(`🔄 API代理: POST /api/${path} -> ${url}`);
    
    const contentType = request.headers.get('content-type');
    let body: any;
    const fetchOptions: RequestInit = { method: 'POST' };
    const headers: HeadersInit = {};
    
    if (contentType?.includes('multipart/form-data')) {
      // 对于 multipart/form-data，直接转发原始请求体
      body = await request.arrayBuffer();
      fetchOptions.body = body;
      // 复制原始的 content-type 头，包括 boundary
      headers['Content-Type'] = contentType;
    } else if (contentType?.includes('application/json')) {
      body = await request.json();
      fetchOptions.body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    } else {
      // 默认作为 JSON 处理
      body = await request.json();
      fetchOptions.body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
    
    // 转发授权头
    const authHeader = request.headers.get('authorization');
    console.log(`🔑 [POST] 收到authorization: ${authHeader ? '已设置' : '未设置'}`);
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log(`📤 [POST] 转发Authorization: ${authHeader.substring(0, 60)}...`);
    }
    
    if (Object.keys(headers).length > 0) {
      fetchOptions.headers = headers;
    }
    
    const response = await fetch(url, fetchOptions);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.log('❌ 后端响应不是有效的JSON，尝试获取文本响应');
      const textData = await response.text();
      console.log('❌ 原始响应文本:', textData);
      data = { error: 'Invalid JSON response', details: textData, status: response.status };
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ API代理错误:', error.message);
    console.error('错误堆栈:', error.stack);
    return NextResponse.json(
      { error: 'API request failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  try {
    const { route } = await params;
    const path = route.join('/');
    const url = `http://localhost:3001/api/${path}${request.nextUrl.search}`;
    
    console.log(`🔄 API代理: PUT /api/${path} -> ${url}`);
    
    const contentType = request.headers.get('content-type');
    let body: any;
    const fetchOptions: RequestInit = { method: 'PUT' };
    const headers: HeadersInit = {};
    
    // 转发授权头
    const authHeader = request.headers.get('authorization');
    console.log(`🔑 [PUT] 收到authorization: ${authHeader ? '已设置' : '未设置'}`);
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log(`📤 [PUT] 转发Authorization: ${authHeader.substring(0, 60)}...`);
    }
    
    if (contentType?.includes('multipart/form-data')) {
      // 对于 multipart/form-data，直接转发原始请求体
      // 不要转换为 FormData，因为这会破坏文件内容
      body = await request.arrayBuffer();
      fetchOptions.body = body;
      // 复制原始的 content-type 头，包括 boundary
      headers['Content-Type'] = contentType;
      fetchOptions.headers = headers;
    } else {
      body = await request.json();
      fetchOptions.body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
      fetchOptions.headers = headers;
    }
    
    const response = await fetch(url, fetchOptions);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.log('❌ 后端响应不是有效的JSON，尝试获取文本响应');
      const textData = await response.text();
      console.log('❌ 原始响应文本:', textData);
      data = { error: 'Invalid JSON response', details: textData, status: response.status };
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ API代理错误:', error.message);
    console.error('错误堆栈:', error.stack);
    return NextResponse.json(
      { error: 'API request failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  try {
    const { route } = await params;
    const path = route.join('/');
    const url = `http://localhost:3001/api/${path}${request.nextUrl.search}`;
    
    console.log(`🔄 API代理: DELETE /api/${path}`);
    
    const headers: HeadersInit = {};
    
    // 转发授权头
    const authHeader = request.headers.get('authorization');
    console.log(`🔑 认证header: ${authHeader ? '已设置' : '未设置'}`);
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log(`📤 转发Authorization: ${authHeader.substring(0, 50)}...`);
    }
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.log('❌ 后端响应不是有效的JSON，尝试获取文本响应');
      const textData = await response.text();
      console.log('❌ 原始响应文本:', textData);
      data = { error: 'Invalid JSON response', details: textData, status: response.status };
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ API代理错误:', error.message);
    return NextResponse.json(
      { error: 'API request failed', details: error.message },
      { status: 500 }
    );
  }
}

