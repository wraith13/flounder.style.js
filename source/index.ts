import { EvilType, Type as GeneratedType } from "../generated/type";
import config from "./config.json";
export { EvilType };
export namespace flounderStyle
{
    export import Type = GeneratedType;
    export const sin = (rate: Type.SignedRate): Type.SignedRate => Math.sin(Math.PI *2.0 *rate);
    export const cos = (rate: Type.SignedRate): Type.SignedRate => Math.cos(Math.PI *2.0 *rate);
    export const atan2 = (direction: { x: Type.SignedPixel, y: Type.SignedPixel, }): Type.SignedRate => Math.atan2(direction.y, direction.x) /(Math.PI *2.0);
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
    export const makeSureStyle = (styleOrArguments: Style | Type.Arguments): Style =>
        isArguments(styleOrArguments) ? makeStyle(styleOrArguments): styleOrArguments;
    export const setStyle = (element: HTMLElement, styleOrArguments: Style | Type.Arguments) =>
    {
        styleToStylePropertyList(makeSureStyle(styleOrArguments)).forEach(i => setStyleProperty(element, i));
        return element;
    }
    export const stylePropertyToString = (style: StyleProperty) => `${style.key}: ${style.value ?? "inherit"};`;
    export const styleToString = (styleOrArguments: Style | Type.Arguments, separator: string = " ") =>
        styleToStylePropertyList(makeSureStyle(styleOrArguments))
            .filter(i => undefined !== i.value)
            .map(i => stylePropertyToString(i))
            .join(separator);
    export const regulateRate = (rate: Type.SignedRate): Type.Rate =>
    {
        let result = rate % 1.0;
        if (result < -0.0000000000001)
        {
            result += 1.0;
        }
        return result;
    };
    export const directionAngleToRate = (angle: Type.DirectionAngle): Type.Rate =>
    {
        switch(angle)
        {
        case "right":
            return 0.0 /8.0;
        case "right-down":
            return 1.0 /8.0;
        case "down":
            return 2.0 /8.0;
        case "left-down":
            return 3.0 /8.0;
        case "left":
            return 4.0 /8.0;
        case "left-up":
            return 5.0 /8.0;
        case "up":
            return 6.0 /8.0;
        case "right-up":
            return 7.0 /8.0;
        default:
            return regulateRate(angle);
        }
    };
    export const isArguments = (value: unknown): value is Type.Arguments =>
        null !== value &&
        "object" === typeof value &&
        "type" in value && "string" === typeof value.type &&
        "foregroundColor" in value && "string" === typeof value.foregroundColor &&
        "depth" in value && "number" === typeof value.depth;
    export const getPatternType = (data: Type.Arguments): Type.FlounderType => data.type ?? "trispot";
    export const getLayoutAngle = (data: Type.Arguments) =>
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
    export const getActualLayoutAngle = (data: Type.Arguments): number =>
        "number" === typeof data.layoutAngle ? data.layoutAngle:
        "regular" === (data.layoutAngle ?? "regular") ? 0.0:
        "stripe" === data.type ? 0.25:
        "tetraspot" === data.type ? 0.125:
        "diline" === data.type ? 0.125:
        "trispot" === data.type ? 0.25:
        "triline" === data.type ? 0.25:
        0.5;
    export const getAutoAnglePerDepth = (data: Type.Arguments): number =>
        "stripe" === getPatternType(data) ? (1.0 / 2.0):
        "diline" === getPatternType(data) ? (1.0 / 4.0):
        "triline" === getPatternType(data) ? (1.0 / 6.0):
        1.0;
    export const getActualAnglePerDepth = (data: Type.Arguments): number =>
        "number" === typeof data.anglePerDepth ? data.anglePerDepth:
        "auto" === data.anglePerDepth ? getAutoAnglePerDepth(data):
        "-auto" === data.anglePerDepth ? -getAutoAnglePerDepth(data):
        0.0;
    export const getAngleOffsetByDepth = (data: Type.Arguments): number =>
        getActualAnglePerDepth(data) *data.depth;
    export const getAngleOffset = (data: Type.Arguments): number =>
        getActualLayoutAngle(data) +getAngleOffsetByDepth(data);
    export const getBackgroundColor = (data: Type.Arguments): Type.Color => data.backgroundColor ?? "transparent";
    export const getIntervalSize = (data: Type.Arguments) =>
        data.intervalSize ?? config.defaultSpotIntervalSize;
    export const getBlur = (data: Type.Arguments): number => data.blur ?? config.defaultBlur;
    export const getActualReverseRate = (data: Type.Arguments): number =>
        "number" === typeof data.reverseRate ? data.reverseRate:
        ("auto" === data.reverseRate && "trispot" === getPatternType(data)) ? triPatternHalfRadiusSpotArea:
        ("auto" === data.reverseRate && "tetraspot" === getPatternType(data)) ? TetraPatternHalfRadiusSpotArea:
        ("auto" === data.reverseRate && "stripe" === getPatternType(data)) ? 0.0:
        ("auto" === data.reverseRate && "diline" === getPatternType(data)) ? 0.0:
        ("auto" === data.reverseRate && "triline" === getPatternType(data)) ? 0.0:
        999;
    export const getAbsoulteReverseRate = (data: Type.Arguments): undefined | number | "auto" =>
        "number" === typeof data.reverseRate && data.reverseRate < 0.0 ? Math.abs(data.reverseRate):
        "-auto" === data.reverseRate ? "auto":
        data.reverseRate;
    const numberToString = (data: Type.Arguments, value: number) =>
        value.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: data.maximumFractionDigits ?? config.defaultMaximumFractionDigits, });
    const makeResult = ({ backgroundColor = undefined as StyleValue, backgroundImage = undefined as StyleValue, backgroundSize = undefined as StyleValue, backgroundPosition = undefined as StyleValue}): Style =>
    ({
        "background-color": backgroundColor,
        "background-image": backgroundImage,
        "background-size":backgroundSize,
        "background-position": backgroundPosition,
    });
    const makeAxis = (data: Type.Arguments, value:number) =>
        `calc(${numberToString(data, value)}px + 50%)`;
    const makeOffsetAxis = (data: Type.Arguments, offset: number, value:number) =>
        makeAxis(data, value +offset);
    const makeOffsetPosition = (data: Type.Arguments, x: number, y:number) =>
        `${makeOffsetAxis(data, data.offsetX ?? 0.0, x)} ${makeOffsetAxis(data, data.offsetY ?? 0.0, y)}`;
    export const makeStyle = (data: Type.Arguments): Style =>
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
    const makeRadialGradientString = (data: Type.Arguments, radius: number, blur = Math.min(radius, getBlur(data)) /0.5) =>
        `radial-gradient(circle at center, ${data.foregroundColor} ${numberToString(data, radius -blur)}px, transparent ${numberToString(data, radius +blur)}px)`;
    const makeLinearGradientString = (data: Type.Arguments, radius: number, intervalSize: number, angle: number, blur = Math.min(intervalSize -radius, radius, getBlur(data)) /0.5) =>
    {
        const deg = numberToString(data, 360.0 *angle);
        const offset = undefined === data.offsetX && undefined === data.offsetY ?
            0: sin(angle) *(data.offsetX ?? 0.0) -cos(angle) *(data.offsetY ?? 0.0);
        const patternStart = 0 +offset;
        const a = Math.max(0, radius -blur) +offset;
        const b = Math.min(intervalSize *0.5, radius +blur) +offset;
        const c = Math.max(intervalSize *0.5, intervalSize -radius -blur) +offset;
        const d = Math.min(intervalSize, intervalSize -radius +blur) +offset;
        const patternEnd = intervalSize +offset;
        return `repeating-linear-gradient(${deg}deg, ${data.foregroundColor} ${makeAxis(data, patternStart)}, ${data.foregroundColor} ${makeAxis(data, a)}, transparent ${makeAxis(data, b)}, transparent ${makeAxis(data, c)}, ${data.foregroundColor} ${makeAxis(data, d)}, ${data.foregroundColor} ${makeAxis(data, patternEnd)})`;
    }
    const root2 = Math.sqrt(2.0);
    const root3 = Math.sqrt(3.0);
    const triPatternHalfRadiusSpotArea = Math.PI / (2 *root3);
    const TetraPatternHalfRadiusSpotArea = Math.PI / 4;
    export const makePlainStyleOrNull = (data: Type.Arguments): Style | null =>
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
    const calculateMaxPatternSize = (data: Type.Arguments, intervalSize: number, radius: number) =>
    {
        if (undefined !== data.maxPatternSize && data.maxPatternSize < radius)
        {
            intervalSize = intervalSize *data.maxPatternSize /radius;
            radius = data.maxPatternSize;
        }
        return { intervalSize, radius, };
    };
    const calculateSpotSize = (data: Type.Arguments, halfRadiusSpotArea: number, maxRadiusRate: number) =>
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
    const calculatePatternSize = (data: Type.Arguments) =>
    {
        switch(getPatternType(data))
        {
        case "trispot":
            return calculateSpotSize(data, triPatternHalfRadiusSpotArea, 1.0 /root3);
        case "tetraspot":
            return calculateSpotSize(data, TetraPatternHalfRadiusSpotArea, 0.5 *root2);
        case "stripe":
            return calculateMaxPatternSize
            (
                data,
                getIntervalSize(data),
                data.depth *(getIntervalSize(data) /2.0)
            );
        case "diline":
            return calculateMaxPatternSize
            (
                data,
                getIntervalSize(data),
                (1.0 -Math.sqrt(1.0 -data.depth)) *(getIntervalSize(data) /2.0)
            );
        case "triline":
            return calculateMaxPatternSize
            (
                data,
                getIntervalSize(data),
                (1.0 -Math.sqrt(1.0 -data.depth)) *(getIntervalSize(data) /3.0)
            );
        default:
            throw new Error(`Unknown FlounderType: ${data.type}`);
        }
    };
    export const simpleStructuredClone = //window.structuredClone ??
    (
        <T>(value: T): T =>
        {
            if (undefined !== value && null !== value)
            {
                if (Array.isArray(value))
                {
                    return value.map(i => simpleStructuredClone(i)) as T;
                }
                if ("object" === typeof value)
                {
                    const result = <{ [key:string]: unknown }>{ };
                    Object.keys(value).forEach
                    (
                        key => result[key] = simpleStructuredClone((value as any)[key])
                    )
                    return result as T;
                }
            }
            return value;
        }
    );
    export const reverseArguments = (data: Type.Arguments): Type.Arguments =>
    {
        const result = simpleStructuredClone(data);
        result.foregroundColor = getBackgroundColor(data);
        result.backgroundColor = data.foregroundColor;
        if ("number" === typeof data.layoutAngle)
        {
            result.layoutAngle = getActualLayoutAngle(data) +getActualAnglePerDepth(data);
        }
        result.depth = 1.0 -data.depth;
        delete result.reverseRate;
        if ("number" === typeof data.anglePerDepth)
        {
            result.anglePerDepth = -data.anglePerDepth;
        }
        else
        if ("auto" === data.anglePerDepth)
        {
            result.anglePerDepth = "-auto";
        }
        else
        if ("-auto" === data.anglePerDepth)
        {
            result.anglePerDepth = "auto";
        }
        return result;
    };
    const makeStyleCommon = (data: Type.Arguments, maker: (data: Type.Arguments) => Style): Style =>
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
    export const makeTrispotStyle = (data: Type.Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const { intervalSize, radius, } = calculatePatternSize(data);
            const radialGradient = makeRadialGradientString(data, radius);
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const backgroundImage: StyleValue = Array.from({ length: 4 }).map(_ => radialGradient).join(", ");
            switch(getLayoutAngle(data))
            {
            case "regular": // horizontal
            {
                const xUnit = intervalSize *2.0;
                const yUnit = intervalSize *root3;
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage,
                    backgroundSize: `${numberToString(data, xUnit)}px ${numberToString(data, yUnit)}px`,
                    backgroundPosition: `${makeOffsetPosition(data, 0, 0)}, ${makeOffsetPosition(data, intervalSize, 0)}, ${makeOffsetPosition(data, intervalSize *0.5, intervalSize *root3 *0.5)}, ${makeOffsetPosition(data, intervalSize *1.5, intervalSize * root3 * 0.5)}`,
                });
            }
            case "alternative": // vertical
            {
                const xUnit = intervalSize *root3;
                const yUnit = intervalSize *2.0;
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage,
                    backgroundSize: `${numberToString(data, xUnit)}px ${numberToString(data, yUnit)}px`,
                    backgroundPosition: `${makeOffsetPosition(data, 0, 0)}, ${makeOffsetPosition(data, 0, intervalSize)}, ${makeOffsetPosition(data, intervalSize *root3 *0.5, intervalSize *0.5)}, ${makeOffsetPosition(data, intervalSize *root3 *0.5, intervalSize *1.5)}`,
                });
            }
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    );
    export const makeTetraspotStyle = (data: Type.Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const { intervalSize, radius, } = calculatePatternSize(data);
            const radialGradient = makeRadialGradientString(data, radius);
            const backgroundColor: StyleValue = getBackgroundColor(data);
            switch(getLayoutAngle(data))
            {
            case "regular": // straight
            {
                const xUnit = intervalSize;
                const yUnit = intervalSize;
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage: radialGradient,
                    backgroundSize: `${numberToString(data, xUnit)}px ${numberToString(data, yUnit)}px`,
                    backgroundPosition: makeOffsetPosition(data, 0, 0),
                });
            }
            case "alternative": // slant
            {
                const xUnit = (intervalSize *2.0) /root2;
                const yUnit = (intervalSize *2.0) /root2;
                return makeResult
                ({
                    backgroundColor,
                    backgroundImage: Array.from({ length: 2 }).map(_ => radialGradient).join(", "),
                    backgroundSize: `${numberToString(data, xUnit)}px ${numberToString(data, yUnit)}px`,
                    backgroundPosition: `${makeOffsetPosition(data, 0, 0)}, ${makeOffsetPosition(data, intervalSize /root2, intervalSize /root2)}`,
                });
            }
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    );
    export const makeStripeStyle = (data: Type.Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const angleOffset = getAngleOffset(data);
            const { intervalSize, radius, } = calculatePatternSize(data);
            const angles =
            [
                regulateRate(angleOffset),
            ];
            return makeResult
            ({
                backgroundColor,
                backgroundImage: angles
                    .map(angle => makeLinearGradientString(data, radius, intervalSize, angle))
                    .join(", ")
            });
        }
    );
    export const makeDilineStyle = (data: Type.Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const angleOffset = getAngleOffset(data);
            const { intervalSize, radius, } = calculatePatternSize(data);
            const angles =
            [
                regulateRate((0.0 /4.0) +angleOffset),
                regulateRate((1.0 /4.0) +angleOffset),
            ];
            return makeResult
            ({
                backgroundColor,
                backgroundImage: angles
                    .map(angle => makeLinearGradientString(data, radius, intervalSize, angle))
                    .join(", ")
            });
        }
    );
    export const makeTrilineStyle = (data: Type.Arguments): Style => makeStyleCommon
    (
        data, data =>
        {
            const backgroundColor: StyleValue = getBackgroundColor(data);
            const angleOffset = getAngleOffset(data);
            const { intervalSize, radius, } = calculatePatternSize(data);
            const angles =
            [
                regulateRate((0.0 /6.0) +angleOffset),
                regulateRate((1.0 /6.0) +angleOffset),
                regulateRate((2.0 /6.0) +angleOffset)
            ];
            return makeResult
            ({
                backgroundColor,
                backgroundImage: angles
                    .map(angle => makeLinearGradientString(data, radius, intervalSize, angle))
                    .join(", ")
            });
        }
    );
    export interface OffsetCoefficientDirection
    {
        x: number;
        y: number;
    }
    export interface OffsetCoefficient
    {
        directions: OffsetCoefficientDirection[], // Clockwise from 3 o'clock direction
        intervalSize: number,
        radius: number,
    }
    export const calculateOffsetCoefficientDirections = (data: Type.Arguments): OffsetCoefficientDirection[] =>
    {
        const calculateDirection = (angleOffset: Type.Rate, a: Type.Rate, b: Type.Rate): OffsetCoefficientDirection =>
        ({
            x: a *cos(angleOffset +b),
            y: a *sin(angleOffset +b),
        });
        const makeAngleVariation = (divisionCount: number, masterMaker: (angleOffset: Type.Rate) => OffsetCoefficientDirection[]): OffsetCoefficientDirection[] =>
        {
            const angleOffset = getAngleOffset(data);
            const base = Array.from({ length: divisionCount, }).map
            (
                (_i, ix) => masterMaker(angleOffset +(ix /(divisionCount *2.0)))
            )
            .reduce((a, b) => a.concat(b), []);
            const result = base
                .concat(base.map(i => ({ x: -i.x, y: -i.y, })))
                .sort(makeComparer(i => regulateRate(atan2(i))));
            return result;
        }
        switch(getPatternType(data))
        {
        case "stripe":
            return makeAngleVariation
            (
                1,
                angleOffset =>
                [
                    calculateDirection(angleOffset, 1.0, 1.0 /4.0),
                ]
            );
        case "tetraspot":
        case "diline":
            return makeAngleVariation
            (
                2,
                angleOffset =>
                [
                    calculateDirection(angleOffset, 1.0, 0.0),
                    calculateDirection(angleOffset, root2, 1.0 /8.0),
                ]
            );
        case "trispot":
            return makeAngleVariation
            (
                3,
                angleOffset =>
                [
                    calculateDirection(angleOffset, 2.0, 0.0),
                    calculateDirection(angleOffset, 2.0 *root3, 1.0 /4.0),
                ]
            );
        case "triline":
            return makeAngleVariation
            (
                3,
                angleOffset =>
                [
                    calculateDirection(angleOffset, 2.0 /root3, 0.0),
                    calculateDirection(angleOffset, 2.0, 1.0 /4.0),
                ]
            );
        default:
            throw new Error(`Unknown FlounderType: ${data.type}`);
        }
    };
    export const calculateOffsetCoefficient = (data: Type.Arguments): OffsetCoefficient =>
    {
        const { intervalSize, radius, } = calculatePatternSize(data);
        const result =
        {
            directions: calculateOffsetCoefficientDirections(data),
            intervalSize,
            radius,
        };
        return result;
    };
    export const comparer = <valueT>(a: valueT, b: valueT) =>
        a < b ? -1:
        b < a ? 1:
        0;
    export const makeComparer = <objectT, valueT>(f: (o: objectT) => valueT) =>
        (a: objectT, b: objectT) => comparer(f(a), f(b));
    export const compareAngles = (a: Type.SignedRate, b: Type.SignedRate): Type.SignedRate =>
    {
        let result = (b -a) %1.0;
        if (0.5 < result)
        {
            result -= 1.0;
        }
        else
        if (result < -0.5)
        {
            result += 1.0;
        }
        return result;
    };
    export const selectClosestAngleDirection = (directions: OffsetCoefficientDirection[], angle: Type.DirectionAngle): OffsetCoefficientDirection =>
    {
        const rate = directionAngleToRate(angle);
        return directions.sort(makeComparer(i => Math.abs(compareAngles(atan2(i), rate))))[0];
    }
}
