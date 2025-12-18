// Файл с данными для приложения

const appData = {
    // Данные пользователя (начальные) - БЕЗ ФОТО
    user: {
        id: 1,
        name: 'Новый ученик',
        email: 'student@enchiko.com',
        avatar: null, // Фото отсутствует изначально
        initials: 'НУ', // Инициалы для аватара
        points: 0,
        streak: 0,
        level: 'Новичок',
        joinDate: new Date().toISOString().split('T')[0],
        bio: 'Люблю изучать новые языки и культуры!',
        settings: {
            notifications: true,
            darkMode: false,
            dailyReminder: true
        }
    },

    // Языки для изучения с обновленными цветами
    languages: [
        {
            id: 'chinese',
            name: 'Китайский',
            icon: 'mdi-translate',
            color: '#FF5252', // Красный
            flag: '🇨🇳',
            description: 'Изучайте иероглифы и тоны',
            difficulty: 'Сложный',
            totalLessons: 15,
            completedLessons: 0,
            progress: 0, // Добавил прогресс 0 вместо NaN
            categories: [
                {
                    id: 'basics',
                    name: 'Основы',
                    icon: 'mdi-alpha-a-box',
                    description: 'Основные иероглифы и произношение',
                    color: '#FF5252'
                },
                {
                    id: 'grammar',
                    name: 'Грамматика',
                    icon: 'mdi-book-open-variant',
                    description: 'Правила построения предложений',
                    color: '#4A90E2'
                },
                {
                    id: 'vocabulary',
                    name: 'Словарь',
                    icon: 'mdi-notebook',
                    description: 'Популярные слова и фразы',
                    color: '#2196F3'
                },
                {
                    id: 'culture',
                    name: 'Культура',
                    icon: 'mdi-earth',
                    description: 'Традиции и обычаи Китая',
                    color: '#FF9800'
                }
            ]
        },
        {
            id: 'english',
            name: 'Английский',
            icon: 'mdi-account-tie',
            color: '#2C6DB4', // ТЕМНО-СИНИЙ (был #4A90E2)
            flag: '🇬🇧',
            description: 'Самый популярный язык в мире',
            difficulty: 'Средний',
            totalLessons: 20,
            completedLessons: 0,
            progress: 0, // Добавил прогресс 0 вместо NaN
            categories: [
                {
                    id: 'basics',
                    name: 'Основы',
                    icon: 'mdi-alpha-a-box',
                    description: 'Алфавит и базовые фразы',
                    color: '#2C6DB4'
                },
                {
                    id: 'grammar',
                    name: 'Грамматика',
                    icon: 'mdi-book-open-variant',
                    description: 'Времена и структура предложений',
                    color: '#2196F3'
                },
                {
                    id: 'vocabulary',
                    name: 'Словарь',
                    icon: 'mdi-notebook',
                    description: 'Часто используемые слова',
                    color: '#FF5252'
                },
                {
                    id: 'conversation',
                    name: 'Разговорник',
                    icon: 'mdi-chat',
                    description: 'Полезные фразы для общения',
                    color: '#FF9800'
                }
            ]
        },
        {
            id: 'korean',
            name: 'Корейский',
            icon: 'mdi-alpha-k-box',
            color: '#64B5F6', // СВЕТЛО-ГОЛУБОЙ (был #2196F3)
            flag: '🇰🇷',
            description: 'Хангыль и корейская культура',
            difficulty: 'Средний',
            totalLessons: 12,
            completedLessons: 0,
            progress: 0, // Добавил прогресс 0 вместо NaN
            categories: [
                {
                    id: 'hangeul',
                    name: 'Хангыль',
                    icon: 'mdi-alphabetical',
                    description: 'Корейский алфавит',
                    color: '#64B5F6'
                },
                {
                    id: 'grammar',
                    name: 'Грамматика',
                    icon: 'mdi-book-open-variant',
                    description: 'Особенности корейского языка',
                    color: '#4A90E2'
                },
                {
                    id: 'vocabulary',
                    name: 'Словарь',
                    icon: 'mdi-notebook',
                    description: 'Основные слова и выражения',
                    color: '#FF5252'
                },
                {
                    id: 'culture',
                    name: 'Культура',
                    icon: 'mdi-earth',
                    description: 'Корейские традиции',
                    color: '#FF9800'
                }
            ]
        }
    ],

    // Уроки для каждого языка
    lessons: {
        chinese: {
            basics: [
                {
                    id: 'chinese-basics-1',
                    title: 'Введение в китайский',
                    description: 'Основные понятия и особенности языка',
                    duration: 10,
                    difficulty: 'Начинающий',
                    completed: false,
                    order: 1,
                    content: {
                        introduction: 'Китайский язык - один из древнейших языков мира с уникальной системой иероглифов. Он является официальным языком Китая, Тайваня и Сингапура.',
                        rules: [
                            {
                                title: 'Тоны',
                                description: 'В китайском языке 4 основных тона, которые меняют значение слова. Правильное произношение тонов критически важно для понимания.',
                                examples: [
                                    { original: 'mā (妈)', translation: 'мама (1-й тон)' },
                                    { original: 'má (麻)', translation: 'конопля (2-й тон)' },
                                    { original: 'mǎ (马)', translation: 'лошадь (3-й тон)' },
                                    { original: 'mà (骂)', translation: 'ругать (4-й тон)' }
                                ]
                            },
                            {
                                title: 'Иероглифы',
                                description: 'Каждый иероглиф представляет собой слог и имеет значение. Существует более 50,000 иероглифов, но для чтения газет достаточно знать около 3,000.',
                                examples: [
                                    { original: '人 (rén)', translation: 'человек' },
                                    { original: '山 (shān)', translation: 'гора' },
                                    { original: '水 (shuǐ)', translation: 'вода' },
                                    { original: '火 (huǒ)', translation: 'огонь' }
                                ]
                            }
                        ],
                        vocabulary: [
                            { word: '你好', pinyin: 'nǐ hǎo', translation: 'привет', category: 'приветствие' },
                            { word: '谢谢', pinyin: 'xiè xiè', translation: 'спасибо', category: 'благодарность' },
                            { word: '再见', pinyin: 'zài jiàn', translation: 'до свидания', category: 'прощание' },
                            { word: '请', pinyin: 'qǐng', translation: 'пожалуйста', category: 'вежливость' }
                        ],
                        exercises: [
                            {
                                id: 1,
                                type: 'multiple-choice',
                                question: 'Как сказать "спасибо" по-китайски?',
                                options: [
                                    { id: 'a', text: '你好', correct: false },
                                    { id: 'b', text: '谢谢', correct: true },
                                    { id: 'c', text: '再见', correct: false },
                                    { id: 'd', text: '请', correct: false }
                                ],
                                userAnswer: null,
                                isCorrect: null
                            },
                            {
                                id: 2,
                                type: 'translation',
                                question: 'Переведите слово: 人 (rén)',
                                correctAnswer: 'человек',
                                userAnswer: '',
                                isCorrect: null
                            }
                        ]
                    }
                },
                {
                    id: 'chinese-basics-2',
                    title: 'Основные иероглифы',
                    description: 'Изучение 20 самых важных иероглифов',
                    duration: 15,
                    difficulty: 'Начинающий',
                    completed: false,
                    order: 2,
                    content: {
                        introduction: 'В этом уроке вы изучите основные иероглифы, которые являются фундаментом китайского языка.',
                        rules: [],
                        vocabulary: [],
                        exercises: []
                    }
                }
            ]
        },
        english: {
            basics: [
                {
                    id: 'english-basics-1',
                    title: 'Английский алфавит',
                    description: 'Изучение букв и звуков',
                    duration: 10,
                    difficulty: 'Начинающий',
                    completed: false,
                    order: 1,
                    content: {
                        introduction: 'Английский алфавит состоит из 26 букв и является основой для изучения языка. Английский является международным языком общения.',
                        rules: [
                            {
                                title: 'Гласные звуки',
                                description: 'В английском 5 гласных букв, но 20 гласных звуков. Произношение может значительно отличаться.',
                                examples: [
                                    { original: 'cat /kæt/', translation: 'кот' },
                                    { original: 'bed /bed/', translation: 'кровать' },
                                    { original: 'time /taɪm/', translation: 'время' },
                                    { original: 'go /ɡəʊ/', translation: 'идти' }
                                ]
                            },
                            {
                                title: 'Согласные звуки',
                                description: 'Некоторые согласные имеют несколько вариантов произношения. Важно обращать внимание на сочетания букв.',
                                examples: [
                                    { original: 'city /ˈsɪti/', translation: 'город' },
                                    { original: 'car /kɑːr/', translation: 'машина' },
                                    { original: 'church /tʃɜːrtʃ/', translation: 'церковь' },
                                    { original: 'think /θɪŋk/', translation: 'думать' }
                                ]
                            }
                        ],
                        vocabulary: [
                            { word: 'Hello', transcription: 'heˈləʊ', translation: 'привет', category: 'greeting' },
                            { word: 'Goodbye', transcription: 'ɡʊdˈbaɪ', translation: 'до свидания', category: 'farewell' },
                            { word: 'Thank you', transcription: 'θæŋk juː', translation: 'спасибо', category: 'gratitude' },
                            { word: 'Please', transcription: 'pliːz', translation: 'пожалуйста', category: 'politeness' }
                        ],
                        exercises: [
                            {
                                id: 1,
                                type: 'multiple-choice',
                                question: 'Как сказать "привет" по-английски?',
                                options: [
                                    { id: 'a', text: 'Goodbye', correct: false },
                                    { id: 'b', text: 'Hello', correct: true },
                                    { id: 'c', text: 'Thank you', correct: false },
                                    { id: 'd', text: 'Please', correct: false }
                                ],
                                userAnswer: null,
                                isCorrect: null
                            }
                        ]
                    }
                }
            ]
        },
        korean: {
            hangeul: [
                {
                    id: 'korean-hangeul-1',
                    title: 'Основы Хангыля',
                    description: 'Изучение корейского алфавита',
                    duration: 15,
                    difficulty: 'Начинающий',
                    completed: false,
                    order: 1,
                    content: {
                        introduction: 'Хангыль - корейский алфавит, созданный в 1443 году королём Седжоном Великим. Он считается одним из самых научно обоснованных алфавитов в мире.',
                        rules: [],
                        vocabulary: [],
                        exercises: []
                    }
                }
            ]
        }
    },

    // Упражнения для страницы упражнений
    exercises: {
        chinese: [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'Что означает "你好"?',
                options: [
                    { id: 'a', text: 'Спасибо', correct: false },
                    { id: 'b', text: 'Привет', correct: true },
                    { id: 'c', text: 'До свидания', correct: false },
                    { id: 'd', text: 'Пожалуйста', correct: false }
                ],
                explanation: '"你好" - это стандартное приветствие в китайском языке, аналогичное русскому "привет" или "здравствуйте".'
            },
            {
                id: 2,
                type: 'translation',
                question: 'Переведите на китайский: "спасибо"',
                correctAnswer: '谢谢',
                explanation: '"谢谢" - это самое распространенное выражение благодарности в китайском языке.'
            },
            {
                id: 3,
                type: 'multiple-choice',
                question: 'Какой тон у слова "мама" (妈)?',
                options: [
                    { id: 'a', text: '1-й тон', correct: true },
                    { id: 'b', text: '2-й тон', correct: false },
                    { id: 'c', text: '3-й тон', correct: false },
                    { id: 'd', text: '4-й тон', correct: false }
                ],
                explanation: 'Слово "мама" (妈) произносится с 1-м тоном - высоким и ровным.'
            }
        ],
        english: [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'What does "Hello" mean?',
                options: [
                    { id: 'a', text: 'До свидания', correct: false },
                    { id: 'b', text: 'Спасибо', correct: false },
                    { id: 'c', text: 'Привет', correct: true },
                    { id: 'd', text: 'Пожалуйста', correct: false }
                ],
                explanation: '"Hello" is the most common greeting in English, equivalent to "привет" in Russian.'
            }
        ],
        korean: [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'Что означает "안녕하세요"?',
                options: [
                    { id: 'a', text: 'Спасибо', correct: false },
                    { id: 'b', text: 'Здравствуйте', correct: true },
                    { id: 'c', text: 'Извините', correct: false },
                    { id: 'd', text: 'Добро пожаловать', correct: false }
                ],
                explanation: '"안녕하세요" - это формальное приветствие в корейском языке, используется при обращении к старшим или незнакомым людям.'
            }
        ]
    },

    // Словарь
    dictionary: {
        chinese: [
            { id: 1, word: '你好', pinyin: 'nǐ hǎo', translation: 'привет', category: 'приветствие', learned: false },
            { id: 2, word: '谢谢', pinyin: 'xiè xiè', translation: 'спасибо', category: 'благодарность', learned: false },
            { id: 3, word: '再见', pinyin: 'zài jiàn', translation: 'до свидания', category: 'прощание', learned: false }
        ],
        english: [
            { id: 1, word: 'Hello', transcription: 'heˈləʊ', translation: 'привет', category: 'greeting', learned: false },
            { id: 2, word: 'Thank you', transcription: 'θæŋk juː', translation: 'спасибо', category: 'gratitude', learned: false }
        ],
        korean: [
            { id: 1, word: '안녕하세요', transcription: 'annyeonghaseyo', translation: 'здравствуйте', category: 'greeting', learned: false }
        ]
    },

    // Типы упражнений
    exerciseTypes: [
        {
            id: 'multiple-choice',
            title: 'Выбор ответа',
            description: 'Выберите правильный вариант',
            icon: 'mdi-format-list-checks',
            color: '#4A90E2',
            points: 10
        },
        {
            id: 'translation',
            title: 'Перевод',
            description: 'Переведите слово или фразу',
            icon: 'mdi-translate',
            color: '#FF5252',
            points: 15
        },
        {
            id: 'matching',
            title: 'Сопоставление',
            description: 'Сопоставьте слова с переводами',
            icon: 'mdi-shuffle-variant',
            color: '#2196F3',
            points: 20
        }
    ],

    // Достижения
    achievements: [
        {
            id: 1,
            title: 'Первый шаг',
            description: 'Завершите первый урок',
            icon: 'mdi-school',
            color: '#4A90E2',
            points: 50,
            unlocked: false
        },
        {
            id: 2,
            title: 'Неделя обучения',
            description: 'Занимайтесь 7 дней подряд',
            icon: 'mdi-calendar-star',
            color: '#FF5252',
            points: 100,
            unlocked: false
        },
        {
            id: 3,
            title: 'Словарный запас',
            description: 'Выучите 50 слов',
            icon: 'mdi-notebook',
            color: '#2196F3',
            points: 150,
            unlocked: false
        },
        {
            id: 4,
            title: 'Полиглот',
            description: 'Изучите основы всех языков',
            icon: 'mdi-translate',
            color: '#FF9800',
            points: 200,
            unlocked: false
        }
    ]
};

// Функции для работы с данными
const DataManager = {
    // Сохранение данных в localStorage
    saveData(key, data) {
        try {
            localStorage.setItem(`enchiko_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения данных:', e);
            return false;
        }
    },

    // Загрузка данных из localStorage
    loadData(key) {
        try {
            const data = localStorage.getItem(`enchiko_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            return null;
        }
    },

    // Сброс прогресса
    resetProgress() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('enchiko_')) {
                localStorage.removeItem(key);
            }
        });
        return true;
    },

    // Получение прогресса пользователя
    getUserProgress() {
        const progress = this.loadData('progress') || {
            user: appData.user,
            languages: {},
            lessons: {},
            words: {},
            points: 0,
            streak: 0,
            lastActive: null
        };
        
        // Обновляем пользователя из appData если нужно
        if (!progress.user.avatar) {
            progress.user.avatar = null;
        }
        
        // Инициализируем прогресс языков
        appData.languages.forEach(lang => {
            if (!progress.languages[lang.id]) {
                progress.languages[lang.id] = {
                    completedLessons: 0,
                    progress: 0,
                    lastActive: null
                };
            }
        });
        
        return progress;
    },

    // Обновление прогресса
    updateProgress(updates) {
        const progress = this.getUserProgress();
        const updated = { ...progress, ...updates };
        this.saveData('progress', updated);
        return updated;
    }
};

// Экспорт данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { appData, DataManager };
}