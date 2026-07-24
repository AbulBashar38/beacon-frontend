import axios from "axios";

const MAPBOX_GEOCODING_URL = "https://api.mapbox.com/search/geocode/v6";
const BANGLADESH_BBOX = "88.0,20.5,92.7,26.7";

type MapboxFeature = {
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    mapbox_id?: string;
    feature_type?: string;
    name?: string;
    full_address?: string;
    place_formatted?: string;
    coordinates?: {
      longitude: number;
      latitude: number;
    };
    context?: {
      district?: { name?: string };
      region?: { name?: string };
      place?: { name?: string };
      postcode?: { name?: string };
    };
  };
};

type MapboxResponse = {
  type: "FeatureCollection";
  features: MapboxFeature[];
};

export type AddressResult = {
  id: string;
  name: string;
  fullAddress: string;
  longitude: number;
  latitude: number;
  district?: string;
  region?: string;
  postcode?: string;
};

function accessToken() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) throw new Error("Mapbox access token is not configured.");
  return token;
}

function toAddressResult(feature: MapboxFeature): AddressResult {
  const coordinates = feature.properties.coordinates;
  const [fallbackLongitude, fallbackLatitude] = feature.geometry.coordinates;
  return {
    id: feature.properties.mapbox_id ?? feature.id,
    name: feature.properties.name ?? feature.properties.full_address ?? "Selected address",
    fullAddress:
      feature.properties.full_address ??
      [feature.properties.name, feature.properties.place_formatted].filter(Boolean).join(", "),
    longitude: coordinates?.longitude ?? fallbackLongitude,
    latitude: coordinates?.latitude ?? fallbackLatitude,
    district: feature.properties.context?.district?.name ?? feature.properties.context?.place?.name,
    region: feature.properties.context?.region?.name,
    postcode: feature.properties.context?.postcode?.name,
  };
}

export async function searchBangladeshAddresses(query: string, signal?: AbortSignal) {
  const response = await axios.get<MapboxResponse>(`${MAPBOX_GEOCODING_URL}/forward`, {
    signal,
    params: {
      q: query,
      access_token: accessToken(),
      country: "bd",
      bbox: BANGLADESH_BBOX,
      types: "address,street,neighborhood,locality,place,district,postcode",
      language: "en",
      autocomplete: true,
      limit: 6,
      proximity: "90.4125,23.8103",
    },
  });
  return response.data.features.map(toAddressResult);
}

export async function reverseGeocodeBangladesh(latitude: number, longitude: number) {
  const response = await axios.get<MapboxResponse>(`${MAPBOX_GEOCODING_URL}/reverse`, {
    params: {
      latitude,
      longitude,
      access_token: accessToken(),
      country: "bd",
      language: "en",
    },
  });
  const feature = response.data.features[0];
  if (!feature) throw new Error("No structured address was found for this location.");
  return toAddressResult(feature);
}
