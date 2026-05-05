// Admin 菜单和路由配置

export interface AdminMenuItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const adminMenuItems: AdminMenuItem[] = [
  { label: '仪表板', href: '/admin-mnt', icon: '📊' },
  { label: '关于我们', href: '/admin-mnt/about', icon: '📖' },
  { label: '新闻管理', href: '/admin-mnt/news', icon: '📰' },
  { label: '案例管理', href: '/admin-mnt/cases', icon: '📋' },
  { label: '产品管理', href: '/admin-mnt/products', icon: '🛠️' },
  { label: '产品分类', href: '/admin-mnt/categories', icon: '📁' },
  { label: '图片库', href: '/admin-mnt/gallery', icon: '🖼️' },
  { label: '消息管理', href: '/admin-mnt/messages', icon: '📧' },
  { label: '网站设置', href: '/admin-mnt/settings', icon: '⚙️' },
];

export const getMenuItemLabel = (href: string): string => {
  const item = adminMenuItems.find(m => m.href === href);
  return item?.label || '管理系统';
};

export const getMenuItemIcon = (href: string): string => {
  const item = adminMenuItems.find(m => m.href === href);
  return item?.icon || '⚙️';
};
