export default {
  async fetch(request, env) {
    // 检查前端是否需要将变量暴露给浏览器（有些脚本可能会在 runtime 动态读取）
    // 返回正常的静态资源
    return env.ASSETS.fetch(request);
  },
};
