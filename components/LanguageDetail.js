Vue.component('language-detail', {
    props: {
        languageId: String,
    },
    
    template: `
        <v-container class="custom-container py-6">
            <!-- Кнопка назад -->
            <div class="mb-6">
                <v-btn text @click="$emit('back')" class="back-btn" color="primary">
                    <v-icon left>mdi-arrow-left</v-icon>
                    Назад к языкам
                </v-btn>
            </div>
            
            <!-- Заголовок и описание языка -->
            <div class="mb-6 language-header">
                <div class="d-flex align-center mb-4">
                    <v-avatar size="64" :color="language.color" dark class="mr-4 language-avatar">
                        <v-icon size="32">{{ language.icon }}</v-icon>
                    </v-avatar>
                    <div class="language-title-container">
                        <h1 class="display-1 font-weight-bold primary--text language-title">
                            {{ language.name }}
                        </h1>
                        <p class="subtitle-1 grey--text text--darken-1 language-description mt-2">
                            {{ language.description }}
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Статистика языка -->
            <v-card class="pa-6 mb-8 language-stats-card">
                <v-row class="language-stats-grid">
                    <v-col cols="6" sm="3" class="text-center">
                        <div class="stat-value display-1 font-weight-bold" :style="{ color: language.color }">
                            {{ progress || 0 }}%
                        </div>
                        <div class="stat-label caption">Прогресс</div>
                    </v-col>
                    
                    <v-col cols="6" sm="3" class="text-center">
                        <div class="stat-value display-1 font-weight-bold" :style="{ color: language.color }">
                            {{ language.completedLessons || 0 }}
                        </div>
                        <div class="stat-label caption">Уроков завершено</div>
                    </v-col>
                    
                    <v-col cols="6" sm="3" class="text-center">
                        <div class="stat-value display-1 font-weight-bold" :style="{ color: language.color }">
                            {{ learnedWords || 0 }}
                        </div>
                        <div class="stat-label caption">Слов изучено</div>
                    </v-col>
                    
                    <v-col cols="6" sm="3" class="text-center">
                        <div class="stat-value display-1 font-weight-bold" :style="{ color: language.color }">
                            {{ language.difficulty }}
                        </div>
                        <div class="stat-label caption">Сложность</div>
                    </v-col>
                </v-row>
                
                <!-- Прогресс-бар -->
                <div class="mt-6">
                    <div class="d-flex justify-space-between mb-2">
                        <span class="body-2">Общий прогресс</span>
                        <span class="body-2 font-weight-bold">{{ progress || 0 }}%</span>
                    </div>
                    <v-progress-linear
                        :value="progress || 0"
                        height="16"
                        :color="language.color"
                        background-color="#E0E0E0"
                        class="language-progress-bar"
                        rounded
                    ></v-progress-linear>
                </div>
            </v-card>
            
            <!-- Категории -->
            <div class="mb-8">
                <h2 class="headline mb-4 section-title">Категории уроков</h2>
                
                <v-row class="categories-grid">
                    <v-col
                        v-for="category in language.categories"
                        :key="category.id"
                        cols="12"
                        sm="6"
                        md="3"
                    >
                        <v-card
                            class="category-card pa-4 text-center"
                            hover
                            @click="selectCategory(category.id)"
                            :style="{ borderLeftColor: category.color }"
                        >
                            <v-avatar size="64" :color="category.color" dark class="mb-3 category-icon">
                                <v-icon>{{ category.icon }}</v-icon>
                            </v-avatar>
                            
                            <h3 class="title mb-2 category-name">{{ category.name }}</h3>
                            <p class="body-2 mb-3 category-description">{{ category.description }}</p>
                            
                            <v-chip small :color="category.color" dark class="category-progress">
                                {{ getCategoryProgress(category.id) || 0 }} уроков
                            </v-chip>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
            
            <!-- Уроки выбранной категории -->
            <div v-if="selectedCategory" class="mb-8">
                <div class="d-flex justify-space-between align-center mb-6 section-header">
                    <div>
                        <h2 class="headline mb-2 lessons-title">Уроки: {{ selectedCategory.name }}</h2>
                        <p class="body-2 grey--text">{{ selectedCategory.description }}</p>
                    </div>
                    <v-chip :color="language.color" dark class="lessons-count">
                        {{ lessons.length || 0 }} уроков
                    </v-chip>
                </div>
                
                <v-row class="lessons-grid">
                    <v-col
                        v-for="lesson in lessons"
                        :key="lesson.id"
                        cols="12"
                        md="6"
                        lg="4"
                    >
                        <v-card
                            :class="['lesson-card pa-5', lesson.completed ? 'lesson-completed' : '']"
                            @click="startLesson(lesson)"
                        >
                            <div class="d-flex justify-space-between align-start mb-4">
                                <div>
                                    <v-chip small :color="lesson.completed ? 'green' : language.color" dark class="mb-3 lesson-number">
                                        Урок {{ lesson.order || 0 }}
                                    </v-chip>
                                    <h3 class="title mb-2 lesson-title">{{ lesson.title }}</h3>
                                    <p class="body-2 mb-3 lesson-description">{{ lesson.description }}</p>
                                </div>
                                
                                <v-icon
                                    v-if="lesson.completed"
                                    color="green"
                                    class="ml-2 lesson-completed-icon"
                                >
                                    mdi-check-circle
                                </v-icon>
                            </div>
                            
                            <div class="d-flex justify-space-between align-center lesson-footer">
                                <div class="lesson-meta">
                                    <v-chip x-small class="mr-2 lesson-duration">
                                        <v-icon x-small left>mdi-clock</v-icon>
                                        {{ lesson.duration || 0 }} мин
                                    </v-chip>
                                    <v-chip x-small :class="getDifficultyClass(lesson.difficulty)" class="lesson-difficulty">
                                        {{ lesson.difficulty || 'Начинающий' }}
                                    </v-chip>
                                </div>
                                
                                <!-- ЯРКАЯ КРАСНАЯ КНОПКА -->
                                <v-btn
                                    :color="lesson.completed ? 'green' : 'secondary'"
                                    @click.stop="startLesson(lesson)"
                                    class="btn-lesson lesson-btn"
                                >
                                    {{ lesson.completed ? 'Повторить' : 'Начать' }}
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
                
                <!-- Сообщение, если нет уроков -->
                <v-alert
                    v-if="lessons.length === 0"
                    type="info"
                    class="mt-4 no-lessons-alert"
                >
                    В этой категории пока нет уроков. Скоро добавим!
                </v-alert>
            </div>
            
            <!-- Совет по изучению -->
            <v-card class="pa-6 study-tip-card" color="orange lighten-5">
                <div class="d-flex align-center">
                    <v-icon color="orange" large class="mr-4 study-tip-icon">mdi-lightbulb-on</v-icon>
                    <div>
                        <h3 class="title orange--text mb-2">Совет по изучению</h3>
                        <p class="body-1 mb-0 study-tip-text">
                            Начните с категории "Основы" и проходите уроки по порядку.
                            Рекомендуем заниматься по 15-20 минут каждый день для лучшего запоминания.
                        </p>
                    </div>
                </div>
            </v-card>
            
            <style>
                /* Стили для компонента деталей языка */
                .back-btn {
                    padding: 8px 16px;
                    font-weight: 600;
                    margin-bottom: 24px;
                }
                
                .language-header {
                    margin-bottom: 32px;
                }
                
                .language-avatar {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    flex-shrink: 0;
                }
                
                .language-title-container {
                    flex: 1;
                    min-width: 0;
                }
                
                .language-title {
                    font-size: 2.2rem !important;
                    line-height: 1.2 !important;
                    margin-bottom: 8px;
                    word-break: break-word;
                    overflow-wrap: break-word;
                }
                
                .language-description {
                    line-height: 1.6;
                    max-width: 600px;
                    color: #666;
                }
                
                .language-stats-card {
                    border-radius: 16px;
                    background-color: var(--light-grey);
                    margin-top: 16px !important;
                }
                
                .language-stats-grid {
                    margin: -8px;
                }
                
                .language-stats-grid .v-col {
                    padding: 8px !important;
                }
                
                .stat-value {
                    line-height: 1;
                    margin-bottom: 8px;
                    font-size: 2.2rem !important;
                }
                
                .stat-label {
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 0.75rem;
                }
                
                .language-progress-bar {
                    border-radius: 8px;
                }
                
                /* Категории */
                .categories-grid {
                    margin: -12px;
                }
                
                .categories-grid .v-col {
                    padding: 12px !important;
                }
                
                .category-icon {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                
                .category-card:hover .category-icon {
                    transform: scale(1.1);
                }
                
                .category-name {
                    font-weight: 700;
                    color: var(--dark-color);
                    font-size: 1.1rem !important;
                }
                
                .category-description {
                    color: #666;
                    min-height: 40px;
                    line-height: 1.5;
                }
                
                .category-progress {
                    font-weight: 600;
                    padding: 4px 12px;
                }
                
                /* Уроки */
                .lessons-grid {
                    margin: -12px;
                }
                
                .lessons-grid .v-col {
                    padding: 12px !important;
                }
                
                .lesson-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                    min-height: 220px;
                }
                
                .lesson-card:hover {
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
                }
                
                .lesson-number {
                    font-weight: 600;
                }
                
                .lesson-title {
                    font-weight: 700;
                    line-height: 1.3;
                    margin-bottom: 12px;
                    font-size: 1.2rem !important;
                }
                
                .lesson-description {
                    color: #666;
                    line-height: 1.5;
                    flex-grow: 1;
                    font-size: 0.95rem;
                }
                
                .lesson-completed-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }
                
                .lesson-footer {
                    margin-top: auto;
                    padding-top: 16px;
                    border-top: 1px solid var(--medium-grey);
                }
                
                .lesson-meta {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .lesson-duration, .lesson-difficulty {
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                
                .lesson-btn {
                    font-weight: 600;
                    padding: 8px 24px !important;
                    min-width: 100px;
                    flex-shrink: 0;
                }
                
                .no-lessons-alert {
                    border-radius: 12px;
                }
                
                /* Совет по изучению */
                .study-tip-card {
                    border-radius: 16px;
                    border: 2px solid #FFF3E0;
                    margin-top: 24px;
                }
                
                .study-tip-icon {
                    flex-shrink: 0;
                }
                
                .study-tip-text {
                    line-height: 1.6;
                }
                
                /* Адаптивность */
                @media (max-width: 960px) {
                    .language-title {
                        font-size: 1.8rem !important;
                    }
                    
                    .language-stats-card {
                        padding: 24px !important;
                    }
                    
                    .category-card, .lesson-card {
                        padding: 20px !important;
                    }
                    
                    .stat-value {
                        font-size: 1.8rem !important;
                    }
                }
                
                @media (max-width: 600px) {
                    .language-title {
                        font-size: 1.6rem !important;
                    }
                    
                    .language-stats-grid .v-col {
                        margin-bottom: 16px;
                    }
                    
                    .categories-grid .v-col {
                        margin-bottom: 16px;
                    }
                    
                    .lesson-card {
                        padding: 16px !important;
                        min-height: 200px;
                    }
                    
                    .lesson-footer {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    
                    .lesson-btn {
                        width: 100%;
                        margin-top: 8px;
                    }
                    
                    .stat-value {
                        font-size: 1.6rem !important;
                    }
                }
            </style>
        </v-container>
    `,
    
    data() {
        return {
            selectedCategory: null,
            lessons: []
        };
    },
    
    computed: {
        ...Vuex.mapState(['languages', 'user']),
        ...Vuex.mapGetters(['getLanguageProgress']),
        
        language() {
            return this.languages.find(lang => lang.id === this.languageId) || {};
        },
        
        progress() {
            return this.getLanguageProgress(this.languageId);
        },
        
        learnedWords() {
            return (this.language.completedLessons || 0) * 5;
        }
    },
    
    methods: {
        ...Vuex.mapActions(['startLesson']),
        
        selectCategory(categoryId) {
            this.selectedCategory = this.language.categories.find(c => c.id === categoryId);
            this.loadLessons(categoryId);
        },
        
        loadLessons(categoryId) {
            this.lessons = appData.lessons[this.languageId]?.[categoryId] || [];
            this.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
            
            const progress = DataManager.getUserProgress();
            this.lessons.forEach(lesson => {
                lesson.completed = !!progress.lessons?.[this.languageId]?.[lesson.id]?.completed;
            });
        },
        
        getCategoryProgress(categoryId) {
            const lessons = appData.lessons[this.languageId]?.[categoryId] || [];
            const progress = DataManager.getUserProgress();
            const completed = lessons.filter(lesson => 
                progress.lessons?.[this.languageId]?.[lesson.id]?.completed
            ).length;
            return completed || 0;
        },
        
        getDifficultyClass(difficulty) {
            const classes = {
                'Начинающий': 'badge-beginner',
                'Средний': 'badge-intermediate',
                'Продвинутый': 'badge-advanced'
            };
            return classes[difficulty] || 'badge-beginner';
        }
    },
    
    created() {
        if (this.language.categories && this.language.categories.length > 0) {
            this.selectCategory(this.language.categories[0].id);
        }
    }
});