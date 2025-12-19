Vue.component('home-page', {
    template: `
        <v-container class="custom-container py-6">
            <v-row>
                <!-- Заголовок страницы -->
                <v-col cols="12">
                    <h1 class="display-1 font-weight-bold page-title primary--text">
                        Выберите язык для изучения
                    </h1>
                    <p class="subtitle-1 grey--text text--darken-1 mb-6">
                        Изучайте языки с помощью интерактивных уроков, упражнений и словаря
                    </p>
                </v-col>
            </v-row>
            
            <!-- Карточки языков -->
            <v-row>
                <v-col
                    v-for="language in languages"
                    :key="language.id"
                    cols="12"
                    md="4"
                >
                    <!-- Карточка языка -->
                    <v-card
                        class="language-card pa-4"
                        :color="language.color"
                        dark
                        @click="selectLanguage(language.id)"
                    >
                        <!-- Верхняя часть карточки -->
                        <v-row align="center" class="ma-0">
                            <!-- Иконка языка -->
                            <v-col cols="auto" class="pa-0">
                                <v-avatar size="70" class="white">
                                    <v-icon size="40" :color="language.color">{{ language.icon }}</v-icon>
                                </v-avatar>
                            </v-col>
                            
                            <!-- Информация о языке -->
                            <v-col class="pa-0 pl-4">
                                <h3 class="headline mb-1">{{ language.name }}</h3>
                                <p class="mb-0">{{ language.description }}</p>
                            </v-col>
                        </v-row>
                        
                        <!-- Прогресс изучения -->
                        <v-progress-linear
                            :value="getProgress(language)"
                            height="8"
                            background-color="rgba(255,255,255,0.3)"
                            color="white"
                            class="mt-4"
                        ></v-progress-linear>
                        
                        <!-- Статистика прогресса -->
                        <div class="d-flex justify-space-between mt-2">
                            <span>Прогресс: {{ getProgress(language) }}%</span>
                            <span>{{ language.completedLessons }}/{{ language.lessons }} уроков</span>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            
            <!-- Статистика пользователя -->
            <v-row class="mt-8">
                <v-col cols="12">
                    <h2 class="headline mb-4">Ваша статистика</h2>
                    <v-row>
                        <!-- Карточка очков знаний -->
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stats-card" color="blue lighten-5">
                                <v-card-text class="text-center">
                                    <div class="display-1 font-weight-bold primary--text">{{ user.points }}</div>
                                    <div class="subtitle-1">Очков знаний</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        
                        <!-- Карточка завершенных уроков -->
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stats-card" color="green lighten-5">
                                <v-card-text class="text-center">
                                    <div class="display-1 font-weight-bold green--text">{{ totalLessons }}</div>
                                    <div class="subtitle-1">Завершено уроков</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        
                        <!-- Карточка изученных слов -->
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stats-card" color="orange lighten-5">
                                <v-card-text class="text-center">
                                    <div class="display-1 font-weight-bold orange--text">{{ learnedWords }}</div>
                                    <div class="subtitle-1">Изучено слов</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        
                        <!-- Карточка дней подряд -->
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stats-card" color="purple lighten-5">
                                <v-card-text class="text-center">
                                    <div class="display-1 font-weight-bold purple--text">{{ user.streak }}</div>
                                    <div class="subtitle-1">Дней подряд</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    `,
    
    // Вычисляемые свойства
    computed: {
        ...Vuex.mapState(['languages', 'user']),
        ...Vuex.mapGetters(['learnedWords']),
        
        totalLessons() {
            return this.languages.reduce((total, lang) => {
                return total + lang.completedLessons;
            }, 0);
        }
    },
    
    // Методы компонента
    methods: {
        ...Vuex.mapActions(['selectLanguage']),
        
        getProgress(language) {
            return Math.round((language.completedLessons / language.lessons) * 100);
        }
    }
});