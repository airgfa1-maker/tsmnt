'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'seo' | 'password' | 'map'>('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    companyDescription: '',
    companyLogo: '',
    icp: '',
    securityCode: '',
    baiduMapAk: '',
    officeAddressName: '',
    officeAddressLng: '',
    officeAddressLat: '',
  });

  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    favicon: '',
    ogImage: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadSettings();
    loadSeoSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.get<any>('/settings/admin/info');
      const settings = Array.isArray(data) ? data[0] : (data.data || data);
      // 确保所有字段都有值，避免null导致的controlled input警告
      setFormData({
        companyName: settings.companyName || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        whatsapp: settings.whatsapp || '',
        companyDescription: settings.companyDescription || '',
        companyLogo: settings.companyLogo || '',
        icp: settings.icp || '',
        securityCode: settings.securityCode || '',
        baiduMapAk: settings.baiduMapAk || '',
        officeAddressName: settings.officeAddressName || '',
        officeAddressLng: settings.officeAddressLng || '',
        officeAddressLat: settings.officeAddressLat || '',
      });
    } catch (err) {
      setError('加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const loadSeoSettings = async () => {
    try {
      const data = await adminApi.get<any>('/settings/admin/meta');
      const meta = Array.isArray(data) ? data[0] : (data.data || data);
      setSeoData({
        title: meta.title || '',
        description: meta.description || '',
        keywords: meta.keywords || '',
        author: meta.author || '',
        favicon: meta.favicon || '',
        ogImage: meta.ogImage || '',
      });
    } catch (err) {
      console.error('加载SEO设置失败:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBasic = async () => {
    try {
      setError('');
      setSuccess('');
      await adminApi.put('/settings/admin/info', {
        companyName: formData.companyName,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        whatsapp: formData.whatsapp,
        companyDescription: formData.companyDescription,
        icp: formData.icp,
        securityCode: formData.securityCode,
      });
      setSuccess('基本信息已保存');
    } catch (err) {
      setError('保存出错');
    }
  };



  const handleSaveMap = async () => {
    try {
      setError('');
      setSuccess('');
      await adminApi.put('/settings/admin/info', {
        baiduMapAk: formData.baiduMapAk,
        officeAddressName: formData.officeAddressName,
        officeAddressLng: parseFloat(formData.officeAddressLng),
        officeAddressLat: parseFloat(formData.officeAddressLat),
      });
      setSuccess('地图信息已保存');
    } catch (err) {
      setError('保存出错');
    }
  };

  const handleSaveSeo = async () => {
    try {
      setError('');
      setSuccess('');
      await adminApi.put('/settings/admin/meta', {
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        author: seoData.author,
        favicon: seoData.favicon,
        ogImage: seoData.ogImage,
      });
      setSuccess('SEO设置已保存');
    } catch (err) {
      setError('保存出错');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('新密码和确认密码不匹配');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await adminApi.post('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('密码已修改，请重新登录');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
      // 2秒后自动注销并跳转到登录页
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/admin-mnt/login';
      }, 2000);
    } catch (err: any) {
      setError(err.message || '密码修改失败');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">网站设置</h1>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex gap-0">
          {(['basic', 'seo', 'map', 'password'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'basic' && '基本信息'}
              {tab === 'seo' && 'SEO设置'}
              {tab === 'map' && '百度地图'}
              {tab === 'password' && '修改密码'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">公司地址</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">公司简介</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">备案信息</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ICP 备案号</label>
                    <input
                      type="text"
                      name="icp"
                      value={formData.icp}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如：ICP备12345678号"
                    />
                    <p className="mt-1 text-xs text-gray-500">在 Footer 页脚显示</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">公安备案号</label>
                    <input
                      type="text"
                      name="securityCode"
                      value={formData.securityCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如：京公网安备 11010502033661 号"
                    />
                    <p className="mt-1 text-xs text-gray-500">在 Footer 页脚显示</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveBasic}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                保存
              </button>
            </div>
          )}


          {activeTab === 'map' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">百度地图 API Key</label>
                <input
                  type="text"
                  name="baiduMapAk"
                  value={formData.baiduMapAk}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入百度地图 API Key"
                />
                <p className="mt-2 text-sm text-gray-600">获取地址: https://lbsyun.baidu.com/</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地址名称</label>
                <input
                  type="text"
                  name="officeAddressName"
                  value={formData.officeAddressName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="如：总部办公室"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">经度</label>
                  <input
                    type="number"
                    name="officeAddressLng"
                    value={formData.officeAddressLng}
                    onChange={handleInputChange}
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="如：118.2384"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">纬度</label>
                  <input
                    type="number"
                    name="officeAddressLat"
                    value={formData.officeAddressLat}
                    onChange={handleInputChange}
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="如：39.7320"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-600">
                获取坐标：访问百度地图，搜索地点后右键点击获取坐标
              </p>

              <button
                onClick={handleSaveMap}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                保存
              </button>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>💡 提示：</strong>这些SEO元数据将被应用到网站的Meta标签中，有助于搜索引擎优化和社交分享。
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站标题</label>
                <input
                  type="text"
                  name="title"
                  value={seoData.title}
                  onChange={handleSeoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="如：唐山迈尼特 - 工业电磁设备领先制造商"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-gray-500">建议长度：50-60个字符</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站描述</label>
                <textarea
                  name="description"
                  value={seoData.description}
                  onChange={handleSeoChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="对网站的简要描述，会显示在搜索结果中"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-500">建议长度：120-160个字符</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关键词</label>
                <input
                  type="text"
                  name="keywords"
                  value={seoData.keywords}
                  onChange={handleSeoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="关键词之间用逗号分隔，如：电磁除铁器,工业电磁设备,电磁搅拌器"
                />
                <p className="mt-1 text-xs text-gray-500">多个关键词用逗号分隔，3-5个最佳</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作者</label>
                <input
                  type="text"
                  name="author"
                  value={seoData.author}
                  onChange={handleSeoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="如：唐山迈尼特"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon (网站图标路径)</label>
                <input
                  type="text"
                  name="favicon"
                  value={seoData.favicon}
                  onChange={handleSeoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="如：/images/favicon.png"
                />
                <p className="mt-1 text-xs text-gray-500">浏览器标签页显示的小图标</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Open Graph 图片</label>
                <input
                  type="text"
                  name="ogImage"
                  value={seoData.ogImage}
                  onChange={handleSeoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="如：/images/og-image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">用于社交媒体分享时的预览图片，建议比例1200x630</p>
              </div>

              <button
                onClick={handleSaveSeo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                保存SEO设置
              </button>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                修改密码
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

