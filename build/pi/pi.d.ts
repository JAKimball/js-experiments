declare type AnyWriteableObject = {
    write: ((textToOutput: string) => any);
};
/**
 * Based on source: https://rosettacode.org/wiki/Pi#TypeScript
 *
 * @export
 * @param {AnyWriteableObject} pipe
 */
export declare function calcPi(pipe: AnyWriteableObject): void;
/**
 * Based on source: https://rosettacode.org/wiki/Pi#Spigot_Algorithm
 *
 * @export
 * @param {AnyWriteableObject} pipe
 */
export declare function calcPi2(pipe: AnyWriteableObject): void;
export {};
