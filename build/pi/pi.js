// @ts-check
/**
 * Based on source: https://rosettacode.org/wiki/Pi#TypeScript
 *
 * @export
 * @param {AnyWriteableObject} pipe
 */
export function calcPi(pipe) {
    let q = 1n, r = 0n, t = 1n, k = 1n, n = 3n, l = 3n;
    while (true) {
        if (q * 4n + r - t < n * t) {
            pipe.write(n.toString());
            let nr = (r - n * t) * 10n;
            n = (q * 3n + r) * 10n / t - n * 10n;
            q *= 10n;
            r = nr;
        }
        else {
            let nr = (q * 2n + r) * l;
            let nn = (q * k * 7n + 2n + r * l) / (t * l);
            q *= k;
            t *= l;
            l += 2n;
            k += 1n;
            n = nn;
            r = nr;
        }
    }
}
/**
 * Based on source: https://rosettacode.org/wiki/Pi#Spigot_Algorithm
 *
 * @export
 * @param {AnyWriteableObject} pipe
 */
export function calcPi2(pipe) {
    let q = 1n, r = 180n, t = 60n, i = 2n;
    for (;;) {
        let y = (q * (27n * i - 12n) + 5n * r) / (5n * t);
        let u = 3n * (3n * i + 1n) * (3n * i + 2n);
        r = 10n * u * (q * (5n * i - 2n) + r - y * t);
        q = 10n * q * i * (2n * i - 1n);
        t *= u;
        i += 1n;
        pipe.write(y.toString());
        if (i === 3n) {
            pipe.write('.');
        }
    }
}
//# sourceMappingURL=pi.js.map