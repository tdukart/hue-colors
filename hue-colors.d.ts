interface HueColorStatic {
    new(): HueColor;

    fromRgb(red: number, green: number, blue: number): HueColor;

    fromCIE(x: number, y: number, brightness: number): HueColor;

    fromCt(colorTemperature: number, brightness: number): HueColor;

    fromHex(hex: string): HueColor;

    fromHsb(hue: number, saturation: number, brightness: number): HueColor;
}

interface HueColor {
    constructor();

    toRgb(): [number,number,number];

    toHex(): string;

    toCie(): [number,number,number];

    toHsb(): [number,number,number];

    toCt(): number;
}

declare let HueColor: HueColorStatic;
