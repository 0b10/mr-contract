export declare class MethodContracts {
    private contractsTable;
    constructor(contractsTable: IContractsTable);
    factory(contractKey: string): (target: object, key: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
}
export declare class ContractKeyError extends Error {
    constructor(message: string);
}
export declare class PostconditionError extends Error {
    constructor(message?: string);
}
export declare class PreconditionError extends Error {
    constructor(message?: string);
}
/**
 * An object that's passed to each contract. The contents of which are the arguments and values from the
 *  decorated method.
 */
export interface IContractArgs {
    [key: string]: any;
}
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
    pre: Array<(args: IContractArgs | undefined) => void>;
    post: Array<(arg: IContractArgs | undefined, result: any) => void>;
}
/**
 * A lookup table that contains a contracts [IContracts] object for each key.
 * @example { key1: contractsObj1, key2: contractsObj2 }
 */
export interface IContractsTable {
    [key: string]: IContracts;
}
