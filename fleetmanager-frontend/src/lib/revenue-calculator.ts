export interface RevenueShare {
  driverShare: number;
  companyShare: number;
  driverPercentage: number;
  companyPercentage: number;
}

export function calculateRevenueSplit(totalAmount: number): RevenueShare {
  const threshold = 2500;
  
  if (totalAmount <= threshold) {
    // Up to ₹2,500: Driver 30%, Company 70%
    const driverShare = totalAmount * 0.3;
    const companyShare = totalAmount * 0.7;
    
    return {
      driverShare,
      companyShare,
      driverPercentage: 30,
      companyPercentage: 70,
    };
  } else {
    // Above ₹2,500: Driver 70%, Company 30%
    const driverShare = totalAmount * 0.7;
    const companyShare = totalAmount * 0.3;
    
    return {
      driverShare,
      companyShare,
      driverPercentage: 70,
      companyPercentage: 30,
    };
  }
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function calculateDriverEarnings(trips: Array<{ totalAmount: string; driverShare?: string }>): number {
  return trips.reduce((total, trip) => {
    const driverShare = trip.driverShare 
      ? parseFloat(trip.driverShare) 
      : calculateRevenueSplit(parseFloat(trip.totalAmount)).driverShare;
    return total + driverShare;
  }, 0);
}

export function calculateCompanyEarnings(trips: Array<{ totalAmount: string; companyShare?: string }>): number {
  return trips.reduce((total, trip) => {
    const companyShare = trip.companyShare 
      ? parseFloat(trip.companyShare) 
      : calculateRevenueSplit(parseFloat(trip.totalAmount)).companyShare;
    return total + companyShare;
  }, 0);
}
