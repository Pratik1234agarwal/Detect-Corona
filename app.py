from flask import Flask,redirect,render_template,request,jsonify;
from keras.models import load_model
import numpy as np


model = load_model("COVID2.h5")
print("Model Loadede successfully") 



app = Flask(__name__)


@app.route("/")
def home():
    return render_template('index.html')



@app.route("/detect",methods=['POST'])
def process():
    res = request.get_json(force=True)
    print(res)
    #res = request.json()
    #print(res)
    array = res['data']
    print(array)
    
    result = evaluate(array)
    return jsonify({'message':result})



def evaluate(x):
    x = np.array(x)
    x = x.reshape(1,-1)
    predict = model.predict(x)
    new_pred = predict.astype(int)
    for i in range (len(new_pred)):
        if new_pred[i][0] == 1:
            return("Confirmed")
        elif new_pred[i][1] == 1:
            return("LowRisks")
        elif new_pred[i][2] == 1:
            return("HighRisks")
        elif new_pred[i][3] == 1:
            return("Safe")
        else:
            for i in range(len(new_pred)): 
                for j in range (0,3):
                    max=predict[i][j]
                    if(predict[i][0] > max):    
                        max = predict[i][0]            
                        return("Confirmed")
                    elif(predict[i][1] > max):    
                        max = predict[i][1]            
                        return("HighRisks")
                    elif(predict[i][2] > max):    
                        max = predict[i][2]            
                        return("LowRisks")
                    elif(predict[i][3] > max):    
                        max = predict[i][3]            
                        return("Safe")



print("Testing model :")
print(evaluate([0,0,0,1,1,1,0,1,0,0,0]))
print("Model working fine")

if __name__ == '__main__':
    app.run(debug=True)