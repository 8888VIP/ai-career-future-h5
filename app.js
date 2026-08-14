const screens = [...document.querySelectorAll('.screen')];
const messageList = document.querySelector('#messageList');
let choiceList = document.querySelector('#choiceList');
const answerDock = document.querySelector('#answerDock');
let confirmMulti = document.querySelector('#confirmMulti');
const addDetailButton = document.querySelector('#addDetailButton');
let detailComposer = document.querySelector('#detailComposer');
let detailInput = document.querySelector('#detailInput');
const toast = document.querySelector('#toast');

const state = {
  step: 0,
  answers: {},
  selected: [],
  started: false,
};

const careerData = {
  '程序员': {
    title: '软件工程师／程序员', risk: '结构转型型',
    lead: '您看重的是“稳定”和“不容易被淘汰”。AI时代真正稳定的，不只是会写代码，而是能持续定义并解决新问题。',
    ai: ['常规代码生成', '基础报错解释', '重复测试', '文档初稿'],
    human: ['理解真实需求', '系统架构设计', '验证结果可靠性', '安全与责任判断'],
    insight: '风险不在于学编程，而在于只会按照标准步骤写代码。',
    directions: [['AI智能体设计', '把目标拆成步骤，让AI持续完成真实任务'], ['机器人应用', '连接结构兴趣、编程逻辑与真实场景'], ['AIGC互动创作', '让技术服务于孩子自己的表达和创意']],
  },
  '医生': {
    title: '临床医生／医疗科技', risk: '结构转型型',
    lead: '医学仍需要长期知识积累，但AI会改变检索、筛查、影像辅助和记录方式，人的判断与沟通会更加重要。',
    ai: ['资料检索', '影像辅助筛查', '病历信息整理', '常规随访提醒'],
    human: ['综合临床判断', '处理不确定性', '患者沟通与共情', '伦理和责任承担'],
    insight: '未来医生的壁垒不只是记得多，而是能整合证据、理解人并承担判断。',
    directions: [['医疗科技创新', '连接生命科学、数据与真实健康问题'], ['健康沟通设计', '把复杂知识转成别人听得懂的表达'], ['机器人与辅助设备', '为真实医疗场景设计软硬件方案']],
  },
  '教师': {
    title: '教师／学习设计师', risk: '结构转型型',
    lead: 'AI可以生成讲解和练习，但真实关系、课堂观察、反馈与成长陪伴仍高度依赖教师。',
    ai: ['知识讲解初稿', '练习题生成', '资料整理', '基础答疑'],
    human: ['观察学习状态', '设计学习任务', '建立信任关系', '价值引导与反馈'],
    insight: '未来好教师不只是讲得熟，而是能看见不同孩子并设计有效的学习过程。',
    directions: [['智能教育设计', '结合AI工具设计更适合人的学习体验'], ['创意课程开发', '把故事、项目和跨学科内容连接起来'], ['成长陪伴与沟通', '用提问、反馈和共情帮助他人改变']],
  },
  '公务员': {
    title: '公务员／公共事务', risk: '结构转型型',
    lead: '程序化材料和信息整理会被AI分担，但公共服务、多方协调和责任决策仍需要人。',
    ai: ['材料初稿', '政策资料检索', '表格信息整理', '标准流程提醒'],
    human: ['多方沟通协调', '理解真实处境', '复杂问题治理', '公共责任判断'],
    insight: '未来的稳定来自解决公共问题的能力，而不是重复完成材料。',
    directions: [['公共服务创新', '观察真实需求并改善服务体验'], ['数据与社会研究', '用证据理解复杂社会问题'], ['社会创新项目', '协调资源，把方案落实到真实场景']],
  },
  '金融': {
    title: '金融分析／投资顾问', risk: '结构转型型',
    lead: 'AI会加速信息搜集和基础建模，真正稀缺的是理解假设、权衡风险并建立信任。',
    ai: ['数据汇总', '基础模型生成', '资讯摘要', '情景分析初稿'],
    human: ['判断模型假设', '权衡风险边界', '理解客户目标', '沟通并承担决策'],
    insight: '数学能力仍重要，但只会算、不理解人和风险，会越来越被动。',
    directions: [['金融科技产品', '连接数据、技术与真实用户需求'], ['商业分析', '从信息中找到问题并形成判断'], ['AI风险与治理', '检查模型、规则和决策可能带来的影响']],
  },
  '设计师': {
    title: '设计师／AIGC创意', risk: '两极分化型',
    lead: '模板化出图会被AI大量分担，但创意方向、审美判断、用户洞察和品牌表达更有价值。',
    ai: ['批量生成素材', '基础排版', '简单修图', '多版本初稿'],
    human: ['提出创意方向', '建立审美标准', '理解用户感受', '叙事与品牌判断'],
    insight: '会画、会软件只是起点，真正的壁垒是提出独特想法并知道怎样改得更好。',
    directions: [['AIGC创意导演', '用AI把主题发展成图像、视频和互动作品'], ['交互体验设计', '理解用户并设计完整使用过程'], ['品牌与内容叙事', '把创意、表达和商业价值连接起来']],
  },
  '会计': {
    title: '财务会计／经营分析', risk: '高风险转型型',
    lead: '自动记账、对账和基础报表会继续普及，人的价值将向经营理解、异常判断和风险沟通迁移。',
    ai: ['票据识别', '自动记账', '基础对账', '报表初稿'],
    human: ['解释经营结果', '发现异常风险', '理解业务逻辑', '支持管理决策'],
    insight: '与其只练“算得准”，不如同时训练理解业务和解释结果。',
    directions: [['智能财务产品', '把财务规则转成更高效的工具流程'], ['经营分析', '从数字中理解真实业务问题'], ['风险与合规设计', '判断边界并让复杂规则可执行']],
  },
  '翻译': {
    title: '翻译／跨文化表达', risk: '高风险转型型',
    lead: '直译和初稿越来越容易自动完成，文化语境、专业责任和高质量表达仍需要人。',
    ai: ['通用直译', '字幕初稿', '术语建议', '多语种改写'],
    human: ['理解文化语境', '高风险内容把关', '谈判与关系沟通', '形成独特表达'],
    insight: '语言学习仍有价值，但方向要从“翻得快”升级为“真正理解并表达得好”。',
    directions: [['跨文化内容创作', '连接语言、故事和不同文化的理解'], ['国际沟通与策划', '面向真实对象调整表达与方案'], ['AI语言产品', '设计并验证更可靠的语言协作工具']],
  },
  '暂时没想过': {
    title: '开放职业方向', risk: '待进一步观察',
    lead: '现在没有固定职业期待并不是坏事。对6—15岁的孩子，更重要的是先找到愿意持续投入的任务类型。',
    ai: ['标准答案提供', '重复内容生产', '常规信息整理', '固定流程执行'],
    human: ['提出真实问题', '跨学科组合', '判断结果价值', '沟通协作与负责'],
    insight: '先培养可迁移能力，再用真实项目观察兴趣，比过早锁定职业更稳妥。',
    directions: [['AIGC创意探索', '用低门槛作品观察孩子的想象与表达'], ['机器人项目', '用搭建和调试观察结构与执行兴趣'], ['AI商业小实验', '从生活问题出发，做一个帮助别人的方案']],
  },
};

const questions = [
  {
    key: 'age', mode: 'single',
    prompt: '我们先不急着给孩子贴职业标签，而是从年龄、兴趣和真实行为里找线索。孩子目前处在哪个年龄段？',
    choices: ['6—8岁', '9—11岁', '12—15岁'],
  },
  {
    key: 'career', mode: 'single',
    prompt: () => `明白，${state.answers.age}正是兴趣和能力快速发展的阶段。您目前最希望孩子将来从事哪个方向？这不是让您现在做决定，只是借这个期待看看AI时代的变化。`,
    choices: ['程序员', '医生', '教师', '公务员', '金融', '设计师', '会计', '翻译', '暂时没想过'],
  },
  {
    key: 'reason', mode: 'single',
    prompt: () => `收到。您想到“${state.answers.career}”，背后一定有更具体的考虑。您最看重的是什么？我会先理解这份期待，再补充AI时代的新视角。`,
    choices: ['稳定、有保障', '收入和发展', '孩子可能喜欢', '社会价值', '家里比较了解'],
  },
  {
    key: 'interests', mode: 'multi', max: 3,
    prompt: '接下来不问抽象的“能力分数”，只看日常表现。孩子平时更容易主动投入哪些事情？请选择最接近的1—3项。',
    choices: ['搭建／拆解', '画画／设计', '讲故事／阅读', '数学／推理', '电脑／编程', '动手实验', '策略闯关／虚拟探索', '体能挑战／团队竞技', '帮助别人', '买卖／策划'],
  },
  {
    key: 'creation', mode: 'single',
    prompt: () => `我记下了“${(state.answers.interests || []).join('、')}”。有兴趣只是起点，我还想看孩子会怎样创造：完成一个作品或任务后，他通常更接近哪种状态？`,
    choices: ['照着完成就结束', '偶尔会改一点', '经常主动改造', '会重新设计用途'],
  },
  {
    key: 'setback', mode: 'single',
    prompt: '这能帮助我判断孩子目前是“跟随完成”还是已经开始“自主定义”。如果连续失败两三次，他通常会怎么做？',
    choices: ['不会再继续', '马上找大人要答案', '愿意再试两三次', '会换方法继续试', '会记录并比较原因'],
  },
  {
    key: 'aiUse', mode: 'single',
    prompt: '最后看一个AI时代的关键动作：孩子使用聊天或生成图片类AI时，通常会停在哪一步？没有使用过也完全正常。',
    choices: ['还没有使用过', '得到第一版就结束', '会要求AI修改', '会比较多版结果', '会查证并说明取舍'],
  },
];

const abilityMeta = {
  creativity: { name: '创造与想象', module: 'AIGC创意／创意写作' },
  logic: { name: '逻辑与系统思维', module: '智能体／机器人' },
  cross: { name: '跨学科连接', module: '机器人／职业启蒙' },
  ai: { name: 'AI素养与人机协作', module: 'AIGC／智能体' },
  expression: { name: '表达沟通与叙事', module: '创意写作／商业启蒙' },
  iteration: { name: '专注执行与迭代', module: '机器人／项目实践' },
  social: { name: '社会洞察与价值判断', module: '商业／职业启蒙' },
};

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle('is-active', screen.id === id));
  const active = document.querySelector(`#${id} .result-scroll`);
  if (active) active.scrollTop = 0;
}

function appendMessage(text, role = 'ai') {
  const row = document.createElement('div');
  row.className = `message-row ${role}`;
  if (role === 'ai') {
    const avatar = document.createElement('div');
    avatar.className = 'ai-avatar';
    avatar.textContent = 'AI';
    row.appendChild(avatar);
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  row.appendChild(bubble);
  messageList.appendChild(row);
  requestAnimationFrame(() => { messageList.scrollTop = messageList.scrollHeight; });
}

function showTyping() {
  const row = document.createElement('div');
  row.className = 'message-row typing-row';
  row.innerHTML = '<div class="ai-avatar">AI</div><div class="bubble typing"><i></i><i></i><i></i></div>';
  messageList.appendChild(row);
  messageList.scrollTop = messageList.scrollHeight;
  return row;
}

function getPrompt(question) {
  return typeof question.prompt === 'function' ? question.prompt() : question.prompt;
}

function renderQuestion() {
  const question = questions[state.step];
  if (!question) return finishQuestions();
  state.selected = [];
  const typing = showTyping();
  answerDock.style.pointerEvents = 'none';
  window.setTimeout(() => {
    typing.remove();
    appendMessage(getPrompt(question));
    renderChoices(question);
    answerDock.style.pointerEvents = '';
  }, 430);
}

function renderChoices(question) {
  choiceList.innerHTML = '';
  confirmMulti.hidden = question.mode !== 'multi';
  question.choices.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';
    button.textContent = label;
    button.addEventListener('click', () => {
      if (question.mode === 'multi') {
        const has = state.selected.includes(label);
        if (!has && state.selected.length >= question.max) return showToast(`最多选择${question.max}项`);
        state.selected = has ? state.selected.filter((item) => item !== label) : [...state.selected, label];
        button.classList.toggle('is-selected', !has);
        confirmMulti.textContent = state.selected.length ? `确认选择（${state.selected.length}）` : '请至少选择1项';
      } else {
        saveAnswer(label);
      }
    });
    choiceList.appendChild(button);
  });
  requestAnimationFrame(() => { messageList.scrollTop = messageList.scrollHeight; });
}

function saveAnswer(value, extra = '') {
  const question = questions[state.step];
  state.answers[question.key] = value;
  if (extra) state.answers[`${question.key}Detail`] = extra;
  const display = Array.isArray(value) ? value.join('、') : value;
  appendMessage(extra ? `${display}。补充：${extra}` : display, 'user');
  choiceList.innerHTML = '';
  confirmMulti.hidden = true;
  detailComposer.hidden = true;
  detailInput.value = '';
  state.step += 1;
  window.setTimeout(renderQuestion, 180);
}

function finishQuestions() {
  answerDock.style.pointerEvents = 'none';
  answerDock.innerHTML = '<button class="primary-button" id="toInsightButton">查看这个职业正在发生什么变化 <span>→</span></button>';
  const typing = showTyping();
  window.setTimeout(() => {
    typing.remove();
    appendMessage(`谢谢您提供这些细节。我看到的不是一个固定标签，而是一组可以继续验证的能力线索。接下来先从“${state.answers.career}”开始，看AI会分担哪些任务、人的哪些能力反而更加重要。`);
    document.querySelector('#toInsightButton').addEventListener('click', buildInsight);
    answerDock.style.pointerEvents = '';
  }, 450);
}

function buildInsight() {
  const data = careerData[state.answers.career] || careerData['暂时没想过'];
  document.querySelector('#careerTitle').textContent = data.title;
  document.querySelector('#careerRisk').textContent = data.risk;
  document.querySelector('#careerLead').textContent = data.lead;
  document.querySelector('#careerInsight').textContent = data.insight;
  document.querySelector('#aiTaskList').innerHTML = data.ai.map((item) => `<li>${item}</li>`).join('');
  document.querySelector('#humanTaskList').innerHTML = data.human.map((item) => `<li>${item}</li>`).join('');
  showScreen('insightScreen');
}

function computeAbilities() {
  const scores = { creativity: 1, logic: 1, cross: 1, ai: 1, expression: 1, iteration: 1, social: 1 };
  const interests = state.answers.interests || [];
  const add = (key, value) => { scores[key] += value; };
  const interestMap = {
    '搭建／拆解': [['logic', 1.2], ['cross', .7]],
    '画画／设计': [['creativity', 1.3], ['expression', .5]],
    '讲故事／阅读': [['expression', 1.3], ['creativity', .7]],
    '数学／推理': [['logic', 1.4], ['iteration', .4]],
    '电脑／编程': [['logic', .8], ['ai', .8]],
    '动手实验': [['cross', 1.2], ['iteration', .8]],
    '策略闯关／虚拟探索': [['logic', 1], ['creativity', .6], ['cross', .4]],
    '体能挑战／团队竞技': [['iteration', 1.1], ['social', .9], ['expression', .4]],
    '帮助别人': [['social', 1.3], ['expression', .6]],
    '买卖／策划': [['social', 1.1], ['expression', .7]],
  };
  interests.forEach((interest) => (interestMap[interest] || []).forEach(([key, value]) => add(key, value)));
  const creationMap = {
    '照着完成就结束': [['iteration', .5]],
    '偶尔会改一点': [['creativity', .7], ['logic', .4]],
    '经常主动改造': [['creativity', 1.2], ['logic', .7], ['iteration', .5]],
    '会重新设计用途': [['creativity', 1.4], ['cross', .8], ['social', .6]],
  };
  (creationMap[state.answers.creation] || []).forEach(([key, value]) => add(key, value));
  const setbackMap = {
    '不会再继续': [],
    '马上找大人要答案': [['expression', .3]],
    '愿意再试两三次': [['iteration', .9], ['logic', .3]],
    '会换方法继续试': [['iteration', 1.3], ['logic', .8]],
    '会记录并比较原因': [['iteration', 1.5], ['logic', 1]],
  };
  (setbackMap[state.answers.setback] || []).forEach(([key, value]) => add(key, value));
  const aiMap = {
    '还没有使用过': [],
    '得到第一版就结束': [['ai', .4]],
    '会要求AI修改': [['ai', .9], ['creativity', .3]],
    '会比较多版结果': [['ai', 1.3], ['iteration', .5]],
    '会查证并说明取舍': [['ai', 1.6], ['logic', .6], ['social', .3]],
  };
  (aiMap[state.answers.aiUse] || []).forEach(([key, value]) => add(key, value));
  if (interests.length >= 3) add('cross', .6);
  return scores;
}

function evidenceFor(key) {
  const interests = (state.answers.interests || []).join('、');
  const evidence = {
    creativity: `您提到孩子喜欢“${interests || '尚待观察'}”，完成作品时“${state.answers.creation}”。`,
    logic: `孩子的兴趣包括“${interests || '尚待观察'}”，遇到失败时“${state.answers.setback}”。`,
    cross: `孩子会投入“${interests || '日常探索'}”，可以尝试把两种兴趣组合成一个小作品。`,
    ai: `孩子目前使用AI时“${state.answers.aiUse}”，下一步重点练习比较、判断和修改。`,
    expression: `孩子喜欢“${interests || '日常探索'}”，下一步让他用自己的话讲清作品怎么做、为什么这样改。`,
    iteration: `您提到孩子连续失败后“${state.answers.setback}”，这是判断迭代习惯的重要行为证据。`,
    social: `您最看重“${state.answers.reason}”，可以从帮助家人解决一个小问题开始练习观察需求。`,
  };
  return evidence[key];
}

function getDirections() {
  const data = careerData[state.answers.career] || careerData['暂时没想过'];
  const interests = state.answers.interests || [];
  const interestDirections = [];
  if (interests.includes('策略闯关／虚拟探索')) {
    interestDirections.push(['互动游戏与体验设计', '把规则、关卡、故事和用户反馈组合成可玩的互动体验']);
  }
  if (interests.includes('体能挑战／团队竞技')) {
    interestDirections.push(['运动科技与团队项目', '连接身体感知、数据记录、策略调整和团队协作']);
  }
  return [...interestDirections, ...data.directions]
    .filter((item, index, array) => array.findIndex((other) => other[0] === item[0]) === index)
    .slice(0, 3);
}

function getChallengePlan() {
  const interests = state.answers.interests || [];
  const featuredInterest = interests.find((item) => ['策略闯关／虚拟探索', '体能挑战／团队竞技'].includes(item)) || interests[0] || '创意';
  let title = `用“${featuredInterest}”完成一个三版作品`;
  let tasks = [
    '发现一个自己真想解决的小问题', '先做出第一版，不追求完美', '请AI或家人提出一个修改意见',
    '连续改到第三版并说出理由', '向一位家人展示，记录真实反馈',
  ];
  if (featuredInterest === '策略闯关／虚拟探索') {
    title = '把一次闯关体验改造成自己的互动挑战';
    tasks = [
      '选出最喜欢的一条游戏规则并说明原因', '改变一个目标、道具或关卡条件', '用纸笔或AI做出第一版玩法',
      '请一位家人试玩，再调整难度', '讲清三版变化和最终保留的规则',
    ];
  } else if (featuredInterest === '体能挑战／团队竞技') {
    title = '设计一次可以记录和复盘的团队挑战';
    tasks = [
      '选定一个安全、可重复的小挑战', '和家人一起确定目标与合作规则', '记录三次尝试的过程和结果',
      '根据记录调整一次动作或策略', '向家人复盘团队怎样配合得更好',
    ];
  }
  return { title, tasks };
}

function getResultModel() {
  const scores = computeAbilities();
  const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const strengths = ranking.slice(0, 3).map(([key]) => key);
  const growth = ranking.slice(-2).map(([key]) => key);
  const abilityItems = [
    ...strengths.slice(0, 2).map((key) => ({ key, type: '当前表现', grow: false })),
    ...growth.map((key) => ({ key, type: '建议培养', grow: true })),
    { key: 'social', type: strengths.includes('social') ? '当前表现' : '建议培养', grow: !strengths.includes('social') },
  ].filter((item, index, array) => array.findIndex((other) => other.key === item.key) === index).slice(0, 4);
  return {
    scores,
    strengths,
    growth,
    abilityItems,
    directions: getDirections(),
    challenge: getChallengePlan(),
    career: careerData[state.answers.career] || careerData['暂时没想过'],
  };
}

function buildResult() {
  const model = getResultModel();
  const pills = [state.answers.age, state.answers.career, ...(state.answers.interests || []).slice(0, 3)];
  document.querySelector('#profilePills').innerHTML = pills.map((item) => `<span>${item}</span>`).join('');

  document.querySelector('#abilityList').innerHTML = model.abilityItems.map(({ key, type, grow }) => `
    <article class="ability-item ${grow ? 'is-grow' : ''}">
      <div class="ability-top"><strong>${abilityMeta[key].name}</strong><span>${type}</span></div>
      <p class="evidence-quote">“${evidenceFor(key)}”</p>
      <p>${grow ? `先从${abilityMeta[key].module}的小项目开始，每周完成一次“做—改—讲”的闭环。` : `可以从${abilityMeta[key].module}的小任务继续发挥这项优势。`}</p>
    </article>
  `).join('');

  document.querySelector('#directionList').innerHTML = model.directions.map(([title, desc]) => `
    <article class="direction-item"><strong>${title}</strong><p>${desc}</p></article>
  `).join('');

  document.querySelector('#challengeTitle').textContent = model.challenge.title;
  document.querySelector('#challengeList').innerHTML = model.challenge.tasks.map((task, index) => `
    <label class="check-item"><input type="checkbox" data-index="${index}" /><span>${task}</span></label>
  `).join('');
  document.querySelectorAll('.check-item input').forEach((input) => input.addEventListener('change', updateChallenge));
  showScreen('resultScreen');
}

function updateChallenge() {
  const all = [...document.querySelectorAll('.check-item input')];
  const completed = all.filter((input) => input.checked).length;
  document.querySelector('#challengeProgress').textContent = `已完成 ${completed}/${all.length}`;
  document.querySelector('#challengeBar').style.width = `${(completed / all.length) * 100}%`;
}

function startFlow() {
  state.step = 0;
  state.answers = {};
  state.selected = [];
  state.started = true;
  messageList.innerHTML = '';
  answerDock.innerHTML = `
    <div class="choice-list" id="choiceList"></div>
    <button class="confirm-button" id="confirmMulti" hidden>确认选择</button>
    <button class="add-detail-button" id="addDetailButton">＋ 补充一句</button>
    <div class="detail-composer" id="detailComposer" hidden>
      <textarea id="detailInput" rows="2" maxlength="80" placeholder="可以补充一个孩子的日常表现（选填）"></textarea>
      <button id="submitDetail">发送</button>
    </div>`;
  rebindDock();
  showScreen('chatScreen');
  window.setTimeout(renderQuestion, 180);
}

function rebindDock() {
  choiceList = document.querySelector('#choiceList');
  confirmMulti = document.querySelector('#confirmMulti');
  detailComposer = document.querySelector('#detailComposer');
  detailInput = document.querySelector('#detailInput');
  const addButton = document.querySelector('#addDetailButton');
  const submitButton = document.querySelector('#submitDetail');
  addButton.addEventListener('click', () => {
    detailComposer.hidden = !detailComposer.hidden;
    if (!detailComposer.hidden) detailInput.focus();
    requestAnimationFrame(() => { messageList.scrollTop = messageList.scrollHeight; });
  });
  submitButton.addEventListener('click', () => {
    const value = detailInput.value.trim();
    if (!value) return;
    state.answers.notes = [...(state.answers.notes || []), value];
    appendMessage(`补充：${value}`, 'user');
    detailInput.value = '';
    detailComposer.hidden = true;
  });
  confirmMulti.addEventListener('click', () => {
    if (!state.selected.length) return showToast('请至少选择1项');
    saveAnswer([...state.selected]);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const chars = Array.from(String(text));
  const lines = [];
  let line = '';
  chars.forEach((char) => {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = visible[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length) last = last.slice(0, -1);
    visible[maxLines - 1] = `${last}…`;
  }
  visible.forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
  return y + visible.length * lineHeight;
}

function loadReportImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function createReportCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  return canvas;
}

function paintReportBase(ctx, pageNumber) {
  ctx.fillStyle = '#f3f7fd';
  ctx.fillRect(0, 0, 1240, 1754);
  ctx.fillStyle = '#0d55c9';
  ctx.fillRect(0, 0, 1240, 300);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 34px "Microsoft YaHei", sans-serif';
  ctx.fillText('AI时代 · 孩子未来职业推演', 80, 92);
  ctx.font = '800 62px "Microsoft YaHei", sans-serif';
  ctx.fillText(pageNumber === 1 ? '孩子能力推演报告' : '7天行动与体验建议', 80, 186);
  ctx.font = '400 25px "Microsoft YaHei", sans-serif';
  ctx.fillStyle = '#cfe2ff';
  ctx.fillText(pageNumber === 1 ? '看见当前优势，也找到下一步培养方向' : '把方向变成孩子可以亲手完成的小作品', 80, 242);
  ctx.textBaseline = 'alphabetic';
}

function drawReportPill(ctx, text, x, y) {
  ctx.font = '600 24px "Microsoft YaHei", sans-serif';
  const width = ctx.measureText(text).width + 42;
  roundedRect(ctx, x, y, width, 54, 27);
  ctx.fillStyle = '#e4efff';
  ctx.fill();
  ctx.fillStyle = '#215b9c';
  ctx.fillText(text, x + 21, y + 36);
  return width;
}

function drawReportCard(ctx, x, y, width, height, fill = '#ffffff', stroke = '#dbe7f6') {
  roundedRect(ctx, x, y, width, height, 24);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}

async function renderReportPages() {
  const model = getResultModel();
  const page1 = createReportCanvas();
  const ctx = page1.getContext('2d');
  paintReportBase(ctx, 1);

  let pillX = 80;
  [state.answers.age, state.answers.career, ...(state.answers.interests || []).slice(0, 3)].forEach((text) => {
    const width = drawReportPill(ctx, text, pillX, 336);
    pillX += width + 14;
  });

  drawReportCard(ctx, 80, 420, 1080, 190, '#fff8f2', '#ffd7ba');
  ctx.fillStyle = '#b85a19';
  ctx.font = '700 24px "Microsoft YaHei", sans-serif';
  ctx.fillText('您关注的职业正在发生什么变化', 115, 470);
  ctx.fillStyle = '#172e50';
  ctx.font = '700 31px "Microsoft YaHei", sans-serif';
  ctx.fillText(`${model.career.title} · ${model.career.risk}`, 115, 520);
  ctx.fillStyle = '#6d533e';
  ctx.font = '400 23px "Microsoft YaHei", sans-serif';
  wrapCanvasText(ctx, model.career.insight, 115, 565, 990, 34, 2);

  ctx.fillStyle = '#142a4b';
  ctx.font = '800 34px "Microsoft YaHei", sans-serif';
  ctx.fillText('当前表现与建议培养', 80, 680);
  model.abilityItems.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 80 + col * 550;
    const y = 720 + row * 280;
    drawReportCard(ctx, x, y, 530, 250, item.grow ? '#fff9f3' : '#ffffff', item.grow ? '#ffd9bd' : '#dbe7f6');
    ctx.fillStyle = item.grow ? '#b65b1d' : '#1765cb';
    ctx.font = '700 20px "Microsoft YaHei", sans-serif';
    ctx.fillText(item.type, x + 30, y + 45);
    ctx.fillStyle = '#142a4b';
    ctx.font = '800 29px "Microsoft YaHei", sans-serif';
    ctx.fillText(abilityMeta[item.key].name, x + 30, y + 89);
    ctx.fillStyle = '#536b89';
    ctx.font = '400 20px "Microsoft YaHei", sans-serif';
    wrapCanvasText(ctx, evidenceFor(item.key), x + 30, y + 130, 470, 31, 2);
    ctx.fillStyle = item.grow ? '#9a5526' : '#315d8e';
    ctx.font = '600 19px "Microsoft YaHei", sans-serif';
    const action = item.grow
      ? `建议：从${abilityMeta[item.key].module}的小项目开始。`
      : `发挥：在${abilityMeta[item.key].module}中继续做作品。`;
    wrapCanvasText(ctx, action, x + 30, y + 205, 470, 28, 2);
  });

  ctx.fillStyle = '#142a4b';
  ctx.font = '800 34px "Microsoft YaHei", sans-serif';
  ctx.fillText('可以探索的方向', 80, 1320);
  model.directions.forEach(([title, desc], index) => {
    const x = 80 + index * 365;
    drawReportCard(ctx, x, 1360, 345, 245);
    ctx.fillStyle = '#1765cb';
    ctx.font = '800 25px "Microsoft YaHei", sans-serif';
    wrapCanvasText(ctx, title, x + 26, 1410, 290, 34, 2);
    ctx.fillStyle = '#5f728c';
    ctx.font = '400 20px "Microsoft YaHei", sans-serif';
    wrapCanvasText(ctx, desc, x + 26, 1495, 290, 31, 3);
  });
  ctx.fillStyle = '#8b9bb0';
  ctx.font = '400 18px "Microsoft YaHei", sans-serif';
  ctx.fillText('第 1 / 2 页', 1058, 1695);

  const page2 = createReportCanvas();
  const ctx2 = page2.getContext('2d');
  paintReportBase(ctx2, 2);
  ctx2.fillStyle = '#142a4b';
  ctx2.font = '800 36px "Microsoft YaHei", sans-serif';
  wrapCanvasText(ctx2, model.challenge.title, 80, 380, 1080, 50, 2);
  model.challenge.tasks.forEach((task, index) => {
    const y = 475 + index * 112;
    drawReportCard(ctx2, 80, y, 1080, 88);
    ctx2.fillStyle = '#1765cb';
    ctx2.font = '800 25px "Microsoft YaHei", sans-serif';
    ctx2.fillText(String(index + 1).padStart(2, '0'), 112, y + 55);
    ctx2.fillStyle = '#243b5d';
    ctx2.font = '600 23px "Microsoft YaHei", sans-serif';
    wrapCanvasText(ctx2, task, 175, y + 54, 925, 32, 2);
  });

  drawReportCard(ctx2, 80, 1080, 1080, 520, '#fff8f2', '#ffd4b5');
  ctx2.fillStyle = '#b75a18';
  ctx2.font = '700 22px "Microsoft YaHei", sans-serif';
  ctx2.fillText('AIGC创意启蒙体验课', 120, 1140);
  ctx2.fillStyle = '#142a4b';
  ctx2.font = '800 39px "Microsoft YaHei", sans-serif';
  ctx2.fillText('让孩子亲手完成一次AI创作', 120, 1200);
  ctx2.fillStyle = '#6d533e';
  ctx2.font = '400 22px "Microsoft YaHei", sans-serif';
  wrapCanvasText(ctx2, '从孩子自己的想法出发，经历生成、判断和多轮修改，完成一个可以讲给别人听的作品。', 120, 1250, 630, 34, 4);
  ctx2.fillStyle = '#9a5526';
  ctx2.font = '700 22px "Microsoft YaHei", sans-serif';
  ctx2.fillText('扫码添加天马老师，了解体验安排', 120, 1415);
  ctx2.fillStyle = '#536b89';
  ctx2.font = '400 20px "Microsoft YaHei", sans-serif';
  ctx2.fillText('说明孩子的年龄和兴趣，获取适合的体验建议。', 120, 1460);
  ctx2.font = '700 22px "Microsoft YaHei", sans-serif';
  ctx2.fillStyle = '#142a4b';
  ctx2.fillText('天马老师 · 首新科技', 120, 1520);
  const qrImage = await loadReportImage('./assets/wecom-qr.jpg');
  ctx2.fillStyle = '#ffffff';
  roundedRect(ctx2, 800, 1180, 300, 300, 22);
  ctx2.fill();
  ctx2.drawImage(qrImage, 820, 1200, 260, 260);
  ctx2.fillStyle = '#8b9bb0';
  ctx2.font = '400 18px "Microsoft YaHei", sans-serif';
  ctx2.fillText('第 2 / 2 页', 1058, 1695);
  return [page1, page2];
}

function dataUrlBytes(dataUrl) {
  const binary = atob(dataUrl.split(',')[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  parts.forEach((part) => { result.set(part, offset); offset += part.length; });
  return result;
}

function buildImagePdf(canvases) {
  const encoder = new TextEncoder();
  const encode = (value) => encoder.encode(value);
  const objects = [];
  const pageRefs = canvases.map((_, index) => `${3 + index * 3} 0 R`).join(' ');
  objects[1] = encode('<< /Type /Catalog /Pages 2 0 R >>');
  objects[2] = encode(`<< /Type /Pages /Kids [${pageRefs}] /Count ${canvases.length} >>`);
  canvases.forEach((canvas, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const imageBytes = dataUrlBytes(canvas.toDataURL('image/jpeg', 0.9));
    const content = encode('q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ\n');
    objects[pageId] = encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects[imageId] = concatBytes([
      encode(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`),
      imageBytes,
      encode('\nendstream'),
    ]);
    objects[contentId] = concatBytes([encode(`<< /Length ${content.length} >>\nstream\n`), content, encode('endstream')]);
  });

  const parts = [encode('%PDF-1.4\n%âãÏÓ\n')];
  const offsets = [0];
  let length = parts[0].length;
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = length;
    const objectBytes = concatBytes([encode(`${id} 0 obj\n`), objects[id], encode('\nendobj\n')]);
    parts.push(objectBytes);
    length += objectBytes.length;
  }
  const xrefOffset = length;
  let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  xref += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(encode(xref));
  return new Blob(parts, { type: 'application/pdf' });
}

async function downloadPdfReport() {
  const button = document.querySelector('#pdfButton');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = '正在生成PDF…';
  try {
    const pages = await renderReportPages();
    const blob = buildImagePdf(pages);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '孩子未来职业推演报告.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast('PDF报告已保存');
  } catch (error) {
    showToast('生成失败，请刷新后再试');
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

document.querySelector('#startButton').addEventListener('click', startFlow);
document.querySelector('#restartButton').addEventListener('click', startFlow);
document.querySelectorAll('.restart-link').forEach((button) => button.addEventListener('click', startFlow));
document.querySelector('#backToIntro').addEventListener('click', () => showScreen('introScreen'));
document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showScreen(button.dataset.back)));
document.querySelector('#showAbilityButton').addEventListener('click', buildResult);
document.querySelector('#pdfButton').addEventListener('click', downloadPdfReport);

const courseDialog = document.querySelector('#courseDialog');
document.querySelector('#courseButton').addEventListener('click', () => courseDialog.showModal());
