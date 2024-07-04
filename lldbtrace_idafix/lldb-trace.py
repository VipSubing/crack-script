# coding:utf-8

print("xxx")
# import threading
# import lldb
# import logging
# import sys
# import io
# import time
# import json


# exec(open('/Users/bingsu/poke/script/lldbtrace_idafix/lldb-trace.py').read())
# Tracer().trace()


# targetOff = 0x100185960
# insLength = 0x300

# print("* Script Begin *")
# def trace_callback(frame, bp_loc, extra_args, internal_dict):

	
# 	print("frame:", frame)
# 	print("bp_loc:", bp_loc)
# 	print("extra_args:", extra_args)
# 	print("internal_dict:", internal_dict)

	# addr = bp_loc.GetAddress().load_addr
	# Tracer()._traceCounter+=1;
	# idx = int((addr-self.functionStart)/4)
	# node = Tracer()._instructionarr[idx][0]
	# str = "%s   %s" %(addr ,node.mnemonic)
	# Tracer()._strArr.append(str)
	# node.increase();
	# Tracer().resume()
	# if Tracer().frame.IsEqual(frame):
	# 	Tracer().onTrace(bp_loc.GetAddress().load_addr)
	# else:
	# 	print("hit breakpoint on other frame 0x%x, dont trace"%(bp_loc.GetAddress().load_addr))
	# 	Tracer().resume()


# def finish_callback(frame, bp_loc, extra_args, internal_dict):
# 	print("function finish")
# 	json_str = json.dumps(Tracer()._strArr)
# 	print(json_str)
# 	filename = "/Users/bingsu/poke/siyuan/func1.json"
# 	print("file name is %s"%filename)
# 	with open(filename,"w",encoding="utf-8") as f2:
# 		f2.write(json_str)
# 	Tracer().clean()


# class InstructionNode(object):

# 	def __init__(self,sbinstruction):
# 		self.hitcounter = 0;
# 		self.addr = sbinstruction.GetAddress().load_addr
# 		self.comment = sbinstruction.comment
# 		self.is_branch = sbinstruction.is_branch;
# 		self.mnemonic = sbinstruction.mnemonic
# 		self.operands = sbinstruction.operands;
# 		self.data = (sbinstruction.GetData(lldb.target).uint32)[0]
# 		tmpdata8 = sbinstruction.GetData(lldb.target).uint8;
# 		self.dd1 = "%02x%02x%02x%02x"%(tmpdata8[0],tmpdata8[1],tmpdata8[2],tmpdata8[3]);
# 		self.dd2 = "%02x%02x%02x%02x"%(tmpdata8[3],tmpdata8[2],tmpdata8[1],tmpdata8[0]);
# 		self.br2 = 0

# 	def todict(self):
# 		d = {}
# 		d["hitcounter"]=self.hitcounter
# 		d["addr"]=self.addr
# 		d["comment"]=self.comment
# 		d["is_branch"]=self.is_branch
# 		d["mnemonic"]=self.mnemonic
# 		d["operands"]=self.operands
# 		d["data"]=self.data
# 		d["datahex"]=hex(self.data)
# 		d["dd1"]=self.dd1
# 		d["dd2"]=self.dd2
# 		d["br2"]=self.br2
# 		return d
	


# class SingletonType(type):
# 	_instance_lock = threading.Lock()
# 	def __call__(cls, *args, **kwargs):
# 		if not hasattr(cls, "_instance"):
# 			with SingletonType._instance_lock:
# 				if not hasattr(cls, "_instance"):
# 					cls._instance = super(SingletonType,cls).__call__(*args, **kwargs)
# 		return cls._instance


# class Tracer(metaclass=SingletonType):
# 	def __init__(self):
# 		self.brkArr = [];
# 		self.aslr = 0

	
# 	def processASLR(self):
# 		print("[*] process ASLR")
# 		# returnObject = lldb.SBCommandReturnObject()
# 		# lldb.debugger.GetCommandInterpreter().HandleCommand('image list -o -f', returnObject)
# 		# output = returnObject.GetOutput()
# 		# match = re.match(r'.+(0x[0-9a-fA-F]+)', output)
# 		# if match:
# 		# 	ASLRHexStr:str = match.group(1)
# 		# 	ASLR = int(ASLRHexStr,16)
# 		# 	self.aslr = ASLR

# 		target = lldb.debugger.GetSelectedTarget()
# 	    # 获取模块列表，通常第一个模块是主模块（即可执行文件）
# 	    module = target.GetModuleAtIndex(0)
# 	    header = module.GetObjectFileHeaderAddress()
# 	    aslr = header.GetLoadAddress(target)
# 	    return aslr

	


# 	def clean(self):
# 		print("[*] clean all others break point,set starttime to zero, set traceCounter to zero")
# 		# lldb.target.DeleteAllBreakpoints()
# 		for brk in self.brkArr:
# 			lldb.target.BreakpointDelete(brk.id)
		
# 		self.aslr = 0
# 		self.brkArr = []
# 		self.startOff = 0
# 		self.endOff = 0

# 	def resume(self):
# 		lldb.target.process.Continue()


# 	def trace(self):

# 		self.clean()

# 		self.aslr = processASLR()
# 		print("aslr : " , "%s"%(hex(self.aslr)))

# 		self.startOff = targetOff + self.aslr
# 		self.endOff = targetOff + insLength + self.aslr

# 		print("[*] ready to make trace breakpoint")
# 		for addr in range(startOff , endOff+1 , 4):
# 			brk = lldb.target.BreakpointCreateBySBAddress(addr)
# 			brk.SetScriptCallbackFunction("trace_callback")
# 			brk.SetAutoContinue(True)
# 			self.brkArr.append(brk)
# 			print("[*] make trace breakpoint at address %s"%(hex(addr)))


