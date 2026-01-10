import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { ArrowLeft, BookOpen, Users, Target, Heart, Building2, Globe } from 'lucide-react';
import splashMascot from '@/assets/splash-mascot.png';
import { Footer } from '@/components/layout/Footer';

export default function AboutScreen() {
  const navigate = useNavigate();

  const values = [
    { icon: BookOpen, title: 'Education First', desc: 'Making quality education accessible to all' },
    { icon: Users, title: 'Student-Centric', desc: 'Built for Indian students, by understanding their needs' },
    { icon: Target, title: 'AI-Powered', desc: 'Leveraging AI to break language barriers' },
    { icon: Heart, title: 'Inclusive', desc: 'Supporting regional language speakers' },
  ];

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <main className="flex-1 px-6 pt-20 pb-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img
            src={splashMascot}
            alt="MotiMate"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">About MotiMate</h1>
          <p className="text-muted-foreground">
            Your AI-Powered Study Companion
          </p>
        </motion.div>

        {/* Company Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 mb-6 shadow-card border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Building2 size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-base">A Product by</h2>
              <p className="text-sm text-muted-foreground">Moti Software Private Limited</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe size={14} />
            <span>A Moti Global Ventures Company</span>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 mb-6 shadow-card"
        >
          <h2 className="font-bold text-lg mb-3">Our Mission</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            MotiMate is designed to help Indian students who face language barriers in classrooms. 
            We use AI to translate lectures from regional languages (Tamil, Kannada, Telugu, Hindi) 
            into English in real-time, generate smart notes, and provide personalized study analytics.
          </p>
        </motion.div>

        {/* Values */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-4">Our Values</h2>
          <div className="grid grid-cols-2 gap-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-soft"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <value.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{value.title}</h3>
                <p className="text-xs text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-5 mb-6 shadow-card"
        >
          <h2 className="font-bold text-lg mb-3">Our Vision</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            At Moti Software Private Limited, we believe every student deserves equal access to education, 
            regardless of their language background. MotiMate is our flagship product that bridges the 
            gap between regional language speakers and quality English education content.
          </p>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <MotiButton onClick={() => navigate('/contact')} size="full" variant="outline">
            Contact Us
          </MotiButton>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}