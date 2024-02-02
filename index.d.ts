declare module "index" {
    export namespace flounderStyle {
        const sin: (rate: number) => number;
        const cos: (rate: number) => number;
        type StyleKey = string;
        type StyleValue = string | undefined;
        type StyleProperty = {
            key: StyleKey;
            value: StyleValue;
        };
        type Style = {
            [key: StyleKey]: StyleValue;
        };
        const styleToStylePropertyList: (style: Style) => StyleProperty[];
        const setStyleProperty: (element: HTMLElement, style: StyleProperty) => HTMLElement;
        const makeSureStyle: (styleOrArguments: Style | Arguments) => Style;
        const setStyle: (element: HTMLElement, styleOrArguments: Style | Arguments) => HTMLElement;
        const stylePropertyToString: (style: StyleProperty) => string;
        const styleToString: (styleOrArguments: Style | Arguments, separator?: string) => string;
        type FlounderType = Arguments["type"];
        type Color = string;
        type LayoutAngle = "regular" | "alternative";
        type Real = number;
        type Rate = Real;
        type SignedRate = Real;
        type Pixel = Real;
        type SignedPixel = Real;
        type Integer = number;
        type Count = Integer;
        interface ArgumentsBase {
            type: FlounderType;
            layoutAngle?: LayoutAngle | SignedRate;
            offsetX?: SignedPixel;
            offsetY?: SignedPixel;
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
        const isArguments: (value: unknown) => value is Arguments;
        const getPatternType: (data: Arguments) => FlounderType;
        const getLayoutAngle: (data: Arguments) => LayoutAngle;
        const getActualLayoutAngle: (data: Arguments) => number;
        const getAutoAnglePerDepth: (data: Arguments) => number;
        const getActualAnglePerDepth: (data: Arguments) => number;
        const getAngleOffsetByDepth: (data: Arguments) => number;
        const getAngleOffset: (data: Arguments) => number;
        const getBackgroundColor: (data: Arguments) => Color;
        const getIntervalSize: (data: Arguments) => number;
        const getBlur: (data: Arguments) => number;
        const getActualReverseRate: (data: Arguments) => number;
        const getAbsoulteReverseRate: (data: Arguments) => undefined | number | "auto";
        const makeStyle: (data: Arguments) => Style;
        const makePlainStyleOrNull: (data: Arguments) => Style | null;
        const simpleStructuredClone: <T>(value: T) => T;
        const reverseArguments: (data: Arguments) => Arguments;
        const makeTrispotStyle: (data: Arguments) => Style;
        const makeTetraspotStyle: (data: Arguments) => Style;
        const makeStripeStyle: (data: Arguments) => Style;
        const makeDilineStyle: (data: Arguments) => Style;
        const makeTrilineStyle: (data: Arguments) => Style;
        const calculateOffsetCoefficient: (data: Arguments) => {
            x: Pixel;
            y: Pixel;
            isMustUseBoth: boolean;
        };
    }
}
