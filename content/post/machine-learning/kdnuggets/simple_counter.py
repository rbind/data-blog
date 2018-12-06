#!/usr/bin/env python

# Counter for Google Scholar Hits
########
import sys
import os.path
import time
import csv
import urllib.request
import urllib.parse
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import re
import random
from lxml.html import fromstring
from itertools import cycle

def get_proxies(n = 20):
    url = 'https://free-proxy-list.net/'
    response = requests.get(url)
    parser = fromstring(response.text)
    #print(parser.xpath('//tbody/tr'))
    proxies = set()
    for i in parser.xpath('//tbody/tr')[:n]:
        #if i.xpath('.//td[7][contains(text(),"yes")]'): # proxies supporting https requests
        #Grabbing IP and corresponding PORT
        proxy = ":".join([i.xpath('.//td[1]/text()')[0], i.xpath('.//td[2]/text()')[0]])
        proxies.add(proxy)
    print(str(len(proxies)) + " proxies selected!")
    return proxies

def get_hits_in_year(search_term, year, proxies, proxy_pool, user_agent_list, retry_counter):
    print("Proxies remaining: " + str(len(proxies)))
    if (len(proxies) == 0):
        print("WARNING: No more proxies to select from!")
        return None
    if (retry_counter > 2):
        # heuristic: if I send requests that dont make sense (no results found), google refuses
        # return 0 in this case
        return (0, proxies, proxy_pool)
    base_url = "https://scholar.google.com/scholar?"
    proxy = next(proxy_pool)
    #proxy = "195.9.149.6:61619"
    print("Proxy:")
    print(proxy)
    input_options = {"as_q" : search_term, "as_ylo": year, "as_yhi": year}
    user_agent = random.choice(user_agent_list)
    headers = {'User-Agent': user_agent}
    session = requests.Session()
    retry = Retry(total=3, backoff_factor=0.5) # try at most 3 times, delay attempts by backoff_factor
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    timeout = 5 # allow proxy 5 seconds to retrieve results
    try:
        results = session.get(base_url,
                  params=input_options,
                  headers = headers,
                  proxies={"http": proxy, "https": proxy},
                  timeout = timeout)
    except KeyboardInterrupt:
        print("W: interrupt received, stopping ...")
        sys.exit()
    except Exception as e:
        print(e)
        print("Connection error. Removing proxy from list!")
        proxies = [l_proxy for l_proxy in proxies if l_proxy != proxy]
        proxy_pool = cycle(proxies)
        return (get_hits_in_year(search_term, year, proxies, proxy_pool,
                user_agent_list, retry_counter + 1))
    text = results.text
    #print(text)
    r = re.search("([0-9,]+) results", text)
    if r != None:
        groups = r.groups()
        #print(groups)
        number = int(groups[0].replace(',', ''))
        return((number, proxies, proxy_pool))
    else:
        # differentiate between blocked (captcha) and no results found
        r = re.search("did not match any articles", text)
        if (r == None):
            # we are blocked
            print("Proxy is being blocked. Removing proxy and trying again ...")
            proxies = [l_proxy for l_proxy in proxies if l_proxy != proxy]
            proxy_pool = cycle(proxies)
            return (get_hits_in_year(search_term, year, proxies,
                    proxy_pool, user_agent_list, retry_counter + 1))
        else:
            # no results were found
            return (0, proxies, proxy_pool)

###########
#print("call:")
#print(sys.argv)
if len(sys.argv) != 2: # two args are required ([0] is name of script)
    sys.exit("Stopping because required args were not supplied: <out_loc_results>")
out_file = sys.argv[1] # read from 2nd arg
if not os.path.exists(os.path.dirname(out_file)):
    os.makedirs(os.path.dirname(out_file))
# table structure: Model | Year | Count
models = {
        "Deep learning": ["deep learning"],
        #"Neural Network": ["neural network"],
        #"Support Vector Machine": ["support vector machine"],
        #"Random Forest": ["random forest"],
        #"Decision Tree": ["decision tree"],
        #"Linear Regression": ["linear regression"],
        #"Logistic Regression": ["logistic regression"],
        #"Poisson Regression": ["poisson regression"],
        #"Cox Regression": ["cox regression"],
        #"Ridge Regression": ["ridge regression"],
        #"Lasso Regression": ["lasso model", "lasso regression"],
        #"Nearest Neighbor": ["k-nearest neighbor", "k-nearest neighbour"],
        #"Linear Discriminant Analysis": ["linear discriminant analysis"],
        #"Log-Linear Model": ["log-linear model"]
        }
rows = []
proxies = get_proxies()
proxy_pool = cycle(proxies)
user_agent_list = [
   #Chrome
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    #Firefox
    'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
    'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 6.2; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)',
    'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)'
]

for (model, search_terms) in models.items():
    for year in range(1950, 2019):
        print(model + ": " + str(year))
        total_hits = 0
        for term in search_terms:
            search_term = '"' + term + '"'
            hit_data = get_hits_in_year(search_term, year, proxies, proxy_pool, user_agent_list, 0)
            while (hit_data == None):
                # no proxies remain -> load new proxies
                print("Hit was None: reloading proxies!")
                proxies = get_proxies() # update proxy list with current proxies
                print(len(proxies))
                proxy_pool = cycle(proxies)
                hit_data = get_hits_in_year(search_term, year, proxies, proxy_pool, user_agent_list, 0)
            (hits, proxies, proxy_pool) = hit_data
            print(hits)
            if hits != None:
                total_hits += hits
        row = {"Year": year, "Model": model, "Count": total_hits}
        rows.append(row)
csv_header = ["Year", "Model", "Count"]
# OUTPUT RESULTS
with open(out_file, 'w') as f:
    w = csv.DictWriter(f, csv_header)
    w.writeheader()
    for row in rows:
        w.writerow(row)
