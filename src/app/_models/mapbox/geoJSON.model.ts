export interface MapBoxGeoJSON {
    type: string;
    features: GeoJSON[];
}

export interface GeoJSON {
    type: string;
    geometry: Geometry;
    properties: Properties;
}

export interface Geometry {
    type: string;
    coordinates: number[];
}

export interface Properties {
    description: string;
}
