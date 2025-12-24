/**
 * 技术规格字段翻译映射
 * 用于将英文字段名翻译为中文显示
 * 
 * 注意：这个是本地默认映射，会被后端的动态映射覆盖
 */

export const DEFAULT_SPECS_LABEL_MAP: Record<string, string> = {
  // 功率相关
  'power': '功率',
  'motor': '电机',
  'voltage': '电压',
  'current': '电流',
  'frequency': '频率',
  
  // 容量/尺寸相关
  'capacity': '容量',
  'volume': '体积',
  'weight': '重量',
  'size': '尺寸',
  'width': '宽度',
  'height': '高度',
  'length': '长度',
  'diameter': '直径',
  'radius': '半径',
  'thickness': '厚度',
  
  // 性能相关
  'speed': '转速',
  'rpm': '转速',
  'pressure': '压力',
  'temperature': '温度',
  'flow_rate': '流量',
  'efficiency': '效率',
  
  // 材料相关
  'material': '材料',
  'steel': '钢铁',
  'stainless': '不锈钢',
  'aluminum': '铝',
  'copper': '铜',
  
  // 时间/保修
  'warranty': '保修期',
  'lifespan': '使用寿命',
  'maintenance_interval': '维护周期',
  
  // 其他
  'model': '型号',
  'brand': '品牌',
  'origin': '产地',
  'certification': '认证',
  'color': '颜色',
  'noise_level': '噪音级别',
  'energy_consumption': '能耗',
  'max_load': '最大负载',
  'min_load': '最小负载',
  'accuracy': '精度',
  'precision': '精密度',
};

// 动态加载的翻译映射
let dynamicSpecsLabelMap: Record<string, string> | null = null;

/**
 * 从后端加载动态翻译映射
 */
export async function loadSpecsTranslations(apiUrl: string = '/api'): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${apiUrl}/admin/specs-translations`);
    if (!response.ok) {
      console.warn('Failed to load specs translations from backend');
      return DEFAULT_SPECS_LABEL_MAP;
    }

    const data = await response.json();
    const map: Record<string, string> = {};
    
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((trans: any) => {
        if (trans.field && trans.label) {
          map[trans.field.toLowerCase()] = trans.label;
        }
      });
    }

    dynamicSpecsLabelMap = map;
    return map;
  } catch (error) {
    console.error('Error loading specs translations:', error);
    return DEFAULT_SPECS_LABEL_MAP;
  }
}

/**
 * 获取当前的翻译映射（动态 + 默认）
 */
export function getSpecsLabelMap(): Record<string, string> {
  if (dynamicSpecsLabelMap) {
    return { ...DEFAULT_SPECS_LABEL_MAP, ...dynamicSpecsLabelMap };
  }
  return DEFAULT_SPECS_LABEL_MAP;
}

/**
 * 将英文字段名翻译为中文
 * @param key 英文字段名（如 'power', 'capacity'）
 * @returns 中文标签
 */
export function translateSpecKey(key: string): string {
  const map = getSpecsLabelMap();
  
  // 尝试精确匹配
  if (map[key]) {
    return map[key];
  }
  
  // 尝试小写匹配（处理大小写不一致）
  const lowerKey = key.toLowerCase();
  if (map[lowerKey]) {
    return map[lowerKey];
  }
  
  // 将下划线转换为空格后再尝试（如 'flow_rate' → 'flow rate'）
  const withSpaces = lowerKey.replace(/_/g, ' ');
  for (const [mapKey, label] of Object.entries(map)) {
    if (mapKey.replace(/_/g, ' ') === withSpaces) {
      return label;
    }
  }
  
  // 如果没有找到翻译，返回原值并首字母大写
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

/**
 * 解析技术规格 JSON 字符串，并自动翻译字段名
 * @param specsStr JSON 字符串
 * @returns 翻译后的规格对象 { "中文标签": "值" }
 */
export function parseAndTranslateSpecs(specsStr: string): Record<string, string> {
  try {
    if (!specsStr) return {};
    
    // 解析 JSON 字符串
    const specs = typeof specsStr === 'string' ? JSON.parse(specsStr) : specsStr;
    
    if (!specs || typeof specs !== 'object') {
      return {};
    }
    
    // 将英文字段转换为中文标签
    const translated: Record<string, string> = {};
    for (const [key, value] of Object.entries(specs)) {
      const label = translateSpecKey(key);
      translated[label] = String(value);
    }
    
    return translated;
  } catch (error) {
    console.error('解析规格失败:', error);
    return {};
  }
}

/**
 * 将规格转换为单行文本格式（用于列表显示）
 * @param specsStr JSON 字符串
 * @returns 格式化的单行文本
 */
export function specsToString(specsStr: string): string {
  const translated = parseAndTranslateSpecs(specsStr);
  const parts = Object.entries(translated).map(([label, value]) => `${label}${value}`);
  return parts.join(', ') || '暂无规格';
}

/**
 * 验证 JSON 格式是否正确
 * @param jsonStr JSON 字符串
 * @returns true 如果格式正确
 */
export function isValidSpecsJson(jsonStr: string): boolean {
  try {
    if (!jsonStr) return false;
    JSON.parse(jsonStr);
    return true;
  } catch {
    return false;
  }
}
