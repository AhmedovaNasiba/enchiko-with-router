Vue.component('profile-page', {
    
    template: `
        <v-container class="custom-container py-6">
            <!-- Заголовок -->
            <div class="mb-8">
                <h1 class="display-1 font-weight-bold page-title primary--text">Мой профиль</h1>
                <p class="subtitle-1 grey--text text--darken-1">
                    Управляйте своим аккаунтом и настройками
                </p>
            </div>
            
            <v-row class="profile-row">
                <!-- Левая колонка - информация профиля -->
                <v-col cols="12" md="4">
                    <!-- Карточка профиля -->
                    <v-card class="mb-6 profile-info-card">
                        <div class="profile-header text-center pa-6">
                            <!-- Аватар с возможностью загрузки -->
                            <div class="avatar-container mb-4">
                                <v-avatar size="140" class="profile-avatar" :class="{ 'no-photo': !user.avatar }">
                                    <div v-if="user.avatar" class="avatar-image">
                                        <v-img :src="user.avatar" alt="Аватар"></v-img>
                                        <div class="avatar-overlay" @click="triggerFileInput">
                                            <v-icon color="white" size="24">mdi-camera</v-icon>
                                        </div>
                                    </div>
                                    <div v-else class="avatar-initials" :style="{ background: getAvatarGradient() }">
                                        <span class="initials-text">{{ user.initials || getUserInitials() }}</span>
                                        <div class="avatar-upload-hint" @click="triggerFileInput">
                                            <v-icon color="white" size="20">mdi-plus</v-icon>
                                        </div>
                                    </div>
                                </v-avatar>
                                
                                <!-- Скрытый input для загрузки фото -->
                                <input 
                                    type="file" 
                                    ref="fileInput" 
                                    accept="image/*" 
                                    @change="handleAvatarUpload" 
                                    style="display: none"
                                >
                                
                                <!-- Кнопка удаления фото -->
                                <v-btn 
                                    v-if="user.avatar" 
                                    icon 
                                    small 
                                    color="red" 
                                    class="avatar-remove-btn"
                                    @click="removeAvatar"
                                >
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </div>
                            
                            <!-- Имя и уровень -->
                            <h2 class="headline mb-2 profile-name">{{ user.name }}</h2>
                            <v-chip color="primary" dark class="mb-4 profile-level">
                                <v-icon left small>mdi-account-star</v-icon>
                                {{ user.level }}
                            </v-chip>
                            
                            <!-- Email -->
                            <p class="body-2 mb-4 profile-email">
                                <v-icon small left>mdi-email</v-icon>
                                {{ user.email }}
                            </p>
                            
                            <!-- Дата регистрации -->
                            <p class="caption grey--text profile-join-date">
                                <v-icon small left>mdi-calendar</v-icon>
                                Присоединился {{ formatDate(user.joinDate) }}
                            </p>
                        </div>
                        
                        <!-- О себе -->
                        <v-card-text v-if="user.bio" class="profile-bio">
                            <h4 class="title mb-2">О себе</h4>
                            <p class="body-2">{{ user.bio }}</p>
                        </v-card-text>
                    </v-card>
                    
                    <!-- Статистика -->
                    <v-card class="profile-stats-card">
                        <v-card-title class="headline stats-title">
                            <v-icon left>mdi-chart-bar</v-icon>
                            Статистика
                        </v-card-title>
                        
                        <v-card-text class="stats-content">
                            <v-list dense class="stats-list">
                                <v-list-item class="stats-item">
                                    <v-list-item-icon class="stats-icon">
                                        <v-icon color="primary">mdi-star</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title class="stats-label">Очки знаний</v-list-item-title>
                                        <v-list-item-subtitle class="stats-value">{{ user.points }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                
                                <v-divider class="stats-divider"></v-divider>
                                
                                <v-list-item class="stats-item">
                                    <v-list-item-icon class="stats-icon">
                                        <v-icon color="secondary">mdi-fire</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title class="stats-label">Дней подряд</v-list-item-title>
                                        <v-list-item-subtitle class="stats-value">{{ user.streak }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                
                                <v-divider class="stats-divider"></v-divider>
                                
                                <v-list-item class="stats-item">
                                    <v-list-item-icon class="stats-icon">
                                        <v-icon color="orange">mdi-translate</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title class="stats-label">Изучено слов</v-list-item-title>
                                        <v-list-item-subtitle class="stats-value">{{ learnedWords }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
                
                <!-- Правая колонка - настройки -->
                <v-col cols="12" md="8">
                    <!-- Редактирование профиля -->
                    <v-card class="mb-6 profile-edit-card">
                        <v-card-title class="headline edit-title">
                            <v-icon left>mdi-account-edit</v-icon>
                            Редактировать профиль
                        </v-card-title>
                        
                        <v-card-text class="edit-form">
                            <v-form ref="profileForm" v-model="valid" lazy-validation>
                                <v-row class="form-row">
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="form.name"
                                            label="Имя"
                                            :rules="nameRules"
                                            outlined
                                            required
                                            class="form-field"
                                            prepend-inner-icon="mdi-account"
                                        ></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="form.email"
                                            label="Email"
                                            :rules="emailRules"
                                            type="email"
                                            outlined
                                            required
                                            class="form-field"
                                            prepend-inner-icon="mdi-email"
                                        ></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12">
                                        <v-textarea
                                            v-model="form.bio"
                                            label="О себе"
                                            rows="3"
                                            outlined
                                            counter="200"
                                            class="form-field"
                                            prepend-inner-icon="mdi-text"
                                        ></v-textarea>
                                    </v-col>
                                    
                                    <v-col cols="12">
                                        <v-select
                                            v-model="form.level"
                                            :items="levels"
                                            label="Ваш уровень"
                                            outlined
                                            class="form-field"
                                            prepend-inner-icon="mdi-school"
                                        ></v-select>
                                    </v-col>
                                    
                                    <v-col cols="12" class="text-right form-actions">
                                        <!-- ЯРКАЯ КНОПКА СОХРАНЕНИЯ -->
                                        <v-btn
                                            color="secondary"
                                            @click="saveProfile"
                                            :loading="saving"
                                            :disabled="!valid"
                                            class="save-btn btn-save"
                                            large
                                            x-large
                                        >
                                            <v-icon left>mdi-content-save</v-icon>
                                            Сохранить изменения
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                    
                    <!-- Настройки приложения -->
                    <v-card class="mb-6 settings-card">
                        <v-card-title class="headline settings-title">
                            <v-icon left>mdi-cog</v-icon>
                            Настройки приложения
                        </v-card-title>
                        
                        <v-card-text class="settings-content">
                            <v-list class="settings-list">
                                <v-list-item class="settings-item">
                                    <v-list-item-icon class="settings-icon">
                                        <v-icon color="primary">mdi-bell</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content class="settings-text">
                                        <v-list-item-title>Уведомления</v-list-item-title>
                                        <v-list-item-subtitle>Получать уведомления о новых уроках</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action class="settings-action">
                                        <v-switch
                                            v-model="settings.notifications"
                                            @change="saveSettings"
                                            color="primary"
                                            class="settings-switch"
                                        ></v-switch>
                                    </v-list-item-action>
                                </v-list-item>
                                
                                <v-divider class="settings-divider"></v-divider>
                                
                                <v-list-item class="settings-item">
                                    <v-list-item-icon class="settings-icon">
                                        <v-icon color="primary">mdi-moon-waning-crescent</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content class="settings-text">
                                        <v-list-item-title>Темная тема</v-list-item-title>
                                        <v-list-item-subtitle>Использовать темную цветовую тему</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action class="settings-action">
                                        <v-switch
                                            v-model="settings.darkMode"
                                            @change="saveSettings"
                                            color="primary"
                                            class="settings-switch"
                                        ></v-switch>
                                    </v-list-item-action>
                                </v-list-item>
                                
                                <v-divider class="settings-divider"></v-divider>
                                
                                <v-list-item class="settings-item">
                                    <v-list-item-icon class="settings-icon">
                                        <v-icon color="primary">mdi-calendar-check</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content class="settings-text">
                                        <v-list-item-title>Напоминания</v-list-item-title>
                                        <v-list-item-subtitle>Ежедневные напоминания об уроках</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action class="settings-action">
                                        <v-switch
                                            v-model="settings.dailyReminder"
                                            @change="saveSettings"
                                            color="primary"
                                            class="settings-switch"
                                        ></v-switch>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                    
                    <!-- Управление аккаунтом -->
                    <v-card class="account-card">
                        <v-card-title class="headline account-title">
                            <v-icon left>mdi-shield-account</v-icon>
                            Управление аккаунтом
                        </v-card-title>
                        
                        <v-card-text class="account-content">
                            <v-list class="account-list">
                                <v-list-item @click="showResetDialog = true" class="account-item reset-item">
                                    <v-list-item-icon class="account-icon">
                                        <v-icon color="orange">mdi-restart</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content class="account-text">
                                        <v-list-item-title>Сбросить прогресс</v-list-item-title>
                                        <v-list-item-subtitle>Начните изучение заново</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action class="account-action">
                                        <v-icon color="orange">mdi-chevron-right</v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                                
                                <v-divider class="account-divider"></v-divider>
                                
                                <v-list-item @click="showDeleteDialog = true" class="account-item delete-item">
                                    <v-list-item-icon class="account-icon">
                                        <v-icon color="red">mdi-delete</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content class="account-text">
                                        <v-list-item-title>Удалить аккаунт</v-list-item-title>
                                        <v-list-item-subtitle>Удалить все данные аккаунта</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action class="account-action">
                                        <v-icon color="red">mdi-chevron-right</v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            
            <!-- Диалог сброса прогресса -->
            <v-dialog v-model="showResetDialog" max-width="500" class="reset-dialog">
                <v-card>
                    <v-card-title class="headline dialog-title">Сбросить прогресс?</v-card-title>
                    
                    <v-card-text class="dialog-text">
                        Вы уверены, что хотите сбросить весь прогресс?
                        Это действие нельзя отменить. Вы потеряете:
                        <ul class="reset-list mt-3">
                            <li>Все завершенные уроки</li>
                            <li>Изученные слова</li>
                            <li>Заработанные очки</li>
                            <li>Текущий streak</li>
                        </ul>
                    </v-card-text>
                    
                    <v-card-actions class="dialog-actions">
                        <v-spacer></v-spacer>
                        <v-btn text @click="showResetDialog = false" class="dialog-btn cancel-btn">Отмена</v-btn>
                        <v-btn color="red" dark @click="resetProgress" class="dialog-btn confirm-btn">Сбросить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            
            <!-- Диалог удаления аккаунта -->
            <v-dialog v-model="showDeleteDialog" max-width="500" class="delete-dialog">
                <v-card>
                    <v-card-title class="headline dialog-title">Удалить аккаунт?</v-card-title>
                    
                    <v-card-text class="dialog-text">
                        Это действие удалит все ваши данные без возможности восстановления.
                        Вы уверены, что хотите продолжить?
                    </v-card-text>
                    
                    <v-card-actions class="dialog-actions">
                        <v-spacer></v-spacer>
                        <v-btn text @click="showDeleteDialog = false" class="dialog-btn cancel-btn">Отмена</v-btn>
                        <v-btn color="red" dark @click="deleteAccount" class="dialog-btn confirm-btn">Удалить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            
            
        </v-container>
    `,
    
    data() {
        return {
            valid: true,
            saving: false,
            showResetDialog: false,
            showDeleteDialog: false,
            
            form: {
                name: this.$store.state.user.name, 
                email: this.$store.state.user.email,
                bio: this.$store.state.user.bio || '',
                level: this.$store.state.user.level
            },
            
            settings: {
                notifications: this.$store.state.user.settings?.notifications || true,
                darkMode: this.$store.state.user.settings?.darkMode || false,
                dailyReminder: this.$store.state.user.settings?.dailyReminder || true
            },
            
            levels: ['Новичок', 'Средний', 'Продвинутый', 'Эксперт'],
            
            nameRules: [
                v => !!v || 'Имя обязательно',
                v => (v && v.length >= 2) || 'Имя должно содержать минимум 2 символа'
            ],
            
            emailRules: [
                v => !!v || 'Email обязателен',
                v => /.+@.+\..+/.test(v) || 'Email должен быть действительным'
            ]
        };
    },
    
    computed: {
        ...Vuex.mapState(['user']),
        ...Vuex.mapGetters(['learnedWords']),

        learnedWords() {
            const progress = DataManager.getUserProgress();
            return Object.values(progress.words || {}).filter(word => word.learned).length;
        }
    },
    
    methods: {
        ...Vuex.mapActions(['updateUser', 'showNotification']),

        getAvatarGradient() {
            return `linear-gradient(135deg, ${this.getAvatarColor()}, ${this.getSecondaryColor()})`;
        },
        
        getAvatarColor() {
            const colors = ['#4A90E2', '#FF5252', '#2196F3', '#FF9800', '#4CAF50'];
            const index = (this.user.name || '').length % colors.length;
            return colors[index];
        },
        
        getSecondaryColor() {
            const colors = ['#2196F3', '#FF9800', '#4A90E2', '#4CAF50', '#FF5252'];
            const index = (this.user.name || '').length % colors.length;
            return colors[index];
        },
        
        getUserInitials() {
            if (!this.user.name) return '??';
            const names = this.user.name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return this.user.name.substring(0, 2).toUpperCase();
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        
        handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                     this.showNotification({
                        type: 'error',
                        message: 'Файл слишком большой. Максимальный размер: 5MB',
                        icon: 'mdi-alert'
                    });
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    this.showNotification({
                        type: 'error',
                        message: 'Пожалуйста, выберите изображение',
                        icon: 'mdi-alert'
                    });
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const updatedUser = {
                        ...this.user,
                        avatar: e.target.result
                    };
                    
                    this.updateUser(updatedUser);
                    
                    this.showNotification({
                        type: 'success',
                        message: 'Фото профиля обновлено',
                        icon: 'mdi-check'
                    });
                };
                reader.readAsDataURL(file);
                
                event.target.value = '';
            }
        },
        
        removeAvatar() {
            const updatedUser = {
                ...this.user,
                avatar: null
            };
            
            this.updateUser(updatedUser);
            
            this.showNotification({
                type: 'info',
                message: 'Фото профиля удалено',
                icon: 'mdi-information'
            });
        },
        
        saveProfile() {
            if (this.$refs.profileForm.validate()) {
                this.saving = true;
                
                setTimeout(() => {
                    const updatedUser = {
                        ...this.user,
                        name: this.form.name,
                        email: this.form.email,
                        bio: this.form.bio,
                        level: this.form.level,
                        settings: this.settings,
                        initials: this.getUserInitials()
                    };
                    
                    this.updateUser(updatedUser);
                    this.saving = false;
                    
                    this.showNotification({
                        type: 'success',
                        message: 'Профиль успешно обновлен!',
                        icon: 'mdi-check-circle',
                        timeout: 3000
                    });
                }, 1000);
            }
        },
        
        saveSettings() {
            const updatedUser = {
                ...this.user,
                settings: this.settings
            };
            
            this.updateUser(updatedUser);
        },
        
        resetProgress() {
            this.$store.commit('RESET_PROGRESS');
            this.showResetDialog = false;
            
            this.showNotification({
                type: 'info',
                message: 'Прогресс сброшен',
                icon: 'mdi-restart'
            });
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
        
        deleteAccount() {
            this.$store.commit('RESET_PROGRESS');
            this.showDeleteDialog = false;
            
            this.showNotification({
                type: 'warning',
                message: 'Аккаунт удален',
                icon: 'mdi-delete'
            });
            
            setTimeout(() => {
                this.$router.push('/');
            }, 1500);
        }
    }
});