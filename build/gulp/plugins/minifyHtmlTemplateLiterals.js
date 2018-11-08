const through = require('through2');
const htmlminify = require('html-minifier').minify;

const minifyHtmlTemplateLiterals = options => through.obj(function(file, enc, next) {
    if (file.isBuffer()) {
        let regExp = /(?=[`])(?:`[^`\\]*(?:\\[\s\S][^`\\]*)*`)/g;
        let fileContent = file.contents.toString(enc);
        let chunks = fileContent.match(regExp) || [];
        let output = chunks.filter(chunk => /^`</.test(chunk))
            .map(chunk => ({
                source: chunk,
                target: '`' + htmlminify(chunk.replace(/`/g, ''), options) + '`'
            }))
            .reduce((str, {source, target}) => str.replace(source, target), fileContent);

        file.contents = Buffer.from(output, enc);

    }
    this.push(file);
    next();
});

module.exports = minifyHtmlTemplateLiterals;