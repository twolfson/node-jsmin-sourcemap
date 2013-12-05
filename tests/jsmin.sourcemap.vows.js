module.exports = {
  "is debuggable": function (info) {
    var actualCode = info.code.actual;
    fs.writeFileSync('debug.min.js', actualCode, 'utf8');
  },
  "_is debuggable": function (info) {
    return info;
  }
};