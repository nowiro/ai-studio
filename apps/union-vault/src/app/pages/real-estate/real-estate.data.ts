export type RealEstatePropertyType = 'apartment' | 'house' | 'land' | 'commercial';

export type RealEstateAvailability = 'move-in-ready' | 'new-build' | 'investment';

export type RealEstatePriceBand = 'all' | 'under-250k' | '250k-500k' | '500k-750k' | '750k-plus';

export type RealEstateBedroomsFilter = 'any' | '1' | '2' | '3' | '4';

export interface RealEstateListing {
  id: string;
  title: string;
  city: string;
  district: string;
  countryCode: string;
  propertyType: RealEstatePropertyType;
  priceEur: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  latitude: number;
  longitude: number;
  availability: RealEstateAvailability;
  energyLabel: 'A' | 'A+' | 'B' | 'C';
  highlight: string;
  isFeatured: boolean;
  imageUrl: string;
  sourceUrl: string;
}

export interface RealEstateFilterOption<T extends string> {
  value: T;
  label: string;
}

export const PROPERTY_TYPE_LABELS: Record<RealEstatePropertyType, string> = {
  apartment: 'Mieszkanie',
  house: 'Dom',
  land: 'Działka',
  commercial: 'Komercyjna',
};

export const AVAILABILITY_LABELS: Record<RealEstateAvailability, string> = {
  'move-in-ready': 'Gotowe do zamieszkania',
  'new-build': 'Nowa inwestycja',
  investment: 'Potencjał inwestycyjny',
};

export const PROPERTY_TYPE_OPTIONS: readonly RealEstateFilterOption<'all' | RealEstatePropertyType>[] = [
  { value: 'all', label: 'Wszystkie typy' },
  { value: 'apartment', label: PROPERTY_TYPE_LABELS.apartment },
  { value: 'house', label: PROPERTY_TYPE_LABELS.house },
  { value: 'land', label: PROPERTY_TYPE_LABELS.land },
  { value: 'commercial', label: PROPERTY_TYPE_LABELS.commercial },
];

export const PRICE_BAND_OPTIONS: readonly RealEstateFilterOption<RealEstatePriceBand>[] = [
  { value: 'all', label: 'Dowolny budżet' },
  { value: 'under-250k', label: 'Do 250 tys. EUR' },
  { value: '250k-500k', label: '250–500 tys. EUR' },
  { value: '500k-750k', label: '500–750 tys. EUR' },
  { value: '750k-plus', label: 'Powyżej 750 tys. EUR' },
];

export const BEDROOM_OPTIONS: readonly RealEstateFilterOption<RealEstateBedroomsFilter>[] = [
  { value: 'any', label: 'Dowolna liczba sypialni' },
  { value: '1', label: 'Min. 1 sypialnia' },
  { value: '2', label: 'Min. 2 sypialnie' },
  { value: '3', label: 'Min. 3 sypialnie' },
  { value: '4', label: 'Min. 4 sypialnie' },
];

export const REAL_ESTATE_LISTINGS: readonly RealEstateListing[] = [
  {
    id: 'pl-warsaw-riverside',
    title: 'Apartament Riverside Mokotów',
    city: 'Warszawa',
    district: 'Mokotów',
    countryCode: 'PL',
    propertyType: 'apartment',
    priceEur: 325000,
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 68,
    latitude: 52.1881,
    longitude: 21.0442,
    availability: 'move-in-ready',
    energyLabel: 'A',
    highlight: 'Bliskość linii tramwajowej i terenów zielonych nad Wisłą.',
    isFeatured: true,
    imageUrl: 'https://picsum.photos/seed/pl-warsaw-riverside/800/500',
    sourceUrl: 'https://www.otodom.pl/',
  },
  {
    id: 'pl-gdansk-family-home',
    title: 'Dom rodzinny Gdańsk Jasień',
    city: 'Gdańsk',
    district: 'Jasień',
    countryCode: 'PL',
    propertyType: 'house',
    priceEur: 540000,
    bedrooms: 4,
    bathrooms: 2,
    areaSqm: 146,
    latitude: 54.3332,
    longitude: 18.5583,
    availability: 'new-build',
    energyLabel: 'A+',
    highlight: 'Ogród 280 m² i szybki dojazd do obwodnicy Trójmiasta.',
    isFeatured: false,
    imageUrl: 'https://picsum.photos/seed/pl-gdansk-family-home/800/500',
    sourceUrl: 'https://www.otodom.pl/',
  },
  {
    id: 'de-berlin-loft',
    title: 'Loft Mediaspree Berlin',
    city: 'Berlin',
    district: 'Friedrichshain',
    countryCode: 'DE',
    propertyType: 'apartment',
    priceEur: 710000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 89,
    latitude: 52.5075,
    longitude: 13.4501,
    availability: 'investment',
    energyLabel: 'B',
    highlight: 'Wysoki popyt najmu korporacyjnego w strefie biurowej Mediaspree.',
    isFeatured: true,
    imageUrl: 'https://picsum.photos/seed/de-berlin-loft/800/500',
    sourceUrl: 'https://www.immobilienscout24.de/',
  },
  {
    id: 'es-valencia-seaview',
    title: 'Penthouse Valencia Cabanyal',
    city: 'Walencja',
    district: 'El Cabanyal',
    countryCode: 'ES',
    propertyType: 'apartment',
    priceEur: 480000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 101,
    latitude: 39.4692,
    longitude: -0.3246,
    availability: 'move-in-ready',
    energyLabel: 'A',
    highlight: 'Taras 34 m² i odległość spacerowa do plaży Malvarrosa.',
    isFeatured: false,
    imageUrl: 'https://picsum.photos/seed/es-valencia-seaview/800/500',
    sourceUrl: 'https://www.idealista.com/',
  },
  {
    id: 'pt-lisbon-innovation',
    title: 'Biuro Lizbona Parque das Nações',
    city: 'Lizbona',
    district: 'Parque das Nações',
    countryCode: 'PT',
    propertyType: 'commercial',
    priceEur: 845000,
    bedrooms: 0,
    bathrooms: 2,
    areaSqm: 178,
    latitude: 38.7679,
    longitude: -9.0943,
    availability: 'investment',
    energyLabel: 'A',
    highlight: 'Gotowa przestrzeń pod coworking w dzielnicy technologicznej.',
    isFeatured: true,
    imageUrl: 'https://picsum.photos/seed/pt-lisbon-innovation/800/500',
    sourceUrl: 'https://www.imovirtual.com/',
  },
  {
    id: 'fr-lille-buildable-plot',
    title: 'Działka budowlana Lille Métropole',
    city: 'Lille',
    district: 'Villeneuve-d\u2019Ascq',
    countryCode: 'FR',
    propertyType: 'land',
    priceEur: 215000,
    bedrooms: 0,
    bathrooms: 0,
    areaSqm: 920,
    latitude: 50.6269,
    longitude: 3.1218,
    availability: 'investment',
    energyLabel: 'C',
    highlight: 'MPZP dopuszcza zabudowę bliźniaczą i usługi lokalne.',
    isFeatured: false,
    imageUrl: 'https://picsum.photos/seed/fr-lille-buildable-plot/800/500',
    sourceUrl: 'https://www.seloger.com/',
  },
  {
    id: 'nl-utrecht-townhouse',
    title: 'Townhouse Utrecht Leidsche Rijn',
    city: 'Utrecht',
    district: 'Leidsche Rijn',
    countryCode: 'NL',
    propertyType: 'house',
    priceEur: 690000,
    bedrooms: 4,
    bathrooms: 2,
    areaSqm: 134,
    latitude: 52.0882,
    longitude: 5.0334,
    availability: 'new-build',
    energyLabel: 'A+',
    highlight: 'Pompa ciepła, retencja wody deszczowej i szkoła w promieniu 600 m.',
    isFeatured: false,
    imageUrl: 'https://picsum.photos/seed/nl-utrecht-townhouse/800/500',
    sourceUrl: 'https://www.funda.nl/',
  },
  {
    id: 'ro-brasov-mountain-home',
    title: 'Dom z widokiem Brașov Noua',
    city: 'Braszów',
    district: 'Noua',
    countryCode: 'RO',
    propertyType: 'house',
    priceEur: 295000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 128,
    latitude: 45.6368,
    longitude: 25.6226,
    availability: 'move-in-ready',
    energyLabel: 'B',
    highlight: 'Widok na Karpaty i gotowy układ pod wynajem krótkoterminowy.',
    isFeatured: false,
    imageUrl: 'https://picsum.photos/seed/ro-brasov-mountain-home/800/500',
    sourceUrl: 'https://www.imobiliare.ro/',
  },
];
