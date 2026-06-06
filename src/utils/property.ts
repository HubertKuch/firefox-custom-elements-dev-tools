export const isJsProperty = (element: object, property: string): boolean => 
  property in element;

export const isAttributeThing = (element: Element, property: string): boolean => 
  element.hasAttribute(property);
