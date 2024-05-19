function levenshteinDistance(s1: string, s2: string): number {
	const len1 = s1.length;
	const len2 = s2.length;
	const matrix: number[][] = [];
	for (let i = 0; i <= len1; i++) {
		matrix[i] = [i];
	}
	for (let j = 0; j <= len2; j++) {
		matrix[0][j] = j;
	}
	for (let i = 1; i <= len1; i++) {
		for (let j = 1; j <= len2; j++) {
			if (
				s1.charAt(i - 1).toLowerCase() ===
				s2.charAt(j - 1).toLowerCase()
			) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
				);
			}
		}
	}
	return matrix[len1][len2];
}

export function compareStrings(str1: string, str2: string): boolean {
	const lowerString1 = str1.toLowerCase();
	const lowerString2 = str2.toLowerCase();
	if (
		lowerString1.includes(lowerString2) ||
		lowerString2.includes(lowerString1)
	) {
		return true;
	}
	const threshold = 3; // number of marks
	const distance = levenshteinDistance(lowerString1, lowerString2);
	return distance <= threshold;
}
