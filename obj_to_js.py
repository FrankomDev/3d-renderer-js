from fileinput import filename
import os
import sys

if len(sys.argv) < 2:
    print("Provide obj file path!")
    sys.exit()
elif not os.path.exists(sys.argv[1]):
    print("File doesn't exist!")
    sys.exit()

with open(sys.argv[1], "r") as f:
    lines = f.readlines()

vertices = []
faces = []

for line in lines:
    if line.startswith("v ") or line.startswith("vn "):
        l = line.strip("\n")
        l = line.split()
        #print(l)
        vertices.append([
            l[1], l[2], l[3]
        ])
    elif line.startswith("f "):
        l = line.strip("\n")
        l = line.split()
        face = []
        for i in l:
            if i == 'f':
                continue
            i = i.split("/")
            face.append(i[0])
        faces.append(face)

if len(vertices) == 0:
    print("Invalid file format!")
    sys.exit()

with open("model.js", "w") as f:
    f.write("export const points = [\n")

    for v in vertices:
        f.write(f"\t{{x: {v[0]}, y: {v[1]}, z: {v[2]}}},\n")

    f.write("]\n\n")

    f.write("export const lines = [\n")
    for face in faces:
        f.write("\t[")
        for v in face:
            f.write(f"{v}, ")
        f.write("],\n")
    f.write("]")
