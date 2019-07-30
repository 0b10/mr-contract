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

import { IContractArgs } from "../../../contracts";
import { contractErrorMsg, testContractsArray } from "./helpers";

describe("Unit Tests: contracts", () => {
  describe("contract execution", () => {
    // >>> BASIC PRE/POSTCONDITIONS >>>
    describe("a list of contracts where some fail unconditionally", () => {
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
          testContractsArray({ ...testData, contractsType }, caseNum);
        });
      });
    });

    // >>> CONTRACT PARAMS >>>
    describe("a list of contracts that accept parameters", () => {
      [
        // 0 - a single arg
        {
          args: [true],
          contract: ({ param0 }: IContractArgs) => {
            if (param0) {
              throw Error(contractErrorMsg);
            }
          },
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 1 - two args
        {
          args: [true, true],
          contract: ({ param0, param1 }: IContractArgs) => {
            if (param0 && param1) {
              throw Error(contractErrorMsg);
            }
          },
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
        // 2 - multiple args
        {
          args: [true, true, true, true, true],
          contract: ({ param0, param1, param2, param3, param4 }: IContractArgs) => {
            if (param0 && param1 && param2 && param3 && param4) {
              throw Error(contractErrorMsg);
            }
          },
          nullContractsAfter: 0,
          nullContractsBefore: 0,
        },
      ].forEach((testData, caseNum: number) => {
        // Do both pre and postconditions
        ["precondition", "postcondition"].forEach((contractsType) => {
          testContractsArray({ ...testData, contractsType }, caseNum);
        });
      });
    });

    // >>> POSTCONDITION RESULT >>>
    describe("a list of postconditions that test the result", () => {
      // ! Note that the decorated, mock method should return the first param - so test result against that.
      [
        // #0 - a single arg
        {
          args: [true], // This is returned as the result by the decorated method
          contract: ({ param0 }: IContractArgs, result: any) => {
            if (result) {
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
          args: [true], // This is returned as the result by the decorated method
          contract: ({ param0 }: IContractArgs, result: any) => {
            if (result) {
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
          args: [true], // This is returned as the result by the decorated method
          contract: ({ param0 }: IContractArgs, result: any) => {
            if (result) {
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
          args: [true], // This is returned as the result by the decorated method
          contract: ({ param0 }: IContractArgs, result: any) => {
            if (result) {
              throw Error(contractErrorMsg);
            }
          },
          contractsType: "postcondition",
          nullContractsAfter: 5,
          nullContractsBefore: 5,
          result: true, // controls the test description only
        },
      ].forEach(testContractsArray);
    });
  });
});
