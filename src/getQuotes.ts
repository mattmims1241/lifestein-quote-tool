// getQuotes.ts

export async function getQuotes({
  zip,
  dob,        // Format: MM/DD/YYYY
  sex,        // 'M' or 'F'
  smoker,     // 'Y' or 'N'
  heightFt,
  heightIn,
  weight,
  amount,
  termLength,
}) {
  const COMPULIFEAUTHORIZATIONID = '760903F14';
  const REMOTE_IP = '74.113.157.69';

  const heightTotalInches = heightFt * 12 + heightIn;
  const bmi = (weight / (heightTotalInches * heightTotalInches)) * 703;

  // Health rating logic
  let health = 'PP'; // Default to Preferred Plus

  if (smoker === 'Y') {
    health = bmi < 18 || bmi > 32 ? 'R' : 'RP';
  } else {
    if (bmi < 18 || bmi > 32) health = 'R';
    else if (bmi >= 30) health = 'RP';
    else if (bmi >= 28) health = 'P';
    else health = 'PP';
  }

  const payload = {
    REMOTE_IP,
    Zip: zip,
    State: '0', // Using '0' as fallback; replace with actual state code if possible
    DOB: dob, // Must be in MM/DD/YYYY format
    Sex: sex,
    Smoker: smoker,
    Health: health,
    Amount: amount.toString(),
    PremiumMode: '1', // Annual
    Category: '1', // Term Life
    TermLength: termLength.toString(),
    UseHealthAnalyzer: '1',
  };

  const url = `https://compulifeapi.com/api/request/?COMPULIFEAUTHORIZATIONID=${COMPULIFEAUTHORIZATIONID}&REMOTE_IP=${REMOTE_IP}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ COMPULIFE: payload }),
    });

    const data = await res.json();

    // CompuLife sometimes wraps data inside Compulife_ComparisonResults
    const quotes = data?.Compulife_ComparisonResults?.Compulife_Results || data;

    if (Array.isArray(quotes)) {
      return quotes; // Successfully returned quotes
    } else {
      console.error('API responded but not with quote list:', data);
      return null;
    }
  } catch (err) {
    console.error('Quote request failed:', err);
    return null;
  }
}

// Optional helper to generate DOB from age
export function getDOBFromAge(age: number) {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return `01/01/${birthYear}`;
}
