# coding:utf-8
# exec(open('/Users/bingsu/poke/script/test.py').read())

from keystone import *

from_addr = 0x100092758
target_addr = 0x1000928A8
op = target_addr - from_addr


ks = Ks(KS_ARCH_ARM64, KS_MODE_LITTLE_ENDIAN)
code = "b 0x%x"%op
print(code)
# code = "br              x6"
encode, _ = ks.asm(code)
# 将十进制数组转换为字符串
hex_string = ''.join(format(byte, '02x') for byte in encode[::-1])
print(hex_string)

# 将字符串转换为 long 类型
# long_value = int(hex_string,16)




