import cv2
from imutils import paths
import os, sys
import pickle
from facerecognitionutility import facerecognition as fr
from sklearn.neural_network import MLPClassifier

def objToFile(dir,obj):
    with open(dir, 'wb') as handle:
        pickle.dump(obj, handle, protocol=pickle.HIGHEST_PROTOCOL)

def fileToObj(dir):
    with open(dir, 'rb') as handle:
        return pickle.load(handle)

def updatePickles(userId, imagePaths, lbp_hogs, labels):            #Funkcija zgenerira nove značilnice, če so izpolnjeni pogoji
    for i in imagePaths:
        img = cv2.imread(i)                                         #Preberemo sliko
        img = fr.getFace(img)
        #img = cv2.resize(img,(300,300),interpolation=cv2.INTER_AREA)
        gradients, directions = fr.sobel(img)
        imgLbp = fr.lbp(img).tolist()
        imgHog = fr.hog(img,8,12,2,gradients,directions)
        join = imgLbp+imgHog
        print("Processed image",i)
        lbp_hogs.append(join)
        labels.append(userId)
    print(len(lbp_hogs))
    print(len(labels))
    print("Added",userId)
    objToFile(modelsFolder+"/faces.pickle",lbp_hogs)
    objToFile(modelsFolder+"/labels.pickle",labels)
    return lbp_hogs, labels

userId = sys.argv[0]
conditions = True                                                #Pogoj za izvajanje bo v prihodnosti ALI je uporabnik že zabeležen v sistemu face-recognition prijave, če je, bo ta vrednost false

if(conditions):
    dirname = os.path.dirname(os.path.abspath(__file__))              #Pridobimo trenutni delovni direktorij
    imagesFolder = os.path.join(dirname,'Images')                     #Dobimo pot do Images mape, tukaj je lahko v prihodnosti več podmap za uporabnike?
    modelsFolder = os.path.join(dirname,'Models')
    imagePaths = list(paths.list_images(imagesFolder))                #Pridobimo poti do vseh slik v en array

    lbp_hogs = fileToObj(modelsFolder+"/faces.pickle")                #Preberemo trenutne značilnice iz datoteke faces.pickle
    labels = fileToObj(modelsFolder+"/labels.pickle")                 #Preberemo trenutne labele iz labels.pickle

    lbp_hogs, labels = updatePickles(userId, imagePaths, lbp_hogs, labels)    #Vnesemo novega uporabnika v zbirko značilnic

    mlp = MLPClassifier(hidden_layer_sizes=(100,), activation='tanh', solver='adam', learning_rate='constant', max_iter=1000)             #Pripravimo Multi-Layer Perception Classifier

    mlp.fit(lbp_hogs,labels)
    objToFile(modelsFolder+"/model.pickle", mlp)                      #Shranimo zgeneriran model v datoteko model.pickle
else:
    print("This user is already registered in the system.")