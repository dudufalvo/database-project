# database-project
# Backend

## Quick Start

Start a virtual environment

    virtualenv env
    source env/Scripts/activate

Install the requirements

    pip install -r requirements.txt

Create *.env* with the following variables

    DATABATE_URL="host=localhost dbname=your_db user=your_user password=your_pass"

And create a *.flaskenv*

    FLASK_APP=api
    FLASK_DEBUG=1
    FLASK_RUN_PORT=8000 # Optional

Then finally, run the Flask API

    cd backend #Ensure that are in the right directory
    flask run
