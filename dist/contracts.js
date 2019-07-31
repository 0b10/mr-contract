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
class MethodContracts {
    constructor(contractsTable) {
        this.contractsTable = contractsTable;
        this.factory = this.factory.bind(this);
    }
    factory(contractKey) {
        if (!(contractKey in this.contractsTable)) {
            throw new ContractKeyError(`The given contract key does not exist in the contracts object: ${contractKey}`);
        }
        return (target, key, descriptor) => {
            const wrappedFunc = descriptor.value;
            descriptor.value = (...args) => {
                const contracts = this.contractsTable[contractKey];
                // const contractArgs = getParams(wrappedFunc, args);
                try {
                    contracts.pre.forEach((contract) => contract(...args));
                }
                catch (e) {
                    throw new PreconditionError(e.message);
                }
                const result = wrappedFunc.apply(this, args);
                try {
                    contracts.post.forEach((contract) => contract(result, ...args));
                }
                catch (e) {
                    throw new PostconditionError(e.message);
                }
                return result;
            };
            return descriptor;
        };
    }
}
exports.MethodContracts = MethodContracts;
// >>> ERRORS >>>
class ContractKeyError extends Error {
    constructor(message) {
        super(message);
        this.name = "ContractKeyError";
    }
}
exports.ContractKeyError = ContractKeyError;
class PostconditionError extends Error {
    constructor(message) {
        super(message);
        this.name = "PostconditionError";
    }
}
exports.PostconditionError = PostconditionError;
class PreconditionError extends Error {
    constructor(message) {
        super(message);
        this.name = "PreconditionError";
    }
}
exports.PreconditionError = PreconditionError;
