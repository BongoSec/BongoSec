import { IBongosecError, IBongosecErrorInfo, IBongosecErrorLogOpts } from "../../types";


export default abstract class BongosecError extends Error {
    abstract logOptions: IBongosecErrorLogOpts;
    constructor(public error: Error, info?: IBongosecErrorInfo) {
        super(info?.message || error.message);
        const childrenName = this.constructor.name; // keep the children class name
        Object.setPrototypeOf(this, BongosecError.prototype); // Because we are extending built in class
        this.name = childrenName;
        this.stack = this.error.stack; // keep the stack trace from children
    }
}