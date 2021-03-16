/****************************************************************************** */
declare function makeBox(): {
    eval: (str: string) => any;
};
declare const _default: {
    org: Uint8Array;
    dst: Uint8Array;
    src64: Float64Array;
    dst64: Float64Array;
    makeBox: typeof makeBox;
    makeEs6Box: () => {
        eval: (str: string) => any;
        getDogState: () => string;
    };
};
export default _default;
