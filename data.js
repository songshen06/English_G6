// 英语六年级上册闪卡数据
// English Grade 6 Flashcard Data

const flashcardData = {
    vocabulary: [
        // Module 1: How long?
        { english: "how long", chinese: "多长", unit: 1 },
        { english: "near", chinese: "在...附近", unit: 1 },
        { english: "along", chinese: "沿着", unit: 1 },
        { english: "more than", chinese: "超过", unit: 1 },
        { english: "kilometre", chinese: "千米", unit: 1 },
        { english: "metre", chinese: "米", unit: 1 },

        // Module 2: Chinatown and Tombs
        { english: "Chinatown", chinese: "唐人街", unit: 2 },
        { english: "town", chinese: "城镇", unit: 2 },
        { english: "subject", chinese: "主题；科目", unit: 2 },
        { english: "everywhere", chinese: "到处", unit: 2 },
        { english: "spoke", chinese: "说(speak的过去式)", unit: 2 },
        { english: "lion dance", chinese: "舞狮", unit: 2 },
        { english: "tomb", chinese: "坟墓", unit: 2 },
        { english: "wrote", chinese: "写(write的过去式)", unit: 2 },
        { english: "when", chinese: "当...时候", unit: 2 },

        // Module 3: Stamps and Hobbies
        { english: "stamp", chinese: "邮票", unit: 3 },
        { english: "book", chinese: "书", unit: 3 },
        { english: "collect", chinese: "收集", unit: 3 },
        { english: "hobby", chinese: "爱好", unit: 3 },
        { english: "sun", chinese: "太阳", unit: 3 },
        { english: "island", chinese: "岛", unit: 3 },
        { english: "coconut", chinese: "椰子", unit: 3 },

        // Module 4: Festivals
        { english: "Thanksgiving", chinese: "感恩节", unit: 4 },
        { english: "nearly", chinese: "几乎", unit: 4 },
        { english: "the Spring Festival", chinese: "春节", unit: 4 },
        { english: "sure", chinese: "当然", unit: 4 },
        { english: "December", chinese: "十二月", unit: 4 },
        { english: "light", chinese: "灯", unit: 4 },

        // Module 5: Pen Friends
        { english: "pleased", chinese: "高兴的", unit: 5 },
        { english: "pretty", chinese: "漂亮的", unit: 5 },
        { english: "French", chinese: "法语", unit: 5 },
        { english: "phone", chinese: "电话", unit: 5 },

        // Module 6: School and Answers
        { english: "world", chinese: "世界", unit: 6 },
        { english: "difficult", chinese: "困难的", unit: 6 },
        { english: "answer", chinese: "回答", unit: 6 },
        { english: "Miss", chinese: "小姐", unit: 6 },

        // Module 7: Animals
        { english: "bamboo", chinese: "竹子", unit: 7 },
        { english: "gave", chinese: "给(give的过去式)", unit: 7 },
        { english: "its", chinese: "它的", unit: 7 },
        { english: "almost", chinese: "几乎", unit: 7 },
        { english: "deaf", chinese: "聋的", unit: 7 },
        { english: "frightened", chinese: "害怕的", unit: 7 },
        { english: "roar", chinese: "吼叫", unit: 7 },
        { english: "fox", chinese: "狐狸", unit: 7 },

        // Module 8: Habits and Tidy Room
        { english: "coin", chinese: "硬币", unit: 8 },
        { english: "tidy", chinese: "整洁的", unit: 8 },
        { english: "messy", chinese: "凌乱的", unit: 8 },
        { english: "never", chinese: "从不", unit: 8 },
        { english: "always", chinese: "总是", unit: 8 },
        { english: "often", chinese: "经常", unit: 8 },
        { english: "sometimes", chinese: "有时", unit: 8 },

        // Module 9: Peace and UN
        { english: "peace", chinese: "和平", unit: 9 },
        { english: "make peace", chinese: "缔造和平", unit: 9 },
        { english: "member state", chinese: "成员国", unit: 9 },
        { english: "famous", chinese: "著名的", unit: 9 },

        // Module 10: Travel and Safety
        { english: "aunt", chinese: "阿姨；姑姑", unit: 10 },
        { english: "forgot", chinese: "忘记(forget的过去式)", unit: 10 },
        { english: "way", chinese: "路；方式", unit: 10 },
        { english: "cross", chinese: "穿过", unit: 10 }
    ],

    phrases: [
        // Module 1: How long?
        { english: "look at", chinese: "看", unit: 1 },
        { english: "the Empire State Building", chinese: "帝国大厦", unit: 1 },
        { english: "four hundred metres high", chinese: "四百米高", unit: 1 },
        { english: "climb the stairs to the top", chinese: "爬楼梯到顶部", unit: 1 },

        // Module 2: Chinatown and Tombs
        { english: "send an email", chinese: "发送邮件", unit: 2 },
        { english: "have a big surprise", chinese: "大吃一惊", unit: 2 },
        { english: "lots and lots of", chinese: "许多", unit: 2 },
        { english: "be different from", chinese: "与...不同", unit: 2 },
        { english: "see a lion dance", chinese: "看舞狮", unit: 2 },
        { english: "the Ming Tombs", chinese: "明十三陵", unit: 2 },

        // Module 3: Stamps and Hobbies
        { english: "put … into", chinese: "把...放进", unit: 3 },
        { english: "stamp from the UK", chinese: "来自英国的邮票", unit: 3 },
        { english: "collect stamps", chinese: "收集邮票", unit: 3 },
        { english: "a picture of …", chinese: "一张...的照片", unit: 3 },
        { english: "Hainan Island", chinese: "海南岛", unit: 3 },
        { english: "the Five-Finger Mountain", chinese: "五指山", unit: 3 },

        // Module 4: Festivals
        { english: "Children's Day", chinese: "儿童节", unit: 4 },
        { english: "favourite festival", chinese: "最喜欢的节日", unit: 4 },
        { english: "special dinner", chinese: "特别的晚餐", unit: 4 },
        { english: "have a lot of fun", chinese: "玩得很开心", unit: 4 },
        { english: "write a poem", chinese: "写诗", unit: 4 },
        { english: "be important to", chinese: "对...很重要", unit: 4 },

        // Module 5: Pen Friends
        { english: "pleased to meet you", chinese: "很高兴认识你", unit: 5 },
        { english: "Chinese pen friend", chinese: "中国笔友", unit: 5 },
        { english: "write to her", chinese: "给她写信", unit: 5 },
        { english: "of course", chinese: "当然", unit: 5 },
        { english: "in English / in French", chinese: "用英语/用法语", unit: 5 },
        { english: "a phone friend", chinese: "电话朋友", unit: 5 },

        // Module 6: School and Answers
        { english: "show me your photo", chinese: "给我看你的照片", unit: 6 },
        { english: "be difficult for sb.", chinese: "对某人来说很困难", unit: 6 },
        { english: "write back", chinese: "回信", unit: 6 },
        { english: "answer your questions", chinese: "回答你的问题", unit: 6 },
        { english: "help me make a poster", chinese: "帮我做海报", unit: 6 },
        { english: "at half past three", chinese: "在三点三十分", unit: 6 },
        { english: "have got some photos", chinese: "有一些照片", unit: 6 },

        // Module 7: Animals
        { english: "watch a new DVD", chinese: "看新的DVD", unit: 7 },
        { english: "twelve hours a day", chinese: "一天十二小时", unit: 7 },
        { english: "almost deaf", chinese: "几乎聋了", unit: 7 },
        { english: "hear the music", chinese: "听到音乐", unit: 7 },
        { english: "at night", chinese: "在晚上", unit: 7 },
        { english: "in the day", chinese: "在白天", unit: 7 },
        { english: "learn a lesson", chinese: "吸取教训", unit: 7 },

        // Module 8: Habits and Tidy Room
        { english: "tidy my room", chinese: "整理我的房间", unit: 8 },
        { english: "find a coin", chinese: "找到一枚硬币", unit: 8 },
        { english: "read stories", chinese: "读故事", unit: 8 },
        { english: "go to the library", chinese: "去图书馆", unit: 8 },
        { english: "clean the blackboard", chinese: "擦黑板", unit: 8 },
        { english: "ride my bike", chinese: "骑自行车", unit: 8 },
        { english: "go swimming", chinese: "去游泳", unit: 8 },

        // Module 9: Peace and UN
        { english: "a very important building", chinese: "一个非常重要的建筑", unit: 9 },
        { english: "in the world", chinese: "在世界上", unit: 9 },
        { english: "the UN building", chinese: "联合国大楼", unit: 9 },
        { english: "one of the …", chinese: "...之一", unit: 9 },
        { english: "the Changjiang River", chinese: "长江", unit: 9 },
        { english: "the Huangshan Mountain", chinese: "黄山", unit: 9 },

        // Module 10: Travel and Safety
        { english: "take away", chinese: "带走", unit: 10 },
        { english: "have our picnic", chinese: "吃野餐", unit: 10 },
        { english: "don't worry", chinese: "别担心", unit: 10 },
        { english: "drink clean water", chinese: "喝干净的水", unit: 10 },
        { english: "it's fun to…", chinese: "做...很有趣", unit: 10 },
        { english: "go straight on", chinese: "直走", unit: 10 },
        { english: "turn left/right", chinese: "向左/右转", unit: 10 },
        { english: "cross the road", chinese: "过马路", unit: 10 }
    ],

    sentences: [
        // Module 1: How long?
        { english: "How long is the Great Wall? It's more than forty thousand li long.", chinese: "长城有多长？它超过四万华里。", unit: 1 },
        { english: "How old is it? It's more than two thousand years old.", chinese: "它有多久历史？它超过两千年历史。", unit: 1 },

        // Module 2: Chinatown and Tombs
        { english: "I went to Chinatown in New York yesterday.", chinese: "我昨天去了纽约的唐人街。", unit: 2 },
        { english: "We saw a lion dance in the street.", chinese: "我们在街上看到了舞狮。", unit: 2 },

        // Module 3: Stamps and Hobbies
        { english: "What are you doing? I'm putting my new stamps into my stamp book.", chinese: "你在做什么？我正在把新邮票放进邮票册里。", unit: 3 },
        { english: "Have you got any stamps from China? No, I haven't.", chinese: "你有来自中国的邮票吗？不，我没有。", unit: 3 },

        // Module 4: Festivals
        { english: "What do you do on Thanksgiving? We always have a big, special dinner.", chinese: "你在感恩节做什么？我们总是吃一顿丰盛的特别晚餐。", unit: 4 },
        { english: "We say 'Thank you' for our food, family and friends.", chinese: "我们为我们的食物、家人和朋友说谢谢。", unit: 4 },

        // Module 5: Pen Friends
        { english: "She can speak some English.", chinese: "她会说一些英语。", unit: 5 },
        { english: "Can I write to her? Of course. You can write to her in English.", chinese: "我可以给她写信吗？当然。你可以用英语给她写信。", unit: 5 },

        // Module 6: School and Answers
        { english: "I've got some Chinese chopsticks.", chinese: "我有一些中国筷子。", unit: 6 },
        { english: "My brother has got a Chinese kite.", chinese: "我哥哥有一个中国风筝。", unit: 6 },
        { english: "Have you got a book about the US?", chinese: "你有一本关于美国的书吗？", unit: 6 },

        // Module 7: Animals
        { english: "Pandas love bamboo. They eat for twelve hours a day!", chinese: "熊猫喜欢竹子。它们一天吃十二个小时！", unit: 7 },
        { english: "Do snakes love music? No, they don't. They're almost deaf!", chinese: "蛇喜欢音乐吗？不，它们不喜欢。它们几乎聋了！", unit: 7 },

        // Module 8: Habits and Tidy Room
        { english: "Do you often tidy your bed? Yes, every day.", chinese: "你经常整理床铺吗？是的，每天。", unit: 8 },
        { english: "Do you often read stories? Yes. I read stories every day.", chinese: "你经常读故事吗？是的。我每天都读故事。", unit: 8 },

        // Module 9: Peace and UN
        { english: "Is this the UN building? Yes. It's a very important building in New York.", chinese: "这是联合国大楼吗？是的。它是纽约一个非常重要的建筑。", unit: 9 },
        { english: "The UN wants to make peace in the world.", chinese: "联合国想在世界上缔造和平。", unit: 9 },
        { english: "China is one of the 193 member states in the UN.", chinese: "中国是联合国193个成员国之一。", unit: 9 },

        // Module 10: Travel and Safety
        { english: "Only drink clean water!", chinese: "只喝干净的水！", unit: 10 },
        { english: "This water is very clean. It's fun to drink this way.", chinese: "这水很干净。这样喝水很有趣。", unit: 10 }
    ]
};