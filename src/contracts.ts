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

export class MethodContracts implements IContractsClass {
  constructor(private contractsTable: IContractsTable) {
    this.factory = this.factory.bind(this);
  }

  public factory(contractKey: string) {
    if (!(contractKey in this.contractsTable)) {
      throw new ContractKeyError(
        `The given contract key does not exist in the contracts object: ${contractKey}`,
      );
    }
    return (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => {
      const wrappedFunc = descriptor.value;
      const contractsTable = this.contractsTable; // Cannot reference this inside descriptor value.

      // ! Use func expression to preserve exectution context to that of the descriptor.
      descriptor.value = function(...args: any[]) {
        const contracts: IContracts = contractsTable[contractKey];
        // const contractArgs = getParams(wrappedFunc, args);

        try {
          contracts.pre.forEach((contract) => contract(...args));
        } catch (e) {
          throw new PreconditionError(e.message);
        }
        const result = wrappedFunc.apply(this, args);
        try {
          contracts.post.forEach((contract) => contract(result, ...args));
        } catch (e) {
          throw new PostconditionError(e.message);
        }
        return result;
      };
      return descriptor;
    };
  }
}

export class NullMethodContracts implements IContractsClass {
  // tslint:disable:no-empty
  public factory(contractKey: string) {
    return (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => {};
  }
  // tslint:enable:no-empty
}

// >>> ERRORS >>>
export class ContractKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContractKeyError";
  }
}

export class PostconditionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PostconditionError";
  }
}

export class PreconditionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PreconditionError";
  }
}

// >>> INTERFACES >>>
/**
 * The contracts - with pre and post keys each containing an array of callbacks, where each executes
 *  one or more predicates.
 * @example
 * {
 *  pre: [({param1, param2}) => undefined]
 *  post: [({param1, param2}, result) => undefined]
 * }
 */
export interface IContracts {
  pre: Array<(...args: any[]) => void>;
  post: Array<(result: any, ...args: any[]) => void>;
}

/**
 * A lookup table that contains a contracts [IContracts] object for each key.
 * @example { key1: contractsObj1, key2: contractsObj2 }
 */
export interface IContractsTable {
  [key: string]: IContracts;
}

export interface IContractsClass {
  factory: (
    contractsKey: string,
  ) => (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => any;
}
