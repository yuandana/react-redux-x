import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { eslint } from 'rollup-plugin-eslint';

export default {
    input: `./src/index.js`,
    external: ['redux'],
    output: [
        {
            file: `./dist/es/index.js`,
            format: 'es',
            name: '@yuandana/redux-x',
            globals: {
                redux: 'redux'
            }
        },
        {
            file: `./dist/umd/index.js`,
            format: 'umd',
            name: '@yuandana/redux-x',
            globals: {
                redux: 'redux'
            }
        }
    ],
    plugins: [
        resolve({ mainFields: ['module', 'jsnext', 'main'] }),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false
                    }
                ]
            ]
        }),
        eslint({
            include: ['src/**'],
            exclude: ['node_modules/**'],
            throwOnError: true,
            throwOnWarning: true
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        filesize()
    ]
};
