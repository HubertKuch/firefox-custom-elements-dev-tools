export const getConstructorProperties = (element) => element.constructor.elementProperties;

export const getCustomProperties = (element) => {
  const elementProto = Object.getPrototypeOf(element);

  const htmlElementProto = HTMLElement.prototype;

  let properties = [];
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
}
