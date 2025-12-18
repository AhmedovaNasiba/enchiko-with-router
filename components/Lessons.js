// Компонент страницы уроков
Vue.component('lessons-page', {
    // Свойства компонента
    props: {
        selectedLanguageId: String, // ID выбранного языка
        languages: Array           // Список языков
    },
    
    // Шаблон компонента
    template: `
        <v-container class="custom-container py-6">
            <v-row>
                <v-col cols="12">
                    <!-- Заголовок с кнопкой назад -->
                    <div class="d-flex align-center mb-4">
                        <v-btn icon class="mr-2" @click="$emit('go-back')">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <h1 class="display-1 font-weight-bold page-title primary--text">
                            Уроки {{ selectedLanguageName }}
                        </h1>
                    </div>
                    
                    <!-- Информационная панель о языке -->
                    <v-alert
                        v-if="selectedLanguage"
                        border="left"
                        colored-border
                        :color="selectedLanguage.color"
                        elevation="2"
                        class="mb-6"
                    >
                        <div class="d-flex align-center">
                            <!-- Иконка языка -->
                            <v-avatar size="50" class="mr-3" :color="selectedLanguage.color" dark>
                                <v-icon>{{ selectedLanguage.icon }}</v-icon>
                            </v-avatar>
                            
                            <!-- Информация о прогрессе -->
                            <div>
                                <h3 class="headline mb-1">Продолжайте изучать {{ selectedLanguageName }}</h3>
                                <p class="mb-0">
                                    Ваш прогресс: {{ progress }}%. 
                                    Следующий урок: {{ nextLessonTitle }}
                                </p>
                            </div>
                        </div>
                    </v-alert>
                </v-col>
            </v-row>
            
            <!-- Список уроков -->
            <v-row>
                <v-col
                    v-for="lesson in lessons"
                    :key="lesson.id"
                    cols="12"
                    md="6"
                    lg="4"
                >
                    <!-- Карточка урока -->
                    <v-card
                        :class="['pa-4', lesson.completed ? 'lesson-completed' : '']"
                        :color="lesson.completed ? 'green lighten-5' : 'grey lighten-5'"
                        @click="startLesson(lesson)"
                    >
                        <!-- Заголовок урока -->
                        <div class="d-flex justify-space-between align-center mb-3">
                            <v-chip small :color="lesson.completed ? 'green' : 'primary'" dark>
                                Урок {{ lesson.id }}
                            </v-chip>
                            <!-- Галочка для завершенных уроков -->
                            <v-icon v-if="lesson.completed" color="green">mdi-check-circle</v-icon>
                        </div>
                        
                        <!-- Информация об уроке -->
                        <h3 class="title mb-2">{{ lesson.title }}</h3>
                        <p class="mb-3">{{ lesson.description }}</p>
                        
                        <!-- Дополнительная информация -->
                        <div class="d-flex justify-space-between align-center mt-4">
                            <!-- Время урока -->
                            <span class="caption">
                                <v-icon small class="mr-1">mdi-clock-outline</v-icon>
                                {{ lesson.duration }} мин
                            </span>
                            <!-- Количество слов -->
                            <span class="caption">
                                <v-icon small class="mr-1">mdi-book-open-page-variant</v-icon>
                                {{ lesson.words }} слов
                            </span>
                        </div>
                        
                        <!-- Кнопка начала урока -->
                        <v-btn
                            block
                            class="mt-4"
                            :color="lesson.completed ? 'green' : 'primary'"
                            :outlined="lesson.completed"
                            @click.stop="startLesson(lesson)"
                        >
                            {{ lesson.completed ? 'Повторить' : 'Начать' }}
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    `,
    
    // Данные компонента
    data() {
        return {
            // Список уроков для выбранного языка
            lessons: []
        };
    },
    
    // Вычисляемые свойства
    computed: {
        // Выбранный язык
        selectedLanguage() {
            return this.languages.find(lang => lang.id === this.selectedLanguageId);
        },
        
        // Название выбранного языка
        selectedLanguageName() {
            return this.selectedLanguage ? this.selectedLanguage.name : '';
        },
        
        // Прогресс по выбранному языку
        progress() {
            if (!this.selectedLanguage) return 0;
            return Math.round((this.selectedLanguage.completedLessons / this.selectedLanguage.lessons) * 100);
        },
        
        // Название следующего урока
        nextLessonTitle() {
            const nextLesson = this.lessons.find(lesson => !lesson.completed);
            return nextLesson ? nextLesson.title : 'Все уроки завершены!';
        }
    },
    
    // Методы компонента
    methods: {
        // Загрузка уроков для выбранного языка
        loadLessons() {
            if (!this.selectedLanguageId) return;
            
            // Генерация уроков в зависимости от языка
            this.lessons = this.generateLessonsForLanguage(this.selectedLanguageId);
            
            // Отмечаем завершенные уроки
            this.markCompletedLessons();
        },
        
        // Генерация уроков для конкретного языка
        generateLessonsForLanguage(languageId) {
            const lessonsData = {
                chinese: [
                    { id: 1, title: 'Основные иероглифы', description: 'Изучите 20 основных иероглифов', duration: 15, words: 20, completed: true },
                    { id: 2, title: 'Тоны в китайском', description: 'Практика четырех тонов', duration: 20, words: 15, completed: true },
                    { id: 3, title: 'Приветствия', description: 'Основные фразы для общения', duration: 25, words: 25, completed: true },
                    { id: 4, title: 'Числа и счет', description: 'Цифры от 1 до 100', duration: 20, words: 30, completed: false },
                    { id: 5, title: 'Семья и отношения', description: 'Названия членов семьи', duration: 30, words: 35, completed: false }
                ],
                english: [
                    { id: 1, title: 'Алфавит и звуки', description: 'Изучение английского алфавита', duration: 10, words: 26, completed: true },
                    { id: 2, title: 'Основные глаголы', description: '50 самых важных глаголов', duration: 30, words: 50, completed: true },
                    { id: 3, title: 'Present Simple', description: 'Настоящее простое время', duration: 25, words: 40, completed: true },
                    { id: 4, title: 'Идиомы и выражения', description: 'Популярные английские идиомы', duration: 35, words: 30, completed: false }
                ],
                korean: [
                    { id: 1, title: 'Хангыль: гласные', description: 'Изучение корейских гласных', duration: 20, words: 10, completed: true },
                    { id: 2, title: 'Хангыль: согласные', description: 'Изучение корейских согласных', duration: 25, words: 14, completed: true },
                    { id: 3, title: 'Основные фразы', description: 'Фразы для повседневного общения', duration: 30, words: 25, completed: false }
                ]
            };
            
            return lessonsData[languageId] || [];
        },
        
        // Отметка завершенных уроков
        markCompletedLessons() {
            if (!this.selectedLanguage) return;
            
            // Отмечаем уроки как завершенные в зависимости от прогресса
            const completedCount = this.selectedLanguage.completedLessons;
            this.lessons.forEach((lesson, index) => {
                lesson.completed = index < completedCount;
            });
        },
        
        // Начало урока
        startLesson(lesson) {
            // Показываем сообщение о начале урока
            alert(`Начинаем урок: ${lesson.title}`);
            
            // Если урок еще не завершен, отмечаем его как завершенный
            if (!lesson.completed) {
                // Находим индекс урока
                const lessonIndex = this.lessons.findIndex(l => l.id === lesson.id);
                
                // Если это следующий по порядку урок
                if (lessonIndex === this.selectedLanguage.completedLessons) {
                    // Обновляем прогресс в родительском компоненте
                    this.$emit('complete-lesson', this.selectedLanguageId);
                    
                    // Обновляем статус урока
                    lesson.completed = true;
                    
                    // Показываем поздравление
                    this.showCongratulations(lesson);
                } else {
                    alert('Пожалуйста, пройдите уроки по порядку!');
                }
            }
        },
        
        // Показ поздравления
        showCongratulations(lesson) {
            // Создаем красивое уведомление
            const notification = {
                color: 'success',
                text: `Поздравляем! Вы завершили урок "${lesson.title}"`,
                timeout: 3000
            };
            
            // Эмитируем событие для показа уведомления
            this.$emit('show-notification', notification);
        }
    },
    
    // Наблюдатели
    watch: {
        // При изменении выбранного языка загружаем уроки
        selectedLanguageId() {
            this.loadLessons();
        }
    },
    
    // Хук при создании компонента
    created() {
        // Загружаем уроки при создании компонента
        this.loadLessons();
    }
});