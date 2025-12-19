// store.js - Централизованное хранилище состояния приложения

// Создаем Vuex хранилище
const store = new Vuex.Store({
    state: {
        user: DataManager.getUserProgress().user || appData.user,
        languages: appData.languages.map(lang => {
            const progress = DataManager.getUserProgress().languages?.[lang.id] || {};
            return {
                ...lang,
                completedLessons: progress.completedLessons || 0,
                completedCategories: progress.completedCategories || []
            };
        }),
        lessons: appData.lessons,
        dictionary: appData.dictionary,
        exercises: appData.exercises,
        notifications: [],
        selectedLanguageId: null,
        selectedLesson: null,
        drawer: false
    },
    
    getters: {
        selectedLanguage: state => {
            return state.languages.find(lang => lang.id === state.selectedLanguageId);
        },
        totalProgress: state => {
            const totalLessons = state.languages.reduce((sum, lang) => sum + lang.totalLessons, 0);
            const completedLessons = state.languages.reduce((sum, lang) => sum + lang.completedLessons, 0);
            return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        },
        learnedWords: state => {
            const progress = DataManager.getUserProgress();
            return Object.values(progress.words || {}).filter(word => word.learned).length;
        },
        getLanguageById: state => id => {
            return state.languages.find(lang => lang.id === id);
        },
        getLessons: state => (languageId, categoryId) => {
            return state.lessons[languageId]?.[categoryId] || [];
        },
        getLanguageProgress: state => languageId => {
            const language = state.languages.find(lang => lang.id === languageId);
            if (!language) return 0;
            return Math.round((language.completedLessons / language.totalLessons) * 100);
        }
    },
    
    mutations: {
        SET_SELECTED_LANGUAGE(state, languageId) {
            state.selectedLanguageId = languageId;
        },
        SET_SELECTED_LESSON(state, lesson) {
            state.selectedLesson = lesson;
        },
        UPDATE_USER(state, userData) {
            state.user = { ...state.user, ...userData };
            const progress = DataManager.getUserProgress();
            progress.user = state.user;
            DataManager.saveData('progress', progress);
        },
        UPDATE_LANGUAGE_PROGRESS(state, { languageId, completedLessons }) {
            const language = state.languages.find(lang => lang.id === languageId);
            if (language) {
                language.completedLessons = completedLessons;
                const progress = DataManager.getUserProgress();
                if (!progress.languages[languageId]) {
                    progress.languages[languageId] = {};
                }
                progress.languages[languageId].completedLessons = completedLessons;
                DataManager.saveData('progress', progress);
            }
        },
        COMPLETE_LESSON(state, { languageId, lessonId, points }) {
            state.user.points += points || 10;
            const language = state.languages.find(lang => lang.id === languageId);
            if (language) {
                language.completedLessons++;
            }
            const progress = DataManager.getUserProgress();
            if (!progress.lessons[languageId]) {
                progress.lessons[languageId] = {};
            }
            progress.lessons[languageId][lessonId] = {
                completed: true,
                completedAt: new Date().toISOString()
            };
            progress.user.points = state.user.points;
            progress.languages[languageId].completedLessons = language.completedLessons;
            DataManager.saveData('progress', progress);
        },
        UPDATE_STREAK(state) {
            const today = new Date().toDateString();
            const lastActive = state.user.lastActive;
            if (lastActive === today) return;
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            if (lastActive === yesterdayStr) {
                state.user.streak++;
            } else if (!lastActive || new Date(lastActive) < yesterday) {
                state.user.streak = 1;
            } else {
                state.user.streak = 1;
            }
            state.user.lastActive = today;
            const progress = DataManager.getUserProgress();
            progress.user.streak = state.user.streak;
            progress.user.lastActive = state.user.lastActive;
            DataManager.saveData('progress', progress);
        },
        ADD_NOTIFICATION(state, notification) {
            const id = Date.now();
            state.notifications.push({
                id,
                ...notification,
                show: true
            });
            setTimeout(() => {
                const index = state.notifications.findIndex(n => n.id === id);
                if (index !== -1) {
                    state.notifications[index].show = false;
                    setTimeout(() => {
                        state.notifications.splice(index, 1);
                    }, 300);
                }
            }, 3000);
        },
        REMOVE_NOTIFICATION(state, notificationId) {
            const index = state.notifications.findIndex(n => n.id === notificationId);
            if (index !== -1) {
                state.notifications.splice(index, 1);
            }
        },
        TOGGLE_DRAWER(state) {
            state.drawer = !state.drawer;
        },
        RESET_PROGRESS(state) {
            DataManager.resetProgress();
            state.user = appData.user;
            state.languages = appData.languages.map(lang => ({
                ...lang,
                completedLessons: 0,
                completedCategories: []
            }));
            state.selectedLanguageId = null;
            state.selectedLesson = null;
        }
    },
    
    actions: {
        selectLanguage({ commit }, languageId) {
            commit('SET_SELECTED_LANGUAGE', languageId);
            commit('ADD_NOTIFICATION', {
                type: 'info',
                message: `Язык выбран`,
                icon: 'mdi-translate'
            });
        },
        startLesson({ commit }, lesson) {
            commit('SET_SELECTED_LESSON', lesson);
            commit('UPDATE_STREAK');
        },
        completeLesson({ commit }, { languageId, lessonId, points = 25 }) {
            commit('COMPLETE_LESSON', { languageId, lessonId, points });
            commit('ADD_NOTIFICATION', {
                type: 'success',
                message: `Урок завершен! +${points} очков`,
                icon: 'mdi-check-circle'
            });
            commit('SET_SELECTED_LESSON', null);
        },
        updateUserPoints({ commit, state }, points) {
            const newPoints = state.user.points + points;
            commit('UPDATE_USER', { points: newPoints });
            commit('ADD_NOTIFICATION', {
                type: 'success',
                message: `+${points} очков!`,
                icon: 'mdi-star'
            });
        },
        showNotification({ commit }, notification) {
            commit('ADD_NOTIFICATION', notification);
        },
        logout({ commit }) {
            commit('SET_SELECTED_LANGUAGE', null);
            commit('SET_SELECTED_LESSON', null);
            commit('ADD_NOTIFICATION', {
                type: 'info',
                message: 'Вы вышли из системы',
                icon: 'mdi-logout'
            });
        },
        saveState({ state }) {
            const savedState = {
                selectedLanguageId: state.selectedLanguageId,
                selectedLessonId: state.selectedLesson?.id
            };
            DataManager.saveData('state', savedState);
        },
        loadState({ commit }) {
            const savedState = DataManager.loadData('state');
            if (savedState && savedState.selectedLanguageId) {
                commit('SET_SELECTED_LANGUAGE', savedState.selectedLanguageId);
            }
            commit('UPDATE_STREAK');
        }
    }
});