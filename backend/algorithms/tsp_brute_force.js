// give all permutation of the given array
// input: array, e.g. [1, 2, 3]
// output: all permutation of the array, e.g. [1, 2, 3], [1, 3, 2], [2, 1, 3]...
const permute = (array) => {
	// credits: https://medium.com/weekly-webtips/step-by-step-guide-to-array-permutation-using-recursion-in-javascript-4e76188b88ff
	if (array.length === 0) return [];
	if (array.length === 1) return [array];

	let results = [];

	for (let i = 0; i < array.length; i++) {
		const curr = array[i];
		const remains = array.filter((num) => num !== array[i]);

		const recur = permute(remains);

		for (let j = 0; j < recur.length; j++) {
			const result = [curr, ...recur[j]];
			results.push(result);
		}
	}

	return results;
};

// generate all paths given number of nodes
// input: integer, e.g. 3 (so there will are 2 packages, and 1 starting point of the driver)
// output: paths, e.g. [0, 1, 2, 0], [0, 2, 1, 0]
// explain: 0 is the starting point of the driver, after going through all points, back to the origin
const genPaths = (numberOfNodes) => {
	let array = [];

	for (let i = 1; i <= numberOfNodes; i++) {
		array.push(i);
	}

	let permuted_results = permute(array);

	let all_paths = permuted_results.map((result) => {
		result.unshift(0);
		result.push(0);
		return result;
	});

	return all_paths;
};

// give the shortest path given the distance matrix and all paths
// input: matrix (given by the google directions api)
// output: object {optimal path, shortest distance}
const getOptPath = (matrix) => {
	let all_paths = genPaths(matrix.length - 1);

	let distances = [];
	for (let i = 0; i < all_paths.length; i++) {
		let distance = 0;

		for (let j = 0; j < all_paths[i].length - 1; j++) {
			let origin = all_paths[i][j];
			let next = all_paths[i][j + 1];
			distance += matrix[origin][next];
		}

		distances.push(distance);
	}

	let shortest_distance = Math.min(...distances);
	let shortest_path =
		all_paths[
			distances.findIndex((element) => element === shortest_distance)
		];

	return { optPath: shortest_path, optDistance: shortest_distance };
};

module.exports = { getOptPath };
