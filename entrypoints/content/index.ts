// entrypoints/content/index.ts

import './style.css';
import { allScenarios } from '../../shared/scenarios';

export default defineContentScript({
  matches: ['*://*.16personalities.com/*'],
  runAt: 'document_idle',

  main() {
    console.log("🚀 MBTI 助手最终版(v5 - 居中弹框版) 已注入！🚀");

    const addButtonsToQuestions = () => {
      const answerGroupSelector = 'div.group__options';
      const answerGroups = document.querySelectorAll(answerGroupSelector);
      if (answerGroups.length === 0) return;

      answerGroups.forEach((answerGroup, index) => {
        if (answerGroup.hasAttribute('data-mbti-helper-processed')) return;
        
        const questionLegend = answerGroup.previousElementSibling;
        if (questionLegend) {
          const button = document.createElement('button');
          button.innerText = '不知道怎么选，举个栗子 🌰';
          button.className = 'mbti-scenario-btn';
          button.type = 'button';
          
          button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const existingPopup = document.querySelector('.mbti-helper-popup');
            if (existingPopup) existingPopup.remove();

            const questionScenarios = allScenarios[index];
            if (!questionScenarios) {
              alert('抱歉，该问题的场景尚未添加。');
              return;
            }
            
            const initialScenarioText = questionScenarios['work'][0] || '暂无场景';
            const popup = document.createElement('div');
            popup.className = 'mbti-helper-popup';
            popup.innerHTML = `
              <p>${initialScenarioText}</p>
              <div class="popup-actions">
                <button id="randomize-btn">随机切换</button>
                <button id="close-popup-btn">关闭</button>
              </div>
            `;
            
            // ！！！我们不再需要计算位置，直接添加到body即可！！！
            document.body.appendChild(popup);

            document.getElementById('close-popup-btn').addEventListener('click', () => {
              popup.remove();
            });

            document.getElementById('randomize-btn').addEventListener('click', () => {
              const allCategoryScenarios = Object.values(questionScenarios).flat();
              if (allCategoryScenarios.length > 0) {
                const randomIndex = Math.floor(Math.random() * allCategoryScenarios.length);
                const randomScenario = allCategoryScenarios[randomIndex];
                popup.querySelector('p').textContent = randomScenario;
              }
            });
          });

          questionLegend.after(button);
          answerGroup.setAttribute('data-mbti-helper-processed', 'true');
        }
      });
    };

    const observer = new MutationObserver(addButtonsToQuestions);
    observer.observe(document.body, { childList: true, subtree: true });
    
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) addButtonsToQuestions();
    });

    addButtonsToQuestions();
  },
});