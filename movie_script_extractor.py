from numpy import character, full
import requests
from bs4 import BeautifulSoup
import re

'''
The following is a list of all the different movies that will be parsed
'''
MEGA_SCRIPT = "MEGA_SCRIPT.txt"
SAMPLE_URL = "https://imsdb.com/scripts/Joker.html"
STAR_WARS = "https://imsdb.com/scripts/Star-Wars-The-Empire-Strikes-Back.html"
KUNG_FU_PANDA = "https://imsdb.com/scripts/Kung-Fu-Panda.html"
LEGO_MOVIE = "https://imsdb.com/scripts/LEGO-Movie,-The.html"
JOKER = "https://imsdb.com/scripts/Joker.html"
BEAN = "https://imsdb.com/scripts/Bean.html"
LEBOWSKI = "https://imsdb.com/scripts/Big-Lebowski,-The.html"
NEMO = "https://imsdb.com/scripts/Finding-Nemo.html"
CARS_2 = "https://imsdb.com/scripts/Cars-2.html"
ME_2 = "https://imsdb.com/scripts/Despicable-Me-2.html"
MEGAMIND = "https://imsdb.com/scripts/Megamind.html"
LALALAND = "https://imsdb.com/scripts/La-La-Land.html"
MIB = "https://imsdb.com/scripts/Men-in-Black.html"
UP = "https://imsdb.com/scripts/Up.html"
ZOOTOPIA = "https://imsdb.com/scripts/Zootopia.html"
ARTHUR = "https://imsdb.com/scripts/Arthur.html"
DEADPOOL = "https://imsdb.com/scripts/Deadpool.html"
MUMMY = "https://imsdb.com/scripts/Mummy,-The.html"
PANTHER = "https://imsdb.com/scripts/Black-Panther.html"
BIG_SICK = "https://imsdb.com/scripts/Big-Sick,-The.html"
FATAL_INSTICT = "https://imsdb.com/scripts/Fatal-Instinct.html"
AVATAR = "https://imsdb.com/scripts/Avatar.html"
GAME_6 = "https://imsdb.com/scripts/Game-6.html"
INTERSTELLAR = "https://imsdb.com/scripts/Interstellar.html"
WOODSMAN = "https://imsdb.com/scripts/Woodsman,-The.html"

MOVIE_LIST = [STAR_WARS, KUNG_FU_PANDA, LEGO_MOVIE, JOKER, BEAN, LEBOWSKI, NEMO, CARS_2, ME_2, MEGAMIND, LALALAND, MIB, UP, ZOOTOPIA, ARTHUR, MUMMY, BIG_SICK, FATAL_INSTICT, AVATAR, INTERSTELLAR]
#MOVIE_LIST = []

def findLine(start, end, content):
    start_index = content.index(start)
    end_index = content.index(end)
    print("Start: " + str(start_index))
    print("End: " + str(end_index))
    return content[start_index + len(start):end_index]





x = 0
isPossibleQuote = False
built_title = ""
title_space = 0
built_string = ""

final_quotes = []

for movie in MOVIE_LIST:
    quotes = []
    r = requests.get(movie)

    soup = BeautifulSoup(r.content, 'html.parser')
    myString = str(r.content, 'UTF-8', errors='ignore')

    start_index = myString.index('<pre>')
    end_index = myString.index('</pre>')

    full_script = myString[start_index + 5:end_index]
    cut_script = myString[start_index + 5:end_index]
    #print(full_script)

    full_script = re.sub("<b>\s+</b>", "\n", full_script)

        #I REALLY DONT CARE ABOUT END OF BOLD
    full_script = full_script.replace("</b>", "")

    line_list  = full_script.splitlines()

    reduced_list = []
    character_list = {}

    for i in range(len(line_list) - 1):
        
        line = line_list[i]

        temp_line = line

        if("[" in temp_line or "]" in temp_line or "|" in temp_line or "#" in temp_line):
            built_title = ""
            built_string = ""
            isPossibleQuote = False
            continue

        #IF YOU ARE A PARANTHESES AND ARE NOT CONTINUED OR OFF SCREEN, I DONT WANT YOU
        if("(" in temp_line and ")" in temp_line):
            if(("(CONT'D)" not in temp_line and "(OS)" not in temp_line) or "(V.O.)" in temp_line):
                continue

        #I REALLY DONT CARE ABOUT WHITE SPACES
        temp_line = temp_line.strip()

        #IF YOU HAVE BOLD, YOUR NEXT LINE BETTER BE A NON EMPTY
        if("<b>" in temp_line):
            if(len(line_list[i+1].strip()) == 0 or "<b>" in line_list[i+1]):
                isPossibleQuote = False
                continue
            else:
                isPossibleQuote = True
                temp_line = temp_line.replace("<b>", "")
                
                temp_line = temp_line.replace("(CONT'D)", "")
                temp_line = temp_line.replace("(OS)", "")

                temp_line = temp_line.strip()

                if(temp_line in character_list):
                    character_list["NAME: " + temp_line] += 1
                else:
                    character_list["NAME: " + temp_line] = 1

                built_title += "NAME: " + temp_line + "\n"
        else:
            if(len(temp_line) > 0 and isPossibleQuote):
                built_string += temp_line + "\n"
                pass
            else:
                if(len(built_string) > 0):
                    quote = built_title + built_string
                    quotes.append(quote)
                    built_string = ""
                    built_title = ""

                isPossibleQuote = False
                continue

    character_list=dict(sorted(character_list.items(),key= lambda x:x[1], reverse=True))
    final_list = {}
    i = 1
    for x in character_list:
        if(i < 10):
            character_list[x] = "Person_" + str(i)
        else:
            character_list[x] = "Side_" + str(i - 9)
        i += 1
    
    print(character_list)

    for quote in quotes:
        for x in character_list:
            quote = quote.replace(x, character_list[x])
        print(quote)
        final_quotes.append(quote)

    # print(character_list)  
    # print("\n\n")          

    # print("len: " + str(len(temp_line)) + " -- " + temp_line[:100])

    # quotes.append(temp)

    # if(len() > 0):
    #     pass

    # if("<b>" in temp_line):
    #     if(isPossibleQuote == True):
    #         if(len(built_string) > 0):
    #             if("(" in built_title or ")" in built_title):
    #                 if("(CONT'D)" in built_title or "(OS)" in built_title):
    #                     isPossibleQuote = False
    #                     quotes.append(built_title + built_string)
    #                     built_title = ""
    #                     built_string = ""
    #                 else:
    #                     isPossibleQuote = False
    #                     built_title = ""
    #                     built_string = ""
    #             else:
    #                 isPossibleQuote = False
    #                 quotes.append(built_title + built_string)
    #                 built_title = ""
    #                 built_string = ""

    #     isPossibleQuote = True
    #     temp_line = temp_line.replace("<b>", "")
    #     temp_line = temp_line.replace("\t", "")
    #     title_space = len(temp_line) - len(temp_line.lstrip())
    #     temp_line.lstrip()
    #     built_title += temp_line + "\n"
    #     #print("#" + str(x)  + " len: " + str(len(temp_line)) + " startOfLine: " + str(temp_line[:100]))
    #     x += 1

    # elif(len(temp_line) == 0 or temp_line == "\n"):
    #     isPossibleQuote = False
    #     if(built_string == ""):
    #         built_title = ""
    #         built_string = ""
    #     else:
    #         if("(" in built_title or ")" in built_title):
    #             if("(CONT'D)" in built_title or "(OS)" in built_title):
    #                 isPossibleQuote = False
    #                 quotes.append(built_title + built_string)
    #                 built_title = ""
    #                 built_string = ""
    #             else:
    #                 isPossibleQuote = False
    #                 built_title = ""
    #                 built_string = ""
    #         else:
    #             isPossibleQuote = False
    #             quotes.append(built_title + built_string)
    #             built_title = ""
    #             built_string = ""

    # elif(isPossibleQuote and (len(temp_line) > 0)):
    #     temp_line = temp_line.replace("\t", "")
        
    #     if(len(temp_line) - len(temp_line.lstrip()) == title_space):
    #         isPossibleQuote = False
    #     else:
    #         temp_line.lstrip()
    #         if("(" not in temp_line and ")" not in temp_line):
    #             built_string += temp_line + "\n"
    #             #print("#" + str(x)  + " len: " + str(len(temp_line)) + " startOfLine: " + str(temp_line[:100]))
    #             x += 1
    


    # if(line.startswith("<b>")):
    #     temp_line = line[3:]

    # for i in range(len(temp_line)):
    #     if(temp_line[i] == " "):
    #         space_count += 1
    #     else:
    #         break
    
    # if(((line.startswith("<b>") or line.startswith(" <b>")) and space_count > 27 and space_count < 38) or (line.startswith("</b>") and len(line) > 4) or space_count > 18):
    #     reduced_list.append(line)

    #if(space_count < 60):


myText = open(r'MEGA_SCRIPT.txt','w')
for quote in final_quotes:
    myText.write(quote)
    myText.write("\n")

    print(quote)
    print("\n")

myText.close()

# print(line_list)

# words = ""
# sentence = ""
# build = False

# myList = []

# while(cut_script.index("<b>") != -1):
#     s = cut_script.index("<b>")
#     e = cut_script.index("</b>")

#     extraction = cut_script[s+3:e]
#     space_count = 0
#     for i in range(len(extraction)):
#         if(extraction[i] == " "):
#             space_count += 1
#         else:
#             break

#     print("Extractions: " + extraction)
#     print("Spaces: " + str(space_count))

#     print("\n\n")

#     cut_script = cut_script[e+4:]


# start = full_script.index("<b>")
# end = full_script.index("</b>")

# print("First <b>: " + str(start))
# print("First </b>: "+ str(end))

# cut_script = full_script[end + 4:]

# print(full_script[start:end + 4])
# print(cut_script)

# print(myList)




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



