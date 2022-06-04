import os, sys
import pickle

import cv2
from facerecognitionutility import facerecognition as fr
from sklearn.metrics import confusion_matrix

def objToFile(dir,obj):
    with open(dir, 'wb') as handle:
        pickle.dump(obj, handle, protocol=pickle.HIGHEST_PROTOCOL)

def fileToObj(dir):
    with open(dir, 'rb') as handle:
        return pickle.load(handle)

dirname = os.path.dirname(os.path.abspath(__file__))
modelsFolder = os.path.join(dirname,'Models')
imagesFolder = os.path.join(dirname,'Images')

mlp = fileToObj(modelsFolder+"/model.pickle")
img = cv2.imread("imageAttempt.jpg")
img = fr.getFace(img)

lbp_hog = []

gradients, directions = fr.sobel(img)
imgLbp = fr.lbp(img).tolist()
imgHog = fr.hog(img,8,12,2,gradients,directions)
join = imgLbp+imgHog
lbp_hog.append(join)

prediction = mlp.predict_proba(lbp_hog)

index = 0
max = 0
for i in range(0,len(mlp.classes_-1)):
    if(prediction[i]>max):
        index=i
        max=prediction[i]

if(max>60):
    print(mlp.classes_[index],flush=True)
else:
    print("unknown",flush=True)