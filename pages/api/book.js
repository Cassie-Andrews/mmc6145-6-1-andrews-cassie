import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {

    if (!req.session.user) {
      return res.status(401).json({message: "Not logged in"})
    }
      switch (req.method) {
        // TODO: On a POST request, add a book using db.book.add with request body 
        case "POST":
          try {
            // const bookData = req.body
            console.log({"(post) Book info: ": req.body})
            const userId = req.session.user.id
            //const bookId = req.body.googleId
            const book = req.body
            
            console.log(userId)
            //console.log(bookId)
            console.log(book)

            const newBook = await db.book.add(userId, book)
            
            if (!newBook) {
              req.session.destroy()
              return res.status(401).json({ message: "Book not found." })
            }

            return res.status(200).json({ message: "A new book has been added." })
          } catch (error) {
            return res.status(400).json({ error: error.message })
          }
      
        // TODO: On a DELETE request, remove a book using db.book.remove with request body 
        case "DELETE":
          try {
            // const bookData = req.body
            const userId = req.session.user.id
            //const bookId = req.body.googleId
            const book = req.body.id

            console.log({ userId, book})
            
            const deletedBook = await db.book.remove(userId, book)

            if (!deletedBook) {
              req.session.destroy()
              return res.status(401).json({ message: "Book not found." })
            } 

            return res.status(200).json({ message: "Book has been removed." })

          } catch (error) {
            return res.status(400).json({ error: error.message })
          }

  }
    // TODO: Respond with 404 for all other requests
    // User info can be accessed with req.session
    // No user info on the session means the user is not logged in
    return res.status(404).end()
  },
  sessionOptions
)
