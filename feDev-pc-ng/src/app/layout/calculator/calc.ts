export class Calc {
    parse(content: string) {
        let index = content.lastIndexOf('(');
        if (index > -1) {
            const endIndex = content.indexOf(')', index);
            if (endIndex > -1) {
                const result = this.parse(content.substring(index + 1, endIndex));
                return this.parse(content.substring(0, index) + ('' + result) + content.substring(endIndex + 1));
            }
        }
        let x: string | number;
        let y: string | number;
        index = content.indexOf('+');
        if (index > -1) {
            x = content.substring(0, index);
            y = content.substring(index + 1);
            if (typeof x !== 'number') { x = this.parse(x); }
            if (typeof y !== 'number') { y = this.parse(y); }
            return this.floatAdd(x as number, y as number);
        }
        index = content.lastIndexOf('-');
        if (index > -1) {
            x = content.substring(0, index);
            y = content.substring(index + 1);
            if (typeof x !== 'number') { x = this.parse(x); }
            if (typeof y !== 'number') { y = this.parse(y); }
            return this.floatSub(x as number, y as number);
        }
        index = content.lastIndexOf('×');
        if (index > -1) {
            x = content.substring(0, index);
            y = content.substring(index + 1);
            if (typeof x !== 'number') { x = this.parse(x); }
            if (typeof y !== 'number') { y = this.parse(y); }
            return this.floatMul(x as number, y as number);
        }
        index = content.lastIndexOf('÷');
        if (index > -1) {
            x = content.substring(0, index);
            y = content.substring(index + 1);
            if (typeof x !== 'number') { x = this.parse(x); }
            if (typeof y !== 'number') { y = this.parse(y); }
            return this.floatDiv(x as number, y as number);
        }
        if ('' === content) {
            return 0;
        } else {
            return Number(content);
        }
    }
    floatAdd(arg1: number, arg2: number) {
        let r1: number;
        let r2: number;
        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        const m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    }
    floatSub(arg1: number, arg2: number) {
        let r1: number;
        let r2: number;
        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        const m = Math.pow(10, Math.max(r1, r2));
        const n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }
    floatMul(arg1: number, arg2: number) {
        let m = 0;
        const s1 = arg1.toString();
        const s2 = arg2.toString();
        try {
            m += s1.split('.')[1].length;
        } catch (e) { }
        try {
            m += s2.split('.')[1].length;
        } catch (e) { }
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    }
    floatDiv(arg1: number, arg2: number) {
        let t1 = 0;
        let t2 = 0;
        try {
            t1 = arg1.toString().split('.')[1].length;
        } catch (e) { }
        try {
            t2 = arg2.toString().split('.')[1].length;
        } catch (e) { }
        const r1 = Number(arg1.toString().replace('.', ''));
        const r2 = Number(arg2.toString().replace('.', ''));
        const v = (r1 / r2) * Math.pow(10, t2 - t1);
        return Number(v.toFixed(4));
    }
}
