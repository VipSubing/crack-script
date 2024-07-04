
let mainModule = Process.enumerateModules()[0]
let aslr = mainModule.base.sub(0x100000000)
let slice = mainModule.base
console.log(`mainModule aslr :${aslr}`)


let addr = aslr.add(0x100A12680)

let _write_text_addr = Module.findExportByName(null, '_write_text')
let _write_text  = new NativeFunction(
    _write_text_addr,
    'int', // Return type
    ['pointer'] // Argument types
);

let _write_close_addr = Module.findExportByName(null, '_write_close')
let _write_close  = new NativeFunction(
    _write_close_addr,
    'int', // Return type
    [] // Argument types
);

var log_count = 0
var log_text = ""

// var className = 'ViewController'
// var funcName = '- viewDidLoad'
// var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]')
// var addr = hook.implementation

// 监听 read 系统调用
Interceptor.attach(addr, {
    onEnter: function (args) {
        console.log("Interceptor.attach")
        var tid = Process.getCurrentThreadId();
            // 监听 Stalker 事件
        // Stalker.follow(tid, {
        //     events: {
        //         call: true, // CALL instructions: yes please
        //         ret: false, // RET instructions
        //         exec: false, // all instructions: not recommended as it's
        //         block: false, // block executed: coarse execution trace
        //         compile: false, // block compiled: useful for coverage
        //     },
            // threads: [mainThreadId], 

            // transform: function(iterator) {


            //     let instruction = iterator.next()
            //     if (!instruction) {
            //         return
            //     }

            //     const startAddress = instruction.address
            //     let isAppCode =
            //         startAddress.compare(mainModule.base) >= 0 &&
            //         startAddress.compare(mainModule.base.add(mainModule.size)) < 0

                
            //     while (instruction) {
            //         if (isAppCode) {
            //             // let insText = `${instruction.toString()}`
            //             // let text = `${instruction.address.sub(aslr)} ${insText};`
            //             let address = instruction.address.sub(aslr)
            //             let addr_int = parseInt(address.toString(),16)
            //             if (addr_int > 0x1009a0000 || addr_int < 0x100b0000) {
            //             	log_count ++
            //             	log_text = log_text + (address.toString() + "\n")
            //                 if (log_count == 100) {
                            	
            //                 	let code = _write_text(Memory.allocUtf8String(log_text))
            //                     if (code != 0) {
            //                         console.log("write err")
            //                     }
            //                     log_count = 0
            //                     log_text = ""
            //                 }
            //             }
                        
            //         }
            //         iterator.keep()
            //         instruction = iterator.next()
            //     }
            // },
        // })
    },
    onLeave: function (retval) {
    	// _write_close()
        // console.log("close write")
        // if (retval.toInt32() > 0) {
        //     console.log('read return value: ' + retval + ', content: ' + Memory.readUtf8String(this.buf, Math.min(100, retval.toInt32())));
        // } else {
        //     console.log('read return value: ' + retval);
        // }
    }
});


// __int64 __fastcall sub_100A12680(
//         __int64 a1,
//         __int64 a2,
//         __int64 a3,
//         __int64 a4,
//         __int64 a5,
//         __int64 a6,
//         __int64 a7,
//         __int64 a8)
const addr0 = aslr.add(0x100A12680)
Interceptor.attach(addr0, {
    onEnter: function (args) {
        console.log(getSpace(0),"0x100A12680 : ", args[1], args[2], args[3], args[4], args[5], args[6], args[7] ,args[8])
    },
    onLeave: function (retval) {
        console.log(getSpace(0), "0x100A12680 ret : ",retval)
    }
});

// _int64 __fastcall sub_1009FA4E4(
//         __int64 a1,
//         __int64 a2,
//         __int64 a3,
//         char *a4,
//         __int64 a5,
//         __int64 a6,
//         __int64 a7,
//         __int64 a8)
const addr2 = aslr.add(0x1009FA4E4)
Interceptor.attach(addr2, {
    onEnter: function (args) {
        console.log(getSpace(2),"0x1009FA4E4 : ", args[1], args[2], args[3], args[4], args[5], args[6], args[7] ,args[8])
    },
    onLeave: function (retval) {
        console.log(getSpace(2),"0x1009FA4E4 ret : ",retval)
    }
});


// __int64 __fastcall sub_100A0C878(
//         __int64 a1,
//         __int64 a2,
//         __int64 a3,
//         const char *a4,
//         __int64 a5,
//         __int64 a6,
//         __int64 a7,
//         int *a8)
const addr3 = aslr.add(0x100A0C878)
Interceptor.attach(addr3, {
    onEnter: function (args) {
        console.log(getSpace(3),"0x100A0C878 : ", args[1], args[2], args[3], args[4], args[5], args[6], args[7] ,args[8])
        var tid = Process.getCurrentThreadId();
            // 监听 Stalker 事件
        Stalker.follow(tid, {
            events: {
                call: true, // CALL instructions: yes please
                ret: false, // RET instructions
                exec: false, // all instructions: not recommended as it's
                block: false, // block executed: coarse execution trace
                compile: false, // block compiled: useful for coverage
            },
            // threads: [mainThreadId], 

            transform: function(iterator) {


                let instruction = iterator.next()
                if (!instruction) {
                    return
                }

                const startAddress = instruction.address
                let isAppCode =
                    startAddress.compare(mainModule.base) >= 0 &&
                    startAddress.compare(mainModule.base.add(mainModule.size)) < 0

                
                while (instruction) {
                    if (isAppCode) {
                        // let insText = `${instruction.toString()}`
                        // let text = `${instruction.address.sub(aslr)} ${insText};`
                        let address = instruction.address.sub(aslr)
                        console.log(address)
                        // let addr_int = parseInt(address.toString(),16)
                        // if (addr_int > 0x1009a0000 || addr_int < 0x100b0000) {
                        //  log_count ++
                        //  log_text = log_text + (address.toString() + "\n")
                        //     if (log_count == 100) {
                                
                        //      let code = _write_text(Memory.allocUtf8String(log_text))
                        //         if (code != 0) {
                        //             console.log("write err")
                        //         }
                        //         log_count = 0
                        //         log_text = ""
                        //     }
                        // }
                        
                    }
                    iterator.keep()
                    instruction = iterator.next()
                }
            },
        })
    },
    onLeave: function (retval) {
        console.log(getSpace(3),"0x100A0C878 ret : ",retval)
    }
});


// __int64 __fastcall sub_1009D1E50(__int64 a1, __int64 a2, __int64 a3, __int64 a4, __int64 a5)
const addr4 = aslr.add(0x1009D1E50)
Interceptor.attach(addr4, {
    onEnter: function (args) {
        console.log(getSpace(4),"0x1009D1E50 : ", args[1], args[2], args[3], args[4], args[5])
    },
    onLeave: function (retval) {
        console.log(getSpace(4),"0x1009D1E50 ret : ",retval)
    }
});

// __int64 __fastcall sub_1009ED798(__int64 a1, __int64 a2)
const addr5 = aslr.add(0x1009ED798)
Interceptor.attach(addr5, {
    onEnter: function (args) {
        console.log(getSpace(5),"0x1009ED798 : ", args[1], args[2])
    },
    onLeave: function (retval) {
        console.log(getSpace(5),"0x1009ED798 ret : ",retval)
    }
});

// __int64 __fastcall sub_1009E8D28(__int64 a1, char *a2, __int64 a3, __int64 a4, __int64 a5)
const addr6 = aslr.add(0x1009E8D28)
Interceptor.attach(addr6, {
    onEnter: function (args) {
        console.log(getSpace(6),"0x1009E8D28 : ", args[1], args[2] ,args[3], args[4] , args[5])
    },
    onLeave: function (retval) {
        console.log(getSpace(6),"0x1009E8D28 ret : ",retval)
    }
});

// __int64 __fastcall sub_1009E8C08(__int64 a1, const char *a2, __int64 a3, __int64 a4, __int64 a5, int *a6)
const addr7 = aslr.add(0x1009E8C08)
Interceptor.attach(addr7, {
    onEnter: function (args) {
        console.log(getSpace(7),"0x1009E8C08 : ", args[1], args[2] ,args[3], args[4] , args[5], args[6])
    },
    onLeave: function (retval) {
        console.log(getSpace(7),"0x1009E8C08 ret : ",retval)
    }
});


// __int64 __fastcall sub_1009ABF54(__int64 a1, const char *a2, __int64 a3, __int64 a4, __int64 a5, int *a6)
const addr8 = aslr.add(0x1009ABF54)
Interceptor.attach(addr8, {
    onEnter: function (args) {
        console.log(getSpace(8),"0x1009ABF54 : ", args[1], args[2] ,args[3], args[4] , args[5], args[6])
    },
    onLeave: function (retval) {
        console.log(getSpace(8),"0x1009ABF54 ret : ",retval)
    }
});


// __int64 __fastcall sub_1009C14DC(__int64 a1, signed __int64 a2, void *a3, int a4, int *a5)
const addr9 = aslr.add(0x1009C14DC)
Interceptor.attach(addr9, {
    onEnter: function (args) {
        console.log(getSpace(9),"0x1009C14DC : ", args[1], args[2] ,args[3], args[4] , args[5])
    },
    onLeave: function (retval) {
        console.log(getSpace(9),"0x1009C14DC ret : ",retval)
    }
});


// __int64 __fastcall sub_100A63504(__int64 a1, __int64 a2, __int64 a3, __int64 a4, __int64 a5)
const addr10 = aslr.add(0x100A63504)
Interceptor.attach(addr10, {
    onEnter: function (args) {
        console.log(getSpace(10),"0x100A63504 : ", args[1], args[2] ,args[3], args[4] , args[5])
    },
    onLeave: function (retval) {
        console.log(getSpace(10),"0x100A63504 ret : ",retval)
    }
});

// __int64 __fastcall sub_100A60E88(
        // __int64 a1,
        // __int64 a2,
        // __int64 a3,
        // __int64 a4,
        // __int64 a5,
        // __int64 a6,
        // __int64 a7,
        // __int64 a8)
const addr11 = aslr.add(0x100A60E88)
Interceptor.attach(addr11, {
    onEnter: function (args) {
        console.log(getSpace(11),"0x100A60E88 : ", args[1], args[2], args[3], args[4], args[5], args[6], args[7] ,args[8])
    },
    onLeave: function (retval) {
        console.log(getSpace(11),"0x100A60E88 ret : ",retval)
    }
});


// __int64 __fastcall sub_100A5B220(
//         __int64 a1,
//         __int64 a2,
//         __int64 a3,
//         __int64 a4,
//         __int64 a5,
//         __int64 a6,
//         __int64 a7,
//         __int64 a8)
const addr12 = aslr.add(0x100A5B220)
Interceptor.attach(addr12, {
    onEnter: function (args) {
        console.log(getSpace(12),"0x100A5B220 : ", args[1], args[2], args[3], args[4], args[5], args[6], args[7] ,args[8])
    },
    onLeave: function (retval) {
        console.log(getSpace(12),"0x100A5B220 ret : ",retval)
    }
});


// __int64 __fastcall sub_100A56144(
//         pthread_mutex_t *a1,
//         __int64 a2,
//         __int64 a3,
//         __int64 a4,
//         __int64 a5,
//         __int64 a6,
//         __int64 a7)
const addr13 = aslr.add(0x100A56144)
Interceptor.attach(addr13, {
    onEnter: function (args) {
        console.log(getSpace(13),"0x100A56144 : ", args[1], args[2], args[3], args[4], args[5], args[6], args[7])
    },
    onLeave: function (retval) {
        console.log(getSpace(13),"0x100A56144 ret : ",retval)
    }
});

// __int64 __fastcall sub_100A4CEA4(__int64 a1, unsigned __int64 a2, __int64 a3, __int64 a4, _QWORD *a5)
const addr14 = aslr.add(0x100A4CEA4)
Interceptor.attach(addr14, {
    onEnter: function (args) {
        console.log(getSpace(14),"0x100A4CEA4 : ", args[1], args[2], args[3], args[4], args[5])
    },
    onLeave: function (retval) {
        console.log(getSpace(14),"0x100A4CEA4 ret : ",retval)
    }
});

// __int64 __fastcall sub_100A4D078(__int64 a1, __int64 a2, __int64 a3, unsigned int a4, __int64 *a5)
const addr15 = aslr.add(0x100A4D078)
Interceptor.attach(addr15, {
    onEnter: function (args) {
        console.log(getSpace(15),"0x100A4D078 : ", args[1], args[2], args[3], args[4], args[5])
    },
    onLeave: function (retval) {
        console.log(getSpace(15),"0x100A4D078 ret : ",retval)
    }
});

var lastTime = 0
function getSpace(_index) {
    let str = ""
    while(_index>0) {
        str += "  "
        _index --
    }
    let time = (new Date()).valueOf()
    str = `${time - lastTime} ` + str
    lastTime = time
    return str
}

