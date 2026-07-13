/* 横向知识图谱：概念定义、出处、公式与案例 */

export const KNOWLEDGE = {
  四柱: {
    name: '四柱',
    definition: '年柱、月柱、日柱、时柱，每柱由一天干与一地支组成，共八个字，俗称“八字”。',
    source: '《三命通会》',
    formula: '年柱 = 立春换岁；月柱 = 节气换月；日柱 = 太阳日干支；时柱 = 日干起时。',
    related: ['天干', '地支', '日主', '八字'],
    examples: [{ chart: '1990-03-15 14:30', result: '庚午 己卯 己卯 辛未', reason: '以标准万年历换算' }]
  },
  八字: {
    name: '八字',
    definition: '四柱共八个字，是命理分析的基础数据。',
    source: '子平派',
    formula: '八字 = 年干+年支+月干+月支+日干+日支+时干+时支。',
    related: ['四柱', '日主', '干支'],
    examples: [{ chart: '甲子年丙寅月壬子日辛亥时', result: '八个字', reason: '四柱展开' }]
  },
  天干: {
    name: '天干',
    definition: '甲、乙、丙、丁、戊、己、庚、辛、壬、癸，共十个，分阴阳五行。',
    source: '《五行大义》',
    formula: '阳干：甲丙戊庚壬；阴干：乙丁己辛癸。',
    related: ['地支', '五行', '日主'],
    examples: [{ chart: '日干壬', result: '阳水', reason: '壬为阳干，五行属水' }]
  },
  地支: {
    name: '地支',
    definition: '子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥，共十二个。',
    source: '《五行大义》',
    formula: '地支藏干：本气、中气、余气。',
    related: ['天干', '藏干', '生肖'],
    examples: [{ chart: '申', result: '庚壬戊', reason: '申中藏庚金本气、壬水中气、戊土余气' }]
  },
  日主: {
    name: '日主',
    definition: '四柱中日柱的天干，代表命主自己，是十神判断的基准。',
    source: '《子平真诠》',
    formula: '日主 = 日柱天干。',
    related: ['日柱', '十神', '强弱判断'],
    examples: [{ chart: '日柱壬申', result: '壬水日主', reason: '日柱天干为壬' }]
  },
  十神: {
    name: '十神',
    definition: '以日主为中心，与其他干支生克关系产生的十种角色。',
    source: '《子平真诠》',
    formula: '同我：比肩、劫财；我生：食神、伤官；我克：偏财、正财；克我：七杀、正官；生我：偏印、正印。',
    related: ['日主', '藏干', '格局'],
    examples: [{ chart: '日主壬水', result: '庚=偏印，辛=正印', reason: '金生水，庚为阳同阴阳为偏印，辛为阴异阴阳为正印' }]
  },
  藏干: {
    name: '藏干',
    definition: '地支中隐藏的天干，分本气、中气、余气。',
    source: '《渊海子平》',
    formula: '每个地支藏一干到三干，按力量权重分配。',
    related: ['地支', '十神', '根气'],
    examples: [{ chart: '午', result: '丁本气、己中气', reason: '通用藏干表' }]
  },
  神煞: {
    name: '神煞',
    definition: '基于干支特定组合判定的吉凶标签系统，与五行生克并行。',
    source: '《三命通会》',
    formula: '查表法：如天乙贵人按日干查地支，驿马按年支三合查对冲。',
    related: ['天乙贵人', '驿马', '桃花', '华盖'],
    examples: [{ chart: '壬日卯在月支', result: '天乙贵人', reason: '壬日贵人在卯、巳' }]
  },
  得令: {
    name: '得令',
    definition: '月令五行生助日主或与日主同五行。',
    source: '《子平真诠》论用神',
    formula: '月令元素 = 日主元素，或月令生日主 → 得令。',
    related: '得地, 得势, 得助, 月令'.split(', '),
    examples: [{ chart: '甲木日主生于寅月', result: '得令', reason: '寅为木，同五行' }]
  },
  得地: {
    name: '得地',
    definition: '地支藏干中有日主根气（同五行或同干）。',
    source: '《滴天髓》',
    formula: '地支藏干含日主本气 → 强根；含中气/余气 → 弱根。',
    related: '得令, 得势, 得助, 藏干'.split(', '),
    examples: [{ chart: '壬水日主见申中壬', result: '得地', reason: '申中藏壬水中气' }]
  },
  得势: {
    name: '得势',
    definition: '天干中出现日主同类或生助日主的五行。',
    source: '《滴天髓》',
    formula: '天干中比劫/印星数量 ≥ 2 → 得势。',
    related: '得令, 得地, 得助, 天干'.split(', '),
    examples: [{ chart: '天干庚壬同现', result: '得势', reason: '庚为偏印、壬为比肩' }]
  },
  得助: {
    name: '得助',
    definition: '天干有印星直接生扶日主。',
    source: '《滴天髓》',
    formula: '天干有生日主的五行 → 得助。',
    related: '得令, 得地, 得势, 印星'.split(', '),
    examples: [{ chart: '庚金生壬水', result: '得助', reason: '庚为壬之偏印' }]
  },
  合化: {
    name: '合化',
    definition: '两个天干或地支相合后转化为新的五行。',
    source: '《子平真诠》',
    formula: '天干五合：甲己合土、乙庚合金、丙辛合水、丁壬合木、戊癸合火。',
    related: '六合, 三合, 三会, 六冲'.split(', '),
    examples: [{ chart: '丁壬同现', result: '丁壬合木', reason: '天干五合' }]
  },
  大运: {
    name: '大运',
    definition: '每十年一柱的运势，按年干阴阳与性别顺排或逆排。',
    source: '《三命通会》',
    formula: '阳年男/阴年女顺排；阴年男/阳年女逆排。起运岁数 = 到最近节气的天数 / 3。',
    related: '流年, 月柱, 起运'.split(', '),
    examples: [{ chart: '庚午年男', result: '顺排', reason: '庚为阳干，男命顺排' }]
  },
  流年: {
    name: '流年',
    definition: '当年的干支，反映一年的运势。',
    source: '子平派',
    formula: '流年 = 当年干支。',
    related: ['大运', '太岁'],
    examples: [{ chart: '2026年', result: '丙午', reason: '按六十甲子推算' }]
  },
  格局: {
    name: '格局',
    definition: '以月令透干或主气定出的命局结构分类。',
    source: '《子平真诠》',
    formula: '先看月令藏干，若主气或透干对应的十神为格。',
    related: ['用神', '月令', '十神'],
    examples: [{ chart: '月令卯中乙，月干透己', result: '伤官/正官格，需结合日主', reason: '以日主定十神' }]
  },
  用神: {
    name: '用神',
    definition: '对命局最有利的五行，用于平衡日主强弱。',
    source: '《子平真诠》',
    formula: '身强喜克泄耗；身弱喜生扶。',
    related: ['忌神', '喜神', '日主强弱'],
    examples: [{ chart: '壬水身弱', result: '用神水', reason: '比劫帮身' }]
  },
  忌神: {
    name: '忌神',
    definition: '对命局最不利的五行，会加重失衡。',
    source: '《子平真诠》',
    formula: '身强忌印比；身弱忌克泄耗。',
    related: ['用神', '喜神', '五行'],
    examples: [{ chart: '壬水身弱', result: '忌神土', reason: '土克水，官杀克身' }]
  },
  五行: {
    name: '五行',
    definition: '木、火、土、金、水，构成命理力量的基本单位。',
    source: '《尚书·洪范》',
    formula: '相生：木→火→土→金→水→木；相克：木→土→水→火→金→木。',
    related: ['天干', '地支', '用神'],
    examples: [{ chart: '庚=金，壬=水', result: '金生水', reason: '五行相生' }]
  },
  真太阳时: {
    name: '真太阳时',
    definition: '根据出生地经度调整后的本地太阳时间，用于精确排盘。',
    source: '天文历法',
    formula: '真太阳时 = 平太阳时 + (120° - 经度) × 4分钟。',
    related: ['排盘', '经度', '时辰'],
    examples: [{ chart: '116.4°E, 14:30', result: '校正 -14分钟', reason: '120°-116.4°=3.6°, 3.6×4=14.4' }]
  },
  节气: {
    name: '节气',
    definition: '二十四节气中的“节”用于划分年、月干支。',
    source: '《历象考成》',
    formula: '立春换年；惊蛰、清明、立夏等十二节换月。',
    related: ['排盘', '月柱', '大运'],
    examples: [{ chart: '3月15日在惊蛰与清明之间', result: '卯月', reason: '惊蛰后为卯月' }]
  },
  干支: {
    name: '干支',
    definition: '天干地支的合称，用于纪年、纪月、纪日、纪时。',
    source: '《五行大义》',
    formula: '六十甲子循环：天干10与地支12的最小公倍数为60。',
    related: ['天干', '地支', '四柱'],
    examples: [{ chart: '甲子', result: '六十甲子之首', reason: '甲为天干首，子为地支首' }]
  },
  月令: {
    name: '月令',
    definition: '月柱地支，代表当前季节五行力量，对日主影响最大。',
    source: '《子平真诠》',
    formula: '月令 = 月柱地支。',
    related: ['得令', '格局', '月柱'],
    examples: [{ chart: '月支卯', result: '春季木旺', reason: '寅卯辰为春' }]
  },
  比肩: {
    name: '比肩',
    definition: '与日干同五行同阴阳的干。',
    source: '子平派',
    formula: '同我且同阴阳 → 比肩。',
    related: ['劫财', '日主', '比劫'],
    examples: [{ chart: '日主壬水见壬', result: '比肩', reason: '同为阳水' }]
  },
  劫财: {
    name: '劫财',
    definition: '与日干同五行异阴阳的干。',
    source: '子平派',
    formula: '同我且异阴阳 → 劫财。',
    related: ['比肩', '日主', '比劫'],
    examples: [{ chart: '日主壬水见癸', result: '劫财', reason: '同为水，癸为阴' }]
  },
  食神: {
    name: '食神',
    definition: '日主所生且同阴阳的干。',
    source: '子平派',
    formula: '我生且同阴阳 → 食神。',
    related: ['伤官', '日主', '食伤'],
    examples: [{ chart: '日主壬水见甲', result: '食神', reason: '壬水生甲木，同阴阳' }]
  },
  伤官: {
    name: '伤官',
    definition: '日主所生且异阴阳的干。',
    source: '子平派',
    formula: '我生且异阴阳 → 伤官。',
    related: ['食神', '日主', '食伤'],
    examples: [{ chart: '日主壬水见乙', result: '伤官', reason: '壬水生乙木，异阴阳' }]
  },
  偏财: {
    name: '偏财',
    definition: '日主所克且同阴阳的干。',
    source: '子平派',
    formula: '我克且同阴阳 → 偏财。',
    related: ['正财', '日主', '财星'],
    examples: [{ chart: '日主壬水见丙', result: '偏财', reason: '壬水克丙火，同阴阳' }]
  },
  正财: {
    name: '正财',
    definition: '日主所克且异阴阳的干。',
    source: '子平派',
    formula: '我克且异阴阳 → 正财。',
    related: ['偏财', '日主', '财星'],
    examples: [{ chart: '日主壬水见丁', result: '正财', reason: '壬水克丁火，异阴阳' }]
  },
  七杀: {
    name: '七杀',
    definition: '克日主且同阴阳的干。',
    source: '子平派',
    formula: '克我且同阴阳 → 七杀。',
    related: ['正官', '日主', '官杀'],
    examples: [{ chart: '日主壬水见戊', result: '七杀', reason: '戊土克壬水，同阴阳' }]
  },
  正官: {
    name: '正官',
    definition: '克日主且异阴阳的干。',
    source: '子平派',
    formula: '克我且异阴阳 → 正官。',
    related: ['七杀', '日主', '官杀'],
    examples: [{ chart: '日主壬水见己', result: '正官', reason: '己土克壬水，异阴阳' }]
  },
  偏印: {
    name: '偏印',
    definition: '生日主且同阴阳的干。',
    source: '子平派',
    formula: '生我且同阴阳 → 偏印。',
    related: ['正印', '日主', '印星'],
    examples: [{ chart: '日主壬水见庚', result: '偏印', reason: '庚金生壬水，同阴阳' }]
  },
  正印: {
    name: '正印',
    definition: '生日主且异阴阳的干。',
    source: '子平派',
    formula: '生我且异阴阳 → 正印。',
    related: ['偏印', '日主', '印星'],
    examples: [{ chart: '日主壬水见辛', result: '正印', reason: '辛金属水，异阴阳' }]
  },
  天乙贵人: {
    name: '天乙贵人',
    definition: '最吉之神，主遇难呈祥、贵人提携。',
    source: '《三命通会》',
    formula: '甲戊见牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，庚辛逢虎马。',
    related: ['神煞', '天德贵人', '月德贵人'],
    examples: [{ chart: '壬日见卯', result: '天乙贵人', reason: '壬日贵人位在卯、巳' }]
  },
  驿马: {
    name: '驿马',
    definition: '主变动、迁移、远行。',
    source: '《三命通会》',
    formula: '寅午戌马在申，申子辰马在寅，亥卯未马在巳，巳酉丑马在亥。',
    related: ['神煞', '将星', '变动'],
    examples: [{ chart: '午年见申', result: '驿马', reason: '寅午戌局驿马在申' }]
  },
  桃花: {
    name: '桃花',
    definition: '主人缘、感情、魅力。',
    source: '《三命通会》',
    formula: '申子辰桃花在酉，寅午戌桃花在卯，亥卯未桃花在子，巳酉丑桃花在午。',
    related: ['神煞', '红鸾', '天喜'],
    examples: [{ chart: '午年见卯', result: '桃花', reason: '寅午戌局桃花在卯' }]
  },
  华盖: {
    name: '华盖',
    definition: '主宗教、哲学、艺术、孤独。',
    source: '《三命通会》',
    formula: '寅午戌华盖在戌，申子辰华盖在辰，亥卯未华盖在未，巳酉丑华盖在丑。',
    related: ['神煞', '孤辰', '寡宿'],
    examples: [{ chart: '午年见戌', result: '华盖', reason: '寅午戌局华盖在戌' }]
  },
  禄神: {
    name: '禄神',
    definition: '主衣食福禄，天干临官位。',
    source: '《三命通会》',
    formula: '甲禄在寅，乙禄在卯，丙戊禄在巳，丁己禄在午，庚禄在申，辛禄在酉，壬禄在亥，癸禄在子。',
    related: ['神煞', '天乙贵人', '食神'],
    examples: [{ chart: '壬水见亥', result: '禄神', reason: '壬禄在亥' }]
  },
  文昌: {
    name: '文昌',
    definition: '主学业、才华、考试。',
    source: '《三命通会》',
    formula: '甲→巳，乙→午，丙戊→申，丁己→酉，庚→亥，辛→子，壬→寅，癸→卯。',
    related: ['神煞', '学堂', '天乙贵人'],
    examples: [{ chart: '壬水见寅', result: '文昌', reason: '壬日文昌在寅' }]
  },
  将星: {
    name: '将星',
    definition: '主权威、领导力、组织才能。',
    source: '《三命通会》',
    formula: '寅午戌将星在午，申子辰将星在子，亥卯未将星在卯，巳酉丑将星在酉。',
    related: ['神煞', '驿马', '权力'],
    examples: [{ chart: '午年见午', result: '将星', reason: '寅午戌局将星在午' }]
  },
  孤辰寡宿: {
    name: '孤辰寡宿',
    definition: '主孤独、迟婚、异乡。',
    source: '《三命通会》',
    formula: '亥子丑孤辰在寅、寡宿在戌；寅卯辰孤辰在巳、寡宿在丑；巳午未孤辰在申、寡宿在辰；申酉戌孤辰在亥、寡宿在未。',
    related: ['神煞', '华盖', '桃花'],
    examples: [{ chart: '午年见申', result: '孤辰', reason: '巳午未局孤辰在申' }]
  },
  劫煞: {
    name: '劫煞',
    definition: '主波动、是非、耗损。',
    source: '《三命通会》',
    formula: '申子辰劫煞在巳，寅午戌劫煞在亥，亥卯未劫煞在申，巳酉丑劫煞在寅。',
    related: ['神煞', '亡神', '是非'],
    examples: [{ chart: '午年见亥', result: '劫煞', reason: '寅午戌局劫煞在亥' }]
  },
  亡神: {
    name: '亡神',
    definition: '主暗昧、耗损、虚惊。',
    source: '《三命通会》',
    formula: '申子辰亡神在亥，寅午戌亡神在巳，亥卯未亡神在寅，巳酉丑亡神在申。',
    related: ['神煞', '劫煞', '暗昧'],
    examples: [{ chart: '午年见巳', result: '亡神', reason: '寅午戌局亡神在巳' }]
  },
  天德贵人: {
    name: '天德贵人',
    definition: '化解灾厄、逢凶化吉。',
    source: '《三命通会》',
    formula: '寅月丁、卯月申、辰月壬、巳月辛、午月甲、未月癸、申月寅、酉月丙、戌月乙、亥月己、子月庚、丑月庚。',
    related: ['神煞', '月德贵人', '天乙贵人'],
    examples: [{ chart: '卯月见申', result: '天德贵人', reason: '卯月天德在申' }]
  },
  月德贵人: {
    name: '月德贵人',
    definition: '化解灾厄、主阴德。',
    source: '《三命通会》',
    formula: '寅午戌月丙，亥卯未月甲，申子辰月壬，巳酉丑月庚。',
    related: ['神煞', '天德贵人', '天乙贵人'],
    examples: [{ chart: '卯月见甲', result: '月德贵人', reason: '亥卯未局月德在甲' }]
  },
  红鸾: {
    name: '红鸾',
    definition: '主婚姻喜庆。',
    source: '《三命通会》',
    formula: '年支的对冲前一支，如子年红鸾在卯。',
    related: ['神煞', '天喜', '桃花'],
    examples: [{ chart: '午年见酉', result: '红鸾', reason: '午年红鸾在酉' }]
  },
  天喜: {
    name: '天喜',
    definition: '主喜庆、良缘。',
    source: '《三命通会》',
    formula: '红鸾的对冲位。',
    related: ['神煞', '红鸾', '桃花'],
    examples: [{ chart: '红鸾酉则天喜卯', result: '天喜', reason: '卯酉对冲' }]
  },
  元辰: {
    name: '元辰',
    definition: '主是非、官非、波折。',
    source: '《三命通会》',
    formula: '阳男阴女以年支对冲，阴男阳女以前六支。',
    related: ['神煞', '劫煞', '亡神'],
    examples: [{ chart: '阳男午年', result: '元辰在子', reason: '阳男取年支对冲' }]
  },
  三合: {
    name: '三合',
    definition: '三个地支合化为一行，力量较强。',
    source: '子平派',
    formula: '申子辰合水，寅午戌合火，亥卯未合木，巳酉丑合金。',
    related: ['合化', '三会', '六合'],
    examples: [{ chart: '寅午戌', result: '三合火局', reason: '寅午戌合火' }]
  },
  三会: {
    name: '三会',
    definition: '三个相邻地支会成一方之气。',
    source: '子平派',
    formula: '亥子丑会水，寅卯辰会木，巳午未会火，申酉戌会金。',
    related: ['三合', '六合', '合化'],
    examples: [{ chart: '寅卯辰', result: '三会木局', reason: '春木' }]
  },
  六合: {
    name: '六合',
    definition: '两个地支相合，关系紧密。',
    source: '子平派',
    formula: '子丑合土、寅亥合木、卯戌合火、辰酉合金、巳申合水、午未合火/土。',
    related: ['合化', '三合', '六冲'],
    examples: [{ chart: '午未相合', result: '六合', reason: '午未合火/土' }]
  },
  六冲: {
    name: '六冲',
    definition: '两个地支相冲，代表冲突、变动。',
    source: '子平派',
    formula: '子午、丑未、寅申、卯酉、辰戌、巳亥相冲。',
    related: ['六合', '三合', '刑害'],
    examples: [{ chart: '子午同现', result: '六冲', reason: '子午相冲' }]
  },
  六害: {
    name: '六害',
    definition: '两个地支相害，暗中妨害。',
    source: '子平派',
    formula: '子未、丑午、寅巳、卯辰、申亥、酉戌相害。',
    related: ['六冲', '三刑', '六合'],
    examples: [{ chart: '子未同现', result: '六害', reason: '子未相害' }]
  },
  三刑: {
    name: '三刑',
    definition: '三个地支形成刑伤，主纠纷、灾病。',
    source: '子平派',
    formula: '寅巳申、丑戌未；子卯为无礼刑；辰午酉亥自刑。',
    related: ['六害', '六冲', '刑伤'],
    examples: [{ chart: '寅巳申', result: '三刑', reason: '无恩之刑' }]
  },
  自刑: {
    name: '自刑',
    definition: '同一地支重复出现造成的刑伤。',
    source: '子平派',
    formula: '辰、午、酉、亥自刑。',
    related: ['三刑', '六冲'],
    examples: [{ chart: '辰辰', result: '自刑', reason: '辰辰自刑' }]
  },
  根气: {
    name: '根气',
    definition: '地支中与日干相同五行或相同天干的气，为日主提供力量。',
    source: '《滴天髓》',
    formula: '本气 > 中气 > 余气。',
    related: ['得地', '藏干', '日主强弱'],
    examples: [{ chart: '壬水见申中壬', result: '有根', reason: '中气藏壬' }]
  },
  五虎遁: {
    name: '五虎遁',
    definition: '由年干推算月干的歌诀。',
    source: '命理歌诀',
    formula: '甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚起，丁壬壬位顺行流，戊癸之年何方发，甲寅之上好追求。',
    related: ['月柱', '年干', '节气'],
    examples: [{ chart: '庚年正月', result: '戊寅', reason: '乙庚之岁戊为头' }]
  },
  五鼠遁: {
    name: '五鼠遁',
    definition: '由日干推算时干的歌诀。',
    source: '命理歌诀',
    formula: '甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途。',
    related: ['时柱', '日干', '时辰'],
    examples: [{ chart: '壬日未时', result: '丁未', reason: '丁壬庚子起，顺数至未' }]
  }
};

export function lookupKnowledge(term) {
  return KNOWLEDGE[term] || null;
}

export function termList() {
  return Object.values(KNOWLEDGE).map(k => k.name);
}
