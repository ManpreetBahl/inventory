from flask import Flask 
from flask import request
from flask import render_template
from flask import redirect
from flask import url_for
from flask import abort
import sys
import smtplib
from email.mime.text import MIMEText
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey
from sqlalchemy import inspect

app = Flask(__name__)
app.config["DEBUG"] = True


engine = create_engine("postgresql://postgres:3t/Y(E\F^:5Ls;M4@localhost/inventory")

"""
(15, u'Banana', 2, u'A yellow fruit', 5, '$2.50')
(20, u'Piano', 3, u'A musical instrument', 3, '$599.99')
(25, u'Apple', 1, u'A healthy fruit', 10, '$1.50')
"""
#Main page
#@app.route("/login", methods=["GET"])

#Checkout page
@app.route("/checkout", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        print request.form
        return redirect(url_for("index"))

    if request.method == "GET":
        try:
            #Get inventory data from database
            con = engine.connect()
            rows = con.execute("SELECT \"ID\", \"Name\", \"Description\", \"Quantity\" FROM inventory.items ORDER BY \"Name\"")
            con.close()

            return render_template("checkout.html", result=rows)
        except Exception as e:
            print "Encountered error: " + str(e)
            sys.exit(1)



#Request Page
@app.route("/request", methods=['GET', 'POST'])
def getRequest():
    #If the method is a POST, send an email with the request details to the inventory manager
    if request.method == "POST":
        body = request.form["custName"] + " has requested " + request.form["itemQuantity"] + " " + request.form["itemName"] + "."
        if request.form["otherInfo"]:
            body += "\nThe customer has specified additional information about the request:\n" + request.form["otherInfo"]

        body += "\n\nThe customer can be contacted at: " + request.form["custEmail"]
        message = MIMEText(body)
        message["Subject"] = "Request for " + request.form["itemName"]
        message["From"] = "fullstackfall2017@gmail.com"
        message["To"] = "fullstackfall2017@gmail.com"

        try:
            s = smtplib.SMTP('smtp.gmail.com', 587)
            s.ehlo()
            s.starttls()
            s.login("fullstackfall2017@gmail.com", "9=x5B]+ywAzEZDBQ")
            s.sendmail("fullstackfall2017@gmail.com", ["fullstackfall2017@gmail.com"], message.as_string())
            s.quit()
        except smtplib.SMTPException as e:
            abort(500)

        return redirect(url_for("getRequest"))

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