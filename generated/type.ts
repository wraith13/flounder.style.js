import { EvilType } from "../evil-type.ts/common/evil-type";
export namespace Type
{
    export type FlounderType = Arguments["type"];
    export type LayoutAngle = "regular" | "alternative";
    export type Color = string;
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
    export const isColor: EvilType.Validator.IsType<Color> = EvilType.Validator.isString;
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
        EvilType.Validator.isOptional(isPixel), });
    export const spotArgumentsValidatorObject: EvilType.Validator.ObjectValidator<SpotArguments> = EvilType.Validator.mergeObjectValidator(
        argumentsBaseValidatorObject, { type: EvilType.Validator.isEnum([ "trispot", "tetraspot" ] as const), layoutAngle:
        EvilType.Validator.isOptional(EvilType.Validator.isOr(isLayoutAngle, EvilType.Validator.isJust(0 as const))), anglePerDepth:
        EvilType.Validator.isOptional(EvilType.Validator.isOr(EvilType.Validator.isNever, EvilType.Validator.isJust(0 as const))), });
    export const lineArgumentsValidatorObject: EvilType.Validator.ObjectValidator<LineArguments> = EvilType.Validator.mergeObjectValidator(
        argumentsBaseValidatorObject, { type: EvilType.Validator.isEnum([ "stripe", "diline", "triline" ] as const), });
}
