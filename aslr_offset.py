# aslr_offset.py

import lldb

def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand('command script add -f aslr_offset.print_aslr_offset aslr_offset')

def print_aslr_offset(debugger, command, result, internal_dict):
    # Get the target process
    target = debugger.GetSelectedTarget()
    # Get the main module (which is the executable)
    module = target.GetModuleAtIndex(0)
    # Get the file address of the main module
    file_addr = module.GetObjectFileHeaderAddress().GetLoadAddress(target)
    # Get the load address of the main module
    load_addr = module.GetObjectFileHeaderAddress().GetFileAddress()
    # Calculate the ASLR offset
    aslr_offset = load_addr - file_addr
    result.PutCString("ASLR Offset: 0x{:x}".format(aslr_offset))