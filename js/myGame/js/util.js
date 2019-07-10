function Util() {
}

Util.normalize = function (value, preMinValue, preMaxValue, nextMinValue, nextMaxValue) {
    let nowValue = value;
    nowValue = nowValue > preMaxValue ? preMaxValue : nowValue;
    nowValue = nowValue < preMinValue ? preMinValue : nowValue;
    let preValueRange = preMaxValue - preMinValue;
    let nextValueRange = nextMaxValue - nextMinValue;
    let percent = (nowValue - preMinValue) / preValueRange;
    let nextValue = nextMinValue + (percent * nextValueRange);
    return nextValue;
}

Util.clone = function (obj) {
    if (!Util.isObj(obj) && !Array.isArray(obj)) {
        console.error("-----------------传入参数不合法----------------", obj);
        console.trace();
        return obj;
    }
    return JSON.parse(JSON.stringify(obj));
}

Util.isObj = function (obj) {
    return Object.prototype.toString.call(obj).indexOf("Object") != -1;
}

Util.isEmpty = function (value) {
    if (value === undefined || value === null || isNaN(value)) {
        return true;
    }
    return false;
}

Util.rand = function (min, max) {
    if (Util.isEmpty(min)) {
        return Math.random();
    }
    if (Util.isEmpty(max)) {
        return min * Math.random();
    } else {
        return min + Math.random() * (max - min);
    }
}