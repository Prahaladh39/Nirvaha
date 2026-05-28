file_path = r'c:\Users\venkat66\OneDrive\Desktop\NirVahaApp\constants\collectionData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r'require(\'', "require('")
content = content.replace(r'\')', "')")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed quotes in collectionData.ts')
