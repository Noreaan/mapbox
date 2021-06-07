export interface OccupiedBikeSpaces {
    nhits: number;
    parameters: Parameters;
    records: Record[];
    facet_groups: FacetGroup[];
}

export interface FacetGroup {
    facets: Facet[];
    name: string;
}

export interface Facet {
    count: number;
    path: string;
    state: string;
    name: string;
}

export interface Parameters {
    dataset: string;
    timezone: string;
    rows: number;
    start: number;
    format: string;
    facet: string[];
}

export interface Record {
    datasetid: string;
    recordid: string;
    fields: Fields;
    geometry: Geometry;
    record_timestamp: Date;
}

export interface Fields {
    occupiedplaces: number;
    id: string;
    facilityname: string;
    time: Date;
    freeplaces: number;
    locatie: number[];
    totalplaces: number;
}

export interface Geometry {
    type: string;
    coordinates: number[];
}
