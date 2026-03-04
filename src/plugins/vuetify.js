// Vuetify plugin configuration
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Create Vuetify instance with default settings
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',    // Blue - main actions
          secondary: '#424242',  // Gray - secondary elements
          accent: '#82B1FF',     // Light blue - highlights
          error: '#FF5252',      // Red - errors
          success: '#4CAF50',    // Green - success states
          warning: '#FFC107',    // Yellow - warnings
        }
      }
    }
  }
})

export default vuetify
