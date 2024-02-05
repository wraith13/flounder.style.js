declare module "index" {
    export namespace flounderStyle {
        const sin: (rate: number) => number;
        const cos: (rate: number) => number;
        const atan2: (direction: {
            x: number;
            y: number;
        }) => number;
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
        type DirectionAngle = "right" | "right-down" | "down" | "left-down" | "left" | "left-up" | "up" | "right-up" | SignedRate;
        const regulateRate: (rate: SignedRate) => Rate;
        const directionAngleToRate: (angle: DirectionAngle) => Rate;
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
        interface OffsetCoefficientDirection {
            x: number;
            y: number;
        }
        interface OffsetCoefficient {
            directions: OffsetCoefficientDirection[];
            intervalSize: number;
            radius: number;
        }
        const calculateOffsetCoefficient: (data: Arguments) => OffsetCoefficient;
        const comparer: <valueT>(a: valueT, b: valueT) => 0 | 1 | -1;
        const makeComparer: <objectT, valueT>(f: (o: objectT) => valueT) => (a: objectT, b: objectT) => 0 | 1 | -1;
        const compareAngles: (a: SignedRate, b: SignedRate) => SignedRate;
        const selectClosestAngleDirection: (directions: OffsetCoefficientDirection[], angle: DirectionAngle) => OffsetCoefficientDirection;
    }
}
