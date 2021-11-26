module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    /*
    "off" 或 0 - 关闭规则
    "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
    "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
    */
    rules: {
        // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': 'off',
        // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': 'off',
        'no-unused-vars': 'off',
        "no-restricted-syntax": 'off'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}