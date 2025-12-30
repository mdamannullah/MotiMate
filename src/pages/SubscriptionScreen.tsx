import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';

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
    ],
    popular: true,
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: '₹1,499',
    period: 'per year',
    features: [
      'Everything in Pro Monthly',
      'Save ₹889 (37% off)',
      'Early access to features',
      'Exclusive content',
    ],
    bestValue: true,
  },
];

export default function SubscriptionScreen() {
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    // Payment integration will be added later
    console.log('Subscribe to:', planId);
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

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <MotiCard
              key={plan.id}
              delay={0.1 + index * 0.1}
              className={`relative ${plan.popular ? 'border-2 border-primary' : ''} ${
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
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
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
                </ul>

                {plan.current ? (
                  <div className="py-2 text-center text-muted-foreground font-medium">
                    Current Plan
                  </div>
                ) : (
                  <MotiButton
                    onClick={() => handleSubscribe(plan.id)}
                    size="full"
                    variant={plan.popular ? 'primary' : 'secondary'}
                  >
                    {plan.popular ? 'Get Pro' : 'Select Plan'}
                  </MotiButton>
                )}
              </div>
            </MotiCard>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-muted-foreground px-4">
          Cancel anytime. By subscribing, you agree to our Terms of Service.
        </p>
      </main>
    </div>
  );
}
