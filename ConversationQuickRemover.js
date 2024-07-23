// ==UserScript==
// @name         Conversation Quick Remover
// @description  鼠标中键点击移除会话
// @run-at       main
// @reactive     true
// @version      0.1.0
// @homepageURL  https://github.com/Natsukage/Scriptio-user-scripts/#conversation-quick-remover
// @author       Natsukage
// @license      gpl-3.0
// ==/UserScript==

(function () {
  const debug = false; // 是否开启调试模式，开启后会在控制台输出日志
  const log = debug ? console.log.bind(console, "[ConversationQuickRemover]") : () => { };

  async function removeConversation(conversationElement) {
    const rightClickEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 2,
    });
    conversationElement.dispatchEvent(rightClickEvent);

    let attempts = 0;
    const maxAttempts = 100;
    const interval = 1; // 每次尝试间隔1ms

    while (attempts++ < maxAttempts) {
      const menuItem = Array.from(document.querySelectorAll(".q-context-menu-item"))
        .find(item => item.textContent === "从消息列表中移除");
      if (menuItem) {
        menuItem.click();
        log("Conversation Removed");
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    log("Failed to remove conversation after maximum attempts");
    return false;
  }

  function handleMiddleClick(event) {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;

    const targetElement = event.target.closest(".recent-contact-item");
    if (targetElement && event.button === 1) {
      event.preventDefault();
      event.stopImmediatePropagation();
      removeConversation(targetElement);
    }
  }

  let isListening = false;
  function toggleListener(isEnabled) {
    if (isEnabled && !isListening) {
      document.body.addEventListener("mousedown", handleMiddleClick, { capture: true });
    } else if (!isEnabled && isListening) {
      document.body.removeEventListener("mousedown", handleMiddleClick, { capture: true });
    }
    isListening = isEnabled;
  }

  scriptio_toolkit.listen(toggleListener, true);
})();
