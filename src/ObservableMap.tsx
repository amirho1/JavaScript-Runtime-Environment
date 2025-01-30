import { Expression } from "acorn";
import ObservableMethods from "./ObservableMethod";

/**
 * A class that represents an observable map, which is a wrapper around the native JavaScript `Map` object.
 * It provides additional type safety and utility methods for working with key-value pairs.
 *
 * @template K - The type of the keys in the map. Defaults to `string`.
 * @template V - The type of the values in the map. Defaults to `Expression`.
 */
@ObservableMethods
export default class ObservableMap<K = string, V = Expression> {
  /**
   * The internal map instance.
   * @private
   */
  private map: Map<K, V> | undefined;

  /**
   * Creates an instance of ObservableMap.
   * @param {...any[]} rest - Optional parameters to initialize the map.
   */
  constructor(...rest: any[]) {
    this.map = new Map(...rest);
  }

  /**
   * Retrieves the value associated with the given key.
   * @param {K} key - The key whose associated value is to be returned.
   * @returns {V | undefined} The value associated with the specified key, or `undefined` if the key does not exist.
   */
  get(key: K): V | undefined {
    return this.map?.get(key);
  }

  /**
   * Sets the value for the given key in the map.
   * @param {K} key - The key of the element to add.
   * @param {V} value - The value of the element to add.
   * @returns {this} The ObservableMap instance.
   */
  set(key: K, value: V): this {
    this.map?.set(key, value);
    return this;
  }

  /**
   * Removes the specified key and its associated value from the map.
   * @param {K} key - The key of the element to remove.
   * @returns {boolean} `true` if the element existed and was removed, `false` otherwise.
   */
  delete(key: K): boolean {
    return this.map?.delete(key) || false;
  }

  /**
   * Removes all key-value pairs from the map.
   */
  clear(): void {
    this.map?.clear();
  }

  /**
   * Returns the number of key-value pairs in the map.
   * @returns {number} The number of key-value pairs in the map.
   */
  size(): number {
    return this.map?.size || 0;
  }

  /**
   * Returns an iterator over the keys in the map.
   * @returns {IterableIterator<K>} An iterator over the keys in the map.
   */
  keys(): IterableIterator<K> {
    return this.map?.keys() || [].values();
  }

  /**
   * Returns an iterator over the values in the map.
   * @returns {IterableIterator<V>} An iterator over the values in the map.
   */
  values(): IterableIterator<V> {
    return this.map?.values() || [].values();
  }

  /**
   * Returns an iterator over the key-value pairs in the map.
   * @returns {IterableIterator<[K, V]>} An iterator over the key-value pairs in the map.
   */
  entries(): IterableIterator<[K, V]> {
    return this.map?.entries() || [].values();
  }

  /**
   * Executes a provided function once for each key-value pair in the map.
   * @param {(value: V, key: K, map: Map<K, V>) => void} callbackfn - Function to execute for each element.
   */
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void {
    this.map?.forEach(callbackfn);
  }

  /**
   * Returns a shallow copy of the map.
   * @returns {Map<K, V>} A new map instance with the same key-value pairs.
   */
  clone(): Map<K, V> {
    return new Map(this.map);
  }
}
