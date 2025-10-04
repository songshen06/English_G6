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
        { english: "eighty years old", chinese: "八十年历史", unit: 1 },
        { english: "four hundred metres high", chinese: "四百米高", unit: 1 },
        { english: "climb the stairs to the top", chinese: "爬楼梯到顶部", unit: 1 },

        // Module 2: Chinatown and Tombs
        { english: "send an email", chinese: "发邮件", unit: 2 },
        { english: "have a big surprise", chinese: "得到一个大惊喜", unit: 2 },
        { english: "lots and lots of", chinese: "许多许多", unit: 2 },
        { english: "be different from", chinese: "异于，与……不同", unit: 2 },
        { english: "see a lion dance", chinese: "看舞狮", unit: 2 },
        { english: "look at this photo", chinese: "看这些照片", unit: 2 },
        { english: "the Ming Tombs", chinese: "明十三陵", unit: 2 },
        { english: "lots of stone animals", chinese: "许多石头动物", unit: 2 },
        { english: "a big red gate", chinese: "红色大门", unit: 2 },
        { english: "write a story in English", chinese: "写英语故事", unit: 2 },
        { english: "meet a farmer", chinese: "遇到农场主", unit: 2 },

        // Module 3: Stamps and Hobbies
        { english: "put ... into", chinese: "投入", unit: 3 },
        { english: "stamp from the UK", chinese: "英国邮票", unit: 3 },
        { english: "send me emails", chinese: "给我发邮件", unit: 3 },
        { english: "lots of Chinese stamps", chinese: "许多中国的邮票", unit: 3 },
        { english: "collect stamps", chinese: "收集邮票", unit: 3 },
        { english: "a picture of ", chinese: "一张…的照片", unit: 3 },
        { english: "Hainan Island", chinese: "海南岛", unit: 3 },
        { english: "the Five-Finger Mountain", chinese: "五指山", unit: 3 },
        { english: "a coconut tree", chinese: "椰子树", unit: 3 },
        { english: "at all", chinese: "根本", unit: 3 },

        // Module 4: Festivals
        { english: "Children's Day", chinese: "儿童节", unit: 4 },
        { english: "favourite festival", chinese: "最喜欢的节日", unit: 4 },
        { english: "special dinner", chinese: "特别的晚餐", unit: 4 },
        { english: "have a lot of fun", chinese: "玩得很快乐", unit: 4 },
        { english: "write a poem", chinese: "写一首诗", unit: 4 },
        { english: "be important to sb.", chinese: "对……很重要", unit: 4 },
        { english: "the Spring Festival", chinese: "春节", unit: 4 },
        { english: "very important festival", chinese: "非常重要的节日", unit: 4 },
        { english: "in many countries", chinese: "在许多国家", unit: 4 },
        { english: "on the 25th of December", chinese: "12月25日", unit: 4 },

        // Module 5: Pen Friends
        { english: "pleased to meet you", chinese: "非常高兴遇到你", unit: 5 },
        { english: "Chinese pen friend", chinese: "中国笔友", unit: 5 },
        { english: "write to her", chinese: "给她写信", unit: 5 },
        { english: "of course", chinese: "当然", unit: 5 },
        { english: "in English", chinese: "用英语", unit: 5 },
        { english: "in French", chinese: "用法语", unit: 5 },
        { english: "a phone friend", chinese: "一个电话的朋友", unit: 5 },
        { english: "learn English", chinese: "学英语", unit: 5 },
        { english: "come from London", chinese: "来自伦敦", unit: 5 },

        // Module 6: School and Answers
        { english: "show me your photo", chinese: "给我看看你的照片", unit: 6 },
        { english: "be difficult for", chinese: "对（某人）来说很难", unit: 6 },
        { english: "write back", chinese: "回信", unit: 6 },
        { english: "answer your questions", chinese: "回答你的问题", unit: 6 },
        { english: "help me make a poster", chinese: "帮我做海报", unit: 6 },
        { english: "at half past three", chinese: "三点半", unit: 6 },
        { english: "have got some photos", chinese: "有些照片", unit: 6 },
        { english: "Art teacher", chinese: "美术老师", unit: 6 },
        { english: "school starts", chinese: "学校开始上课在", unit: 6 },
        { english: "play basketball well", chinese: "篮球打得好", unit: 6 },

        // Module 7: Animals
        { english: "watch a new DVD", chinese: "看一部新的DVD", unit: 7 },
        { english: "twelve hours a day", chinese: "一天12小时", unit: 7 },
        { english: "almost deaf", chinese: "几乎全聋", unit: 7 },
        { english: "give it to me", chinese: "把它给我", unit: 7 },
        { english: "hear the music", chinese: "听到音乐", unit: 7 },
        { english: "in the day", chinese: "在白天", unit: 7 },
        { english: "at night", chinese: "晚上", unit: 7 },
        { english: "learn a lesson", chinese: "上一节课", unit: 7 },
        { english: "ten hours a night", chinese: "每晚十小时", unit: 7 },
        { english: "sixteen hours a day", chinese: "每天十六小时", unit: 7 },

        // Module 8: Habits and Tidy Room
        { english: "tidy my room", chinese: "整理我的房间", unit: 8 },
        { english: "find a coin", chinese: "找到一个硬币", unit: 8 },
        { english: "tidy Tom's bed", chinese: "整理Tom的床铺", unit: 8 },
        { english: "read stories", chinese: "读故事", unit: 8 },
        { english: "go to the library", chinese: "去图书馆", unit: 8 },
        { english: "clean the blackboard", chinese: "檫黑板", unit: 8 },
        { english: "go by bus", chinese: "乘公交车", unit: 8 },
        { english: "hurry up", chinese: "（使）赶紧，抓紧", unit: 8 },
        { english: "eat bananas", chinese: "吃香蕉", unit: 8 },
        { english: "go swimming", chinese: "去游泳", unit: 8 },
        { english: "ride my bike", chinese: "骑车", unit: 8 },
        { english: "read English books", chinese: "读英语书", unit: 8 },
        { english: "clean my shoes", chinese: "擦鞋", unit: 8 },
        { english: "be mean", chinese: "小气", unit: 8 },
        { english: "cook dinner", chinese: "做晚饭", unit: 8 },

        // Module 9: Peace and UN
        { english: "a very important building", chinese: "重要建筑", unit: 9 },
        { english: "in the world", chinese: "在世界上", unit: 9 },
        { english: "the UN building", chinese: "联合国大楼", unit: 9 },
        { english: "one of the …", chinese: "其中之一", unit: 9 },
        { english: "the Changjiang River", chinese: "长江", unit: 9 },
        { english: "the Huangshan Mountain", chinese: "黄山", unit: 9 },
        { english: "in the south of", chinese: "在……的南方", unit: 9 },

        // Module 10: Travel and Safety
        { english: "take away", chinese: "带走", unit: 10 },
        { english: "have our picnic", chinese: "野餐", unit: 10 },
        { english: "don't worry", chinese: "不要担心", unit: 10 },
        { english: "drink clean water", chinese: "喝干净水", unit: 10 },
        { english: "it's fun to…", chinese: "很高兴去做…", unit: 10 },
        { english: "go straight on", chinese: "一直往前走", unit: 10 },
        { english: "don't cross", chinese: "禁止穿行", unit: 10 },
        { english: "turn right", chinese: "往右拐", unit: 10 },
        { english: "cross the road", chinese: "穿过马路", unit: 10 },
        { english: "turn left", chinese: "往左拐", unit: 10 }
    ],

    sentences: [
        // Module 1: How long?
        { english: "How long is the Great Wall? It's more than forty thousand li long.", chinese: "长城有多长？它超过四万华里。", unit: 1, keyWords: ["Great Wall", "long", "more than", "thousand"] },
        { english: "How old is it? It's more than two thousand years old.", chinese: "它有多久历史？它超过两千年历史。", unit: 1, keyWords: ["old", "more than", "thousand", "years"] },

        // Module 2: Chinatown and Tombs
        { english: "I went to Chinatown in New York yesterday.", chinese: "我昨天去了纽约的唐人街。", unit: 2, keyWords: ["went", "Chinatown", "New York", "yesterday"] },
        { english: "We saw a lion dance in the street.", chinese: "我们在街上看到了舞狮。", unit: 2, keyWords: ["saw", "lion dance", "street"] },

        // Module 3: Stamps and Hobbies
        { english: "What are you doing? I'm putting my new stamps into my stamp book.", chinese: "你在做什么？我正在把新邮票放进邮票册里。", unit: 3, keyWords: ["doing", "putting", "stamps", "stamp book"] },
        { english: "Have you got any stamps from China? No, I haven't.", chinese: "你有来自中国的邮票吗？不，我没有。", unit: 3, keyWords: ["got", "stamps", "China"] },

        // Module 4: Festivals
        { english: "What do you do on Thanksgiving? We always have a big, special dinner.", chinese: "你在感恩节做什么？我们总是吃一顿丰盛的特别晚餐。", unit: 4, keyWords: ["Thanksgiving", "always", "special", "dinner"] },
        { english: "We say 'Thank you' for our food, family and friends.", chinese: "我们为我们的食物、家人和朋友说谢谢。", unit: 4, keyWords: ["Thank you", "food", "family", "friends"] },

        // Module 5: Pen Friends
        { english: "She can speak some English.", chinese: "她会说一些英语。", unit: 5, keyWords: ["speak", "English"] },
        { english: "Can I write to her? Of course. You can write to her in English.", chinese: "我可以给她写信吗？当然。你可以用英语给她写信。", unit: 5, keyWords: ["write", "Of course", "English"] },

        // Module 6: School and Answers
        { english: "I've got some Chinese chopsticks.", chinese: "我有一些中国筷子。", unit: 6, keyWords: ["got", "Chinese", "chopsticks"] },
        { english: "My brother has got a Chinese kite.", chinese: "我哥哥有一个中国风筝。", unit: 6, keyWords: ["brother", "got", "Chinese", "kite"] },
        { english: "Have you got a book about the US?", chinese: "你有一本关于美国的书吗？", unit: 6, keyWords: ["got", "book", "about"] },

        // Module 7: Animals
        { english: "Pandas love bamboo. They eat for twelve hours a day!", chinese: "熊猫喜欢竹子。它们一天吃十二个小时！", unit: 7, keyWords: ["Pandas", "love", "bamboo", "eat", "hours"] },
        { english: "Do snakes love music? No, they don't. They're almost deaf!", chinese: "蛇喜欢音乐吗？不，它们不喜欢。它们几乎聋了！", unit: 7, keyWords: ["snakes", "love", "music", "almost", "deaf"] },

        // Module 8: Habits and Tidy Room
        { english: "Do you often tidy your bed? Yes, every day.", chinese: "你经常整理床铺吗？是的，每天。", unit: 8, keyWords: ["often", "tidy", "bed", "every day"] },
        { english: "Do you often read stories? Yes. I read stories every day.", chinese: "你经常读故事吗？是的。我每天都读故事。", unit: 8, keyWords: ["often", "read", "stories", "every day"] },

        // Module 9: Peace and UN
        { english: "Is this the UN building? Yes. It's a very important building in New York.", chinese: "这是联合国大楼吗？是的。它是纽约一个非常重要的建筑。", unit: 9, keyWords: ["UN building", "important", "building", "New York"] },
        { english: "The UN wants to make peace in the world.", chinese: "联合国想在世界上缔造和平。", unit: 9, keyWords: ["UN", "wants", "make peace", "world"] },
        { english: "China is one of the 193 member states in the UN.", chinese: "中国是联合国193个成员国之一。", unit: 9, keyWords: ["China", "one of", "member states", "UN"] },

        // Module 10: Travel and Safety
        { english: "Only drink clean water!", chinese: "只喝干净的水！", unit: 10, keyWords: ["only", "drink", "clean", "water"] },
        { english: "This water is very clean. It's fun to drink this way.", chinese: "这水很干净。这样喝水很有趣。", unit: 10, keyWords: ["water", "clean", "fun", "drink"] }
    ]
};