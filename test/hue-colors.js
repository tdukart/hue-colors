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
	} )

} );
