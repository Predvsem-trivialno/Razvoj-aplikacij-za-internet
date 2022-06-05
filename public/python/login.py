import os, sys
import pickle
from facerecognitionutility import facerecognition as fr
from sklearn.metrics import confusion_matrix

def objToFile(dir,obj):
    with open(dir, 'wb') as handle:
        pickle.dump(obj, handle, protocol=pickle.HIGHEST_PROTOCOL)

def fileToObj(dir):
    with open(dir, 'rb') as handle:
        return pickle.load(handle)

print(sys.argv[0],flush=True)