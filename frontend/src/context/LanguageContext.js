import React, { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

const translations = {
  hu: {
    // Navigation
    nav: {
      home: 'Főoldal',
      menu: 'Menü',
      coffee: 'Kávé',
      beans: 'Kávébab',
      about: 'Rólunk',
      contact: 'Kapcsolat',
    },
    // Hero
    hero: {
      subtitle: 'Prémium kávék különleges ízvilággal',
      cta: 'Felfedezés',
      welcome: 'Várunk a Café Nani-ban',
    },
    // Experience Section
    experience: {
      title: 'Élmény',
      specialty: {
        title: 'Specialty Kávé',
        desc: 'V60-nal készített prémium filter kávék',
      },
      fresh: {
        title: 'Friss Konyha',
        desc: 'Szendvicsek és könnyű ételek',
      },
      modern: {
        title: 'Modern Kávézó',
        desc: 'Nyugodt, elegáns atmoszféra',
      },
    },
    // Reviews
    reviews: {
      title: 'Vélemények',
      rating: 'értékelés',
      basedOn: 'alapján',
    },
    // Coffee Beans Shop
    beans: {
      title: 'Kávébab Kollekció',
      subtitle: 'Válogasd össze a saját kávéélményedet prémium szemeskávéinkból',
      origin: 'Eredet',
      roast: 'Pörkölés',
      notes: 'Ízjegyek',
      weight: 'Súly',
      price: 'Ár',
      addToCart: 'Kosárba',
      outOfStock: 'Elfogyott',
      viewDetails: 'Részletek',
    },
    // Menu
    menu: {
      title: 'Menünk',
      subtitle: 'Fedezd fel különleges kávéinkat és friss ételeinket',
      categories: {
        all: 'Összes',
        coffee: 'Kávék',
        food: 'Ételek',
        drinks: 'Italok',
      },
    },
    // About
    about: {
      title: 'Rólunk',
      subtitle: 'A Café Nani története',
      story: 'A Café Nani Budapest szívében, a XIII. kerületben található prémium specialty kávézó. Célunk, hogy a legmagasabb minőségű kávéélményt nyújtsuk vendégeinknek, barátságos és nyugodt környezetben.',
      values: {
        quality: {
          title: 'Minőség',
          desc: 'Csak a legjobb minőségű, gondosan válogatott kávészemeket használjuk.',
        },
        passion: {
          title: 'Szenvedély',
          desc: 'Minden csésze kávé mögött a kávé iránti szeretetünk és szakértelmünk áll.',
        },
        community: {
          title: 'Közösség',
          desc: 'Egy hely, ahol mindenki otthon érezheti magát.',
        },
      },
    },
    // Contact
    contact: {
      title: 'Kapcsolat',
      subtitle: 'Kérdésed van? Írj nekünk!',
      form: {
        name: 'Név',
        email: 'Email',
        subject: 'Tárgy',
        message: 'Üzenet',
        send: 'Küldés',
        sending: 'Küldés...',
        success: 'Üzenet elküldve!',
        error: 'Hiba történt, próbáld újra.',
      },
      info: {
        address: 'Cím',
        phone: 'Telefon',
        hours: 'Nyitvatartás',
        hoursValue: 'H-P: 8:00 - 18:00\nSzo: 9:00 - 16:00\nV: Zárva',
      },
    },
    // Footer
    footer: {
      rights: 'Minden jog fenntartva.',
      followUs: 'Kövess minket',
    },
    // Common
    common: {
      loading: 'Betöltés...',
      error: 'Hiba történt',
      backHome: 'Vissza a főoldalra',
      learnMore: 'Tudj meg többet',
      seeAll: 'Összes megtekintése',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      menu: 'Menu',
      coffee: 'Coffee',
      beans: 'Beans',
      about: 'About',
      contact: 'Contact',
    },
    // Hero
    hero: {
      subtitle: 'Premium coffees with exceptional flavors',
      cta: 'Discover',
      welcome: 'Welcome to Café Nani',
    },
    // Experience Section
    experience: {
      title: 'Experience',
      specialty: {
        title: 'Specialty Coffee',
        desc: 'Premium filter coffees brewed with V60',
      },
      fresh: {
        title: 'Fresh Kitchen',
        desc: 'Sandwiches and light meals',
      },
      modern: {
        title: 'Modern Café',
        desc: 'Calm, elegant atmosphere',
      },
    },
    // Reviews
    reviews: {
      title: 'Reviews',
      rating: 'rating',
      basedOn: 'based on',
    },
    // Coffee Beans Shop
    beans: {
      title: 'Coffee Bean Collection',
      subtitle: 'Curate your own coffee experience from our premium whole beans',
      origin: 'Origin',
      roast: 'Roast',
      notes: 'Flavor Notes',
      weight: 'Weight',
      price: 'Price',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      viewDetails: 'View Details',
    },
    // Menu
    menu: {
      title: 'Our Menu',
      subtitle: 'Discover our specialty coffees and fresh food',
      categories: {
        all: 'All',
        coffee: 'Coffee',
        food: 'Food',
        drinks: 'Drinks',
      },
    },
    // About
    about: {
      title: 'About Us',
      subtitle: 'The Story of Café Nani',
      story: 'Café Nani is a premium specialty coffee shop located in the heart of Budapest, in the 13th district. Our goal is to provide the highest quality coffee experience to our guests in a friendly and peaceful environment.',
      values: {
        quality: {
          title: 'Quality',
          desc: 'We only use the finest, carefully selected coffee beans.',
        },
        passion: {
          title: 'Passion',
          desc: 'Behind every cup is our love and expertise for coffee.',
        },
        community: {
          title: 'Community',
          desc: 'A place where everyone can feel at home.',
        },
      },
    },
    // Contact
    contact: {
      title: 'Contact',
      subtitle: 'Have a question? Write to us!',
      form: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        sending: 'Sending...',
        success: 'Message sent!',
        error: 'An error occurred, please try again.',
      },
      info: {
        address: 'Address',
        phone: 'Phone',
        hours: 'Opening Hours',
        hoursValue: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed',
      },
    },
    // Footer
    footer: {
      rights: 'All rights reserved.',
      followUs: 'Follow us',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      backHome: 'Back to home',
      learnMore: 'Learn more',
      seeAll: 'See all',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hu');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'hu' ? 'en' : 'hu'));
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let value = translations[language];
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
