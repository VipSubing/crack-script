let mainModule = Process.enumerateModules()[0]
let aslr = mainModule.base.sub(0x100000000)
let slice = mainModule.base
console.log(`mainModule aslr :${aslr}`)


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


function getSpace(_index) {
    let str = ""
    while(_index>0) {
        str += "  "
        _index --
    }
    return str
}

let fd_arr = []
// 监听 open 系统调用
Interceptor.attach(Module.findExportByName(null, 'open'), {
    onEnter: function (args) {
        this.path = args[0].readUtf8String();
        // console.log(Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
    },
    onLeave: function (retval) {
        if (this.path.includes("Documents/Caches/287332")) {
            fd_arr.push(retval.toInt32())
            console.log(`open called fd: ${retval.toInt32()}, path: ${this.path}`);
        }
        
    }
});

// 监听 read 系统调用
Interceptor.attach(Module.findExportByName(null, 'read'), {
    onEnter: function (args) {
        this.fd = args[0].toInt32();
        this.buf = args[1];
        this.count = args[2].toInt32();
        if (fd_arr.includes(this.fd)) {
            console.log(`read called with fd: ${this.fd}, count: ${this.count}`);
        }
        
    },
});

// 监听 close 系统调用
Interceptor.attach(Module.findExportByName(null, 'close'), {
    onEnter: function (args) {
        this.fd = args[0].toInt32();
        fd_arr = fd_arr.filter(item => item !== this.fd)
        console.log('close called with fd: ' + this.fd);
        
    },
});
