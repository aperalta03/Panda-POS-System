import random
# Open the destination file in write mode
with open('destination.txt', 'w') as destination_file:
    # Write the content to the destination file
    for i in range(75766):
        if(i != 0):
            destination_file.write('(')
            destination_file.write(str(i))
            destination_file.write(", ")
            destination_file.write(str(random.choice(range(1,25))))
            destination_file.write("),\n")
            destination_file.write('(')
            destination_file.write(str(i))
            destination_file.write(", ")
            destination_file.write(str(random.choice(range(1,25))))
            destination_file.write("),\n")