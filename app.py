from flask import Flask 
from flask import request
from flask import render_template
from flask import redirect
from flask import url_for
from flask import abort
import sys

app = Flask(__name__)

#Main Page
@app.route('/', methods=['GET'])
def index():
    try:
        return render_template("checkout.html")
    except Exception as e:
        print "Encountered error: " + str(e)
        sys.exit(1)

def main():
    app.run(host='localhost', port=7000)

if __name__ == '__main__':
    main()