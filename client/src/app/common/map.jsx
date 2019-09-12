import React, { Component } from 'react'
import { soloStyle } from '../config/soloStyle'
import { CloseWindow } from '../common/buttons'
//import GMapsApiKey from '../../clientEnv.js'
const GMapsApiKey = 'TEMP_GET_FROM_GMAPS'

class Map extends Component {

    componentDidMount() {
        this.renderMap()
    }

    componentWillUnmount() {
        const mp = window.document.getElementById('map')
        mp.parentElement.removeChild(mp)
        const mps = window.document.getElementById('mapScript')
        mps.parentElement.removeChild(mps)
        window.google = {}
    }

    renderMap = () => {
        loadScript(GMapsApiKey)
        window.initMap = this.initMap
    }

    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: -19.917299, lng: -43.934559 },
            zoom: 10,
            mapTypeId: 'hybrid',
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
            }
        })
        const { polygon } = this.props

        // Construct the polygon.
        var renderPolygon = new window.google.maps.Polygon({
            paths: polygon,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        renderPolygon.setMap(map);
        const bounds = new window.google.maps.LatLngBounds();


        renderPolygon.getPaths().forEach(function (path) {
            path.forEach(function (latlng) {
                bounds.extend(latlng);
                map.fitBounds(bounds);
            });
        });
    }



    //console.log(parseCoords('5d1e4aa7d3473720847685ed'))
    //5d1e4aa7d3473720847685ed
    //5cfa47db2f1b100c34d6c547
    // limBH -> "5d1facb97b66702b945be1b6"

    render() {

        return (
            <div style={soloStyle(true, ['15%', '70%'], 'hidden')}>
                <CloseWindow close={this.props.close} />
                <div id='map'></div>
            </div>
        )

    }
}

function loadScript(url) {
    var script = window.document.createElement("script")
    var index = window.document.getElementsByTagName("script")[0]
    script.async = true
    script.defer = true
    script.src = url
    script.id = 'mapScript'
    index.parentNode.insertBefore(script, index)
}

export default Map