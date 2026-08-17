
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BookingSuccessView } from "@/components/onboarding-v2/BookingSuccessView";

type CalendlySuccessContentProps = {
  isReview?: boolean;
};

const CalendlySuccessContent = ({ isReview = false }: CalendlySuccessContentProps) => {
  const [, setCalendlyData] = useState({
    fullName: '',
    email: '',
    restaurantName: '',
  });
  
  const location = useLocation();
  
  useEffect(() => {
    // Parse URL parameters from Calendly redirect
    const searchParams = new URLSearchParams(location.search);
    
    const fullName = searchParams.get('invitee_full_name') || '';
    const email = searchParams.get('invitee_email') || '';
    const restaurantName = searchParams.get('answer_1') || '';
    
    setCalendlyData({
      fullName,
      email,
      restaurantName,
    });
    
    console.log("Calendly parameters:", { fullName, email, restaurantName });
  }, [location]);

  return <BookingSuccessView isReview={isReview} />;
};

export default CalendlySuccessContent;
