const btoa = require('btoa');

export class Encoder {

    static encodeBase64(str: any) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            // function toSolidBytes(match, p1) {
            (match, p1) => {
                // console.debug('match: ' + match);
                return String.fromCharCode(("0x" + p1) as any);
            }));
    }



}
