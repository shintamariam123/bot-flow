const Bot = require('../Models/botModel');

// Save or Update Bot
exports.saveOrUpdateBot = async (req, res) => {
  const { startBotTitle, nodes, edges } = req.body;

  if (!startBotTitle || !nodes) {
    return res.status(400).json({ message: 'startBotTitle and nodes are required' });
  }

  try {
    const existingBot = await Bot.findOne({ startBotTitle });

    if (existingBot) {
      existingBot.nodes = nodes;
      existingBot.edges = edges;
      await existingBot.save();
      return res.json({ message: 'Bot updated', bot: existingBot });
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

// Get bot by title
exports.getBotByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const bot = await Bot.findOne({ startBotTitle: title });
    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }
    res.json(bot);
  } catch (err) {
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
