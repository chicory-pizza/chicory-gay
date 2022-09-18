import {flowPlugin, esbuildFlowPlugin} from '@bunchtogether/vite-plugin-flow';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				presets: ['@babel/preset-flow'],
			},
		}),
		flowPlugin(),
	],
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildFlowPlugin()],
		},
	},
	server: {
		headers: {
			'X-Powered-By': 'Picnic',
			'X-Content-Type-Options': 'nosniff',
			'X-XSS-Protection': '0',
			'X-Frame-Options': 'DENY',
			// 'Strict-Transport-Security': 'max-age=31536000', // irrelevant during dev
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Resource-Policy': 'same-site',
			'Permissions-Policy': 'interest-cohort=()',

			'Content-Security-Policy': [
				"default-src 'self'",

				// unsafe-inline: For Vite dev server
				"script-src 'self' 'unsafe-inline'",

				// unsafe-inline: For Vite dev server
				"style-src 'self' 'unsafe-inline'",

				// Some minified images would be loaded as data URL
				"img-src 'self' data:",

				"frame-ancestors 'none'",
				"base-uri 'none'",
				"object-src 'none'",
			].join(';'),

			'Feature-Policy':
				"accelerometer 'none';ambient-light-sensor 'none';battery 'none';camera 'none';display-capture 'none';geolocation 'none';gyroscope 'none';magnetometer 'none';microphone 'none';midi 'none';payment 'none';usb 'none';xr-spatial-tracking 'none';",
		},
	},
});
