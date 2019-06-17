import React, { Component } from 'react';

const initMap = (isochrones, midpt) => {
  let map = new google.maps.Map(document.getElementById('vennMap'), {
    defaultZoom: 7,
    center: midpt
  });
  let polyAPaths = isochrones[0];
  // To close a GMaps polygon: first point in array must equal last point
  polyAPaths.push(polyAPaths[0]);
  let polyA = new google.maps.Polygon({
    paths: polyAPaths,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });
  polyA.setMap(map);
};

const VennMap = (props) => {
  setTimeout(() => {
    initMap(props.isochrones, props.midpt);
  }, 500);
  return (
    <figure className="vennMap" id="vennMap"></figure>
  );
};

export default VennMap;
