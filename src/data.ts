/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ItineraryItem, ShoppingItem } from './types';

export const INITIAL_ITINERARY: ItineraryItem[] = [
  // DAY 1
  {
    id: 'd1-1',
    day: 1,
    time: '16:00',
    locationName: '仙台機場 (SDJ)',
    category: 'flight',
    note: '搭乘星宇航空 JX862',
    phoneNav: '022-383-4301',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Sendai_Airport.JPG'
  },
  {
    id: 'd1-2',
    day: 1,
    time: '16:40',
    locationName: '仙台機場 2F 國內線伴手禮區',
    category: 'shopping',
    note: '先買：萩之月、毛豆甜點、真空牛舌',
    phoneNav: '022-383-4315',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Hagi_no_tsuki_inside_package_20171018.jpg'
  },
  {
    id: 'd1-4',
    day: 1,
    time: '17:50',
    locationName: '仙台大都會大飯店 (Hotel Metropolitan Sendai)',
    category: 'hotel',
    note: '卸下行李，立刻出門！',
    phoneNav: '022-268-2511',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd1-5',
    day: 1,
    time: '18:00',
    locationName: 'Pokémon Center & AKOMEYA',
    category: 'shopping',
    note: '位於 PARCO 本館 (1F AKOMEYA / 3F 寶可夢)',
    phoneNav: '022-774-8000',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd1-6',
    day: 1,
    time: '18:50',
    locationName: 'Montbell 仙台店',
    category: 'shopping',
    note: '20:00 關門，快步前進買機能服',
    phoneNav: '022-216-3255',
    isEarlyClosing: true,
    closingTime: '20:00',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd1-7',
    day: 1,
    time: '19:30',
    locationName: '茅乃舍 & Standard Products',
    category: 'shopping',
    note: '位於 PARCO 2館 (2F 茅乃舍 / 3F Standard Products)',
    phoneNav: '022-774-8000',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd1-8',
    day: 1,
    time: '20:45',
    locationName: '晚餐：仙台牛舌（神級三選一）',
    category: 'food',
    note: '閣 (厚切) / 司 (炭香) / 善治郎 (鹽烤)',
    phoneNav: '022-268-7067',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd1-9',
    day: 1,
    time: '22:00',
    locationName: '寶可夢人孔蓋 (拉普拉斯)',
    category: 'sightseeing',
    note: '於一番町商店街收集',
    phoneNav: '',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd1-10',
    day: 1,
    time: '22:15',
    locationName: '唐吉訶德 晚翠通店 (24H)',
    category: 'shopping',
    note: '深夜爆買藥妝與零食',
    phoneNav: '022-211-1911',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
  },

  // DAY 2
  {
    id: 'd2-1',
    day: 2,
    time: '07:30',
    locationName: 'おむすび東雲 (現捏飯糰)',
    category: 'food',
    note: '清晨極高質感手工現握飯糰，暖胃出發。',
    phoneNav: '022-200-2440',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-2',
    day: 2,
    time: '08:25',
    locationName: '仙台朝市 (吃貨探索)',
    category: 'food',
    note: '必吃：齋藤肉店自製炸可樂餅、朝市鮮魚店浜伸、並來杯 110 coffee 手沖。',
    phoneNav: '022-262-7126',
    image: 'https://images.unsplash.com/photo-1534080391025-a775028b8cf6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-3',
    day: 2,
    time: '09:00',
    locationName: '村上屋餅店',
    category: 'food',
    note: '創業百年的軟糯大福名店，品嚐最正宗三色毛豆麻糬！',
    phoneNav: '022-222-6801',
    image: 'https://images.unsplash.com/photo-1582298538104-e22be11bc7b1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-4',
    day: 2,
    time: '09:30',
    locationName: '仙台車站自駕取車',
    category: 'transit',
    note: '手續辦理，檢查車體，安全駕駛安全第一。',
    phoneNav: '022-299-4100',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-5',
    day: 2,
    time: '10:20',
    locationName: '金蛇水神社 (金運求財勝地)',
    category: 'culture',
    note: '極其靈驗的白蛇神社，求取特別金運御守。拿著錢包到靈石蛇紋上摸一摸！',
    phoneNav: '0223-22-2672',
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-6',
    day: 2,
    time: '12:30',
    locationName: '日本三景：松島海岸 slow living',
    category: 'sightseeing',
    note: '享用松島海岸烤魚板、吃雪竹屋巨大手燒仙貝，別忘了尋找拉普拉斯人孔蓋！',
    phoneNav: '022-355-0333',
    image: 'https://images.unsplash.com/photo-1627998124233-91147ac52f86?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-7',
    day: 2,
    time: '15:20',
    locationName: '名掛丁小吃最終補考',
    category: 'food',
    note: '必買阿部蒲鉾店（炸葫蘆ひょうたん）、鯛きち熱騰騰鯛魚燒。',
    phoneNav: '022-299-3880',
    isEarlyClosing: true,
    closingTime: '18:00',
    image: 'https://images.unsplash.com/photo-1582845512747-e426d116db9a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-8',
    day: 2,
    time: '16:10',
    locationName: '開車前往秋保溫泉區',
    category: 'transit',
    note: '行駛約45分鐘，避開市區尖峰通勤時段。',
    phoneNav: '022-398-2323',
    image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2-9',
    day: 2,
    time: '17:15',
    locationName: '客房享受：星野集團 界 秋保 (KAI Akiu)',
    category: 'hotel',
    note: '頂級日式名宿奢華感。在名川溪谷旁享受溪畔露天溫泉與秋保精緻會席料理。',
    phoneNav: '022-397-3151',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  },

  // DAY 3
  {
    id: 'd3-1',
    day: 3,
    time: '09:00',
    locationName: '星野「界 秋保」晨間露天浴',
    category: 'hotel',
    note: '悠閒起床、泡湯、享用宮城特色精緻土鍋早餐，11:00起錨出發。',
    phoneNav: '022-397-3151',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-2',
    day: 3,
    time: '12:30',
    locationName: 'Costco 好市多 (富谷店)',
    category: 'shopping',
    note: '限時一小時突擊！採購大理石花紋和牛、宮城新鮮海產與壽司拼盤，晚上大快朵頤。',
    phoneNav: '022-348-1130',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-3',
    day: 3,
    time: '14:10',
    locationName: '長者原 SA 高速休息站',
    category: 'food',
    note: '停歇吃極鮮烤牛舌串及當季牛奶霜淇淋，小憩片刻。',
    phoneNav: '0229-28-3717',
    image: 'https://images.unsplash.com/photo-1501443782917-cfc57388fe31?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-4',
    day: 3,
    time: '16:15',
    locationName: 'Rakuten STAY Morioka (盛岡包棟度假房)',
    category: 'hotel',
    note: '辦理入房，立刻將好市多採購的和牛等生鮮食材放入奢華廚房的大冰箱！',
    phoneNav: '019-613-2210',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-5',
    day: 3,
    time: '16:40',
    locationName: '盛岡肴町商店街 (打烊前快攻)',
    category: 'shopping',
    note: '必逛老舖：白澤仙貝店買手工南部仙貝。',
    phoneNav: '019-625-1515',
    isEarlyClosing: true,
    closingTime: '18:00',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-6',
    day: 3,
    time: '17:35',
    locationName: '岩手銀行紅磚館',
    category: 'sightseeing',
    note: '辰野金吾大師打造的標誌性紅磚建築。黃昏時分在紅磚牆前留下美照。',
    phoneNav: '019-622-1234',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-7',
    day: 3,
    time: '18:10',
    locationName: '盛岡大通商店街 Shopping',
    category: 'shopping',
    note: '逛街、美妝店補貨或選購當地精緻服飾。門店大多營業至 19:30。',
    phoneNav: '019-623-7131',
    image: 'https://images.unsplash.com/photo-1478860126073-2e39897d712e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-8',
    day: 3,
    time: '19:00',
    locationName: '盛岡中央公園 寶可夢小拳石人孔蓋',
    category: 'sightseeing',
    note: '在寬廣公園草坪中，找到岩手縣專屬代言人「小拳石 Geodude」彩繪人孔蓋！',
    phoneNav: '019-651-4111',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3-9',
    day: 3,
    time: '20:00',
    locationName: '星級主夫自炊：和牛好市多盛宴',
    category: 'food',
    note: '善用 Rakuten STAY 高級獨立廚房，煎頂級和牛，暢飲岩手在地生啤酒！',
    phoneNav: '019-613-2210',
    image: 'https://images.unsplash.com/photo-1629814249534-bb4827098f46?auto=format&fit=crop&w=600&q=80'
  },

  // DAY 4
  {
    id: 'd4-1',
    day: 4,
    time: '08:30',
    locationName: '盛岡八幡宮 (祈願旅途平安)',
    category: 'culture',
    note: '古老、威嚴的陸奧大社，抽取木製幸運魚神籤！',
    phoneNav: '019-652-5211',
    image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4-2',
    day: 4,
    time: '09:30',
    locationName: '盛岡 FESAN 商場海膽搜尋',
    category: 'shopping',
    note: '尋找傳說中的三陸名產「牛奶瓶海膽」！B1田清魚店或1F山口屋。配 Nagasawa Coffee 品味。',
    phoneNav: '019-654-1188',
    image: 'https://images.unsplash.com/photo-1601599561263-5938fc9154ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4-3',
    day: 4,
    time: '10:40',
    locationName: '盛岡冷麵 / 炸醬麵午餐',
    category: 'food',
    note: '盛岡車站對面冷麵翹楚【ぴょんぴょん舎】或【盛樓閣】，勁道十足極致爽口。',
    phoneNav: '019-606-1067',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4-4',
    day: 4,
    time: '12:30',
    locationName: '花卷車站西口 寶可夢人孔蓋',
    category: 'sightseeing',
    note: '驅車抵達花卷站！打卡第二款特別版彩繪小拳石人孔蓋。',
    phoneNav: '0198-22-4412',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4-5',
    day: 4,
    time: '13:10',
    locationName: '椀子蕎麥麵挑戰 (嘉司屋)',
    category: 'food',
    note: '花卷百年老店！一口一碗，大呼過癮，挑戰看看能吃多少碗！',
    phoneNav: '0198-22-3322',
    image: 'https://images.unsplash.com/photo-1582298538104-e22be11bc7b1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4-6',
    day: 4,
    time: '14:45',
    locationName: '永旺夢樂城 Aeon Mall Hanamaki',
    category: 'shopping',
    note: '超級好逛的超大雙層購物中心，服飾、生活零售、大超市一站買齊。',
    phoneNav: '0198-26-0100',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4-7',
    day: 4,
    time: '16:45',
    locationName: 'Workman Plus (花卷店)',
    category: 'shopping',
    note: '超高機能性、防潑水、日常時尚日牌。以超平民價格入手抗寒防雨外套！',
    phoneNav: '0198-26-3990',
    image: 'https://images.unsplash.com/photo-1481016570479-9eab6349fde7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4-8',
    day: 4,
    time: '17:40',
    locationName: '返回 Rakuten STAY 盛岡別墅',
    category: 'hotel',
    note: '續住第二晚。晚上在奢華別墅客廳看劇、聊行程、做舒緩拉伸。',
    phoneNav: '019-613-2210',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },

  // DAY 5
  {
    id: 'd5-1',
    day: 5,
    time: '09:30',
    locationName: '釜淵瀑布 (釜淵の滝)',
    category: 'sightseeing',
    note: '花卷溫泉深處的清幽溪流。伴隨水流聲在林間木棧道散步，感受原始森林芬多精。',
    phoneNav: '0198-37-2111',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd5-2',
    day: 5,
    time: '11:40',
    locationName: '花卷在地和風精緻餐廳',
    category: 'food',
    note: '最後的日式午餐，品嚐最純淨的岩手稻米與旬之味。',
    phoneNav: '0198-24-2111',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd5-3',
    day: 5,
    time: '13:10',
    locationName: 'York Benimaru 巨型超市 (還車大採買)',
    category: 'shopping',
    note: '極好買的大型連鎖超市。將日本調味料、咖哩塊、零食零嘴做最後爆箱採購。',
    phoneNav: '0198-23-7200',
    image: 'https://images.unsplash.com/photo-1601599561263-5938fc9154ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd5-4',
    day: 5,
    time: '14:50',
    locationName: '花卷機場 (HNA) 安全還車',
    category: 'transit',
    note: '將車輛開回機場取車點，辦理完美還車手續，點交行李。',
    phoneNav: '0198-26-5011',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd5-5',
    day: 5,
    time: '16:00',
    locationName: '花卷機場 3F 展望台 & 2F 土產店補考',
    category: 'flight',
    note: '登機前必逛土產店！最後搶購海鷗蛋、小岩井農場純乳奶油酥餅、白澤仙貝禮盒。',
    phoneNav: '0198-26-5011',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd5-6',
    day: 5,
    time: '18:00',
    locationName: '搭乘台灣虎航 IT259 帶著滿滿寶藏返台',
    category: 'flight',
    note: '在黃昏暮色中搭乘 IT259 起飛，期待下一次自駕極致探索。',
    phoneNav: '0198-26-5011',
    image: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: 'shop-1',
    name: '宮城名物「萩之月」10入',
    category: 'Souvenir',
    description: '仙台第一伴手禮！鬆軟海綿蛋糕包覆頂級香滑卡士達。',
    originalPlaceholder: true,
    isBought: false
  },
  {
    id: 'shop-2',
    name: 'FESAN 三陸新鮮牛奶瓶海膽',
    category: 'Souvenir',
    description: '岩手機場/車站必搶！漂浮在乾淨海水玻璃瓶中的黃金海膽。',
    originalPlaceholder: true,
    isBought: false
  },
  {
    id: 'shop-3',
    name: '武田 Alinamin EX Plus 270錠',
    category: 'Medicine',
    description: '長途開車自駕必備，抗疲勞黃金神藥。',
    originalPlaceholder: true,
    isBought: false
  },
  {
    id: 'shop-4',
    name: 'Saborino 早安面膜 櫻花限定版',
    category: 'Cosmetics',
    description: '60秒保濕潔顏面膜，溫泉亮眼出發。',
    originalPlaceholder: true,
    isBought: false
  },
  {
    id: 'shop-5',
    name: '小岩井農場 濃厚奶油手工餅乾',
    category: 'Snacks',
    description: '香噴噴！岩手最驕傲農場特製，下午茶神物。',
    originalPlaceholder: true,
    isBought: false
  },
  {
    id: 'shop-6',
    name: 'Workman Stretch 防風雨機能外套',
    category: 'Apparel',
    description: '超輕耐磨、極高CP值的日本國民戶外必買。',
    originalPlaceholder: true,
    isBought: false
  }
];

export const MOCK_PRESET_ANALYSES = [
  {
    name: 'EVE A錠 止痛藥 60錠',
    category: 'Medicine',
    description: '日本超人氣家庭常備溫和止痛藥，藍盒包裝。'
  },
  {
    name: '佳麗寶 Suisai 酵素洗顏粉',
    category: 'Cosmetics',
    description: '獨立顆粒包裝，徹底清除黑頭粉刺，旅行攜帶超方便。'
  },
  {
    name: 'KitKat 宇治抹茶巧克力隨手包',
    category: 'Snacks',
    description: '日本限定經典茶香巧克力，酥脆夾心甜而不膩。'
  },
  {
    name: 'Montbell Wickron 頂級快乾T恤',
    category: 'Apparel',
    description: '極高網眼排汗快乾材質，夏日山海探索專用。'
  },
  {
    name: '極上特選薄切牛舌真空組 (善治郎)',
    category: 'Souvenir',
    description: '附調味鹽包，完美封裝熟牛肉，帶回飯店煎食絕配。'
  }
];
