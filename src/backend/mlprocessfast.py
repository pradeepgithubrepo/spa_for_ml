
from fastapi import FastAPI,Form
from fastapi.middleware.cors import CORSMiddleware
from word_cosine_similarity_simple import *
import pymssql  
import json
import requests

app = FastAPI()

origins = ["*"]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)

def synth_stgdata() :
    conn= pymssql.connect(server='usnddgs00rsql01.database.windows.net', user='dbWSS', password='~Pfc(>fh4KStJtDK68d0x80LaWRG9cxO', database='USNDDGS00RSDB02')
    cursor = conn.cursor()
    query = "SELECT StgfileName,StgSchema FROM [nlp_poc].[StagingLayer_schema]"
    cursor.execute(query)
    rows = cursor.fetchall()
    cdmMapping = []
    for row in rows :
        StgfileName = row[0]
        for iter in json.loads(row[1]):
            cdmMapping.append({'stagTable' : StgfileName,'stagKey':iter['stagKey'], 'stagdatatype' : iter['stagType']})
    return cdmMapping        

@app.post("/process/")
def processml(postdata : str = Form()):
        print("postdata",postdata) 
        res = json.loads(postdata)
        filename = res['filename']
        rawcolumns = res['rawcols']
        print(rawcolumns)
        process_cols = rawcolumns.split(',')
        results = process(process_cols)
        print(results)
        cdmMapping = synth_stgdata()

        cdmtableagg = {}
        cdmtableaccum = []
        for ele in results:
            src_cdmkey = ele['cdm_key']
            for item in cdmMapping:
                if(src_cdmkey.lower() == item["stagKey"].lower()):
                    cdmtableaccum.append(item)
                    src_cdmtable =  item["stagTable"]
                    if src_cdmtable in cdmtableagg:
                        cdmtableagg.update({src_cdmtable : cdmtableagg[src_cdmtable] + 1})
                    else:
                        cdmtableagg.update({src_cdmtable : 1})


        cdmtableagg_upd = dict(sorted(cdmtableagg.items(), key=lambda item: item[1], reverse=True))
        print(cdmtableagg_upd)
        finalcdmtable = next(iter(cdmtableagg_upd))
        print(finalcdmtable)
        cdmtableaccum_filtered = list(filter(lambda d: d['stagTable'] == finalcdmtable, cdmtableaccum))
        upd_results = []
        for item in results:
            src_cdmkey = item['cdm_key']
            cdm_key_srch = list(filter(lambda d: d['stagKey'].lower() == src_cdmkey.lower(), cdmtableaccum_filtered))
            if cdm_key_srch :
                upd_item = item
                upd_item.update({'stagdatatype':cdm_key_srch[0]["stagdatatype"]})
                print(upd_item)
                upd_results.append(upd_item)

        print(upd_results)
        upd_results_final =  upd_results
        for i in results:
            found = 0
            print("Printing I")
            print(i)
            srckey = i["sourcekey"]
            print(srckey)
            for j in upd_results:
                if(i["sourcekey"].lower() == j["sourcekey"].lower()):
                    found = 1
            if( found == 0 ):
                upd_results_final.append({"sourcekey" : srckey , "cosine_quotient" : 'NA' , "cdm_key" : 'NA' , "comment" : 'No Mapping Found' , "stagdatatype" : '' })


        #cursor.execute("INSERT INTO [dbo].[ml_mapping_entity_tbl] values (%s,%s,%s,%s)",(str(row[1]),str(row[2]), finalcdmtable,results))
        #conn = pymssql.connect(server='apsqdgs00ksql01.database.windows.net', user='Dbwss', password='#**zRom=+Z(dkG?4xEhKq?scDYgQGNWc', database='APSQDGS00KSDB06')
        conn= pymssql.connect(server='usnddgs00rsql01.database.windows.net', user='dbWSS', password='~Pfc(>fh4KStJtDK68d0x80LaWRG9cxO', database='USNDDGS00RSDB02')
        cursor = conn.cursor()
        cursor.executemany("update [nlp_poc].[ml_mapping_entity_tbl] set cdm_schema = %s , cdm_table = %s  where source_Entity = %s if @@ROWCOUNT = 0 INSERT INTO [nlp_poc].[ml_mapping_entity_tbl] values (%s,%s,%s,%s)",[(json.dumps(upd_results_final),str(finalcdmtable),filename,"TNB",filename, str(finalcdmtable),json.dumps(upd_results_final))])
        conn.commit()
        return filename

@app.post("/updprocessfile")
def updprocfile(postdata : str = Form()):
    print("postdata",postdata)
    res = json.loads(postdata)
    filename = res['filename']
    userdata = res['userdata']
    conn= pymssql.connect(server='usnddgs00rsql01.database.windows.net', user='dbWSS', password='~Pfc(>fh4KStJtDK68d0x80LaWRG9cxO', database='USNDDGS00RSDB02')
    #conn= pymssql.connect(server='apsqdgs00ksql01.database.windows.net', user='Dbwss', password='#**zRom=+Z(dkG?4xEhKq?scDYgQGNWc', database='APSQDGS00KSDB06')
    cursor = conn.cursor()
    cursor.executemany("update [nlp_poc].[ml_mapping_entity_tbl] set cdm_schema = %s where source_Entity = %s",[(json.dumps(userdata),filename,"TNB")])
    conn.commit()
    return filename

@app.post("/getcdmkeylist")
def getcdmkeys(postdata : str = Form()):
    print("postdata",postdata)
    res = json.loads(postdata)
    cdmtable = res['filename']
    print("cdmtable",cdmtable)
    cdmcols = ""
    cdmMapping = synth_stgdata()
    for ele in cdmMapping:
        if(ele["stagTable"] == cdmtable):
            row_id = ele["stagKey"]
            if(len(cdmcols) == 0):
                cdmcols = cdmcols + row_id
            else:    
                cdmcols = cdmcols + "," + row_id
    return cdmcols

@app.post("/getprocessfile")
def getprocfile(postdata : str = Form()):
    print("postdata",postdata)
    res = json.loads(postdata)
    filename = res['filename']    
    conn= pymssql.connect(server='usnddgs00rsql01.database.windows.net', user='dbWSS', password='~Pfc(>fh4KStJtDK68d0x80LaWRG9cxO', database='USNDDGS00RSDB02')
    #conn= pymssql.connect(server='apsqdgs00ksql01.database.windows.net', user='Dbwss', password='#**zRom=+Z(dkG?4xEhKq?scDYgQGNWc', database='APSQDGS00KSDB06')  
    cursor = conn.cursor() 
    query = "SELECT source_Entity,cdm_table,cdm_schema FROM [nlp_poc].[ml_mapping_entity_tbl] where source_Entity = '" + filename + "'"
    cursor.execute(query)  
    rows = cursor.fetchall()
    list_api_results = []
    for row in rows:
        list_api_results.append({"filename": str(row[0]) , "cdmtable" : str(row[1]) , "res" : str(row[2])  })

    json_dump = json.dumps(list_api_results)
    return json_dump

@app.post("/invokeadb")
def kickadb(postdata : str = Form()):
    print("postdata",postdata)
    res = json.loads(postdata)
    auth_token='dapi4e69a2cc13ec2ea29d41fa37a95daf5f-2'
    hed = {'Authorization': 'Bearer ' + auth_token}

    url = 'https://adb-5474676552810392.12.azuredatabricks.net/api/2.1/jobs/run-now'
    response = requests.post(url, json=res, headers=hed)
    print(response)
    print(response.json())


@app.get("/listfiles")
def listfiles():
    conn= pymssql.connect(server='usnddgs00rsql01.database.windows.net', user='dbWSS', password='~Pfc(>fh4KStJtDK68d0x80LaWRG9cxO', database='USNDDGS00RSDB02')
    cursor = conn.cursor()
    query = "SELECT file_name , string_agg(cleaned_field_name,',') FROM [nlp_poc].[schema_catalog] group by file_name"
    cursor.execute(query)
    rows = cursor.fetchall()
    list_api_results = []
    for row in rows:
        list_api_results.append({"filename": str(row[0]) , "columnnames" : str(row[1]) })

    json_dump = json.dumps(list_api_results)
    return json_dump
