def process(incoming_cols):
  if(len(incoming_cols) <= 1 ):
    print("quit()")      
  import nltk
  nltk.download('wordnet')
  nltk.download('omw-1.4')

  ###################################################################################################################
  #PreProcessing
  ###################################################################################################################
  #Lemettizing
  from nltk.stem import WordNetLemmatizer
    
  lemmatizer = WordNetLemmatizer()
  sourcekeys = incoming_cols
  
  sourcekeys_formatted = []
  for ele in sourcekeys:
   sourcekeys_formatted.append(ele.replace('-', '').replace('_', '').replace(' ', ''))
   
  sourcekeys_lemetized = []
  for ele in sourcekeys_formatted:
   sourcekeys_lemetized.append(lemmatizer.lemmatize(ele))

  print(sourcekeys_lemetized)

  #Stemming
  from nltk.stem import PorterStemmer
  from nltk.tokenize import word_tokenize
  
  ps = PorterStemmer()

  sourcekeys_lemetized_stemmed = []
  for ele in sourcekeys_lemetized:
    sourcekeys_lemetized_stemmed.append(ps.stem(ele))

  print(sourcekeys_lemetized_stemmed)

  # Commented out IPython magic to ensure Python compatibility.
  # %pip install sentence-transformers -q

  knowledgebase = []
  with open('powerutiltraindata.csv', 'r') as f: ##open the file in read mode
      for l in f.readlines(): ## get all the lines
          row_id, row_name = l.strip('\n').split(',')  ## unpack the values (assumes only two columns)
          knowledgebase.append({'srchkey':row_id, 'tgtkey' : row_name}) ## add to your list

  print(knowledgebase)

  import pandas as pd
  def read_csv():
      return pd.read_csv().to_dict('records')

  print(read_csv)

  from sentence_transformers import SentenceTransformer, util
  model = SentenceTransformer('all-MiniLM-L6-v2')

  # knowledgebase = [
  #   {"srchkey": "custname","tgtkey":"customername"},
  #   {"srchkey": "name","tgtkey":"customername"},
  #   {"srchkey": "customername","tgtkey":"customername"},
  #   {"srchkey": "firstname","tgtkey":"customername"},
  #   {"srchkey": "lastname","tgtkey":"customername"},
  #   {"srchkey": "email","tgtkey":"email"},
  #   {"srchkey": "mail","tgtkey":"email"},
  #   {"srchkey": "street","tgtkey":"address"},
  #   {"srchkey": "building","tgtkey":"address"},
  #   {"srchkey": "location","tgtkey":"address"},
  #   {"srchkey": "zipcode","tgtkey":"zipcode"},
  #   {"srchkey": "postal","tgtkey":"zipcode"},
  #   {"srchkey": "meternum","tgtkey":"meterid"},
  #    {"srchkey": "meteruiquenum","tgtkey":"meterid"}  
  # ]

  knowledgebase_list = []
  for dic in knowledgebase:
      for key,val in dic.items():
          if(key == "srchkey"):
            knowledgebase_list.append(val)

  print(knowledgebase_list)
  embeddings2 = model.encode(knowledgebase_list, convert_to_tensor=True)

  sourcekeys = sourcekeys_lemetized
  # sourcekeys = ['personname',
  #                  'e-mail',
  #                  'address','zip','meterid']

  knowledgebase_list_len = len(knowledgebase_list)
  cosine_scores_list = []
  for ele in sourcekeys:
    process_list = []
    for item in range(0,knowledgebase_list_len):
      process_list.append(ele)
    # print(process_list)
    embeddings1 = model.encode(process_list, convert_to_tensor=True)

    #Compute cosine-similarities
    cosine_scores = util.cos_sim(embeddings1, embeddings2)
    
    # for i in range(0,0):
    cosine_scores_list_interim = []
    # cosine_scores_list_interim_upd = []
    for j in range(0,len(knowledgebase_list)):
      cosine_scores_dict = {"testkey":ele,"trainkey": knowledgebase_list[j] , "cosine_quotient" : float("{:.4f}".format(cosine_scores[0][j]))*100}
      cosine_scores_list_interim.append(cosine_scores_dict)

    # print(cosine_scores[0])

    # print("#######")
    # print(cosine_scores_list_interim)
    knn_value = 3
    cosine_scores_list_interim_sorted = sorted(cosine_scores_list_interim, key=lambda x: x['cosine_quotient'], reverse=True)[:knn_value]
    # print(cosine_scores_list_interim_sorted)

    for item in cosine_scores_list_interim_sorted:
      srchkey = item['trainkey']
      target_tuple = next((item for item in knowledgebase if item["srchkey"] == srchkey), False)
      cdm_value = target_tuple['tgtkey']
      item['cdm_key'] = cdm_value
      # new_item = item.add('cdmcdm_value_key',cdm_value)
      cosine_scores_list.append(item)

  # print("Testkey \t\t TrainKey \t\t CDMKey \t\t CosineQuotient")
  print("Testkey,TrainKey,CDMKey,CosineQuotient")
  for ele in cosine_scores_list:
    # print("{} \t\t {} \t\t {} \t\t {} ".format(ele["testkey"], ele["trainkey"], ele["cdm_key"],ele["cosine_quotient"]))
    print("{},{},{},{} ".format(ele["testkey"], ele["trainkey"], ele["cdm_key"],ele["cosine_quotient"]))
    # for i in range(len(process_list)):
    #       print("{} \t\t {} \t\t Score: {:.4f}".format(process_list[i], knowledgebase_list[i], cosine_scores[i][i]))

  import operator
  import itertools 
  interm_list=[]
  final_mapping = []
  for i,g in itertools.groupby(sorted(cosine_scores_list, key=operator.itemgetter("testkey","cosine_quotient"), reverse=True)
        ,key= operator.itemgetter("testkey")):
      interm_list.append(list(g))

  for ele in interm_list:
    # print("#####")
    # print(ele)
    if(ele[0]['cosine_quotient'] > 75.0):
        final_mapping.append({'sourcekey':ele[0]["testkey"],'cosine_quotient' : ele[0]["cosine_quotient"],'cdm_key' : ele[0]["cdm_key"],'comment': "Mapping confirmed"})
    elif ((ele[0]['cosine_quotient'] > 60.0 and ele[0]['cosine_quotient'] < 75.0) and 
          (ele[1]['cosine_quotient'] > 60.0 and ele[1]['cosine_quotient'] < 75.0)):
        final_mapping.append({'sourcekey':ele[0]["testkey"],'cosine_quotient' : ele[0]["cosine_quotient"],'cdm_key' : ele[0]["cdm_key"],'comment': "Mapping confirmed"})
    elif ((ele[0]['cosine_quotient'] > 60.0 and ele[0]['cosine_quotient'] < 75.0) and 
          (ele[1]['cosine_quotient'] > 50.0 and ele[1]['cosine_quotient'] < 75.0) and
          ele[0]['cdm_key'] == ele[1]['cdm_key']):
        final_mapping.append({'sourcekey':ele[0]["testkey"],'cosine_quotient' : ele[0]["cosine_quotient"],'cdm_key' : ele[0]["cdm_key"],'comment': "Mapping confirmed"})
    elif ((ele[0]['cosine_quotient'] > 40.0 and ele[0]['cosine_quotient'] < 60.0) and 
          (ele[1]['cosine_quotient'] > 40.0 and ele[1]['cosine_quotient'] < 60.0) and
          ele[0]['cdm_key'] == ele[1]['cdm_key']):
        final_mapping.append({'sourcekey':ele[0]["testkey"],'cosine_quotient' : ele[0]["cosine_quotient"],'cdm_key' : ele[0]["cdm_key"],'comment': "Needs Manual Confirmation"})
    else :
        final_mapping.append({'sourcekey':ele[0]["testkey"],'cosine_quotient' : 'NA','cdm_key' : 'Multiple CDM Keys identified','comment': "Could not identify a relavent mapping field"})  
    
      # if():
      #   cosine_incrementer+=1
      #   previous_cosine = 
      #   final_mapping.append({'sourcekey':ele["testkey"],'cosine_quotient' : ele["cosine_quotient"],'cdm_key' : ele["cdm_key"],'comment': "No manual verfication required"})
      #   break

    

  print("$$$$$")
  # print(final_mapping)
  print("Sourcekey,CDMKey,CosineQuotient,comment")
  for ele in final_mapping:
    print("{},{},{},{} ".format(ele["sourcekey"], ele["cdm_key"], ele["cosine_quotient"],ele["comment"]))
  return  final_mapping 

from datetime import datetime
t1 = datetime.now()
#ml_mapping = process(['accountholdername','e-mail','accountnumber','accountdescription','city','state','addresses','zip','meterid'])
#print("$$$final result$$$$")
#print(ml_mapping)
t2 = datetime.now()
# get difference
delta = t2 - t1
ms = delta.total_seconds() * 1000

#print(f"Time difference is {ms} milliseconds")
