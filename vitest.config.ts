import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    workspace: [
      {
        test: {
          globals: true,
          name: 'client',
          root: './src/client',
          environment: 'jest-dom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        test: {
          globals: true,
          name: 'server',
          root: './src/server',
          environment: 'node',
        },
      },
    ],
  },
})