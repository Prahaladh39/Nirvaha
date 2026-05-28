import re

file_path = r'c:\Users\venkat66\OneDrive\Desktop\NirVahaApp\constants\collectionData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

gita_mappings = {}
for i in range(1, 16):
    gita_mappings[f'g-{i}'] = f'gita {i}.mp4'
gita_mappings['g-16'] = 'gita 5.mp4'
gita_mappings['g-17'] = 'gita 10.mp4'
gita_mappings['g-18'] = 'gita 12.mp4'

ih_mappings = {}
for i in range(1, 10):
    video_num = ((i - 1) % 4) + 1
    ih_mappings[f'ih-{i}'] = f'inner-healing {video_num}.mp4'

all_mappings = {**gita_mappings, **ih_mappings}

for item_id, video in all_mappings.items():
    pattern = r'({ id: \"' + item_id + r'\"[\s\S]*?coverImage: \"[^\"]+\")'
    replacement = r'\1, videoFile: require(\'../assets/videos/' + video + r'\')'
    content = re.sub(pattern, replacement, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated collectionData.ts with new mappings')
