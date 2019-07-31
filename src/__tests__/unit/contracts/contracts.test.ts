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

import { contractErrorMsg, testContractsPass, testContractsThrow } from "./helpers";

describe("Unit Tests: contracts", () => {
  describe("contract execution", () => {
    // >>> PASSING CONTRACTS >>>
    describe(">>> contracts that don't throw", () => {
      ["precondition", "postcondition"].forEach(testContractsPass);
    });

    // >>> BASIC PRE/POSTCONDITIONS >>>
    describe(">>> a list of contracts where some fail unconditionally", () => {
      [
        // 0 - a single contract
        {
          contract: () => {
            throw new Error(contractErrorMsg);
          },
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // #1 - contract second
        {
          contract: () => {
            throw new Error(contractErrorMsg);
          },
          nullContractsAfter: 0,
          nullContractsBefore: 1,
        },
        // #2 - a contract 10th
        {
          contract: () => {
            throw new Error(contractErrorMsg);
          },
          nullContractsAfter: 0,
          nullContractsBefore: 9,
        },
        // #3 - 5 before, 5 after
        {
          contract: () => {
            throw new Error(contractErrorMsg);
          },
          nullContractsAfter: 5,
          nullContractsBefore: 5,
        },
      ].forEach((testData, caseNum: number) => {
        // Do both pre and postconditions
        ["precondition", "postcondition"].forEach((contractsType) => {
          testContractsThrow({ ...testData, contractsType }, caseNum);
        });
      });
    });

    // >>> CONTRACT PARAMS >>>
    // ~~~ Precondition ~~~
    describe(">>> a list of precondition contracts that accept parameters", () => {
      [
        // 0 - a single arg
        {
          args: [true],
          contract: (param0: boolean) => {
            if (param0) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "precondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 1 - two args
        {
          args: [true, true],
          contract: (param0: boolean, param1: boolean) => {
            if (param0 && param1) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "precondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 2 - multiple args
        {
          args: [true, true, true, true, true],
          contract: (...args: boolean[]) => {
            if (args[0] && args[1] && args[2] && args[3] && args[4]) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "precondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 3 - complex args
        {
          args: [
            { aa: { a: true } },
            [true, [false, true], false],
            true,
            { ee: { eee: { e: true, f: false } } },
          ],
          contract: (
            { aa: { a } }: any,
            [b, [_, c]]: [boolean, boolean[]],
            d: boolean,
            {
              ee: {
                eee: { e },
              },
            }: any,
          ) => {
            if (a && b && c && d && e) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "precondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
      ].forEach(testContractsThrow);
    });

    // ~~~ Postcondition ~~~
    describe(">>> a list of contracts that accept parameters", () => {
      [
        // 0 - a single arg
        {
          args: [true],
          contract: (result: any, param0: boolean) => {
            if (param0) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 1 - two args
        {
          args: [true, true],
          contract: (result: any, param0: boolean, param1: boolean) => {
            if (param0 && param1) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 2 - multiple args
        {
          args: [true, true, true, true, true],
          contract: (result: any, ...args: boolean[]) => {
            if (args[0] && args[1] && args[2] && args[3] && args[4]) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 3 - complex args
        {
          args: [
            { aa: { a: true } },
            [true, [false, true], false],
            true,
            { ee: { eee: { e: true, f: false } } },
          ],
          contract: (
            result: any,
            { aa: { a } }: any,
            [b, [_, c]]: [boolean, boolean[]],
            d: boolean,
            {
              ee: {
                eee: { e },
              },
            }: any,
          ) => {
            if (a && b && c && d && e) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
      ].forEach(testContractsThrow);
    });

    // >>> POSTCONDITION RESULT >>>
    describe(">>> a list of postconditions that test the result", () => {
      // ! The first arg is always result as the result for these tests
      [
        // #0 - a single arg
        {
          args: [true],
          contract: (result: boolean, arg0: boolean) => {
            if (result && arg0) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
          result: true, // controls the test description only
        },
        // #1 - second position contract
        {
          args: [true],
          contract: (result: boolean, arg0: boolean) => {
            if (result && arg0) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 1,
          result: true, // controls the test description only
        },
        // #2 - 10th position contract
        {
          args: [true],
          contract: (result: boolean, arg0: boolean) => {
            if (result && arg0) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 9,
          result: true, // controls the test description only
        },
        // #3 - 5 passing contracts either side
        {
          args: [true],
          contract: (result: boolean, arg0: boolean) => {
            if (result && arg0) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 5,
          nullContractsBefore: 5,
          result: true, // controls the test description only
        },
        // #4 - two args
        {
          args: [true, true],
          contract: (result: boolean, arg0: boolean, arg1: boolean) => {
            if (result && arg0 && arg1) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
          result: true, // controls the test description only
        },
        // #5 - object destructuring
        {
          args: [{ result: "result" }],
          contract: ({ result }: any) => {
            if (result === "result") {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
          result: true, // controls the test description only
        },
        // #5 - nested object destructuring
        {
          args: ["param0", { aa: { aaa: { a: "a", b: "b" } }, ccc: { c: "c" } }],
          contract: (
            result: string,
            param0: string,
            {
              aa: {
                aaa: { a, b },
              },
              ccc: { c },
            }: any,
          ) => {
            if (result === "param0" && param0 === "param0" && a === "a" && b === "b" && c === "c") {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
          result: true, // controls the test description only
        },
        // #6 - nested array destructuring
        {
          args: ["param0", [1, 2, 3, [4, 5, 6]], [7, [8, 9]]],
          contract: (
            result: string,
            param0: string,
            [one, two, three, [four, five, six]]: [number, number, number, number[]],
            [seven, [eight, nine]]: [number, number[]],
          ) => {
            if (
              result === "param0" &&
              param0 === "param0" &&
              one === 1 &&
              two === 2 &&
              three === 3 &&
              four === 4 &&
              five === 5 &&
              six === 6 &&
              seven === 7 &&
              eight === 8 &&
              nine === 9
            ) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 0,
          nullContractsBefore: 0,
          result: true, // controls the test description only
        },
      ].forEach(testContractsThrow);
    });
  });
});
