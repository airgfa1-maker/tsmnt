import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const filePath = pathArray.join('/');
    console.log('📥 GET /api/uploads/', filePath);
    
    // 直接从后端代理图片
    const backendUrl = `http://localhost:3001/uploads/${filePath}`;
    console.log(`🔄 代理请求: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      console.error(`❌ 后端返回错误: ${response.status}`);
      return NextResponse.json(
        { error: 'File not found', status: response.status },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();
    
    // 根据扩展名确定内容类型
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (filePath.endsWith('.gif')) contentType = 'image/gif';
    else if (filePath.endsWith('.webp')) contentType = 'image/webp';
    else if (filePath.endsWith('.pdf')) contentType = 'application/pdf';

    console.log(`✅ 成功: ${filePath}, 大小: ${buffer.byteLength} bytes`);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('❌ API 错误:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch file', details: error.message },
      { status: 500 }
    );
  }
}
