export default class Util {
    static normalize(value, preMinValue, preMaxValue, nextMinValue, nextMaxValue) {
        let nowValue = value;
        nowValue = nowValue > preMaxValue ? preMaxValue : nowValue;
        nowValue = nowValue < preMinValue ? preMinValue : nowValue;
        let preValueRange = preMaxValue - preMinValue;
        let nextValueRange = nextMaxValue - nextMinValue;
        let percent = (nowValue - preMinValue) / preValueRange;
        let nextValue = nextMinValue + (percent * nextValueRange);
        return nextValue;
    }
    static clone(obj) {
        if (!Util.isObj(obj) && !Array.isArray(obj)) {
            console.error("-----------------传入参数不合法----------------", obj);
            console.trace();
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }
    static isObj(obj) {
        return Object.prototype.toString.call(obj).indexOf("Object") != -1;
    }
    static isEmpty(value) {
        if (value === undefined || value === null || isNaN(value)) {
            return true;
        }
        return false;
    }
    static rand(min, max) {
        if (Util.isEmpty(min)) {
            return Math.random();
        }
        if (Util.isEmpty(max)) {
            return min * Math.random();
        } else {
            return min + Math.random() * (max - min);
        }
    }
}