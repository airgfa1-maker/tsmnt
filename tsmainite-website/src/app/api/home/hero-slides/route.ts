import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = `http://localhost:3001/api/home/hero-slides${request.nextUrl.search}`;
    console.log(`🔄 GET /api/home/hero-slides -> ${url}`);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ Hero API Error:', error.message);
    return NextResponse.json(
      { error: 'Request failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/home/hero-slides 被前端调用');
    
    const contentType = request.headers.get('content-type');
    console.log('📝 Content-Type:', contentType);
    
    const formData = await request.formData();
    console.log('📦 FormData字段:', Array.from(formData.keys()));
    
    const authHeader = request.headers.get('authorization');
    // 注意：不要为FormData设置Content-Type header，让fetch自动设置
    const headers: HeadersInit = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    console.log('📤 向后端发送请求到 http://localhost:3001/api/home/hero-slides');
    
    const response = await fetch('http://localhost:3001/api/home/hero-slides', {
      method: 'POST',
      body: formData,
      headers,
    });

    console.log('📥 后端响应状态:', response.status);
    const responseText = await response.text();
    console.log('📥 后端响应 (前200字符):', responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ 后端返回的不是有效JSON');
      console.error('❌ 响应内容:', responseText.substring(0, 500));
      return NextResponse.json(
        { error: 'Backend returned invalid JSON', details: responseText.substring(0, 200), status: response.status },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ Hero POST error:', error.message);
    console.error('❌ 完整错误堆栈:', error.stack);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    console.log(`🔄 PUT /api/home/hero-slides?id=${id} 被前端调用`);
    
    const formData = await request.formData();
    console.log('📦 FormData字段:', Array.from(formData.keys()));
    
    const authHeader = request.headers.get('authorization');
    // 注意：不要为FormData设置Content-Type header，让fetch自动设置
    const headers: HeadersInit = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    console.log('📤 向后端发送PUT请求');
    const response = await fetch(`http://localhost:3001/api/home/hero-slides?id=${id}`, {
      method: 'PUT',
      body: formData,
      headers,
    });

    console.log('📥 后端响应状态:', response.status);
    const responseText = await response.text();
    console.log('📥 后端响应 (前200字符):', responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ 后端返回的不是有效JSON');
      console.error('❌ 响应内容:', responseText.substring(0, 500));
      return NextResponse.json(
        { error: 'Backend returned invalid JSON', details: responseText.substring(0, 200), status: response.status },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ Hero PUT error:', error.message);
    console.error('❌ 完整错误堆栈:', error.stack);
    return NextResponse.json(
      { error: 'Update failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    console.log(`🔄 DELETE /api/home/hero-slides?id=${id}`);
    
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`http://localhost:3001/api/home/hero-slides?id=${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ Hero delete error:', error.message);
    return NextResponse.json(
      { error: 'Delete failed', details: error.message },
      { status: 500 }
    );
  }
}
