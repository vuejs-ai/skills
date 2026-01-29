import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const name = ref("");
  const email = ref("");

  const displayName = computed(() => {
    return name.value || "Anonymous";
  });

  function updateName(newName: string) {
    name.value = newName;
  }

  function updateEmail(newEmail: string) {
    email.value = newEmail;
  }

  return {
    name,
    email,
    displayName,
    updateName,
    updateEmail,
  };
});
