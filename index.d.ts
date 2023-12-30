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
            maxSpotSize?: number;
            maximumFractionDigits?: number;
        }
        const getPatternType: (data: Arguments) => FlounderType;
        const getLayoutAngle: (data: Arguments) => LayoutAngle;
        const getBackgroundColor: (data: Arguments) => Color;
        const makePatternStyleList: (data: Arguments) => StyleProperty[];
        const makePlainStyleListOrNull: (data: Arguments) => StyleProperty[] | null;
        const makeTriPatternStyleList: (data: Arguments) => StyleProperty[];
        const makeTetraPatternStyleList: (data: Arguments) => StyleProperty[];
    }
}
