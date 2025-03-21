import os
import json

music_dir = "Musics_modif"
output_js = "music_data.js"

def parse_directory(root_path):
    allmusic = []
    radifs = {}         # will hold: { root_index: radif_name }
    dastgahs_map = {}   # will hold: { root_index: { dastgah_index: dastgah_name, ... } }
    
    # List all root directories (radifs)
    roots = sorted([d for d in os.listdir(root_path) if os.path.isdir(os.path.join(root_path, d))])
    
    for root_index, root in enumerate(roots):
        # For radifMap, here we append a number to the folder name (e.g. "Karimi1", "Karimi2", ...)
        radifs[root_index] = root
        
        root_path_full = os.path.join(root_path, root)
        # List all subdirectories (dastgahs) inside this radif
        dastgah_dirs = sorted([d for d in os.listdir(root_path_full) if os.path.isdir(os.path.join(root_path_full, d))])
        dastgahs_map[root_index] = {}
        
        for dastgah_index, dastgah in enumerate(dastgah_dirs):
            # Save the dastgah mapping for this radif
            dastgahs_map[root_index][dastgah_index] = dastgah
            dastgah_path_full = os.path.join(root_path_full, dastgah)
            # Get all .mp3 files in this dastgah folder
            audios = sorted([f for f in os.listdir(dastgah_path_full) if f.endswith(".mp3")])
            for audio_index, audio in enumerate(audios):
                allmusic.append({
                    "name": os.path.splitext(audio)[0],
                    "artist": "Artist",
                    "src": os.path.join(music_dir, root, dastgah, audio).replace("\\", "/"),
                    "key": "",
                    "index": [root_index, dastgah_index, audio_index]
                })
    return allmusic, radifs, dastgahs_map

allmusic, radifMap, dastgahs_map = parse_directory(music_dir)

# For dastgahMap, we output a list where each element corresponds to a radif.
dastgahMap_list = [dastgahs_map[i] for i in sorted(dastgahs_map.keys())]

# Write the JavaScript file
with open(output_js, "w", encoding="utf-8") as f:
    f.write("let allmusic = " + json.dumps(allmusic, indent=4) + ";\n\n")
    f.write("const radifMap = " + json.dumps(radifMap, indent=4) + ";\n\n")
    f.write("const dastgahMap = " + json.dumps(dastgahMap_list, indent=4) + ";\n")

print(f"JavaScript file '{output_js}' generated successfully!")
