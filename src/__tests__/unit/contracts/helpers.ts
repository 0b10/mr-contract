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

/* tslint:disable:max-classes-per-file */

import {
  IContractsTable,
  MethodContracts,
  PostconditionError,
  PreconditionError,
} from "../../../contracts";

// >>> CONSTANTS >>>
export const contractErrorMsg = "fake-error-message";

/**
 * Test that the contracts arrays are processed, and behave as excpected.
 * @param param0 - The test data object: { args, contract, contractsType, nullcContractsAfter, nullContractsBefore,
 * result }
 * @param caseNum - an optional integer - typically the index of a forEach loop.
 * @example
 * [
 *  {
 *    args: [true, true], // passed to the contract - 5 max.
 *    contract: ({param0, param4}) => { throw new Error("message"); }, // param0 - 5 are available
 *    contractsType: "precondition",  // or postcondition
 *    nullContractsAfter: 2, // How many "passing" contracts proceeds the above, failing contract
 *    nullContractsBefore: 2, // How many "passing" contracts preceeds the above, failing contract
 *    result: false // controls the test description only. Use true when testing postcondition result
 *  }
 * ].forEach(testContractsArray);
 */
// >>> TEST LOGIC >>>
export const testContractsArray = (
  {
    args,
    contract,
    contractsType,
    nullContractsAfter,
    nullContractsBefore,
    result,
  }: IContractsArrayTestData,
  caseNum?: number,
) => {
  let num: string;
  caseNum !== undefined ? (num = `(#${caseNum}): `) : (num = "");
  describe(`${num}the given contract${args ? `, with ${args.length} args: ` + args : ""}`, () => {
    // +++ test case description logic +++
    // the result bool takes precedence - if result, the ignore args message
    const argsMsg = args ? "conditionally react to the args and" : "";
    const resultMsg = result ? "conditionally react to the result and" : "";
    let conditionalMsg: string = "";
    if (argsMsg || resultMsg) {
      conditionalMsg = resultMsg ? resultMsg : argsMsg;
    }
    const message = `should ${conditionalMsg ? conditionalMsg : ""} throw a ${
      contractsType === "precondition" ? PreconditionError.name : PostconditionError.name
    } error @ contract #${nullContractsBefore + 1}`;

    // +++ make contracts +++
    it(message, () => {
      let pre: ContractsArray;
      let post: ContractsArray;
      if (contractsType === "precondition") {
        pre = makeContractsArray(contract, nullContractsAfter, nullContractsBefore);
        post = [() => undefined];
      } else if (contractsType === "postcondition") {
        pre = [() => undefined];
        post = makeContractsArray(contract, nullContractsAfter, nullContractsBefore);
      } else {
        throw new TypeError(`Invalid contracts type: ${contractsType}`);
      }

      const contractDefinitions = {
        aRandomKey: {
          post,
          pre,
        },
      };

      // +++ determine expected error type +++
      const TestClass = testClassFactory("aRandomKey", contractDefinitions);
      let errorName: string;
      contractsType === "precondition"
        ? (errorName = PreconditionError.name)
        : (errorName = PostconditionError.name);

      // +++ do test +++
      if (args && args.length > 0) {
        // With args
        try {
          new TestClass().testMethod(...args);
          expect("should throw").toBe("didn't throw"); // Didn't throw. Problem.
        } catch (e) {
          expect(e.name).toBe(errorName);
          expect(e.message).toBe(contractErrorMsg);
        }
      } else {
        // Without args
        try {
          new TestClass().testMethod();
          expect("should throw").toBe("didn't throw"); // Didn't throw. Problem.
        } catch (e) {
          expect(e.name).toBe(errorName);
          expect(e.message).toBe(contractErrorMsg);
        }
      }
    });
  });
};

// >>> HELPERS >>>
const makeContractsArray = (
  contract: ContractFunc,
  nullContractsAfter: number,
  nullContractsBefore: number,
): ContractsArray => {
  const length = nullContractsAfter + nullContractsBefore + 1;
  const target = nullContractsBefore; // ! don't do off by one
  return [...Array(length)].map((_, index) => (index === target ? contract : () => undefined));
};

//  >>> FACTORIES >>>
/**
 * Initialise the decorator with injected values. Has sensible defaults.
 * @param func - A reference to the concrete decorator factory (wrapper method).
 * @param target - A target object passed to the concrete decorator factory
 * @param key - A key (func name) passed to the concrete decorator factory
 * @param descriptor - A descriptor object passed to the concrete decorator factory
 * @example decoratorFactory(fn, {}, "", {})()
 * @returns A function that wraps the decorator
 */
export const decoratorFactory = (
  func: (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => {},
  target: object = {},
  key: string = "",
  descriptor: TypedPropertyDescriptor<any> = {},
) => () => func(target, key, descriptor);

/**
 * Make a TestClass whose testMethod() is decorated with the passed in contracts - or with sensible
 *  defaults.
 * @param contractKey - a string that points to a key in the contractsTable.
 * @param contractsTable - an object that  follows the IContracts interface, and contains the
 *  actionable predicates.
 * @returns a TestClass, ready to be instantiated. No constructor args necessary.
 * @example const TestClass = testClassFactory("aKey", contractsTable)
 * @example new TestClass().testMethod(param?)
 */
export const testClassFactory = (
  contractKey: string = "testContractKey",
  contractsTable: IContractsTable = mockContractsTable,
): any => {
  const contracts = methodContractsFactory(contractsTable).factory;
  class TestClass {
    @contracts(contractKey)
    public testMethod(param0: any, param1: any, param2: any, param3: any, param4: any) {
      return param0;
    }
  }
  return TestClass;
};

export const methodContractsFactory = (contractsTable: IContractsTable = mockContractsTable) => {
  return new MethodContracts(contractsTable);
};

export const makeContractsTable = (contractsTable: IContractsTable) => contractsTable;

// >>> MOCKS >>>
const mockContractsTable: IContractsTable = {
  testContractKey: {
    post: [() => undefined],
    pre: [() => undefined],
  },
};

// >>> INTERFACES >>>
interface IContractsArrayTestData {
  args?: any[];
  contract: ContractFunc;
  contractsType: string;
  nullContractsAfter: number;
  nullContractsBefore: number;
  result?: boolean;
}

type ContractFunc = (...args: any[]) => void;
type ContractsArray = Array<(...args: any[]) => void>;
