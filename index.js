var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("config", [], {
    "defaultSpotIntervalSize": 24,
    "defaultBlur": 0.0,
    "defaultMaximumFractionDigits": 3
});
define("index", ["require", "exports", "config"], function (require, exports, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.flounderStyle = void 0;
    config_json_1 = __importDefault(config_json_1);
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
        flounderStyle.getBlur = function (data) { var _a; return (_a = data.blur) !== null && _a !== void 0 ? _a : config_json_1.default.defaultBlur; };
        flounderStyle.getActualReverseRate = function (data) {
            return "number" === typeof data.reverseRate ? data.reverseRate :
                ("auto" === data.reverseRate && "tri" === flounderStyle.getPatternType(data)) ? triPatternHalfRadiusSpotArea :
                    ("auto" === data.reverseRate && "tetra" === flounderStyle.getPatternType(data)) ? TetraPatternHalfRadiusSpotArea :
                        999;
        };
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
        var makeRadialGradientString = function (data, radius, blur) {
            if (blur === void 0) { blur = Math.min(radius / 0.5, flounderStyle.getBlur(data)) / 0.5; }
            return "radial-gradient(circle at center, ".concat(data.foregroundColor, " ").concat(numberToString(data, radius - blur), "px, transparent ").concat(numberToString(data, radius + blur), "px)");
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
                var MaxRadiusWidth = maxRadius - minRadius;
                var minAreaRate = halfRadiusSpotArea;
                var maxAreaRate = 1.0;
                var maxAreaRateWidth = minAreaRate - maxAreaRate;
                var areaRate = data.depth;
                var areaRateWidth = areaRate - minAreaRate;
                var adjusterForReducePixelCollapseEffect = undefined === data.maxSpotSize ? 0.9 : 0.7;
                radius = minRadius + (MaxRadiusWidth * Math.pow(areaRateWidth / maxAreaRateWidth, 2) * adjusterForReducePixelCollapseEffect);
            }
            if (undefined !== data.maxSpotSize && data.maxSpotSize < radius) {
                spotIntervalSize = spotIntervalSize * data.maxSpotSize / radius;
                radius = data.maxSpotSize;
            }
            return { radius: radius, spotIntervalSize: spotIntervalSize };
        };
        flounderStyle.reverseArguments = function (data) {
            var result = structuredClone(data);
            result.foregroundColor = flounderStyle.getBackgroundColor(data);
            result.backgroundColor = data.foregroundColor;
            result.depth = 1.0 - data.depth;
            delete result.reverseRate;
            return result;
        };
        flounderStyle.makeTriPatternStyleList = function (data) {
            if ("transparent" === data.foregroundColor) {
                throw new Error("foregroundColor must be other than \"transparent\".");
            }
            var plain = flounderStyle.makePlainStyleListOrNull(data);
            if (null !== plain) {
                return plain;
            }
            else if (flounderStyle.getActualReverseRate(data) < data.depth) {
                if ("transparent" === flounderStyle.getBackgroundColor(data)) {
                    throw new Error("When using reverseRate, backgroundColor must be other than \"transparent\".");
                }
                return flounderStyle.makeTriPatternStyleList(flounderStyle.reverseArguments(data));
            }
            else {
                var _a = calculateSize(data, triPatternHalfRadiusSpotArea, 1.0 / root3), radius = _a.radius, spotIntervalSize = _a.spotIntervalSize;
                var radialGradient_1 = makeRadialGradientString(data, radius);
                var backgroundColor = flounderStyle.getBackgroundColor(data);
                var backgroundImage = Array.from({ length: 4 }).map(function (_) { return radialGradient_1; }).join(", ");
                switch (flounderStyle.getLayoutAngle(data)) {
                    case "regular": // horizontal
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: backgroundImage,
                            backgroundSize: "".concat(numberToString(data, spotIntervalSize * 2.0), "px ").concat(numberToString(data, spotIntervalSize * root3), "px"),
                            backgroundPosition: "0px 0px, ".concat(numberToString(data, spotIntervalSize), "px 0px, ").concat(numberToString(data, spotIntervalSize * 0.5), "px ").concat(numberToString(data, spotIntervalSize * root3 * 0.5), "px, ").concat(numberToString(data, spotIntervalSize * 1.5), "px ").concat(numberToString(data, spotIntervalSize * root3 * 0.5), "px")
                        });
                    case "alternative": // vertical
                        return makeResult({
                            backgroundColor: backgroundColor,
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
            if ("transparent" === data.foregroundColor) {
                throw new Error("foregroundColor must be other than \"transparent\".");
            }
            var plain = flounderStyle.makePlainStyleListOrNull(data);
            if (null !== plain) {
                return plain;
            }
            else if (flounderStyle.getActualReverseRate(data) < data.depth) {
                if ("transparent" === flounderStyle.getBackgroundColor(data)) {
                    throw new Error("When using reverseRate, backgroundColor must be other than \"transparent\".");
                }
                return flounderStyle.makeTetraPatternStyleList(flounderStyle.reverseArguments(data));
            }
            else {
                var _a = calculateSize(data, TetraPatternHalfRadiusSpotArea, 0.5 * root2), radius = _a.radius, spotIntervalSize = _a.spotIntervalSize;
                var radialGradient_2 = makeRadialGradientString(data, radius);
                var backgroundColor = flounderStyle.getBackgroundColor(data);
                switch (flounderStyle.getLayoutAngle(data)) {
                    case "regular": // straight
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: radialGradient_2,
                            backgroundSize: "".concat(numberToString(data, spotIntervalSize), "px ").concat(numberToString(data, spotIntervalSize), "px"),
                        });
                    case "alternative": // slant
                        return makeResult({
                            backgroundColor: backgroundColor,
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
});
//# sourceMappingURL=index.js.map