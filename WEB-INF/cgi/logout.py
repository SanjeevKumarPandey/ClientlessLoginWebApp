'''************************************************************************************************

 * logout.py
 * Project HULK
 * Created by Sanjeev Pandey on 15/11/18.
 
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
pub  = form.getvalue('PUBLIC_KEY')
priv  = form.getvalue('PRIV_KEY')
requestor_id = form.getvalue('REQID')
deviceId = form.getvalue('DEVID')
ua = form.getvalue('UA')
sp_fqdn = form.getvalue('SP_FQDN')
uuid_filename = 'uuid.txt'
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
        header = 'POST requestor_id=%s, nonce=%s, signature_method=HMAC-SHA1, request_time=%s, request_uri=/logout' %(refid, uuidvalue, int(time.time()*1000))
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

theheader = buildAuthHeader(requestor_id)
        
# Logout - Limitation: Doesn't logout from MVPD's end

def logout():
        url_logout = str(sp_fqdn) + str("logout.json?deviceId=") + str(deviceId)+ str('&resource=') + str(mrss_res)
        print (url_logout)
        req_logout = urllib.request.Request(url_logout, method='DELETE')
        req_logout.add_header('User-agent', ua)
        req_logout.add_header('Authorization',theheader)
        
        try:
                response_logout = urllib.request.urlopen(req_logout)
                print (response_logout.info())
                html = response_logout.read()
                print (html)

        except URLError as g:
                print (g.reason)
                print ('----- Error While Logging Out------')
        
        response_logout.close()
        if response_logout.code == 204:
                print (response_logout.read())
                print ('-----------LOGGED OUT SUCCESSFULLY-------------\n')
        elif response_logout.code == 403:
                print (response_logout.read())
                print ('403? Got it!')
        else:
                print (response_logout.read())
                print ('WHOA! Don\'t know about this error')

logout()