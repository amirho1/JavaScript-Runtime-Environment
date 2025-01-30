export default function ObservableMethods<T extends { new (...args: any[]): {} }>(constructor: T) {
  // We return a new class that extends the original
  return class extends constructor {
    // A map of methodName -> array of callbacks
    private __subscriptions = new Map<string, Array<(...args: any[]) => void>>();

    constructor(...args: any[]) {
      super(...args);

      // For every property on the prototype, if it's a function, wrap it
      const proto = constructor.prototype;
      const propNames = Object.getOwnPropertyNames(proto);

      propNames.forEach(prop => {
        // Skip constructor
        if (prop === "constructor") return;
        const desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc && typeof desc.value === "function") {
          // It's a method - let's wrap it
          const originalMethod = desc.value;

          Object.defineProperty(this, prop, {
            value: (...methodArgs: any[]) => {
              // Call the original method
              const result = originalMethod.apply(this, methodArgs);

              // Notify subscribers
              const methodName = prop.toString();
              const list = this.__subscriptions.get(methodName) || [];
              for (const fn of list) {
                fn(...methodArgs);
              }

              return result;
            },
          });
        }
      });
    }

    // For hooking into any method call
    on(methodName: string, callback: (...args: any[]) => void) {
      if (!this.__subscriptions.has(methodName)) {
        this.__subscriptions.set(methodName, []);
      }
      this.__subscriptions.get(methodName)!.push(callback);
    }

    off(methodName: string, callback: (...args: any[]) => void) {
      const subs = this.__subscriptions.get(methodName);
      if (!subs) return;
      this.__subscriptions.set(
        methodName,
        subs.filter(fn => fn !== callback)
      );
    }
  };
}
