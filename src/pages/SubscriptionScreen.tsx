import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { Check, Crown, Sparkles, Zap, Shield, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: [
      '5 AI translations per day',
      '3 Smart notes per month',
      'Basic analytics',
      'Community support',
    ],
    limitations: [
      'Limited AI tutor access',
      'Ads enabled',
    ],
    current: true,
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: '₹199',
    period: 'per month',
    features: [
      'Unlimited AI translations',
      'Unlimited Smart notes',
      'Advanced analytics',
      'Priority support',
      'Offline access',
      'No ads',
      'Full AI tutor access',
    ],
    popular: true,
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: '₹1,499',
    period: 'per year',
    originalPrice: '₹2,388',
    features: [
      'Everything in Pro Monthly',
      'Save ₹889 (37% off)',
      'Early access to features',
      'Exclusive content',
      'Personalized study plans',
    ],
    bestValue: true,
  },
];

const faqs = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept UPI, Credit/Debit cards, Net Banking, and popular wallets like Paytm and PhonePe.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with our Pro features.',
  },
];

export default function SubscriptionScreen() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }

    setSelectedPlan(planId);
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast.success('Payment integration coming soon! 🚀', {
        description: 'We\'re working on adding secure payment options.',
      });
      setSelectedPlan(null);
    }, 1500);
  };

  const getButtonText = (plan: typeof plans[0]) => {
    if (plan.current) return 'Current Plan';
    if (processing && selectedPlan === plan.id) return 'Processing...';
    if (plan.popular) return 'Get Pro Monthly';
    if (plan.bestValue) return 'Get Pro Yearly';
    return 'Select Plan';
  };

  return (
    <div className="mobile-container min-h-screen pb-8">
      <AppHeader title="Subscription" showBack />

      <main className="px-4 py-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Crown size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Upgrade to Pro</h1>
          <p className="text-muted-foreground">
            Unlock all features and study without limits
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1">
            <Shield size={14} className="text-success" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-primary" />
            <span>Cancel Anytime</span>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <MotiCard
              key={plan.id}
              delay={0.1 + index * 0.1}
              className={`relative overflow-visible ${plan.popular ? 'border-2 border-primary shadow-lg' : ''} ${
                plan.bestValue ? 'border-2 border-success' : ''
              }`}
            >
              {/* Badges */}
              {plan.popular && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> Most Popular
                </div>
              )}
              {plan.bestValue && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-success text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <Zap size={12} /> Best Value
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  {'originalPrice' in plan && (
                    <span className="text-sm text-muted-foreground line-through">{plan.originalPrice}</span>
                  )}
                  <span className="text-2xl font-extrabold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {'limitations' in plan && plan.limitations?.map((limitation) => (
                    <li key={limitation} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X size={16} className="text-destructive/60 flex-shrink-0" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <div className="py-3 text-center text-muted-foreground font-medium bg-muted/50 rounded-xl">
                    ✓ Current Plan
                  </div>
                ) : (
                  <MotiButton
                    onClick={() => handleSubscribe(plan.id)}
                    size="full"
                    variant={plan.popular ? 'primary' : 'secondary'}
                    loading={processing && selectedPlan === plan.id}
                  >
                    {getButtonText(plan)}
                  </MotiButton>
                )}
              </div>
            </MotiCard>
          ))}
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <MotiCard key={index} delay={0.5 + index * 0.1} className="!p-3">
              <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
              <p className="text-xs text-muted-foreground">{faq.answer}</p>
            </MotiCard>
          ))}
        </motion.div>

        {/* Note */}
        <p className="text-center text-xs text-muted-foreground px-4">
          By subscribing, you agree to our{' '}
          <button onClick={() => navigate('/terms')} className="text-primary underline">
            Terms of Service
          </button>
          . Prices are in INR.
        </p>
      </main>
    </div>
  );
}
