// Компонент прогресса (обновленный)
Vue.component('progress-page', {
    props: {
        languages: Array,
        user: Object
    },
    
    template: `
        <v-container class="custom-container py-6">
            <!-- Заголовок -->
            <div class="mb-6">
                <h1 class="display-1 font-weight-bold page-title primary--text">Мой прогресс</h1>
                <p class="subtitle-1 grey--text text--darken-1">
                    Отслеживайте свои успехи в изучении языков
                </p>
            </div>
            
            <v-row>
                <!-- Левая колонка - основной прогресс -->
                <v-col cols="12" md="8">
                    <!-- Карточка прогресса по языкам -->
                    <v-card class="mb-6 content-card">
                        <h2 class="headline mb-4 section-title">Прогресс по языкам</h2>
                        
                        <!-- Прогресс для каждого языка -->
                        <div v-for="language in languages" :key="language.id" class="mb-6">
                            <!-- Заголовок языка -->
                            <div class="d-flex justify-space-between align-center mb-3">
                                <div class="d-flex align-center">
                                    <!-- Иконка языка -->
                                    <v-avatar size="48" :color="language.color" dark class="mr-3">
                                        <v-icon>{{ language.icon }}</v-icon>
                                    </v-avatar>
                                    
                                    <!-- Название и статистика -->
                                    <div>
                                        <h3 class="title mb-1">{{ language.name }}</h3>
                                        <div class="caption">
                                            {{ language.completedLessons }}/{{ language.totalLessons }} уроков завершено
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Процент прогресса -->
                                <div class="text-right">
                                    <div class="title font-weight-bold" :style="{ color: language.color }">
                                        {{ getLanguageProgress(language.id) }}%
                                    </div>
                                    <div class="caption">Прогресс</div>
                                </div>
                            </div>
                            
                            <!-- Прогресс-бар -->
                            <v-progress-linear
                                :value="getLanguageProgress(language.id)"
                                height="16"
                                :color="language.color"
                                background-color="#E0E0E0"
                                class="language-progress"
                                rounded
                            >
                                <template v-slot:default="{ value }">
                                    <strong>{{ Math.ceil(value) }}%</strong>
                                </template>
                            </v-progress-linear>
                        </div>
                    </v-card>
                    
                    <!-- Карточка общей статистики -->
                    <v-card class="content-card">
                        <h2 class="headline mb-4 section-title">Статистика обучения</h2>
                        
                        <!-- Список статистики -->
                        <v-row class="stats-grid">
                            <v-col cols="12" sm="6" md="3" v-for="stat in stats" :key="stat.title">
                                <v-card class="stats-card text-center" :color="stat.color" dark>
                                    <v-card-text class="pa-4">
                                        <v-icon size="48" class="mb-3">{{ stat.icon }}</v-icon>
                                        <div class="display-1 font-weight-bold mb-2">{{ stat.value }}</div>
                                        <div class="subtitle-2">{{ stat.title }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="my-6"></v-divider>
                        
                        <!-- Детальная статистика -->
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-list class="stats-list">
                                    <v-list-item class="stats-list-item">
                                        <v-list-item-icon class="stats-icon">
                                            <v-icon color="primary">mdi-timer</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Время обучения</v-list-item-title>
                                            <v-list-item-subtitle>{{ studyTime }} часов</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    
                                    <v-list-item class="stats-list-item">
                                        <v-list-item-icon class="stats-icon">
                                            <v-icon color="green">mdi-target</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Точность ответов</v-list-item-title>
                                            <v-list-item-subtitle>{{ accuracy }}%</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                                <v-list class="stats-list">
                                    <v-list-item class="stats-list-item">
                                        <v-list-item-icon class="stats-icon">
                                            <v-icon color="orange">mdi-trophy</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Достижения</v-list-item-title>
                                            <v-list-item-subtitle>{{ unlockedAchievements }}/{{ totalAchievements }} разблокировано</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    
                                    <v-list-item class="stats-list-item">
                                        <v-list-item-icon class="stats-icon">
                                            <v-icon color="purple">mdi-trending-up</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Рост навыков</v-list-item-title>
                                            <v-list-item-subtitle>+{{ skillGrowth }}% за месяц</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                
                <!-- Правая колонка - достижения и награды -->
                <v-col cols="12" md="4">
                    <!-- Карточка достижений -->
                    <v-card class="mb-6 content-card achievement-container">
                        <h2 class="headline mb-4 section-title">Достижения</h2>
                        
                        <!-- Список достижений -->
                        <div v-for="achievement in achievements" :key="achievement.id" 
                             :class="['achievement-card', { 'unlocked': achievement.unlocked }]">
                            <div class="d-flex align-center">
                                <!-- Иконка достижения -->
                                <v-avatar 
                                    size="56" 
                                    :color="achievement.unlocked ? achievement.color : '#E0E0E0'" 
                                    class="mr-3 achievement-icon"
                                    :class="{ 'unlocked-icon': achievement.unlocked }"
                                >
                                    <v-icon dark size="28">{{ achievement.icon }}</v-icon>
                                </v-avatar>
                                
                                <!-- Описание достижения -->
                                <div class="achievement-content">
                                    <h4 class="title mb-1" :class="{ 'unlocked-title': achievement.unlocked }">
                                        {{ achievement.title }}
                                    </h4>
                                    <p class="caption mb-2 achievement-description">{{ achievement.description }}</p>
                                    
                                    <!-- Прогресс, если достижение не разблокировано -->
                                    <div v-if="!achievement.unlocked" class="achievement-progress">
                                        <v-progress-linear
                                            :value="achievement.progress"
                                            height="8"
                                            color="primary"
                                            background-color="#E0E0E0"
                                            rounded
                                        ></v-progress-linear>
                                        <div class="caption text-right mt-1">{{ achievement.progress }}%</div>
                                    </div>
                                    
                                    <!-- Награда -->
                                    <div class="achievement-reward">
                                        <v-chip x-small :color="achievement.unlocked ? 'green' : 'grey'" dark>
                                            <v-icon x-small left>mdi-star</v-icon>
                                            {{ achievement.points }} очков
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-card>
                    
                    <!-- Карточка следующей цели -->
                    <v-card class="content-card goal-card">
                        <h2 class="headline mb-4 section-title">Следующая цель</h2>
                        
                        <!-- Текущая цель -->
                        <div class="text-center mb-4">
                            <v-icon size="64" color="primary" class="mb-3 goal-icon">mdi-flag-checkered</v-icon>
                            <h3 class="title mb-2 goal-title">{{ nextGoal.title }}</h3>
                            <p class="body-2 goal-description">{{ nextGoal.description }}</p>
                        </div>
                        
                        <!-- Прогресс цели -->
                        <v-progress-linear
                            :value="nextGoal.progress"
                            height="20"
                            color="primary"
                            background-color="#E0E0E0"
                            class="mb-4 goal-progress"
                            rounded
                        >
                            <template v-slot:default="{ value }">
                                <strong class="goal-progress-text">{{ Math.ceil(value) }}%</strong>
                            </template>
                        </v-progress-linear>
                        
                        <!-- Награда за цель -->
                        <div class="text-center">
                            <v-chip color="primary" dark class="goal-reward-chip">
                                <v-icon left>mdi-gift</v-icon>
                                Награда: {{ nextGoal.reward }} очков
                            </v-chip>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            
            <style>
                /* Стили для компонента прогресса */
                .achievement-container {
                    background-color: var(--achievement-bg) !important;
                }
                
                .achievement-card {
                    background-color: white;
                    border: 1px solid var(--medium-grey);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    transition: all 0.3s ease;
                }
                
                .achievement-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .achievement-card.unlocked {
                    background: linear-gradient(135deg, #FFF9C4, #FFECB3);
                    border: 2px solid #FFD54F;
                }
                
                .achievement-icon {
                    transition: all 0.3s ease;
                }
                
                .achievement-icon.unlocked-icon {
                    box-shadow: 0 4px 8px rgba(255, 213, 79, 0.3);
                }
                
                .achievement-content {
                    flex: 1;
                }
                
                .unlocked-title {
                    color: #FF9800;
                    font-weight: 700;
                }
                
                .achievement-description {
                    color: #666;
                    line-height: 1.4;
                }
                
                .achievement-progress {
                    margin-top: 8px;
                }
                
                .achievement-reward {
                    margin-top: 8px;
                }
                
                /* Статистика */
                .stats-grid {
                    margin: -8px;
                }
                
                .stats-grid .v-col {
                    padding: 8px !important;
                }
                
                .stats-card {
                    border-radius: 12px;
                    height: 100%;
                    transition: transform 0.3s ease;
                }
                
                .stats-card:hover {
                    transform: translateY(-4px);
                }
                
                .stats-list {
                    background-color: transparent;
                }
                
                .stats-list-item {
                    padding: 12px 0;
                }
                
                .stats-list-item:not(:last-child) {
                    border-bottom: 1px solid var(--medium-grey);
                }
                
                .stats-icon {
                    min-width: 40px;
                }
                
                /* Цели */
                .goal-card {
                    background: linear-gradient(135deg, #E3F2FD, #F3E5F5);
                    border: 1px solid #BBDEFB;
                }
                
                .goal-icon {
                    opacity: 0.9;
                }
                
                .goal-title {
                    color: var(--primary-color);
                    font-weight: 700;
                }
                
                .goal-description {
                    color: #666;
                    line-height: 1.5;
                }
                
                .goal-progress {
                    border-radius: 10px;
                    overflow: hidden;
                }
                
                .goal-progress-text {
                    color: white;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                
                .goal-reward-chip {
                    font-weight: 600;
                    padding: 8px 16px;
                }
            </style>
        </v-container>
    `,
    
    data() {
        return {
            // Статистика
            stats: [
                { title: 'Очков знаний', value: 0, icon: 'mdi-star', color: 'primary' },
                { title: 'Дней подряд', value: 0, icon: 'mdi-fire', color: 'secondary' },
                { title: 'Изучено слов', value: 0, icon: 'mdi-translate', color: 'orange darken-2' },
                { title: 'Уроков завершено', value: 0, icon: 'mdi-book-check', color: 'green darken-2' }
            ],
            
            // Достижения пользователя
            achievements: [
                {
                    id: 1,
                    title: 'Первый шаг',
                    description: 'Завершите ваш первый урок',
                    icon: 'mdi-school',
                    color: '#4A90E2',
                    points: 50,
                    unlocked: false,
                    progress: 0
                },
                {
                    id: 2,
                    title: 'Неделя обучения',
                    description: 'Занимайтесь 7 дней подряд',
                    icon: 'mdi-calendar-star',
                    color: '#FF5252',
                    points: 100,
                    unlocked: false,
                    progress: 0
                },
                {
                    id: 3,
                    title: 'Словарный запас',
                    description: 'Выучите 50 слов',
                    icon: 'mdi-notebook',
                    color: '#2196F3',
                    points: 150,
                    unlocked: false,
                    progress: 0
                },
                {
                    id: 4,
                    title: 'Полиглот',
                    description: 'Изучите основы всех языков',
                    icon: 'mdi-translate',
                    color: '#FF9800',
                    points: 200,
                    unlocked: false,
                    progress: 0
                }
            ],
            
            // Следующая цель
            nextGoal: {
                title: 'Завершите первый урок',
                description: 'Сделайте первые шаги в изучении языков',
                progress: 0,
                reward: 50
            },
            
            // Дополнительная статистика
            studyTime: 0,
            accuracy: 0,
            unlockedAchievements: 0,
            totalAchievements: 4,
            skillGrowth: 0
        };
    },
    
    computed: {
        // Общее количество завершенных уроков
        totalLessons() {
            return this.languages.reduce((total, lang) => {
                return total + lang.completedLessons;
            }, 0);
        },
        
        // Количество изученных слов
        learnedWords() {
            // В реальном приложении нужно считать из данных
            return this.totalLessons * 5; // Пример: 5 слов на урок
        }
    },
    
    methods: {
        // Расчет прогресса по языку
        getLanguageProgress(languageId) {
            const language = this.languages.find(lang => lang.id === languageId);
            if (!language) return 0;
            return Math.round((language.completedLessons / language.totalLessons) * 100);
        },
        
        // Обновление статистики
        updateStats() {
            // Обновляем статистику
            this.stats[0].value = this.user.points;
            this.stats[1].value = this.user.streak;
            this.stats[2].value = this.learnedWords;
            this.stats[3].value = this.totalLessons;
            
            // Обновляем достижения
            this.updateAchievements();
            
            // Обновляем следующую цель
            this.updateNextGoal();
            
            // Обновляем дополнительную статистику
            this.updateAdditionalStats();
        },
        
        // Обновление достижений
        updateAchievements() {
            // Достижение 1: Первый шаг
            this.achievements[0].progress = Math.min((this.totalLessons / 1) * 100, 100);
            this.achievements[0].unlocked = this.totalLessons >= 1;
            
            // Достижение 2: Неделя обучения
            this.achievements[1].progress = Math.min((this.user.streak / 7) * 100, 100);
            this.achievements[1].unlocked = this.user.streak >= 7;
            
            // Достижение 3: Словарный запас
            this.achievements[2].progress = Math.min((this.learnedWords / 50) * 100, 100);
            this.achievements[2].unlocked = this.learnedWords >= 50;
            
            // Достижение 4: Полиглот
            const languagesStarted = this.languages.filter(lang => lang.completedLessons > 0).length;
            this.achievements[3].progress = Math.min((languagesStarted / this.languages.length) * 100, 100);
            this.achievements[3].unlocked = languagesStarted === this.languages.length;
            
            // Считаем разблокированные достижения
            this.unlockedAchievements = this.achievements.filter(a => a.unlocked).length;
        },
        
        // Обновление следующей цели
        updateNextGoal() {
            const completedLessons = this.totalLessons;
            
            if (completedLessons === 0) {
                this.nextGoal = {
                    title: 'Завершите первый урок',
                    description: 'Сделайте первые шаги в изучении языков',
                    progress: 0,
                    reward: 50
                };
            } else if (completedLessons < 5) {
                this.nextGoal = {
                    title: 'Завершите 5 уроков',
                    description: 'Постройте прочный фундамент знаний',
                    progress: Math.min((completedLessons / 5) * 100, 100),
                    reward: 100
                };
            } else if (completedLessons < 15) {
                this.nextGoal = {
                    title: 'Завершите 15 уроков',
                    description: 'Станьте уверенным учеником',
                    progress: Math.min((completedLessons / 15) * 100, 100),
                    reward: 200
                };
            } else {
                this.nextGoal = {
                    title: 'Завершите 30 уроков',
                    description: 'Достигните продвинутого уровня',
                    progress: Math.min((completedLessons / 30) * 100, 100),
                    reward: 500
                };
            }
        },
        
        // Обновление дополнительной статистики
        updateAdditionalStats() {
            // Время обучения (примерная оценка: 15 минут на урок)
            this.studyTime = Math.round(this.totalLessons * 15 / 60);
            
            // Точность ответов (случайное значение для демонстрации)
            this.accuracy = Math.min(95, 70 + Math.floor(this.totalLessons * 2));
            
            // Рост навыков
            this.skillGrowth = Math.min(100, Math.floor(this.totalLessons * 3));
        }
    },
    
    created() {
        this.updateStats();
    },
    
    watch: {
        user: {
            handler() {
                this.updateStats();
            },
            deep: true
        },
        
        languages: {
            handler() {
                this.updateStats();
            },
            deep: true
        }
    }
});