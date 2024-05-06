module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'no-unused-vars': 'warn', // Changes the rule severity to 'warn' instead of 'error'
    'react/react-in-jsx-scope': 'off', // Turns off this rule if using React 17+ where React import is not needed
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Helps avoid line-ending issues between different OSs
      },
    ],
  },
};
