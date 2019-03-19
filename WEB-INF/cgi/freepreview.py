'''************************************************************************************************

 * freepreview.py
 * Clientless Sample JS App
 * Created by Sanjeev Pandey on 21/1/19.
 
 ************************************************************************************************'''
import sys
from uuid import uuid4
import cgi,cgitb
import hmac
import hashlib
import time
import string
import binascii
import urllib.request
import urllib
import urllib.parse as uparse
import appInfo
from urllib.request import Request, urlopen, URLError
from pyquery import PyQuery

print ("Content-type: text/html\n\n")
form = cgi.FieldStorage() 
public_key  = form.getvalue('PUBLIC_KEY')
private_key  = form.getvalue('PRIV_KEY')
requestor_id = form.getvalue('REQID')
deviceId = form.getvalue('DEVID')
user_agent = form.getvalue('UA')
sp_fqdn = form.getvalue('SP_FQDN')
domain_name = form.getvalue('domain')
mrss_res = form.getvalue('RESIDF')
mso_id = form.getvalue('TEMPPASS_MVPD')
add_params_mrss = {'deviceId':deviceId, 'requestor':requestor_id, 'resource':mrss_res}
data_authz_mrss = urllib.parse.urlencode(add_params_mrss)
uuid_filename = 'uuid.txt'
deviceType = appInfo.deviceType
#devicePlatform = 'iOS'
deviceUser = appInfo.deviceUser
appVersion = appInfo.appVersion
appId = appInfo.appId
ttl = '36000'


def buildAuthHeader(requestor_id, public_key, private_key, uri, protocol):
    print('--------------------------- buildAuthHeader: '+uri+' --------------------------')
    uuidvalue = str(uuid4())
    print((int(time.time()*1000)))
    header = '%s requestor_id=%s, nonce=%s, signature_method=HMAC-SHA1, request_time=%s, request_uri=/%s' %(protocol, requestor_id, uuidvalue, int(time.time()*1000), uri)
    digest = hmac.new(bytes(private_key, 'utf-8'), header.encode('utf-8'), hashlib.sha1).digest()
    sig = binascii.b2a_base64(digest)[:-1]
    print(sig)
    header += ', public_key=%s, signature=%s' %(public_key, sig.decode('utf-8'))
    print(header)
    
    return header



headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': buildAuthHeader(requestor_id ,public_key, private_key,'authorize','POST'),
}

print('--------------------------- getfreepreview --------------------------')

#query_params = {'requestor_id': requestor_id, 'mso_id': mso_id, 'domain_name': 'tbs.com', 'deviceId': deviceId, 'deviceType': deviceType, 'appId': appId, 'deviceUser': deviceUser}
query_params = {'requestor_id': requestor_id, 'mso_id': mso_id, 'domain_name': domain_name, 'deviceId': deviceId, 'deviceType': deviceType}
input_params = bytes(urllib.parse.urlencode(query_params), 'utf-8')
print(input_params)
#response = requests.post('https://api.auth.adobe.com/api/v1/authenticate/freepreview.json', headers=headers, params=query_params)
###print response.content

url_fpw = str(sp_fqdn) + str('authenticate/freepreview.json')
print(url_fpw)
req = urllib.request.Request(url_fpw, None, headers)
req.add_header('User-agent', user_agent)
try:
    response_fpw = urllib.request.urlopen(req, input_params)
    html = response_fpw.read()
    print(html)
    print(response_fpw.code)
except URLError as r:
    print('ERROR in FPW')
    print(r.reason)
    #print(r.code)


def checkauthn():
        #If token found proceed for next calls else ask to authenticate first
        url3 = str(sp_fqdn) + str("checkauthn.json?requestor=") + str(requestor_id)+ str('&deviceId=') + str(deviceId) + str('&deviceType=') + str(deviceType)
        print (url3)
        request3 = urllib.request.Request(url3, None, headers)
        request3.add_header('User-agent', user_agent)
        try:
                response3 = urllib.request.urlopen(request3)
                print(response3.info())
                html = response3.read()
                print(html)
                response3.close()
                if response3.code == 200:
                        print('-------------REST OF the flow is running now--------------')
                        authorize()
                elif response3.code == 403:
                        print('-------------------403? Got it!-----------------')
                else:
                        print('WHOA!! IDK What this is!')
        except URLError as g:
                print('ERROR in CHECKAUTHN')
                print(g.reason)
                #print(g.code)
                print('-----------------Run the auth flow first---------------')

def authorize():
        # retreive authn token
        url4 = str(sp_fqdn) + str("tokens/authn.json?requestor=")+ str(requestor_id) + str('&deviceId=') + str(deviceId) + str('&deviceType=') + str(deviceType)
        print(url4)
        request4 = urllib.request.Request(url4, None, headers)
        request4.add_header('User-agent', user_agent)
        try:
                response4 = urllib.request.urlopen(request4)
                html4 = response4.read()
                print('[Authentication Token]:')
                print(html4)
       
        except URLError as g:
                print('ERROR in Obtaining AUTHN Token')
                print(g.reason)
                #print(g.code)

        # authorize
        url_authz= str(sp_fqdn) + str('authorize.json?') + str(data_authz_mrss)
        print(url_authz)
        req_authz = urllib.request.Request(url_authz, None, headers)
        req_authz.add_header('User-agent', user_agent)
        try:
                response_authz = urllib.request.urlopen(req_authz)
                html4_ = response_authz.read()
                print(html4_)
        
        except URLError as z:
                print(z.reason)
                #print(z.code)

    
    
checkauthn()
#authorize()

def getMediaToken():
        #retrieve media token
        url_media = str(sp_fqdn) + str('tokens/media.json?') + str(data_authz_mrss)
        print(url_media)
        req_media = urllib.request.Request(url_media, None, headers)
        req_media.add_header('User-agent', user_agent)
        try:
                response_media = urllib.request.urlopen(req_media)
                html6 = response_media.read()
                print(html6)
        except URLError as j:
                print('ERROR AT MEDIA Token:')
                print(j.reason)
                #print(j.code)


url_rtr_authz = str(sp_fqdn) + str('tokens/authz.json?') + str(data_authz_mrss)
print(url_rtr_authz)
req_authz2 = urllib.request.Request(url_rtr_authz, None, headers)
req_authz2.add_header('User-agent', user_agent)
try:
                response_authz2 = urllib.request.urlopen(req_authz2)
                html5 = response_authz2.read()
                print('[Authorization Token]:')
                print(html5)
                if response_authz2.code == 200:
                        print('---------------------Getting Media Token----------------------------')
                        getMediaToken()
except URLError as e:
                print('ERROR AT Authz token:')
                print(e.reason)
                #print(e.code)


def getUserMetadata():
        #get user metadata
        meta_params = {'deviceId':deviceId, 'requestor':requestor_id}
        meta_data = urllib.parse.urlencode(meta_params)
        url_meta = str(sp_fqdn) + str('tokens/usermetadata.json?') + str(meta_data)
        req_meta = urllib.request.Request(url_meta, None, headers)
        req_meta.add_header('User-agent', user_agent)
        req_meta.add_header('Connection','keep-alive')
        req_meta.add_header('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
        
        try:
                meta_response = urllib.request.urlopen(req_meta)
                html7 = meta_response.read()
                print('---------------Getting User Metadata now------------------')
                print(url_meta)
                print(html7)
        except URLError as i:
                print('ERROR AT UserMetadata:')
                print(i.reason)

getUserMetadata()
