let mainModule = Process.enumerateModules()[0]
let aslr = mainModule.base.sub(0x100000000)
let slice = mainModule.base
console.log(`mainModule aslr :${aslr}`)


var className = 'UIViewController'
var funcName = '- presentViewController:animated:completion:'
var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]')

// var alert = aslr.add(0x10032D5F0)
// Interceptor.attach(alert, {
//     onEnter: function(_args) {
//         console.log(Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
//     }
// })


let updateAlertAddr = aslr.add(0x100A2F048)
Memory.patchCode(updateAlertAddr, 4, code => {
    const cw = new Arm64Writer(code, { pc: updateAlertAddr });
    cw.putBytes(hexToBytes("000080D2"));
    cw.flush();
});

const CFNetwork = Module.getExportByName('CFNetwork', 'CFNetworkCopySystemProxySettings');
console.log("[+] Found CFNetwork as " + ptr(CFNetwork))

Interceptor.attach(CFNetwork, {
    onLeave(retval) {
        if (ObjC.available) {
            
            var NSDict = ObjC.classes.NSMutableDictionary.alloc().init();
            var data = getDefaultNetworkingConfig();
            var keys = Object.keys(data);

            for (var i = 0; i < keys.length; i++) {
                NSDict.setObject_forKey_(keys[0], data[keys[0]]);
            }

            console.log("[+] Bypassing with iOS default networking values")
            retval.replace(NSDict)
        }
        
    }
});


const resolver = new ApiResolver('objc');
const matches = resolver.enumerateMatches('-[UIApplication* *terminateWithSuccess*]');
let terAddr = matches[0].address

console.log(DebugSymbol.fromAddress(terAddr))


function getDefaultNetworkingConfig() {
    var config = {
        "FTPPassive": "1",
        "ExceptionsList": "(\"*.local\", \"169.254/16\")",
        "__SCOPED__": "{ en0 = {ExceptionsList = (\"*.local\", \"169.254/16\"); FTPPassive = 1; }; }"
    }

    return config
}


function stringToBytes(str) {
    return hexToBytes(stringToHex(str))
}

function stringToHex(str) {
    return str
        .split('')
        .map(function(c) {
            return ('0' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
}

function hexToBytes(hex) {
    let bytes = []
    for (let c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16))
    return bytes
}

function hexToString(hexStr) {
    let hex = hexStr.toString()
    let str = ''
    for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return str
}