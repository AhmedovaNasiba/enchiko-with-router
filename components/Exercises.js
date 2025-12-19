Vue.component('exercises-page', {
    
    template: `
        <v-container class="custom-container py-6">
            <!-- Заголовок -->
            <div class="mb-8">
                <h1 class="display-1 font-weight-bold page-title primary--text">Упражнения</h1>
                <p class="subtitle-1 grey--text text--darken-1">
                    Практикуйте свои знания с помощью интерактивных упражнений
                </p>
            </div>
            
            <v-card class="content-card">
                <!-- Выбор типа упражнения и языка -->
                <div v-if="!exerciseActive" class="exercise-setup">
                    <h2 class="headline mb-6 section-title">Выберите упражнение</h2>
                    
                    <!-- Выбор языка -->
                    <div class="mb-8">
                        <h3 class="title mb-4">Язык</h3>
                        <v-row class="language-selection">
                            <v-col
                                v-for="language in languages"
                                :key="language.id"
                                cols="12"
                                sm="4"
                            >
                                <v-card
                                    :class="['language-option-card pa-4', selectedLanguageId === language.id ? 'selected' : '']"
                                    @click="selectLanguage(language.id)"
                                    :style="{ borderColor: language.color }"
                                >
                                    <div class="text-center">
                                        <v-avatar size="60" :color="language.color" dark class="mb-3">
                                            <v-icon>{{ language.icon }}</v-icon>
                                        </v-avatar>
                                        <h4 class="title mb-2">{{ language.name }}</h4>
                                        <div class="caption mb-3">{{ language.description }}</div>
                                        <v-chip small :color="language.color" dark>
                                            Прогресс: {{ getLanguageProgress(language.id) }}%
                                        </v-chip>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                    
                    <!-- Выбор типа упражнения -->
                    <div class="mb-8">
                        <h3 class="title mb-4">Тип упражнения</h3>
                        <v-row class="exercise-type-selection">
                            <v-col
                                v-for="type in exerciseTypes"
                                :key="type.id"
                                cols="12"
                                sm="6"
                                md="4"
                            >
                                <v-card
                                    :class="['exercise-type-card pa-5 text-center', selectedExerciseType === type.id ? 'selected' : '']"
                                    @click="selectExerciseType(type.id)"
                                    hover
                                >
                                    <v-avatar size="70" :color="type.color" class="mb-4">
                                        <v-icon size="36" dark>{{ type.icon }}</v-icon>
                                    </v-avatar>
                                    <h4 class="title mb-2">{{ type.title }}</h4>
                                    <p class="body-2 mb-3">{{ type.description }}</p>
                                    <v-chip small :color="type.color" dark>
                                        {{ type.points }} очков
                                    </v-chip>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                    
                    <!-- Кнопка начала упражнения -->
                    <div class="text-center">
                        <v-btn 
                            color="secondary" 
                            x-large 
                            class="btn-lesson start-exercise-btn"
                            @click="startExercise"
                            :disabled="!selectedLanguageId || !selectedExerciseType"
                            :loading="loading"
                        >
                            <v-icon left>mdi-play</v-icon>
                            Начать упражнение
                        </v-btn>
                        
                        <p v-if="!selectedLanguageId || !selectedExerciseType" class="caption mt-4 text-red">
                            * Пожалуйста, выберите язык и тип упражнения
                        </p>
                    </div>
                </div>
                
                <!-- Активное упражнение -->
                <div v-else class="active-exercise">
                    <!-- Заголовок и прогресс -->
                    <div class="d-flex justify-space-between align-center mb-6 exercise-header">
                        <div>
                            <h2 class="headline mb-2">{{ getSelectedLanguageName() }} - {{ getSelectedExerciseTypeName() }}</h2>
                            <div class="d-flex align-center">
                                <v-chip color="primary" dark class="mr-3">
                                    Вопрос {{ currentQuestionIndex + 1 }}/{{ currentExercises.length }}
                                </v-chip>
                                <v-chip color="green" dark>
                                    <v-icon small left>mdi-star</v-icon>
                                    {{ score }} очков
                                </v-chip>
                            </div>
                        </div>
                        
                        <v-btn text color="primary" @click="finishExercise" class="finish-btn">
                            <v-icon left>mdi-close</v-icon>
                            Завершить
                        </v-btn>
                    </div>
                    
                    <!-- Текущий вопрос -->
                    <div v-if="currentQuestionIndex < currentExercises.length" class="exercise-question">
                        <v-card class="pa-6 question-card">
                            <!-- Вопрос -->
                            <h3 class="title mb-6 question-text">{{ currentExercise.question }}</h3>
                            
                            <!-- Варианты ответов для multiple-choice -->
                            <div v-if="currentExercise.type === 'multiple-choice'" class="mb-6">
                                <v-radio-group v-model="selectedOption" class="options-group">
                                    <v-radio
                                        v-for="option in currentExercise.options"
                                        :key="option.id"
                                        :value="option.id"
                                        :disabled="answerChecked"
                                        class="mb-4"
                                    >
                                        <template v-slot:label>
                                            <div class="option-content">
                                                <span class="option-letter">{{ option.id.toUpperCase() }}.</span>
                                                <span class="option-text ml-3">{{ option.text }}</span>
                                            </div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div>
                            
                            <!-- Поле для ввода для translation -->
                            <div v-else-if="currentExercise.type === 'translation'" class="mb-6">
                                <div class="answer-input">
                                    <v-text-field
                                        v-model="userTranslation"
                                        label="Введите ваш ответ"
                                        outlined
                                        clearable
                                        :disabled="answerChecked"
                                        class="translation-input"
                                        @keyup.enter="checkAnswer"
                                        prepend-inner-icon="mdi-translate"
                                    ></v-text-field>
                                </div>
                            </div>
                            
                            <!-- Кнопки действий -->
                            <div class="d-flex justify-space-between align-center action-buttons">
                                <div>
                                    <v-btn
                                        color="primary"
                                        @click="checkAnswer"
                                        :disabled="!canCheckAnswer || answerChecked"
                                        class="check-btn btn-check"
                                        large
                                    >
                                        <v-icon left>mdi-check</v-icon>
                                        Проверить ответ
                                    </v-btn>
                                    
                                    <v-btn
                                        text
                                        color="grey"
                                        @click="showHint"
                                        class="ml-3 hint-btn"
                                        :disabled="answerChecked"
                                    >
                                        <v-icon left small>mdi-help-circle</v-icon>
                                        Подсказка
                                    </v-btn>
                                </div>
                                
                                <v-btn
                                    color="secondary"
                                    @click="nextQuestion"
                                    :disabled="!answerChecked"
                                    class="btn-lesson next-btn"
                                    large
                                >
                                    Следующий вопрос
                                    <v-icon right>mdi-arrow-right</v-icon>
                                </v-btn>
                            </div>
                            
                            <!-- Результат проверки -->
                            <transition name="slide">
                                <div v-if="answerChecked" class="mt-6 result-section">
                                    <v-alert
                                        :type="isAnswerCorrect ? 'success' : 'error'"
                                        class="result-alert"
                                        prominent
                                    >
                                        <div class="d-flex align-center">
                                            <v-icon large class="mr-3">
                                                {{ isAnswerCorrect ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                            </v-icon>
                                            <div>
                                                <h4 class="title mb-1">
                                                    {{ isAnswerCorrect ? 'Правильно!' : 'Неправильно' }}
                                                </h4>
                                                <p class="mb-0">{{ resultMessage }}</p>
                                                <div v-if="!isAnswerCorrect && correctAnswer" class="mt-2">
                                                    Правильный ответ: <strong>{{ correctAnswer }}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </v-alert>
                                    
                                    <!-- Объяснение -->
                                    <v-card v-if="currentExercise.explanation" class="mt-4 explanation-card">
                                        <v-card-text>
                                            <div class="d-flex align-start">
                                                <v-icon color="primary" class="mr-3">mdi-lightbulb-on</v-icon>
                                                <div>
                                                    <h5 class="subtitle-1 mb-2">Объяснение</h5>
                                                    <p class="body-2 mb-0">{{ currentExercise.explanation }}</p>
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </transition>
                        </v-card>
                    </div>
                    
                    <!-- Результаты упражнения -->
                    <div v-else class="exercise-results">
                        <v-card class="pa-8 text-center results-card">
                            <v-icon size="80" color="green" class="mb-4 trophy-icon">mdi-trophy</v-icon>
                            
                            <h2 class="display-1 mb-4 results-title">Упражнение завершено!</h2>
                            
                            <div class="mb-6">
                                <v-progress-circular
                                    :size="120"
                                    :width="15"
                                    :value="(correctAnswers / currentExercises.length) * 100"
                                    color="green"
                                    class="mb-4"
                                >
                                    <div class="text-center">
                                        <div class="headline">{{ Math.round((correctAnswers / currentExercises.length) * 100) }}%</div>
                                        <div class="caption">точность</div>
                                    </div>
                                </v-progress-circular>
                            </div>
                            
                            <div class="stats-grid mb-6">
                                <div class="stat-item">
                                    <div class="stat-value display-1 font-weight-bold">{{ score }}</div>
                                    <div class="stat-label">Очков заработано</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value display-1 font-weight-bold">{{ correctAnswers }}/{{ currentExercises.length }}</div>
                                    <div class="stat-label">Правильных ответов</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value display-1 font-weight-bold">{{ Math.round((correctAnswers / currentExercises.length) * 100) }}%</div>
                                    <div class="stat-label">Точность</div>
                                </div>
                            </div>
                            
                            <div class="mb-6">
                                <v-alert type="success" class="points-alert">
                                    <div class="d-flex align-center justify-center">
                                        <v-icon class="mr-3">mdi-star</v-icon>
                                        <span class="title">Вы заработали {{ score }} очков!</span>
                                    </div>
                                </v-alert>
                            </div>
                            
                            <div class="action-buttons">
                                <v-btn
                                    color="secondary"
                                    @click="restartExercise"
                                    class="btn-lesson restart-btn mr-4"
                                >
                                    <v-icon left>mdi-restart</v-icon>
                                    Повторить упражнение
                                </v-btn>
                                
                                <v-btn
                                    color="primary"
                                    @click="finishExercise"
                                    large
                                    outlined
                                >
                                    <v-icon left>mdi-home</v-icon>
                                    Вернуться к выбору
                                </v-btn>
                            </div>
                        </v-card>
                    </div>
                </div>
            </v-card>
            
            
        </v-container>
    `,
    
    data() {
        return {
            selectedLanguageId: null,
            selectedExerciseType: null,
            exerciseActive: false,
            loading: false,
            
            // Данные текущего упражнения
            currentExercises: [],
            currentQuestionIndex: 0,
            selectedOption: null,
            userTranslation: '',
            answerChecked: false,
            isAnswerCorrect: false,
            correctAnswer: '',
            resultMessage: '',
            
            // Статистика
            score: 0,
            correctAnswers: 0,
            
            // Типы упражнений
            exerciseTypes: [
                {
                    id: 'multiple-choice',
                    title: 'Выбор ответа',
                    description: 'Выберите правильный вариант из предложенных',
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
                }
            ]
        };
    },
    
    computed: {
        ...Vuex.mapState(['languages', 'user']),
        
        currentExercise() {
            return this.currentExercises[this.currentQuestionIndex] || {};
        },
        
        canCheckAnswer() {
            if (this.currentExercise.type === 'multiple-choice') {
                return this.selectedOption !== null;
            } else if (this.currentExercise.type === 'translation') {
                return this.userTranslation.trim().length > 0;
            }
            return false;
        }
    },
    
    methods: {
        ...Vuex.mapActions(['updateUserPoints', 'showNotification']),
        
        getLanguageProgress(languageId) {
            const language = this.languages.find(lang => lang.id === languageId);
            if (!language) return 0;
            return Math.round((language.completedLessons / language.totalLessons) * 100) || 0;
        },
        
        selectLanguage(languageId) {
            this.selectedLanguageId = languageId;
        },
        
        selectExerciseType(typeId) {
            this.selectedExerciseType = typeId;
        },
        
        getSelectedLanguageName() {
            const language = this.languages.find(lang => lang.id === this.selectedLanguageId);
            return language ? language.name : '';
        },
        
        getSelectedExerciseTypeName() {
            const type = this.exerciseTypes.find(t => t.id === this.selectedExerciseType);
            return type ? type.title : '';
        },
        
        startExercise() {
            if (!this.selectedLanguageId || !this.selectedExerciseType) {
                this.showNotification({
                    type: 'error',
                    message: 'Пожалуйста, выберите язык и тип упражнения',
                    icon: 'mdi-alert'
                });
                return;
            }
            
            this.loading = true;
            
            setTimeout(() => {
                this.currentExercises = this.getExercisesForLanguage(this.selectedLanguageId);
                
                if (this.currentExercises.length === 0) {
                    this.showNotification({
                        type: 'info',
                        message: 'Для этого языка пока нет упражнений',
                        icon: 'mdi-information'
                    });
                    this.loading = false;
                    return;
                }
                
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.correctAnswers = 0;
                this.selectedOption = null;
                this.userTranslation = '';
                this.answerChecked = false;
                
                this.exerciseActive = true;
                this.loading = false;
                
                this.showNotification({
                    type: 'success',
                    message: 'Упражнение начато! Удачи!',
                    icon: 'mdi-flag-checkered'
                });
            }, 500);
        },
        
        getExercisesForLanguage(languageId) {
            return appData.exercises[languageId] || [];
        },
        
        checkAnswer() {
            if (!this.canCheckAnswer || this.answerChecked) return;
            
            this.answerChecked = true;
            
            if (this.currentExercise.type === 'multiple-choice') {
                const selected = this.currentExercise.options.find(opt => opt.id === this.selectedOption);
                this.isAnswerCorrect = selected ? selected.correct : false;
                
                const correct = this.currentExercise.options.find(opt => opt.correct);
                this.correctAnswer = correct ? correct.text : '';
                
            } else if (this.currentExercise.type === 'translation') {
                const userAnswer = this.userTranslation.trim().toLowerCase();
                const correctAnswer = this.currentExercise.correctAnswer.toLowerCase();
                
                this.isAnswerCorrect = userAnswer === correctAnswer;
                this.correctAnswer = this.currentExercise.correctAnswer;
            }
            
            if (this.isAnswerCorrect) {
                this.correctAnswers++;
                
                const points = this.currentExercise.type === 'multiple-choice' ? 10 : 15;
                this.score += points;
                
                this.resultMessage = `Правильно! +${points} очков`;
            } else {
                this.resultMessage = 'Неправильно. Попробуйте еще раз в следующем вопросе.';
            }
        },
        
        nextQuestion() {
            if (!this.answerChecked) return;
            
            this.currentQuestionIndex++;
            
            this.selectedOption = null;
            this.userTranslation = '';
            this.answerChecked = false;
            this.isAnswerCorrect = false;
            this.correctAnswer = '';
            this.resultMessage = '';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        
        showHint() {
            if (this.currentExercise.explanation) {
                this.showNotification({
                    type: 'info',
                    message: 'Подсказка: ' + this.currentExercise.explanation,
                    icon: 'mdi-lightbulb-on',
                    timeout: 5000
                });
            } else {
                this.showNotification({
                    type: 'info',
                    message: 'Подсказка: Прочитайте внимательно вопрос и варианты ответов',
                    icon: 'mdi-lightbulb-on'
                });
            }
        },
        
        finishExercise() {
            if (this.exerciseActive && this.score > 0) {
                this.updateUserPoints(this.score);
                
                this.showNotification({
                    type: 'success',
                    message: `Упражнение завершено! Вы заработали ${this.score} очков`,
                    icon: 'mdi-trophy'
                });
            }
            
            this.exerciseActive = false;
            this.selectedLanguageId = null;
            this.selectedExerciseType = null;
            this.currentExercises = [];
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.correctAnswers = 0;
        },
        
        restartExercise() {
            this.startExercise();
        }
    }
});