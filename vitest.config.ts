import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    workspace: [
      {
        test: {
          globals: true,
          name: 'jest-dom',
          root: './src/client',
          environment: 'jest-dom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        test: {
          globals: true,
          name: 'node',
          root: './src/server',
          environment: 'node',
        },
      },
    ],
  },
})