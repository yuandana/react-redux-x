import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    input: `./src/index.js`,
    external: [
        'redux',
        'react-redux',
        'react',
        'react-dom',
        'react-is',
        'prop-types'
    ],
    output: [
        {
            file: `./dist/es/index.js`,
            format: 'es',
            name: '@yuandana/redux-x',
            globals: {
                redux: 'redux',
                'react-redux': 'reactRedux',
                react: 'React',
                'prop-types': 'PropTypes',
                'react-is': 'reactIs',
                'react-dom': 'reactDom'
            }
        },
        {
            file: `./dist/umd/index.js`,
            format: 'umd',
            name: '@yuandana/redux-x',
            globals: {
                redux: 'redux',
                'react-redux': 'reactRedux',
                react: 'React',
                'prop-types': 'PropTypes',
                'react-is': 'reactIs',
                'react-dom': 'reactDom'
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
                    },
                    '@babel/preset-react'
                ]
            ]
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        filesize()
    ]
};
