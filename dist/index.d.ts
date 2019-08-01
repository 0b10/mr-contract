import { IContractsTable, MethodContracts } from "./contracts";
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
export declare const contractsFactory: (contractsTable: IContractsTable) => (contractsKey: string) => any;
export { MethodContracts, IContractsTable };
export { IContracts, ContractKeyError, PostconditionError, PreconditionError } from "./contracts";
