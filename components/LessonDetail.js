Vue.component('lesson-detail', {
    props: {
        lesson: Object,
        languageId: String,
    },
    
    template: `
        <v-container class="custom-container py-6">
            <!-- Навигация -->
            <div class="d-flex justify-space-between align-center mb-6">
                <v-btn text @click="$emit('back')" class="back-btn" color="primary">
                    <v-icon left>mdi-arrow-left</v-icon>
                    Назад к урокам
                </v-btn>
                
                <div class="text-right">
                    <v-chip color="primary" dark class="mr-2">
                        <v-icon small left>mdi-star</v-icon>
                        {{ user.points }} очков
                    </v-chip>
                    <v-chip :color="lesson.completed ? 'green' : 'orange'" dark>
                        <v-icon small left>{{ lesson.completed ? 'mdi-check' : 'mdi-progress-clock' }}</v-icon>
                        {{ lesson.completed ? 'Завершено' : 'В процессе' }}
                    </v-chip>
                </div>
            </div>
            
            <!-- Заголовок урока -->
            <div class="mb-8 lesson-header">
                <div class="d-flex align-center mb-3">
                    <v-chip color="primary" dark class="mr-3">
                        Урок {{ lesson.order || 0 }}
                    </v-chip>
                    <span class="caption">{{ lesson.duration || 0 }} мин • {{ lesson.difficulty || 'Начинающий' }}</span>
                </div>
                
                <h1 class="display-1 font-weight-bold lesson-main-title">{{ lesson.title }}</h1>
                <p class="subtitle-1 grey--text text--darken-1 lesson-description mt-2">{{ lesson.description }}</p>
            </div>
            
            <!-- Контент урока -->
            <v-row>
                <!-- Основной контент -->
                <v-col cols="12" lg="8">
                    <v-card class="lesson-content pa-6 mb-6">
                        <!-- Введение -->
                        <div v-if="lesson.content?.introduction" class="mb-8">
                            <h3 class="headline mb-4 section-title">Введение</h3>
                            <div class="text-content">{{ lesson.content.introduction }}</div>
                        </div>
                        
                        <!-- Правила -->
                        <div v-if="lesson.content?.rules && lesson.content.rules.length > 0" class="mb-8">
                            <h3 class="headline mb-4 section-title">Правила</h3>
                            <div v-for="(rule, index) in lesson.content.rules" :key="index" class="rule-card mb-5">
                                <div class="rule-title">
                                    <v-icon small>mdi-rule</v-icon>
                                    {{ rule.title }}
                                </div>
                                <p class="body-2 mb-4">{{ rule.description }}</p>
                                
                                <!-- Примеры правил -->
                                <div v-if="rule.examples && rule.examples.length > 0" class="mt-4">
                                    <div class="body-2 font-weight-bold mb-3">Примеры:</div>
                                    <div v-for="(example, exIndex) in rule.examples" :key="exIndex" class="example-card mb-3">
                                        <div class="example-original">{{ example.original }}</div>
                                        <div class="example-translation">{{ example.translation }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Словарь -->
                        <div v-if="lesson.content?.vocabulary && lesson.content.vocabulary.length > 0" class="mb-8">
                            <h3 class="headline mb-4 section-title">Новые слова</h3>
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Слово</th>
                                            <th class="text-left">Транскрипция</th>
                                            <th class="text-left">Перевод</th>
                                            <th class="text-left">Категория</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(word, index) in lesson.content.vocabulary" :key="index">
                                            <td class="font-weight-bold">{{ word.word }}</td>
                                            <td class="grey--text">{{ word.pinyin || word.transcription }}</td>
                                            <td>{{ word.translation }}</td>
                                            <td><v-chip x-small>{{ word.category }}</v-chip></td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </div>
                        
                        <!-- Упражнения -->
                        <div v-if="lesson.content?.exercises && lesson.content.exercises.length > 0" class="mb-8">
                            <h3 class="headline mb-4 section-title">Практика</h3>
                            <div v-for="(exercise, index) in lesson.content.exercises" :key="index" class="mb-6">
                                <v-card class="pa-6 exercise-container">
                                    <div class="subtitle-1 font-weight-bold mb-4 question-text">{{ exercise.question }}</div>
                                    
                                    <!-- Варианты ответов -->
                                    <div v-if="exercise.type === 'multiple-choice'" class="mt-4">
                                        <v-radio-group v-model="selectedAnswers[index]" class="options-group">
                                            <v-radio
                                                v-for="(option, optIndex) in exercise.options"
                                                :key="optIndex"
                                                :label="option.text"
                                                :value="optIndex"
                                                class="mb-3"
                                                :disabled="exerciseResults[index] !== undefined"
                                            ></v-radio>
                                        </v-radio-group>
                                    </div>
                                    
                                    <!-- Поле для ввода для translation -->
                                    <div v-else-if="exercise.type === 'translation'" class="mt-4">
                                        <v-text-field
                                            v-model="translationAnswers[index]"
                                            label="Введите перевод"
                                            outlined
                                            :disabled="exerciseResults[index] !== undefined"
                                            class="translation-input"
                                            @keyup.enter="checkExercise(index)"
                                        ></v-text-field>
                                    </div>
                                    
                                    <!-- Кнопка проверки -->
                                    <div class="mt-6">
                                        <v-btn
                                            color="secondary"
                                            @click="checkExercise(index)"
                                            :disabled="!canCheckExercise(index) || exerciseResults[index] !== undefined"
                                            class="check-btn btn-check"
                                            large
                                        >
                                            <v-icon left>mdi-check</v-icon>
                                            Проверить ответ
                                        </v-btn>
                                    </div>
                                    
                                    <!-- Результат проверки -->
                                    <div v-if="exerciseResults[index] !== undefined" class="mt-6">
                                        <v-alert
                                            :type="exerciseResults[index] ? 'success' : 'error'"
                                            dense
                                            prominent
                                            class="result-alert"
                                        >
                                            <div class="d-flex align-center">
                                                <v-icon large class="mr-3">
                                                    {{ exerciseResults[index] ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                                </v-icon>
                                                <div>
                                                    <h4 class="title mb-1">
                                                        {{ exerciseResults[index] ? 'Правильно!' : 'Неправильно' }}
                                                    </h4>
                                                    <p class="mb-0">
                                                        {{ exerciseResults[index] ? 'Отличная работа!' : 'Попробуйте еще раз' }}
                                                    </p>
                                                    <div v-if="!exerciseResults[index] && getCorrectAnswer(exercise)" class="mt-2">
                                                        Правильный ответ: <strong>{{ getCorrectAnswer(exercise) }}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-alert>
                                    </div>
                                </v-card>
                            </div>
                        </div>
                        
                        <!-- Подсказки -->
                        <v-card class="mt-6" color="blue lighten-5">
                            <v-card-text>
                                <div class="d-flex align-center">
                                    <v-icon color="blue" class="mr-3">mdi-information</v-icon>
                                    <div>
                                        <h4 class="title blue--text mb-2">Совет по изучению</h4>
                                        <p class="mb-0">
                                            Повторяйте новые слова несколько раз в день. 
                                            Попробуйте составить свои примеры с изученными словами.
                                        </p>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-col>
                
                <!-- Боковая панель -->
                <v-col cols="12" lg="4">
                    <!-- Прогресс урока -->
                    <v-card class="mb-6 pa-6 text-center progress-card">
                        <div class="mb-6">
                            <v-progress-circular
                                :size="140"
                                :width="15"
                                :value="lessonProgress"
                                :color="lesson.completed ? 'green' : 'primary'"
                            >
                                <span class="headline">{{ lessonProgress }}%</span>
                            </v-progress-circular>
                        </div>
                        
                        <h3 class="title mb-3">Прогресс урока</h3>
                        <p class="body-2 mb-5">
                            Изучено {{ completedSections }}/{{ totalSections }} разделов
                        </p>
                        
                        <!-- ЯРКАЯ КРАСНАЯ КНОПКА завершения урока -->
                        <v-btn
                            block
                            large
                            :color="lesson.completed ? 'green' : 'secondary'"
                            @click="completeLesson"
                            :disabled="lessonProgress < 100 && !lesson.completed"
                            class="btn-lesson complete-btn"
                        >
                            <v-icon left>{{ lesson.completed ? 'mdi-check' : 'mdi-check-circle' }}</v-icon>
                            {{ lesson.completed ? 'Урок завершен' : 'Завершить урок' }}
                        </v-btn>
                    </v-card>
                    
                    <!-- Краткое содержание -->
                    <v-card class="mb-6">
                        <v-card-title class="headline">
                            <v-icon left>mdi-format-list-bulleted</v-icon>
                            Содержание
                        </v-card-title>
                        
                        <v-card-text>
                            <v-list dense>
                                <v-list-item
                                    v-for="(section, index) in lessonSections"
                                    :key="index"
                                    @click="scrollToSection(section.id)"
                                    class="mb-2 section-item"
                                >
                                    <v-list-item-icon>
                                        <v-icon
                                            :color="section.completed ? 'green' : 'grey'"
                                            small
                                        >
                                            {{ section.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    
                                    <v-list-item-content>
                                        <v-list-item-title class="body-2">
                                            {{ section.title }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                    
                    <!-- Следующий урок -->
                    <v-card v-if="nextLesson" color="green lighten-5">
                        <v-card-title class="headline green--text">
                            <v-icon left color="green">mdi-arrow-right</v-icon>
                            Следующий урок
                        </v-card-title>
                        
                        <v-card-text>
                            <h4 class="title mb-2">{{ nextLesson.title }}</h4>
                            <p class="caption mb-3">{{ nextLesson.description }}</p>
                            
                            <v-btn
                                block
                                color="green"
                                dark
                                @click="startNextLesson"
                                class="next-lesson-btn"
                            >
                                Начать следующий урок
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    `,
    
    data() {
        return {
            selectedAnswers: {},
            translationAnswers: {},
            exerciseResults: {},
            completedSections: [],
            lessonSections: [
                { id: 'introduction', title: 'Введение', completed: false },
                { id: 'rules', title: 'Правила', completed: false },
                { id: 'vocabulary', title: 'Словарь', completed: false },
                { id: 'exercises', title: 'Упражнения', completed: false }
            ]
        };
    },
    
    computed: {
        ...Vuex.mapState(['user']),
        
        lessonProgress() {
            const total = this.lessonSections.length;
            const completed = this.lessonSections.filter(s => s.completed).length;
            return Math.round((completed / total) * 100);
        },
        
        totalSections() {
            return this.lessonSections.length;
        },
        
        nextLesson() {
            return null;
        }
    },
    
    methods: {
        ...Vuex.mapActions(['completeLesson', 'showNotification']),
        
        canCheckExercise(index) {
            const exercise = this.lesson.content.exercises[index];
            
            if (exercise.type === 'multiple-choice') {
                return this.selectedAnswers[index] !== undefined;
            } else if (exercise.type === 'translation') {
                return this.translationAnswers[index] && this.translationAnswers[index].trim().length > 0;
            }
            return false;
        },
        
        checkExercise(index) {
            if (!this.canCheckExercise(index) || this.exerciseResults[index] !== undefined) return;
            
            const exercise = this.lesson.content.exercises[index];
            let isCorrect = false;
            
            if (exercise.type === 'multiple-choice') {
                const selectedIndex = this.selectedAnswers[index];
                isCorrect = exercise.options[selectedIndex]?.correct === true;
            } else if (exercise.type === 'translation') {
                const userAnswer = this.translationAnswers[index].trim().toLowerCase();
                const correctAnswer = exercise.correctAnswer.toLowerCase();
                isCorrect = userAnswer === correctAnswer;
            }
            
            this.exerciseResults[index] = isCorrect;
            
            if (isCorrect) {
                this.markSectionComplete('exercises');
            }
            
            this.showNotification({
                type: isCorrect ? 'success' : 'error',
                message: isCorrect ? 'Правильно!' : 'Неправильно, попробуйте еще раз',
                icon: isCorrect ? 'mdi-check' : 'mdi-close'
            });
        },
        
        getCorrectAnswer(exercise) {
            if (exercise.type === 'multiple-choice') {
                const correctOption = exercise.options.find(opt => opt.correct);
                return correctOption ? correctOption.text : '';
            } else if (exercise.type === 'translation') {
                return exercise.correctAnswer;
            }
            return '';
        },
        
        markSectionComplete(sectionId) {
            const section = this.lessonSections.find(s => s.id === sectionId);
            if (section && !section.completed) {
                section.completed = true;
                this.completedSections.push(sectionId);
            }
        },
        
        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },
        
        completeLesson() {
            if (this.lessonProgress >= 100 || this.lesson.completed) {
                const points = 25;
                this.$store.dispatch('completeLesson', {
                    languageId: this.languageId,
                    lessonId: this.lesson.id,
                    points: points
                });
                this.lesson.completed = true;
                
                this.showNotification({
                    type: 'success',
                    message: 'Поздравляем! Вы завершили урок!',
                    icon: 'mdi-trophy'
                });
            } else {
                this.showNotification({
                    type: 'warning',
                    message: 'Завершите все разделы урока',
                    icon: 'mdi-alert'
                });
            }
        },
        
        startNextLesson() {
            if (this.nextLesson) {
                this.$emit('start-lesson', this.nextLesson);
            }
        }
    },
    
    created() {
        if (this.lesson.content?.introduction) {
            this.markSectionComplete('introduction');
        }
        
        if (this.lesson.content?.rules && this.lesson.content.rules.length > 0) {
            this.markSectionComplete('rules');
        }
        
        if (this.lesson.content?.vocabulary && this.lesson.content.vocabulary.length > 0) {
            this.markSectionComplete('vocabulary');
        }
        
        if (this.lesson.completed) {
            this.lessonSections.forEach(section => {
                section.completed = true;
            });
        }
    }
});