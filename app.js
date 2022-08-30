import express from "express";
//import ejs from "ejs";
import mongoose from "mongoose";

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/libraryDB", {useNewUrlParser: true});

const bookSchema = {
    title: String,
    content: String
};

const Book = mongoose.model("Book", bookSchema);

//TO DO

app.get("/", function (req, res) {
    res.render("home");
});

/////Requests Targeting all books/////
app.route("/books")
    .get(function(req,res){
        Book.find(function(err, foundBooks){
            if(!err){
                res.send(foundBooks);
                console.log(foundBooks);
            } else {
                res.send(err);
            }
        })
    })
    .post(function(req, res){
        //console.log(req.body.title);
        //console.log(req.body.content);
        const newBook = new Book({
            title: req.body.title,
            content: req.body.content
        });
        newBook.save(function(err){
            if(!err){
                //res.send("Successfully added a new book!");
                console.log("Successfully added the new book! " + newBook.title);
                res.redirect("/");
            } else {
                res.send(err);
            }
        });
    })
    .delete( function(req,res){
        Book.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all books!");
            } else {
                res.send(err);
            }
        });
    });

/////Requests Targeting A Specific book/////

app.route("/books/:bookTitle")
    .get(function(req,res){
        Book.findOne({title: req.params.bookTitle }, function(err,foundBook){  // READ from DB
            if(foundBook){
                res.send(foundBook);
            } else {
                res.send("No book matching that title was found.");
            }
        });
    })

    .put(function(req, res){
        Book.replaceOne(
            {title: req.params.bookTitle}, // find the document by title
            {title: req.body.title, content: req.body.content},
            function(err){
                if(!err){
                    res.send("Successfully updated book.");
                } else {
                    res.send(err);
                }
        }
        );
    })

    .patch(function(req, res){
        Book.updateOne(
            {title: req.params.bookTitle}, // find the document by title
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated Book.");
                    //console.log(req.body);
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete(function(req, res){
        Book.deleteOne(
            {title: req.params.bookTitle},
            function(err){
                if(!err){
                    res.send("successfully deleted the corresponding Book.");
                    console.log("successfully deleted the corresponding Book.");
                    res.send(err);
                }
            }
        );
    });


app.listen(3000, function(){
    console.log("Server started on port 3000")
});