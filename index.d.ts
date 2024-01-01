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
        const setStyle: (element: HTMLElement, style: StyleProperty) => void;
        const setStyleList: (element: HTMLElement, styleList: StyleProperty[]) => HTMLElement;
        const styleToString: (style: StyleProperty) => string;
        const styleListToString: (styleList: StyleProperty[], separator?: string) => string;
        type FlounderType = "tri" | "tetra";
        type Style = {
            key: StyleKey;
            value: StyleValue;
        };
        type Color = string;
        type LayoutAngle = "regular" | "alternative";
        interface Arguments {
            type?: FlounderType;
            layoutAngle?: LayoutAngle;
            foregroundColor: Color;
            backgroundColor?: Color;
            spotIntervalSize?: number;
            depth: number;
            blur?: number;
            maxSpotSize?: number;
            reverseRate?: number | "auto";
            maximumFractionDigits?: number;
        }
        const getPatternType: (data: Arguments) => FlounderType;
        const getLayoutAngle: (data: Arguments) => LayoutAngle;
        const getBackgroundColor: (data: Arguments) => Color;
        const getBlur: (data: Arguments) => number;
        const getActualReverseRate: (data: Arguments) => number;
        const makePatternStyleList: (data: Arguments) => StyleProperty[];
        const makePlainStyleListOrNull: (data: Arguments) => StyleProperty[] | null;
        const reverseArguments: (data: Arguments) => Arguments;
        const makeTriPatternStyleList: (data: Arguments) => StyleProperty[];
        const makeTetraPatternStyleList: (data: Arguments) => StyleProperty[];
    }
}
