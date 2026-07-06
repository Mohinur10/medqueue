import { Context, Scenes } from 'telegraf';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';

export interface MyWizardSession extends Scenes.WizardSessionData {
  hospitalId?: string;
  doctorId?: string;
  selectedDate?: string;
  selectedTime?: string;
}

// Custom Context Type to hold our user and support Scenes/Wizards
export interface MyContext extends Context {
  user?: any;
  session: Scenes.WizardSession<MyWizardSession>;
  scene: Scenes.SceneContextScene<MyContext, MyWizardSession>;
  wizard: Scenes.WizardContextWizard<MyContext>;
}

export const authMiddleware = async (ctx: MyContext, next: () => Promise<void>) => {
  try {
    if (!ctx.from) return next();

    const telegramId = ctx.from.id.toString();
    
    // Find user in DB by telegramId
    const user = await prisma.user.findUnique({
      where: { telegramId }
    });

    if (user) {
      ctx.user = user;
    }

    return next();
  } catch (error) {
    logger.error('Error in auth middleware', error);
    return next();
  }
};
