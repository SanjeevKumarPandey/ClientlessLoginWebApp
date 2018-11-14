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
from urllib.request import Request, urlopen, URLError
from pyquery import PyQuery
from webbrowser import open_new_tab

'''
Clientsless App PART I
SmartDevice
Created by: Sanjeev Pandey | AUG 2018
'''

#form = cgi.FieldStorage() 
pub  = "rfSbthMG7RvLSWkMCcU7H5hEhDFHA13N" #form.getvalue('PUBLIC_KEY')
priv  = "IBx4ckmQGZALgn5P" #form.getvalue('PRIV_KEY')
requestor_id = "fbc-fox" #form.getvalue('REQID')
deviceId = "sanjeev" #form.getvalue('DEVID')
ua = "Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86_64 Build/MASTER)" #form.getvalue('UA')
sp_fqdn = "http://api.auth.adobe.com/api/v1/" #form.getvalue('SP_FQDN')
reggie_fqdn = "http://api.auth.adobe.com/reggie/v1/" #form.getvalue('REG_FGQN')
uuid_filename = 'uuid.txt'
login_page = 'mvpdLoginPage.html'
mrss_res = "ngw" #form.getvalue('RESID')

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
url_header = ua
url_hdr_alt = 'Mozilla 5.10'
add_args = {'deviceId':deviceId, 'uuid':getUUID()}
data = uparse.urlencode(add_args)
#sp_fqdn = "http://api.auth.adobe.com/api/v1/"
auth_token = 'authToken.txt'
add_params = {'deviceId':deviceId, 'requestor':requestor_id, 'resource': 'fox'}
add_params_mrss = {'deviceId':deviceId, 'requestor':requestor_id, 'resource':mrss_res}
data_authz = uparse.urlencode(add_params)
data_authz_mrss = uparse.urlencode(add_params_mrss)
        

# get authn token (do 2nd Screen authentication before this)

def checkauthn():
        #If token found proceed for next calls else ask to authenticate first
        url3 = str(sp_fqdn) + str("checkauthn.json?requestor=") + str(requestor_id)+ str('&deviceId=sanjeev') # str('&')+str(data)
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
                print (g.code)
                print (g.reason)
                print (g.read()) #.split('<message>')[1]
                print ('-->>> Run the auth flow first')
        
        response3.close()
        if response3.code == 200:
                print ('-->>> REST OF the flow is running now\n')
                authorize()
        elif response3.code == 403:
                print ('403? Got it!')
        else:
                print ('WHOA')

def authorize():
        # retreive authn token
        url4 = str(sp_fqdn) + str("tokens/authn.json?requestor=")+ str(requestor_id)+ str('&deviceId=sanjeev')
        print (url4+'\n')
        request4 = urllib.request.Request(url4)
        request4.add_header('User-agent', url_header)
        request4.add_header('Authorization',theheader)

        try:
                response4 = urllib.request.urlopen(request4)
                html4 = response4.read()
                #auth_token = html4
                print ('[Authentication Token]:\n')
                print (html4)
       
        except URLError as g:
                print (g.code)
                print (g.reason)
                print (g.read().split('<message>')[1])

        # authorize
        url_authz= str(sp_fqdn) + str('authorize.json?') + str(data_authz_mrss)
        print ('\n'+url_authz)
        req_authz = urllib.request.Request(url_authz)
        req_authz.add_header('User-agent', url_header)
        req_authz.add_header('Authorization',theheader)

        try:
                response_authz = urllib.request.urlopen(req_authz)
                html4_ = response_authz.read()
                print (html4_)
        
        except URLError as z:
                print (z.code)
                print (z.reason)
                print (z.read().split('<message>')[1])
        
        #get authz token

        url_rtr_authz = str(sp_fqdn) + str('tokens/authz.json?') + str(data_authz_mrss)
        print (url_rtr_authz+'\n')
        req_authz2 = urllib.request.Request(url_rtr_authz)
        req_authz2.add_header('User-agent', url_header)
        req_authz2.add_header('Authorization',theheader)

        try:
                response_authz2 = urllib.request.urlopen(req_authz)
                html5 = response_authz2.read()
                print ('[Authorization Token]:\n')
                print (html5)

        except URLError as e:
                print (e.code)
                print (e.reason)
                print (e.read().split('<message>')[1])

        if response_authz2.code == 200:
                print ('\n-->>> Getting Media Token\n')
                getMediaToken()

def getMediaToken():
        #retrieve media token
        url_media = str(sp_fqdn) + str('tokens/media.json?') + str(data_authz_mrss)
        print (url_media+'\n')
        req_media = urllib.request.Request(url_media)
        req_media.add_header('User-agent', url_header)
        req_media.add_header('Authorization',theheader)

        try:
                response_media = urllib.request.urlopen(req_media)
                html6 = response_media.read()
                print (html6)
        except URLError as j:
                print (j.code)
                print (j.reason)
                print (j.read())

def getUserMetadata():
        #get user metadata
        meta_params = {'deviceId':deviceId, 'requestor':requestor_id}
        meta_data = uparse.urlencode(meta_params)
        url_meta = str(sp_fqdn) + str('tokens/usermetadata.json?') + str(meta_data)
        req_meta = urllib.request.Request(url_meta)
        req_meta.add_header('User-agent', url_header)
        req_meta.add_header('Authorization',theheader)
        req_meta.add_header('Connection','keep-alive')
        req_meta.add_header('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
        
        try:
                meta_response = urllib.request.urlopen(req_meta)
                html7 = meta_response.read()
                print ('\n-->>> Getting User Metadata now')
                print ('\n'+url_meta+'\n')
                print (html7)
        except URLError as i:
                print (i.code)
                print (i.reason)
                print (i.read())


checkauthn()
getUserMetadata()