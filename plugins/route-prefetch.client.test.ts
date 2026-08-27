import { describe, expect, it } from 'vitest';
import { withoutAppBase } from './route-prefetch.client';

describe('withoutAppBase', () => {
  it('strips the configured application base', () => {
    expect(withoutAppBase('/anke-to/explorer', '/anke-to/')).toBe('/explorer');
    expect(withoutAppBase('/anke-to', '/anke-to/')).toBe('/');
  });

  it('keeps root-based application paths unchanged', () => {
    expect(withoutAppBase('/explorer', '/')).toBe('/explorer');
  });

  it('rejects same-origin paths outside the application base', () => {
    expect(withoutAppBase('/explorer', '/anke-to/')).toBeUndefined();
    expect(withoutAppBase('/anke-tools/explorer', '/anke-to/')).toBeUndefined();
  });
});
