'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BaiduMap from '@/components/BaiduMap';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 加载网站信息
  useEffect(() => {
    const loadSiteInfo = async () => {
      try {
        const response = await fetch('/api/settings/info');
        if (response.ok) {
          const data = await response.json();
          setSiteInfo(data.data || {});
        }
      } catch (error) {
        console.error('Failed to load site info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSiteInfo();
  }, []);

  const phone = siteInfo?.phone || '139-3150-1373';
  const email = siteInfo?.email || 'tsmainite@163.com';
  const address = siteInfo?.address || '河北省唐山市开平区北湖工业园永春路3号';

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // 验证必填字段
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        setSubmitStatus({
          type: 'error',
          message: '请填写所有必填字段'
        });
        setSubmitting(false);
        return;
      }

      // 调用后端 API 提交消息
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `【${formData.subject}】\n\n${formData.message}`,
        })
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '感谢您的咨询，我们会尽快与您联系！'
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          type: 'error',
          message: errorData.message || '提交失败，请稍后重试'
        });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: '提交失败，请检查网络连接'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">联系我们</h1>
            <p className="text-gray-600 text-lg">
              我们随时准备为您解答问题，提供专业的技术支持
            </p>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-white border border-gray-200 p-6 text-center hover:border-gray-400 transition">
              <MapPin className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 mb-2">公司地址</h3>
              <p className="text-gray-600 text-xs">
                {address}
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center hover:border-gray-400 transition">
              <Phone className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 mb-2">销售热线</h3>
              <p className="text-gray-600 text-xs font-semibold">
                <a href={`tel:${phone}`} className="hover:text-gray-900 transition">
                  {phone}
                </a>
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center hover:border-gray-400 transition">
              <Mail className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 mb-2">邮箱地址</h3>
              <p className="text-gray-600 text-xs break-all">
                <a href={`mailto:${email}`} className="hover:text-gray-900 transition">
                  {email}
                </a>
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center hover:border-gray-400 transition">
              <Clock className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 mb-2">工作时间</h3>
              <p className="text-gray-600 text-xs">
                周一至周五<br />
                08:00 - 17:30
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Contact Form */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">发送信息</h2>
              
              {/* 提交状态提示 */}
              {submitStatus.type && (
                <div className={`mb-4 p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 border border-green-400 text-green-800' 
                    : 'bg-red-100 border border-red-400 text-red-800'
                }`}>
                  <p className="font-medium">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    您的名字/单位 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    邮箱地址 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-700"
                    placeholder="您的邀件"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    电话号码
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-700"
                    placeholder="您的电话号码"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    主题 *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-700"
                  >
                    <option value="">请选择主题</option>
                    <option value="产品咨询">产品咨询</option>
                    <option value="技术支持">技术支持</option>
                    <option value="售后服务">售后服务</option>
                    <option value="合作洽谈">合作洽谈</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    信息内容 *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-700"
                    placeholder="请详细说明您的需求..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full font-semibold py-3 transition ${
                    submitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  {submitting ? '提交中...' : '发送信息'}
                </button>
              </form>
            </div>

            {/* Map & Info */}
            <div>
              <BaiduMap width="100%" height="400px" />

              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">常见问题</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      如何获取产品报价？
                    </h4>
                    <p className="text-gray-600 text-xs">
                      您可以通过左侧表单提交咨询，或直接拨打我们的电话。
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      产品能否定制？
                    </h4>
                    <p className="text-gray-600 text-xs">
                      我们支持完全定制化服务，专家团队可根据您的需求设计方案。
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      技术支持如何获取？
                    </h4>
                    <p className="text-gray-600 text-xs">
                      我们提供24/7在线技术支持，可通过电话、邮件或在线客服联系。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <section className="bg-white border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">我们的服务承诺</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '⚙️', title: '专业安装调试', desc: '免费提供安装指导' },
                { icon: '🛟', title: '技术支持', desc: '全天候技术团队' },
                { icon: '🔧', title: '维护升级', desc: '终身维护服务' },
                { icon: '📚', title: '技术培训', desc: '定制化培训' },
              ].map((service, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-gray-600 text-xs">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
