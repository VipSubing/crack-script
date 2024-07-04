# coding:utf-8
import json
from keystone import *
# exec(open('/Users/bingsu/poke/script/ida-fix.py').read())


def getOpNum(addr , opIndex):

	add_op2 = idc.GetOpnd(addr , opIndex)

	try:
		if add_op2.startswith("#"):
			add_op2 = add_op2[1:]
		if add_op2.startswith("="):
			add_op2 = add_op2[1:]

		if add_op2.startswith("0x"):
			add_op2_num = int(add_op2,16)
		else :
			add_op2_num = int(add_op2)
	except Exception as e:
	    # 在出现异常时执行的代码
	    print("发生了异常：", e)
	    add_op2_num = -1
	
	return add_op2_num

def findFuncEnd(start):
	end = 0
	max_size = 0x4000
	if idc.GetDisasm(start).startswith("SUB             SP, SP"):
		stack_size = getOpNum(start , 2)
		# 寻找连续的stp
		stp = 0
		index = 0
		while 1 :
			index += 1
			if idc.GetDisasm(start+4*index).startswith("STP"):
				stp += 1
			else:
				break
		# print("stp :%d"%stp)

		# 寻找add sp 结尾
		index = 0
		while 1 :
			index += 1
			addr = start+4*index
			if idc.GetDisasm(addr).startswith("ADD             SP, SP") and getOpNum(start+4*index , 2) == stack_size :
				 # 找到了,校验连续的stp 和 ldp是否匹配
				print("找到了0x%x,校验连续的stp 和 ldp是否匹配"%addr)
				ldp = 0
				_index = 0
				while 1 :
					_index += 1

					if idc.GetDisasm(addr-4*_index).startswith("LDP"):
						ldp += 1
					else:
						break
				# print("ldp : %d"%ldp)
				if stp == ldp :
					end = addr
					break
			if index > max_size/4:
				print("over max_size")
				break

	return end
			

class Fixer(object):
	def __init__(self,jsonpath):
		self._jsonpath = jsonpath
		self._dict = None
		
	def processJSON(self):
		with open(self._jsonpath,'r') as f:
			self._dict = json.load(f)
		if len(self._dict["end"]) == 0 :

			start = int(self._dict["start"] , 16)
			end = findFuncEnd(start)
			if end == 0:
				raise Error("end error")
			self._dict["end"] = "0x%x"%(end+4)
			print(self._dict["end"])
			# print(self._dict)

	def fix_function_range(self):
		s_str = self._dict["start"]
		e_str = self._dict["end"]
		s = int(s_str , 16)
		e = int(e_str , 16)
		
		print("make unknow")
		for i in xrange(s,e,4):
			idc.MakeUnkn(i,0)

		print("make code")
		for i in xrange(s,e,4):
			idc.MakeCode(i)

		print("make funct at 0x%x - 0x%x"%(s,e))
		idc.MakeFunction(s,e)

	def fix_unknow_as_nop(self):
		a = self._dict["aslr"]
		sa = self._dict["func_start"]
		ea = self._dict["func_end"]
		arr = self._dict["instruction_arr"]
		for each in arr:
			if each["comment"] == "unknown opcode":
				print("try to fix unknow opcode at 0x%x"%(each["addr"]-a));
				idc.PatchDword(each["addr"]-a, 0xd503201f)
		s = sa - a
		e = ea - a
		print("make code")
		for i in xrange(s,e,4):
			idc.MakeCode(i)


	
	def fix_br(self):
		print("fix br...")
		s_str = self._dict["start"]
		e_str = self._dict["end"]
		sa = int(s_str , 16)
		ea = int(e_str , 16)



		for addr in xrange(sa,ea,4):

			if idc.GetMnem(addr).lower() == "br":
				print("br addr :0x%x"%addr)

				# 通过sub_子函数计算，to b loc_xx
				br_reg = idc.GetOpnd(addr , 0)
				addr1 = addr-4
				# print("br :" , br_reg)
				if idc.GetMnem(addr1).lower() == "add" and idc.GetOpnd(addr1 , 0) == br_reg:
					bl_target_addr = None
					if idc.GetMnem(addr1-4).lower() == "bl":
						bl_addr = addr1-4
						bl_target_addr = idc.GetOperandValue(addr1-4 , 0)
					elif idc.GetMnem(addr1-8).lower() == "bl":
						bl_target_addr = idc.GetOperandValue(addr1-8 , 0)
						bl_addr = addr1-8
					elif idc.GetMnem(addr1-12).lower() == "bl":
						bl_target_addr = idc.GetOperandValue(addr1-12 , 0)
						bl_addr = addr1-12

					if bl_target_addr != None:
						
						if idc.GetDisasm(bl_target_addr).startswith("SUB             SP, SP") and \
							idc.GetDisasm(bl_target_addr+4).startswith("STP             X29, X30") and \
							idc.GetDisasm(bl_target_addr+8).startswith("LDR             X0") and \
							idc.GetDisasm(bl_target_addr+12).startswith("LDP             X29, X30") and \
							idc.GetDisasm(bl_target_addr+16).startswith("ADD             SP, SP") and \
							idc.GetDisasm(bl_target_addr+20).startswith("RET") :
							

							lr_addr = bl_addr + 4

							# add_op2 = idc.GetOpnd(addr1 , 2)
							# #
							

							# if add_op2.startswith("#"):
							# 	add_op2 = add_op2[1:]

							# if add_op2.startswith("0x"):
							# 	add_op2_num = int(add_op2,16)
							# else :
							# 	add_op2_num = int(add_op2)
							
							add_op2_num = getOpNum(addr1 , 2)
							target_addr = lr_addr + add_op2_num
							# print("lr_addr: 0x%x"%lr_addr)
							# print("add_op2_num:0x%x"%add_op2_num)
							# print("addr:0x%x"%addr)
							op = target_addr - addr
							# print("0x%x"%target_addr , "0x%x"%addr)
							ks = Ks(KS_ARCH_ARM64, KS_MODE_LITTLE_ENDIAN)
							code = "b 0x%x"%op
							# code = "br              x6"
							
							print("fix1 0x%x : %s to      %s"%(addr , idc.GetDisasm(addr) , code))
							encode, _ = ks.asm(code)
							# 将十进制数组转换为字符串
							hex_string = ''.join(format(byte, '02x') for byte in encode[::-1])

							# 将字符串转换为 long 类型
							long_value = int(hex_string,16)

							

							idc.PatchDword(addr , long_value)	
							idc.MakeCode(addr)
							

				# 通过 trace 计算, to b loc_xx
				if idc.GetMnem(addr).lower() == "br":

					key = "0x%x"%addr
					dict = self._dict["ins"]
					
					arr = dict.get(key)

					if arr != None and len(arr) == 3 :
						target_addr = int(arr[2] , 16)

						op = target_addr - addr

						ks = Ks(KS_ARCH_ARM64, KS_MODE_LITTLE_ENDIAN)
						code = "b 0x%x"%op
						# code = "br              x6"
						
						print("fix2 0x%x : %s to      %s"%(addr , idc.GetDisasm(addr) , code))
						encode, _ = ks.asm(code)
						# 将十进制数组转换为字符串
						hex_string = ''.join(format(byte, '02x') for byte in encode[::-1])

						# 将字符串转换为 long 类型
						long_value = int(hex_string,16)
						idc.PatchDword(addr , long_value)	
						idc.MakeCode(addr)

				# 通过 mov reg 计算, to b loc_xx
				if idc.GetMnem(addr).lower() == "br":
					addr1 = addr - 4
					print("br : 0x%x , ins :%s"%(addr1 , idc.GetDisasm(addr1)))
					if idc.GetMnem(addr1).lower() == "ldr" and idc.GetOpnd(addr1 , 0) == br_reg:
						
						op = getOpNum(addr1,1)
						if op != -1:
							ks = Ks(KS_ARCH_ARM64, KS_MODE_LITTLE_ENDIAN)
							code = "b 0x%x"%op
							# code = "br              x6"
							
							print("fix3 0x%x : %s to      %s"%(addr , idc.GetDisasm(addr) , code))
							encode, _ = ks.asm(code)
							# 将十进制数组转换为字符串
							hex_string = ''.join(format(byte, '02x') for byte in encode[::-1])

							# 将字符串转换为 long 类型
							long_value = int(hex_string,16)
							idc.PatchDword(addr , long_value)	
							idc.MakeCode(addr)


				if idc.GetMnem(addr).lower() == "br":
					print("br 0x%x not handle"%addr)

						

				# 		idc.PatchDword(addr , long_value)	
				# 		idc.MakeCode(addr)
							

		



	def fix_unruned_as_nop(self):
		print("fix unruned...")
		s_str = self._dict["start"]
		e_str = self._dict["end"]
		sa = int(s_str , 16)
		ea = int(e_str , 16)

		ins = self._dict["ins"]

		for i in xrange(sa,ea,4):
			key = "0x%x"%i
			# print(key)
			if not ins.get(key) :
				print("fix unruned inst as nop 0x%0x"%(i))
				idc.PatchDword(i,0xd503201f)
			

		
				

	def restore(self):
		print("restore from json")
		a = self._dict["aslr"]
		sa = self._dict["func_start"]
		ea = self._dict["func_end"]
		s = sa - a
		e = ea - a
		arr = self._dict["instruction_arr"]
		for each in arr:
			abspc = each["addr"] - a
			value = int(each["dd2"],16)
			print("restore value at 0x%0x for value 0x%0x"%(abspc,value))
			idc.PatchDword(abspc,value)
		for i in xrange(s,e,4):
			idc.MakeCode(i)



	def b(self,op):
		return 0b00010100000000000000000000000000|(int(op/4) & 0b00000011111111111111111111111111)

	@property
	def jsonpath(self):
		return self._jsonpath
	@jsonpath.setter
	def jsonpath(self, value):
		self._jsonpath = value
		self.processJSON()



fixer = Fixer("/Users/bingsu/poke/script/fix_json.json")
fixer.processJSON()
fixer.fix_function_range()
# fixer.fix_unruned_as_nop()
fixer.fix_br()
print("fix completed")
# fixer.fix_unknow_as_nop()

# fixer.restore()

