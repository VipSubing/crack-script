from collections import defaultdict


func_start = "0x10009273C"
func_end = ""

# Input data
input_data = ""
with open("./trace_log.txt", 'r') as file:
    input_data = file.read()
 

total_table = {}

def generate_hash_table(input_data):
    hash_table = defaultdict(list)
    

    lines = input_data.replace(';', '').strip().split('\n')
    lines = [item for item in lines if len(item) != 0 and item != "\n" and item != " "]
    # print(lines)
    for line in lines:
        
        parts = line.split()
        
        address = hex(int(parts[0], 16))
        instruction = ' '.join(parts[1:])
        key = address

        

        values = hash_table[key]
        if values :
            values[1] += 1
        else:
            hash_table[key] = [instruction,1]
            if instruction.startswith('br'):
                br_index = lines.index(line)
                if br_index != len(lines)-1 :
                    next1 = lines[br_index + 1]
                    next_address = next1.split()[0]
                    hash_table[key].append(next_address)
                

        # if lines.index(line)  == 0:
        #     total_table["start"] = address

        # if lines.index(line)  == len(lines)-1:
        #     total_table["end"] = address



    return hash_table

# Generate and print the hash table
hash_table = generate_hash_table(input_data)
# for key, value in hash_table.items():
#     print(f'Key: {key}, Value: {value}')

total_table["ins"] = hash_table
total_table["start"] = func_start
total_table["end"] = func_end

import json


# Specify the file path
file_path = './fix_json.json'

# Write the hash table to a file in JSON format
with open(file_path, 'w') as file:
    json.dump(total_table, file, indent=3)

print(f'Hash table has been written to {file_path}')
