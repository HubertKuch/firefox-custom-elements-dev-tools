export {};

declare global {
  interface Window {
    chrome?: {
      runtime?: {
        id?: string;
      };
      devtools?: any;
    };
    browser?: {
      devtools?: any;
    };
  }
}
