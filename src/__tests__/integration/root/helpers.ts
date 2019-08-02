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

import assert from "assert";
import { contractsFactory, IContractsTable, PostconditionError, PreconditionError } from "../../..";

const { NODE_ENV: ORIGINAL_NODE_ENV } = process.env;
if (ORIGINAL_NODE_ENV !== "test") {
  // Fix me if not - it's not a bit deal, nothing should break. Just make sure the NODE_ENV is being
  //  correctly reset between tests.
  console.warn(`The NODE_ENV isn't set to 'test', this may be an error: ${ORIGINAL_NODE_ENV}`);
}

// >>> TEST LOGIC >>>
export const testPassingContracts = ({
  args,
  disabled = false,
  name,
  method,
}: IPassingContractsTestData) => {
  describe(`the ${name} method, given the args: ${args}`, () => {
    it(`should ${disabled ? "not execute any contracts" : "pass all passable contracts"}`, () => {
      expect(() => {
        method(...args);
      }).not.toThrow();
    });
  });
};

export const testFailingContracts = ({
  args,
  contractsType,
  name,
  method,
}: IFailingContractsTestData) => {
  let errorTypeName: string;

  if (contractsType === "precondition") {
    errorTypeName = PreconditionError.name;
  } else if (contractsType === "postcondition") {
    errorTypeName = PostconditionError.name;
  } else {
    throw new Error(`unknown contract type: ${contractsType}`);
  }

  describe(`the ${name} method, given the args: ${args}`, () => {
    it(`should thow a ${errorTypeName}`, () => {
      try {
        method(...args);
        expect("to throw").toBe("no throw");
      } catch (e) {
        expect(e.name).toBe(errorTypeName);
      }
    });
  });
};

// >>> FACTORIES >>>
export const testClassFactory = (passOrFail: string, nodeEnv?: string, enabledFor?: string[]) => {
  if (nodeEnv) {
    process.env.NODE_ENV = nodeEnv;
  } else {
    // Just make sure the NODE_ENV is what it's supposed to be
    const { NODE_ENV } = process.env;
    assert(
      NODE_ENV === ORIGINAL_NODE_ENV,
      `the NODE_ENV has been modified, and not changed back to '${ORIGINAL_NODE_ENV}': '${NODE_ENV}'`,
    ); // change at your discretion
  }

  let contracts: (contractsKey: string) => any;
  passOrFail === "pass"
    ? (contracts = contractsFactory(passingContractsTable, enabledFor))
    : (contracts = contractsFactory(failingContractsTable, enabledFor));

  class TestClass {
    private executionContextProp: string;
    constructor() {
      this.executionContextProp = "exists";
      this.add = this.add.bind(this);
      this.concat = this.concat.bind(this);
      this.getExecutionContextProp = this.getExecutionContextProp.bind(this);
    }
    @contracts("add")
    public add(num1?: any, num2?: any) {
      return (num1! + num2!) as number;
    }
    @contracts("concat")
    public concat(str1?: any, str2?: any) {
      return (str1! + str2!) as string;
    }
    public getExecutionContextProp() {
      return this.executionContextProp;
    }
  }
  return new TestClass();
};

// >>> MOCKS >>>
const passingContractsTable: IContractsTable = {
  add: {
    post: [
      (result) => assert(typeof result === "number", "result isn't a number"),
      (result, num1, num2) => assert(result === num1 + num2, "result isn't a sum"),
    ],
    pre: [
      (num1) => assert(typeof num1 === "number", "num1 isn't a number"),
      (num2) => assert(typeof num2 === "number", "num2 isn't a number"),
    ],
  },
  concat: {
    post: [
      (result) => assert(typeof result === "string", "result isn't a string"),
      (result, str1, str2) => assert(result === str1 + str2, "result isn't concatenated"),
    ],
    pre: [
      (str1) => assert(typeof str1 === "string", "str1 isn't a string"),
      (str2) => assert(typeof str2 === "string", "str2 isn't a string"),
    ],
  },
};

const failingContractsTable: IContractsTable = {
  // ! fails preconfition
  add: {
    post: [
      (result) => assert(typeof result === "number", "result isn't a number"),
      (result, num1, num2) => assert(result === num1 + num2, "result isn't a sum"),
    ],
    pre: [
      (num1) => assert(typeof num1 === "number", "num1 isn't a number"),
      (num2) => assert(typeof num2 === "string", "num2 isn't a string"),
    ],
  },
  // ! fails postcondition
  concat: {
    post: [
      (result) => assert(typeof result === "string", "result isn't a string"),
      (result, str1, str2) =>
        assert(result === str1 + str2 + "fail", "result isn't concatenated + fail"),
    ],
    pre: [
      (str1) => assert(typeof str1 === "string", "str1 isn't a string"),
      (str2) => assert(typeof str2 === "string", "str2 isn't a string"),
    ],
  },
};

// >>> INTERFACES >>>
interface IPassingContractsTestData {
  args: any[];
  disabled?: boolean;
  name: string;
  method: (...args: any[]) => any;
}

interface IFailingContractsTestData {
  args: any[];
  contractsType: string;
  name: string;
  method: (...args: any[]) => any;
}
