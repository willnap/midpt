generateIsochronesSHITTYwithGOOGLE = (req, res, next) => {
  // console.log('res locals', res.locals);
  isochrone.load({
    map: 'theMap',
    key: process.env.GAPI_KEY, // Do change the key: it won't work on your domain anyway :-)
    callback: function(iso) {
      //placeholder
    },
    debug: true
  });
  let friendIsochrones = [];
  async function tryIntersection(time) {
    let curIntersection = null;
    let timeToTry = time;
    while (!curIntersection) {
      timeToTry = timeToTry * 1.2;
      console.log(
        'trying isochrome intersection with a fairTime of ',
        timeToTry / 60
      );
      friendIsochrones = [];
      for (let i = 0; i < 2; i++) {
        friendIsochrones.push(
          await new Promise((resolve, reject) => {
            isochrone.compute({
              lat: res.locals.points[i].lat,
              lng: res.locals.points[i].lng,
              cycles: 5,
              slices: 100,
              type: 'duration',
              value: timeToTry,
              mode: 'driving',
              key: process.env.GAPI_KEY,
              callback: function(status, points) {
                if (status === 'OK') {
                  const curIsochrone = [];
                  for (let pt of points) {
                    curIsochrone.push([pt.lat, pt.lng]);
                  }
                  curIsochrone.push(curIsochrone[0]);
                  resolve(turf.polygon([curIsochrone]));
                }
              }
            });
          })
        );
      }
      curIntersection = turf.intersect(
        friendIsochrones[0],
        friendIsochrones[1]
      );
      // timeToTry = timeToTry * 1.2;
    }
    res.locals.isochrones = [];
    for (let i = 0; i < 2; i += 1) {
      res.locals.isochrones.push(
        friendIsochrones[i].geometry.coordinates[0].map(point => {
          return { lat: point[0], lng: point[1] };
        })
      );
    }
    console.log(curIntersection);
    let coords = curIntersection.geometry.coordinates;
    if (curIntersection.geometry.type === 'Polygon') {
      res.locals.isoIntersectionPoints = coords[0].map(el => {
        return { lat: el[0], lng: el[1] };
      });
    } else {
      console.log('its a muli', coords[0]);
      res.locals.isoIntersectionPoints = coords.map(el => {
        return { lat: el[0], lng: el[1] };
      });
    }
    // console.log('intersection found!!!!', res.locals.isoIntersectionPoints);
    next();
  }
  tryIntersection(res.locals.fairTime);
};
