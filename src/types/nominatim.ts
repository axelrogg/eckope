export type NominatimResult = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name?: string;
    display_name: string;
    address: {
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        region?: string;
        state_district?: string;
        state?: string;
        postcode?: string;
        country: string;
        country_code: string;
        [key: string]: string | undefined;
    };
    boundingbox: [string, string, string, string];
};
