export const getConstructorProperties = (element: any): any => 
  (element.constructor as any).elementProperties;

export const getCustomProperties = (element: HTMLElement): string[] => {
  const elementProto = Object.getPrototypeOf(element);
  const htmlElementProto = HTMLElement.prototype;

  let properties: string[] = [];
  let currentProto = elementProto;

  while (currentProto && currentProto !== htmlElementProto) {
    const descriptors = Object.getOwnPropertyDescriptors(currentProto);

    Object.keys(descriptors).forEach(key => {
      if (key !== 'constructor') {
        properties.push(key);
      }
    });

    currentProto = Object.getPrototypeOf(currentProto);
  }

  return properties;
};
