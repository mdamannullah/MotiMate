import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { MotiCard } from '@/components/ui/MotiCard';
import { FileText, Shield, Users, AlertTriangle, Scale } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    title: 'Terms of Use',
    content: `By using MotiMate, you agree to these terms. MotiMate is an educational platform designed to help students learn more effectively through AI-powered tools.

• You must be at least 13 years old to use this service
• You are responsible for maintaining the confidentiality of your account
• You agree to provide accurate information during registration
• You will not use the service for any illegal or unauthorized purpose`,
  },
  {
    icon: Shield,
    title: 'Privacy Policy',
    content: `We are committed to protecting your privacy and personal data.

• We collect only essential information needed to provide our services
• Your test scores and learning data are used to personalize your experience
• We never sell your personal information to third parties
• You can request deletion of your data at any time
• Analytics data helps us improve the app and is anonymized`,
  },
  {
    icon: Users,
    title: 'User Conduct',
    content: `As a MotiMate user, you agree to:

• Use the platform for legitimate educational purposes
• Not share your account credentials with others
• Respect intellectual property rights
• Not attempt to exploit or hack the system
• Report any bugs or security vulnerabilities responsibly`,
  },
  {
    icon: Scale,
    title: 'Content & Intellectual Property',
    content: `All content on MotiMate is protected by intellectual property laws.

• AI-generated notes and content are for personal use only
• You retain ownership of your own created content
• MotiMate owns the platform, design, and proprietary algorithms
• Unauthorized reproduction or distribution is prohibited`,
  },
  {
    icon: AlertTriangle,
    title: 'Disclaimers',
    content: `Please be aware of the following:

• MotiMate is a study aid and does not guarantee academic success
• AI translations and notes may contain errors - always verify important information
• We are not responsible for decisions made based on our content
• Service availability may vary and we reserve the right to modify features
• Subscription fees are non-refundable except as required by law`,
  },
];

export default function TermsScreen() {
  return (
    <div className="mobile-container min-h-screen pb-8">
      <AppHeader title="Terms & Conditions" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2"
        >
          <p className="text-sm text-muted-foreground">
            Last updated: December 2024
          </p>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => (
          <MotiCard key={section.title} delay={index * 0.1}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <section.icon size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          </MotiCard>
        ))}

        {/* Contact */}
        <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground text-center">
          <p>
            Questions about our terms? Contact us at{' '}
            <span className="text-primary font-medium">legal@motimate.app</span>
          </p>
        </div>
      </main>
    </div>
  );
}
