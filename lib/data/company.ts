export const companyAddress = {
  street: "Turšičeva ulica 7",
  postalCode: "1380",
  city: "Cerknica",
  country: "Slovenija",
  countryCode: "SI",
} as const;

export const companyLocationQuery = `${companyAddress.street}, ${companyAddress.postalCode} ${companyAddress.city}, ${companyAddress.country}`;

export const companyLocationLines = [
  companyAddress.street,
  `${companyAddress.postalCode} ${companyAddress.city}`,
  companyAddress.country,
] as const;

export const company = {
  name: "JU-TAN",
  badge: "🚀 JU-TAN v2 • umetna inteligenca • avtomatizacija",
  headline: "Umetna inteligenca za sodobna podjetja",
  description:
    "Razvijamo rešitve umetne inteligence, avtomatizacije, poslovne programske opreme, spletnih strani in sodobne IT infrastrukture, ki podjetjem prihranijo čas in dvignejo produktivnost.",
  contact: {
    phone: "+386 69 907 803",
    phoneTel: "tel:+38669907803",
    phoneSecondary: "+386 69 983 936",
    phoneSecondaryTel: "tel:+38669983936",
    email: "info@ju-tan.com",
    location: companyLocationQuery,
    hours: "Pon–Pet, 8.00–16.00",
  },
};
