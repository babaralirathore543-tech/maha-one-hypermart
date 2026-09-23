// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // ✅ Obfuscator — sirf production build mein chalega
    ...(mode === 'production'
      ? [
          obfuscator({
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: [
              /node_modules/,
              'src/config/firebase.ts', // ✅ Firebase config safe rakho
            ],
            apply: 'build',
            debugger: false,
            options: {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.75,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 0.4,
              debugProtection: false, // ⚠️ false rakho — warna page hang hoga
              debugProtectionInterval: 0,
              disableConsoleOutput: false, // ⚠️ false — warna errors chhup jayenge
              identifierNamesGenerator: 'hexadecimal',
              log: false,
              numbersToExpressions: true,
              renameGlobals: false, // ⚠️ false — React ke saath conflict
              selfDefending: true,
              simplify: true,
              splitStrings: true,
              splitStringsChunkLength: 10,
              stringArray: true,
              stringArrayCallsTransform: true,
              stringArrayCallsTransformThreshold: 0.75,
              stringArrayEncoding: ['base64'],
              stringArrayIndexShift: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayWrappersCount: 2,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersParametersMaxCount: 4,
              stringArrayWrappersType: 'variable',
              stringArrayThreshold: 0.75,
              transformObjectKeys: true,
              unicodeEscapeSequence: false,
            },
          }),
        ]
      : []),
  ],

  build: {
    // ✅ Terser minify (console.log remove karne ke liye)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
      },
      mangle: {
        toplevel: true,
        properties: false,
      },
      format: {
        comments: false,
      },
    },

    // ✅ Source maps off
    sourcemap: false,

    // ✅ Chunk optimization
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
    open: true,
  },
}));