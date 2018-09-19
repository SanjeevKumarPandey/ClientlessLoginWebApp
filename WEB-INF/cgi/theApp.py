import sys
from uuid import uuid4
import cgi,cgitb
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

'''
Clientsless App PART I
SmartDevice
Created by: Sanjeev Pandey | AUG 2018
'''

form = cgi.FieldStorage() 
pub  = form.getvalue('PUBLIC_KEY')
priv  = form.getvalue('PRIV_KEY')
requestor_id = form.getvalue('REQID')
deviceId = form.getvalue('DEVID')
ua = form.getvalue('UA')
uuid_filename = 'uuid.txt'
login_page = 'mvpdLoginPage.html'
mrss_res = form.gervalue('RESID')#'<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>BET</title><item><title></title><guid></guid><media:rating scheme="urn:v-chip">tv-14</media:rating></item></channel></rss>'

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


def outLOGINPage(_html):
	f = open(login_page, 'w')
	f.write(_html)
	f.close()

theheader = buildAuthHeader(requestor_id)

reggie_fqdn = "http://api.auth.adobe.com/reggie/v1/"
url_header = ua
url_hdr_alt = 'Mozilla 5.10'
add_args = {'deviceId':deviceId, 'uuid':getUUID()}
data = urllib.urlencode(add_args)
sp_fqdn = "http://api.auth.adobe.com/api/v1/"
auth_token = 'authToken.txt'
add_params = {'deviceId':deviceId, 'requestor':requestor_id, 'resource': 'fox'}
add_params_mrss = {'deviceId':deviceId, 'requestor':requestor_id, 'resource':mrss_res}
data_authz = urllib.urlencode(add_params)
data_authz_mrss = urllib.urlencode(add_params_mrss)
        

# get authn token (do 2nd Screen authentication before this)

def checkauthn():
        #If token found proceed for next calls else ask to authenticate first
        url3 = str(sp_fqdn) + str("checkauthn.json?requestor=") + str(requestor_id)+ str('&deviceId=sanjeev') # str('&')+str(data)
        print url3
        request3 = urllib2.Request(url3)
        request3.add_header('User-agent', url_header)
        request3.add_header('Authorization',theheader)
        
        try:
                response3 = urllib2.urlopen(request3)
                print response3.info()
                html = response3.read()
                print html

        except URLError, g:
                print g.code
                print g.reason
                print g.read() #.split('<message>')[1]
                print '-->>> Run the auth flow first'
        
        response3.close()
        if response3.code == 200:
                print '-->>> REST OF the flow is running now\n'
                authorize()
        elif response3.code == 403:
                print '403? Got it!'
        else:
                print 'WHOA'

def authorize():
        # retreive authn token
        url4 = str(sp_fqdn) + str("tokens/authn.json?requestor=")+ str(requestor_id)+ str('&deviceId=sanjeev')
        print url4+'\n'
        request4 = urllib2.Request(url4)
        request4.add_header('User-agent', url_header)
        request4.add_header('Authorization',theheader)

        try:
                response4 = urllib2.urlopen(request4)
                html4 = response4.read()
                #auth_token = html4
                print '[Authentication Token]:\n'+ html4
       
        except URLError, g:
                print g.code
                print g.reason
                print g.read().split('<message>')[1]

        # authorize
        url_authz= str(sp_fqdn) + str('authorize.json?') + str(data_authz_mrss)
        print '\n'+url_authz
        req_authz = urllib2.Request(url_authz)
        req_authz.add_header('User-agent', url_header)
        req_authz.add_header('Authorization',theheader)

        try:
                response_authz = urllib2.urlopen(req_authz)
                html4_ = response_authz.read()
                print html4_
        
        except URLError, z:
                print z.code
                print z.reason
                print z.read().split('<message>')[1]
        
        #get authz token

        url_rtr_authz = str(sp_fqdn) + str('tokens/authz.json?') + str(data_authz_mrss)
        print url_rtr_authz+'\n'
        req_authz2 = urllib2.Request(url_rtr_authz)
        req_authz2.add_header('User-agent', url_header)
        req_authz2.add_header('Authorization',theheader)

        try:
                response_authz2 = urllib2.urlopen(req_authz)
                html5 = response_authz2.read()
                print '[Authorization Token]:\n'+ html5

        except URLError, e:
                print e.code
                print e.reason
                print e.read().split('<message>')[1]

        if response_authz2.code == 200:
                print '\n-->>> Getting Media Token\n'
                getMediaToken()

def getMediaToken():
        #retrieve media token
        url_media = str(sp_fqdn) + str('tokens/media.json?') + str(data_authz_mrss)
        print url_media+'\n'
        req_media = urllib2.Request(url_media)
        req_media.add_header('User-agent', url_header)
        req_media.add_header('Authorization',theheader)

        try:
                response_media = urllib2.urlopen(req_media)
                html6 = response_media.read()
                print html6
        except URLError, j:
                print j.code
                print j.reason
                print j.read()

def getUserMetadata():
        #get user metadata
        meta_params = {'deviceId':deviceId, 'requestor':requestor_id}
        meta_data = urllib.urlencode(meta_params)
        url_meta = str(sp_fqdn) + str('tokens/usermetadata.json?') + str(meta_data)
        req_meta = urllib2.Request(url_meta)
        req_meta.add_header('User-agent', url_header)
        req_meta.add_header('Authorization',theheader)
        req_meta.add_header('Connection','keep-alive')
        req_meta.add_header('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
        
        try:
                meta_response = urllib2.urlopen(req_meta)
                html7 = meta_response.read()
                print '\n-->>> Getting User Metadata now'
                print '\n'+url_meta+'\n'
                print html7
        except URLError, i:
                print i.code
                print i.reason
                print i.read()


checkauthn()
getUserMetadata()