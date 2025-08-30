import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  Leaf,
  Repeat,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useIsLargeScreen from '../hook/useIsLargeScreen.js';
import backgroundImage1 from '/images/edu1.jpg';
import backgroundImage2 from '/images/edu2.jpg';
import backgroundImage3 from '/images/edu3.jpg';
import backgroundImage4 from '/images/edu4.jpg';

const VisionMission = () => {
  const { t } = useTranslation();
  const isLargeScreen = useIsLargeScreen();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const items = [
    {
      icon: <Target className="w-6 h-6" />,
      text: t('mission.goalAccess', 'Ensure quality education access for all'),
      bg: backgroundImage1,
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: t('mission.empowerTeachers', 'Empower teachers with modern tools'),
      bg: backgroundImage2,
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      text: t('mission.holisticGrowth', 'Support holistic student growth'),
      bg: backgroundImage3,
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      text: t('mission.scaleImpact', 'Scale impact through technology'),
      bg: backgroundImage4,
    },
    {
      icon: <Eye className="w-6 h-6" />,
      text: t('mission.buildAwareness', 'Build awareness in local communities'),
      bg: backgroundImage1,
    },
    {
      icon: <Repeat className="w-6 h-6" />,
      text: t('mission.continuousLearning', 'Foster a culture of continuous learning'),
      bg: backgroundImage2,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItemIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <section
      className="relative max-w-full px-4 py-20 bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url('/images/edu7.jpg')` }}
    >
      <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Vision Content (no card) */}
          <motion.div
            className="lg:w-1/2 flex flex-col justify-center pr-4"
            initial={isLargeScreen ? { x: -50, opacity: 0 } : {}}
            animate={isLargeScreen ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold drop-shadow-md">
                {t('vision.title', 'Our Vision')}
              </h2>
            </div>

            <p className="text-lg leading-relaxed text-blue-100 max-w-xl drop-shadow-md">
              {t(
                'vision.text',
                'To build a world where every learner thrives through equitable, innovative, and inclusive education.'
              )}
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 lg:w-1/2 backdrop-blur-xl bg-white/10 border border-blue-200/30 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105"
            initial={isLargeScreen ? { x: 50, opacity: 0 } : {}}
            animate={isLargeScreen ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${items[currentItemIndex].bg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-700/60" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/30 rounded-full backdrop-blur-sm">
                  <Target className="w-8 h-8 text-blue-200" />
                </div>
                <h2 className="text-3xl font-bold text-white">{t('mission.title', 'Our Mission')}</h2>
              </div>

              <div className="min-h-[100px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItemIndex}
                    className="flex gap-4 items-start text-white"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-200">
                      {items[currentItemIndex].icon}
                    </div>
                    <span className="text-xl font-semibold leading-relaxed">
                      {items[currentItemIndex].text}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-2 justify-center mt-8">
                {items.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentItemIndex
                        ? 'w-8 bg-blue-400 shadow-lg shadow-blue-400/50'
                        : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
