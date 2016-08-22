import ColorUtil from './classes/ColorUtil';

const COLOR_RGB = 'rgb';
const COLOR_CIE = 'cie';

export default class HueColors {

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
		this.originalColor = null;
	}

	/**
	 * Constructs a new Color given red, green, and blue.
	 * @param {Number} red   The red value, from 0 to 255.
	 * @param {Number} green The green value, from 0 to 255.
	 * @param {Number} blue  The blue value, from 0 to 255.
	 * @returns {Color}
	 */
	static fromRgb( red, green, blue ) {
		var color = new Color;
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
	 * @param {Number} brightness Brightness, from 0 to 1.
	 * @returns {Color}
	 */
	static fromCIE( x, y, brightness ) {
		var color = new Color;
		color.x = x;
		color.y = y;
		color.brightness = brightness;
		color.originalColor = COLOR_CIE;
		return color;
	}

	/**
	 * Constructs a new Color given a CSS-style hex code.
	 * @param {String} hex The hex code.
	 * @returns {Color}
	 */
	static fromHex( hex ) {
		var rgb = ColorUtil.hexToRGB( hex );
		return Color.fromRgb( rgb[0], rgb[1], rgb[2] );
	}

	/**
	 * Converts the color to RGB. Note that the CIE-to-RGB conversion is necessarily approximate.
	 * @returns {Number[]} Red, green, and blue components.
	 */
	toRgb() {
		if ( null === this.red || null === this.green || null === this.blue ) {
			if ( COLOR_CIE === this.originalColor ) {
				var rgb = ColorUtil.getRGBFromXYAndBrightness( this.x, this.y, this.brightness );
				this.red = rgb[0];
				this.green = rgb[1];
				this.blue = rgb[2];
			} else {
				throw new InvalidColorException( 'Unable to process color, original is ' + this.originalColor );
			}
		}

		return [this.red, this.green, this.blue];
	}

	/**
	 * Converts the color to a CSS-style hex string. Note that the CIE-to-RGB conversion is necessarily approximate.
	 * @returns {String}
	 */
	toHex() {
		var rgb = this.toRgb();
		return ColorUtil.rgbToHex( this.red, this.green, this.blue );
	}

	/**
	 * Converts the color to a CIE color that Hue lamps are capable of showing. Note that the RGB-to-CIE conversion is
	 * necessarily approximate.
	 * @returns {Number[]} X, Y, and brightness components.
	 */
	toCie() {
		if ( null === this.x || null === this.y || null === this.brightness ) {
			if ( COLOR_RGB === this.originalColor ) {
				var cie = ColorUtil.getXYPointFromRGB( this.red, this.green, this.blue );
				this.x = cie.x;
				this.y = cie.y;
				this.brightness = ColorUtil.getBrightnessFromRgb( this.red, this.green, this.blue );
			} else {
				throw new InvalidColorException( 'Unable to process color, original is ' + this.originalColor );
			}
		}

		return [this.x, this.y, this.brightness];
	}
}

export class InvalidColorException extends Error {
}
