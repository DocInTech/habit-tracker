<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Habit Tracker</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form @submit.prevent="handleEmailLogin">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
              />
            </v-form>

            <v-alert v-if="error" type="error" class="mt-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="signupSuccess" type="success" class="mt-4">
              Account created! Please check your email and click the confirmation link before logging in.
            </v-alert>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="elevated"
              block
              :loading="loading"
              @click="handleEmailLogin"
            >
              {{ isSignUp ? 'Sign Up' : 'Login' }}
            </v-btn>
          </v-card-actions>

          <v-card-actions>
            <v-btn
              variant="outlined"
              block
              @click="handleGoogleLogin"
              :loading="loading"
            >
              <v-icon start>mdi-google</v-icon>
              Continue with Google
            </v-btn>
          </v-card-actions>

          <v-card-text class="text-center">
            <v-btn variant="text" @click="isSignUp = !isSignUp">
              {{ isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up" }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/plugins/supabase'

const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSignUp = ref(false)
const loading = ref(false)
const error = ref('')
const signupSuccess = ref(false)

// Email/Password login or signup
async function handleEmailLogin() {
  loading.value = true
  error.value = ''
  signupSuccess.value = false

  try {
    let result
    if (isSignUp.value) {
      // Sign up new user
      result = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
    } else {
      // Login existing user
      result = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
    }

    if (result.error) {
      error.value = result.error.message
    } else if (isSignUp.value) {
      // Show confirmation message after signup
      signupSuccess.value = true
      isSignUp.value = false  // Switch to login mode
      email.value = ''
      password.value = ''
    } else {
      router.push('/')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

// Google OAuth login
async function handleGoogleLogin() {
  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })

    if (authError) {
      error.value = authError.message
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>
