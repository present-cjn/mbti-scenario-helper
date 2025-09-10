// 这是一个默认导出的函数，是 WXT 内容脚本的写法
export default defineContentScript({
  // 匹配规则，在mbti官网的页面生效
  matches: ['*://*.16personalities.com/*'],

  // 等页面完全加载渲染好了再运行脚本
  runAt: 'document_idle',

  // main 函数会在网页加载时自动运行
  main() {
    console.log("🚀🚀🚀 MBTI 助手 v2 已成功注入！🚀🚀🚀");
    
    // 之后的功能会写在这里
  },
});