import requests
from bs4 import BeautifulSoup

MEGA_SCRIPT = "MEGA_SCRIPT.txt"
SAMPLE_URL = "https://imsdb.com/scripts/Coco.html"


def findLine(start, end, content):
    start_index = content.index(start)
    end_index = content.index(end)
    print("Start: " + str(start_index))
    print("End: " + str(end_index))
    return content[start_index + len(start):end_index]



r = requests.get(SAMPLE_URL)

soup = BeautifulSoup(r.content, 'html.parser')
s = soup.find_all('b')
#print(type(r.content))
myString = str(r.content, 'UTF-8', errors='ignore')

for i in range(1, len(myString)):
    print("i: " + str(i))
    start = str(s[i-1])
    end = str(s[i])
    print(findLine(start, end, myString))
    myString = myString[myString.index(end) + len(end):]

# findLine(str(s[0]), str(s[6]), myString)

# space_counts = 0
# current_word = ""
# rawText = ""
# isRecording = False

# for i in range(len(myString)):
#     if(isRecording):
#         rawText += myString[i]

#     if(myString[i] == " "):
#         space_counts += 1
#         current_word = ""
#     else:
#         current_word += myString[i]
#         if(current_word == "</b>"):
#             isRecording = True
#         if(current_word == "<b>"):
#             isRecording = False
#             print("i: " + str(i) + " " + rawText)

        

    # print(myLine)

# with open(MEGA_SCRIPT, 'w') as f:



