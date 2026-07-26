import { Router } from 'express';
import express from 'express';
import * as liveController from '../controllers/live.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';
const router = Router();

router.post('/webhook', express.raw({ type: 'application/webhook+json' }), liveController.handleLiveKitWebhook);
router.post('/start', verifyAuth, requireRole('ADMIN'), liveController.startLive);
router.post('/end', verifyAuth, requireRole('ADMIN'), liveController.endLive);
router.get('/', verifyAuth, liveController.getLiveStatus);
router.post('/token', verifyAuth, liveController.getToken);
router.post('/raise-hand', verifyAuth, liveController.raiseHand);
router.post('/approve-mic', verifyAuth, requireRole('ADMIN'), liveController.approveMic);
router.post('/kick', verifyAuth, requireRole('ADMIN'), liveController.kickUser);
router.post('/revoke-mic', verifyAuth, requireRole('ADMIN'), liveController.revokeMic);

router.post('/schedule', verifyAuth, requireRole('ADMIN'), liveController.scheduleLive);
router.get('/schedule', verifyAuth, liveController.getSchedule);
router.post('/schedule/:id/start', verifyAuth, requireRole('ADMIN'), liveController.startScheduled);
router.delete('/schedule/:id', verifyAuth, requireRole('ADMIN'), liveController.cancelScheduled);

export default router;