// 获取 NSHomeDirectory 方法地址
var NSHomeDirectory = Module.findExportByName('Foundation', 'NSHomeDirectory');
var homeDir = new NativeFunction(NSHomeDirectory, 'pointer', []);

// 调用 NSHomeDirectory
var result = new ObjC.Object(homeDir());
console.log('Sandbox Directory: ' + result.toString());