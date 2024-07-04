let mainModule = Process.getModuleByName('HSICS')
let aslr = mainModule.base.sub(0x100000000)
let slice = mainModule.base


let whites = [
    "TweakInject",
    "libhooker",
    "substrate",
    "SubstrateLoader",
    "SubstrateInserter",
    "SubstrateBootstrap",
    "ABypass", 
    "FlyJB",
    "substitute",
    "Cephei",
    "rocketbootstrap",
    "Electra",
    "libcycript.dylib",
    "RevealServer",
    "gum-js-loop",
    "frida-server"
]

let strstr = Module.findExportByName(null, 'strstr')


Interceptor.attach(strstr, {
    onEnter: function(_args) {
        let str1 = _args[0].readUtf8String()
        let str2 = _args[1].readUtf8String()
        // console.log(`strstr str1 : ${str1} , str2 : ${str2}`)
        this.isWhite = whites.includes(str2)
    },
    onLeave: function(_retval) {
        if (this.isWhite) {
            _retval.replace(false)
        }
        // console.log(`strstr res :${_retval != 0 ? 1 : 0}`)
    },
})



let strcmp = Module.findExportByName(null, 'strcmp')


Interceptor.attach(strcmp, {
    onEnter: function(_args) {
        let str1 = _args[0].readUtf8String()
        let str2 = _args[1].readUtf8String()
        // console.log(`strcmp str1 : ${str1} , str2 : ${str2}`)
        this.isWhite = false
        for (const white of whites) {
            if (str2.includes(white)) {
            	this.isWhite = true
            	break
            }
        }
    },
    onLeave: function(_retval) {
        if (this.isWhite) {
            _retval.replace(1)
        }
        // console.log(`strcmp res :${_retval == 0 ? 1 : 0}`)
    }
})