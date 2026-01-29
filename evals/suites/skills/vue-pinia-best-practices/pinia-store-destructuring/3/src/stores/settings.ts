import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const theme = ref("light");
  const language = ref("en");
  const notifications = ref(true);

  const settingsSummary = computed(() => {
    return `Theme: ${theme.value}, Language: ${language.value}, Notifications: ${notifications.value ? "ON" : "OFF"}`;
  });

  function setTheme(newTheme: string) {
    theme.value = newTheme;
  }

  function setLanguage(lang: string) {
    language.value = lang;
  }

  function toggleNotifications() {
    notifications.value = !notifications.value;
  }

  return {
    theme,
    language,
    notifications,
    settingsSummary,
    setTheme,
    setLanguage,
    toggleNotifications,
  };
});
