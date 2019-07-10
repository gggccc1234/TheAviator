function Util() {
}

Util.deepClone = function (params) {
    try {
        let copy = JSON.parse(JSON.stringify(params));
        return copy;
    } catch (e) {
        console.error("无法解析params: ", params, '\n', e);
        return null;
    }
}