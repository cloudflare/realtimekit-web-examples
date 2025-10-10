const handler = {
  get:
    (target: any, name: any, receiver: any) =>
    (...args: any[]) => {
      try {
        return Reflect.get(target, name, receiver).apply(target, args);
      } catch {
        return null;
      }
    },
};

let gracefulStorage: Storage;

try {
  gracefulStorage = new Proxy(localStorage, handler);
} catch {
  gracefulStorage = new Proxy({}, handler);
}

export default gracefulStorage;
