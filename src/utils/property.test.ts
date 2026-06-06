import { describe, it, expect } from 'vitest';
import { isJsProperty, isAttributeThing } from './property';

describe('property utils', () => {
  describe('isJsProperty', () => {
    it('should return true if property exists in element', () => {
      const element = { testProp: 'value' };
      expect(isJsProperty(element, 'testProp')).toBe(true);
    });

    it('should return true for inherited properties', () => {
      const proto = { parentProp: 'value' };
      const element = Object.create(proto);
      expect(isJsProperty(element, 'parentProp')).toBe(true);
    });

    it('should return false if property does not exist', () => {
      const element = { testProp: 'value' };
      expect(isJsProperty(element, 'nonExistent')).toBe(false);
    });
  });

  describe('isAttributeThing', () => {
    it('should return true if attribute exists', () => {
      const element = {
        hasAttribute: (attr: string) => attr === 'test-attr'
      } as Element;
      expect(isAttributeThing(element, 'test-attr')).toBe(true);
    });

    it('should return false if attribute does not exist', () => {
      const element = {
        hasAttribute: (attr: string) => attr === 'test-attr'
      } as Element;
      expect(isAttributeThing(element, 'other-attr')).toBe(false);
    });
  });
});
