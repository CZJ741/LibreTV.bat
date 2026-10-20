import type { SourceConfig } from './types';

/**
 * 开箱即用的社区采集站候选列表。
 * 这些站点均采用 Apple CMS API；站点可用性由源管理中的健康检查动态判断。
 * 部署者设置 DEFAULT_SOURCES 后会完全覆盖此列表。
 */
const BUILT_IN_SOURCES: Array<Omit<SourceConfig, 'key'>> = [
  { name: '非凡资源', url: 'https://cj.ffzyapi.com/api.php/provide/vod' },
  { name: '如意资源', url: 'https://cj.rycjapi.com/api.php/provide/vod' },
  { name: '暴风资源', url: 'https://bfzyapi.com/api.php/provide/vod' },
  { name: '量子资源', url: 'https://cj.lziapi.com/api.php/provide/vod' },
  { name: '索尼资源', url: 'https://snzyapi.com/api.php/provide/vod' },
  { name: '最大资源', url: 'https://zuidazy.com/api.php/provide/vod' },
  { name: '红牛资源', url: 'https://www.hongniuzy.com/api.php/provide/vod' },
  { name: '金鹰资源', url: 'https://jyzyapi.com/api.php/provide/vod' },
  { name: '光速资源', url: 'https://api.guangsuapi.com/api.php/provide/vod' },
  { name: '天空资源', url: 'https://tyyszy.com/api.php/provide/vod' },
  { name: '卧龙资源', url: 'https://wolongzyw.com/api.php/provide/vod' },
  { name: '乐视资源', url: 'https://leshizyapi.com/api.php/provide/vod' },
  { name: '魔都资源', url: 'https://www.mdzyapi.com/api.php/provide/vod' },
  { name: '360资源', url: 'https://360zy.com/api.php/provide/vod' },
  { name: '最大云资源', url: 'https://api.zuidazy.me/api.php/provide/vod' },
];

/**
 * 部署者通过 DEFAULT_SOURCES 环境变量预置的采集站。
 * 格式为 JSON 数组：[{"name":"源名","url":"https://.../api.php/provide/vod","detail":"https://...","isAdult":false}]
 * 解析失败时告警并整体忽略，不影响站点运行。
 */
export function getEnvSources(): SourceConfig[] {
  const raw = process.env.DEFAULT_SOURCES;
  if (!raw || !raw.trim()) {
    return BUILT_IN_SOURCES.map((source, i) => ({ ...source, key: `builtin_${i}` }));
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('必须是 JSON 数组');
    const list: SourceConfig[] = parsed.map((item, i) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error(`第 ${i + 1} 项不是对象`);
      }
      const { name, url, detail, isAdult } = item as Record<string, unknown>;
      if (typeof name !== 'string' || !name.trim()) {
        throw new Error(`第 ${i + 1} 项缺少 name`);
      }
      if (typeof url !== 'string' || !/^https?:\/\//.test(url.trim())) {
        throw new Error(`第 ${i + 1} 项的 url 必须以 http:// 或 https:// 开头`);
      }
      return {
        key: `env_${i}`,
        name: name.trim(),
        url: url.trim().replace(/\/+$/, ''),
        detail: typeof detail === 'string' && detail.trim() ? detail.trim() : undefined,
        isAdult: isAdult === true,
      };
    });
    return list;
  } catch (err) {
    console.warn('[LibreTV] DEFAULT_SOURCES 解析失败，已忽略：', err instanceof Error ? err.message : err);
    return [];
  }
}
