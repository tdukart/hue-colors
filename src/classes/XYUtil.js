import XYPoint from './XYPoint';

/**
 * XY utilities. Many of the methods, as marked, were adapted from Bryan Johnson's work (http://bit.ly/2bHHjxd)
 */
export default class XYUtil {

	/**
	 * Returns the cross product of two XYPoints.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {XYPoint} p1 Point 1.
	 * @param {XYPoint} p2 Point 2.
	 * @return {Number} Cross-product of the two XYPoints provided.
	 */
	static crossProduct( p1, p2 ) {
		return (p1.x * p2.y - p1.y * p2.x);
	}

	/**
	 * Find the closest point on a line. This point will be reproducible by a Hue lamp.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {XYPoint} start The point where the line starts.
	 * @param {XYPoint} end The point where the line ends.
	 * @param {XYPoint} point The point which is close to the line.
	 * @return {XYPoint} A point that is on the line, and closest to the XYPoint provided.
	 */
	static getClosestPointOnLine( start, end, point ) {
		var AP = new XYPoint( point.x - start.x, point.y - start.y ),
			AB = new XYPoint( end.x - start.x, end.y - start.y ),
			ab2 = AB.x * AB.x + AB.y * AB.y,
			ap_ab = AP.x * AB.x + AP.y * AB.y,
			t = ap_ab / ab2;

		if ( t < 0.0 ) {
			t = 0.0;
		} else if ( t > 1.0 ) {
			t = 1.0;
		}

		return new XYPoint( start.x + AB.x * t, start.y + AB.y * t );
	}

	/**
	 * Returns the distance between two XYPoints.
	 *
	 * @author Bryan Johnson [original], Todd Dukart [conversion]
	 *
	 * @param {XYPoint} p1 The first point.
	 * @param {XYPoint} p2 The second point.
	 * @return {Number} The distance between points one and two.
	 */
	static getDistanceBetweenTwoPoints( p1, p2 ) {
		var dx = p1.x - p2.x, // horizontal difference
			dy = p1.y - p2.y; // vertical difference

		return Math.sqrt( dx * dx + dy * dy );
	}

}
