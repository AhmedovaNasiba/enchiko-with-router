// Компонент шапки (исправленный)
Vue.component('app-header', {
    props: {
        drawer: Boolean,
        currentPage: String,
        user: Object
    },
    
    template: `
        <div>
            <!-- Верхняя панель -->
            <v-app-bar app color="primary" dark fixed class="header-bar" height="64">
                <!-- Кнопка меню -->
                <v-app-bar-nav-icon @click="$emit('toggle-drawer')" class="header-menu-btn"></v-app-bar-nav-icon>
                
                <!-- Название сайта -->
                <v-toolbar-title class="d-flex align-center site-title">
                    <div>
                        <span class="font-weight-bold header-title">EnChiKo</span>
                    </div>
                </v-toolbar-title>
                
                <v-spacer></v-spacer>
                
                <!-- Навигация для десктопа -->
                <v-tabs v-model="activeTab" center-active class="hidden-sm-and-down desktop-nav">
                    <v-tab 
                        v-for="item in menuItems" 
                        :key="item.route" 
                        @click="changePage(item.route)"
                        class="nav-tab"
                    >
                        <v-icon left small class="nav-icon">{{ item.icon }}</v-icon>
                        {{ item.title }}
                    </v-tab>
                </v-tabs>
                
                <v-spacer></v-spacer>
                
                <!-- Очки пользователя -->
                <div class="hidden-sm-and-down mr-4">
                    <v-chip color="white" text-color="primary" class="points-chip">
                        <v-avatar left class="points-avatar">
                            <v-icon small color="primary">mdi-star</v-icon>
                        </v-avatar>
                        <span class="points-value">{{ user.points }}</span>
                    </v-chip>
                </div>
                
                <!-- Меню пользователя -->
                <v-menu offset-y class="user-menu">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" class="user-menu-btn">
                            <v-avatar size="36" class="user-avatar">
                                <div v-if="user.avatar" class="avatar-image">
                                    <v-img :src="user.avatar" alt="Аватар"></v-img>
                                </div>
                                <div v-else class="avatar-initials" :style="{ backgroundColor: getAvatarColor() }">
                                    {{ user.initials || getUserInitials() }}
                                </div>
                            </v-avatar>
                        </v-btn>
                    </template>
                    
                    <v-list class="user-dropdown">
                        <v-list-item class="user-info">
                            <v-list-item-avatar>
                                <div v-if="user.avatar" class="dropdown-avatar">
                                    <v-img :src="user.avatar"></v-img>
                                </div>
                                <div v-else class="dropdown-initials" :style="{ backgroundColor: getAvatarColor() }">
                                    {{ user.initials || getUserInitials() }}
                                </div>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="user-name">{{ user.name }}</v-list-item-title>
                                <v-list-item-subtitle class="user-level">{{ user.level }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        
                        <v-divider class="dropdown-divider"></v-divider>
                        
                        <v-list-item @click="changePage('profile')" class="dropdown-item">
                            <v-list-item-icon class="dropdown-icon">
                                <v-icon>mdi-account-cog</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="dropdown-text">Профиль</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item @click="logout" class="dropdown-item logout-item">
                            <v-list-item-icon class="dropdown-icon">
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="dropdown-text">Выйти</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>
            
            <!-- Боковое меню -->
            <v-navigation-drawer v-model="drawer" app temporary class="sidebar-menu">
                <div class="sidebar-header">
                    <div class="sidebar-title">
                        <div class="sidebar-main-title">EnChiKo</div>
                    </div>
                </div>
                
                <v-divider class="sidebar-divider"></v-divider>
                
                <!-- Пункты меню -->
                <v-list dense nav class="sidebar-nav">
                    <v-list-item
                        v-for="item in menuItems"
                        :key="item.route"
                        link
                        @click="$router.push(getRoutePath(item.route))"
                        :class="{ 'sidebar-item-active': currentPage === item.route }"
                        class="sidebar-item"
                    >
                        <v-list-item-icon class="sidebar-icon">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="sidebar-text">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                
                <!-- Футер меню -->
                <template v-slot:append>
                    <div class="sidebar-footer">
                        <!-- Информация о пользователе -->
                        <div class="sidebar-user">
                            <v-avatar size="40" class="sidebar-user-avatar">
                                <div v-if="user.avatar" class="sidebar-avatar-image">
                                    <v-img :src="user.avatar"></v-img>
                                </div>
                                <div v-else class="sidebar-avatar-initials" :style="{ backgroundColor: getAvatarColor() }">
                                    {{ user.initials || getUserInitials() }}
                                </div>
                            </v-avatar>
                            <div class="sidebar-user-info">
                                <div class="sidebar-user-name">{{ user.name }}</div>
                                <div class="sidebar-user-points">
                                    <v-icon x-small class="mr-1">mdi-star</v-icon>
                                    {{ user.points }} очков
                                </div>
                            </div>
                        </div>
                        
                        <!-- Дата -->
                        <div class="sidebar-date">
                            {{ currentDate }}
                        </div>
                    </div>
                </template>
            </v-navigation-drawer>
            
            <style>
                /* Исправление для фиксированной шапки */
                .header-bar {
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: linear-gradient(135deg, var(--primary-color), var(--accent-color)) !important;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                }
                
                /* Название сайта */
                .site-title {
                    margin-left: 16px;
                    height: 100%;
                    display: flex !important;
                    align-items: center !important;
                }
                
                .header-title {
                    font-size: 1.8rem !important;
                    color: white;
                    font-weight: 700;
                    line-height: 1.2 !important;
                    letter-spacing: 0.5px;
                }
                
                /* Навигационные табы - исправляем фон */
                .desktop-nav {
                    background-color: transparent !important;
                }
                
                .nav-tab {
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8) !important;
                    min-width: 100px;
                    height: 64px !important;
                    display: flex !important;
                    align-items: center !important;
                    padding: 0 12px !important;
                    text-transform: none !important;
                    letter-spacing: normal !important;
                    background-color: transparent !important;
                }
                
                .nav-tab::before {
                    background-color: transparent !important;
                }
                
                .nav-tab.v-tab--active {
                    color: white !important;
                    background-color: rgba(255, 255, 255, 0.15) !important;
                }
                
                .nav-tab:hover {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                }
                
                /* Убираем стандартный индикатор Vuetify */
                .v-slide-group__wrapper {
                    contain: none !important;
                }
                
                .v-tabs-slider-wrapper {
                    display: none !important;
                }
                
                .nav-icon {
                    margin-right: 8px;
                    font-size: 18px !important;
                }
                
                /* Чип с очками - возвращаем на место */
                .points-chip {
                    font-weight: 600;
                    padding: 4px 12px;
                    height: 36px;
                    display: flex !important;
                    align-items: center !important;
                    background-color: rgba(255, 255, 255, 0.9) !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    margin-right: 8px !important;
                }
                
                .points-avatar {
                    background-color: rgba(74, 144, 226, 0.2) !important;
                    height: 28px !important;
                    width: 28px !important;
                }
                
                .points-value {
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                
                /* Аватар пользователя - возвращаем на место */
                .avatar-initials, .dropdown-initials, .sidebar-avatar-initials {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                    border-radius: 50%;
                }
                
                .user-menu-btn {
                    transition: transform 0.2s ease;
                    height: 36px !important;
                    width: 36px !important;
                }
                
                .user-menu-btn:hover {
                    transform: scale(1.1);
                }
                
                /* Выпадающее меню */
                .user-dropdown {
                    padding: 8px 0;
                    min-width: 220px;
                }
                
                .user-info {
                    padding: 16px;
                }
                
                .user-name {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .user-level {
                    color: var(--primary-color);
                    font-size: 0.85rem;
                }
                
                .dropdown-divider {
                    margin: 8px 0;
                }
                
                .dropdown-item {
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .dropdown-item:hover {
                    background-color: rgba(74, 144, 226, 0.1);
                }
                
                .dropdown-icon {
                    min-width: 40px;
                    color: var(--primary-color);
                }
                
                .dropdown-text {
                    font-size: 0.95rem;
                }
                
                .logout-item .dropdown-icon {
                    color: var(--secondary-color);
                }
                
                /* Боковое меню */
                .sidebar-menu {
                    background-color: white !important;
                    top: 0 !important;
                    height: 100vh !important;
                }
                
                .sidebar-header {
                    padding: 32px 24px 24px 24px;
                    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                }
                
                .sidebar-main-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: white;
                    line-height: 1.2;
                    text-align: center;
                }
                
                .sidebar-divider {
                    margin: 0 !important;
                }
                
                .sidebar-item {
                    padding: 16px 24px;
                    margin: 4px 0;
                    height: 56px !important;
                    display: flex !important;
                    align-items: center !important;
                }
                
                .sidebar-item:hover {
                    background-color: rgba(74, 144, 226, 0.1);
                }
                
                .sidebar-item-active {
                    background-color: rgba(74, 144, 226, 0.15);
                    border-right: 4px solid var(--primary-color);
                }
                
                .sidebar-icon {
                    min-width: 40px;
                    color: var(--primary-color);
                }
                
                .sidebar-text {
                    font-weight: 500;
                    font-size: 1rem;
                }
                
                .sidebar-footer {
                    padding: 24px;
                    background-color: var(--light-grey);
                    border-top: 1px solid var(--medium-grey);
                }
                
                .sidebar-user {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .sidebar-user-avatar {
                    margin-right: 12px;
                }
                
                .sidebar-user-name {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .sidebar-user-points {
                    font-size: 0.85rem;
                    color: var(--dark-color);
                    display: flex;
                    align-items: center;
                }
                
                .sidebar-date {
                    font-size: 0.85rem;
                    color: #666;
                    text-align: center;
                }
                
                /* Адаптивность для шапки */
                @media (max-width: 1260px) {
                    .nav-tab {
                        min-width: 90px;
                        padding: 0 10px !important;
                        font-size: 0.9rem;
                    }
                    
                    .header-title {
                        font-size: 1.6rem !important;
                    }
                }
                
                @media (max-width: 1100px) {
                    .nav-tab {
                        min-width: 85px;
                        padding: 0 8px !important;
                    }
                    
                    .nav-icon {
                        margin-right: 6px;
                        font-size: 16px !important;
                    }
                    
                    .points-chip {
                        padding: 4px 8px;
                    }
                }
                
                @media (max-width: 960px) {
                    .header-title {
                        font-size: 1.5rem !important;
                    }
                    
                    .desktop-nav {
                        display: none !important;
                    }
                    
                    .points-chip {
                        margin-right: 4px !important;
                    }
                }
                
                @media (max-width: 600px) {
                    .header-title {
                        font-size: 1.3rem !important;
                    }
                    
                    .points-chip {
                        display: none !important;
                    }
                    
                    .site-title {
                        margin-left: 8px;
                    }
                }
            </style>
        </div>
    `,
    
    data() {
        return {
            activeTab: 0,
            menuItems: [
                { title: 'Главная', icon: 'mdi-home', route: 'home' },
                { title: 'Уроки', icon: 'mdi-book-open-variant', route: 'language-detail' },
                { title: 'Словарь', icon: 'mdi-notebook', route: 'dictionary' },
                { title: 'Упражнения', icon: 'mdi-puzzle', route: 'exercises' },
                { title: 'Прогресс', icon: 'mdi-chart-line', route: 'progress' },
                { title: 'Профиль', icon: 'mdi-account', route: 'profile' }
            ]
        };
    },
    
    computed: {
        currentDate() {
            return new Date().toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    },
    
    computed: {
        currentRouteName() {
            return this.$route.name;
        }
    },

    methods: {
        changePage(page) {
            // Вместо эмита события используем роутер
            switch(page) {
                case 'home':
                    this.$router.push('/');
                    break;
                case 'language-detail':
                    // Если есть выбранный язык, переходим к нему
                    if (this.$root.selectedLanguageId) {
                        this.$router.push({ name: 'language-detail', params: { id: this.$root.selectedLanguageId } });
                    } else {
                        this.$router.push('/');
                    }
                    break;
                case 'dictionary':
                    this.$router.push('/dictionary');
                    break;
                case 'exercises':
                    this.$router.push('/exercises');
                    break;
                case 'progress':
                    this.$router.push('/progress');
                    break;
                case 'profile':
                    this.$router.push('/profile');
                    break;
                default:
                    this.$router.push('/');
            }
            this.drawer = false;
        },
        
        updateActiveTab(page) {
            const index = this.menuItems.findIndex(item => item.route === page);
            if (index !== -1) {
                this.activeTab = index;
            }
        },
        
        logout() {
            this.$emit('logout');
        },
        
        getUserInitials() {
            if (!this.user.name) return '??';
            const names = this.user.name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return this.user.name.substring(0, 2).toUpperCase();
        },
        
        getAvatarColor() {
            const colors = ['#4A90E2', '#FF5252', '#2196F3', '#FF9800', '#4CAF50'];
            const index = (this.user.name || '').length % colors.length;
            return colors[index];
        },
        getRoutePath(route) {
            const routes = {
                'home': '/',
                'language-detail': '/language',
                'dictionary': '/dictionary',
                'exercises': '/exercises',
                'progress': '/progress',
                'profile': '/profile'
            };
            return routes[route] || '/';
        }
    },
    
    watch: {
        currentPage(newPage) {
            this.updateActiveTab(newPage);
        }
    },
    
    created() {
        this.updateActiveTab(this.currentPage);
    }
});