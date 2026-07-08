import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import * as notificationService from './notification.service.js';

export const getCurrentLive = async () => {

  const session = await prisma.liveSession.findFirst();
  
  
  if (!session || !session.isActive) {
    return { isActive: false, title: null, link: null };
  }
  
  return session;
};


export const startLive = async (data) => {
  if (!data.title || !data.link) {
    throw new ApiError(400, 'العنوان والرابط مطلوبان (Title and link are required)');
  }


  const activeSession = await prisma.liveSession.findFirst();

  const session = await prisma.liveSession.upsert({
    where: { id: activeSession?.id || 'default-id' }, 
    update: {
      title: data.title,
      link: data.link,
      isActive: true,
      startedAt: new Date(),
    },
    create: {
      title: data.title,
      link: data.link,
      isActive: true,
      startedAt: new Date(),
    },
  });
  
  await notificationService.createNotification({
    type: 'LIVE_SESSION',
    title: 'بدأ بث مباشر جديد',
    message: session.title,
    link: '/dashboard/student', 
  });
  
  return session;

};



export const endLive = async () => {
 
  await prisma.liveSession.updateMany({
    data: {
      title: null,
      link: null,
      isActive: false,
      startedAt: null,
    },
  });

  return { success: true, message: 'تم إيقاف البث بنجاح' }; 
};