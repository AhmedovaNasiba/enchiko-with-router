document.addEventListener('DOMContentLoaded', function() {

    const app = new Vue({
        el: '#app',
        
        // Подключаем роутер
        router: router,
        
        // Инициализация Vuetify
        vuetify: new Vuetify({
            theme: {
                themes: {
                    light: {
                        primary: '#4A90E2',
                        secondary: '#50E3C2',
                        accent: '#F5A623',
                        error: '#FF5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FFC107'
                    }
                }
            }
        }),
        
        // Данные приложения
        data: {
            notifications: []
        },
        
        // Методы
        methods: {
            // Показ уведомления
            showNotification(notification) {
                const id = Date.now();
                this.notifications.push({
                    id,
                    ...notification,
                    show: true
                });
                
                // Автоматическое скрытие через 3 секунды
                setTimeout(() => {
                    const index = this.notifications.findIndex(n => n.id === id);
                    if (index !== -1) {
                        this.notifications[index].show = false;
                        setTimeout(() => {
                            this.notifications.splice(index, 1);
                        }, 300);
                    }
                }, 3000);
            }
        },
        
        // Хуки жизненного цикла
        created() {
            // Делаем метод showNotification глобально доступным
            this.$root.showNotification = this.showNotification;
            
            // Восстанавливаем состояние из localStorage
            const savedState = DataManager.loadData('state');
            if (savedState && savedState.selectedLanguageId) {
            }
        }
    });
});