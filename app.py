#################################################################################
# Inventory Management System
# Manpreet Bahl
# CS 510- Full Stack Project
# The Python Flask tutorial played a key role to the structure and development
# of the backend. The link to the Flask tutorial can be found here:
#   http://flask.pocoo.org/docs/0.12/tutorial/ 
#################################################################################

#################################################################################
# Python Imports
#################################################################################
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
import json
#################################################################################

#################################################################################
# Set up Flask App and configure it to Debug mode, which restarts the server 
# everytime the code is changed. 
#################################################################################
app = Flask(__name__)
app.config["DEBUG"] = True

#################################################################################
# Create DB engine object to talk to PostgreSQL database
#################################################################################
engine = create_engine("postgresql://postgres:3t/Y(E\F^:5Ls;M4@localhost/inventory")

#################################################################################
# Checkout page which is also the home page
#################################################################################
@app.route("/", methods=["GET"])
@app.route("/checkout", methods=["GET", "POST"])
def index():
    # Process POST data for checkout
    if request.method == "POST":
        try:
            # Connect to the DB
            con = engine.connect()
            con.connect()
            # Send request information to the DB after checking
            for item in request.json:
                quantity = item['checkoutquantity']
                if int(quantity) < 0:
                    abort(400, description="Can not have negative checkout out quantity")
                else:
                    #SQL below was found here: https://stackoverflow.com/questions/16277339/decrement-value-in-mysql-but-not-negative
                    #Parameterized SQL was found here: https://stackoverflow.com/questions/902408/how-to-use-variables-in-sql-statement-in-python
                    con.execute("UPDATE inventory.items SET \"Quantity\" = \"Quantity\" - %s WHERE \"ID\" = %s", (quantity, item['itemID']))
            con.close()
            
            return render_template('checkout.html')

        except Exception as e:
            print "Encountered error: " + str(e)
            sys.exit(1)
        
    # Return rendered template along with current inventory
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
#################################################################################

#################################################################################
# Checkin Page
# Similar functionality to checkout but it adds items back to the inventory
#################################################################################
@app.route("/checkin", methods=["GET", "POST"])
def getCheckIn():
    # Process POST request
    if request.method == "POST":
        try:
            # Connect to DB
            con = engine.connect()
            con.connect()
            # Update the database with the POST data after checking 
            for item in request.json:
                quantity = item['checkinquantity']
                if int(quantity) < 0:
                    abort(400, description="Can not have negative checkout out quantity")
                else:
                    # SQL below was found here: https://stackoverflow.com/questions/16277339/decrement-value-in-mysql-but-not-negative
                    # Parameterized SQL was found here: https://stackoverflow.com/questions/902408/how-to-use-variables-in-sql-statement-in-python
                    con.execute("UPDATE inventory.items SET \"Quantity\" = \"Quantity\" + %s WHERE \"ID\" = %s", (quantity, item['itemID']))
            con.close()
            
            return render_template('checkin.html')

        except Exception as e:
            print "Encountered error: " + str(e)
            sys.exit(1)

    # Return rendered template with the current inventory data
    if request.method == "GET":    
        try:
            #Get inventory data from database
            con = engine.connect()
            rows = con.execute("SELECT \"ID\", \"Name\", \"Description\", \"Quantity\" FROM inventory.items ORDER BY \"Name\"")
            con.close()

            return render_template("checkin.html", result=rows)
        except Exception as e:
            print "Encountered error: " + str(e)
            sys.exit(1)
#################################################################################

#################################################################################
# Request Page
# Client fills out a form which is emailed to a the inventory administrator
# from the program's email
#################################################################################
@app.route("/request", methods=['GET', 'POST'])
def getRequest():
    #If the method is a POST, send an email with the request details to the inventory manager
    if request.method == "POST":
        # Body of the email message
        body = request.form["custName"] + " has requested " + request.form["itemQuantity"] + " " + request.form["itemName"] + "."
        if request.form["otherInfo"]:
            body += "\nThe customer has specified additional information about the request:\n" + request.form["otherInfo"]

        body += "\n\nThe customer can be contacted at: " + request.form["custEmail"]
        message = MIMEText(body)
        message["Subject"] = "Request for " + request.form["itemName"]
        message["From"] = "fullstackfall2017@gmail.com"
        message["To"] = "fullstackfall2017@gmail.com"

        # Send the email using GMAIL SMTP server
        # Code below was found here https://stackoverflow.com/questions/10147455/how-to-send-an-email-with-gmail-as-provider-using-python
        try:
            s = smtplib.SMTP('smtp.gmail.com', 587)
            s.ehlo()
            s.starttls()
            s.login("fullstackfall2017@gmail.com", "9=x5B]+ywAzEZDBQ") # Hardcoded password is BAD, I know! But it's a dummy account :D
            s.sendmail("fullstackfall2017@gmail.com", ["fullstackfall2017@gmail.com"], message.as_string())
            s.quit()
        except smtplib.SMTPException as e:
            abort(500)

        return redirect(url_for("getRequest"))

    # Return rendered template 
    if request.method == "GET":
        try:
            return render_template("request.html")
        except Exception as e:
            print "Encountered error: " + str(e)
            sys.exit(1)        
#################################################################################

#################################################################################
# Main function
#################################################################################
def main():
    app.run(host='localhost', port=7000)

if __name__ == '__main__':
    main()
#################################################################################