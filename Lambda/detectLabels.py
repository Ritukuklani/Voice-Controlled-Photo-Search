# import cv2
import logging
import base64
import json
import boto3
import os
import time
from botocore.vendored import requests

def lambda_handler(event, context):
    # TODO implement
    print("event")
    print(event)
    s3_info = event['Records'][0]['s3']
    bucket_name = s3_info['bucket']['name']
    key_name = s3_info['object']['key']
    print(bucket_name)
    print(key_name)
    
    
    client = boto3.client('rekognition')
    pass_object = {'S3Object':{'Bucket':bucket_name,'Name':key_name}}
    # image_name = pass_object['']
    print("pass_object", pass_object)
    
    resp = client.detect_labels(Image=pass_object)
    print("rekognition response")
    print(resp)
    timestamp = time.time()
    
    labels = []
    
    for i in range(len(resp['Labels'])):
        labels.append(resp['Labels'][i]['Name'])
    print('<------------Now label list----------------->')
    print(labels)
    
    format = {'objectKey':key_name,'bucket':bucket_name,'createdTimestamp':timestamp,'labels':labels}
    
    #required_json = json.dumps(format)
    #print(required_json)
    
    url = "https://vpc-photos-a3-mr3n7cxri6jscccmgz2huedrbi.us-east-1.es.amazonaws.com/photos-a3/0"
    headers = {"Content-Type": "application/json"}
    
    #url2 = "https://vpc-photos-b4al4b3cnk5jcfbvlrgxxu3vhu.us-east-1.es.amazonaws.com/photos/_search?pretty=true&q=*:*"
    
    r = requests.post(url, data=json.dumps(format).encode("utf-8"), headers=headers)
    
    #resp_elastic = requests.get(url2,headers={"Content-Type": "application/json"}).json()
    #print('<------------------GET-------------------->')
    
    print(r.text)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }