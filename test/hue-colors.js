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
		var orange = HueColors.fromRgb( 254, 93, 0 );
		var orangeHsb = orange.toHsb();
		expect( orangeHsb[0] ).toBeWithinRange( 3995, 4005 );
		expect( orangeHsb[1] ).toEqual( 254 );
		expect( orangeHsb[2] ).toEqual( 254 );

		var blue = HueColors.fromRgb( 0, 0, 255 );
		var blueHsb = blue.toHsb();
		expect( blueHsb[0] ).toBeWithinRange( 43685, 43695 );
		expect( blueHsb[1] ).toEqual( 254 );
		expect( blueHsb[2] ).toEqual( 254 );

		var black = HueColors.fromRgb( 0, 0, 0 );
		var blackHsb = black.toHsb();
		expect( blackHsb ).toEqual( [undefined, 0, 0] );

		var gray = HueColors.fromRgb( 160, 160, 160 );
		var grayHsb = gray.toHsb();
		expect( grayHsb ).toEqual( [undefined, 0, 160] );
	} );

	it( 'properly converts HSB to RGB', () => {
		var orange = HueColors.fromHsb( 4000, 254, 254 );
		var orangeRgb = orange.toRgb();
		expect( orangeRgb ).toEqual( [254, 93, 0] );

		var blue = HueColors.fromHsb( 43690, 254, 254 );
		var blueRgb = blue.toRgb();
		expect( blueRgb ).toEqual( [0, 0, 254] );

		var green = HueColors.fromHsb( 21845, 254, 254 );
		var greenRgb = green.toRgb();
		expect( greenRgb ).toEqual( [0, 254, 0] );
	} );

	it( 'properly converts color temperature to RGB', () => {
		var cool = HueColors.fromCt( 153, 254 );
		var coolRgb = cool.toRgb();
		expect( coolRgb ).toEqual( [255, 255, 255] );

		var warm = HueColors.fromCt( 500, 254 );
		var warmRgb = warm.toRgb();
		expect( warmRgb ).toEqual( [255, 137, 255] );
	} );

	it( 'refuses to convert RGB to color temperature', () => {
		var rgbLight = HueColors.fromRgb( 0, 255, 255 );
		var rgbCt = rgbLight.toCt();
		expect( rgbCt ).toBeUndefined();
	} );

	it( 'allows lights defined with color temperature to return their color temperature', () => {
		var ctLight = HueColors.fromCt( 200, 254 );
		var ctLightCt = ctLight.toCt();
		expect( ctLightCt ).toEqual( 200 );
	} );

} );
