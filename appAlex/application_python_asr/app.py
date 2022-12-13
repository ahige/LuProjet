from flask import Flask, request
import redis
import mysql.connector

app = Flask(__name__)

# Connect to Redis database
redis_db = redis.Redis(host="localhost", port=6379)

# Connect to MySQL database
mysql_db = mysql.connector.connect(
    host="localhost",
    user="app",
    password="",
    database="test"
)

@app.route("/")
def index():
    # Increment the number of visits in Redis
    visits = redis_db.incr("visits")

    # Retrieve the latest messages from MySQL
    cursor = mysql_db.cursor()
    cursor.execute("SELECT message FROM messages ORDER BY id DESC LIMIT 10")
    messages = cursor.fetchall()

    return f"""
        <html>
            <body>
                <h1>Tu est le visiteur n°  {visits}.</h1>
                <p>Dernier messages :</p>
                <ul>
                    {
                        "".join([f"<li>{message}</li>" for message in messages])
                    }
                </ul>
                <form method="post">
                    <input type="text" name="message" />
                    <input type="submit" value="Send" />
                </form>
            </body>
        </html>
    """

@app.route("/", methods=["POST"])
def add_message():
    # Retrieve the message from the form
    message = request.form["message"]

    # Store the message in the database
    cursor = mysql_db.cursor()
    cursor.execute("INSERT INTO messages (message) VALUES (%s)", (message,))
    mysql_db.commit()

    return "Message sent!"

if __name__ == "__main__":
    app.run()