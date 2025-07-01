

const Bot = require('../Models/botModel');

// Save or Update Bot
exports.saveOrUpdateBot = async (req, res) => {
  const { startBotTitle, nodes, edges, _id } = req.body; // Destructure _id as well

  if (!startBotTitle || !nodes) {
    return res.status(400).json({ message: 'startBotTitle and nodes are required' });
  }

  try {
    // If an _id is provided, attempt to find and update by _id
    if (_id) {
      const existingBot = await Bot.findById(_id);
      if (existingBot) {
        existingBot.startBotTitle = startBotTitle; // Allow title to be updated too
        existingBot.nodes = nodes;
        existingBot.edges = edges;
        await existingBot.save();
        return res.json({ message: 'Bot updated successfully', bot: existingBot });
      }
    }

    // If no _id or _id not found, check by title (for new creation or if _id wasn't passed initially)
    const existingBotByTitle = await Bot.findOne({ startBotTitle });

    if (existingBotByTitle) {
      // This path will be taken if saving a new bot with an existing title,
      // or if editing without passing the _id explicitly
      existingBotByTitle.nodes = nodes;
      existingBotByTitle.edges = edges;
      await existingBotByTitle.save();
      return res.json({ message: 'Bot updated', bot: existingBotByTitle });
    } else {
      const newBot = new Bot({ startBotTitle, nodes, edges });
      await newBot.save();
      return res.json({ message: 'Bot created', bot: newBot });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bots
exports.getAllBots = async (req, res) => {
  try {
    const bots = await Bot.find();
    res.json(bots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ** NEW: Get bot by ID **
exports.getBotById = async (req, res) => {
  const { id } = req.params;
  try {
    const bot = await Bot.findById(id);
    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }
    res.json(bot);
  } catch (err) {
    console.error('Error fetching bot by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete bot by title
exports.deleteBot = async (req, res) => {
  const { title } = req.params;
  try {
    const deleted = await Bot.findOneAndDelete({ startBotTitle: title });
    if (!deleted) {
      return res.status(404).json({ message: 'Bot not found' });
    }
    res.json({ message: 'Bot deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};