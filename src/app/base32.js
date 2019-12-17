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

            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];
            chr4 = input[i++];
            chr5 = input[i++];

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
    },

    decode : function(input) {

        var arr = [];
        var chr1, chr2, chr3, chr4, chr5;
        var enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8;
        var i = 0;

        while (i < input.length) {

            enc1 = input[i++];
            enc2 = input[i++];
            enc3 = input[i++];
            enc4 = input[i++];
            enc5 = input[i++];
            enc6 = input[i++];
            enc7 = input[i++];
            enc8 = input[i++];

            chr1 = (enc1 << 3) | (enc2 >> 2);
            chr2 = ((enc2 & 3) << 6)  | (enc3 << 1) | (enc4 >> 4);
            chr3 = ((enc4 & 15) << 4) | (enc5 >> 1);
            chr4 = ((enc5 & 1) << 7)  | (enc6 << 2) | (enc7 >> 3);
            chr5 = ((enc7 & 7) << 5)  |  enc8;

            if (!isNaN(enc8)) {
                arr.push(chr1, chr2, chr3, chr4, chr5);
            } else {
                if (isNaN(enc3)) {
                    arr.push(chr1);
                } else if (isNaN(enc5)) {
                    arr.push(chr1, chr2);
                } else if (isNaN(enc6)) {
                    arr.push(chr1, chr2, chr3);
                } else {
                    arr.push(chr1, chr2, chr3, chr4);
                }
            }
        }

        return arr;
    }
};
