 const express = require ('express')
 const botController = require('../controllers/botController')
const multerConfig = require('../Middleware/multerMiddleware')

const router = new express.Router()


// POST: Create or update a bot
router.post('/bots', botController.saveOrUpdateBot);

// Upload media for a bot node (optional route if needed)
router.post('/upload-media', multerConfig.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or unsupported file type' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

// GET: Get all bots
router.get('/bots', botController.getAllBots);

//edit bot by id
// ** NEW: GET bot by ID **
router.get('/bots/:id', botController.getBotById); // Changed to :id

// DELETE: Delete a bot by title
router.delete('/bots/:title', botController.deleteBot);


//  export router
module.exports = router