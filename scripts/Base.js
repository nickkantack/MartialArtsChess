class Base {

    static baseClassWarn() {
        throw new Error("Abstract method invoked without override.");
    }

}

if (typeof module !== "undefined") {
    module.exports = Base;
}