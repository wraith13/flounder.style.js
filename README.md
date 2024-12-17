# flounder.style.js

Digital color depth pattern style maker for TypeScript/JavaScript

## Features

This library provides CSS for expressing percentages by area of ​​a color pattern instead of color intensity.

Expressions based on color density can be difficult to recognize, not only for colorblind people, but also for people who are not colorblind. In addition, the expression of subtle hues based on color density is strongly affected by the color development of the display, and in the user environment, the colors may appear quite different from the intended hues.

These problems can be avoided by using color pattern expressions.

- [samples](https://wraith13.github.io/flounder.style.js/samples.html)
- [demo](https://wraith13.github.io/flounder.style.js/demo.html)

## Redering CSS Sample

```css
background-color: white;
background-image:
    radial-gradient(circle, rgb(170, 255, 221) 8.91px, transparent 8.91px),
    radial-gradient(circle, rgb(170, 255, 221) 8.91px, transparent 8.91px),
    radial-gradient(circle, rgb(170, 255, 221) 8.91px, transparent 8.91px),
    radial-gradient(circle, rgb(170, 255, 221) 8.91px, transparent 8.91px);
background-size: 41.569px 48px;
background-position:
    calc(0px + 50%) calc(0px + 50%),
    calc(0px + 50%) calc(24px + 50%),
    calc(20.785px + 50%) calc(12px + 50%),
    calc(20.785px + 50%) calc(36px + 50%);
```

( Line breaks and indentation have been adjusted for ease of viewing, and the CSS that is actually created will not have line breaks and indentation adjusted like this. )

## Redering Samples

See [samples](https://wraith13.github.io/flounder.style.js/samples.html).

![](./image/sample0.png)
![](./image/sample1.png)

## How to install for your project by npm

```sh
npm install @wraith13/flounder.style.js --save
```

## How to use

```typescript
import { flounderStyle } from "flounder.style.js";

// make style
const data: flounderStyle.Type.Arguments =
{
    type: "trispot",
    layoutAngle: "regular",
    foregroundColor: "#AAFFDD",
    intervalSize: 24,
    depth: 0.5,
};
const style = flounderStyle.makeStyle(data);

// apply style
const element = document.getElementById("YOUR-ELEMENT");
flounderStyle.setStyle(element, style);
// You can also: flounderStyle.setStyle(element, data);

// get CSS string
console.log(`CSS: ${flounderStyle.styleToString(style)}`);
// You can also: console.log(`CSS: ${flounderStyle.styleToString(data)}`);
```

### FlounderStyle.Type.Arguments

|key|type|default|description|
|---|---|---|---|
|$schema|...|OPTIONAL|JSON Schema for manual input support|
|type|`"trispot"` \| `"tetraspot"` \| `"stripe"` \| `"diline"` \| `"tryline"`|NOT OPTIONAL|see [samples](https://wraith13.github.io/flounder.style.js/samples.html).|
|layoutAngle|`"regular"` \| `"alternative"` \| `FlounderStyle.Type.SignedRate`|`"regular"`|see [samples](https://wraith13.github.io/flounder.style.js/samples.html). number can only be specified when type is "stripe" or "diline" or "triline".|
|offsetX|`FlounderStyle.Type.SignedPixel`|0.0|X-axis offset of pattern|
|offsetY|`FlounderStyle.Type.SignedPixel`|0.0|Y-axis offset of pattern|
|foregroundColor|`FlounderStyle.Type.Color` ( [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) )|NOT OPTIONAL|Foreground pattern color. foregroundColor must be other than "transparent".|
|backgroundColor|`FlounderStyle.Type.Color` ( [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) )|`"transparent"`|Background pattern color. When using reverseRate, backgroundColor must be other than "transparent".|
|intervalSize|`FlounderStyle.Type.Pixel`|24|Number of pixels from the center of a spot to the center of the next spot.|
|depth|`FlounderStyle.Type.Rate`|NOT OPTIONAL|Rate of area occupied by foreground color pattern|
|blur|`FlounderStyle.Type.Pixel`|0.0|If you want to improve the visibility of overlapping text, increase this value to blur the pattern.|
|maxPatternSize|`FlounderStyle.Type.Pixel`|`undefined`|If maxPatternSize is specified, instead of increasing the spot size beyond this value, intervalSize will be decreased.|
|reverseRate|`FlounderStyle.Type.SignedRate` \| `"auto"` \| `"-auto"` |`undefined`|To avoid pixel collapse, when depth is greater than reverseRate, the foreground color, background color, and depth are reversed. When using reverseRate, backgroundColor must be other than "transparent". If "auto" is specified, it will be set to the same value as the depth at which the spots touch each other. If a negative value is specified, the process will be reversed from the beginning and processed regularly with a depth greater than the absolute value of reverseRate.|
|anglePerDepth|`FlounderStyle.Type.SignedRate` \| `"auto"` \| `"-auto"` |`undefined`|...|
|maximumFractionDigits|`FlounderStyle.Type.Count`|3|The maximum number of digits after the decimal point for numbers used in the generated CSS.|

#### number types

- The range of `FlounderStyle.Type.Rate` number is 0.0 to 1.0.
- The range of `FlounderStyle.Type.SignedRate` number is -1.0 to 1.0.
- The range of `FlounderStyle.Type.Pixel` number is 0.0 or greater.
- The range of `FlounderStyle.Type.SignedPixel` number is exclude a NaN and ±Infinity.
- The range of `FlounderStyle.Type.Count` number is an integer value greater than or equal to 0.

#### JSON Schema

You can use the following JSON Schema when entering `FlounderStyle.Type.Arguments` data manually.

<https://raw.githubusercontent.com/wraith13/flounder.style.js/master/generated/schema.json#>

#### ⚠️ About translucent color

Using translucent colors for `foregroundColor` and `backgroundColor` often does not work well due to overlapping patterns.
This is the same reason why you can't use "transparent" for `foregroundColor`, and why you can't use "transparent" for `backgroundColor` when using reverseRate.

If you want to use a translucent color pattern, instead of directly specifying a translucent color to `foregroundColor` or `backgroundColor`, instead specify `opacity` in the Style (CSS) of that HTML Element to make the entire HTML Element translucent.

#### How to do pattern rotation animation

```typescript
import { flounderStyle as FlounderStyle } from "flounder.style.js";

export const modRate = (value: number, unit: number) => (value %unit) /unit;
let continueAnimation = false;
export const animationFrame = (tick: number) =>
{
    // make style
    const step = modRate(tick, 3000); // 3000ms
    const data: FlounderStyle.Type.Arguments =
    {
        ...
    };
    const offsetCoefficient = FlounderStyle.calculateOffsetCoefficient(data);
    const direction = FlounderStyle.selectClosestAngleDirection(offsetCoefficient.directions, "up"); // "up": 0.75
    // const direction = flounderStyle.selectClosestAngleDirection(offsetCoefficient.directions, 0.0); // "right": 0.0
    data.offsetX = offsetCoefficient.intervalSize * direction.x *step;
    data.offsetY = offsetCoefficient.intervalSize * direction.y *step;
    const style = FlounderStyle.makeStyle(data);

    // apply style to element
    const element = document.getElementById("YOUR-ELEMENT");
    FlounderStyle.setStyle(element, style);

    // apply style to class
    // const styleElement = document.getElementById("YOUR-ANIMATION-STYLE-ELEMENT") as HTMLStyleElement;
    // const css = `.YOUR-CSS-CLASS {${flounderStyle.styleToString(style)}}\r\n`;
    // if (styleElement.innerHTML !== css)
    // {
    //     styleElement.innerHTML = css;
    // }

    if (continueAnimation)
    {
        window.requestAnimationFrame(animationFrame);
    }
};
export const = startAnimation() =>
{
    if ( ! continueAnimation)
    {
        continueAnimation = true;
        window.requestAnimationFrame(animationFrame);
    }
};
export const = stopAnimation() =>
{
    continueAnimation = false;
};

startAnimation();
setTimeout(() => stopAnimation(), 60000);
```

- It is not necessary to use the return value of flounderStyle.calculateOffsetCoefficient(), but by using this return value to calculate offset, you can animate beautifully without showing the loop seam.
- data.intervalSize does not necessarily match the actual intervalSize due to data.maxPatternSize, so use offsetCoefficient.intervalSize when calculating offset.

## Development environment construction

0. Install [Visual Studio Code](https://code.visualstudio.com/) ( Not required, but recommended. )
1. Install [Node.js](https://nodejs.org/)
2. Execute `npm install`.

## How to build

requires: [Node.js](https://nodejs.org/), [TypeScript Compiler](https://www.npmjs.com/package/typescript)

`tsc -P .` or `tsc -P . -w`

## License

[Boost Software License](./LICENSE_1_0.txt)
