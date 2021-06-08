import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OccupiedBikeSpaces, Record } from '../_models/gent-api/occupied-bike-places.model';
import { MapBoxGeoJSON, GeoJSON, Properties } from '../_models/mapbox/geoJSON.model';

@Injectable({
    providedIn: 'root'
})
export class GentApiService {

    constructor(
        private http: HttpClient
    ) { }

    getOccupiedBikeSpaces(): Observable<MapBoxGeoJSON> | Observable<any> {
        return this.http.get<OccupiedBikeSpaces>('https://data.stad.gent/api/records/1.0/search/?dataset=real-time-bezettingen-fietsenstallingen-gent&q=&facet=facilityname')
            .pipe(
                map((result: OccupiedBikeSpaces) => {
                    let mapBoxGeoJSON = <MapBoxGeoJSON>{
                        type: 'FeatureCollection',
                        features: []
                    };

                    mapBoxGeoJSON.features = <GeoJSON[]>result.records.map((record: Record) => {
                        return <GeoJSON>{
                            type: 'Feature',
                            properties: <Properties>{
                                description: `
                                    <h1>${record.fields.facilityname}</h1>
                                    <p>Available: ${record.fields.freeplaces}</p>
                                    <p>Occupied: ${record.fields.occupiedplaces}</p>
                                    <p>Total places: ${record.fields.totalplaces}</p>
                                `
                            },
                            geometry: record.geometry
                        }
                    });

                    return mapBoxGeoJSON;
                }),
                catchError((error) => {
                    console.error('getOccupiedBikeSpaces', error);
                    return of();
                })
            );
    }
}
