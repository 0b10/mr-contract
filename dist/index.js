"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("./contracts");
exports.MethodContracts = contracts_1.MethodContracts;
/**
 * A factory that initialises a contracts table, and returns a decorator factory. Use the decorator factory
 *  to wrap a method,  while passing in a contract key to execute the desired contracts.
 *
 * The final product can be exported from a module, if you wish to have a global contracts table, or per
 *  module, if you wish to namespace it per module.
 *
 * @param contractsTable - A table that contains all contracts, each set contained within it's related key.
 * @example
 * const contracts = contractsFactory(
 *  {
 *    myContractKey: {
 *      pre: [(...args) => "contract"],
 *      post: [(...args) => "contract"]
 *    },
 *    anotherContractKey: {
 *      pre: [(...args) => "contract", (...args) => "contract"],
 *      post: [(...args) => "contract"]
 *    }
 *  }
 * )
 *
 * //...
 *
 * -at-contracts("myContractKey")
 * myMethod(foo, bar, baz) {
 *  // code
 * };
 */
exports.contractsFactory = (contractsTable) => {
    const contracts = new contracts_1.MethodContracts(contractsTable);
    return contracts.factory;
};
var contracts_2 = require("./contracts");
exports.ContractKeyError = contracts_2.ContractKeyError;
exports.PostconditionError = contracts_2.PostconditionError;
exports.PreconditionError = contracts_2.PreconditionError;
