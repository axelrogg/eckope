"use client";

import * as React from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMap as useLeafletMap,
    useMapEvents,
    Marker,
} from "react-leaflet";
import { FeatureCollection } from "geojson";
import { toast } from "sonner";

import { clickedPinIcon } from "@/components/map/map-icons";
import { getContainingFeature } from "@/lib/geo/spatial";
import { useMap } from "@/hooks";
import { EcoPin } from "@/types/eco";

//const pinIcon = L.divIcon({
//    className: "",
//    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dot"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>`,
//    iconSize: [32, 32],
//    iconAnchor: [16, 32],
//});
//

type ClickedPin = {
    latlng: L.LatLng;
    insideGeoFence: boolean;
};

export const MapCore = () => {
    const {
        location,
        showEcoPinPanel,
        setShowEcoPinPanel,
        setSelectedEcoPin,
        setNewEcoPinLocation,
        showNewEcoPinPrompt,
        setShowNewEcoPinPrompt,
    } = useMap();

    const [limaCallaoGeoFence, setLimaCallaoGeoFence] =
        React.useState<FeatureCollection | null>(null);
    const [clickedPin, setClickedPin] = React.useState<ClickedPin | null>(null);

    const mapRef = React.useRef<L.Map | null>(null);
    const clickedPinTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        const fetchGeoFence = async () => {
            try {
                const [limaRes, callaoRes] = await Promise.all([
                    fetch("/api/geo/provinces?code=1501&name=Lima&format=geojson"),
                    fetch("/api/geo/provinces?code=0701&name=Callao&format=geojson"),
                ]);

                if (!limaRes.ok || !callaoRes.ok) {
                    console.error("Failed to fetch Lima or Callao geodata.");
                    return;
                }

                const lima = (await limaRes.json()) as FeatureCollection;
                const callao = (await callaoRes.json()) as FeatureCollection;

                setLimaCallaoGeoFence({
                    type: "FeatureCollection",
                    features: [...lima.features, ...callao.features],
                });
            } catch (error) {
                console.error("GeoFence fetch error:", error);
            }
        };

        fetchGeoFence();
    }, []);

    React.useEffect(() => {
        if (!showNewEcoPinPrompt) {
            setNewEcoPinLocation(null);
            setClickedPin(null);
        }
    }, [showNewEcoPinPrompt]);

    //function flyToOffset(
    //    map: L.Map,
    //    latlng: L.LatLngExpression,
    //    finalZoom = 17,
    //    offsetX = 300
    //) {
    //    const currentZoom = map.getZoom();
    //    const currentCenter = map.getCenter();
    //    const projectedCenter = map.project(currentCenter, currentZoom);
    //    const shiftedPoint = projectedCenter.add([offsetX, 0]);
    //    const shiftedLatLng = map.unproject(shiftedPoint, currentZoom);

    //    // Step 1: pan slightly to the right to make space for the panel
    //    map.flyTo(shiftedLatLng, currentZoom);

    //    // Step 2: after a delay, zoom in while keeping marker offset
    //    setTimeout(() => {
    //        const targetPoint = map.project(latlng, finalZoom);
    //        const offsetPoint = targetPoint.add([offsetX, 0]);
    //        const finalCenter = map.unproject(offsetPoint, finalZoom);

    //        map.flyTo(finalCenter, finalZoom);
    //    }, 800); // should match or slightly exceed duration of first flyTo
    //}

    function MapRefHandler() {
        const map = useLeafletMap();
        React.useEffect(() => {
            mapRef.current = map;
        }, [map]);
        return null;
    }

    function MapSearchHandler() {
        const map = useLeafletMap();
        React.useEffect(() => {
            if (location) {
                map.flyTo([location.lat, location.lng], 17);
            }
        }, [location, map]);
        return null;
    }

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                if (!limaCallaoGeoFence) return;
                if (getContainingFeature(e.latlng, limaCallaoGeoFence)) {
                    setClickedPin({
                        latlng: e.latlng,
                        insideGeoFence: true,
                    });
                    setNewEcoPinLocation({
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                    });
                    setShowNewEcoPinPrompt(true);
                } else {
                    // If the user clicks outside geofence show it for feedback
                    // but take it away quickly and show an error toast
                    setClickedPin({
                        latlng: e.latlng,
                        insideGeoFence: false,
                    });

                    if (clickedPinTimeoutRef.current)
                        clearTimeout(clickedPinTimeoutRef.current);

                    toast.warning("Uy, muy lejos", {
                        description:
                            "Por ahora no puedes crear pins fuera de Lima y Callao.",
                    });

                    clickedPinTimeoutRef.current = setTimeout(() => {
                        setClickedPin(null);
                    }, 2000);
                }
            },
        });
        return null;
    }

    return (
        <React.Fragment>
            <MapContainer
                center={[-12, -77.1]}
                zoom={10}
                className="absolute top-0 left-0 z-0 h-full w-full"
                zoomControl={false}
                preferCanvas
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <MapRefHandler />

                {clickedPin && (
                    <Marker
                        position={clickedPin.latlng}
                        icon={clickedPinIcon}
                        eventHandlers={{
                            click: () => {
                                setSelectedEcoPin(exampleEcoPin);
                                setShowEcoPinPanel(!showEcoPinPanel);
                            },
                        }}
                    />
                )}

                <MapSearchHandler />
                <MapClickHandler />
                {limaCallaoGeoFence && <GeoJSON data={limaCallaoGeoFence} />}
            </MapContainer>
        </React.Fragment>
    );
};

const exampleEcoPin: EcoPin = {
    id: "ep_001",
    title: "The Future of Renewable Energy This is a great and long title",
    author: {
        username: "green_innovator",
        fullName: "Alexandra Greenfield",
        avatarUrl: "https://example.com/avatars/green_innovator.jpg",
    },
    content: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in consequat lectus, id facilisis nisl. Maecenas pellentesque metus non neque molestie, ac interdum elit cursus. Duis tincidunt tortor vel nunc placerat, in bibendum nibh venenatis. Phasellus nisi neque, cursus et justo eu, euismod luctus dolor. Nulla at lorem metus. Integer sit amet risus magna. Integer sed hendrerit enim. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean dapibus, ex vitae vulputate molestie, nulla justo congue metus, sed mollis ex lacus scelerisque nisl. Cras varius erat ac venenatis consectetur. Suspendisse potenti.

Nulla lobortis enim at faucibus accumsan. Etiam eu consequat nibh. Aenean pellentesque lorem quis augue dapibus, in dignissim nibh posuere. Ut tellus libero, tempor eget blandit id, lobortis posuere dolor. Curabitur venenatis scelerisque dapibus. Mauris at metus efficitur, ultrices enim id, mollis odio. Praesent sit amet erat ut diam euismod suscipit.\n

Nulla semper lectus eu elit iaculis, in euismod libero auctor. Phasellus vel leo interdum, maximus dolor in, pulvinar est. Aliquam sed tellus sit amet ipsum elementum condimentum. Ut eu dolor sit amet felis porta facilisis. Ut lacinia laoreet orci at mollis. Cras libero massa, eleifend et augue quis, dignissim vestibulum urna. Quisque non nisl quis eros ornare vulputate. Nam id convallis eros, vel feugiat ex. Suspendisse convallis sed justo eu tincidunt. Vivamus felis ipsum, malesuada ut molestie vehicula, aliquet ut lacus. Vivamus eget odio a sem faucibus malesuada sit amet eu risus. Aenean a urna at magna finibus vehicula. Donec neque lorem, laoreet in luctus ut, ultricies vel ante. Ut interdum sem quis nibh dignissim pulvinar. Maecenas tempus aliquam nisl, sed tempus justo auctor eget.

Vestibulum et imperdiet sem. Suspendisse potenti. Donec posuere elit a tortor euismod porta. Donec nec leo vitae tellus fermentum volutpat. Curabitur viverra viverra pharetra. Mauris pharetra dolor eu accumsan dignissim. Morbi ex nisi, ultrices quis semper vitae, vehicula id risus.

Praesent at posuere arcu. Fusce et tincidunt libero, quis lacinia tortor. Maecenas vestibulum nunc sapien, non bibendum leo vehicula eu. Aliquam erat volutpat. Donec at pulvinar lectus. Aliquam molestie, nisl sit amet sagittis semper, urna nulla bibendum nisi, non pulvinar ligula nisl nec lectus. Curabitur nec tellus odio. Cras aliquet bibendum augue, at placerat erat scelerisque eget. Proin ut erat id nisi condimentum scelerisque. Quisque non feugiat nisl, in egestas odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras egestas elit et orci lobortis accumsan. Maecenas nunc odio, semper eget consectetur eget, rutrum ut nisl. Quisque cursus suscipit volutpat. Mauris sit amet sapien auctor, eleifend mi nec, tristique tortor. Donec aliquet metus vel quam tincidunt, vitae rhoncus odio mattis.

Sed sed porttitor nulla. Nunc quis elementum metus. Sed pellentesque, justo eu facilisis feugiat, velit lectus tincidunt eros, sit amet consequat lorem ex in magna. Suspendisse porttitor felis urna, ac condimentum lectus posuere malesuada. Praesent vulputate augue risus, a rutrum sapien vehicula at. Phasellus mollis at turpis ac imperdiet. Aliquam semper velit in dolor mattis, eget sodales elit scelerisque. Nam sapien eros, ullamcorper quis ullamcorper in, bibendum sit amet felis. Ut velit turpis, venenatis vel mi in, maximus ultricies nisi. Quisque non magna accumsan, venenatis ex nec, fringilla tellus.

Aenean ac tristique ante, ac tempus turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam ac condimentum erat. Suspendisse potenti. Nullam vel est laoreet, consectetur nisl vel, cursus velit. Aenean at iaculis orci. Nam luctus rhoncus nulla, ac imperdiet est sodales a. Sed pulvinar sapien vitae arcu elementum faucibus. Phasellus ac nisl in urna dapibus cursus. Vivamus vel faucibus ante. Nulla efficitur iaculis placerat. Praesent elementum augue condimentum lectus tempor vehicula. Proin tempor et sapien sit amet viverra. Phasellus tortor turpis, aliquam eget dui vel, rhoncus ultricies ligula. Vivamus rutrum ullamcorper nulla condimentum tincidunt. In vitae scelerisque velit.

Praesent dapibus bibendum ipsum eu vestibulum. Fusce ut euismod leo. Curabitur fringilla elit et feugiat rutrum. Pellentesque cursus imperdiet nibh sit amet tempus. Suspendisse dictum ligula vel ex congue, quis sollicitudin lacus commodo. Integer tempor interdum consequat. Fusce sed venenatis quam, nec feugiat metus. Suspendisse auctor ligula at volutpat tincidunt. In non urna vel lorem laoreet ultricies et vestibulum ante. Ut ac feugiat neque. Duis ex nisi, tempus in augue ut, suscipit elementum turpis. Vivamus diam sem, gravida vitae auctor sed, pharetra eget sapien. In hac habitasse platea dictumst.

Integer sed orci neque. Nullam faucibus ipsum nec nunc bibendum tempus. Fusce malesuada leo id arcu pulvinar, id facilisis mauris ultrices. Cras pretium viverra nulla blandit cursus. Pellentesque suscipit auctor blandit. Aliquam malesuada, elit at interdum scelerisque, est urna tristique nunc, a sodales lacus urna nec odio. Nullam at porttitor massa, et suscipit magna. Mauris blandit bibendum sagittis. Maecenas et purus id lectus sollicitudin accumsan aliquet et nulla. Quisque dolor neque, ornare non ante ut, elementum facilisis sem. Praesent rutrum sem mi, non luctus turpis tincidunt et. Duis sed dui sapien.

Nullam pulvinar feugiat nunc, at rhoncus urna luctus non. Nulla ut varius velit, at efficitur nibh. Duis ultricies mi eget velit interdum ullamcorper. Nullam imperdiet augue nec quam suscipit mattis. Curabitur ac aliquet ante, eu convallis nibh. Donec dignissim enim id eros dignissim, eget efficitur lorem rhoncus. Cras dignissim lorem sapien, at aliquet lorem scelerisque ultricies. Morbi congue, massa sed dapibus finibus, sapien lorem ornare diam, et blandit risus enim eu arcu. Praesent tincidunt tincidunt magna eu mollis. Proin id nulla maximus, maximus lectus et, volutpat mi. Etiam eleifend aliquet rutrum. Proin dapibus sapien sed est aliquam gravida. Vivamus venenatis vehicula scelerisque. Proin ut ipsum id tellus sollicitudin ultricies ut non mauris. Duis tincidunt, orci in gravida blandit, ex ante viverra nisl, commodo ullamcorper mauris nisi ut ligula.

Nullam nibh libero, rhoncus vel interdum at, fermentum sit amet enim. Nulla ut enim vel felis suscipit consectetur bibendum a dui. Curabitur sed finibus leo. Duis aliquam eros quis iaculis porttitor. Vivamus non dignissim lorem. Etiam efficitur arcu lorem. Aliquam nulla urna, porttitor id nunc ac, pretium sodales mauris. Etiam vel blandit sem. Aliquam eget elit eget tortor sagittis pellentesque. Aliquam ipsum metus, aliquam et scelerisque. `,
    upvotes: 1240,
    downvotes: 87,
    edited: true,
    createdAt: new Date("2023-10-15"),
    editedAt: new Date("2023-10-18"),
    ecos: [
        {
            id: "eco_001",
            ecoPinId: "ep_001",
            author: {
                username: "sun_chaser",
                fullName: "Raj Patel",
                avatarUrl: "https://example.com/avatars/sun_chaser.jpg",
            },
            content:
                "Perovskite solar cells just hit 33.7% efficiency in lab tests—double the performance of traditional silicon cells! The stability issues are being solved too. Within 5 years, we might see these on rooftops everywhere. The key advantage is their flexibility - they can be printed on almost any surface, enabling solar windows, car roofs, and even clothing. Recent studies from NREL show... [truncated for brevity]",
            upvotes: 342,
            downvotes: 12,
            edited: false,
            createdAt: new Date("2023-10-16"),
            replies: [
                {
                    id: "reply_001_01",
                    ecoId: "eco_001",
                    author: {
                        username: "tech_skeptic",
                        fullName: "Morgan Yu",
                        avatarUrl: "https://example.com/avatars/tech_skeptic.jpg",
                    },
                    content:
                        "Lab results ≠ real-world performance. Remember when graphene batteries were '5 years away'... 15 years ago? We need to temper expectations with manufacturing realities. The degradation rates in outdoor testing are still problematic, especially in humid climates.",
                    upvotes: 89,
                    downvotes: 4,
                    edited: true,
                    createdAt: new Date("2023-10-16"),
                    editedAt: new Date("2023-10-17"),
                },
                {
                    id: "reply_001_02",
                    ecoId: "eco_001",
                    author: {
                        username: "material_scientist",
                        fullName: "Dr. Lena Kowalski",
                        avatarUrl: "https://example.com/avatars/material_scientist.jpg",
                    },
                    content:
                        "Actually, the new encapsulation techniques using atomic layer deposition have shown remarkable stability—less than 5% degradation after 1,000 hours of continuous illumination at 85°C. Here's the peer-reviewed paper: [link]. The challenge now is scaling the deposition process affordably.",
                    upvotes: 156,
                    downvotes: 2,
                    edited: false,
                    createdAt: new Date("2023-10-17"),
                },
                // 8 more replies...
            ],
        },
        {
            id: "eco_002",
            ecoPinId: "ep_001",
            author: {
                username: "wind_warrior",
                fullName: "Jamie O'Connor",
                avatarUrl: "https://example.com/avatars/wind_warrior.jpg",
            },
            content:
                "Offshore wind is where the real untapped potential lies. The new 15MW turbines from Vestas can power 20,000 homes EACH. Imagine arrays of these across the North Sea! The latest floating turbine designs eliminate the depth limitations of traditional fixed-bottom turbines, opening up vast new areas for development. Maintenance is still a challenge though...",
            upvotes: 278,
            downvotes: 23,
            edited: true,
            createdAt: new Date("2023-10-17"),
            editedAt: new Date("2023-10-19"),
            replies: [
                {
                    id: "reply_002_01",
                    ecoId: "eco_002",
                    author: {
                        username: "navy_vet",
                        fullName: "Carlos Mendez",
                        avatarUrl: "https://example.com/avatars/navy_vet.jpg",
                    },
                    content:
                        "As someone who worked on ships, I can tell you the saltwater corrosion on those turbines will be brutal. We need better materials for marine environments. The maintenance costs are going to be astronomical unless we develop new anti-corrosion coatings.",
                    upvotes: 112,
                    downvotes: 1,
                    edited: false,
                    createdAt: new Date("2023-10-18"),
                },
                // 9 more replies...
            ],
        },
        // 8 more ecos with replies...
    ],
};
