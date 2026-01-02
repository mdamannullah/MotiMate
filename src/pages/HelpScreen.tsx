import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { MotiCard } from '@/components/ui/MotiCard';
import { ChevronDown, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';

const faqs = [
  {
    question: 'How does live translation work?',
    answer: 'Our AI-powered system listens to lectures in regional languages (Tamil, Hindi, Telugu, etc.) and translates them to English in real-time. Simply select your source language, tap the microphone, and start listening!',
  },
  {
    question: 'What languages are supported?',
    answer: 'We currently support Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, and Gujarati for translation to English. More languages are being added!',
  },
  {
    question: 'How are smart notes generated?',
    answer: 'Our AI analyzes your lecture audio or text and creates structured notes with headings, bullet points, and key highlights automatically.',
  },
  {
    question: 'How does the AI Tutor work?',
    answer: 'MotiMate AI is trained on educational content. You can ask questions about any subject, and it will provide detailed explanations with examples.',
  },
  {
    question: 'What is included in the Pro plan?',
    answer: 'Pro plan includes unlimited translations, unlimited smart notes, advanced analytics, priority support, offline access, and no ads.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Go to Login page and click "Forgot Password". Enter your email and we will send you a reset link.',
  },
  {
    question: 'Can I use MotiMate offline?',
    answer: 'Pro plan users can download notes and tests for offline access. Live translation requires an internet connection.',
  },
];

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mobile-container min-h-screen pb-8">
      <AppHeader title="Help & FAQ" showBack />

      <main className="px-4 py-4 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <HelpCircle size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">How can we help?</h1>
          <p className="text-muted-foreground">Find answers to common questions</p>
        </motion.div>

        {/* FAQs */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <MotiCard key={index} delay={index * 0.05}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </div>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </MotiCard>
          ))}
        </div>

        {/* Contact Options */}
        <div>
          <h3 className="font-semibold mb-3">Still need help?</h3>
          <div className="space-y-2">
            <MotiCard delay={0.3} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Chat with Support</p>
                  <p className="text-xs text-muted-foreground">Get instant help</p>
                </div>
              </div>
            </MotiCard>
            <MotiCard delay={0.35} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Email Us</p>
                  <p className="text-xs text-muted-foreground">support@motimate.app</p>
                </div>
              </div>
            </MotiCard>
            <MotiCard delay={0.4} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Call Us</p>
                  <p className="text-xs text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
            </MotiCard>
          </div>
        </div>
      </main>
    </div>
  );
}
