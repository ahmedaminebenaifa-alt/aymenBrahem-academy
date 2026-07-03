import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

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

  return await prisma.liveSession.upsert({
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