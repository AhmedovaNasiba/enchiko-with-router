// Компонент профиля (с яркой кнопкой сохранения)
Vue.component('profile-page', {
    props: {
        user: Object
    },
    
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
            
            <style>
                /* Стили для компонента профиля */
                .profile-row {
                    margin: -16px;
                }
                
                .profile-row .v-col {
                    padding: 16px !important;
                }
                
                /* Карточка информации профиля */
                .profile-info-card {
                    border-radius: 16px;
                    overflow: hidden;
                }
                
                .profile-header {
                    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                    color: white;
                }
                
                .avatar-container {
                    position: relative;
                    display: inline-block;
                }
                
                .profile-avatar {
                    border: 4px solid white;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                }
                
                .profile-avatar:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
                }
                
                .avatar-image {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                
                .avatar-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    cursor: pointer;
                }
                
                .avatar-image:hover .avatar-overlay {
                    opacity: 1;
                }
                
                .avatar-initials {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    position: relative;
                }
                
                .initials-text {
                    color: white;
                    font-weight: 700;
                    font-size: 2.5rem;
                }
                
                .avatar-upload-hint {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 36px;
                    height: 36px;
                    background: var(--secondary-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                
                .avatar-upload-hint:hover {
                    transform: scale(1.1);
                }
                
                .avatar-remove-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: white !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                
                .profile-name {
                    color: white;
                }
                
                .profile-level {
                    font-weight: 600;
                }
                
                .profile-email {
                    color: rgba(255, 255, 255, 0.9);
                }
                
                .profile-join-date {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .profile-bio {
                    border-top: 1px solid var(--medium-grey);
                }
                
                /* Карточка статистики */
                .profile-stats-card {
                    border-radius: 16px;
                }
                
                .stats-title {
                    color: var(--primary-color);
                }
                
                .stats-content {
                    padding-top: 0;
                }
                
                .stats-list {
                    background-color: transparent;
                }
                
                .stats-item {
                    padding: 16px 0;
                }
                
                .stats-icon {
                    min-width: 48px;
                }
                
                .stats-label {
                    font-weight: 500;
                    color: var(--dark-color);
                }
                
                .stats-value {
                    font-weight: 700;
                    font-size: 1.2rem;
                    color: var(--primary-color);
                }
                
                .stats-divider {
                    margin: 0 !important;
                }
                
                /* Карточка редактирования профиля */
                .profile-edit-card {
                    border-radius: 16px;
                }
                
                .edit-title {
                    color: var(--primary-color);
                }
                
                .edit-form {
                    padding-top: 0;
                }
                
                .form-row {
                    margin: -12px;
                }
                
                .form-row .v-col {
                    padding: 12px !important;
                }
                
                .form-field {
                    margin-bottom: 8px !important;
                }
                
                .form-actions {
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 2px solid var(--light-grey);
                }
                
                /* ЯРКАЯ КНОПКА СОХРАНЕНИЯ */
                .btn-save {
                    background: linear-gradient(135deg, #FF4081, #FF5252) !important;
                    color: white !important;
                    font-weight: 700 !important;
                    padding: 18px 48px !important;
                    border-radius: 10px !important;
                    box-shadow: 0 6px 16px rgba(255, 64, 129, 0.3) !important;
                    font-size: 1.1rem !important;
                    letter-spacing: 0.5px !important;
                    text-transform: uppercase !important;
                }
                
                .btn-save:hover {
                    background: linear-gradient(135deg, #FF5252, #FF4081) !important;
                    box-shadow: 0 8px 20px rgba(255, 64, 129, 0.4) !important;
                    transform: translateY(-2px) !important;
                }
                
                .btn-save:disabled {
                    background: #E0E0E0 !important;
                    color: #9E9E9E !important;
                    box-shadow: none !important;
                    transform: none !important;
                    cursor: not-allowed !important;
                }
                
                .btn-save .v-icon {
                    font-size: 22px !important;
                }
                
                /* Карточка настроек */
                .settings-card {
                    border-radius: 16px;
                }
                
                .settings-title {
                    color: var(--primary-color);
                }
                
                .settings-content {
                    padding-top: 0;
                }
                
                .settings-list {
                    background-color: transparent;
                }
                
                .settings-item {
                    padding: 16px 0;
                }
                
                .settings-icon {
                    min-width: 48px;
                }
                
                .settings-text {
                    padding-right: 16px;
                }
                
                .settings-action {
                    margin: 0;
                }
                
                .settings-switch {
                    margin: 0;
                }
                
                .settings-divider {
                    margin: 0 !important;
                }
                
                /* Карточка управления аккаунтом */
                .account-card {
                    border-radius: 16px;
                }
                
                .account-title {
                    color: var(--primary-color);
                }
                
                .account-content {
                    padding-top: 0;
                }
                
                .account-list {
                    background-color: transparent;
                }
                
                .account-item {
                    padding: 16px 0;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .account-item:hover {
                    background-color: rgba(0, 0, 0, 0.02);
                }
                
                .reset-item:hover {
                    background-color: rgba(255, 152, 0, 0.1);
                }
                
                .delete-item:hover {
                    background-color: rgba(255, 82, 82, 0.1);
                }
                
                .account-icon {
                    min-width: 48px;
                }
                
                .account-text {
                    padding-right: 16px;
                }
                
                .account-action {
                    margin: 0;
                }
                
                .account-divider {
                    margin: 0 !important;
                }
                
                /* Диалоги */
                .reset-dialog .v-card,
                .delete-dialog .v-card {
                    border-radius: 16px;
                }
                
                .dialog-title {
                    color: var(--dark-color);
                    padding-bottom: 16px;
                }
                
                .dialog-text {
                    color: #666;
                    line-height: 1.6;
                }
                
                .reset-list {
                    padding-left: 20px;
                }
                
                .reset-list li {
                    margin-bottom: 8px;
                    color: var(--dark-color);
                }
                
                .dialog-actions {
                    padding: 16px 24px;
                }
                
                .dialog-btn {
                    font-weight: 600;
                    padding: 8px 24px;
                }
                
                .cancel-btn {
                    color: #666;
                }
                
                .confirm-btn {
                    color: white;
                }
                
                /* Адаптивность */
                @media (max-width: 960px) {
                    .profile-info-card,
                    .profile-stats-card,
                    .profile-edit-card,
                    .settings-card,
                    .account-card {
                        margin-bottom: 24px;
                    }
                    
                    .profile-avatar {
                        width: 120px !important;
                        height: 120px !important;
                    }
                    
                    .initials-text {
                        font-size: 2rem;
                    }
                    
                    .btn-save {
                        padding: 16px 32px !important;
                        font-size: 1rem !important;
                        width: 100%;
                    }
                    
                    .form-actions {
                        text-align: center;
                    }
                }
                
                @media (max-width: 600px) {
                    .profile-header {
                        padding: 24px !important;
                    }
                    
                    .profile-avatar {
                        width: 100px !important;
                        height: 100px !important;
                    }
                    
                    .initials-text {
                        font-size: 1.8rem;
                    }
                    
                    .btn-save {
                        padding: 14px 24px !important;
                        font-size: 0.95rem !important;
                    }
                    
                    .dialog-btn {
                        padding: 8px 16px;
                    }
                }
            </style>
        </v-container>
    `,
    
    data() {
        return {
            valid: true,
            saving: false,
            showResetDialog: false,
            showDeleteDialog: false,
            
            form: {
                name: this.user.name,
                email: this.user.email,
                bio: this.user.bio || '',
                level: this.user.level
            },
            
            settings: {
                notifications: this.user.settings?.notifications || true,
                darkMode: this.user.settings?.darkMode || false,
                dailyReminder: this.user.settings?.dailyReminder || true
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
        learnedWords() {
            const progress = DataManager.getUserProgress();
            return Object.values(progress.words || {}).filter(word => word.learned).length;
        }
    },
    
    methods: {
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
                    this.$root.showNotification({
                        type: 'error',
                        message: 'Файл слишком большой. Максимальный размер: 5MB',
                        icon: 'mdi-alert'
                    });
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    this.$root.showNotification({
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
                    
                    this.$emit('update-user', updatedUser);
                    
                    this.$root.showNotification({
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
            
            this.$emit('update-user', updatedUser);
            
            this.$root.showNotification({
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
                    
                    this.$emit('update-user', updatedUser);
                    this.saving = false;
                    
                    this.$root.showNotification({
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
            
            this.$emit('update-user', updatedUser);
        },
        
        resetProgress() {
            DataManager.resetProgress();
            this.showResetDialog = false;
            
            this.$emit('update-user', {
                ...this.user,
                points: 0,
                streak: 0,
                level: 'Новичок'
            });
            
            this.$root.showNotification({
                type: 'info',
                message: 'Прогресс сброшен',
                icon: 'mdi-restart'
            });
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
        
        deleteAccount() {
            DataManager.resetProgress();
            this.showDeleteDialog = false;
            
            this.$root.showNotification({
                type: 'warning',
                message: 'Аккаунт удален',
                icon: 'mdi-delete'
            });
            
            setTimeout(() => {
                this.$root.currentPage = 'home';
            }, 1500);
        }
    }
});