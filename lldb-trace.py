# coding:utf-8

import threading
import lldb
import logging
import sys
import io
import time
import json
import re
from datetime import datetime
# exec(open('/Users/bingsu/poke/script/lldb-trace.py').read())
# Tracer().trace()


print("* Script Begin *")

def trace_callback(frame, bp_loc, extra_args, internal_dict):

	if targetOff+Tracer().aslr == bp_loc.GetLoadAddress():
		print("Start %s"%frame)

	pattern = r"^->\s+(.*)$"
	match = re.search(pattern, frame.Disassemble(), re.MULTILINE)
	if match:
	    str = match.group(1)



	addr = "%s"%hex(bp_loc.GetLoadAddress()-Tracer().aslr)

	pattern_replace = r"0x[0-9a-fA-F]+"
	str = re.sub(pattern_replace, addr, str)
	print(str)

	Tracer().insArr.append(str)
	
	# Tracer().resume()

	
	# print("loc :{}".format(bp_loc))
    
 
	debugger = frame.GetThread().GetProcess().Continue()
	

def aslr_offset():
    # Get the target process
    target = lldb.target
    # Get the main module (which is the executable)
    module = target.GetModuleAtIndex(0)
    # Get the file address of the main module
    file_addr = module.GetObjectFileHeaderAddress().GetLoadAddress(target)
    # Get the load address of the main module
    load_addr = module.GetObjectFileHeaderAddress().GetFileAddress()
    # Calculate the ASLR offset
    aslr_offset = file_addr - load_addr
    # result.PutCString("ASLR Offset: 0x{:x}".format(aslr_offset))
    return aslr_offset

class SingletonType(type):
	_instance_lock = threading.Lock()
	def __call__(cls, *args, **kwargs):
		if not hasattr(cls, "_instance"):
			with SingletonType._instance_lock:
				if not hasattr(cls, "_instance"):
					cls._instance = super(SingletonType,cls).__call__(*args, **kwargs)
		return cls._instance


class Tracer(metaclass=SingletonType):
	def __init__(self):
		self.brkArr = [];
		self.aslr = 0
		self.insArr = []
	

	def clean(self):
		print("[*] clean all others break point,set starttime to zero, set traceCounter to zero")
		# lldb.target.DeleteAllBreakpoints()
		for brk in self.brkArr:
			lldb.target.BreakpointDelete(brk.id)
		
		self.aslr = 0
		self.brkArr = []
		self.startOff = 0
		self.endOff = 0
		self.insArr = []

	def dump(self):
		print("dump Log")
		json_str = json.dumps(Tracer().insArr , indent=4)
		
		now = datetime.now()
		formatted_date_time = now.strftime("%Y-%m-%d %H:%M:%S")

		filename = "/Users/bingsu/poke/siyuan/%s.json"%formatted_date_time
		print("file name is %s"%filename)
		with open(filename,"w",encoding="utf-8") as f2:
			f2.write(json_str)

	def resume(self):
		lldb.target.GetProcess().Continue()

	def trace(self):

		self.clean()

		self.aslr = aslr_offset()
		print("aslr : " , "%s"%(hex(self.aslr)))

		self.startOff = targetOff + self.aslr
		self.endOff = targetOff + insLength + self.aslr

		print("[*] ready to make trace breakpoint")
		for addr in range(self.startOff , self.endOff+1 , 4):
			# sbAddr = lldb.target.BreakpointCreateByAddress(addr)
			print("[*] make trace breakpoint at address %s"%(hex(addr)))
			brk = lldb.target.BreakpointCreateByAddress(addr)
			brk.SetScriptCallbackFunction("trace_callback")
			brk.SetAutoContinue(True)
			self.brkArr.append(brk)
			

print("aslr : " , "%s"%(hex(aslr_offset())))
targetOff = 0x10018A21C
insLength = 0x500
