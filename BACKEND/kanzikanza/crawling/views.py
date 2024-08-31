from django.shortcuts import render
import requests
from django.http import JsonResponse
from bs4 import BeautifulSoup

# Create your views here.
def crawlword(request):
    r = requests.get('https://namu.wiki/w/佳')
    r2 = requests.get('https://namu.wiki/w/頸')
    r3 = requests.get('https://namu.wiki/w/痛')
    
    
    data = r

    # print(data.json())
    parsed_web = BeautifulSoup(r.text, 'html.parser')
    parsed_fire_web = BeautifulSoup(r2.text, 'html.parser')
    parsed_earth_web = BeautifulSoup(r3.text, 'html.parser')
    # print(parsed_web.li)
    # for re in parsed_web.find_all('li', attrs={'data-v-9d2cea91': True}):
        # print(re)
    ourtarget = parsed_web.find(id = "고사성어/숙어").parent.next_sibling
    ourtargetType = parsed_fire_web.find(id = "고사성어/숙어").parent.next_sibling
    ourtargetEarth = parsed_earth_web.find(id = "고사성어/숙어").parent.next_sibling
    # print(ourtarget)
    targets = ourtarget.find_all('li')
    targets_fire = ourtargetType.find_all('li')
    targets_earth = ourtargetEarth.find_all('li')
    for target in targets:
        text_parts = []
        
        for child in target.div.children:
            # print(child, child.name)        
            if child.name == 'a':
                text_parts.append(child.get_text(strip = True))
            else:
                text_parts.append(child.strip())
                
        result = ''.join(text_parts)
        print(result)

        # print(target.div.contents[1].split(':')[0].lstrip('(').rstrip(')'))
    for targett in targets_fire:
        text_parts = []
        
        for child in targett.div.children:
            # print(child, child.name)        
            if child.name == 'a':
                text_parts.append(child.get_text(strip = True))
            else:
                text_parts.append(child.strip())
                
        result = ''.join(text_parts)
        print(result)
    
    for targettt in targets_earth:
        # print(targettt.prettify(), '\n')
        # print(targettt.div.contents)    

        text_parts = []
        for child in targettt.div.children:
            # print(child, child.name)        
            if child.name == 'a':
                text_parts.append(child.get_text(strip = True))
            else:
                text_parts.append(child.strip())
                
        result = ''.join(text_parts)
        print(result)
        # for arg in targettt.div.contents:
        #     print(arg.unwrap())
        #     try:
        #         print(arg.unwrap())
        #         stringThatAtagRemoved += arg.unwrap().string
        #     except:
        #         # stringThatAtagRemoved += arg
        #         pass

        

    # print(parsed_web.find('ul', attrs={"data-v-3e87a8f5" : True}))
    
    return JsonResponse({"1" : "1"})