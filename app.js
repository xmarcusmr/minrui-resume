const nav = document.querySelector('[data-nav]');
const menu = document.querySelector('.menu');
const glow = document.querySelector('.cursor-glow');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24), { passive: true });
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('pointermove', event => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });
document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(el);
});

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const decimal = target % 1 !== 0;
    const started = performance.now();
    const tick = now => {
      const progress = Math.min((now - started) / 1100, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimal ? 1 : 0);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('pointermove', event => {
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});

let activeLocale = 'zh';

const evidenceItems = [
  // 竖版证书：优先展示，并采用非原始文件顺序
  ['evidence-24.jpeg', 'HarmonyOS 应用开发者高级认证', '职业认证', '华为开发者学堂 · 2024 年 5 月 10 日'],
  ['evidence-01.png', '2026 Korea.net 韩国荣誉记者委任状', '官方委任', '韩国文化体育观光部 · 2026 年 5 月 12 日'],
  ['evidence-22.jpeg', '五四文艺汇演最佳团队奖', '团队荣誉', '作品《有我》· 江西生物科技职业学院 · 2024'],
  ['evidence-25.png', '东国大学奖学金证明', '奖学金', '东国大学 · 2025—2026 学年多项奖学金'],
  ['evidence-23.jpeg', '投资者教育答题测试通过证明', '专业学习', '复旦大学管理学院 × 蚂蚁财富 · 2024'],

  // 横版证书：奖项、认证、课程与学生工作交错呈现
  ['evidence-14.jpeg', '中国国际大学生创新大赛（2023）银奖', '国家级竞赛', '项目“预见新食尚——客家预制菜品牌产业化发展开拓者”'],
  ['evidence-12.jpeg', 'OpenAtom OpenHarmony 人才认证', '职业认证', 'Certified OpenHarmony Associate（OFCA）· 2025'],
  ['evidence-16.jpeg', '第九届江西省“互联网+”大学生创新创业大赛金奖', '省级竞赛', '职教赛道 · 客家预制菜项目 · 2023'],
  ['evidence-18.jpeg', '全省大学生“思政课，我想对你说”征文二等奖', '省级竞赛', '江西省教育厅 · 2023 年 6 月 21 日'],
  ['evidence-13.png', '轻型民用无人驾驶航空器安全操控理论培训合格证明', '职业认证', '中国民用航空局 · 2024 年 12 月 26 日'],
  ['evidence-20.jpeg', '红十字救护员证', '职业认证', '南昌县红十字会 · 2024 年 6 月 16 日'],
  ['evidence-21.jpeg', '全国计算机等级考试一级合格证书', '职业认证', '计算机基础及 Photoshop 应用 · 2024 年 9 月'],
  ['evidence-15.jpeg', '联合国儿童基金会月捐支持证明', '公益参与', 'UNICEF“月捐为儿童”项目 · 2021'],
  ['evidence-02.jpeg', '抗微生物药物优化课程参与证明', '国际课程', 'OpenWHO：基于能力的抗微生物药物优化模型 · 2023'],
  ['evidence-03.jpeg', '安全管理卫生课程成就记录', '国际课程', 'OpenWHO：For a healthier world: safely managed sanitation · 2023'],
  ['evidence-17.jpeg', '小动物保护科普活动参与证书', '志愿服务', '中国小动物保护协会'],
  ['evidence-10.jpeg', '阿里巴巴 3 小时公益平台证书', '公益参与', '累计公益时 13.9 小时 · 截至 2025 年 5 月 10 日'],
  ['evidence-06.jpeg', '五四红旗团支部', '集体荣誉', '2022 级计算机应用技术 2 班团支部 · 2024'],
  ['evidence-04.jpeg', '2023 年度优秀共青团员', '学生工作', '共青团江西生物科技职业学院委员会 · 2024'],
  ['evidence-09.jpeg', '2022 年度优秀共青团干部', '学生工作', '共青团江西生物科技职业学院委员会 · 2023'],
  ['evidence-07.jpeg', '2022—2023 学年优秀学生干部', '学生工作', '江西生物科技职业学院 · 2023'],
  ['evidence-33.jpeg', '2023—2024 学年优秀学生干部', '学生工作', '江西生物科技职业学院 · 2024'],
  ['evidence-05.jpeg', '2024 年度实践教学优秀学生', '实践学习', '江西生物科技职业学院 · 2025'],
  ['evidence-11.jpeg', '“中文在线杯”全国高职高专院校信息素养大赛校赛优秀奖', '校级竞赛', '江西生物科技职业学院图书馆 · 2023'],
  ['evidence-19.jpeg', '第七届全国高校大学生微电影展示活动短视频组三等奖', '国家级竞赛', '作品《传承红色基因 做新时代有为青年》· 2024'],
  ['evidence-31.jpeg', '暑期“三下乡”社会实践活动二等奖', '社会实践', '“红色铸魂”党史学习教育团 · 2023'],
  ['evidence-32.jpeg', '第九届中国国际“互联网+”大学生创新创业大赛校赛一等奖', '校级竞赛', '项目“客家食话——红色文化赋能客家美食产业先行者”· 2023'],
  ['evidence-26.jpeg', '信息工程系微团课大赛三等奖', '团队竞赛', '“未来之星队”《当代青年职业规划与自我成长》· 2023'],
  ['evidence-29.jpeg', '“习近平总书记与大学生在一起”学习分享活动优秀作品奖', '内容创作', '共青团江西生物科技职业学院委员会 · 2023'],
  ['evidence-28.jpeg', '“强国有我，告白祖国”主题活动一等奖', '校级竞赛', '作品《盛世华诞》· 2023'],
  ['evidence-30.jpeg', '“畅想之星电子图书阅读推广”阅读比赛三等奖', '阅读竞赛', '江西生物科技职业学院图书馆 × 北京畅想之星 · 2023'],
  ['evidence-27.jpeg', '“畅享四‘阅’天，等你来挑战”校赛三等奖', '阅读竞赛', '江西生物科技职业学院图书馆 · 2024'],
  ['evidence-08.jpeg', '冬季搏击培训“未来之星”称号', '体育训练', '一拳格斗健身训练中心 · 2021']
].map(([file, title, category, meta]) => ({ src: `assets/evidence/${file}`, title, category, meta }));

const evidenceTrack = document.querySelector('[data-evidence-track]');
if (evidenceTrack) {
  const counter = document.querySelector('[data-evidence-counter]');
  const caption = document.querySelector('[data-evidence-caption]');
  const progress = document.querySelector('[data-evidence-progress]');
  const viewer = document.querySelector('[data-evidence-viewer]');
  let evidenceIndex = 0;
  let touchStartX = 0;

  evidenceTrack.innerHTML = evidenceItems.map((item, index) => `
    <figure class="evidence-slide${index < 5 ? ' is-portrait' : ''}" aria-hidden="${index !== 0}">
      <div class="evidence-image"><img src="${item.src}" alt="${item.title}" ${index > 1 ? 'loading="lazy"' : ''} /></div>
      <figcaption>
        <span>${item.category.toUpperCase()}</span>
        <div><h3>${item.title}</h3><p>${item.meta}</p></div>
        <small>MATERIAL ${String(index + 1).padStart(2, '0')} / ${evidenceItems.length}</small>
      </figcaption>
    </figure>`).join('');

  const showEvidence = nextIndex => {
    evidenceIndex = (nextIndex + evidenceItems.length) % evidenceItems.length;
    evidenceTrack.style.transform = `translate3d(-${evidenceIndex * 100}%, 0, 0)`;
    evidenceTrack.querySelectorAll('.evidence-slide').forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== evidenceIndex)));
    counter.textContent = `${String(evidenceIndex + 1).padStart(2, '0')} / ${evidenceItems.length}`;
    caption.textContent = activeLocale === 'zh' ? evidenceItems[evidenceIndex].title : (i18n[activeLocale]?.[evidenceItems[evidenceIndex].title] || evidenceItems[evidenceIndex].title);
    progress.style.transform = `scaleX(${(evidenceIndex + 1) / evidenceItems.length})`;
  };

  document.querySelector('[data-evidence-prev]').addEventListener('click', () => showEvidence(evidenceIndex - 1));
  document.querySelector('[data-evidence-next]').addEventListener('click', () => showEvidence(evidenceIndex + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showEvidence(evidenceIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showEvidence(evidenceIndex + 1); }
  });
  viewer.addEventListener('touchstart', event => touchStartX = event.changedTouches[0].clientX, { passive: true });
  viewer.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showEvidence(evidenceIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
  showEvidence(0);
}

const i18n = {
  en: {
    '关于':'About','教育':'Education','实践':'Practice','荣誉':'Honors','佐证':'Evidence','结语':'Epilogue',
    '有结果意识，':'Results-minded, ','也保留好奇心。':'yet always curious.',
    '好的工作不只是“完成任务”，而是理解人、协调资源，再让结果发生。':'Good work is more than completing tasks—it means understanding people, aligning resources, and making outcomes happen.',
    '查看代表项目':'Selected work','与我聊聊':'Let’s talk',
    'PROFILE / 个人档案':'PROFILE / ABOUT',
    '“真正的影响力，始于理解差异，':'“Real influence begins with understanding differences,',
    '成于让不同的人走向同一个目标。”':'and grows by bringing different people toward a shared goal.”',
    '东国大学经营学学士、全球革新经营硕士研究生。曾入选韩国政府官方全球传播项目 Korea.net Honorary Reporter，并在 APEC 峰会、跨文化公共服务与商业运营中持续实践。':'Business Administration graduate and Global Innovation Management master’s student at Dongguk University. Selected as a Korea.net Honorary Reporter, with experience in APEC, cross-cultural public service, and business operations.',
    '我关注国际传播、用户洞察与组织协作，也相信技术的价值不在炫技，而在于让真实问题更快被解决。':'I focus on global communication, user insight, and organizational collaboration. I believe technology matters when it solves real problems faster.',
    '项荣誉':'honors &','与奖项':'awards','职业技能':'professional','证书':'certificates','大学':'university','奖学金':'scholarships','专业前 6%':'Top 6%',
    'EDUCATION / 教育背景':'EDUCATION',
    '从技术基础，走向':'From a technical foundation to ','全球商业视野。':'a global business perspective.',
    '教育于我不是履历上的阶段，而是一条持续拓宽认知、表达与行动边界的路径。':'Education is not merely a stage on my résumé, but a path that continually expands how I think, communicate, and act.',
    '韩国东国大学':'Dongguk University','江西生物科技职业学院':'Jiangxi Biotech Vocational College','江西省重点专科院校':'A key vocational college in Jiangxi',
    '经营学（本科）＋ 全球革新经营（硕士）':'Business Administration (B.A.) + Global Innovation Management (M.A.)',
    '计算机应用技术专业 · 专科':'Computer Application Technology · Associate Degree','核心课程':'CORE COURSES',
    'PRACTICE & PROJECTS / 实践与项目':'PRACTICE & PROJECTS',
    '在真实现场，':'In real-world settings, ','把责任变成行动。':'turn responsibility into action.',
    '国际传播、跨文化公共服务、商业创新与技术实践，共同构成我的行动轨迹。':'International communication, cross-cultural service, business innovation, and technology shape my path of action.',
    '韩国荣誉记者':'Korea.net Honorary Reporter','中国志愿者小组组长':'Chinese Volunteer Team Leader','留学生志愿队员':'International Student Volunteer',
    '韩国庆州留学生公安服务队':'Gyeongju International Student Police Service Team','团中央“文化、科技、卫生”三下乡':'Youth League “Three Rural Services” Program',
    '“红色铸魂”党史学习教育团 · 团队成员':'“Red Heritage” Party History Education Team · Member','项目经历':'PROJECT EXPERIENCE',
    '江妈妈客家美食':'Jiang Mama Hakka Cuisine','预制菜数字化转型研究':'Prepared-food Digital Transformation Research','智兽医':'Smart Veterinary','人工智能辅助兽医诊断系统':'AI-assisted Veterinary Diagnosis System',
    'HONORS & AWARDS / 荣誉成果':'HONORS & AWARDS','被看见的成果，':'Visible achievements ','来自长期行动。':'come from sustained action.',
    '涵盖创新创业、思想教育与学业表现的重要荣誉。':'Key honors spanning innovation, public education, and academic performance.',
    'JOURNEY / 经历轨迹':'JOURNEY','身份会变化，':'Roles may change, ','主线始终清晰。':'but the direction stays clear.',
    '学习、实践、表达——把每次进入陌生环境，都变成拓宽边界的机会。':'Learning, practicing, expressing—turning every unfamiliar setting into a chance to expand my boundaries.',
    'CAPABILITIES / 能力坐标':'CAPABILITIES','我不把能力视作孤立标签。它们更像一组彼此连接的工具，在不同场景里组合出答案。':'I see capabilities not as isolated labels, but as connected tools that combine into answers in different contexts.',
    '国际传播与内容策划':'Global Communication & Content','商业运营与用户洞察':'Business Operations & User Insight','组织统筹与公共服务':'Coordination & Public Service','AI 工具与视觉表达':'AI Tools & Visual Communication',
    'SUPPORTING MATERIALS / 佐证材料':'SUPPORTING MATERIALS','让每一份经历，':'Every experience ','都有据可循。':'is backed by evidence.',
    '官方委任、国际学习、职业认证、竞赛成果与学生工作荣誉。':'Official appointments, international learning, professional certifications, awards, and student leadership honors.',
    '“我们不停地看书，不停地走路，':'“We keep reading, and we keep walking,','看日月星辰和山川大海。':'watching the sun, moon, stars, mountains, rivers, and seas.','它们与前途无关，但它们教会我思考。”':'They may not define our future, but they teach us how to think.”',
    '且行且思考，我思故我在。':'To move is to reflect; I think, therefore I am.',
    '无论是项目合作、工作机会，还是仅仅想打个招呼交个朋友，我都随时欢迎！':'Whether it’s a project, a job opportunity, or simply a hello—I’m always happy to connect.',
    'BACK TO TOP ↑':'BACK TO TOP ↑'
  },
  ko: {
    '关于':'소개','教育':'학력','实践':'경험','荣誉':'수상','佐证':'자료','结语':'맺음말',
    '有结果意识，':'결과를 생각하면서도, ','也保留好奇心。':'호기심을 잃지 않습니다.',
    '好的工作不只是“完成任务”，而是理解人、协调资源，再让结果发生。':'좋은 일은 단순히 과제를 끝내는 것이 아니라, 사람을 이해하고 자원을 조율해 결과를 만들어 내는 것입니다.',
    '查看代表项目':'주요 프로젝트','与我聊聊':'이야기 나누기',
    'PROFILE / 个人档案':'PROFILE / 소개',
    '“真正的影响力，始于理解差异，':'“진정한 영향력은 차이를 이해하는 데서 시작되고,',
    '成于让不同的人走向同一个目标。”':'서로 다른 사람들이 하나의 목표로 나아갈 때 완성됩니다.”',
    '东国大学经营学学士、全球革新经营硕士研究生。曾入选韩国政府官方全球传播项目 Korea.net Honorary Reporter，并在 APEC 峰会、跨文化公共服务与商业运营中持续实践。':'동국대학교 경영학 학사 및 글로벌혁신경영 석사과정. Korea.net 명예기자로 선발되었으며 APEC, 다문화 공공서비스, 비즈니스 운영 현장에서 경험을 쌓았습니다.',
    '我关注国际传播、用户洞察与组织协作，也相信技术的价值不在炫技，而在于让真实问题更快被解决。':'국제소통, 사용자 인사이트, 조직 협업에 관심이 있으며 기술의 가치는 실제 문제를 더 빠르게 해결하는 데 있다고 믿습니다.',
    '项荣誉':'개 이상의','与奖项':'수상','职业技能':'전문 역량','证书':'자격증','大学':'대학','奖学金':'장학금','专业前 6%':'전공 상위 6%',
    'EDUCATION / 教育背景':'EDUCATION / 학력','从技术基础，走向':'기술적 기반에서 ','全球商业视野。':'글로벌 비즈니스 시야로.',
    '教育于我不是履历上的阶段，而是一条持续拓宽认知、表达与行动边界的路径。':'교육은 이력서의 한 단계가 아니라 사고와 표현, 행동의 경계를 계속 넓혀 가는 과정입니다.',
    '韩国东国大学':'동국대학교','江西生物科技职业学院':'장시생물과학기술직업대학','江西省重点专科院校':'장시성 중점 전문대학',
    '经营学（本科）＋ 全球革新经营（硕士）':'경영학 학사 + 글로벌혁신경영 석사','计算机应用技术专业 · 专科':'컴퓨터응용기술 · 전문학사','核心课程':'주요 과목',
    'PRACTICE & PROJECTS / 实践与项目':'PRACTICE & PROJECTS / 경험과 프로젝트','在真实现场，':'실제 현장에서, ','把责任变成行动。':'책임을 행동으로 바꿉니다.',
    '国际传播、跨文化公共服务、商业创新与技术实践，共同构成我的行动轨迹。':'국제소통, 다문화 공공서비스, 비즈니스 혁신과 기술 실천이 저의 경험을 구성합니다.',
    '韩国荣誉记者':'Korea.net 명예기자','中国志愿者小组组长':'중국인 자원봉사팀 팀장','留学生志愿队员':'유학생 자원봉사대원','韩国庆州留学生公安服务队':'경주 외국인 유학생 치안봉사대',
    '团中央“文化、科技、卫生”三下乡':'중국 공청단 농촌 사회봉사 프로그램','“红色铸魂”党史学习教育团 · 团队成员':'당사 학습교육팀 · 팀원','项目经历':'프로젝트 경험',
    '江妈妈客家美食':'장마마 하카 음식','预制菜数字化转型研究':'간편식 디지털 전환 연구','智兽医':'스마트 수의사','人工智能辅助兽医诊断系统':'AI 보조 수의 진단 시스템',
    'HONORS & AWARDS / 荣誉成果':'HONORS & AWARDS / 수상','被看见的成果，':'눈에 보이는 성과는 ','来自长期行动。':'꾸준한 실천에서 옵니다.',
    '涵盖创新创业、思想教育与学业表现的重要荣誉。':'혁신창업, 교육, 학업성과에 걸친 주요 수상 내역입니다.',
    'JOURNEY / 经历轨迹':'JOURNEY / 여정','身份会变化，':'역할은 바뀌어도, ','主线始终清晰。':'방향은 늘 분명합니다.',
    '学习、实践、表达——把每次进入陌生环境，都变成拓宽边界的机会。':'배움, 실천, 표현—낯선 환경을 마주할 때마다 경계를 넓히는 기회로 만듭니다.',
    'CAPABILITIES / 能力坐标':'CAPABILITIES / 역량','我不把能力视作孤立标签。它们更像一组彼此连接的工具，在不同场景里组合出答案。':'역량은 고립된 꼬리표가 아니라 상황에 따라 답을 만드는 서로 연결된 도구입니다.',
    '国际传播与内容策划':'국제소통 및 콘텐츠 기획','商业运营与用户洞察':'비즈니스 운영 및 사용자 인사이트','组织统筹与公共服务':'조직 조율 및 공공서비스','AI 工具与视觉表达':'AI 도구 및 시각 커뮤니케이션',
    'SUPPORTING MATERIALS / 佐证材料':'SUPPORTING MATERIALS / 증빙자료','让每一份经历，':'모든 경험에는 ','都有据可循。':'근거가 있습니다.',
    '官方委任、国际学习、职业认证、竞赛成果与学生工作荣誉。':'공식 위촉, 국제학습, 전문자격, 대회 수상 및 학생활동 자료입니다.',
    '“我们不停地看书，不停地走路，':'“우리는 계속 책을 읽고, 계속 길을 걸으며,','看日月星辰和山川大海。':'해와 달과 별, 산과 강과 바다를 바라봅니다.','它们与前途无关，但它们教会我思考。”':'그것들은 진로와 무관할지 몰라도, 생각하는 법을 가르쳐 줍니다.”',
    '且行且思考，我思故我在。':'걷고 사유합니다. 나는 생각한다, 고로 존재한다.',
    '无论是项目合作、工作机会，还是仅仅想打个招呼交个朋友，我都随时欢迎！':'프로젝트 협업, 채용 기회, 혹은 가벼운 인사와 만남까지 언제든 환영합니다!'
  }
};

const originalText = new WeakMap();
const translatePage = locale => {
  activeLocale = locale;
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('script, style')) continue;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const trimmed = source.trim();
    const translated = locale === 'zh' ? trimmed : i18n[locale]?.[trimmed];
    if (translated !== undefined) node.nodeValue = source.replace(trimmed, translated);
    else node.nodeValue = source;
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.classList.toggle('active', button.dataset.lang === locale));
  const activeSlide = document.querySelector('.evidence-slide[aria-hidden="false"]');
  if (activeSlide) {
    const title = originalText.get(activeSlide.querySelector('h3').firstChild) || activeSlide.querySelector('h3').textContent;
    const liveCaption = document.querySelector('[data-evidence-caption]');
    liveCaption.textContent = locale === 'zh' ? title.trim() : (i18n[locale]?.[title.trim()] || title.trim());
  }
  try { localStorage.setItem('portfolio-language', locale); } catch {}
};

document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => translatePage(button.dataset.lang)));
let savedLocale = 'zh';
try { savedLocale = localStorage.getItem('portfolio-language') || 'zh'; } catch {}
translatePage(['zh','en','ko'].includes(savedLocale) ? savedLocale : 'zh');

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  document.querySelectorAll('.marquee div, .orb, .data-ring::before').forEach(el => el.style.animation = 'none');
}
