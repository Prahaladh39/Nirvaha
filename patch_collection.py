import re

file_path = r'c:\Users\venkat66\OneDrive\Desktop\NirVahaApp\constants\collectionData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('coverImage?: string;', 'coverImage?: string;\n  videoFile?: any;')

mappings = {
    'ys-1': 'Yoga sutra 1 mind waves.mp4',
    'ys-2': 'Yoga sutra 2 root cause.mp4',
    'ys-3': 'Yoga sutras 3 stillness ladder.mp4',
    'ys-4': 'Yoga Sutras 4 Abhyas engine.mp4',
    'ys-5': 'Yoga sutras 5 Vairagya Method.mp4',
    'ys-6': 'Yoga Sutras 6 Sankalp.mp4',
    'ys-7': 'Yoga Sutras 7 Inner Freedom.mp4',
    'r-1': 'Mind Reset 1 when mind stops.mp4',
    'r-2': 'Mind Reset 2 Worst Case.mp4',
    'r-3': 'Mind reset 3 Small decision big pressure.mp4',
    'r-4': 'Mind reset 4 Repeat repeat thinking.mp4',
    'r-5': 'mind reser 5 what is clarity.mp4',
    'l-1': 'Lifestyle OS -1 Dinacharya.mp4',
    'l-2': 'Lifestyle OS 2 - Guna Santulan.mp4',
    'l-3': 'Lifestyle OS 3 - Sync Food & Mind.mp4',
    'l-4': 'Lifestyle OS 4 - Art of sleep.mp4',
    'l-5': 'Lifestyle OS 5 - Control your senses.mp4',
    'l-6': 'Lifestyle OS 6 - Energy path.mp4'
}

for item_id, video in mappings.items():
    pattern = r'({ id: \"' + item_id + r'\"[\s\S]*?coverImage: \"[^\"]+\")'
    replacement = r'\1, videoFile: require(\'../assets/videos/' + video + r'\')'
    content = re.sub(pattern, replacement, content)

for item_id, video in mappings.items():
    if 'ys-' in item_id:
        # ys-1 is formatted differently in the file (multi-line)
        pattern2 = r'(id: \"' + item_id + r'\"[\s\S]*?coverImage: \"[^\"]+\")'
        replacement2 = r'\1,\n      videoFile: require(\'../assets/videos/' + video + r'\')'
        content = re.sub(pattern2, replacement2, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated collectionData.ts')
