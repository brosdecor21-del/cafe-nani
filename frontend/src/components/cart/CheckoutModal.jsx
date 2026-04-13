import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, Wallet, Banknote, MapPin, Coffee, ArrowLeft, ArrowRight, Loader2, Truck, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import confetti from 'canvas-confetti';

const steps = ['details', 'orderType', 'payment', 'review'];

const CheckoutModal = () => {
  const { cart, isCheckoutOpen, closeCheckout, getSubtotal, clearCart } = useCart();
  const { language } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'pickup',
    paymentMethod: 'card',
    address: '',
    city: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState({});

  const hasBeans = useMemo(() => cart.some(item => item.type === 'bean'), [cart]);
  const hasMenuItems = useMemo(() => cart.some(item => item.type !== 'bean'), [cart]);

  const t = {
    checkout: language === 'hu' ? 'Penztár' : 'Checkout',
    step1: language === 'hu' ? 'Adatok' : 'Details',
    step2: language === 'hu' ? 'Rendeles tipusa' : 'Order Type',
    step3: language === 'hu' ? 'Fizetes' : 'Payment',
    step4: language === 'hu' ? 'Attekintes' : 'Review',
    name: language === 'hu' ? 'Nev' : 'Name',
    email: language === 'hu' ? 'Email' : 'Email',
    phone: language === 'hu' ? 'Telefonszam' : 'Phone Number',
    delivery: language === 'hu' ? 'Hazhoz szallitas' : 'Home Delivery',
    deliveryDesc: language === 'hu' ? 'Szallitjuk a cimedre (1-2 munkanap)' : 'Delivered to your address (1-2 business days)',
    pickup: language === 'hu' ? 'Helyben atvétel' : 'Store Pickup',
    pickupDesc: language === 'hu' ? 'Vedd at a kavezóban' : 'Pick up at the café',
    dineIn: language === 'hu' ? 'Helyben fogyasztas' : 'Dine-in',
    dineInDesc: language === 'hu' ? 'Elvezd a helyszinen' : 'Enjoy at the café',
    card: language === 'hu' ? 'Bankkartya' : 'Credit/Debit Card',
    applePay: 'Apple Pay',
    cash: language === 'hu' ? 'Keszpenz' : 'Cash',
    cashDesc: language === 'hu' ? 'Fizetes atvételkor' : 'Pay on pickup/delivery',
    orderSummary: language === 'hu' ? 'Rendeles osszegzese' : 'Order Summary',
    subtotal: language === 'hu' ? 'Reszosszeg' : 'Subtotal',
    deliveryFee: language === 'hu' ? 'Szallitasi dij' : 'Delivery Fee',
    total: language === 'hu' ? 'Osszesen' : 'Total',
    prepTime: language === 'hu' ? 'Varhato elkeszules' : 'Estimated prep time',
    deliveryTime: language === 'hu' ? 'Varhato kiszallitas' : 'Estimated delivery',
    minutes: language === 'hu' ? 'perc' : 'minutes',
    businessDays: language === 'hu' ? '1-2 munkanap' : '1-2 business days',
    placeOrder: language === 'hu' ? 'Rendeles leadasa' : 'Place Order',
    processing: language === 'hu' ? 'Feldolgozas...' : 'Processing...',
    back: language === 'hu' ? 'Vissza' : 'Back',
    next: language === 'hu' ? 'Tovabb' : 'Next',
    orderConfirmed: language === 'hu' ? 'Rendeles megerositve!' : 'Order Confirmed!',
    thankYou: language === 'hu' ? 'Koszonjuk a rendelesedet!' : 'Thank you for your order!',
    orderNumber: language === 'hu' ? 'Rendelesszam' : 'Order Number',
    backToMenu: language === 'hu' ? 'Vissza a menuebe' : 'Back to Menu',
    required: language === 'hu' ? 'Kotelez mez' : 'Required field',
    invalidEmail: language === 'hu' ? 'Ervenytelen email' : 'Invalid email',
    address: language === 'hu' ? 'Cim' : 'Address',
    city: language === 'hu' ? 'Varos' : 'City',
    zipCode: language === 'hu' ? 'Iranyitoszam' : 'Zip Code',
    free: language === 'hu' ? 'Ingyenes' : 'Free',
  };

  const subtotal = getSubtotal();
  const deliveryFee = formData.orderType === 'delivery' ? 990 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!isCheckoutOpen) {
      setTimeout(() => {
        setCurrentStep(0);
        setOrderComplete(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          orderType: hasBeans && !hasMenuItems ? 'delivery' : 'pickup',
          paymentMethod: 'card',
          address: '',
          city: '',
          zipCode: '',
        });
        setErrors({});
      }, 300);
    }
  }, [isCheckoutOpen, hasBeans, hasMenuItems]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !isProcessing) closeCheckout();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCheckout, isProcessing]);

  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCheckoutOpen]);

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 0) {
      if (!formData.name.trim()) newErrors.name = t.required;
      if (!formData.email.trim()) newErrors.email = t.required;
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.invalidEmail;
      if (!formData.phone.trim()) newErrors.phone = t.required;
    }

    if (currentStep === 1 && formData.orderType === 'delivery') {
      if (!formData.address.trim()) newErrors.address = t.required;
      if (!formData.city.trim()) newErrors.city = t.required;
      if (!formData.zipCode.trim()) newErrors.zipCode = t.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const orderNum = `NANI-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(orderNum);
    setOrderComplete(true);
    setIsProcessing(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C8A97E', '#3A2F2A', '#F8F5F0'],
    });
    clearCart();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="name" className="text-[#3A2F2A]">{t.name}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-2 ${errors.name ? 'border-red-500' : 'border-[#E5E0D8]'}`}
                placeholder="John Doe"
                data-testid="checkout-name-input"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="text-[#3A2F2A]">{t.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-2 ${errors.email ? 'border-red-500' : 'border-[#E5E0D8]'}`}
                placeholder="john@example.com"
                data-testid="checkout-email-input"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone" className="text-[#3A2F2A]">{t.phone}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-2 ${errors.phone ? 'border-red-500' : 'border-[#E5E0D8]'}`}
                placeholder="+36 20 123 4567"
                data-testid="checkout-phone-input"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Delivery option - shown when beans in cart */}
            {hasBeans && (
              <button
                onClick={() => setFormData(prev => ({ ...prev, orderType: 'delivery' }))}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.orderType === 'delivery'
                    ? 'border-[#C8A97E] bg-[#C8A97E]/10'
                    : 'border-[#E5E0D8] hover:border-[#C8A97E]/50'
                }`}
                data-testid="order-type-delivery"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    formData.orderType === 'delivery' ? 'bg-[#C8A97E]' : 'bg-[#F8F5F0]'
                  }`}>
                    <Truck size={20} className={formData.orderType === 'delivery' ? 'text-white' : 'text-[#3A2F2A]'} />
                  </div>
                  <div>
                    <p className="font-medium text-[#3A2F2A]">{t.delivery}</p>
                    <p className="text-sm text-[#3A2F2A]/60">{t.deliveryDesc}</p>
                  </div>
                  {formData.orderType === 'delivery' && (
                    <Check size={20} className="ml-auto text-[#C8A97E]" />
                  )}
                </div>
              </button>
            )}

            {/* Pickup option - always shown */}
            <button
              onClick={() => setFormData(prev => ({ ...prev, orderType: 'pickup' }))}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                formData.orderType === 'pickup'
                  ? 'border-[#C8A97E] bg-[#C8A97E]/10'
                  : 'border-[#E5E0D8] hover:border-[#C8A97E]/50'
              }`}
              data-testid="order-type-pickup"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  formData.orderType === 'pickup' ? 'bg-[#C8A97E]' : 'bg-[#F8F5F0]'
                }`}>
                  <Store size={20} className={formData.orderType === 'pickup' ? 'text-white' : 'text-[#3A2F2A]'} />
                </div>
                <div>
                  <p className="font-medium text-[#3A2F2A]">{t.pickup}</p>
                  <p className="text-sm text-[#3A2F2A]/60">{t.pickupDesc}</p>
                </div>
                {formData.orderType === 'pickup' && (
                  <Check size={20} className="ml-auto text-[#C8A97E]" />
                )}
              </div>
            </button>

            {/* Dine-in option - only for menu items */}
            {hasMenuItems && (
              <button
                onClick={() => setFormData(prev => ({ ...prev, orderType: 'dineIn' }))}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.orderType === 'dineIn'
                    ? 'border-[#C8A97E] bg-[#C8A97E]/10'
                    : 'border-[#E5E0D8] hover:border-[#C8A97E]/50'
                }`}
                data-testid="order-type-dine-in"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    formData.orderType === 'dineIn' ? 'bg-[#C8A97E]' : 'bg-[#F8F5F0]'
                  }`}>
                    <Coffee size={20} className={formData.orderType === 'dineIn' ? 'text-white' : 'text-[#3A2F2A]'} />
                  </div>
                  <div>
                    <p className="font-medium text-[#3A2F2A]">{t.dineIn}</p>
                    <p className="text-sm text-[#3A2F2A]/60">{t.dineInDesc}</p>
                  </div>
                  {formData.orderType === 'dineIn' && (
                    <Check size={20} className="ml-auto text-[#C8A97E]" />
                  )}
                </div>
              </button>
            )}

            {/* Address fields for delivery */}
            <AnimatePresence>
              {formData.orderType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4 border-t border-[#E5E0D8] mt-4">
                    <p className="text-xs uppercase tracking-wider text-[#C8A97E]">
                      {language === 'hu' ? 'Szallitasi cim' : 'Delivery Address'}
                    </p>
                    <div>
                      <Label htmlFor="address" className="text-[#3A2F2A]">{t.address}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`mt-1 ${errors.address ? 'border-red-500' : 'border-[#E5E0D8]'}`}
                        placeholder={language === 'hu' ? 'Utca, hazszam' : 'Street, number'}
                        data-testid="checkout-address-input"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city" className="text-[#3A2F2A]">{t.city}</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.city ? 'border-red-500' : 'border-[#E5E0D8]'}`}
                          placeholder="Budapest"
                          data-testid="checkout-city-input"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-[#3A2F2A]">{t.zipCode}</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.zipCode ? 'border-red-500' : 'border-[#E5E0D8]'}`}
                          placeholder="1133"
                          data-testid="checkout-zip-input"
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <button
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                formData.paymentMethod === 'card'
                  ? 'border-[#C8A97E] bg-[#C8A97E]/10'
                  : 'border-[#E5E0D8] hover:border-[#C8A97E]/50'
              }`}
              data-testid="payment-card"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  formData.paymentMethod === 'card' ? 'bg-[#C8A97E]' : 'bg-[#F8F5F0]'
                }`}>
                  <CreditCard size={20} className={formData.paymentMethod === 'card' ? 'text-white' : 'text-[#3A2F2A]'} />
                </div>
                <p className="font-medium text-[#3A2F2A]">{t.card}</p>
                {formData.paymentMethod === 'card' && (
                  <Check size={20} className="ml-auto text-[#C8A97E]" />
                )}
              </div>
            </button>

            <button
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'applePay' }))}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                formData.paymentMethod === 'applePay'
                  ? 'border-[#C8A97E] bg-[#C8A97E]/10'
                  : 'border-[#E5E0D8] hover:border-[#C8A97E]/50'
              }`}
              data-testid="payment-apple-pay"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  formData.paymentMethod === 'applePay' ? 'bg-[#C8A97E]' : 'bg-[#F8F5F0]'
                }`}>
                  <Wallet size={20} className={formData.paymentMethod === 'applePay' ? 'text-white' : 'text-[#3A2F2A]'} />
                </div>
                <p className="font-medium text-[#3A2F2A]">{t.applePay}</p>
                {formData.paymentMethod === 'applePay' && (
                  <Check size={20} className="ml-auto text-[#C8A97E]" />
                )}
              </div>
            </button>

            <button
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                formData.paymentMethod === 'cash'
                  ? 'border-[#C8A97E] bg-[#C8A97E]/10'
                  : 'border-[#E5E0D8] hover:border-[#C8A97E]/50'
              }`}
              data-testid="payment-cash"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  formData.paymentMethod === 'cash' ? 'bg-[#C8A97E]' : 'bg-[#F8F5F0]'
                }`}>
                  <Banknote size={20} className={formData.paymentMethod === 'cash' ? 'text-white' : 'text-[#3A2F2A]'} />
                </div>
                <div>
                  <p className="font-medium text-[#3A2F2A]">{t.cash}</p>
                  <p className="text-sm text-[#3A2F2A]/60">{t.cashDesc}</p>
                </div>
                {formData.paymentMethod === 'cash' && (
                  <Check size={20} className="ml-auto text-[#C8A97E]" />
                )}
              </div>
            </button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sm uppercase tracking-wider text-[#C8A97E] mb-4">
                {t.orderSummary}
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size || 'default'}`} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm bg-[#F8F5F0] px-2 py-1 rounded">
                        {item.quantity}x
                      </span>
                      <div>
                        <span className="text-[#3A2F2A]">
                          {language === 'hu' ? item.name_hu : item.name_en}
                        </span>
                        {item.type === 'bean' && (
                          <span className="text-xs text-[#3A2F2A]/50 ml-1">({item.weight}g)</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[#3A2F2A]">
                      {((item.finalPrice || item.price) * item.quantity).toLocaleString()} Ft
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#E5E0D8]" />

            <div className="space-y-2">
              <div className="flex justify-between text-[#3A2F2A]/70">
                <span>{t.subtotal}</span>
                <span>{subtotal.toLocaleString()} Ft</span>
              </div>
              {formData.orderType === 'delivery' && (
                <div className="flex justify-between text-[#3A2F2A]/70">
                  <span>{t.deliveryFee}</span>
                  <span>{deliveryFee > 0 ? `${deliveryFee.toLocaleString()} Ft` : t.free}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium text-[#3A2F2A]">
                <span>{t.total}</span>
                <span className="text-[#C8A97E]">{total.toLocaleString()} Ft</span>
              </div>
            </div>

            <div className="h-px bg-[#E5E0D8]" />

            <div className="space-y-2">
              {formData.orderType === 'delivery' ? (
                <div className="flex items-center gap-3 text-sm text-[#3A2F2A]/70">
                  <Truck size={16} className="text-[#C8A97E]" />
                  <span>{t.deliveryTime}: {t.businessDays}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm text-[#3A2F2A]/70">
                  <Coffee size={16} className="text-[#C8A97E]" />
                  <span>{t.prepTime}: 5-10 {t.minutes}</span>
                </div>
              )}
              {formData.orderType === 'delivery' && formData.address && (
                <div className="flex items-start gap-3 text-sm text-[#3A2F2A]/70">
                  <MapPin size={16} className="text-[#C8A97E] mt-0.5" />
                  <span>{formData.address}, {formData.zipCode} {formData.city}</span>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderOrderComplete = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-24 h-24 bg-[#C8A97E] rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check size={48} className="text-white" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-['Cormorant_Garamond'] text-3xl text-[#3A2F2A] mb-2"
      >
        {t.orderConfirmed}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-[#3A2F2A]/70 mb-6"
      >
        {t.thankYou}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#F8F5F0] rounded-xl p-6 mb-8"
      >
        <p className="text-sm text-[#3A2F2A]/60 mb-1">{t.orderNumber}</p>
        <p className="text-2xl font-medium text-[#C8A97E]">{orderNumber}</p>
        <p className="text-sm text-[#3A2F2A]/60 mt-4">
          {formData.orderType === 'delivery' 
            ? `${t.deliveryTime}: ${t.businessDays}`
            : `${t.prepTime}: 5-10 ${t.minutes}`
          }
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={closeCheckout}
          className="bg-[#3A2F2A] hover:bg-[#2A1F1A] text-white px-8 py-4"
          data-testid="order-complete-close-btn"
        >
          {t.backToMenu}
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={!isProcessing ? closeCheckout : undefined}
        >
          <motion.div 
            className="absolute inset-0 bg-[#1A1614]/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            data-testid="checkout-modal"
          >
            {!orderComplete && (
              <div className="p-6 border-b border-[#E5E0D8]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#3A2F2A]">
                    {t.checkout}
                  </h2>
                  <button
                    onClick={closeCheckout}
                    disabled={isProcessing}
                    className="p-2 hover:bg-[#F8F5F0] rounded-lg transition-colors disabled:opacity-50"
                    data-testid="checkout-close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={{
                            backgroundColor: index <= currentStep ? '#C8A97E' : '#E5E0D8',
                            scale: index === currentStep ? 1.1 : 1,
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{ color: index <= currentStep ? 'white' : '#3A2F2A' }}
                        >
                          {index < currentStep ? <Check size={14} /> : index + 1}
                        </motion.div>
                        <span className="text-xs mt-1 text-[#3A2F2A]/60">
                          {t[`step${index + 1}`]}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <motion.div
                          animate={{
                            backgroundColor: index < currentStep ? '#C8A97E' : '#E5E0D8',
                          }}
                          className="flex-1 h-0.5 mx-2"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6">
              <AnimatePresence mode="wait">
                {orderComplete ? renderOrderComplete() : renderStep()}
              </AnimatePresence>
            </div>

            {!orderComplete && (
              <div className="p-6 border-t border-[#E5E0D8] flex gap-3">
                {currentStep > 0 && (
                  <Button
                    onClick={handleBack}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1 border-[#E5E0D8] text-[#3A2F2A]"
                    data-testid="checkout-back-btn"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    {t.back}
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-[#C8A97E] hover:bg-[#B8996E] text-white"
                    data-testid="checkout-next-btn"
                  >
                    {t.next}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 bg-[#3A2F2A] hover:bg-[#2A1F1A] text-white"
                    data-testid="checkout-place-order-btn"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        {t.processing}
                      </>
                    ) : (
                      t.placeOrder
                    )}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
