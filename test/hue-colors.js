import HueColors from '../src/index';

describe( 'Color creation', () => {

	it( 'can create a color from an RGB spec', () => {

		var color = HueColors.fromRgb( 128, 128, 128 );
		var rgb = color.toRgb();
		var cie = color.toCie();

		expect( color.red ).toEqual( 128 );

	} );

	it( 'can create a color from a CIE spec', () => {
		var color = HueColors.fromCIE( .2, .3, .4 );
		var rgb = color.toRgb();
		var cie = color.toCie();

		expect( color.x ).toEqual( .2 );
	} );

	it( 'can create a color from a hex code', () => {
		var color = HueColors.fromHex( '#dedbef' );
		var rgb = color.toRgb();
		var cie = color.toCie();

		expect( color.red ).toEqual( 222 );
	} );

} );

describe( 'Color conversion', () => {

	it( 'properly converts RGB to Hex', () => {
		var color = HueColors.fromRgb( 16, 64, 255 );
		var hex = color.toHex();

		expect( hex ).toEqual( '1040ff' );
	} );

	it( 'properly converts Hex to RGB', () => {
		var color = HueColors.fromHex( 'ff00ff' );
		var rgb = color.toRgb();

		expect( rgb ).toEqual( [255, 0, 255] );
	} );

	it( 'properly converts RGB to HSB', () => {
		var orange = HueColors.fromRgb( 255, 127, 0 );
		var orangeHsb = orange.toHsb();
		expect( orangeHsb ).toEqual( [30, 100, 255] );

		var blue = HueColors.fromRgb( 0, 0, 255 );
		var blueHsb = blue.toHsb();
		expect( blueHsb ).toEqual( [240, 100, 255] );

		var black = HueColors.fromRgb( 0, 0, 0 );
		var blackHsb = black.toHsb();
		expect( blackHsb ).toEqual( [undefined, 0, 0] );

		var gray = HueColors.fromRgb( 160, 160, 160 );
		var grayHsb = gray.toHsb();
		expect( grayHsb ).toEqual( [undefined, 0, 160] );
	} );

	it( 'properly converts HSB to RGB', () => {
		var orange = HueColors.fromHsb( 30, 100, 255 );
		var orangeRgb = orange.toRgb();
		expect( orangeRgb ).toEqual( [255, 127, 0] );

		var blue = HueColors.fromHsb( 240, 100, 255 );
		var blueRgb = blue.toRgb();
		expect( blueRgb ).toEqual( [0, 0, 255] );

		var green = HueColors.fromHsb( 120, 100, 255 );
		var greenRgb = green.toRgb();
		expect( greenRgb ).toEqual( [0, 255, 0] );
	} );

	it( 'properly converts color temperature to RGB', () => {
		var cool = HueColors.fromCt( 153 );
		var coolRgb = cool.toRgb();
		expect( coolRgb ).toEqual( [255, 255, 255] );

		var warm = HueColors.fromCt( 500 );
		var warmRgb = warm.toRgb();
		expect( warmRgb ).toEqual( [255, 137, 255] );
	} );

	it( 'refuses to convert RGB to color temperature', () => {
		var rgbLight = HueColors.fromRgb( 0, 255, 255 );
		var rgbCt = rgbLight.toCt();
		expect( rgbCt ).toBeUndefined();
	} );

	it( 'allows lights defined with color temperature to return their color temperature', () => {
		var ctLight = HueColors.fromCt( 200 );
		var ctLightCt = ctLight.toCt();
		expect( ctLightCt ).toEqual( 200 );
	} );

} );
