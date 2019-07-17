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

import { ContractKeyError } from "./error";

export class MethodContracts {
  constructor(private contracts: IContracts) {
    this.factory = this.factory.bind(this);
    this.getArgsObj = this.getArgsObj.bind(this);
    this.getParamNames = this.getParamNames.bind(this);
    this.zip = this.zip.bind(this);
  }

  public factory(contractKey: string) {
    if (!(contractKey in this.contracts)) {
      throw new ContractKeyError(
        `The given contract key does not exist in the contracts object: ${contractKey}`,
      );
    }
    return (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => {
      const wrapped = descriptor.value;

      descriptor.value = (...args: any[]) => {
        const contracts: IContract = this.contracts[contractKey];
        const params = this.getArgsObj(wrapped, args);

        contracts.pre.forEach((contract) => contract(params)); // Pre
        const result = wrapped.apply(this, args);
        contracts.post.forEach((contract) => contract()); // Post

        return result;
      };

      return descriptor;
    };
  }

  private getParamNames(func: () => any): string[] | undefined {
    const match = func.toString().match(/function\s.*?\(([^)]*)\)/);
    return match ? match[1].replace(/ /g, "").split(",") : undefined; // match is null for 0 params
  }

  private zip(paramNames: string[], args: any[]): IParams {
    const params: IParams = {};
    paramNames.forEach((paramName: string, index: number) => {
      params[paramName] = args[index];
    });
    return params;
  }

  private getArgsObj(func: () => any, args: any[]): IParams | undefined {
    const params: string[] | undefined = this.getParamNames(func);
    return params ? this.zip(params, args) : undefined;
  }
}

export interface IContract {
  post: Array<(args?: object) => void>;
  pre: Array<(args?: object) => void>;
}

export interface IContracts {
  [key: string]: IContract;
}

interface IParams {
  [key: string]: any;
}
