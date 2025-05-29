import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';

// Extends matchers with advanced matchers such as .toBeInTheDocument(), etc...
expect.extend(matchers);
