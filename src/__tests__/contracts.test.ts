//
// MIT License
//
// Copyright (c) 2019 0b10
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
//
import { MethodContracts } from "../contracts";

describe("Unit Tests: contracts", () => {
  describe("MethodContracts", () => {
    it("should be importable and usable", () => {
      const contracts = new MethodContracts();
      expect(contracts).toBeDefined();
    });

    it("should have a defined decorator factory method that can be called", () => {
      const contracts = new MethodContracts();
      expect(contracts.factory).toBeDefined();
      expect(contracts.factory).not.toThrow();
    });

    it("should return a function from the decorator factory", () => {
      const contracts = new MethodContracts();
      expect(typeof contracts.factory()).toBe("function");
    });

    it("should return the descriptor", () => {
      const concreteDecFactory = new MethodContracts().factory();
      const descriptor = {};
      const decorator = decoratorFactory(concreteDecFactory, undefined, undefined, descriptor);
      expect(decorator()).toBe(descriptor);
    });
  });
});

/**
 * Initialise the decorator with injected values. Has sensible defaults.
 * @param {function} func - A reference to the concrete decorator factory (wrapper method).
 * @param {Object} target - A target object passed to the concrete decorator factory
 * @param {string} key - A key (func name) passed to the concrete decorator factory
 * @param {TypedPropertyDescriptor} descriptor  - A descriptor object passed to the concrete decorator factory
 */
const decoratorFactory = (
  func: (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => {},
  target: object = {},
  key: string = "",
  descriptor: TypedPropertyDescriptor<any> = {},
) => {
  return () => func(target, key, descriptor);
};
