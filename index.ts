import config from "./config.json";
export module flounderStyle
{
    export type StyleKey = string;
    export type StyleValue = string | undefined;
    export type StyleProperty = { key: StyleKey; value: StyleValue; };
    export type Style = { [key: StyleKey]: StyleValue };
    export const styleToStylePropertyList = (style: Style): StyleProperty[] =>
        Object.keys(style).map(key => ({ key, value: style[key], }));
    export const setStyleProperty = (element: HTMLElement, style: StyleProperty) =>
    {
        const current = element.style.getPropertyValue(style.key);
        if (current !== style.value) // for DOM rendering performance
        {
            if (undefined !== style.value)
            {
                element.style.setProperty(style.key, style.value);
            }
            else
            {
                element.style.removeProperty(style.key);
            }
        }
        return element;
    };
    export const makeSureStyle = (styleOrArguments: Style | Arguments): Style =>
        isArguments(styleOrArguments) ? makeStyle(styleOrArguments): styleOrArguments;
    export const setStyle = (element: HTMLElement, styleOrArguments: Style | Arguments) =>
    {
        styleToStylePropertyList(makeSureStyle(styleOrArguments)).forEach(i => setStyleProperty(element, i));
        return element;
    }
    export const stylePropertyToString = (style: StyleProperty) => `${style.key}: ${style.value ?? "inherit"};`;
    export const styleToString = (styleOrArguments: Style | Arguments, separator: string = " ") =>
        styleToStylePropertyList(makeSureStyle(styleOrArguments))
            .filter(i => undefined !== i.value)
            .map(i => stylePropertyToString(i))
            .join(separator);
    export type FlounderType = Arguments["type"];
    export type Color = string; // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
    export type LayoutAngle = "regular" | "alternative";
    export type Real = number;
    export type Rate = Real;
    export type SignedRate = Real;
    export type Pixel = Real;
    export type Integer = number;
    export type Count = Integer;
    export interface ArgumentsBase
    {
        type: FlounderType;
        layoutAngle?: LayoutAngle | SignedRate;
        foregroundColor: Color;
        backgroundColor?: Color;
        intervalSize?: Pixel;
        depth: Rate;
        blur?: Pixel;
        maxPatternSize?: Pixel;
        reverseRate?: SignedRate | "auto" | "-auto";
        anglePerDepth?: SignedRate | "auto" | "-auto";
        maximumFractionDigits?: Count;
    }
    export interface SpotArguments extends ArgumentsBase
    {
        type: "trispot" | "tetraspot";
        layoutAngle?: LayoutAngle | 0;
        anglePerDepth?: never | 0;
    }
    export interface LineArguments extends ArgumentsBase
    {
        type: "stripe" | "diline" | "triline";
    }
    export type Arguments = SpotArguments | LineArguments;
    export const isArguments = (value: unknown): value is Arguments =>
        null !== value &&
        "object" === typeof value &&
        "type" in value && "string" === typeof value.type &&
        "foregroundColor" in value && "string" === typeof value.foregroundColor &&
        "depth" in value && "number" === typeof value.depth;
    export const getPatternType = (data: Arguments): FlounderType => data.type ?? "trispot";
    export const getLayoutAngle = (data: Arguments) =>
    {
        if ("number" === typeof data.layoutAngle)
        {
            if (0 === data.layoutAngle)
            {
                return "regular";
            }
            else
            {
                throw new Error(`When using ${data.type}, number cannot be used for layoutAngle.`);
            }
        }
        if (undefined !== data.anglePerDepth && null !== data.anglePerDepth && 0 !== data.anglePerDepth)
        {
            throw new Error(`anglePerDepth cannot be used when using ${data.type}.`);
        }
        return data.layoutAngle ?? "regular"
    };
    export const getActualLayoutAngle = (data: Arguments): number =>
        "number" === typeof data.layoutAngle ? data.layoutAngle:
        "regular" === (data.layoutAngle ?? "regular") ? 0.0:
        "stripe" === data.type ? 0.25:
        "diline" === data.type ? 0.125:
        "triline" === data.type ? 0.25:
        0.5;
    export const getActualAnglePerDepth = (data: Arguments): number =>
        "number" === typeof data.anglePerDepth ? data.anglePerDepth:
        ("auto" === data.anglePerDepth && "stripe" === getPatternType(data)) ? (1.0 / 2.0):
        ("auto" === data.anglePerDepth && "diline" === getPatternType(data)) ? (1.0 / 4.0):
        ("auto" === data.anglePerDepth && "triline" === getPatternType(data)) ? (1.0 / 6.0):
        "auto" === data.anglePerDepth ? 1.0: 0.0;
    export const getAngleOffsetByDepth = (data: Arguments): number =>
        getActualAnglePerDepth(data) *data.depth;
    export const getAngleOffset = (data: Arguments): number =>
        getActualLayoutAngle(data) +getAngleOffsetByDepth(data);
    export const getBackgroundColor = (data: Arguments): Color => data.backgroundColor ?? "transparent";
    export const getIntervalSize = (data: Arguments) =>
        data.intervalSize ?? config.defaultSpotIntervalSize;
    export const getBlur = (data: Arguments): number => data.blur ?? config.defaultBlur;
    export const getActualReverseRate = (data: Arguments): number =>
        "number" === typeof data.reverseRate ? data.reverseRate:
        ("auto" === data.reverseRate && "trispot" === getPatternType(data)) ? triPatternHalfRadiusSpotArea:
        ("auto" === data.reverseRate && "tetraspot" === getPatternType(data)) ? TetraPatternHalfRadiusSpotArea:
        ("auto" === data.reverseRate && "stripe" === getPatternType(data)) ? 0.0:
        ("auto" === data.reverseRate && "diline" === getPatternType(data)) ? 0.0:
        ("auto" === data.reverseRate && "triline" === getPatternType(data)) ? 0.0:
        999;
    export const getAbsoulteReverseRate = (data: Arguments): undefined | number | "auto" =>
        "number" === typeof data.reverseRate && data.reverseRate < 0.0 ? Math.abs(data.reverseRate):
        "-auto" === data.reverseRate ? "auto":
        data.reverseRate;
    const numberToString = (data: Arguments, value: number) =>
        value.toLocaleString("en-US", { maximumFractionDigits: data.maximumFractionDigits ?? config.defaultMaximumFractionDigits, });
    const makeResult = ({ backgroundColor = undefined as StyleValue, backgroundImage = undefined as StyleValue, backgroundSize = undefined as StyleValue, backgroundPosition = undefined as StyleValue}): Style =>
    ({
        "background-color": backgroundColor,
        "background-image": backgroundImage,
        "background-size":backgroundSize,
        "background-position": backgroundPosition,
    });
    export const makeStyle = (data: Arguments): Style =>
    {
        switch(getPatternType(data))
        {
        case "trispot":
            return makeTrispotStyle(data);
        case "tetraspot":
            return makeTetraspotStyle(data);
        case "stripe":
            return makeStripeStyle(data);
        case "diline":
            return makeDilineStyle(data);
        case "triline":
            return makeTrilineStyle(data);
        default:
            throw new Error(`Unknown FlounderType: ${data.type}`);
        }
    };
    const makeRadialGradientString = (data: Arguments, radius: number, blur = Math.min(radius, getBlur(data)) /0.5) =>
        `radial-gradient(circle at center, ${data.foregroundColor} ${numberToString(data, radius -blur)}px, transparent ${numberToString(data, radius +blur)}px)`;
    const makeLinearGradientString = (data: Arguments, radius: number, intervalSize: number, angle: number, blur = Math.min(intervalSize -radius, radius, getBlur(data)) /0.5) =>
    {
        const deg = numberToString(data, 360.0 *(angle %1.0));
        const patternStart = numberToString(data, 0);
        const a = numberToString(data, Math.max(0, radius -blur));
        const b = numberToString(data, Math.min(intervalSize *0.5, radius +blur));
        const c = numberToString(data, Math.max(intervalSize *0.5, intervalSize -radius -blur));
        const d = numberToString(data, Math.min(intervalSize, intervalSize -radius +blur));
        const patternEnd = numberToString(data, intervalSize);
        return `repeating-linear-gradient(${deg}deg, ${data.foregroundColor} calc(${patternStart}px + 50%), ${data.foregroundColor} calc(${a}px + 50%), transparent calc(${b}px + 50%), transparent calc(${c}px + 50%), ${data.foregroundColor} calc(${d}px + 50%), ${data.foregroundColor} calc(${patternEnd}px + 50%))`;
    }
    const root2 = Math.sqrt(2.0);
    const root3 = Math.sqrt(3.0);
    const triPatternHalfRadiusSpotArea = Math.PI / (2 *root3);
    const TetraPatternHalfRadiusSpotArea = Math.PI / 4;
    export const makePlainStyleOrNull = (data: Arguments): Style | null =>
    {
        if (data.depth <= 0.0)
        {
            return makeResult({ backgroundColor: data.backgroundColor ?? "transparent" });
        }
        else
        if (1.0 <= data.depth)
        {
            return makeResult({ backgroundColor: data.foregroundColor });
        }
        else
        {
            return null;
        }
    };
    const calculateMaxPatternSize = (data: Arguments, intervalSize: number, radius: number) =>
    {
        if (undefined !== data.maxPatternSize && data.maxPatternSize < radius)
        {
            intervalSize = intervalSize *data.maxPatternSize /radius;
            radius = data.maxPatternSize;
        }
        return { intervalSize, radius, };
    };
    const calculateSpotSize = (data: Arguments, halfRadiusSpotArea: number, maxRadiusRate: number) =>
    {
        let radius: number;
        const intervalSize = getIntervalSize(data);
        if (data.depth <= halfRadiusSpotArea)
        {
            radius = Math.sqrt(data.depth / halfRadiusSpotArea) *(intervalSize *0.5);
        }
        else
        {
            const minRadius = intervalSize *0.5;
            const maxRadius = intervalSize *maxRadiusRate;
            const MaxRadiusWidth = maxRadius -minRadius;
            const minAreaRate = 1.0 -Math.sqrt(1.0 -halfRadiusSpotArea);
            const maxAreaRate = 1.0;
            const maxAreaRateWidth = minAreaRate -maxAreaRate;
            const areaRate = 1.0 -Math.sqrt(1.0 -data.depth);
            const areaRateWidth = areaRate -minAreaRate;
            radius = minRadius +(MaxRadiusWidth *Math.pow(areaRateWidth / maxAreaRateWidth, 2));
        }
        return calculateMaxPatternSize(data, intervalSize, radius);
    };
    export const reverseArguments = (data: Arguments): Arguments =>
    {
        const result = structuredClone(data);
        result.foregroundColor = getBackgroundColor(data);
        result.backgroundColor = data.foregroundColor;
        result.depth = 1.0 -data.depth;
        delete result.reverseRate;
        return result;
    };
    const makeStyleCommon = (data: Arguments, maker: (data: Arguments) => Style): Style =>
    {
        if ("transparent" === data.foregroundColor)
        {
            throw new Error(`foregroundColor must be other than "transparent".`);
        }
        const plain = makePlainStyleOrNull(data);
        if (null !== plain)
        {
            return plain;
        }
        const reverseRate = getAbsoulteReverseRate(data);
        if (reverseRate !== data.reverseRate)
        {
            if ("transparent" === getBackgroundColor(data))
            {
                throw new Error(`When using reverseRate, backgroundColor must be other than "transparent".`);
            }
            const absoulteData = reverseArguments(data);
            absoulteData.reverseRate = reverseRate;
            return maker(absoulteData);
        }
        else
        if (getActualReverseRate(data) < data.depth)
        {
            if ("transparent" === getBackgroundColor(data))
            {
                throw new Error(`When using reverseRate, backgroundColor must be other than "transparent".`);
            }
            return maker(reverseArguments(data));
        }
        else
        {
            return maker(data);
        }
    }
    export const makeTrispotStyle = (data: Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const { intervalSize, radius, } = calculateSpotSize(data, triPatternHalfRadiusSpotArea, 1.0 /root3);
            const radialGradient = makeRadialGradientString(data, radius);
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const backgroundImage: StyleValue = Array.from({ length: 4 }).map(_ => radialGradient).join(", ");
            switch(getLayoutAngle(data))
            {
            case "regular": // horizontal
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage,
                    backgroundSize: `${numberToString(data, intervalSize *2.0)}px ${numberToString(data, intervalSize *root3)}px`,
                    backgroundPosition: `calc(0px + 50%) calc(0px + 50%), calc(${numberToString(data, intervalSize)}px + 50%) calc(0px + 50%), calc(${numberToString(data, intervalSize *0.5)}px + 50%) calc(${numberToString(data, intervalSize *root3 *0.5)}px + 50%), calc(${numberToString(data, intervalSize *1.5)}px + 50%) calc(${numberToString(data, intervalSize * root3 * 0.5)}px + 50%)`
                });
            case "alternative": // vertical
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage,
                    backgroundSize: ` ${numberToString(data, intervalSize *root3)}px ${numberToString(data, intervalSize *2.0)}px`,
                    backgroundPosition: `calc(0px + 50%) calc(0px + 50%), calc(0px + 50%) calc(${numberToString(data, intervalSize)}px + 50%), calc(${numberToString(data, intervalSize *root3 *0.5)}px + 50%) calc(${numberToString(data, intervalSize *0.5)}px + 50%), calc(${numberToString(data, intervalSize *root3 *0.5)}px + 50%) calc(${numberToString(data, intervalSize *1.5)}px + 50%)`
                });
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    );
    export const makeTetraspotStyle = (data: Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const { intervalSize, radius, } = calculateSpotSize(data, TetraPatternHalfRadiusSpotArea, 0.5 *root2);
            const radialGradient = makeRadialGradientString(data, radius);
            const backgroundColor: StyleValue = getBackgroundColor(data);
            switch(getLayoutAngle(data))
            {
            case "regular": // straight
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage: radialGradient,
                    backgroundSize: `${numberToString(data, intervalSize)}px ${numberToString(data, intervalSize)}px`,
                    backgroundPosition: `calc(0px + 50%) calc(0px + 50%)`
                });
            case "alternative": // slant
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage: Array.from({ length: 2 }).map(_ => radialGradient).join(", "),
                    backgroundSize: `${numberToString(data, (intervalSize *2.0) /root2)}px ${numberToString(data, (intervalSize *2.0) /root2)}px`,
                    backgroundPosition: `calc(0px + 50%) calc(0px + 50%), calc(${numberToString(data, intervalSize /root2)}px + 50%) calc(${numberToString(data, intervalSize /root2)}px + 50%)`
                });
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    );
    export const makeStripeStyle = (data: Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const angleOffset = getAngleOffset(data);
            const { intervalSize, radius, } = calculateMaxPatternSize
            (
                data,
                getIntervalSize(data),
                data.depth *(getIntervalSize(data) /2.0)
            );
            return makeResult
            ({
                backgroundColor,
                backgroundImage: makeLinearGradientString(data, radius, intervalSize, angleOffset)
            });
        }
    );
    export const makeDilineStyle = (data: Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const angleOffset = getAngleOffset(data);
            const { intervalSize, radius, } = calculateMaxPatternSize
            (
                data,
                getIntervalSize(data),
                (1.0 -Math.sqrt(1.0 -data.depth)) *(getIntervalSize(data) /2.0)
            );
            return makeResult
            ({
                backgroundColor,
                backgroundImage:
                [
                    makeLinearGradientString(data, radius, intervalSize, (0.0 /4.0) +angleOffset),
                    makeLinearGradientString(data, radius, intervalSize, (1.0 /4.0) +angleOffset),
                ]
                .join(", ")
            });
        }
    );
    export const makeTrilineStyle = (data: Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const angleOffset = getAngleOffset(data);
            const { intervalSize, radius, } = calculateMaxPatternSize
            (
                data,
                getIntervalSize(data),
                (1.0 -Math.sqrt(1.0 -data.depth)) *(getIntervalSize(data) /3.0)
            );
            return makeResult
            ({
                backgroundColor,
                backgroundImage:
                [
                    makeLinearGradientString(data, radius, intervalSize, (0.0 /6.0) +angleOffset),
                    makeLinearGradientString(data, radius, intervalSize, (1.0 /6.0) +angleOffset),
                    makeLinearGradientString(data, radius, intervalSize, (2.0 /6.0) +angleOffset),
                ]
                .join(", ")
            });
        }
    );
}
