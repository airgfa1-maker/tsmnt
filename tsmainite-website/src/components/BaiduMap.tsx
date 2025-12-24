'use client';

import React, { useEffect, useState } from 'react';

export default function BaiduMap({ width = '100%', height = '500px' }: { width?: string; height?: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // 从API获取地图配置
        const res = await fetch('/api/map/config');
        const data = await res.json();
        
        if (data.code !== 200 || !data.data) {
          throw new Error('获取地图配置失败');
        }

        const { ak, defaultLocation } = data.data;
        
        if (!ak || ak === 'YOUR_BAIDU_MAP_AK_HERE') {
          throw new Error('未配置百度地图API密钥');
        }

        // 检查脚本是否已加载
        if ((window as any).BMapGL) {
          // 脚本已加载，直接初始化地图
          initMap(defaultLocation);
          return;
        }

        // 定义全局回调函数
        (window as any).baiduMapInit = () => {
          initMap(defaultLocation);
        };

        // 异步加载百度地图脚本（使用callback参数）
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://api.map.baidu.com/api?type=webgl&v=1.0&ak=${ak}&callback=baiduMapInit`;
        document.body.appendChild(script);
      } catch (err: any) {
        console.error('地图初始化失败:', err);
        setError(err.message || '加载地图失败');
        setLoading(false);
      }
    };

    const initMap = (locationData: any) => {
      try {
        // 获取容器
        const container = document.getElementById('baidu-map-container');
        if (!container) {
          setError('地图容器不存在');
          setLoading(false);
          return;
        }

        // 创建地图实例（遵循官方API用法）
        const map = new (window as any).BMapGL.Map('baidu-map-container');

        // 设置中心点和缩放级别
        const point = new (window as any).BMapGL.Point(
          locationData.lng,
          locationData.lat
        );
        map.centerAndZoom(point, 15);

        // 启用滚轮缩放
        map.enableScrollWheelZoom();

        // 添加标记
        const marker = new (window as any).BMapGL.Marker(point);
        map.addOverlay(marker);

        // 添加信息窗口
        const infoWindow = new (window as any).BMapGL.InfoWindow(
          `<div style="font-size: 14px; padding: 5px; color: #333;">
            <strong>${locationData.name}</strong><br/>
            经度: ${locationData.lng}<br/>
            纬度: ${locationData.lat}
          </div>`,
          {
            title: locationData.name,
            width: 250,
            height: 100
          }
        );

        // 点击标记显示信息窗口
        marker.addEventListener('click', () => {
          map.openInfoWindow(infoWindow, point);
        });

        // 默认显示信息窗口
        map.openInfoWindow(infoWindow, point);

        console.log('百度地图初始化成功');
        setLoading(false);
      } catch (err: any) {
        console.error('地图创建失败:', err);
        setError('地图初始化失败: ' + err.message);
        setLoading(false);
      }
    };

    initializeMap();
  }, []);

  if (error) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fee',
          border: '1px solid #fcc'
        }}
      >
        <p style={{ color: '#c33' }}>❌ {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            width,
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            zIndex: 1
          }}
        >
          <p style={{ color: '#999' }}>地图加载中...</p>
        </div>
      )}
      <div
        id="baidu-map-container"
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
