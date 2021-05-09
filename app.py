from flask import Flask, Response,request,render_template,redirect
from flask_cors import CORS
import pymongo
import dns
import json
from bson.objectid import ObjectId
import datetime
app=Flask(__name__)
CORS(app)

try:
    #client = pymongo.MongoClient("mongodb://Nishchay:nishchay@cluster0-shard-00-00.mxa0x.mongodb.net:27017,cluster0-shard-00-01.mxa0x.mongodb.net:27017,cluster0-shard-00-02.mxa0x.mongodb.net:27017/test?ssl=true&replicaSet=atlas-xvzs52-shard-0&authSource=admin&retryWrites=true&w=majority")
    client=pymongo.MongoClient(
            host="localhost",
            port=27017,
            serverSelectionTimeoutMS=1000
        )
    db = client.get_database('Blogs')
    client.server_info()
except:
    print("Could Not connect to the database")

app =Flask(__name__)

@app.route("/")
def home():   
    return render_template("index.html")
@app.route("/posts/new-blog")
def newpost():
    return render_template("make_post.html")
@app.route("/posts",methods=["GET","POST"])
def post():
    if request.method=="POST" :
        try:
            print("start")
            post={
                "title":request.form["title"],
                "content":request.form["content"],
                "author":request.form["author"]
                # "created_at": datetime.datetime.now() 
    #updated_at = db.DateTimeField(required=True, default=datetime.datetime.now)
                }
            print("end")
            print(post)
            dbResponse=db.blog.insert_one(post)  
            return redirect("/posts")
            
        except Exception as ex:
            print(ex)
    else:
         return render_template("posts.html")
      
@app.route("/posts/update/<string:id>",methods=["PUT"])
def update(id):
     try:
            data=request.json
            print(data)
            dbResponse=db.blog.update_one(
            {"_id":ObjectId(id)},
            {"$set":{"title":request.json["title"],"content":request.json["content"] }}
            )
            return redirect("/posts")
    
     except Exception as ex:
        print(ex)

@app.route("/posts/delete/<string:id>",methods=["DELETE"])
def delete(id):
     try:
        print(type(id)) 
        dbResponse=db.blog.delete_one(
            {"_id":ObjectId(id)}
        )
        print(dbResponse)
        return redirect("/posts")
         
     except Exception as ex:
        print(ex)

@app.route("/posts/read",methods=["GET"])
def get_user():
    try:
        data=list(db.blog.find())
        for blogs in data:
            blogs['_id']=str(blogs['_id'])

        print(data)

        return Response(
            response=json.dumps(data),
            status=200,
            mimetype="application/json"
        )
        
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message":"Cannot find users"}),
            status=500,
            mimetype="application/json"
        )

@app.route("/posts/read/<string:id>",methods=["GET"])
def get_user_byId(id):
     try:
        dbResponse=db.blog.find_one(
            {"_id":ObjectId(id)}
        )
        

        return Response(
            response=json.dumps({"title":dbResponse["title"],"content":dbResponse["content"]}),
            status=200,
            mimetype="application/json"
        )
        
     except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message":"User not found"}),
            status=500,
            mimetype="application/json"
        )



if __name__=="__main__":
    app.run(debug=True,port=8080)