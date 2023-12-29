import config from "./config.json";
export module flounderStyle
{
    export interface StyleKey
    {
        css: string;
        dom: string;
    }
    export type StyleValue = string | undefined;
    export type StyleProperty = { key: StyleKey; value: StyleValue; };
    export const setStyle = (element: HTMLElement, style: StyleProperty) =>
    {
        const current = element.style.getPropertyValue(style.key.dom);
        if (current !== style.value) // for DOM rendering performance
        {
            if (undefined !== style.value)
            {
                (element.style as any)[style.key.dom] = style.value;
            }
            else
            {
                element.style.removeProperty(style.key.dom);
            }
        }
    };
    export const setStyleList = (element: HTMLElement, styleList: StyleProperty[]) =>
    {
        styleList.forEach(i => setStyle(element, i));
        return element;
    }
    export const styleToString = (style: StyleProperty) => `${style.key.css}: ${style.value ?? "inherit"};`;
    export const styleListToString = (styleList: StyleProperty[], separator: string = " ") =>
        styleList.filter(i => undefined !== i.value).map(i => styleToString(i)).join(separator);
    export type FlounderType = "tri" | "tetra";
    export type Style = { key: StyleKey; value: StyleValue; };
    export type Color = string;
    export type LayoutAngle = "regular" | "alternative";
    export interface Arguments
    {
        type?: FlounderType;
        foregroundColor: Color;
        backgroundColor?: Color; // default is "transparent"
        spotIntervalSize?: number;
        depth: number; // must be 0.0 <= depth and depth <= 1.0
        layoutAngle?: LayoutAngle;
        maxSpotSize?: number; // must be 1 <= maxSpotSize and maxSpotSize <= (spotIntervalSize *0.5);
        maximumFractionDigits?: number;
    }
    export const getPatternType = (data: Arguments): FlounderType => data.type ?? "tri";
    export const getLayoutAngle = (data: Arguments): LayoutAngle => data.layoutAngle ?? "regular";
    export const getBackgroundColor = (data: Arguments): Color => data.backgroundColor ?? "transparent";

    const numberToString = (data: Arguments, value: number) =>
        value.toLocaleString("en-US", { maximumFractionDigits: data.maximumFractionDigits ?? config.defaultMaximumFractionDigits, });
    const makeResult = ({ backgroundColor = undefined as StyleValue, backgroundImage = undefined as StyleValue, backgroundSize = undefined as StyleValue, backgroundPosition = undefined as StyleValue}): StyleProperty[] =>
    [
        { key: { css: "background-color", dom: "backgroundColor", }, value:backgroundColor, },
        { key: { css: "background-image", dom: "backgroundImage", }, value:backgroundImage, },
        { key: { css: "background-size", dom: "backgroundSize", }, value:backgroundSize, },
        { key: { css: "background-position", dom: "backgroundPosition", }, value:backgroundPosition, },
    ];
    export const makePattern = (data: Arguments): StyleProperty[] =>
    {
        switch(getPatternType(data))
        {
        case "tri":
            return makeTriPattern(data);
        case "tetra":
            return makeTetraPattern(data);
        default:
            throw new Error(`Unknown FlounderType: ${data.type}`);
        }
    };
    const makeRadialGradientString = (data: Arguments, radius: string) =>
        `radial-gradient(circle at center, ${data.foregroundColor} ${radius}, ${getBackgroundColor(data)} ${radius})`;
    const root2 = Math.sqrt(2.0);
    const root3 = Math.sqrt(3.0);
    const triPatternHalfRadiusSpotArea = Math.PI / (2 *root3);
    const TetraPatternHalfRadiusSpotArea = Math.PI / 4;
    export const makePlainOrNull = (data: Arguments): StyleProperty[] | null =>
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
    const calculateSize = (data: Arguments, halfRadiusSpotArea: number, maxRadiusRate: number) =>
    {
        var radius: number;
        var spotIntervalSize = data.spotIntervalSize ?? config.defaultSpotIntervalSize;
        if (data.depth <= halfRadiusSpotArea)
        {
            radius = Math.sqrt(data.depth / halfRadiusSpotArea) *(spotIntervalSize *0.5);
        }
        else
        {
            const minRadius = spotIntervalSize *0.5;
            const maxRadius = spotIntervalSize *maxRadiusRate;
            const radiusMaxWidth = maxRadius -minRadius;
            const minRate = Math.sqrt(halfRadiusSpotArea);
            const maxRate = 1.0;
            const rateMaxWidth = maxRate -minRate;
            const rate = Math.sqrt(data.depth);
            const rateWidth = rate -minRate;
            radius = minRadius +(radiusMaxWidth *(rateWidth / rateMaxWidth));
        }
        if (undefined !== data.maxSpotSize && data.maxSpotSize < radius)
        {
            spotIntervalSize = spotIntervalSize *(data.maxSpotSize /radius);
            radius = data.maxSpotSize;
        }
        //console.log({ radius, spotIntervalSize });
        return { radius, spotIntervalSize };
    };
    export const makeTriPattern = (data: Arguments): StyleProperty[] =>
    {
        const plain = makePlainOrNull(data);
        if (null !== plain)
        {
            return plain;
        }
        else
        {
            const { radius, spotIntervalSize } = calculateSize(data, triPatternHalfRadiusSpotArea, 1.0 /root3);
            const radialGradient = makeRadialGradientString(data, `${numberToString(data, radius)}px`);
            const backgroundImage: StyleValue = Array.from({ length: 4 }).map(_ => radialGradient).join(", ");
            switch(getLayoutAngle(data))
            {
            case "regular": // horizontal
                return makeResult
                ({
                    backgroundImage,
                    backgroundSize: `${numberToString(data, spotIntervalSize *2.0)}px ${numberToString(data, spotIntervalSize *root3)}px`,
                    backgroundPosition: `0px 0px, ${numberToString(data, spotIntervalSize)}px 0px, ${numberToString(data, spotIntervalSize *0.5)}px ${numberToString(data, spotIntervalSize *root3 *0.5)}px, ${numberToString(data, spotIntervalSize *1.5)}px ${numberToString(data, spotIntervalSize * root3 * 0.5)}px`
                });
            case "alternative": // vertical
                return makeResult
                ({
                    backgroundImage,
                    backgroundSize: ` ${numberToString(data, spotIntervalSize *root3)}px ${numberToString(data, spotIntervalSize *2.0)}px`,
                    backgroundPosition: `0px 0px, 0px ${numberToString(data, spotIntervalSize)}px, ${numberToString(data, spotIntervalSize *root3 *0.5)}px ${numberToString(data, spotIntervalSize *0.5)}px, ${numberToString(data, spotIntervalSize *root3 *0.5)}px ${numberToString(data, spotIntervalSize *1.5)}px`
                });
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    };
    export const makeTetraPattern = (data: Arguments): StyleProperty[] =>
    {
        const plain = makePlainOrNull(data);
        if (null !== plain)
        {
            return plain;
        }
        else
        {
            const { radius, spotIntervalSize } = calculateSize(data, TetraPatternHalfRadiusSpotArea, 0.5 *root2);
            const radialGradient = makeRadialGradientString(data, `${numberToString(data, radius)}px`);
            switch(getLayoutAngle(data))
            {
            case "regular": // straight
                return makeResult
                ({
                    backgroundImage: radialGradient,
                    backgroundSize: `${numberToString(data, spotIntervalSize)}px ${numberToString(data, spotIntervalSize)}px`,
                });
            case "alternative": // slant
                return makeResult
                ({
                    backgroundImage: Array.from({ length: 2 }).map(_ => radialGradient).join(", "),
                    backgroundSize: `${numberToString(data, (spotIntervalSize *2.0) /root2)}px ${numberToString(data, (spotIntervalSize *2.0) /root2)}px`,
                    backgroundPosition: `0px 0px, ${numberToString(data, spotIntervalSize /root2)}px ${numberToString(data, spotIntervalSize /root2)}px`
                });
            default:
                throw new Error(`Unknown LayoutAngle: ${data.layoutAngle}`);
            }
        }
    };
}
