<template>
  <v-app-bar color="primary" dark>
    <v-toolbar-title>Habit Tracker</v-toolbar-title>
    <v-spacer />
    <v-btn icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>

  <v-main>
    <v-container>
      <!-- Add new habit -->
      <v-card class="mb-6">
        <v-card-title>Add New Habit</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addHabit">
            <v-row>
              <v-col cols="12" md="10">
                <v-text-field
                  v-model="newHabitName"
                  label="Habit name (e.g., Exercise, Read 30 mins)"
                  prepend-icon="mdi-plus-circle"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  block
                  :loading="adding"
                  @click="addHabit"
                >
                  Add
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- Today's date -->
      <h2 class="text-h5 mb-4">
        {{ todayFormatted }}
      </h2>

      <!-- Loading state -->
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="d-block mx-auto my-8"
      />

      <!-- Empty state -->
      <v-alert v-else-if="habits.length === 0" type="info" variant="tonal">
        No habits yet. Add your first habit above!
      </v-alert>

      <!-- Habits list -->
      <v-card v-else>
        <v-list>
          <v-list-item
            v-for="habit in habits"
            :key="habit.id"
            :class="{ 'bg-green-lighten-5': isCompletedToday(habit) }"
          >
            <template v-slot:prepend>
              <v-checkbox
                :model-value="isCompletedToday(habit)"
                @update:model-value="toggleHabit(habit)"
                color="success"
                hide-details
              />
            </template>

            <v-list-item-title
              :class="{ 'text-decoration-line-through': isCompletedToday(habit) }"
            >
              {{ habit.name }}
            </v-list-item-title>

            <template v-slot:append>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="deleteHabit(habit)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Progress summary -->
      <v-card v-if="habits.length > 0" class="mt-6">
        <v-card-text>
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-primary">
              {{ completedCount }} / {{ habits.length }}
            </div>
            <div class="text-subtitle-1 text-grey">
              habits completed today
            </div>
            <v-progress-linear
              :model-value="progressPercentage"
              color="success"
              height="8"
              rounded
              class="mt-4"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- Error display -->
      <v-snackbar v-model="showError" color="error" timeout="3000">
        {{ errorMessage }}
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/plugins/supabase'

const router = useRouter()

// State
const habits = ref([])
const newHabitName = ref('')
const loading = ref(true)
const adding = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Get today's date as YYYY-MM-DD string
const today = new Date().toISOString().split('T')[0]

// Formatted date for display
const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Count completed habits
const completedCount = computed(() => {
  return habits.value.filter(h => isCompletedToday(h)).length
})

// Progress percentage
const progressPercentage = computed(() => {
  if (habits.value.length === 0) return 0
  return (completedCount.value / habits.value.length) * 100
})

// Check if habit is completed today
function isCompletedToday(habit) {
  return habit.completions?.includes(today)
}

// Show error message
function showErrorMessage(message) {
  errorMessage.value = message
  showError.value = true
}

// Fetch all habits for current user
async function fetchHabits() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error
    habits.value = data || []
  } catch (error) {
    showErrorMessage('Failed to load habits')
    console.error('Error fetching habits:', error)
  } finally {
    loading.value = false
  }
}

// Add a new habit
async function addHabit() {
  if (!newHabitName.value.trim()) return

  adding.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('habits')
      .insert({
        name: newHabitName.value.trim(),
        user_id: user.id,
        completions: []
      })
      .select()
      .single()

    if (error) throw error

    habits.value.push(data)
    newHabitName.value = ''
  } catch (error) {
    showErrorMessage('Failed to add habit')
    console.error('Error adding habit:', error)
  } finally {
    adding.value = false
  }
}

// Toggle habit completion for today
async function toggleHabit(habit) {
  const completed = isCompletedToday(habit)
  let newCompletions

  if (completed) {
    // Remove today from completions
    newCompletions = habit.completions.filter(d => d !== today)
  } else {
    // Add today to completions
    newCompletions = [...(habit.completions || []), today]
  }

  try {
    const { error } = await supabase
      .from('habits')
      .update({ completions: newCompletions })
      .eq('id', habit.id)

    if (error) throw error

    // Update local state
    habit.completions = newCompletions
  } catch (error) {
    showErrorMessage('Failed to update habit')
    console.error('Error toggling habit:', error)
  }
}

// Delete a habit
async function deleteHabit(habit) {
  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habit.id)

    if (error) throw error

    // Remove from local state
    habits.value = habits.value.filter(h => h.id !== habit.id)
  } catch (error) {
    showErrorMessage('Failed to delete habit')
    console.error('Error deleting habit:', error)
  }
}

// Logout
async function logout() {
  await supabase.auth.signOut()
  router.push('/login')
}

// Load habits on mount
onMounted(() => {
  fetchHabits()
})
</script>
