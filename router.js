const router = new VueRouter({
    mode: 'hash', 
    base: '/',       
    routes: [
        {
            path: '/',
            name: 'home',
            component: {
                template: `
                    <div>
                        <app-header 
                            :drawer.sync="drawer"
                            :current-page="currentPage"
                            :user="user"
                            @toggle-drawer="toggleDrawer"
                            @logout="logout">
                        </app-header>
                        
                        <div class="spaced-container">
                            <home-page 
                                :languages="languages"
                                :user="user"
                                @select-language="selectLanguage">
                            </home-page>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        drawer: false,
                        currentPage: 'home',
                        user: appData.user,
                        languages: appData.languages.map(lang => {
                            const progress = DataManager.getUserProgress().languages?.[lang.id] || {};
                            return {
                                ...lang,
                                completedLessons: progress.completedLessons || 0,
                                completedCategories: progress.completedCategories || []
                            };
                        })
                    };
                },
                methods: {
                    toggleDrawer() {
                        this.drawer = !this.drawer;
                    },
                    selectLanguage(languageId) {
                        router.push({ name: 'language-detail', params: { id: languageId } });
                    },
                    logout() {
                        if (confirm('Вы уверены, что хотите выйти?')) {
                            this.currentPage = 'home';
                            router.push('/');
                            this.$root.showNotification({
                                type: 'info',
                                message: 'Вы вышли из системы',
                                icon: 'mdi-logout'
                            });
                        }
                    }
                }
            }
        },
        {
            path: '/language/:id',
            name: 'language-detail',
            component: {
                template: `
                    <div>
                        <app-header 
                            :drawer.sync="drawer"
                            :current-page="currentPage"
                            :user="user"
                            @toggle-drawer="toggleDrawer"
                            @logout="logout">
                        </app-header>
                        
                        <div class="spaced-container">
                            <language-detail 
                                :language-id="$route.params.id"
                                :languages="languages"
                                :user="user"
                                @back="goBack"
                                @start-lesson="startLesson">
                            </language-detail>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        drawer: false,
                        currentPage: 'language-detail',
                        user: appData.user,
                        languages: appData.languages.map(lang => {
                            const progress = DataManager.getUserProgress().languages?.[lang.id] || {};
                            return {
                                ...lang,
                                completedLessons: progress.completedLessons || 0,
                                completedCategories: progress.completedCategories || []
                            };
                        })
                    };
                },
                methods: {
                    toggleDrawer() {
                        this.drawer = !this.drawer;
                    },
                    goBack() {
                        router.push('/');
                    },
                    startLesson(lesson) {
                        router.push({ 
                            name: 'lesson-detail', 
                            params: { 
                                languageId: this.$route.params.id,
                                lessonId: lesson.id 
                            },
                            query: { lesson: JSON.stringify(lesson) }
                        });
                    },
                    logout() {
                        if (confirm('Вы уверены, что хотите выйти?')) {
                            router.push('/');
                            this.$root.showNotification({
                                type: 'info',
                                message: 'Вы вышли из системы',
                                icon: 'mdi-logout'
                            });
                        }
                    }
                }
            }
        },
        {
            path: '/language/:languageId/lesson/:lessonId',
            name: 'lesson-detail',
            component: {
                template: `
                    <div>
                        <app-header 
                            :drawer.sync="drawer"
                            :current-page="currentPage"
                            :user="user"
                            @toggle-drawer="toggleDrawer"
                            @logout="logout">
                        </app-header>
                        
                        <div class="spaced-container">
                            <lesson-detail 
                                :lesson="lesson"
                                :language-id="$route.params.languageId"
                                :user="user"
                                @back="goBack"
                                @complete-lesson="completeLesson">
                            </lesson-detail>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        drawer: false,
                        currentPage: 'lesson-detail',
                        user: appData.user,
                        lesson: this.$route.query.lesson ? JSON.parse(this.$route.query.lesson) : null
                    };
                },
                methods: {
                    toggleDrawer() {
                        this.drawer = !this.drawer;
                    },
                    goBack() {
                        router.push({ name: 'language-detail', params: { id: this.$route.params.languageId } });
                    },
                    completeLesson(points) {
                        if (this.lesson && this.$route.params.languageId) {
                            // Обновляем прогресс
                            const progress = DataManager.getUserProgress();
                            const languageProgress = progress.languages[this.$route.params.languageId] || {};
                            languageProgress.completedLessons = (languageProgress.completedLessons || 0) + 1;
                            
                            // Отмечаем урок как завершенный
                            if (!progress.lessons[this.$route.params.languageId]) {
                                progress.lessons[this.$route.params.languageId] = {};
                            }
                            progress.lessons[this.$route.params.languageId][this.lesson.id] = {
                                completed: true,
                                completedAt: new Date().toISOString()
                            };
                            
                            // Обновляем очки
                            progress.user.points += points || 10;
                            
                            // Сохраняем
                            DataManager.saveData('progress', progress);
                            
                            // Показываем уведомление
                            this.$root.showNotification({
                                type: 'success',
                                message: `Урок завершен! +${points || 10} очков`,
                                icon: 'mdi-check-circle'
                            });
                        }
                        
                        this.goBack();
                    },
                    logout() {
                        if (confirm('Вы уверены, что хотите выйти?')) {
                            router.push('/');
                            this.$root.showNotification({
                                type: 'info',
                                message: 'Вы вышли из системы',
                                icon: 'mdi-logout'
                            });
                        }
                    }
                },
                created() {
                    if (!this.lesson) {
                        // Если урок не передан в query, попробуем найти его в данных
                        const languageId = this.$route.params.languageId;
                        const lessonId = this.$route.params.lessonId;
                        
                        // Поиск урока в данных
                        for (const category in appData.lessons[languageId]) {
                            const found = appData.lessons[languageId][category].find(l => l.id === lessonId);
                            if (found) {
                                this.lesson = found;
                                break;
                            }
                        }
                    }
                }
            }
        },
        {
            path: '/dictionary',
            name: 'dictionary',
            component: {
                template: `
                    <div>
                        <app-header 
                            :drawer.sync="drawer"
                            :current-page="currentPage"
                            :user="user"
                            @toggle-drawer="toggleDrawer"
                            @logout="logout">
                        </app-header>
                        
                        <div class="spaced-container">
                            <dictionary-page 
                                :languages="languages">
                            </dictionary-page>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        drawer: false,
                        currentPage: 'dictionary',
                        user: appData.user,
                        languages: appData.languages
                    };
                },
                methods: {
                    toggleDrawer() {
                        this.drawer = !this.drawer;
                    },
                    logout() {
                        if (confirm('Вы уверены, что хотите выйти?')) {
                            router.push('/');
                            this.$root.showNotification({
                                type: 'info',
                                message: 'Вы вышли из системы',
                                icon: 'mdi-logout'
                            });
                        }
                    }
                }
            }
        },
        {
            path: '/exercises',
            name: 'exercises',
            component: {
                template: `
                    <div>
                        <app-header 
                            :drawer.sync="drawer"
                            :current-page="currentPage"
                            :user="user"
                            @toggle-drawer="toggleDrawer"
                            @logout="logout">
                        </app-header>
                        
                        <div class="spaced-container">
                            <exercises-page 
                                :languages="languages"
                                :user="user"
                                @update-points="updatePoints">
                            </exercises-page>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        drawer: false,
                        currentPage: 'exercises',
                        user: appData.user,
                        languages: appData.languages.map(lang => {
                            const progress = DataManager.getUserProgress().languages?.[lang.id] || {};
                            return {
                                ...lang,
                                completedLessons: progress.completedLessons || 0
                            };
                        })
                    };
                },
                methods: {
                    toggleDrawer() {
                        this.drawer = !this.drawer;
                    },
                    updatePoints(points) {
                        this.user.points += points;
                        const progress = DataManager.getUserProgress();
                        progress.user.points = this.user.points;
                        DataManager.saveData('progress', progress);
                    },
                    logout() {
                        if (confirm('Вы уверены, что хотите выйти?')) {
                            router.push('/');
                            this.$root.showNotification({
                                type: 'info',
                                message: 'Вы вышли из системы',
                                icon: 'mdi-logout'
                            });
                        }
                    }
                }
            }
        },
        {
            path: '/progress',
            name: 'progress',
            component: {
                template: `
                    <div>
                        <app-header 
                            :drawer.sync="drawer"
                            :current-page="currentPage"
                            :user="user"
                            @toggle-drawer="toggleDrawer"
                            @logout="logout">
                        </app-header>
                        
                        <div class="spaced-container">
                            <progress-page 
                                :languages="languages"
                                :user="user">
                            </progress-page>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        drawer: false,
                        currentPage: 'progress',
                        user: appData.user,
                        languages: appData.languages.map(lang => {
                            const progress = DataManager.getUserProgress().languages?.[lang.id] || {};
                            return {
                                ...lang,
                                completedLessons: progress.completedLessons || 0
                            };
                        })
                    };
                },
                methods: {
                    toggleDrawer() {
                        this.drawer = !this.drawer;
                    },
                    logout() {
                        if (confirm('Вы уверены, что хотите выйти?')) {
                            router.push('/');
                            this.$root.showNotification({
                                type: 'info',
                                message: 'Вы вышли из системы',
                                icon: 'mdi-logout'
                            });
                        }
                    }
                }
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: {
                template: `
                    <div>
                        <app-header 
                            :drawer.sync="drawer"
                            :current-page="currentPage"
                            :user="user"
                            @toggle-drawer="toggleDrawer"
                            @logout="logout">
                        </app-header>
                        
                        <div class="spaced-container">
                            <profile-page 
                                :user="user"
                                @update-user="updateUser">
                            </profile-page>
                        </div>
                    </div>
                `,
                data() {
                    return {
                        drawer: false,
                        currentPage: 'profile',
                        user: appData.user
                    };
                },
                methods: {
                    toggleDrawer() {
                        this.drawer = !this.drawer;
                    },
                    updateUser(updates) {
                        Object.assign(this.user, updates);
                        const progress = DataManager.getUserProgress();
                        progress.user = this.user;
                        DataManager.saveData('progress', progress);
                    },
                    logout() {
                        if (confirm('Вы уверены, что хотите выйти?')) {
                            router.push('/');
                            this.$root.showNotification({
                                type: 'info',
                                message: 'Вы вышли из системы',
                                icon: 'mdi-logout'
                            });
                        }
                    }
                }
            }
        },
        // Редирект старых путей для совместимости
        {
            path: '/home',
            redirect: '/'
        },
        // 404 страница
        {
            path: '*',
            redirect: '/'
        }
    ],
    
    // Прокрутка при навигации
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});