import XYPoint from './XYPoint';
import XYUtil from './XYUtil';

export var Red = new XYPoint( 0.675, 0.322 ),
	Lime = new XYPoint( 0.4091, 0.518 ),
	Blue = new XYPoint( 0.167, 0.04 );

/**
 * Fit a number into a range from 0 to `max`.
 * @param {number} number
 * @param {number} max
 * @returns {number}
 */
var fitIntoRange = ( number, max ) => {
	// Convert the hue to a valid value, 0 to 360.
	if ( number >= max ) {
		number = number % max;
	} else if ( number < 0 ) {
		number = number + (max * Math.floor( number / (0 - max) ));
	}
	return number;
}

/*
 * Color utilities. Many of the methods, as marked, were adapted from Bryan Johnson's work (http://bit.ly/2bHHjxd),
 * which itself was derived from Q42's C# Hue library (http://bit.ly/2bye7ul).
 */

export default class ColorUtil {

	/**
	 * Check if the point can be recreated by a Hue lamp.
	 *
	 * @author Q42 [original C#] Bryan Johnson [original JavaScript], Todd Dukart [conversion]
	 *
	 * @param {XYPoint} point The point to test
	 * @returns {boolean} Flag indicating if the point is within reproducible range.
	 */
	static isInLampsReach( point ) {
		var v1 = new XYPoint( Lime.x - Red.x, Lime.y - Red.y ),
			v2 = new XYPoint( Blue.x - Red.x, Blue.y - Red.y ),

			q = new XYPoint( point.x - Red.x, point.y - Red.y ),

			s = XYUtil.crossProduct( q, v2 ) / XYUtil.crossProduct( v1, v2 ),
			t = XYUtil.crossProduct( v1, q ) / XYUtil.crossProduct( v1, v2 );

		return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
	}

	/**
	 * Get the closest point that can be recreated by a Hue lamp.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {XYPoint} point The point to test
	 * @returns {XYPoint} The closest point that can be recreated by a Hue lamp.
	 */
	static getClosestReproduciblePoint( point ) {
		// Color is unreproducible, find the closest point on each line in the CIE 1931 'triangle'.
		var pAB = XYUtil.getClosestPointOnLine( Red, Lime, point ),
			pAC = XYUtil.getClosestPointOnLine( Blue, Red, point ),
			pBC = XYUtil.getClosestPointOnLine( Lime, Blue, point ),

			// Get the distances per point and see which point is closer to our Point.
			dAB = XYUtil.getDistanceBetweenTwoPoints( point, pAB ),
			dAC = XYUtil.getDistanceBetweenTwoPoints( point, pAC ),
			dBC = XYUtil.getDistanceBetweenTwoPoints( point, pBC ),

			lowest = dAB,
			closestPoint = pAB;

		if ( dAC < lowest ) {
			lowest = dAC;
			closestPoint = pAC;
		}

		if ( dBC < lowest ) {
			lowest = dBC;
			closestPoint = pBC;
		}

		return closestPoint;
	}

	/**
	 * Parses a valid hex color string and returns the Red RGB integer value.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {String} hex Hex color string.
	 * @return {Number} Red integer value.
	 */
	static hexToRed( hex ) {
		return parseInt( hex.substring( 0, 2 ), 16 );
	}

	/**
	 * Parses a valid hex color string and returns the Green RGB integer value.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {String} hex Hex color string.
	 * @return {Number} Green integer value.
	 */
	static hexToGreen( hex ) {
		return parseInt( hex.substring( 2, 4 ), 16 );
	}

	/**
	 * Parses a valid hex color string and returns the Blue RGB integer value.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {String} hex Hex color string.
	 * @return {Number} Blue integer value.
	 */
	static hexToBlue( hex ) {
		return parseInt( hex.substring( 4, 6 ), 16 );
	}

	/**
	 * Converts a valid hex color string to an RGB array.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {String} hex Hex color String (e.g. FF00FF)
	 * @return {Array} Array containing R, G, B values
	 */
	static hexToRGB( hex ) {
		hex = hex.replace( /[^0-9a-f]/g, '' );
		return [
			ColorUtil.hexToRed( hex ),
			ColorUtil.hexToGreen( hex ),
			ColorUtil.hexToBlue( hex )
		];
	}

	/**
	 * Converts an RGB component to a hex string.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {Number} component RGB value, integer between 0 and 255.
	 * @returns {String} Hex value string (e.g. FF)
	 */
	static componentToHex( component ) {
		var hex = component.toString( 16 );
		return hex.length == 1 ? '0' + hex : hex;
	}

	/**
	 * Converts RGB color components to a valid hex color string.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {Number} red RGB red value, integer between 0 and 255.
	 * @param {Number} green RGB green value, integer between 0 and 255.
	 * @param {Number} blue RGB blue value, integer between 0 and 255.
	 * @returns {String} Hex color string (e.g. FF0000)
	 */
	static rgbToHex( red, green, blue ) {
		var redHex = ColorUtil.componentToHex( red ),
			greenHex = ColorUtil.componentToHex( green ),
			blueHex = ColorUtil.componentToHex( blue );
		return `${redHex}${greenHex}${blueHex}`;
	}

	/**
	 * Converts HSB to RGB. Borrowed from https://www.cs.rit.edu/~ncs/color/t_convert.html
	 * @param {number} hue        Hue, expressed in degrees. If outside the range 0-360, will be converted.
	 * @param {number} saturation Saturation, integer between 0 and 100.
	 * @param {number} brightness Brightness, integer between 0 and 255.
	 * @returns {number[]} Array of [red, green, blue]
	 */
	static hsbToRgb( hue, saturation, brightness ) {
		var red, green, blue;

		hue = fitIntoRange( hue, 360 );

		if ( 0 === saturation ) {
			red = green = blue = brightness;
		} else {
			let huePartial = hue / 60; // There are six "sectors" in the hue, corresponding to the six primary colors.
			let sector = Math.floor( huePartial );
			let fractionalHue = huePartial - sector;
			let p = (brightness / 255) * (100 - saturation) * (255 / 100);
			let q = (brightness / 255) * (100 - saturation * fractionalHue) * (255 / 100);
			let t = (brightness / 255) * (100 - saturation * (1 - fractionalHue)) * (255 / 100);

			switch ( sector ) {
				case 0:
					red = brightness;
					green = t;
					blue = p;
					break;
				case 1:
					red = q;
					green = brightness;
					blue = p;
					break;
				case 2:
					red = p;
					green = brightness;
					blue = t;
					break;
				case 3:
					red = p;
					green = q;
					blue = brightness;
					break;
				case 4:
					red = t;
					green = p;
					blue = brightness;
					break;
				case 5:
					red = brightness;
					green = p;
					blue = q;
					break;
			}

		}

		return [Math.round( red ), Math.round( green ), Math.round( blue )];
	}

	/**
	 * Converts RGB to HSV. Adapted from https://www.cs.rit.edu/~ncs/color/t_convert.html
	 * @param {number} red   The red value, from 0 to 255.
	 * @param {number} green The green value, from 0 to 255.
	 * @param {number} blue  The blue value, from 0 to 255.
	 * @returns {number[]} Array of [hue, saturation, brightness]. For shades of gray, hue will be undefined.
	 */
	static rgbToHsb( red, green, blue ) {
		var hue, saturation, brightness;

		var min = Math.min( red, green, blue );
		var max = Math.max( red, green, blue );
		brightness = max;
		var delta = max - min;

		if ( max <= 0 ) {
			// It's black.
			hue = undefined; // Technically, black has no hue.
			saturation = brightness = 0;
		} else if ( min >= 255 ) {
			//It's white.
			hue = undefined; // Technically, white has no hue.
			saturation = 0;
			brightness = 255;
		} else {
			saturation = delta / max * 100;
			if ( saturation === 0 ) {
				hue = undefined; // Pure gray, so there's no hue.
			} else {
				if ( red === max ) {
					hue = (green - blue) / delta;
				} else if ( green === max ) {
					hue = 2 + (blue - red) / delta;
				} else {
					hue = 4 + (red - green) / delta;
				}

				hue = hue * 60; // convert to degrees
				hue = fitIntoRange( hue, 360 );
				hue = Math.round( hue );
			}
		}

		return [hue, Math.round( saturation ), Math.round( brightness )];
	}

	/**
	 * Returns a rgb array for given x, y values. Not actually an inverse of
	 * getXYPointFromRGB. Implementation of the instructions found on the
	 * Philips Hue iOS SDK docs: http://goo.gl/kWKXKl
	 *
	 * @author Q42 [original C#] Bryan Johnson [original JavaScript], Todd Dukart [conversion]
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} brightness
	 * @returns {Number[]}
	 */
	static getRGBFromXYAndBrightness( x, y, brightness ) {
		var xyPoint = new XYPoint( x, y );

		if ( brightness === undefined ) {
			brightness = 1;
		}

		// Check if the xy value is within the color gamut of the lamp.
		// If not continue with step 2, otherwise step 3.
		// We do this to calculate the most accurate color the given light can actually do.
		if ( ! ColorUtil.isInLampsReach( xyPoint ) ) {
			// Calculate the closest point on the color gamut triangle
			// and use that as xy value See step 6 of color to xy.
			xyPoint = ColorUtil.getClosestReproduciblePoint( xyPoint );
		}

		// Calculate XYZ values Convert using the following formulas:
		var Y = brightness,
			X = (Y / xyPoint.y) * xyPoint.x,
			Z = (Y / xyPoint.y) * (1 - xyPoint.x - xyPoint.y);

		// Convert to RGB using Wide RGB D65 conversion.
		var rgb = [
			X * 1.612 - Y * 0.203 - Z * 0.302,
			- X * 0.509 + Y * 1.412 + Z * 0.066,
			X * 0.026 - Y * 0.072 + Z * 0.962
		];

		// Apply reverse gamma correction.
		rgb = rgb.map( function ( x ) {
			return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow( x, (1.0 / 2.4) ) - 0.055);
		} );

		// Bring all negative components to zero.
		rgb = rgb.map( function ( x ) {
			return Math.max( 0, x );
		} );

		// If one component is greater than 1, weight components by that value.
		var max = Math.max( rgb[0], rgb[1], rgb[2] );
		if ( max > 1 ) {
			rgb = rgb.map( function ( x ) {
				return x / max;
			} );
		}

		rgb = rgb.map( function ( x ) {
			return Math.floor( x * 255 );
		} );

		return rgb;
	};

	/**
	 * Convert a mired color temperature to RGB. Adapted from http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/.
	 * @param {number} miredColorTemperature
	 * @returns {number[]}
	 */
	static miredToRgb( miredColorTemperature ) {
		var kelvin = 1000000 / miredColorTemperature;
		var red, green, blue;

		// Calculate each color separately. Red:
		if ( kelvin < 6600 ) {
			red = 255;
		} else {
			red = (kelvin / 100) - 60;
			red = 329.698727446 * red ^ (- 0.1332047592);
		}

		// Green:
		if ( kelvin < 6600 ) {
			green = kelvin / 100;
			green = 99.4708025861 * Math.log( green ) - 161.1195681661
		} else {
			green = (kelvin / 100) - 60;
			green = 288.1221695283 * green ^ (- 0.0755148492);
		}

		// Blue:
		if ( kelvin >= 6600 ) {
			blue = 255;
		} else {
			blue = kelvin - 10;
			blue = 138.5177312231 * Math.log( blue ) - 305.0447927307;
		}

		var result = [red, green, blue];
		result = result.map( ( value ) => {
			value = Math.min( 255, value );
			value = Math.max( 0, value );
			return Math.round( value );
		} );

		return result;
	}

	/**
	 * Returns an XYPoint object containing the closest available CIE 1931
	 * coordinates based on the RGB input values.
	 *
	 * @author Q42 [original C#] Bryan Johnson [original JavaScript], Todd Dukart [conversion]
	 *
	 * @param {Number} red RGB red value, integer between 0 and 255.
	 * @param {Number} green RGB green value, integer between 0 and 255.
	 * @param {Number} blue RGB blue value, integer between 0 and 255.
	 * @return {XYPoint} CIE 1931 XY coordinates, corrected for reproducibility.
	 */
	static getXYPointFromRGB( red, green, blue ) {

		var r = (red > 0.04045) ? Math.pow( (red + 0.055) / (1.0 + 0.055), 2.4 ) : (red / 12.92),
			g = (green > 0.04045) ? Math.pow( (green + 0.055) / (1.0 + 0.055), 2.4 ) : (green / 12.92),
			b = (blue > 0.04045) ? Math.pow( (blue + 0.055) / (1.0 + 0.055), 2.4 ) : (blue / 12.92),

			X = r * 0.4360747 + g * 0.3850649 + b * 0.0930804,
			Y = r * 0.2225045 + g * 0.7168786 + b * 0.0406169,
			Z = r * 0.0139322 + g * 0.0971045 + b * 0.7141733,

			cx = X / (X + Y + Z),
			cy = Y / (X + Y + Z);

		cx = isNaN( cx ) ? 0.0 : cx;
		cy = isNaN( cy ) ? 0.0 : cy;

		//Check if the given XY value is within the colourreach of our lamps.
		var xyPoint = new XYPoint( cx, cy ),
			inReachOfLamps = ColorUtil.isInLampsReach( xyPoint );

		if ( ! inReachOfLamps ) {
			var closestPoint = ColorUtil.getClosestReproduciblePoint( xyPoint );
			cx = closestPoint.x;
			cy = closestPoint.y;
		}

		return new XYPoint( cx, cy );
	}

	/**
	 * Get the approximate luminance from RGB
	 *
	 * @author Todd Dukart
	 *
	 * @param {Number} red
	 * @param {Number} green
	 * @param {Number} blue
	 * @returns {Number}
	 */
	static getBrightnessFromRgb( red, green, blue ) {
		var brightness = parseInt( 0.2126 * red + 0.7152 * green + 0.0722 * blue );
		brightness = Math.min( 254, brightness );
		brightness = Math.max( 1, brightness );
		return brightness;
	}

}
