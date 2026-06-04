export const isJsProperty = (element, property) => property in element;

export const isAttributeThing = (element, property) => element.hasAttribute(property);
