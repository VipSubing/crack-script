
let mainModule = Process.enumerateModules()[0]
let aslr = mainModule.base.sub(0x100000000)
let slice = mainModule.base
console.log(`mainModule aslr :${aslr}`)

// 监听 open 系统调用
Interceptor.attach(Module.findExportByName(null, 'open'), {
    onEnter: function (args) {
        this.path = Memory.readUtf8String(args[0]);
        
        // console.log(Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
    },
    onLeave: function (retval) {
        console.log(`open called fd: ${retval.toInt32()}, path: ${this.path}`);
        // console.log('open return value: ' + retval);
    }
});

// 监听 openat 系统调用
Interceptor.attach(Module.findExportByName(null, 'openat'), {
    onEnter: function (args) {
        this.path = Memory.readUtf8String(args[1]);
        console.log('openat called with path: ' + this.path);
    },
    onLeave: function (retval) {
        // console.log('openat return value: ' + retval);
    }
});

// 监听 read 系统调用
Interceptor.attach(Module.findExportByName(null, 'read'), {
    onEnter: function (args) {
        this.fd = args[0].toInt32();
        this.buf = args[1];
        this.count = args[2].toInt32();
        console.log(`read called with fd: ${this.fd}, count: ${this.count}`);
        if(this.count > 20) {
            console.log(Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
        }
    },
    onLeave: function (retval) {
        // if (retval.toInt32() > 0) {
        //     console.log('read return value: ' + retval + ', content: ' + Memory.readUtf8String(this.buf, Math.min(100, retval.toInt32())));
        // } else {
        //     console.log('read return value: ' + retval);
        // }
    }
});

// 监听 write 系统调用
Interceptor.attach(Module.findExportByName(null, 'write'), {
    onEnter: function (args) {
        this.fd = args[0].toInt32();
        this.buf = args[1];
        this.count = args[2].toInt32();
        console.log(`write called with fd: ${this.fd}, content: ` + Memory.readUtf8String(this.buf, Math.min(100, this.count)) + `, count: ${this.count}`);
    },
    onLeave: function (retval) {
        // console.log('write return value: ' + retval);
    }
});

// 监听 close 系统调用
Interceptor.attach(Module.findExportByName(null, 'close'), {
    onEnter: function (args) {
        this.fd = args[0].toInt32();
        console.log('close called with fd: ' + this.fd);
    },
    onLeave: function (retval) {
        // console.log('close return value: ' + retval);
    }
});

if (ObjC.available) {
    var NSFileManager = ObjC.classes.NSFileManager;
    var NSFileHandle = ObjC.classes.NSFileHandle;

    // Hook NSFileManager methods
    Interceptor.attach(NSFileManager['- fileExistsAtPath:'].implementation, {
        onEnter: function (args) {
            this.path = args[2]
            
        },
        onLeave: function (retval) {
            var path = ObjC.Object(this.path).toString();
            console.log(`fileExistsAtPath res: ${retval} path: ${path}`);
        }
    });

    // Hook file read
    Interceptor.attach(NSFileHandle['- readDataOfLength:'].implementation, {
        onEnter: function (args) {
            console.log('readDataOfLength: ' + args[2]);
        },
        onLeave: function (retval) {
            // console.log('readDataOfLength return value: ' + retval);
        }
    });

    // Hook file write
    Interceptor.attach(NSFileHandle['- writeData:'].implementation, {
        onEnter: function (args) {
            console.log('writeData: ' + args[2]);
        },
        onLeave: function (retval) {
            // console.log('writeData return value: ' + retval);
        }
    });
}