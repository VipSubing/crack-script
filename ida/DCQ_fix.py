# coding:utf-8
# exec(open('/Users/bingsu/poke/script/DCQ_fix.py').read())

print("fix dcq...")

sa = 0x100EED93C
ea = 0x100EED994

for i in xrange(sa,ea,4):
	print("fix dcq inst as nop 0x%0x"%(i))
	idc.PatchDword(i,0xd503201f)
		