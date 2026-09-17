import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), svgr()],
	server: {
		hmr: false // This turns off automatic rendering on file changes
	}
})
