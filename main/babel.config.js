module.exports = {
  env: {
    development: {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        [
          'module:react-native-dotenv',
          {
            envName: 'APP_ENV',
            moduleName: '@env',
            path: '.env',
            blocklist: null,
            allowlist: null,
            // "blacklist": null, // DEPRECATED
            // "whitelist": null, // DEPRECATED
            safe: false,
            allowUndefined: true,
            verbose: false,
          },
        ],
        [
          "babel-plugin-inline-import", {
            "extensions": [
              ".svg"
            ]
          }
        ],
        [
          'react-native-reanimated/plugin',
          {
            relativeSourceLocation: true,
          },
        ],
      ],
    },
    production: {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        [
          'module:react-native-dotenv',
          {
            envName: 'APP_ENV',
            moduleName: '@env',
            path: '.env',
            blocklist: null,
            allowlist: null,
            safe: false,
            allowUndefined: true,
            verbose: false,
          },
        ],
        [
          "babel-plugin-inline-import", {
            "extensions": [
              ".svg"
            ]
          }
        ],
        ['transform-remove-console'],
        [
          'react-native-reanimated/plugin',
          {
            relativeSourceLocation: true,
          },
        ],
      ],
    },
  },
};
