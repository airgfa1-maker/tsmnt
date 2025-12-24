// Admin API 工具函数

const getBaseUrl = () => {
  // 使用相对路径，这样会通过Next.js的API代理
  return '/api';
};

const normalizeEndpoint = (endpoint: string) => {
  if (!endpoint) return '';
  let e = endpoint;
  if (!e.startsWith('/')) e = '/' + e;
  return e;
};

/**
 * 处理401响应 - 清除token并重定向到登录页
 */
const handleUnauthorized = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    // 重定向到登录页
    window.location.href = '/admin-mnt/login?expired=true';
  }
};

/**
 * 处理API响应 - 统一处理401错误
 */
const handleResponse = async (response: Response, endpoint: string) => {
  if (response.status === 401) {
    console.error(`❌ Token已过期或无效，清除token并跳转到登录页`);
    handleUnauthorized();
    throw new Error('Token已过期或无效');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API ${endpoint} 返回 ${response.status}: ${errorText}`);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  console.log(`🔐 getAuthHeaders - token存在: ${!!token}`);
  const authHeader = token ? `Bearer ${token}` : 'Bearer ';
  return {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
  };
};

export const adminApi = {
  // GET 请求
  async get<T>(endpoint: string): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    console.log(`📖 GET ${endpoint}, token存在: ${!!token}`);
    const response = await fetch(`${getBaseUrl()}${normalizeEndpoint(endpoint)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response, endpoint);
  },

  // POST 请求
  async post<T>(endpoint: string, data: any): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    console.log(`📮 POST ${endpoint}, token存在: ${!!token}`);
    const response = await fetch(`${getBaseUrl()}${normalizeEndpoint(endpoint)}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response, endpoint);
  },

  // POST FormData (用于文件上传)
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    console.log(`📤 postFormData ${endpoint}, token存在: ${!!token}`);
    const response = await fetch(`${getBaseUrl()}${normalizeEndpoint(endpoint)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return handleResponse(response, endpoint);
  },

  // PUT 请求
  async put<T>(endpoint: string, data: any): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    console.log(`📝 PUT ${endpoint}, token存在: ${!!token}`);
    const response = await fetch(`${getBaseUrl()}${normalizeEndpoint(endpoint)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response, endpoint);
  },

  // PUT FormData (用于文件上传)
  async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    console.log(`📤 putFormData ${endpoint}, token存在: ${!!token}`);
    const response = await fetch(`${getBaseUrl()}${normalizeEndpoint(endpoint)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return handleResponse(response, endpoint);
  },

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    console.log(`🗑️ DELETE ${endpoint}, token存在: ${!!token}`);
    
    const response = await fetch(`${getBaseUrl()}${normalizeEndpoint(endpoint)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return handleResponse(response, endpoint);

    return handleResponse(response, endpoint);
  },

  // 获取列表 (带分页)
  async getList<T>(endpoint: string, page: number = 1, pageSize: number = 10): Promise<{ data: T[]; pagination: any }> {
    const url = `${endpoint}?page=${page}&pageSize=${pageSize}`;
    const response = await this.get<any>(url);
    // 后端返回 { code, message, data, pagination }，需要提取 data 和 pagination
    return {
      data: response.data as T[],
      pagination: response.pagination
    };
  },

  // 获取单项
  async getItem<T>(endpoint: string, id: string | number): Promise<T> {
    const response = await this.get<any>(`${endpoint}/${id}`);
    // 后端返回 { code, message, data }，需要提取 data 字段
    return response.data as T;
  },

  // 创建项目
  async createItem<T>(endpoint: string, data: any): Promise<T> {
    return this.post(endpoint, data);
  },

  // 更新项目
  async updateItem<T>(endpoint: string, id: string | number, data: any): Promise<T> {
    return this.put(`${endpoint}/${id}`, data);
  },

  // 删除项目
  async deleteItem<T>(endpoint: string, id: string | number): Promise<T> {
    return this.delete(`${endpoint}/${id}`);
  },

  // 上传文件
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    return this.postFormData(endpoint, formData);
  },
};

export default adminApi;
