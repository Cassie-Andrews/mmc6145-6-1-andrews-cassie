import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    // User info can be accessed with req.session

    // No user info on the session means the user is not logged in
    if (!req.session.user) {
      return res.status(401).json({message: "Not logged in"})
    }
    
    switch (req.method) {
      // TODO: On a POST request
      case "POST":
        try {
          const { title, description, pages, googleId, thumbnail, previewLink, categories, authors } = req.body
          
          console.log(req.body)

          /*if (!title || !authors) {
            return res.status(400).json({error: "example"})
          }*/
          
          // add a book using db.book.add with request body 
          // test: should add book if user logged in
          const newBook = await db.book.add(req.body)
          if (!newBook) {
            req.session.destroy()
            return res.status(401).json({ message: "Book not found" })
          }

          return res.status(200).json({ message: "A new book has been added", book: newBook })
        } catch (error) {
          return res.status(400).json({error: error.message})
        }
      case "DELETE":
        try {
          //// check for book
          const { bookId } = req.body
          if (!bookId) {
            return res.status(400).json({error: "bookId required"})
          }
          // TODO: On a DELETE request, remove a book using db.book.remove with request body 
          const deletedBook = await db.book.remove(bookId)
          if (!deletedBook) {
            req.session.destroy()
            return res.status(401).json({message: "Book not found"})
          }

          return res.status(200).json({message: "Book has been removed"})
        } catch (error) {
          return res.status(400).json({error: error.message})
        }

        // TODO: Respond with 404 for all other requests
        default:
          return res.status(404).end()
    }
  },
  sessionOptions
)