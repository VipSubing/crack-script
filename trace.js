let mainModule = Process.enumerateModules()[0]
let aslr = mainModule.base.sub(0x100000000)
let slice = mainModule.base
console.log(`mainModule : ${mainModule.name} , aslr :${aslr}`)



// var className = 'ViewController'
// var funcName = '- test'
// var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]')
// var addr = hook.implementation


// let addr = Module.findExportByName(null, 'objc_msgSend')

var addr = aslr.add(0x100a0c878)

// hook_call(addr , 0, 0, 0, false)
hook_call(addr, true, 0x100a0c878, 0x100a0c878+0x1000, true)

// Process.setExceptionHandler(function(details) {
//     console.log(Thread.backtrace(details.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
//     return false;
// });


// var isHooked = false

function hook_call(enter_addr, ins, loc, loc_end, readRegs) {
    // var index = 0
    // 10009E044
    var addr_off = loc
    var address = 0

    let end_offset = loc_end
    var end_address = 0

    var range = (loc && loc_end) & 1
    if (range) {
        address = aslr.add(addr_off)
        end_address = aslr.add(end_offset)
    }

    console.log("ins :", ins)
    console.log("readRegs :", readRegs)
    console.log("range :", range)
    console.log("start :", loc.toString(16))
    console.log("end :", loc_end.toString(16))

    var w_pattren = /^(w([0-9]|[1-2][0-9]|3[0-1]))$/
    var containRegs = []
    // 使用 Interceptor.attach 挂钩方法
    Interceptor.attach(enter_addr, {
        onEnter: function(_args) {
            // if (isHooked) {
            //     return
            // }
            // console.log("attach enter ")
            // console.log(Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
            // isHooked = true
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

                    const insAddress = instruction.address
                    let isAppCode =
                        insAddress.compare(mainModule.base) >= 0 &&
                        insAddress.compare(mainModule.base.add(mainModule.size)) < 0
                    console.log("insAddress:", instruction.address , "mainModule.base : " , mainModule.base)
                    let isFuncCode = false
                    if (range) {
                        isFuncCode =
                            insAddress.compare(address) >= 0 &&
                            insAddress.compare(end_address) === -1
                    }

                    const canEmitNoisyCode = iterator.memoryAccess === 'open'
                    let canOuput =
                        canEmitNoisyCode && isAppCode && ((range && isFuncCode) || !range)
                    let arr = []

                    if (canOuput && !ins) {
                        arr.push(
                            `func address :${instruction.address
                                .sub(mainModule.base)
                                .add(0x100000000)}`
                        )
                    }
                    console.log("canOuput :", canOuput , "isAppCode :", isAppCode ,  "isFuncCode : " , isFuncCode , "range :" , range, "canEmitNoisyCode:" , canEmitNoisyCode)

                    let blockInsCount = 0
                    while (instruction) {
                        if (canOuput && ins) {
                            blockInsCount++
                            // validInsCount += 1
                            let insText = `${instruction.toString()}`
                            let text = `${instruction.address.sub(aslr)} ${insText};`
                            let address = instruction.address
                            let completed = false
                            // let innerBlockFirst = blockFirst
                            if (readRegs) {
                                // 处理寄存器变化
                                iterator.putCallout(function(context) {
                                    if (completed) {
                                        return
                                    }
                                    completed = true
                                    // console.log(JSON.stringify(context))
                                    // runedInsCount += 1
                                    let regsMap = context

                                    for (const i in containRegs) {
                                        let reg = containRegs[i]
                                        let regKey = reg
                                        let isWReg = w_pattren.test(regKey)
                                        if (isWReg) {
                                            regKey = regKey.replace('w', 'x')
                                        } else if (regKey === 'x29') {
                                            regKey = 'fp'
                                        } else if (regKey === 'x30') {
                                            regKey = 'lr'
                                        }

                                        let val = regsMap[regKey]
                                        if (isWReg) {
                                            val = val >>> 0
                                        }
                                        text += `      ${reg} : 0x${val.toString(16)}`
                                        // text += `  int = ${val};`
                                        let str = ''
                                        try {
                                            let nativePointer = new NativePointer(val)
                                            str = nativePointer.readCString()
                                        } catch (e) {}

                                        text += `  str ?= ${str};`
                                    }

                                    arr.push(text)
                                    containRegs = getContainRegistArr(insText)
                                    if (arr.length === blockInsCount) {
                                        console.log('\n' + arr.join('\n'))
                                    }
                                })
                            } else {
                                arr.push(text)
                            }
                        }
                        iterator.keep()
                        instruction = iterator.next()
                    }
                    if (arr.length) {
                        console.log('\n' + arr.join('\n'))
                    }
                },
            })
        },
        onLeave: function(_retval) {
            // 输出方法返回值
        },
    })
}





/// 获取操作的寄存器
function getContainRegistArr(instruction) {
    let arr = instruction.split(/ |,/)

    const pattern = /^(((x|w|q|s)([0-9]|[1-2][0-9]|3[0-1]))|lr|sp|pc|fp)$/
    let result = []
    for (const i in arr) {
        let str = arr[i]
        if (pattern.test(str)) {
            result.push(str)
        }
    }
    return result
}