import { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customerUser, setCustomerUser] = useState(null);
  const [customerToken, setCustomerToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage if available
    const savedToken = localStorage.getItem('akeezo_customer_token');
    const savedUser = localStorage.getItem('akeezo_customer_user');

    if (savedToken && savedUser) {
      try {
        setCustomerToken(savedToken);
        setCustomerUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse customer session from localStorage:', e);
        localStorage.removeItem('akeezo_customer_token');
        localStorage.removeItem('akeezo_customer_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithEmail = async (email, password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 7),
      name: email.split('@')[0].replace('.', ' '),
      email: email,
      phone: '',
      nationality: 'International Patient',
      preferredLanguage: 'English',
      emergencyContact: '',
      journey: {
        id: 'JNY-2026-' + Math.floor(1000 + Math.random() * 9000),
        treatment: 'Consultation & Medical Evaluation',
        hospital: 'Selected AKEEZO Partner Hospital',
        doctor: 'Senior Medical Specialist Lead',
        statusStep: 2,
        statusLabel: 'Medical Opinion & Consultation Active',
        estimatedCost: 'Quote Pending Review',
        depositPaid: 'None',
        currency: 'USD',
        coordinator: {
          name: 'AKEEZO Care Lead',
          role: 'International Patient Coordinator',
          phone: '+91 11 4084 5678',
          whatsapp: '911140845678',
          email: 'care@akeezo.com',
        },
        travel: {
          visaStatus: 'Pending Documentation',
          flightStatus: 'Not Scheduled',
          hotelBooking: 'Arrangement Options Available',
          airportPickup: 'Complimentary Transfer Included',
        },
        documents: [],
      },
    };

    const token = 'tok_cust_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('akeezo_customer_token', token);
    localStorage.setItem('akeezo_customer_user', JSON.stringify(user));

    setCustomerToken(token);
    setCustomerUser(user);
    setIsLoading(false);
    return user;
  };

  const loginWithOtp = async (phone, otp) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 7),
      name: 'Patient ' + phone.slice(-4),
      email: '',
      phone: phone,
      nationality: 'International Patient',
      preferredLanguage: 'English',
      emergencyContact: '',
      journey: {
        id: 'JNY-2026-' + Math.floor(1000 + Math.random() * 9000),
        treatment: 'Consultation & Medical Evaluation',
        hospital: 'Selected AKEEZO Partner Hospital',
        doctor: 'Senior Medical Specialist Lead',
        statusStep: 1,
        statusLabel: 'Inquiry Received - Reviewing Records',
        estimatedCost: 'Quote Pending Review',
        depositPaid: 'None',
        currency: 'USD',
        coordinator: {
          name: 'AKEEZO Care Lead',
          role: 'International Patient Coordinator',
          phone: '+91 11 4084 5678',
          whatsapp: '911140845678',
          email: 'care@akeezo.com',
        },
        travel: {
          visaStatus: 'Pending Documentation',
          flightStatus: 'Not Scheduled',
          hotelBooking: 'Arrangement Options Available',
          airportPickup: 'Complimentary Transfer Included',
        },
        documents: [],
      },
    };

    const token = 'tok_cust_otp_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('akeezo_customer_token', token);
    localStorage.setItem('akeezo_customer_user', JSON.stringify(user));

    setCustomerToken(token);
    setCustomerUser(user);
    setIsLoading(false);
    return user;
  };

  const register = async (name, email, phone, country, treatment) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 7),
      name: name,
      email: email,
      phone: phone,
      nationality: country || 'International',
      preferredLanguage: 'English',
      emergencyContact: '',
      journey: {
        id: 'JNY-2026-' + Math.floor(1000 + Math.random() * 9000),
        treatment: treatment || 'Medical Evaluation',
        hospital: 'AKEEZO Partner Hospital Network',
        doctor: 'Specialist Advisory Team',
        statusStep: 1,
        statusLabel: 'Account Registered - Reviewing Medical Records',
        estimatedCost: 'Pending Evaluation',
        depositPaid: 'None',
        currency: 'USD',
        coordinator: {
          name: 'AKEEZO Care Lead',
          role: 'International Patient Coordinator',
          phone: '+91 11 4084 5678',
          whatsapp: '911140845678',
          email: 'care@akeezo.com',
        },
        travel: {
          visaStatus: 'Visa Assistance Available',
          flightStatus: 'Not Booked',
          hotelBooking: 'Partner Hotel Discounts Available',
          airportPickup: 'Complimentary Pickup Scheduled',
        },
        documents: [],
      },
    };

    const token = 'tok_cust_reg_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('akeezo_customer_token', token);
    localStorage.setItem('akeezo_customer_user', JSON.stringify(newUser));

    setCustomerToken(token);
    setCustomerUser(newUser);
    setIsLoading(false);
    return newUser;
  };

  const updateProfile = (updatedData) => {
    if (!customerUser) return;
    const updated = { ...customerUser, ...updatedData };
    localStorage.setItem('akeezo_customer_user', JSON.stringify(updated));
    setCustomerUser(updated);
  };

  const addDocument = (doc) => {
    if (!customerUser) return;
    const updatedDocs = [doc, ...(customerUser.journey?.documents || [])];
    const updated = {
      ...customerUser,
      journey: {
        ...customerUser.journey,
        documents: updatedDocs,
      },
    };
    localStorage.setItem('akeezo_customer_user', JSON.stringify(updated));
    setCustomerUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('akeezo_customer_token');
    localStorage.removeItem('akeezo_customer_user');
    setCustomerToken(null);
    setCustomerUser(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customerUser,
        customerToken,
        isAuthenticated: !!customerToken,
        isLoading,
        loginWithEmail,
        loginWithOtp,
        register,
        updateProfile,
        addDocument,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
