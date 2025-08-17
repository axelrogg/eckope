import { NominatimResult } from "@/types/nominatim";

export async function fetchAddressFromCoordinates(lat: number, lng: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json<NominatimResult>();
    return result;
}
