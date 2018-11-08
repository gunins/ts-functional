const rollup = require('rollup-stream');
const through = require('through2');
const source = require('vinyl-source-stream');
const fs = require('fs');

const includePaths = require('rollup-plugin-includepaths');
const forceBinding = require('rollup-plugin-force-binding');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const typescript = require('rollup-plugin-typescript');

//function for taking streams and returning streams;
let chain = (cb) => {
    return through.obj(function(chunk, enc, next) {
        let push = this.push.bind(this);
        cb(chunk, enc).pipe(through.obj((chunk, enc, done) => {
            push(chunk);
            done();
            next();
        }))
    });
};

let getFiles = (dir, files_) => {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
};

let excludePaths = getFiles(process.cwd() + '/src');


// extension for rollup, for executing any file in directory from src
let rollupStream = (srcDir, browser = false, format = 'cjs') => chain((chunk) => {
    const dir = srcDir[srcDir.length - 1] === '/' ? srcDir.substring(0, srcDir.length - 1) : srcDir;
    const baseDir = process.cwd() + dir + '/';
    const {path} = chunk;
    const moduleName = path.replace(baseDir, '').replace(/.ts$/,'.js');
    // const excluded = excludePaths.filter(file => file !== path);
    return rollup({
        input:   path,
        format,
        name:    moduleName,
        plugins: (browser ?
            [
                builtins(),
                resolve({
                    browser
                }),
                commonjs()

            ] : []).concat(
            [
                typescript({target: 'esnext'}),
                includePaths({
                    extensions: ['.js', '.mjs','.ts']
                })
            ])
    }).pipe(source(moduleName));
});

module.exports = rollupStream;
