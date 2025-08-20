import { Point } from "geojson";
import { EcoPinSeverity } from "./eco";

export type MapLocation = {
    lat: number;
    lng: number;
};

export type MapLocationSearchResponseAddress = {
    city?: string;
    state_district?: string;
    state?: string;
    "ISO3166-2-lvl4"?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    // Add other possible address fields as needed
};

export type MapLocationSearchResponseExtratags = {
    capital?: string;
    website?: string;
    wikidata?: string;
    wikipedia?: string;
    population?: string;
    // Add other possible extratags as needed
};

export type MapLocationSearchResponse = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: string;
    boundingbox: [string, string, string, string]; // [minlat, maxlat, minlon, maxlon]
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address: MapLocationSearchResponseAddress;
    extratags?: MapLocationSearchResponseExtratags;
};

export type MapEcoPin = {
    id: string;
    location: Point;
    createdAt: string;
    updatedAt: string;
    severity: EcoPinSeverity;
};
