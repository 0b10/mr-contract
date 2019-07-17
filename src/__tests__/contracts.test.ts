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

import { IContract, IContracts, MethodContracts } from "../contracts";

describe("Unit Tests: contracts", () => {
  // >>> BASE CLASS >>>
  describe("MethodContracts", () => {
    it("should be importable and usable", () => {
      const contracts = methodContractsFactory();
      expect(contracts).toBeDefined();
    });

    // ~~~ Decorator Factory (method) ~~~
    describe("the decorator factory", () => {
      it("should be defined and can be called", () => {
        const contracts = methodContractsFactory();
        expect(contracts.factory).toBeDefined();
        expect(contracts.factory).not.toThrow();
      });

      it("should accept a string argument", () => {
        const contracts = methodContractsFactory().factory;
        class TestClass {
          @contracts("testContractKey")
          public testMethod(param: any) {
            return param;
          }
        }
        expect(new TestClass()).toBeDefined();
      });

      it("should return a function", () => {
        const contracts = methodContractsFactory();
        expect(typeof contracts.factory("testContractKey")).toBe("function");
      });
    });

    // ~~~ Decorator ~~~
    describe("the decorator function", () => {
      it("should return the descriptor passed into the factory", () => {
        const concreteDecFactory = methodContractsFactory().factory("testContractKey");
        const descriptor = {};
        const decorator = decoratorFactory(concreteDecFactory, undefined, undefined, descriptor);
        expect(decorator()).toBe(descriptor);
      });

      it("should return the same value as the decorated method", () => {
        const TestClass = testClassFactory();
        const descriptor = {};
        const mockResult = new TestClass().testMethod(descriptor);
        expect(mockResult).toBe(descriptor);
      });
    });

    // ~~~ Contract ~~~
    describe("the contract decorator", () => {
      [
        [
          () => {
            throw new Error();
          },
        ],
        [
          () => undefined,
          () => {
            throw new Error();
          },
        ],
        [
          () => undefined,
          () => undefined,
          () => undefined,
          () => undefined,
          () => undefined,
          () => undefined,
          () => undefined,
          () => undefined,
          () => undefined,
          () => {
            throw new Error();
          },
        ],
        // +++ parse all preconditions +++
      ].forEach((contractsArray) => {
        it(`should throw for precondition number ${contractsArray.length}`, () => {
          const contractDefinitions = {
            aRandomKey: {
              pre: contractsArray,
            },
          };
          const TestClass = testClassFactory("aRandomKey", contractDefinitions);
          expect(() => {
            new TestClass().testMethod();
          }).toThrow();
        });
      });
    });
  });
});

// >>> HELPERS >>>
// ~~~ Factories ~~~
/**
 * Initialise the decorator with injected values. Has sensible defaults.
 * @param func - A reference to the concrete decorator factory (wrapper method).
 * @param target - A target object passed to the concrete decorator factory
 * @param key - A key (func name) passed to the concrete decorator factory
 * @param descriptor - A descriptor object passed to the concrete decorator factory
 * @example decoratorFactory(fn, {}, "", {})()
 * @returns A function that wraps the decorator
 */
// +++ decorator +++
const decoratorFactory = (
  func: (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => {},
  target: object = {},
  key: string = "",
  descriptor: TypedPropertyDescriptor<any> = {},
) => {
  return () => func(target, key, descriptor);
};

/**
 * Make a TestClass whose testMethod() is decorated with the passed in contracts - or with sensible
 *  defaults.
 * @param contractKey - a string that points to a key in the contractDefinitions.
 * @param contractDefinitions - an object that  follows the IContracts interface, and contains the
 *  actionable predicates.
 * @returns a TestClass, ready to be instantiated. No constructor args necessary.
 * @example const TestClass = testClassFactory("aKey", contractDefinitions)
 * @example new TestClass().testMethod(param?)
 */
// +++ test class +++
const testClassFactory = (
  contractKey: string = "testContractKey",
  contractDefinitions: IContracts = mockContracts,
): any => {
  const contracts = methodContractsFactory(contractDefinitions).factory;
  class TestClass {
    @contracts(contractKey)
    public testMethod(param: any) {
      return param;
    }
  }
  return TestClass;
};

// +++ class +++
const methodContractsFactory = (contracts: IContracts = mockContracts) => {
  return new MethodContracts(contracts);
};

// ~~~ Mocks ~~~
const mockContracts = {
  testContractKey: {
    pre: [() => undefined],
  },
};
