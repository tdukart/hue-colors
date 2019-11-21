import ColorUtil from './classes/ColorUtil';

const COLOR_RGB = 'rgb';
const COLOR_CIE = 'cie';
const COLOR_CT = 'ct';
const COLOR_HSB = 'hsb';

export default class HueColor {

    /**
     * Constructs a new Color. Should usually be called by one of the static from___ methods.
     */
    constructor() {
        this.red = null;
        this.green = null;
        this.blue = null;
        this.x = null;
        this.y = null;
        this.brightness = null;
        this.hue = null;
        this.saturation = null;
        this.temperature = null;
        this.originalColor = null;
    }

    /**
     * Constructs a new Color given red, green, and blue.
     * @param {Number} red   The red value, from 0 to 255.
     * @param {Number} green The green value, from 0 to 255.
     * @param {Number} blue  The blue value, from 0 to 255.
     * @returns {HueColor}
     */
    static fromRgb( red, green, blue ) {
        const color = new HueColor;
        color.red = red;
        color.green = green;
        color.blue = blue;
        color.originalColor = COLOR_RGB;
        return color;
    }

    /**
     * Constructs a new Color given a CIE point and brightness.
     * @param {Number} x          X coordinate.
     * @param {Number} y          Y coordinate.
     * @param {Number} brightness Brightness, from 0 to 254.
     * @returns {HueColor}
     */
    static fromCIE( x, y, brightness ) {
        const color = new HueColor;
        color.x = x;
        color.y = y;
        color.brightness = brightness;
        color.originalColor = COLOR_CIE;
        return color;
    }

    static fromCt( colorTemperature, brightness ) {
        const color = new HueColor;
        color.temperature = colorTemperature;
        color.brightness = brightness;
        color.originalColor = COLOR_CT;
        return color;
    }

    /**
     * Constructs a new Color given a CSS-style hex code.
     * @param {String} hex The hex code.
     * @returns {HueColor}
     */
    static fromHex( hex ) {
        const rgb = ColorUtil.hexToRGB( hex );
        return HueColor.fromRgb( rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] );
    }

    /**
     * Constructs a new Color given HSB values.
     * @param {number} hue        Integer, 0 to 65535
     * @param {number} saturation Integer, 0 to 254
     * @param {number} brightness Integer, 0 to 254
     * @returns {HueColor}
     */
    static fromHsb( hue, saturation, brightness ) {
        const color = new HueColor;
        color.hue = hue;
        color.saturation = saturation;
        color.brightness = brightness;
        color.originalColor = COLOR_HSB;
        return color;
    }

    /**
     * Converts the color to RGB. Note that the CIE-to-RGB conversion is necessarily approximate.
     * @returns {Number[]} Red, green, and blue components.
     */
    toRgb() {
        let rgb = [ null, null, null ];
        if ( null === this.red || null === this.green || null === this.blue ) {
            switch ( this.originalColor ) {
                case COLOR_CIE:
                    rgb = ColorUtil.getRGBFromXYAndBrightness( this.x, this.y, this.brightness );
                    break;
                case COLOR_HSB:
                    rgb = ColorUtil.hsbToRgb( this.hue, this.saturation, this.brightness );
                    break;
                case COLOR_CT:
                    rgb = ColorUtil.miredToRgb( this.temperature, this.brightness );
                    break;
                default:
                    throw new Error( 'Unable to process color, original is ' + this.originalColor );
            }
        }

        if ( null !== rgb[ 0 ] ) {
            this.red = rgb[ 0 ];
            this.green = rgb[ 1 ];
            this.blue = rgb[ 2 ];
        }

        return [ this.red, this.green, this.blue ];
    }

    /**
     * Converts the color to a CSS-style hex string. Note that the CIE-to-RGB conversion is necessarily approximate.
     * @returns {String}
     */
    toHex() {
        const rgb = this.toRgb();
        return ColorUtil.rgbToHex( rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] );
    }

    /**
     * Converts the color to a CIE color that Hue lamps are capable of showing. Note that the RGB-to-CIE conversion is
     * necessarily approximate.
     * @returns {Number[]} X, Y, and brightness components.
     */
    toCie() {
        let cie = { x: null, y: null };
        let rgb;
        if ( null === this.x || null === this.y || null === this.brightness ) {
            switch ( this.originalColor ) {
                case COLOR_RGB:
                    cie = ColorUtil.getXYPointFromRGB( this.red, this.green, this.blue );
                    this.brightness = ColorUtil.getBrightnessFromRgb( this.red, this.green, this.blue );
                    break;
                case COLOR_HSB:
                    rgb = ColorUtil.hsbToRgb( this.hue, this.saturation, this.brightness );
                    cie = ColorUtil.getXYPointFromRGB( rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] );
                    // We already know the brightness :-)
                    break;
                case COLOR_CT:
                    rgb = ColorUtil.miredToRgb( this.temperature, this.brightness );
                    cie = ColorUtil.getXYPointFromRGB( rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] );
                    break;
                default:
                    throw new Error( 'Unable to process color, original is ' + this.originalColor );
            }
        }

        if ( null !== cie.x ) {
            this.x = cie.x;
            this.y = cie.y;
        }

        return [ this.x, this.y, this.brightness ];
    }

    /**
     * Converts the color to HSB.
     * @returns {Number[]}
     */
    toHsb() {
        let hsb = [ null, null, null ];
        if ( null === this.hue || null === this.saturation ) {
            let rgb = this.toRgb();
            hsb = ColorUtil.rgbToHsb( rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] );
        }

        // Hue can be null-ish, so check saturation instead.
        if ( null !== hsb[ 1 ] ) {
            this.hue = hsb[ 0 ];
            this.saturation = hsb[ 1 ];
            this.brightness = hsb[ 2 ];
        }
        return [ this.hue, this.saturation, this.brightness ];
    }

    toCt() {
        if ( COLOR_CT !== this.originalColor ) {
            return undefined;
        } else {
            return this.temperature;
        }
    }
}
