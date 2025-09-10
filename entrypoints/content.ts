// 这是一个默认导出的函数，是 WXT 内容脚本的写法
export default defineContentScript({
  // 匹配规则，在mbti官网的页面生效
  matches: ['*://*.16personalities.com/*'],

  // 等页面完全加载渲染好了再运行脚本
  runAt: 'document_idle',

  // main 函数会在网页加载时自动运行
  main() {
    console.log("🚀🚀🚀 MBTI 助手 v2 已成功注入！🚀🚀🚀");
    
    // ▼▼▼ 核心功能，封装在一个函数里 ▼▼▼
    const addButtonsToQuestions = () => {
      const answerGroupSelector = 'div.group__options';
      const answerGroups = document.querySelectorAll(answerGroupSelector);

      // 如果找不到答案区，就直接退出，等待下一次变化
      if (answerGroups.length === 0) {
        return;
      }
      
      console.log(`观察到变化！找到了 ${answerGroups.length} 个答案区，即将处理...`);

      answerGroups.forEach((answerGroup, index) => {
        // 检查这个答案区是否已经处理过，避免重复添加按钮
        if (answerGroup.hasAttribute('data-mbti-helper-processed')) {
          return;
        }

        const questionLegend = answerGroup.previousElementSibling;
        if (questionLegend) {
          const button = document.createElement('button');
          button.innerText = '场景';
          button.className = 'mbti-scenario-btn';
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            alert(`这里是问题 ${index + 1} 的场景化解读文字！`);
          });
          questionLegend.after(button);
          
          // 给处理过的答案区做一个标记
          answerGroup.setAttribute('data-mbti-helper-processed', 'true');
        }
      });
    };

    // ----------------------------------------------------
    // 创建一个观察者实例，并告诉它当有变化时该做什么（运行我们的函数）
    const observer = new MutationObserver(addButtonsToQuestions);

    // 告诉观察者要观察哪个目标（整个网页的body），以及要观察什么类型的变化
    observer.observe(document.body, {
      childList: true, // 观察子元素的增加或删除
      subtree: true,   // 观察所有后代元素
    });

    // 脚本注入后，也立即尝试运行一次，以防万一页面已经加载好了
    addButtonsToQuestions();
  },
});