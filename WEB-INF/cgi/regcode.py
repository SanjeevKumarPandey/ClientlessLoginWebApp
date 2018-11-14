import sys
from uuid import uuid4
import cgi,cgitb
import hmac
import hashlib
import time
import string
import binascii
import urllib.request as u2
import urllib
import urllib.parse as uparse
# sys.path.append('../')
from urllib.request import Request, urlopen, URLError
from pyquery import PyQuery
from webbrowser import open_new_tab

form = cgi.FieldStorage() 
pub  = form.getvalue('PUBLIC_KEY')
priv  = form.getvalue('PRIV_KEY')
requestor_id = form.getvalue('REQID')
deviceId = form.getvalue('DEVID')
ua = form.getvalue('UA')
reggie_fqdn = form.getvalue('REG_FQDN')
uuid_filename = 'uuid.txt'

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
	print (header)
	#digest = hmac.new(private_key, header.encode('utf-8'), hashlib.sha1).digest()
	digest = new_hmac(private_key, header.encode('utf-8'))
	sig = binascii.b2a_base64(digest)[:-1]
	print (sig)
	sig2 = sig.decode('utf-8')
	print(sig2)
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

#reggie_fqdn = "http://api.auth.adobe.com/reggie/v1/"
add_args = {'deviceId':deviceId, 'uuid':getUUID()}
data = uparse.urlencode(add_args)
url_hdr = ua
# get regcode 
url = str(reggie_fqdn) + requestor_id + str("/regcode")
print (url)
request = u2.Request(url, data.encode('utf-8'))
request.add_header('User-agent', url_hdr)
request.add_header('Authorization',theheader)
# Sends the request and catches the response
try:
        response = u2.urlopen(request)
        html = response.read()
        #print html
except URLError as e:
        print (e.code)
        print (e.reason)
        print (e.read())
# parse the regcode from xml
pq = PyQuery(html)
tag = pq('code') # or     tag = pq('div.class')
device_info = pq('info').text()
print ('Regcode: '+tag.text())
print ('device_info: '+device_info.split('\n\t *')[0])