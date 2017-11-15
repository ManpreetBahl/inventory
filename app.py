from flask import Flask 
from flask import request
from flask import render_template
from flask import redirect
from flask import url_for
from flask import abort
import sys

app = Flask(__name__)

#Main page
#@app.route("/login", methods=["GET"])

#Checkout page
@app.route("/checkout", methods=["GET"])
def index():
    try:
        return render_template("checkout.html")
    except Exception as e:
        print "Encountered error: " + str(e)
        sys.exit(1)

#Request Page
@app.route("/request", methods=['GET', 'POST'])
def getRequest():
    #If the method is a POST, send an email with the request details to the inventory manager
    if request.method == "POST":
        print request.form
        return redirect(url_for("request"))

    if request.method == "GET":
        try:
            return render_template("request.html")
        except Exception as e:
            print "Encountered error: " + str(e)
            sys.exit(1)        

def main():
    app.run(host='localhost', port=7000)

if __name__ == '__main__':
    main()