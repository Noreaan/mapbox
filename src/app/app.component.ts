import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { GentApiService } from 'src/app/_services/gent-api.service';
import { MapBoxGeoJSON } from './_models/mapbox/geoJSON.model';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeoJSONSource } from 'mapbox-gl';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/streets-v11';
    lat = 51.0543;
    lng = 3.7174;
    layerId = 'occupiedBikeSpace';

    occupiedBikeSpaces$: Observable<MapBoxGeoJSON>;

    constructor(
        private gentApiService: GentApiService
    ) { }

    ngOnInit() {
        this.initMapBox();
    }

    initMapBox() {
        this.map = new mapboxgl.Map({
            accessToken: environment.mapbox.accessToken,
            container: 'map',
            style: this.style,
            zoom: 13,
            center: [this.lng, this.lat]
        });

        this.map.addControl(new mapboxgl.NavigationControl());

        this.getOccupiedBikeSpaces();
    }

    getOccupiedBikeSpaces() {
        this.occupiedBikeSpaces$ = timer(0, 60 * 1000).pipe(
            switchMap(() => this.gentApiService.getOccupiedBikeSpaces())
        ).pipe(
            tap((response: MapBoxGeoJSON) => {
                if (response) {
                    let geoJSONFeatureCollection = <GeoJSON.FeatureCollection>response;

                    if (this.getSource(this.layerId)) {
                        this.updateSource(this.layerId, geoJSONFeatureCollection)
                    } else {
                        this.addSource(this.layerId, geoJSONFeatureCollection);

                        this.addLayer(this.layerId, this.layerId);

                        this.addClickEvents();
                    }
                }
            })
        );
    }

    addSource(id: string, data: GeoJSON.FeatureCollection) {
        this.map.addSource(id, {
            type: 'geojson',
            data: <GeoJSON.FeatureCollection>data
        });
    }

    updateSource(id: string, data: GeoJSON.FeatureCollection) {
        this.getSource(id).setData(data);
    }

    getSource(id: string): GeoJSONSource {
        return this.map.getSource(id) as GeoJSONSource;
    }

    addLayer(id: string, source: string) {
        this.map.addLayer({
            'id': `${id}`,
            'type': 'circle',
            'source': `${source}`,
            'paint': {
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-color': 'red',
                'circle-stroke-color': 'white'
            }
        });
    }

    addClickEvents() {
        this.map.on('click', 'occupiedBikeSpace', (e) => {
            var coordinates = e.lngLat;
            var description = e.features[0].properties?.description;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(this.map);
        });

        this.map.on('mouseenter', 'occupiedBikeSpace', () => {
            this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', 'occupiedBikeSpace', () => {
            this.map.getCanvas().style.cursor = '';
        });
    }
}
