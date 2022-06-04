import sys
import base64
import cv2
from PIL import Image
import numpy as np

def decodeString(encoded_data):
    nparr = np.fromstring(encoded_data.decode('base64'), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_ANYCOLOR)
    return img

img = decodeString(sys.argv[1])
if(img!=np.empty):
    print("Success",flush=True)
else:
    print("Unsuccessful",flush=True)