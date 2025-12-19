Vue.component('dictionary-page', {

    template: `
        <v-container class="custom-container py-6">
            <v-row>
                <!-- Заголовок страницы -->
                <v-col cols="12">
                    <h1 class="display-1 font-weight-bold page-title primary--text">Словарь</h1>
                    <p class="subtitle-1 grey--text text--darken-1 mb-6">
                        Изученные слова по всем языкам
                    </p>
                </v-col>
            </v-row>
            
            <v-row class="mb-6">
                <v-col cols="12">
                    <!-- Карточка с вкладками -->
                    <v-card>
                        <!-- Вкладки для переключения между языками -->
                        <v-tabs v-model="activeTab" grow color="primary">
                            <v-tab v-for="language in languages" :key="language.id">
                                <v-icon left>{{ language.icon }}</v-icon>
                                {{ language.name }}
                            </v-tab>
                        </v-tabs>
                        
                        <!-- Содержимое вкладок -->
                        <v-tabs-items v-model="activeTab">
                            <v-tab-item v-for="language in languages" :key="language.id">
                                <!-- Контент для каждого языка -->
                                <v-card flat class="pa-4">
                                    <!-- Поле поиска -->
                                    <v-text-field
                                        v-model="searchQuery"
                                        prepend-inner-icon="mdi-magnify"
                                        label="Поиск слова"
                                        clearable
                                        class="mb-4"
                                        @input="filterWords"
                                    ></v-text-field>
                                    
                                    <!-- Список слов -->
                                    <v-row>
                                        <v-col
                                            v-for="word in filteredWords"
                                            :key="word.id"
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >
                                            <!-- Карточка слова -->
                                            <v-card
                                                class="word-card pa-4"
                                                :color="word.learned ? 'green lighten-5' : 'blue lighten-5'"
                                                @click="toggleWordStatus(word)"
                                            >
                                                <!-- Слово и транскрипция -->
                                                <div class="text-center mb-4">
                                                    <h3 class="headline mb-1">{{ word.word }}</h3>
                                                    <p class="subtitle-1 grey--text">{{ word.transcription }}</p>
                                                </div>
                                                
                                                <!-- Перевод и пример -->
                                                <div class="mb-4">
                                                    <p class="body-1 font-weight-bold">Перевод:</p>
                                                    <p class="body-2">{{ word.translation }}</p>
                                                    
                                                    <p class="body-1 font-weight-bold mt-3">Пример:</p>
                                                    <p class="body-2 font-italic">"{{ word.example }}"</p>
                                                </div>
                                                
                                                <!-- Часть речи и статус -->
                                                <div class="d-flex justify-space-between align-center">
                                                    <v-chip small :color="getPartOfSpeechColor(word.partOfSpeech)" dark>
                                                        {{ word.partOfSpeech }}
                                                    </v-chip>
                                                    
                                                    <v-chip small :color="word.learned ? 'green' : 'orange'" dark>
                                                        {{ word.learned ? 'Изучено' : 'Изучается' }}
                                                    </v-chip>
                                                </div>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    
                                    <!-- Сообщение, если слова не найдены -->
                                    <v-alert
                                        v-if="filteredWords.length === 0"
                                        type="info"
                                        class="mt-4"
                                    >
                                        Слова не найдены. Попробуйте другой поисковый запрос.
                                    </v-alert>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    `,
    
    // Данные компонента
    data() {
        return {
            activeTab: 0,          // Активная вкладка
            searchQuery: '',       // Поисковый запрос
            allWords: [],          // Все слова
            filteredWords: []      // Отфильтрованные слова
        };
    },
    
    // Вычисляемые свойства
    computed: {
        ...Vuex.mapState(['languages']),
        
        activeLanguage() {
            return this.languages[this.activeTab];
        }
    },

    methods: {
        loadWords() {
            this.allWords = this.generateWords();
            this.filterWords();
        },
        
        generateWords() {
            const words = {
                chinese: [
                    { id: 1, word: '你好', transcription: 'nǐ hǎo', translation: 'привет', example: '你好，我是学生。', partOfSpeech: 'приветствие', learned: true },
                    { id: 2, word: '谢谢', transcription: 'xiè xiè', translation: 'спасибо', example: '谢谢你的帮助。', partOfSpeech: 'благодарность', learned: true },
                    { id: 3, word: '爱', transcription: 'ài', translation: 'любовь', example: '我爱你。', partOfSpeech: 'существительное', learned: true },
                    { id: 4, word: '学习', transcription: 'xué xí', translation: 'учить', example: '我学习中文。', partOfSpeech: 'глагол', learned: false }
                ],
                english: [
                    { id: 1, word: 'Hello', transcription: 'heˈləʊ', translation: 'привет', example: 'Hello, how are you?', partOfSpeech: 'приветствие', learned: true },
                    { id: 2, word: 'Thank you', transcription: 'θæŋk juː', translation: 'спасибо', example: 'Thank you for your help.', partOfSpeech: 'благодарность', learned: true },
                    { id: 3, word: 'Love', transcription: 'lʌv', translation: 'любовь', example: 'I love learning languages.', partOfSpeech: 'существительное', learned: true },
                    { id: 4, word: 'To learn', transcription: 'tuː lɜːn', translation: 'учить', example: 'I learn English every day.', partOfSpeech: 'глагол', learned: false }
                ],
                korean: [
                    { id: 1, word: '안녕하세요', transcription: 'annyeonghaseyo', translation: 'здравствуйте', example: '안녕하세요, 저는 학생입니다.', partOfSpeech: 'приветствие', learned: true },
                    { id: 2, word: '감사합니다', transcription: 'gamsahamnida', translation: 'спасибо', example: '감사합니다, 도와 주셔서.', partOfSpeech: 'благодарность', learned: true },
                    { id: 3, word: '사랑', transcription: 'sarang', translation: 'любовь', example: '사랑해요.', partOfSpeech: 'существительное', learned: false }
                ]
            };
            
            return words;
        },
        
        filterWords() {
            if (!this.activeLanguage) {
                this.filteredWords = [];
                return;
            }
            
            const languageId = this.activeLanguage.id;
            let words = this.allWords[languageId] || [];
            
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                words = words.filter(word => 
                    word.word.toLowerCase().includes(query) ||
                    word.translation.toLowerCase().includes(query) ||
                    word.transcription.toLowerCase().includes(query)
                );
            }
            
            this.filteredWords = words;
        },
        
        toggleWordStatus(word) {
            word.learned = !word.learned;
            
            this.$store.dispatch('showNotification', {
                type: word.learned ? 'success' : 'info',
                message: `Слово "${word.word}" ${word.learned ? 'изучено' : 'отмечено как изучаемое'}`,
                icon: 'mdi-check'
            });
        },
        
        getPartOfSpeechColor(part) {
            const colors = {
                'существительное': 'blue',
                'глагол': 'green',
                'прилагательное': 'orange',
                'приветствие': 'purple',
                'благодарность': 'teal'
            };
            
            return colors[part] || 'grey';
        }
    },
    
    // Наблюдатели
    watch: {
        activeTab() {
            this.filterWords();
        },
        
        searchQuery() {
            this.filterWords();
        }
    },
    
    // Хук при создании компонента
    created() {
        this.loadWords();
    }
});