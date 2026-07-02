import * as liveService from '../services/liveSession.service.js';

export const getCurrent = async (req, res) => {
  try {
    const session = await liveService.getCurrentLive();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const start = async (req, res) => {
  try {
    const session = await liveService.startLive(req.body);
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const end = async (req, res) => {
  try {
    const session = await liveService.endLive();
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};