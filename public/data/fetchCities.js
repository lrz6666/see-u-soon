import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// 配置参数
const AMAP_KEY = 'b74ac657cb05623bb16167b6d14362e3'; // 替换为你的实际key
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'cities');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'cities.json');

// 主函数
async function main() {
  try {
    console.log('开始获取城市数据...');
    
    // 1. 获取省级数据
    const provinces = await fetchProvinces();
    
    // 2. 获取每个省的城市数据
    const results = [];
    for (const province of provinces) {
      console.log(`处理 ${province.name}...`);
      const cities = await fetchCities(province.adcode);
      results.push({
        ...province,
        cities
      });
    }
    
    // 3. 保存结果
    const finalData = {
      updatedAt: new Date().toISOString(),
      data: results
    };
    
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
    
    console.log(`数据已保存到 ${OUTPUT_FILE}`);
    console.log(`共获取 ${results.length} 个省份，${results.reduce((sum, p) => sum + p.cities.length, 0)} 个城市`);
  } catch (error) {
    console.error('脚本执行出错:', error);
  }
}

// 获取所有省份
async function fetchProvinces() {
  const url = `https://restapi.amap.com/v3/config/district?key=${AMAP_KEY}&keywords=中国&subdistrict=1&extensions=base`;
  const response = await fetch(url);
  const data = await response.json();
  
  console.log('API响应数据:', JSON.stringify(data, null, 2));
  
  if (!data.districts || !data.districts[0] || !data.districts[0].districts) {
    throw new Error('无效的API响应格式');
  }
  
  return data.districts[0].districts.map(province => ({
    name: province.name,
    adcode: province.adcode,
    center: province.center.split(',').map(Number)
  }));
}

// 获取指定省份的城市数据（包含边界）
async function fetchCities(adcode) {
  const url = `https://restapi.amap.com/v3/config/district?key=${AMAP_KEY}&keywords=${adcode}&subdistrict=1&extensions=all`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.districts || !data.districts[0] || !data.districts[0].districts) {
    return []; // 返回空数组而不是报错
  }
  
  return data.districts[0].districts.map(city => ({
    name: city.name,
    adcode: city.adcode,
    center: city.center.split(',').map(Number),
    boundary: city.polyline ? decodePolyline(city.polyline) : null,
    citycode: city.citycode
  }));
}

// 解码高德地图的polyline边界数据
function decodePolyline(polyline) {
  if (!polyline) return null;
  
  const result = [];
  const points = polyline.split(';');
  
  for (const point of points) {
    const [lng, lat] = point.split(',');
    result.push([parseFloat(lng), parseFloat(lat)]);
  }
  
  return result;
}

// 执行主函数
