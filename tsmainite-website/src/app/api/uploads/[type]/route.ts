import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const url = `http://localhost:3001/api/uploads/${type}`;
    
    console.log(`🔄 上传代理: POST /api/uploads/${type} -> ${url}`);
    
    // 获取 FormData
    const formData = await request.formData();
    
    // 获取授权头
    const authHeader = request.headers.get('authorization');
    const fetchOptions: RequestInit = {
      method: 'POST',
      body: formData,
    };
    
    if (authHeader) {
      fetchOptions.headers = {
        'Authorization': authHeader,
      };
    }
    
    console.log(`📤 转发到后端: ${url}`, { auth: !!authHeader });
    
    const response = await fetch(url, fetchOptions);
    
    console.log(`📨 后端响应状态: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ 后端错误: ${response.status}`, errorText);
      return NextResponse.json(
        { 
          code: response.status,
          message: 'Upload failed',
          error: errorText 
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log(`✅ 上传成功:`, data);
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('❌ 上传代理错误:', error.message);
    console.error('错误堆栈:', error.stack);
    return NextResponse.json(
      { 
        code: 500,
        message: 'Upload failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
