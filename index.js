"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flounderStyle = void 0;
var config_json_1 = __importDefault(require("./config.json"));
var flounderStyle;
(function (flounderStyle) {
    flounderStyle.setStyle = function (element, style) {
        var current = element.style.getPropertyValue(style.key.dom);
        if (current !== style.value) // for DOM rendering performance
         {
            if (undefined !== style.value) {
                element.style[style.key.dom] = style.value;
            }
            else {
                element.style.removeProperty(style.key.dom);
            }
        }
    };
    flounderStyle.setStyleList = function (element, styleList) {
        styleList.forEach(function (i) { return flounderStyle.setStyle(element, i); });
        return element;
    };
    flounderStyle.styleToString = function (style) { var _a; return "".concat(style.key.css, ": ").concat((_a = style.value) !== null && _a !== void 0 ? _a : "inherit", ";"); };
    flounderStyle.styleListToString = function (styleList, separator) {
        if (separator === void 0) { separator = " "; }
        return styleList.filter(function (i) { return undefined !== i.value; }).map(function (i) { return flounderStyle.styleToString(i); }).join(separator);
    };
    flounderStyle.getPatternType = function (data) { var _a; return (_a = data.type) !== null && _a !== void 0 ? _a : "tri"; };
    flounderStyle.getLayoutAngle = function (data) { var _a; return (_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular"; };
    flounderStyle.getBackgroundColor = function (data) { var _a; return (_a = data.backgroundColor) !== null && _a !== void 0 ? _a : "transparent"; };
    var numberToString = function (data, value) { var _a; return value.toLocaleString("en-US", { maximumFractionDigits: (_a = data.maximumFractionDigits) !== null && _a !== void 0 ? _a : config_json_1.default.defaultMaximumFractionDigits, }); };
    var makeResult = function (_a) {
        var _b = _a.backgroundColor, backgroundColor = _b === void 0 ? undefined : _b, _c = _a.backgroundImage, backgroundImage = _c === void 0 ? undefined : _c, _d = _a.backgroundSize, backgroundSize = _d === void 0 ? undefined : _d, _e = _a.backgroundPosition, backgroundPosition = _e === void 0 ? undefined : _e;
        return [
            { key: { css: "background-color", dom: "backgroundColor", }, value: backgroundColor, },
            { key: { css: "background-image", dom: "backgroundImage", }, value: backgroundImage, },
            { key: { css: "background-size", dom: "backgroundSize", }, value: backgroundSize, },
            { key: { css: "background-position", dom: "backgroundPosition", }, value: backgroundPosition, },
        ];
    };
    flounderStyle.makePatternStyleList = function (data) {
        switch (flounderStyle.getPatternType(data)) {
            case "tri":
                return flounderStyle.makeTriPatternStyleList(data);
            case "tetra":
                return flounderStyle.makeTetraPatternStyleList(data);
            default:
                throw new Error("Unknown FlounderType: ".concat(data.type));
        }
    };
    var makeRadialGradientString = function (data, radius) {
        return "radial-gradient(circle at center, ".concat(data.foregroundColor, " ").concat(radius, ", ").concat(flounderStyle.getBackgroundColor(data), " ").concat(radius, ")");
    };
    var root2 = Math.sqrt(2.0);
    var root3 = Math.sqrt(3.0);
    var triPatternHalfRadiusSpotArea = Math.PI / (2 * root3);
    var TetraPatternHalfRadiusSpotArea = Math.PI / 4;
    flounderStyle.makePlainStyleListOrNull = function (data) {
        var _a;
        if (data.depth <= 0.0) {
            return makeResult({ backgroundColor: (_a = data.backgroundColor) !== null && _a !== void 0 ? _a : "transparent" });
        }
        else if (1.0 <= data.depth) {
            return makeResult({ backgroundColor: data.foregroundColor });
        }
        else {
            return null;
        }
    };
    var calculateSize = function (data, halfRadiusSpotArea, maxRadiusRate) {
        var _a;
        var radius;
        var spotIntervalSize = (_a = data.spotIntervalSize) !== null && _a !== void 0 ? _a : config_json_1.default.defaultSpotIntervalSize;
        if (data.depth <= halfRadiusSpotArea) {
            radius = Math.sqrt(data.depth / halfRadiusSpotArea) * (spotIntervalSize * 0.5);
        }
        else {
            var minRadius = spotIntervalSize * 0.5;
            var maxRadius = spotIntervalSize * maxRadiusRate;
            var radiusMaxWidth = maxRadius - minRadius;
            var minRate = Math.sqrt(halfRadiusSpotArea);
            var maxRate = 1.0;
            var rateMaxWidth = maxRate - minRate;
            var rate = Math.sqrt(data.depth);
            var rateWidth = rate - minRate;
            radius = minRadius + (radiusMaxWidth * (rateWidth / rateMaxWidth));
        }
        if (undefined !== data.maxSpotSize && data.maxSpotSize < radius) {
            spotIntervalSize = spotIntervalSize * (data.maxSpotSize / radius);
            radius = data.maxSpotSize;
        }
        return { radius: radius, spotIntervalSize: spotIntervalSize };
    };
    flounderStyle.makeTriPatternStyleList = function (data) {
        var plain = flounderStyle.makePlainStyleListOrNull(data);
        if (null !== plain) {
            return plain;
        }
        else {
            var _a = calculateSize(data, triPatternHalfRadiusSpotArea, 1.0 / root3), radius = _a.radius, spotIntervalSize = _a.spotIntervalSize;
            var radialGradient_1 = makeRadialGradientString(data, "".concat(numberToString(data, radius), "px"));
            var backgroundImage = Array.from({ length: 4 }).map(function (_) { return radialGradient_1; }).join(", ");
            switch (flounderStyle.getLayoutAngle(data)) {
                case "regular": // horizontal
                    return makeResult({
                        backgroundImage: backgroundImage,
                        backgroundSize: "".concat(numberToString(data, spotIntervalSize * 2.0), "px ").concat(numberToString(data, spotIntervalSize * root3), "px"),
                        backgroundPosition: "0px 0px, ".concat(numberToString(data, spotIntervalSize), "px 0px, ").concat(numberToString(data, spotIntervalSize * 0.5), "px ").concat(numberToString(data, spotIntervalSize * root3 * 0.5), "px, ").concat(numberToString(data, spotIntervalSize * 1.5), "px ").concat(numberToString(data, spotIntervalSize * root3 * 0.5), "px")
                    });
                case "alternative": // vertical
                    return makeResult({
                        backgroundImage: backgroundImage,
                        backgroundSize: " ".concat(numberToString(data, spotIntervalSize * root3), "px ").concat(numberToString(data, spotIntervalSize * 2.0), "px"),
                        backgroundPosition: "0px 0px, 0px ".concat(numberToString(data, spotIntervalSize), "px, ").concat(numberToString(data, spotIntervalSize * root3 * 0.5), "px ").concat(numberToString(data, spotIntervalSize * 0.5), "px, ").concat(numberToString(data, spotIntervalSize * root3 * 0.5), "px ").concat(numberToString(data, spotIntervalSize * 1.5), "px")
                    });
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }
    };
    flounderStyle.makeTetraPatternStyleList = function (data) {
        var plain = flounderStyle.makePlainStyleListOrNull(data);
        if (null !== plain) {
            return plain;
        }
        else {
            var _a = calculateSize(data, TetraPatternHalfRadiusSpotArea, 0.5 * root2), radius = _a.radius, spotIntervalSize = _a.spotIntervalSize;
            var radialGradient_2 = makeRadialGradientString(data, "".concat(numberToString(data, radius), "px"));
            switch (flounderStyle.getLayoutAngle(data)) {
                case "regular": // straight
                    return makeResult({
                        backgroundImage: radialGradient_2,
                        backgroundSize: "".concat(numberToString(data, spotIntervalSize), "px ").concat(numberToString(data, spotIntervalSize), "px"),
                    });
                case "alternative": // slant
                    return makeResult({
                        backgroundImage: Array.from({ length: 2 }).map(function (_) { return radialGradient_2; }).join(", "),
                        backgroundSize: "".concat(numberToString(data, (spotIntervalSize * 2.0) / root2), "px ").concat(numberToString(data, (spotIntervalSize * 2.0) / root2), "px"),
                        backgroundPosition: "0px 0px, ".concat(numberToString(data, spotIntervalSize / root2), "px ").concat(numberToString(data, spotIntervalSize / root2), "px")
                    });
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }
    };
})(flounderStyle || (exports.flounderStyle = flounderStyle = {}));
//# sourceMappingURL=index.js.map