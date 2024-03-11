module.exports = {
	rootDir: '../../../',
	displayName: 'Migration unit tests',
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	testMatch: [ '**/lib/Migration/js/**/*.test.[jt]s' ],
	transform: {
		'^.+\\.[jt]sx?$':
			'<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
	},
	testEnvironment: 'jest-environment-jsdom',
	globals: {
		genesisBlocksMigration: {
			isPro: undefined,
		},
	},
	testPathIgnorePatterns: [ '<rootDir>/.git', '<rootDir>/node_modules' ],
	coveragePathIgnorePatterns: [ '<rootDir>/node_modules' ],
	coverageReporters: [ 'lcov' ],
	coverageDirectory: '<rootDir>/coverage',
	setupFilesAfterEnv: [ '<rootDir>/lib/Migration/js/jest.setup.js' ],
};
