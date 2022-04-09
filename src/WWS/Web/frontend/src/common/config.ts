interface WindowConfig extends Window {
  config: {
    inventoryServiceUrl: string,
    orderServiceUrl: string,
    invoiceServiceUrl: string,
    userServiceUrl: string,
    authServiceUrl: string,
    baseUrl: string,
  }
}

const Config = (window as unknown as WindowConfig).config;

export default Config;
