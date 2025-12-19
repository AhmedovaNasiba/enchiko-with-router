document.addEventListener('DOMContentLoaded', function() {
    // Создаем корневой экземпляр Vue с Vuex
    const app = new Vue({
        el: '#app',
        store: store,
        router: router,
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
        created() {
            this.$store.dispatch('loadState');
        },
        beforeDestroy() {
            this.$store.dispatch('saveState');
        }
    });
    Vue.config.productionTip = false;
});