// ==UserScript==
// @name         ScheduledMessageSender
// @description  定时向指定群组发送消息
// @run-at       main, chat
// @reactive     true
// @version      0.1.0
// @homepageURL  https://github.com/Natsukage/Scriptio-user-scripts/#scheduled-message-sender
// @author       Natsukage
// @license      gpl-3.0
// ==/UserScript==

(function () {
    // 定义任务列表
    const tasks = [
        { time: "08:30", groupId: 123456, message: "早上好！" },
        { time: "12:00", groupId: 123456, message: "中午好！" },
        { time: "18:00", groupId: 123456, message: "晚上好！" },
        { time: "00:01", groupId: 23456789, message: "签到" }
    ];

    const refreshInterval = 60; // 刷新间隔，单位秒 (s)，不要设置在60以下，会导致一分钟内发送多次消息
    const debug = false; // 是否开启调试模式，开启后会在控制台输出日志
    const log = debug ? console.log.bind(console, "[ScheduledMessageSender]") : () => { };

    let messageTimer = null;

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    async function sendMessage(groupId, message) {
        // 执行这段方法需要确保 euphony 已经安装
        euphony.Group.make(groupId).sendMessage(new euphony.PlainText(message));
        log(`Message sent to group ${groupId}: ${message}`);
    }

    function checkScheduledTasks() {
        const currentTime = getCurrentTime();
        tasks.forEach(function(task) {
            if (task.time === currentTime) {
                sendMessage(task.groupId, task.message);
            }
        });
    }

    function toggleScheduler(enabled) {
        if (!messageTimer && enabled) {
            messageTimer = window.setInterval(checkScheduledTasks, refreshInterval * 1000);
        } else if (messageTimer && !enabled) {
            window.clearInterval(messageTimer);
            messageTimer = null;
        }
        log("Toggle ScheduledMessageSender: " + enabled);
    }
    scriptio_toolkit.listen(toggleScheduler, true);
})();
