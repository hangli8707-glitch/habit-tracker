// ==========================
// 1. 获取 DOM 元素
// ==========================
const currentDateEl = document.getElementById('current-date');
const moodBtns = document.querySelectorAll('.mood-btn');
const selectedMoodDisplay = document.getElementById('selected-mood-display');
const habitInput = document.getElementById('habit-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitList = document.getElementById('habit-list');

// ==========================
// 2. 初始化数据状态
// ==========================
// 从浏览器的 LocalStorage 中读取保存的数据，如果没有则使用默认空数组/空字符串
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let currentMood = localStorage.getItem('currentMood') || '';

// ==========================
// 3. 核心功能函数
// ==========================

// 显示当前日期
function displayDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    currentDateEl.textContent = `今天是：${today.toLocaleDateString('zh-CN', options)}`;
}

// 渲染习惯列表
function renderHabits() {
    // 清空当前列表 HTML
    habitList.innerHTML = '';

    if (habits.length === 0) {
        habitList.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 10px;">暂无习惯，快去添加一个吧！</p>';
        return;
    }

    // 遍历数组，动态生成每个习惯的 HTML结构
    habits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.className = `habit-item ${habit.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <span>${escapeHtml(habit.text)}</span>
            <div class="habit-actions">
                <button class="check-btn" onclick="toggleHabit(${index})">
                    ${habit.completed ? '取消打卡' : '打卡'}
                </button>
                <button class="delete-btn" onclick="deleteHabit(${index})">删除</button>
            </div>
        `;
        habitList.appendChild(li);
    });
}

// 保存数据到 LocalStorage
function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('currentMood', currentMood);
}

// 添加习惯
function addHabit() {
    const text = habitInput.value.trim();
    if (text === '') {
        alert('请输入习惯内容！');
        return;
    }

    habits.push({
        text: text,
        completed: false
    });

    habitInput.value = ''; // 清空输入框
    saveData();
    renderHabits();
}

// 切换习惯打卡状态（挂载到 window 以便行内 onclick 调用）
window.toggleHabit = function(index) {
    habits[index].completed = !habits[index].completed;
    saveData();
    renderHabits();
};

// 删除习惯
window.deleteHabit = function(index) {
    habits.splice(index, 1);
    saveData();
    renderHabits();
};

// 渲染心情状态
function renderMood() {
    moodBtns.forEach(btn => {
        if (btn.getAttribute('data-mood') === currentMood) {
            btn.classList.add('active');
            selectedMoodDisplay.textContent = `今日已记录心情：${currentMood}`;
        } else {
            btn.classList.remove('active');
        }
    });
}

// 防止 XSS 攻击的简单辅助函数
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// ==========================
// 4. 事件监听与初始化运行
// ==========================

// 点击添加按钮
addHabitBtn.addEventListener('click', addHabit);

// 按回车键也能添加习惯
habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addHabit();
    }
});

// 心情按钮点击事件
moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentMood = btn.getAttribute('data-mood');
        saveData();
        renderMood();
    });
});

// 页面加载完成后初始化
displayDate();
renderHabits();
renderMood();