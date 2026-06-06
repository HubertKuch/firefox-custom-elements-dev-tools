import { describe, it, expect, vi } from 'vitest';
import { getConstructorProperties, getCustomProperties } from './properties';

describe('properties utils', () => {
  describe('getConstructorProperties', () => {
    it('should return elementProperties from the constructor', () => {
      const mockProperties = { name: { type: String } };
      const mockElement = {
        constructor: {
          elementProperties: mockProperties
        }
      };

      expect(getConstructorProperties(mockElement)).toBe(mockProperties);
    });

    it('should return undefined if elementProperties does not exist', () => {
      const mockElement = {
        constructor: {}
      };

      expect(getConstructorProperties(mockElement)).toBeUndefined();
    });
  });

  describe('getCustomProperties', () => {
    it('should extract properties from the prototype chain until HTMLElement', () => {
      // Mock HTMLElement
      class MockHTMLElement {}
      vi.stubGlobal('HTMLElement', MockHTMLElement);

      class Base extends (MockHTMLElement as any) {
        get baseProp() { return 1; }
      }

      class Derived extends Base {
        get derivedProp() { return 2; }
        method() {}
      }

      const instance = new Derived();

      const properties = getCustomProperties(instance as any);

      expect(properties).toContain('baseProp');
      expect(properties).toContain('derivedProp');
      expect(properties).toContain('method');
      expect(properties).not.toContain('constructor');
    });

    it('should handle empty prototypes', () => {
      class MockHTMLElement {}
      vi.stubGlobal('HTMLElement', MockHTMLElement);

      class Empty extends (MockHTMLElement as any) {}
      const instance = new Empty();

      const properties = getCustomProperties(instance as any);
      expect(properties).toEqual([]);
    });

    it('should stop at HTMLElement prototype', () => {
      const htmlElementProto = { someNativeProp: 'native' };
      function MockHTMLElement() {}
      MockHTMLElement.prototype = htmlElementProto;
      vi.stubGlobal('HTMLElement', MockHTMLElement);

      const derivedProto = Object.create(htmlElementProto);
      Object.defineProperty(derivedProto, 'customProp', { value: 'custom', enumerable: true });
      
      const instance = { customValue: 'value' };
      Object.setPrototypeOf(instance, derivedProto);

      const properties = getCustomProperties(instance as any);

      expect(properties).toContain('customProp');
      expect(properties).not.toContain('someNativeProp');
      expect(properties).not.toContain('customValue');
    });
  });
});
