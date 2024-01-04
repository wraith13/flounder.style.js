declare module "index" {
    export namespace flounderStyle {
        interface StyleKey {
            css: string;
            dom: string;
        }
        type StyleValue = string | undefined;
        type StyleProperty = {
            key: StyleKey;
            value: StyleValue;
        };
        const setStyle: (element: HTMLElement, style: StyleProperty) => HTMLElement;
        const setStyleList: (element: HTMLElement, styleList: StyleProperty[]) => HTMLElement;
        const styleToString: (style: StyleProperty) => string;
        const styleListToString: (styleList: StyleProperty[], separator?: string) => string;
        type FlounderType = Arguments["type"];
        type Style = {
            key: StyleKey;
            value: StyleValue;
        };
        type Color = string;
        type LayoutAngle = "regular" | "alternative";
        type Real = number;
        type Rate = Real;
        type SignedRate = Real;
        type Pixel = Real;
        type Integer = number;
        type Count = Integer;
        interface ArgumentsBase {
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
        interface SpotArguments extends ArgumentsBase {
            type: "trispot" | "tetraspot";
            layoutAngle?: LayoutAngle | 0;
            anglePerDepth?: never | 0;
        }
        interface LineArguments extends ArgumentsBase {
            type: "stripe" | "diline" | "triline";
        }
        type Arguments = SpotArguments | LineArguments;
        const getPatternType: (data: Arguments) => FlounderType;
        const getLayoutAngle: (data: Arguments) => LayoutAngle;
        const getActualLayoutAngle: (data: Arguments) => number;
        const getActualAnglePerDepth: (data: Arguments) => number;
        const getAngleOffsetByDepth: (data: Arguments) => number;
        const getAngleOffset: (data: Arguments) => number;
        const getBackgroundColor: (data: Arguments) => Color;
        const getIntervalSize: (data: Arguments) => number;
        const getBlur: (data: Arguments) => number;
        const getActualReverseRate: (data: Arguments) => number;
        const getAbsoulteReverseRate: (data: Arguments) => undefined | number | "auto";
        const makePatternStyleList: (data: Arguments) => StyleProperty[];
        const makePlainStyleListOrNull: (data: Arguments) => StyleProperty[] | null;
        const reverseArguments: (data: Arguments) => Arguments;
        const makeTrispotStyleList: (data: Arguments) => StyleProperty[];
        const makeTetraspotStyleList: (data: Arguments) => StyleProperty[];
        const makeStripeStyleList: (data: Arguments) => StyleProperty[];
        const makeDilineStyleList: (data: Arguments) => StyleProperty[];
        const makeTrilineStyleList: (data: Arguments) => StyleProperty[];
    }
}
