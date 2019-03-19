'''************************************************************************************************

 * theApp.py
 * ClientlessDemoApp Sample JS App
 * Created by Sanjeev Pandey on 19/9/18.
 
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
from webbrowser import open_new_tab

form = cgi.FieldStorage() 
pub  = form.getvalue('PUBLIC_KEY')
priv  = form.getvalue('PRIV_KEY')
requestor_id = form.getvalue('REQID')
deviceId = form.getvalue('DEVID')
ua = form.getvalue('UA')
sp_fqdn = form.getvalue('SP_FQDN')
reggie_fqdn = form.getvalue('REG_FGQN')
uuid_filename = 'uuid.txt'
login_page = 'mvpdLoginPage.html'
mrss_res = form.getvalue('RESID')
deviceType = appInfo.deviceType
#devicePlatform = 'iOS'
deviceUser = appInfo.deviceUser
appVersion = appInfo.appVersion
appId = appInfo.appId
ttl = '36000'

def new_hmac(secret_key, headinfo):
    if sys.version_info[0] == 2:
        return hmac.new(bytes(secret_key), headinfo, hashlib.sha1).digest()
    else:
        return hmac.new(bytes(secret_key, 'utf-8'), headinfo, hashlib.sha1).digest()

def buildAuthHeader(refid):

        public_key = pub
        private_key = priv
        print ('HEADER START\n\n')

        uuidvalue = str(uuid4())

        print(int(time.time()*1000))
        header = 'POST requestor_id=%s, nonce=%s, signature_method=HMAC-SHA1, request_time=%s, request_uri=/regcode' %(refid, uuidvalue, int(time.time()*1000))
	#digest = hmac.new(private_key, header, hashlib.sha1).digest()
        digest = new_hmac(private_key, header.encode('utf-8'))
        sig = binascii.b2a_base64(digest)[:-1]
	#print (sig)
        sig2 = sig.decode('utf-8')
        header += ', public_key=%s, signature=%s' %(public_key, sig2)
        print (header)
        print ("HEADER END \n\n")
        return header

def writeUUID(strUUID):
	f = open(uuid_filename, 'w')
	f.write(strUUID)
	f.close()

def getUUID():
	f = open(uuid_filename, 'r')
	strUUID = f.readline()
	f.close()
	return strUUID


def outLOGINPage(_html):
	f = open(login_page, 'w')
	f.write(_html)
	f.close()

theheader = buildAuthHeader(requestor_id)

#reggie_fqdn = "http://api.auth.adobe.com/reggie/v1/"
#sp_fqdn = "http://api.auth.adobe.com/api/v1/"
url_header = ua
add_args = {'deviceId':deviceId, 'appId': appId, 'deviceUser': deviceUser, 'deviceType': deviceType, 'requestor':requestor_id, 'resource':mrss_res}
data = uparse.urlencode(add_args)
        

# get authn token (do 2nd Screen authentication before this)

def checkauthn():
        #If token found proceed for next calls else ask to authenticate first
        url3 = str(sp_fqdn) + str("checkauthn.json?") + str(data)
        print (url3)
        request3 = urllib.request.Request(url3)
        request3.add_header('User-agent', url_header)
        request3.add_header('Authorization',theheader)
        
        try:
                response3 = urllib.request.urlopen(request3)
                print (response3.info())
                html = response3.read()
                print (html)

        except URLError as g:
                print (g.reason)
                print ('--- PLEASE RUN THE AUTH FLOW FIRST ---\n')
        
        response3.close()
        if response3.code == 200:
                print ('--- RUNNING POST-AUTHN (SUCCESSFUL) FLOW NOW ---\n')
                authorize()
        elif response3.code == 403:
                print ('403? Got it!')
        else:
                print ('WHOA')

def authorize():
        # retreive authn token
        url4 = str(sp_fqdn) + str("tokens/authn.json?") + str(data)
        print (url4+'\n')
        request4 = urllib.request.Request(url4)
        request4.add_header('User-agent', url_header)
        request4.add_header('Authorization',theheader)

        try:
                response4 = urllib.request.urlopen(request4)
                html4 = response4.read()
                #auth_token = html4
                print ('--- [Authentication Token] ---\n')
                print (html4)
       
        except URLError as g:
                print (g.reason)

        # authorize
        url_authz= str(sp_fqdn) + str('authorize.json?') + str(data)
        print ('\n'+url_authz)
        req_authz = urllib.request.Request(url_authz)
        req_authz.add_header('User-agent', url_header)
        req_authz.add_header('Authorization',theheader)

        try:
                response_authz = urllib.request.urlopen(req_authz)
                html4_ = response_authz.read()
                print (html4_)
        
        except URLError as z:
                print (z.reason)
        
        #get authz token

        url_rtr_authz = str(sp_fqdn) + str('tokens/authz.json?') + str(data)
        print (url_rtr_authz+'\n')
        req_authz2 = urllib.request.Request(url_rtr_authz)
        req_authz2.add_header('User-agent', url_header)
        req_authz2.add_header('Authorization',theheader)

        try:
                response_authz2 = urllib.request.urlopen(req_authz2)
                html5 = response_authz2.read()
                print ('--- [AUTHORIZATION TOKEN] ---\n')
                print (html5)

        except URLError as e:
                print (e.reason)

        if response_authz2.code == 200:
                print ('\n--- OBTAINING MEDIA TOKEN ---\n')
                getMediaToken()

def getMediaToken():
        #retrieve media token
        url_media = str(sp_fqdn) + str('tokens/media.json?') + str(data)
        print (url_media+'\n')
        req_media = urllib.request.Request(url_media)
        req_media.add_header('User-agent', url_header)
        req_media.add_header('Authorization',theheader)

        try:
                response_media = urllib.request.urlopen(req_media)
                html6 = response_media.read()
                print (html6)
        except URLError as j:
                print (j.reason)

def getUserMetadata():
        #get user metadata
        url_meta = str(sp_fqdn) + str('tokens/usermetadata.json?') + str(data)
        req_meta = urllib.request.Request(url_meta)
        req_meta.add_header('User-agent', url_header)
        req_meta.add_header('Authorization',theheader)
        req_meta.add_header('Connection','keep-alive')
        req_meta.add_header('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
        
        try:
                meta_response = urllib.request.urlopen(req_meta)
                html7 = meta_response.read()
                print ('\n--- RETRIEVEING USER METADATA ----')
                print ('\n'+url_meta+'\n')
                print (html7)
        except URLError as i:
                print (i.reason)


checkauthn()
getUserMetadata()