Vue.component('app-header', {

    template: `
        <div>
            <!-- Верхняя панель -->
            <v-app-bar app color="primary" dark fixed class="header-bar" height="64">
                <!-- Кнопка меню -->
                <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
                
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
                        @click.stop="changePage(item.route)"
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
                        @click.stop="changePage(item.route)"
                        @click.middle="changePage(item.route)"
                        :class="{ 'sidebar-item-active': currentRouteName === item.route }"
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
        ...Vuex.mapState(['user', 'drawer', 'selectedLanguageId']),
        ...Vuex.mapGetters(['totalProgress']),

        currentDate() {
            return new Date().toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        currentRouteName() {
            return this.$route.name;
        },
        
    },

    methods: {
        ...Vuex.mapMutations(['TOGGLE_DRAWER']),
        ...Vuex.mapActions(['logout', 'showNotification', 'selectLanguage']),

        toggleDrawer() {
            this.TOGGLE_DRAWER();
        },
        
        changePage(page) {
            switch(page) {
                case 'home':
                    this.$router.push('/');
                    break;
                case 'language-detail':
                    if (this.selectedLanguageId) {
                        this.$router.push({ 
                            name: 'language-detail', 
                            params: { id: this.selectedLanguageId } 
                        });
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
        },
        
        updateActiveTab(page) {
            const index = this.menuItems.findIndex(item => item.route === page);
            if (index !== -1) {
                this.activeTab = index;
            }
        },
        
        logout() {
            if (confirm('Вы уверены, что хотите выйти?')) {
                this.$store.dispatch('logout');
                this.$router.push('/');
            }
        },
        
        getUserInitials() {
            const userName = this.user?.name || '';
            if (!userName) return '??';
            const names = userName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return userName.substring(0, 2).toUpperCase();
        },
        
        getAvatarColor() {
            const colors = ['#4A90E2', '#FF5252', '#2196F3', '#FF9800', '#4CAF50'];
            const userName = this.user?.name || '';
            const index = userName.length % colors.length;
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

        '$route.name'(newPage) {
            this.updateActiveTab(newPage);
        }
    },

    created() {
        this.updateActiveTab(this.$route.name);
    }
});