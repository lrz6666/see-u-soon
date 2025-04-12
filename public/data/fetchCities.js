//！！！！！！！为了让特殊地区（香港，澳门）也能正常被按做城市，我已更改了cities.json。如果再运行此脚本，将会导致修改完善后的cities.json文件被覆盖，导致在地图上特殊地区出现问题。
//！！！！！！！为了让特殊地区（香港，澳门）也能正常被按做城市，我已更改了cities.json。如果再运行此脚本，将会导致修改完善后的cities.json文件被覆盖，导致在地图上特殊地区出现问题。
//！！！！！！！为了让特殊地区（香港，澳门）也能正常被按做城市，我已更改了cities.json。如果再运行此脚本，将会导致修改完善后的cities.json文件被覆盖，导致在地图上特殊地区出现问题。
//仍然要更改的话，要将底部的main（）注释取消。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// 配置参数
const AMAP_KEY = process.env.NEXT_PUBLIC_API_WEBSERVE_KEY; // 高德地图的key
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'cities');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'cities-full.json');

// 主函数
async function main() {
  try {
    console.log('开始获取完整城市数据...');
    
    // 1. 获取省级数据
    const provinces = await fetchProvinces();
    
    // 2. 获取每个省的所有下级行政区数据（包括地级市和县级市）
    const results = [];
    for (const province of provinces) {
      console.log(`处理 ${province.name}...`);
      
      // 获取省份下所有行政区（subdistrict=2获取到县级）
      const fullData = await fetchFullDistrictData(province.adcode);
      
      results.push({
        ...province,
        cities: fullData.districts[0].districts.map(city => ({
          name: city.name,
          adcode: city.adcode,
          center: city.center.split(',').map(Number),
          boundary: city.polyline ? decodePolyline(city.polyline) : null,
          citycode: city.citycode,
          // 添加县级数据
          counties: city.districts ? city.districts.map(county => ({
            name: county.name,
            adcode: county.adcode,
            center: county.center.split(',').map(Number),
            boundary: county.polyline ? decodePolyline(county.polyline) : null
          })) : []
        }))
      });
      
      // 添加延迟避免请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 3. 保存结果
    const finalData = {
      updatedAt: new Date().toISOString(),
      data: results
    };
    
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
    
    console.log(`数据已保存到 ${OUTPUT_FILE}`);
    console.log(`共获取 ${results.length} 个省份`);
    console.log(`地级市数量: ${
      results.reduce((sum, p) => sum + p.cities.length, 0)
    }`);
    console.log(`县级区划数量: ${
      results.reduce((sum, p) => sum + p.cities.reduce((s, c) => s + c.counties.length, 0), 0)
    }`);
  } catch (error) {
    console.error('脚本执行出错:', error);
  }
}

// 获取所有省份
async function fetchProvinces() {
  const url = `https://restapi.amap.com/v3/config/district?key=${AMAP_KEY}&keywords=中国&subdistrict=1&extensions=base`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.districts || !data.districts[0] || !data.districts[0].districts) {
    throw new Error('无效的API响应格式 - 省份数据');
  }
  
  return data.districts[0].districts.map(province => ({
    name: province.name,
    adcode: province.adcode,
    center: province.center.split(',').map(Number)
  }));
}

// 获取完整行政区数据（包括县级）
async function fetchFullDistrictData(adcode) {
  const url = `https://restapi.amap.com/v3/config/district?key=${AMAP_KEY}&keywords=${adcode}&subdistrict=2&extensions=all`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.districts || !data.districts[0]) {
    throw new Error(`无效的API响应格式 - 行政区数据 ${adcode}`);
  }
  
  return data;
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
// main();