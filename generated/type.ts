import { EvilType } from "../evil-type.ts/common/evil-type";
export namespace Type
{
    export type FlounderType = Arguments["type"];
    export type LayoutAngle = "regular" | "alternative";
    type _H = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F" | "a" | "b" | "c" | "d" | "e" |
        "f";
    type _H2 = `${ _H }${ _H }`;
    type _H3 = `${ _H }${ _H }${ _H }`;
    type _H4 = `${ _H2 }${ _H2 }`;
    type _H3C = `#${ _H3 }`;
    type _H4C = `#${ _H4 }`;
    type _H6C = `#${ _H3 }${ _H3 }`;
    type _H8C = `#${ _H4 }${ _H4 }`;
    export type HexColor = `${ _H3C | _H4C | _H6C | _H8C }`;
    export type NamedColor = "black" | "silver" | "gray" | "white" | "maroon" | "red" | "purple" | "fuchsia" | "green" | "lime" | "olive" |
        "yellow" | "navy" | "blue" | "teal" | "aqua" | "aliceblue" | "antiquewhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque"
        | "black" | "blanchedalmond" | "blue" | "blueviolet" | "brown" | "burlywood" | "cadetblue" | "chartreuse" | "chocolate" | "coral" |
        "cornflowerblue" | "cornsilk" | "crimson" | "cyan" | "darkblue" | "darkcyan" | "darkgoldenrod" | "darkgray" | "darkgreen" |
        "darkgrey" | "darkkhaki" | "darkmagenta" | "darkolivegreen" | "darkorange" | "darkorchid" | "darkred" | "darksalmon" |
        "darkseagreen" | "darkslateblue" | "darkslategray" | "darkslategrey" | "darkturquoise" | "darkviolet" | "deeppink" | "deepskyblue"
        | "dimgray" | "dimgrey" | "dodgerblue" | "firebrick" | "floralwhite" | "forestgreen" | "fuchsia" | "gainsboro" | "ghostwhite" |
        "gold" | "goldenrod" | "gray" | "green" | "greenyellow" | "grey" | "honeydew" | "hotpink" | "indianred" | "indigo" | "ivory" |
        "khaki" | "lavender" | "lavenderblush" | "lawngreen" | "lemonchiffon" | "lightblue" | "lightcoral" | "lightcyan" |
        "lightgoldenrodyellow" | "lightgray" | "lightgreen" | "lightgrey" | "lightpink" | "lightsalmon" | "lightseagreen" | "lightskyblue"
        | "lightslategray" | "lightslategrey" | "lightsteelblue" | "lightyellow" | "lime" | "limegreen" | "linen" | "magenta" | "maroon" |
        "mediumaquamarine" | "mediumblue" | "mediumorchid" | "mediumpurple" | "mediumseagreen" | "mediumslateblue" | "mediumspringgreen" |
        "mediumturquoise" | "mediumvioletred" | "midnightblue" | "mintcream" | "mistyrose" | "moccasin" | "navajowhite" | "navy" |
        "oldlace" | "olive" | "olivedrab" | "orange" | "orangered" | "orchid" | "palegoldenrod" | "palegreen" | "paleturquoise" |
        "palevioletred" | "papayawhip" | "peachpuff" | "peru" | "pink" | "plum" | "powderblue" | "purple" | "rebeccapurple" | "red" |
        "rosybrown" | "royalblue" | "saddlebrown" | "salmon" | "sandybrown" | "seagreen" | "seashell" | "sienna" | "silver" | "skyblue" |
        "slateblue" | "slategray" | "slategrey" | "snow" | "springgreen" | "steelblue" | "tan" | "teal" | "thistle" | "tomato" |
        "transparent" | "turquoise" | "violet" | "wheat" | "white" | "whitesmoke" | "yellow" | "yellowgreen";
    export type Color = HexColor | NamedColor;
    export type Rate = number;
    export type SignedRate = number;
    export type Pixel = number;
    export type SignedPixel = number;
    export type Count = number;
    export interface ArgumentsBase
    {
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
    export const isFlounderType: EvilType.Validator.IsType<FlounderType> = EvilType.Validator.isOr(EvilType.Validator.isEnum([ "trispot",
        "tetraspot" ] as const), EvilType.Validator.isEnum([ "stripe", "diline", "triline" ] as const));
    export const isLayoutAngle: EvilType.Validator.IsType<LayoutAngle> = EvilType.Validator.isEnum([ "regular", "alternative" ] as const);
    export const isHexColor: EvilType.Validator.IsType<HexColor> = EvilType.Validator.isDetailedString({
        pattern:"^#(?:[0-9A-Fa-f]){3,4,6,8}$", }, "u");
    export const isNamedColor: EvilType.Validator.IsType<NamedColor> = EvilType.Validator.isEnum([ "black", "silver", "gray", "white",
        "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "aliceblue",
        "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
        "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue",
        "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange",
        "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise",
        "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia",
        "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred",
        "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
        "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
        "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon",
        "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
        "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace",
        "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
        "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue",
        "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray",
        "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat",
        "white", "whitesmoke", "yellow", "yellowgreen" ] as const);
    export const isColor: EvilType.Validator.IsType<Color> = EvilType.lazy(() => EvilType.Validator.isOr(isHexColor, isNamedColor));
    export const isRate: EvilType.Validator.IsType<Rate> = EvilType.Validator.isDetailedNumber({ minimum:0, maximum:1, }, false);
    export const isSignedRate: EvilType.Validator.IsType<SignedRate> = EvilType.Validator.isDetailedNumber({ minimum:-1, maximum:1, },
        false);
    export const isPixel: EvilType.Validator.IsType<Pixel> = EvilType.Validator.isDetailedNumber({ minimum:0, }, false);
    export const isSignedPixel: EvilType.Validator.IsType<SignedPixel> = EvilType.Validator.isNumber;
    export const isCount: EvilType.Validator.IsType<Count> = EvilType.Validator.isDetailedInteger({ minimum:0, }, false);
    export const isArgumentsBase = EvilType.lazy(() => EvilType.Validator.isSpecificObject(argumentsBaseValidatorObject, false));
    export const isSpotArguments = EvilType.lazy(() => EvilType.Validator.isSpecificObject(spotArgumentsValidatorObject, false));
    export const isLineArguments = EvilType.lazy(() => EvilType.Validator.isSpecificObject(lineArgumentsValidatorObject, false));
    export const isArguments: EvilType.Validator.IsType<Arguments> = EvilType.lazy(() => EvilType.Validator.isOr(isSpotArguments,
        isLineArguments));
    export const argumentsBaseValidatorObject: EvilType.Validator.ObjectValidator<ArgumentsBase> = ({ type: isFlounderType, layoutAngle:
        EvilType.Validator.isOptional(EvilType.Validator.isOr(isLayoutAngle, isSignedRate)), offsetX: EvilType.Validator.isOptional(
        isSignedPixel), offsetY: EvilType.Validator.isOptional(isSignedPixel), foregroundColor: isColor, backgroundColor:
        EvilType.Validator.isOptional(isColor), intervalSize: EvilType.Validator.isOptional(isPixel), depth: isRate, blur:
        EvilType.Validator.isOptional(isPixel), maxPatternSize: EvilType.Validator.isOptional(isPixel), reverseRate:
        EvilType.Validator.isOptional(EvilType.Validator.isOr(isSignedRate, EvilType.Validator.isJust("auto" as const),
        EvilType.Validator.isJust("-auto" as const))), anglePerDepth: EvilType.Validator.isOptional(EvilType.Validator.isOr(isSignedRate,
        EvilType.Validator.isJust("auto" as const), EvilType.Validator.isJust("-auto" as const))), maximumFractionDigits:
        EvilType.Validator.isOptional(isCount), });
    export const spotArgumentsValidatorObject: EvilType.Validator.ObjectValidator<SpotArguments> = EvilType.Validator.mergeObjectValidator(
        argumentsBaseValidatorObject, { type: EvilType.Validator.isEnum([ "trispot", "tetraspot" ] as const), layoutAngle:
        EvilType.Validator.isOptional(EvilType.Validator.isOr(isLayoutAngle, EvilType.Validator.isJust(0 as const))), anglePerDepth:
        EvilType.Validator.isOptional(EvilType.Validator.isOr(EvilType.Validator.isNever, EvilType.Validator.isJust(0 as const))), });
    export const lineArgumentsValidatorObject: EvilType.Validator.ObjectValidator<LineArguments> = EvilType.Validator.mergeObjectValidator(
        argumentsBaseValidatorObject, { type: EvilType.Validator.isEnum([ "stripe", "diline", "triline" ] as const), });
}
