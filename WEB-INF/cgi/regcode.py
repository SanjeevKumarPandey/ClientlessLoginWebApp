#!/usr/bin/python
print "Content-type: text/html\n\n";
import sys
from uuid import uuid4
import hmac
import hashlib
import time
import string
import binascii
import urllib2
import urllib
from urllib2 import Request, urlopen, URLError
from pyquery import PyQuery
from webbrowser import open_new_tab

form = cgi.FieldStorage() 

pub  = form.getvalue('PUBLIC_KEY')
priv  = form.getvalue('PRIV_KEY')
requestor_id = form.getvalue('REQID')
deviceId = form.getvalue('DEVID')
uuid_filename = 'uuid.txt'

def buildAuthHeader(refid):

	public_key = pub
	private_key = priv
	print 'HEADER START\n\n'

	uuidvalue = str(uuid4())

	print(int(time.time()*1000))
	header = 'POST requestor_id=%s, nonce=%s, signature_method=HMAC-SHA1, request_time=%s, request_uri=/regcode' %(refid, uuidvalue, int(time.time()*1000))
	digest = hmac.new(private_key, header, hashlib.sha1).digest()
	sig = binascii.b2a_base64(digest)[:-1]
	print sig
	header += ', public_key=%s, signature=%s' %(public_key, sig)
	print header

	print "HEADER END \n\n"
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

reggie_fqdn = "http://api.auth.adobe.com/reggie/v1/"
url_header = "Dalvik/2.1.0 (Linux; U; Android 6.0; Android SDK built for x86_64 Build/MASTER)"
url_hdr_alt = 'Mozilla 5.10'
#add_args = {'deviceId':deviceId, 'uuid':getUUID()}
#data = urllib.urlencode(add_args)

# get regcode 
url = str(reggie_fqdn) + requestor_id + str("/regcode")
print url
request = urllib2.Request(url, data)
request.add_header('User-agent', url_header)
request.add_header('Authorization',theheader)
# Sends the request and catches the response
try:
        response = urllib2.urlopen(request)
        html = response.read()
        print html
except URLError, e:
        print e.code
        print e.reason
        print e.read()
# parse the regcode from xml
'''
pq = PyQuery(html)
tag = pq('code') # or     tag = pq('div.class')
device_info = pq('info').text()
print 'Regcode: '+tag.text()
print 'device_info: '+device_info.split('\n\t *')[0]'''
