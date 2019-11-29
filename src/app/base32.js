/*
 * Modified Base32 encoding without padding.
 */
var Base32 = {

    encode : function(input) {

        var arr = [];
        var chr1, chr2, chr3, chr4, chr5;
        var enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8;
        var i = 0;

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            chr4 = input.charCodeAt(i++);
            chr5 = input.charCodeAt(i++);

            enc1 = chr1 >> 3;
            enc2 = ((chr1 & 7) << 2)  | (chr2 >> 6);
            enc3 = ((chr2 >> 1) & 31);
            enc4 = ((chr2 & 1) << 4)  | (chr3 >> 4);
            enc5 = ((chr3 & 15) << 1) | (chr4 >> 7);
            enc6 = ((chr4 >> 2) & 31);
            enc7 = ((chr4 & 3) << 3)  | (chr5 >> 5);
            enc8 = chr5 & 31;

            if (!isNaN(chr5)) {
                arr.push(enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8);
            } else {
                if (isNaN(chr2)) {
                    arr.push(enc1, enc2);
                } else if (isNaN(chr3)) {
                    arr.push(enc1, enc2, enc3, enc4);
                } else if (isNaN(chr4)) {
                    arr.push(enc1, enc2, enc3, enc4, enc5);
                } else if (isNaN(chr5)) {
                    arr.push(enc1, enc2, enc3, enc4, enc5, enc6, enc7);
                }
            }
        }

        return arr;
    }
};
